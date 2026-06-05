import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react"; // effect = run code when something changes/page loads, state = create & store state (variables)
import { Col, Container, Row } from "react-bootstrap";

import { searchBooks } from "../../api/bigBookApi";                                    // our API function that fetches books from the Big Book API
import { useBookFilters } from "../../hooks/useBookFilters";                           // our hook that stores each filter state
import { starsToRating } from "../../utils/starsToRating";                             // helper function: converts stars (1-5) to API rating (0-1)
import { useAvailableAuthors } from "../../hooks/useAvailableAuthors";                 // fetching and storing Api Authors
import { useDebounce } from "../../hooks/useDebounce";                                 // adds a delay to the api requests (for filter requests)
import FilterSidebar from "../../components/filters/FilterSidebar/FilterSidebar";      // the filter sidebar component
import type { ApiBook } from "../../types/ApiBook";                                    // our typescript type (books fetched from the api)
import type { SearchBookParams } from "../../types/SearchBook";                        // typescript type (book parameters)
import { bookGenres } from "../../types/BookGenres";
import BookGallery from "../../components/books/BookGallery/BookGallery";

import "./HomePage.css";


/**
 * Component for displaying the homepage (endpoint: "/") with a search bar and book gallery.
 * The homepage allows users to search for books using a search bar and apply various filters such as author, genre, rating, and publish year. 
 * It fetches book data from the Big Book API based on the search query and selected filters, and displays the results in a gallery format. 
 * The component also handles loading states and error messages for a better user experience.
 * -> Header search bar uses the URL query parameter called "query".
 * -> Header search bar triggers search-books.
 * -> author filter search logic is NOT handled here!!!!!
 * -> handled inside useAvailableAuthors and uses search-authors only.
 * -> selected checkboxes here are sent as filters to search-books.
 * 
 * @returns The homepage component.
 */
const HomePage = () => {
    const [searchParams] = useSearchParams();                   // reads query from url ie. /?query=harry
    const query = searchParams.get("query")?.trim() ?? "";      // header search value, if string is empty -> no request sent
      
    const [books, setBooks] = useState<ApiBook[]>([]);          // books returned from the search-books endpoint
    const [loadingBooks, setLoadingBooks] = useState(false);    // loading message for user while books are being fetched
    const [bookError, setBookError] = useState("");             // error message for user if no books are found or API fails

    // =========== DESTRUCTURED VALUES/FUNCTIONS FROM THE HOOK useBookFilters =============
    // ============================= aka: book filter states  =============================   
    // this is where we get the current values of the filters and the functions to update them.
    const {                              
        // currently selected filters:                           
        selectedAuthors,
        selectedGenres,
        selectedRating, 
        selectedEarliestPublishYear,
        selectedLatestPublishYear,

        // setter functions to update values
        setSelectedRating,
        setEarliestPublishYear,
        setLatestPublishYear,

        // toggle checkbox functions to update values
        toggleAuthor,
        toggleGenre,

        // reset all filters
        clearFilters,

    } = useBookFilters();
    
    // ========= DESTRUCTURED VALUES/FUNCTIONS FROM THE HOOK useAvailableAuthors ==========  
    // ====================== aka: author search for filter sidebar =======================
    // this is where we get the current values of the author search and the functions to update them, 
    // as well as the list of available authors for the filter sidebar.
    const {
        authorSearch,
        setAuthorSearch,
        availableAuthors,
        loadAuthors,
        authorError,
        hasMoreAuthors,
        handleAuthorScroll,
    } = useAvailableAuthors();

    // These are hardcoded genres, the API endpoint does not return genres, only the single-book endpoint does.
    // We could fetch the genres from the single-book endpoint, but that would require an API request for each book which is not efficient. 
    const availableGenres = bookGenres;

    /**
     * This useMemo builds the search parameters object for the searchBooks API call based on the current filter states.
     * It conditionally includes only the active filters in the object, ensuring that empty or default filters are not sent to the API.
     * -> does NOT include the authorSearch (this only includes authors added as filters)
     * 
     * The useMemo hook optimizes performance by memoizing the object, preventing unnecessary re-renders and API calls when the filter states have not changed.
     * -> only rebuilds the object if one of the dependencies changes, { query: "harry" } !== { query: "harry" } because these are 2 different 
     *    object instances in memory. 
     *      -> this causes React to create a new object every render thus triggering the useEffect() => which creates unnecessary API requests.
     * -> useMemo<SearchBookParams> is a typeScript generic that tells the TS object: "The object returned from useMemo must match the SearchBookParams 
     *    interface."
     *      -> gives: autocomplete, type and error checking so that "sort: "wrongValue"" immediately shows a TS error.
     */
    const bookSearchParams = useMemo<SearchBookParams>(() => ({
        ...(query ? { query: query} : {}),                        // if query exists, send it, else don't
        ...(selectedAuthors.length > 0 ? { authors: selectedAuthors } : {}),      // selected authors array
        ...(selectedGenres.length > 0 ? { genres: selectedGenres } : {}),         // selected genres array
        ...(selectedRating ? { minRating: starsToRating(selectedRating) } : {}),  // if rating, convert to API rating, else send undefined. 
        ...(selectedEarliestPublishYear !== undefined 
            ? { earliestPublishYear: selectedEarliestPublishYear }  
            : {}),      
        ...(selectedLatestPublishYear !== undefined 
            ? { latestPublishYear: selectedLatestPublishYear }  
            : {}),                                                                  // selected latest publish year

        number: 100,                                                                // pagination: show 100 books at a time
        offset: 0,                                                                  // pagination: start from first result

    }),[        // <- dependencies start here: if any of these values change, re-run useEffect
        query,
        selectedAuthors,
        selectedGenres,
        selectedRating,
        selectedEarliestPublishYear,
        selectedLatestPublishYear,
    ]);

    // add the Debounce to the entire BookSearchParams object, this avoids multiple timers, multiple renders and cascading updates.
    const debouncedBookSearchParams = useDebounce(bookSearchParams, 500);

    // ============ useEffect: RUNS THE COMPONENT WHEN: ============ 
    // -> a component loads for the first time (npm run dev)
    // -> whenever one of the dependencies changes (states)
    // ============================================================= 
    useEffect(() => {
        const controller = new AbortController();

        // ==== loadBooks: BECAUSE USEEFFECT CANNOT BE ASYNCHRONOUS ====
        // fetches books from search-books & awaits a response
        /* runs when:
            -> Header search query changes
            -> Author checkbox changes
            -> Genre checkbox changes
            -> Rating filter changes
            -> Publish year filter changes */
        // ===============================================================
        const loadBooks = async () => {        
            setLoadingBooks(true);
            setBookError("");

            try {
                console.log("HomePage -> search-book params sent: ", bookSearchParams);

                const result = await searchBooks(debouncedBookSearchParams, controller.signal);
                
                // API returns nested arrays (TS type of ApiBook): [ [book], [book], ... ]
                // flat() converts them into: [book, book, ... ] 
                const flattenedBooks: ApiBook[] = result.books.flat();

                setBooks(flattenedBooks);

                if (flattenedBooks.length === 0) {
                    setBookError("No books found for this search or the selected filters.");
                }

                console.log("HomePage -> flattened books returned: ", flattenedBooks);

            } catch (error) {
                console.log("HomePage -> could not load books: ", error);

                if (error instanceof DOMException && error.name === "AbortError") {
                    return;
                }

                setBooks([]);
                setBookError("Couldn't load books, please change your filters or search.");

            } finally {
                setLoadingBooks(false);
            }
        };

        loadBooks();                                                                    // call the async fucntion

        return () => {
            controller.abort();
        };

    }, [debouncedBookSearchParams]); 


    return(
        <Container fluid className="home-page">
            <Row>
                <Col>
                    
                    <FilterSidebar
                        loadingBooks = {loadingBooks}
                        bookError = {bookError}
                        booksCount = {books.length}

                        availableAuthors = {availableAuthors}
                        availableGenres = {availableGenres}

                        authorSearch = {authorSearch}
                        setAuthorSearch = {setAuthorSearch}
                        authorError = {authorError}
                        loadAuthors = {loadAuthors}
                        hasMoreAuthors = {hasMoreAuthors}
                        handleAuthorScroll = {handleAuthorScroll}

                        selectedAuthors = {selectedAuthors}
                        selectedGenres = {selectedGenres}
                        selectedRating = {selectedRating}
                        selectedEarliestPublishYear = {selectedEarliestPublishYear}
                        selectedLatestPublishYear = {selectedLatestPublishYear}

                        toggleAuthor = {toggleAuthor}
                        toggleGenre = {toggleGenre}

                        setSelectedRating = {setSelectedRating}
                        setEarliestPublishYear = {setEarliestPublishYear}
                        setLatestPublishYear = {setLatestPublishYear}

                        clearFilters = {clearFilters}
                    />
                </Col>

                <Col xs = {12} md = {10}>
                    <div className="home-page__gallery">
                        <BookGallery books={books} />
                    </div>
                </Col>
                
            </Row>
        </Container>
    );
};

export default HomePage;

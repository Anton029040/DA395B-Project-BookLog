// This is the page connected to the endpoint "/"
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react"; // effect = run code when something changes/page loads, state = create & store state (variables)
import { Col, Container, Row } from "react-bootstrap";

// filter sidebar imports:
import { searchBooks } from "../api/bigBookApi";                                    // our API function that fetches books from the Big Book API
import type { ApiBook } from "../types/ApiBook";                                    // our typescript type (books fetched from the api)
import { useBookFilters } from "../hooks/useBookFilters";                           // our hook that stores each filter state
import FilterSidebar from "../components/filters/FilterSidebar/FilterSidebar";      // the filter sidebar component
import { starsToRating } from "../utils/starsToRating";                             // helper function: converts stars (1-5) to API rating (0-1)
import { useAvailableAuthors } from "../hooks/useAvailableAuthors";                 // fetching and storing Api Authors
import { useDebounce } from "../hooks/useDebounce";                                 // adds a delay to the api requests (for filter requests)
import BookGallery from "../components/books/BookGallery";


// This is the page connected to the endpoint "/"
const HomePage = () => {
    /* ====================================================================================================================
        SEARCH BAR: USER INPUT FILED FOUND IN THE HEADER
       ==================================================================================================================== */
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query") || "";

    /* ==================================================================================================================== 
        SIDEBAR FILTER: THE USERS SELECTED FILTERS FOUND IN THE BODY 
       ==================================================================================================================== */
    const [books, setBooks] = useState<ApiBook[]>([]);          // book state returned from API (array of ApiBook objects)
    const {                                                     // destructured values/functions from the hook
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
    
    const {
        availableAuthors,
        loadAuthors,
        authorSearch,
        setAuthorSearch,
    } = useAvailableAuthors({ selectedAuthors, });

    // setting up the delays for the API requests for the user added filters
    const debouncedQuery = useDebounce(query);
    const debouncedAuthors = useDebounce(selectedAuthors);
    const debouncedGenres = useDebounce(selectedGenres);
    const debouncedRating = useDebounce(selectedRating);
    const debouncedEarliestPublishYear = useDebounce(selectedEarliestPublishYear);
    const debouncedLatestPublishYear = useDebounce(selectedLatestPublishYear);

    // These are hardcoded genres, the API endpoint does not return genres, only the single-book endpoint does. 
    const availableGenres = [
        "adventure",
        "art",
        "biography",
        "business",
        "children",
        "comedy",
        "crime",
        "drama",
        "economics",
        "fantasy",
        "historical fiction",
        "history",
        "horror",
        "memoir",
        "mystery",
        "music",
        "nonfiction",
        "philosophy",
        "poetry",
        "politics",
        "programming",
        "psychology",
        "religion",
        "romance",
        "science",
        "science fiction",
        "self-help",
        "technology",
        "thriller",
        "young adult",
    ];

    /* ==================================================================== 
                            useEffect() : React Hook
        runs: when a compnent first loads & whenever a dependency changes
       ==================================================================== */   
    /* Responsible for:
        - fetching books from the API
        - re-fetching whenever the user: 
            -> types in the search field
            -> changes the filters (filterSidebar) */
    useEffect(() => {
        const loadBooks = async () => {        // async for API request and awaiting a response (useEffect cannot be made async hence this)

            /* call API function and await response, this sends: 
                - search query
                - selected filters
                - sorting (TODO)
                - pagination */
            const result = await searchBooks({
                query: debouncedQuery,                                                    // the user input in the (header) searchbar
                authors: debouncedAuthors.length > 0 ? debouncedAuthors : undefined,      // selected authors array
                genres: debouncedGenres.length > 0 ? debouncedGenres : undefined,         // selected genres array
                minRating: debouncedRating ? starsToRating(debouncedRating) : undefined,  // if rating, convert to API rating, else send undefined. 
                earliestPublishYear: debouncedEarliestPublishYear,                        // selected earliest publish year
                latestPublishYear: debouncedLatestPublishYear,                            // selected latest publish year

                sort: "rating",
                sortDirection: "DESC",

                number: 100,                                                            // pagination: show 10 books at a time
                offset: 0,                                                              // pagination: start from first result
            });

            /* API returns nested arrays (which we have set as a typescript type of ApiBook): 
                - books: [ [book], [book], [book], ... ]

                We need to merge them into one array, hence: flat():
                - books: [book, book, book, ..... ] */
            const flattenedBooks: ApiBook[] = result.books.flat();
            setBooks(flattenedBooks);                                                   // update state, re-render component, updates UI

            console.log("selected Genres:", debouncedGenres);                            // <- TESTING: REMOVE LATER
        };  

        loadBooks();                                                                    // call the async fucntion

    }, [    // <- dependencies start here: if any of these values change, re-run useEffect
        debouncedQuery,
        debouncedAuthors,
        debouncedGenres,
        debouncedRating,
        debouncedEarliestPublishYear,
        debouncedLatestPublishYear,
    ]); 

    return(
        <Container fluid>
            <Row className="g-4">
                <Col xs={12} md={3}>
                    <FilterSidebar
                        availableAuthors = {availableAuthors}
                        availableGenres = {availableGenres}
                        authorSearch = {authorSearch}
                        setAuthorSearch = {setAuthorSearch}
                        loadAuthors = {loadAuthors}
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

                <Col xs={12} md={9}>
                    <BookGallery books={books} />
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;

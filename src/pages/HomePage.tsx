import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react"; // effect = run code when something changes/page loads, state = create & store state (variables)
import { Col, Container, Row } from "react-bootstrap";

// filter sidebar imports:
import { searchBooks } from "../api/bigBookApi";                                    // our API function that fetches books from the Big Book API
import { useBookFilters } from "../hooks/useBookFilters";                           // our hook that stores each filter state
import { starsToRating } from "../utils/starsToRating";                             // helper function: converts stars (1-5) to API rating (0-1)
import { useAvailableAuthors } from "../hooks/useAvailableAuthors";                 // fetching and storing Api Authors
import { useDebounce } from "../hooks/useDebounce";                                 // adds a delay to the api requests (for filter requests)
import BookCard from "../components/books/BookCard/BookCard";   //TEST ONLY, REMOVE WHEN REAL API DATA IS PASSED INTO BookCard
import FilterSidebar from "../components/filters/FilterSidebar/FilterSidebar";      // the filter sidebar component
import type { ApiBook } from "../types/ApiBook";                                    // our typescript type (books fetched from the api)
import type { SearchBookParams } from "../types/SearchBook";                        // typescript type (book parameters)


// ============================ PAGE: HOMEPAGE  ============================ 
// -> controls all components and elements on the homepage endpoint: "/"
// -> Header search bar uses the URL query parameter called "query".
// -> Header search bar triggers search-books.
// -> author filter search logic is NOT handled here!!!!!
//      -> handled inside useAvailableAuthors and uses search-authors only.
// -> selected checkboxes here are sent as filters to search-books.
// =========================================================================
const HomePage = () => {
    const navigate = useNavigate();
  
    // ================= SEARCH BAR: USER INPUT FILED FOUND IN THE HEADER =================
    const [searchParams] = useSearchParams();                   // reads query from url ie. /?query=harry
    const query = searchParams.get("query")?.trim() ?? "";      // header search value, if string is empty -> no request sent

    // =============================== BOOK RESULT STATES =================================        
    const [books, setBooks] = useState<ApiBook[]>([]);          // books returned from the search-books endpoint
    const [loadingBooks, setLoadingBooks] = useState(false);    // loading message for user while books are being fetched
    const [bookError, setBookError] = useState("");             // error message for user if no books are found or API fails

    // =========== DESTRUCTURED VALUES/FUNCTIONS FROM THE HOOK useBookFilters =============
    // ============================= aka: book filter states  =============================   
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
    const {
        authorSearch,
        setAuthorSearch,
        availableAuthors,
        loadAuthors,
        authorError,
        hasMoreAuthors,
        handleAuthorScroll,
    } = useAvailableAuthors();

    // ======== DELAY FOR BOOK-SEARCH (REDUCES API REQUESTS ON USER INPUT(state) CHANGES) ========  
    const debouncedQuery = useDebounce(query, 300);
    const debouncedAuthors = useDebounce(selectedAuthors, 300);
    const debouncedGenres = useDebounce(selectedGenres, 300);
    const debouncedRating = useDebounce(selectedRating, 300);
    const debouncedEarliestPublishYear = useDebounce(selectedEarliestPublishYear, 300);
    const debouncedLatestPublishYear = useDebounce(selectedLatestPublishYear, 300);

    // ======================= HARDCODED GENRES FOR THE FILTER SIDEBAR =======================  
    // ============ the API endpoint does not provide an end-point to fetch these ============
    const availableGenres = [
        "action",
        "adventure",
        "anthropology",
        "astronomy",
        "archaeology",
        "architecture",
        "art",
        "aviation",
        "biography",
        "biology",
        "business",
        "chemistry",
        "children",
        "classics",
        "contemporary",
        "cookbook",
        "crafts",
        "crime",
        "dystopia",
        "economics",
        "education",
        "engineering",
        "environment",
        "erotica",
        "essay",
        "fairy_tales",
        "fantasy",
        "fashion",
        "feminism",
        "fiction",
        "finance",
        "folklore",
        "food",
        "gaming",
        "gardening",
        "geography",
        "geology",
        "graphic_novel",
        "health",
        "historical",
        "historical_fiction",
        "history",
        "horror",
        "how_to",
        "humor",
        "inspirational",
        "journalism",
        "law",
        "literary_fiction",
        "literature",
        "magical_realism",
        "manga",
        "martial_arts",
        "mathematics",
        "medicine",
        "medieval",
        "memoir",
        "mystery",
        "mythology",
        "nature",
        "nonfiction",
        "novel",
        "occult",
        "paranormal",
        "parenting",
        "philosophy",
        "physics",
        "picture_book",
        "poetry",
        "politics",
        "programming",
        "psychology",
        "reference",
        "relationships",
        "religion",
        "romance",
        "science_and_technology",
        "science_fiction",
        "self_help",
        "short_stories",
        "society",
        "sociology",
        "space",
        "spirituality",
        "sports",
        "text_book",
        "thriller",
        "travel",
        "true_crime",
        "war",
        "writing",
        "young_adult",
    ];

    // ============ BUILDING THE SEARCH-BOOKS PARAMS (OBJECT THAT GETS SENT TO API ============  
    //  this is what decides which filters get sent to searchBooks(), without it we would 
    //  always send EVERY filter.
    //      -> only active values are added (filled check boxes and user input)
    //      -> empty filters are NOT sent
    //      -> does NOT include the authorSearch (this only includes authors added as filters)
    /*  -> useMemo only rebuilds the object if one of the dependencies changes, 
            -> JS Objectes are compared by reference, not by content which means that 
            { query: "harry" } !== { query: "harry" } because these are 2 different 
            object instances in memory. 
                -> this causes React to create a new object every render thus triggering 
                the useEffect() =>) which creates unnecessary API requests.

            -> useMemo<SearchBookParams> is a typeScript generic that tells the TS object: 
                "The object returned from useMemo must match the SearchBookParams interface."
                -> gives: autocomplete, type and error checking so that 
                "sort: "wrongValue"" immediately shows a TS error. */
    // ================================== !! !! !! =============================================
    const bookSearchParams = useMemo<SearchBookParams>(() => ({
        ...(debouncedQuery ? { query: debouncedQuery} : {}),                        // if query exists, send it, else don't
        ...(debouncedAuthors.length > 0 ? { authors: debouncedAuthors } : {}),      // selected authors array
        ...(debouncedGenres.length > 0 ? { genres: debouncedGenres } : {}),         // selected genres array
        ...(debouncedRating ? { minRating: starsToRating(debouncedRating) } : {}),  // if rating, convert to API rating, else send undefined. 
        ...(debouncedEarliestPublishYear !== undefined 
            ? { earliestPublishYear: debouncedEarliestPublishYear }  
            : {}),      
        ...(debouncedLatestPublishYear !== undefined 
            ? { latestPublishYear: debouncedLatestPublishYear }  
            : {}),                                                                  // selected latest publish year

        number: 100,                                                                // pagination: show 10 books at a time
        offset: 0,                                                                  // pagination: start from first result

    }),[        // <- dependencies start here: if any of these values change, re-run useEffect
        debouncedQuery,
        debouncedAuthors,
        debouncedGenres,
        debouncedRating,
        debouncedEarliestPublishYear,
        debouncedLatestPublishYear,
    ]);

    // ============ useEffect: RUNS THE COMPONENT WHEN: ============ 
    // -> a component loads for the first time (npm run dev)
    // -> whenever one of the dependencies changes (states)
    // ============================================================= 
    useEffect(() => {
        let ignoreOldRequest = false;

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

                const result = await searchBooks(bookSearchParams);
                
                // API returns nested arrays (TS type of ApiBook): [ [book], [book], ... ]
                // flat() converts them into: [book, book, ... ] 
                const flattenedBooks: ApiBook[] = result.books.flat();

                if (!ignoreOldRequest) {
                    setBooks(flattenedBooks);

                    if (flattenedBooks.length === 0) {
                        setBookError("No books found for this search or the selected filters.");
                    }
                }

                console.log("HomePage -> flattened books returned: ", flattenedBooks);

            } catch (error) {
                console.log("HomePage -> could not load books: ", error);

                if (!ignoreOldRequest) {
                    setBooks([]);
                    setBookError("Couldn't load books, please change your filters or search.");
                }

            } finally {
                if (!ignoreOldRequest) {
                    setLoadingBooks(false);
                }
            }
        };

        loadBooks();                                                                    // call the async fucntion

        return () => {
            ignoreOldRequest = true;
        };

    }, [bookSearchParams]); 

    return(
        <Container fluid>
            <Col xs = "auto" md = {3}>
                <FilterSidebar
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
                <BookCard /> {/* ONLY FOR TESTING PURPOSES, REMOVE WHEN REAL API DATA IS PASSED INTO BookCard */}
            </Col>

            <Col>
                {loadingBooks && <p>Loading books...</p>}
                {!loadingBooks && bookError && (<p role = "alert">{bookError}</p>)}
                {!loadingBooks && !bookError && (<p>{books.length} books found.</p>)}
            </Col>
        </Container>
    );
};

export default HomePage;
// This is the page connected to the endpoint "/"
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react"; // effect = run code when something changes/page loads, state = create & store state (variables)
import { Col, Container, Row } from "react-bootstrap";

// filter sidebar imports:
import { searchBooks } from "../api/bigBookApi";                                    // our API function that fetches books from the Big Book API
import { useBookFilters } from "../hooks/useBookFilters";                           // our hook that stores each filter state
import { starsToRating } from "../utils/starsToRating";                             // helper function: converts stars (1-5) to API rating (0-1)
import { useAvailableAuthors } from "../hooks/useAvailableAuthors";                 // fetching and storing Api Authors
import { useDebounce } from "../hooks/useDebounce";                                 // adds a delay to the api requests (for filter requests)
import FilterSidebar from "../components/filters/FilterSidebar/FilterSidebar";      // the filter sidebar component
import type { ApiBook } from "../types/ApiBook";                                    // our typescript type (books fetched from the api)
import type { SearchBookParams } from "../types/SearchBook";                        // typescript type (book parameters)


// This is the page connected to the endpoint "/"
const HomePage = () => {
    const navigate = useNavigate();
  
    // ================= SEARCH BAR: USER INPUT FILED FOUND IN THE HEADER =================
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query")?.trim() ?? "";

    // ================= SIDEBAR FILTER: THE USERS SELECTED FILTERS FOUND IN THE BODY  =================        
    const [books, setBooks] = useState<ApiBook[]>([]);          // book state returned from API (array of ApiBook objects)
    const [loadingBooks, setLoadingBooks] = useState(false);    // state: are we loading books
    const [bookError, setBookError] = useState("");             // error message setup for GUI

    // ================= DESTRUCTURED VALUES/FUNCTIONS FROM THE HOOK useBookFilters  =================  
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
    
    // ================= DESTRUCTURED VALUES/FUNCTIONS FROM THE HOOK useAvailableAuthors  =================  
    const {
        availableAuthors,
        loadAuthors,
        authorSearch,
        authoError,
        setAuthorSearch,
    } = useAvailableAuthors();

    // ================= DELAYS FOR API REQUESTS (REDUCES API REQUESTS ON USER INPUT CHANGES)  =================  
    const debouncedQuery = useDebounce(query, 300);
    const debouncedAuthors = useDebounce(selectedAuthors, 300);
    const debouncedGenres = useDebounce(selectedGenres, 300);
    const debouncedRating = useDebounce(selectedRating, 300);
    const debouncedEarliestPublishYear = useDebounce(selectedEarliestPublishYear, 300);
    const debouncedLatestPublishYear = useDebounce(selectedLatestPublishYear, 300);

    // hardcoded genres for filter sidebar, the API endpoint does not provide an end-point to fetch these
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

    // ================= IMPORTANT! BUILDING THE OBJECT THAT GETS SENT TO THE API  =================  
    //  this is what decides which filters get sent, without it we would always send EVERY filter.
    /*  -> useMemo only rebuilds the object if one of the dependencies changes, 
        ******* Note: JS Objectes are compared by reference, not by content *******
        which means that { query: "harry" } !== { query: "harry" } because these are 2 different 
        object instances in memory. So React would create a new object every render (triggering the 
        useEffect() =>) which creates unnecessary API requests. 
        useMemo<SearchBookParams> is a typeScript generic that tells the TS object: "The object 
        returned from useMemo must match the SearchBookParams interface."
        -> gives: autocomplete, type and error checking so that "sort: "wrongValue"" immediately 
        shows a TS error. */
    // ================================== !! !! !! =================================================
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


    // ================= useEffect (REACT Hook): RUNS THE COMPONENT WHEN:  =================  
    // =================      1. A COMPONENT LOADS FOR THE FIRST TIME      ================= 
    // =================      2. WHENEVER A DEPENDENCY CHANGES             ================= 
    useEffect(() => {
        let ignoreOldRequest = false;

        const loadBooks = async () => {        // async for API request and awaiting a response (useEffect cannot be made async hence this)
            setLoadingBooks(true);
            setBookError("");

            try {
                console.log("HomePage -> search-book params sent: ", bookSearchParams);

                const result = await searchBooks(bookSearchParams);
                
                /* API returns nested arrays (which we set as a TS type of ApiBook): 
                - books: [ [book], [book], [book], ... ]

                We need to merge them into one array, hence: flat():
                - books: [book, book, book, ..... ] */
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
                    authorError = {authoError}
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

            <Col>
                {loadingBooks && <p>Loading books...</p>}
                {!loadingBooks && bookError && <p role="alert">{bookError}</p>}
                {!loadingBooks && !bookError && <p>{books.length} books found.</p>}
            </Col>
        </Container>
    );
};

export default HomePage;
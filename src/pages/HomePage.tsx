import { useEffect, useState } from "react"; // effect = run code when something changes/page loads, state = create & store state (variables)
import { useSearchParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";

// filter sidebar imports:
import { searchBooks } from "../api/bigBookApi";                    // our API function that fetches books from the Big Book API
import type { ApiBook } from "../types/ApiBook";                    // our typescript type (books fetched from the api)
import { useBookFilters } from "../hooks/useBookFilters";           // our hook that stores each filter state
import FilterSidebar from "../components/filters/FilterSidebar";    // the filter sidebar component
import { starsToRating } from "../utils/starsToRating";             // helper function: converts stars (1-5) to API rating (0-1)


// This is the page connected to the endpoint "/"
const HomePage = () => {
    /* ======================================================
                    Search bar (user input)
       ====================================================== */
    const [searchParams] = useSearchParams();
    const query = searchParams.get("search" || "books");

    /* ====================================================== 
                        Filter sidebar 
       ====================================================== */
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

    /* create a list of unique author names
        1. loops through all books
        2. get all author names
        3. "flatten" into one big array
        4. remove duplicates using "Set" 
        
        flatMap(): loops & flattens in the same step. */
   const availableAuthors = [
        ...new Set(
            books.flatMap(
                (book) => 
                    book.authors?.map(
                        (author) => author.name
                    ) ?? []
            )
        ),
    ];
    console.log(books);
    console.log(availableAuthors);

    /* These are temporary hardcoded genres, the API endpoint does not return genres,
        only the single-book endpoint does. 
        TODO:
        - Add more genres (hard-coded) 
        - If time: fetch the genres seperately from the single-book endpoint */
    const availableGenres = [
        "fantasy",
        "romance",
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

        const fetchBooks = async () => {        // async for API request and awaiting a response (useEffect cannot be made async hence this)

            /* call API function and await response, this sends: 
                - search query
                - selected filters
                - sorting (TODO)
                - pagination */
            const result = await searchBooks({
                query: query,                                                           // the user input in the searchbar    
                authors: selectedAuthors.length > 0 ? selectedAuthors : undefined,      // selected authors array
                genres: selectedGenres.length > 0 ? selectedAuthors : undefined,        // selected genres array
                minRating: selectedRating ? starsToRating(selectedRating) : undefined,  // if rating, convert to API rating, else send undefined. 
                earliestPublishYear: selectedEarliestPublishYear,                       // selected earliest publish year
                latestPublishYear: selectedLatestPublishYear,                           // selected latest publish year

                // add sort stuff here

                number: 10,                                                             // pagination: show 10 books at a time
                offset: 0,                                                              // pagination: start from first result
            });

            console.log(result);

            /* API returns nested arrays: 
                - books: [ [book], [book], [book], ... ]

                We need to merge them into one array, hence: flat():
                - books: [book, book, book, ..... ] */
            const flattenedBooks = result.books.flat();
            setBooks(flattenedBooks);                                                   // update state, re-render component, updates UI
        };  

        fetchBooks();               // call the async fucntion

    }, [    // <- dependencies start here: if any of these values change, re-run useEffect
        query,
        selectedAuthors,
        selectedGenres,
        selectedRating,
        selectedEarliestPublishYear,
        selectedLatestPublishYear,
    ]); 

    return(
        <main>
            <p>You are in Home page</p>

            <Container>
                <Row>
                    <Col md={3}>
                        <FilterSidebar
                            availableAuthors = {availableAuthors}
                            availableGenres = {availableGenres}
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
                </Row>
            </Container>
            
        </main>
    );
};

export default HomePage;
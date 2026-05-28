// This is the page connected to the endpoint "/tbr"
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterSidebar from "../components/filters/FilterSidebar/FilterSidebar";
import { bookGenres } from "../types/BookGenres";
import { useAvailableAuthors } from "../hooks/useAvailableAuthors";
import { useBookFilters } from "../hooks/useBookFilters";
import { useDebounce } from "../hooks/useDebounce";
import BookCard, { getStoredBooks } from "../components/books/BookCard/BookCard";
import type { ApiBook, Author, Rating } from "../types/ApiBook";
import "./ReadPage.css";

// This is the page connected to the endpoint "/read"
const ReadPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const [ booksInTBR, setBooksInTBR ] = useState<ApiBook[]>([]);

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

    
        // setting up the delays for the API requests for the user added filters
    const debouncedQuery = useDebounce(query);
    const debouncedAuthors = useDebounce(selectedAuthors);
    const debouncedGenres = useDebounce(selectedGenres);
    const debouncedRating = useDebounce(selectedRating);
    const debouncedEarliestPublishYear = useDebounce(selectedEarliestPublishYear);
    const debouncedLatestPublishYear = useDebounce(selectedLatestPublishYear);

   
    const {
        availableAuthors,
        loadAuthors,
        authorSearch,
        setAuthorSearch,
    } = useAvailableAuthors({ selectedAuthors, });
    const availableGenres = bookGenres;

    useEffect(() => {
        if(query) {
            console.log(query);
            // todo Search for books that is in TBR list
            let savedBooks = getStoredBooks();
            const tbrBooks: ApiBook[] = [];

            for (let i = 0; i < savedBooks.length; i++) {
                if (savedBooks[i].status === "tbr" && savedBooks[i].title.toLocaleLowerCase().includes(query.toLocaleLowerCase())) {
                    const tbrBook: ApiBook = {
                        id: savedBooks[i].bookId,
                        image: savedBooks[i].image,
                        title: savedBooks[i].title,
                        rating: savedBooks[i].rating,
                        authors: savedBooks[i].authors,
                    };
                    tbrBooks.push(tbrBook);
                }
            }
            setBooksInTBR(tbrBooks);
        } else {
            let savedBooks = getStoredBooks();
            const tbrBooks: ApiBook[] = [];

            for (let i = 0; i < savedBooks.length; i++) {
                if (savedBooks[i].status === "tbr") {
                    const tbrBook: ApiBook = {
                        id: savedBooks[i].bookId,
                        image: savedBooks[i].image,
                        title: savedBooks[i].title,
                        rating: savedBooks[i].rating,
                        authors: savedBooks[i].authors,
                    };
                    tbrBooks.push(tbrBook);
                }
            }
            setBooksInTBR(tbrBooks);
        }
        

    }, [query]);


    return(
        <main>
            <h1>Read books</h1>
            <div className="filter-section">
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
            </div>
            <div className="book-card-section">
                {booksInTBR.map((book) => (
                    <BookCard 
                    key={book.id}
                    book={book}/> 
                ))}
            </div>
        </main>
    );
};

export default ReadPage;
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
import { getBookReviews } from "../hooks/useLocalStorage";
import type { BookReview } from "../types/BookReview";

// This is the page connected to the endpoint "/read"
const ReadPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const [ reviewedBooks, setReviewedBooks ] = useState<ApiBook[]>([]);

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
            let savedReviews = getBookReviews();
            const reviewes: ApiBook[] = [];

            for (let i = 0; i < savedReviews.length; i++) {
                if (savedReviews[i].book.title.toLocaleLowerCase().includes(query.toLocaleLowerCase())) {
                    const review: ApiBook = {
                        id: savedReviews[i].book.id,
                        image: savedReviews[i].book.image,
                        title: savedReviews[i].book.title,
                        rating: savedReviews[i].rating,
                        authors: savedReviews[i].book.authors,
                        description: savedReviews[i].book.description,
                        number_of_pages: savedReviews[i].book.number_of_pages,
                        publish_date: savedReviews[i].book.publish_date,
                    };
                    console.log("This it the rating");
                    console.log(savedReviews[i].book.rating);
                    reviewes.push(review);
                }
            }
            setReviewedBooks(reviewes);
        } else {
            let savedReviews = getBookReviews();
            const reviewes: ApiBook[] = [];

            for (let i = 0; i < savedReviews.length; i++) {

                const review: ApiBook = {
                    id: savedReviews[i].book.id,
                    image: savedReviews[i].book.image,
                    title: savedReviews[i].book.title,
                    rating: savedReviews[i].rating,
                    authors: savedReviews[i].book.authors,
                    description: savedReviews[i].book.description,
                    number_of_pages: savedReviews[i].book.number_of_pages,
                    publish_date: savedReviews[i].book.publish_date,
                };
                reviewes.push(review);
            }
            setReviewedBooks(reviewes);
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
                {reviewedBooks.map((book) => (
                    <BookCard 
                    key={book.id}
                    book={book}/> 
                ))}
            </div>
        </main>
    );
};

export default ReadPage;
// This is the page connected to the endpoint "/tbr"
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../components/books/BookCard/BookCard";
import type { ApiBook } from "../types/ApiBook";
import "./ReadPage.css";
import { getBookReviews } from "../hooks/useLocalStorage";

// This is the page connected to the endpoint "/read"
const ReadPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const [ reviewedBooks, setReviewedBooks ] = useState<ApiBook[]>([]);

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
                console.log(savedReviews[i].book.rating);

                const review: ApiBook = {
                    id: savedReviews[i].book.id,
                    image: savedReviews[i].book.image,
                    title: savedReviews[i].book.title,
                    rating: savedReviews[i].book.rating,
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
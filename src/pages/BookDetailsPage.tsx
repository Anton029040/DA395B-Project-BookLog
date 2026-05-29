import { useParams } from "react-router-dom";
import "./BookDetailsPage.css"
import ReviewForm from "../components/ui/ReviewForm/ReviewForm";
import ImageCarousel from "../components/ui/Carousel/ImageCarousel";
import { useEffect, useState } from "react";
import { searchBook, searchSimilarBooks } from "../api/bigBookApi";
import type { SimilarBook } from "../types/SimilarBook";
import type { BookReview } from "../types/BookReview";

// This is the page connected to the endpoint "/books/:bookId"
const BookDetailsPage = () => {
    const { bookId } = useParams();
    const [ similarBooks, setSimilarBooks ] = useState<SimilarBook[]>([]);
    const [ bookTitle, setBookTitle ] = useState("");
    const [ bookImageURL, setBookImageURL ] = useState("");
    const [ bookAuthors, setAuthors ] = useState([]);
    const [ bookRating, setBookRating ] = useState(0);
    const [ bookDescription, setBookDescription ] = useState(""); 
    const [ book, setBook ] = useState<BookReview>();

    useEffect(() => {
        if (bookId) {
            searchBook(bookId).then((result) => {
                // Old code. Kept in case it is used by Amer. Use BookReview object in future
                setBookTitle(result.title);
                setBookImageURL(result.image);
                setAuthors(result.authors);
                setBookRating(result.rating.average);
                
                const tempBook: BookReview = {
                    id: Number(bookId),
                    title: result.title,
                    authors: result.authors,
                    image: result.image,
                    rating: result.rating,
                    description: result.description,
                    number_of_pages: result.number_of_pages,
                    publish_date: result.publish_date,
                }
                setBook(tempBook);
            });
            
            searchSimilarBooks(bookId).then((result) => {
                console.log(result);
                const numberOfSimilarBooks = 5;
                const firstSimilarBooks = []
                for (let i = 0; i < numberOfSimilarBooks; i++) {
                    firstSimilarBooks.push(result.similar_books[i]);
                }
                setSimilarBooks(firstSimilarBooks);
            });
        }
    }, [bookId])

    return(
        <main>
            <p className = "book-card">
                Book ID : {bookId} 
                Book title : {bookTitle} 
                Book Image : {bookImageURL} 
                Book Authors : {bookAuthors.toString()} 
                Book Rating : {bookRating} 
            </p>
            <div className = "review-section">
                {book && <ReviewForm book={book} />}
            </div>
            <div className = "image-section"><ImageCarousel images={similarBooks}></ImageCarousel></div>
        </main>
    );
};

export default BookDetailsPage;
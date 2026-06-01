import { useParams } from "react-router-dom";
import "./BookDetailsPage.css"
import ReviewForm from "../components/ui/ReviewForm/ReviewForm";
import ImageCarousel from "../components/ui/Carousel/ImageCarousel";
import BookDetails from "../components/books/BookDetails/BookDetails";
import { useEffect, useState } from "react";
import { searchBook, searchSimilarBooks } from "../api/bigBookApi";
import type { SimilarBook } from "../types/SimilarBook";
import type { BookReview } from "../types/BookReview";

// This is the page connected to the endpoint "/books/:bookId"
const BookDetailsPage = () => {
    const { bookId } = useParams();
    const [ similarBooks, setSimilarBooks ] = useState<SimilarBook[]>([]);
    const [ book, setBook ] = useState<BookReview>();

    useEffect(() => {
        if (bookId) {
            searchBook(bookId).then((result) => {
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
                setSimilarBooks(result.similar_books.slice(0, 5));
            });
        }
    }, [bookId])

    return(
        <main>
            {book && <BookDetails book={book} />}
            <div className = "review-section">
                {book && <ReviewForm book={book} />}
            </div>
            <div className = "image-section"><ImageCarousel images={similarBooks}></ImageCarousel></div>
        </main>
    );
};

export default BookDetailsPage;

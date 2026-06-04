import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import type { BookReview } from "../../../types/BookReview";
import { getStoredBooks, updateBookTbrStatus } from "../BookCard/BookCard";
import "./BookDetails.css";

type BookDetailsProps = {
    book: BookReview;
};

const checkBookIsInTbr = (bookId: number) => {
    return getStoredBooks().some(
        (storedBook) => storedBook.bookId === bookId && storedBook.status === "tbr"
    );
};

const BookDetails = ({ book }: BookDetailsProps) => {
    const [liked, setLiked] = useState(checkBookIsInTbr(book.id));
    const authorNames = book.authors?.map((author) => author.name).join(", ") || "Unknown author";
    const bookRating = book.rating?.average !== undefined
        ? `${(book.rating.average * 5).toFixed(1)} / 5`
        : "No rating";

    useEffect(() => {
        setLiked(checkBookIsInTbr(book.id));
    }, [book.id]);

    return (
        <section className="book-details" aria-label="Book details">
            {book.image ? (
                <img
                    className="book-details__image"
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                />
            ) : (
                <div className="book-details__image book-details__image--missing">
                    No cover
                </div>
            )}

            <div className="book-details__content">
                <div className="book-details__header">
                    <h1>{book.title || "Untitled book"}</h1>
                    <Button
                        className="book-details__heart-button"
                        variant={liked ? "danger" : "outline-danger"}
                        type="button"
                        aria-label={liked ? "Remove from TBR" : "Save to TBR"}
                        aria-pressed={liked}
                        onClick={() => {
                            updateBookTbrStatus(book.id, !liked, book.authors, book.image, book.title, book.rating);
                            setLiked(!liked);
                        }}
                    >
                        {liked ? (
                            <span aria-hidden="true">&#9829;</span>
                        ) : (
                            <span aria-hidden="true">&#9825;</span>
                        )}
                    </Button>
                </div>
                <p>Author: {authorNames}</p>
                <p>Rating: {bookRating}</p>
                {book.description && (
                    <details className="book-details__description">
                        <summary>Description</summary>
                        <p>{book.description}</p>
                    </details>
                )}
            </div>
        </section>
    );
};

export default BookDetails;

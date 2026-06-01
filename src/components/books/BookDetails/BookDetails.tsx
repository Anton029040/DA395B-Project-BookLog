import type { BookReview } from "../../../types/BookReview";
import "./BookDetails.css";

type BookDetailsProps = {
    book: BookReview;
};

const BookDetails = ({ book }: BookDetailsProps) => {
    const authorNames = book.authors?.map((author) => author.name).join(", ") || "Unknown author";
    const bookRating = book.rating?.average !== undefined
        ? `${(book.rating.average * 5).toFixed(1)} / 5`
        : "No rating";

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
                <h1>{book.title || "Untitled book"}</h1>
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

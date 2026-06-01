import { Col, Row } from "react-bootstrap";
import type { ApiBook } from "../../../types/ApiBook";
import BookCard from "../BookCard/BookCard";

interface BookGalleryProps {
    books: ApiBook[];
    maxBooks?: number;
}

/* This component is responsible for displaying a gallery of books, sorted by rating, and limited to a maximum number of books (default is 12). 
 It receives an array of ApiBook objects as a prop and renders a grid of BookCard components for the top-rated books. */
const BookGallery = ({ books, maxBooks = 12 }: BookGalleryProps) => {
    const popularBooks = [...books] 
        .sort((firstBook, secondBook) => {
            const firstRating = firstBook.rating?.average ?? 0; 
            const secondRating = secondBook.rating?.average ?? 0;

            return secondRating - firstRating;
        })
        .slice(0, maxBooks); // Limit the number of books displayed to the specified maxBooks value.

    if (popularBooks.length === 0) { // If there are no books to display, show a message indicating that no books were found.
        return (
            <section aria-labelledby="popular-books-heading">
                <h2 id="popular-books-heading">Popular books right now</h2>
                <p>No books found.</p>
            </section>
        );
    }

    return (
        <section aria-labelledby="popular-books-heading">
            <h2 id="popular-books-heading">Popular books right now</h2>

            <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
                {popularBooks.map((book) => (   // For each book in the popularBooks array, render a BookCard component within a Bootstrap Column.
                    <Col key={book.id}> 
                        <BookCard book={book} />
                    </Col>
                ))}
            </Row>
        </section>
    );
};

export default BookGallery;

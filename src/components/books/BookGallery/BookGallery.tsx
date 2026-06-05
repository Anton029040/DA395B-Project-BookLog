import { Col, Row } from "react-bootstrap";

import type { ApiBook } from "../../../types/ApiBook";
import BookCard from "../BookCard/BookCard";

/** 
 * Props for the BookGallery component.
 */
interface BookGalleryProps {
    books: ApiBook[];
    maxBooks?: number;
}

/** 
 * A React component that displays a gallery of books, sorted by rating, and limited to a maximum number of books.
 * The component uses Bootstrap's grid system to layout the book cards responsively.
 * The component also handles the case where there are no books to display, showing an appropriate message to the user.
 * 
 * @param books - An array of book data to display.
 * @param maxBooks - The maximum number of books to display (default is 12).
 * @returns {JSX.Element} - The rendered book gallery.
 */
const BookGallery = ({ books, maxBooks = 1000 }: BookGalleryProps) => {
    const popularBooks = [...books] 
        .sort((firstBook, secondBook) => {
            const firstRating = firstBook.rating?.average ?? 0; 
            const secondRating = secondBook.rating?.average ?? 0;

            return secondRating - firstRating;
        })
        .slice(0, maxBooks);                            // Limit the number of books displayed to the specified maxBooks value.

    if (popularBooks.length === 0) {                    // If there are no books to display, show a message indicating that no books were found.
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

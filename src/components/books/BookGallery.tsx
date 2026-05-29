import { Col, Row } from "react-bootstrap";
import type { ApiBook } from "../../types/ApiBook";
import BookCard from "./BookCard/BookCard";

interface BookGalleryProps {
    books: ApiBook[];
    maxBooks?: number;
}

const BookGallery = ({ books, maxBooks = 12 }: BookGalleryProps) => {
    const popularBooks = [...books]
        .sort((firstBook, secondBook) => {
            const firstRating = firstBook.rating?.average ?? 0;
            const secondRating = secondBook.rating?.average ?? 0;

            return secondRating - firstRating;
        })
        .slice(0, maxBooks);

    if (popularBooks.length === 0) {
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
                {popularBooks.map((book) => (
                    <Col key={book.id}>
                        <BookCard book={book} />
                    </Col>
                ))}
            </Row>
        </section>
    );
};

export default BookGallery;

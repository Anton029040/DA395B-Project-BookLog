import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import type { ApiBook, Author, Rating } from "../../../types/ApiBook";
import type { UserBookData } from "../../../types/UserBookData";

import "./BookCard.css";


const TBR_STORAGE_KEY = "userBooks";    // key for storing user book data in localStorage, used to track the user's TBR list across sessions.

/** 
 * Props for the BookCard component.
 */
interface BookCardProps {
    book: ApiBook; 
}

/**
 * This function checks localStorage for the key defined by TBR_STORAGE_KEY, and if it finds data, 
 * it parses the JSON string into an array of UserBookData objects. 
 * If no data is found, it returns an empty array. This allows the application to keep track of 
 * which books the user has added to their TBR list across sessions.
 * 
 * @returns {UserBookData[]} 
 */
export const getStoredBooks = (): UserBookData[] => { 
    const storedBooks = localStorage.getItem(TBR_STORAGE_KEY); 
    return storedBooks ? JSON.parse(storedBooks) : []; 
};

/** 
 * This function retrieves the list of stored books from localStorage and checks if any of them match the provided book ID and have a status of "tbr".
 * If a match is found, it returns true, indicating that the book is in the TBR list; otherwise, it returns false.
 * 
 * @param bookId - The ID of the book to check.
 * @returns {boolean} - True if the book is in the TBR list, false otherwise.
 */
const checkBookIsInTbr = (bookId: number) => { 
    return getStoredBooks().some( 
        (storedBook) => storedBook.bookId === bookId && storedBook.status === "tbr" //Check if the book with the given ID is in the TBR list 
    );
};

/** 
 * Updates the TBR status of a book in localStorage based on the provided book ID and whether it should be saved to TBR or not.
 * If the book already exists in storage, it updates its status. If the book does not exist, it adds it with the appropriate status 
 * and other details.
 * 
 * @param bookId - The ID of the book to update.
 * @param shouldSaveToTbr - A boolean indicating whether the book should be saved to the TBR list.
 * @param authors - An optional array of authors for the book.
 * @param image - An optional string representing the book's image URL.
 * @param title - An optional string representing the book's title.
 * @param rating - An optional Rating object representing the book's rating.
 */
export const updateBookTbrStatus = (bookId: number, shouldSaveToTbr: boolean, authors? : Author[], image? : string, title? : string, rating? : Rating) => {
    const storedBooks = getStoredBooks();
    const existingBook = storedBooks.find((storedBook) => storedBook.bookId === bookId);
    
    if (existingBook) {                                 // If book already exists in storage, update status based on should it be saved to TBR or not.
        existingBook.status = shouldSaveToTbr ? "tbr" : "none";

    } else {                                            // If the book does not exist in storage, add it with the appropriate status.
        storedBooks.push({
            bookId,
            status: shouldSaveToTbr ? "tbr" : "none",
            authors: authors ?? [],
            title: title ?? "",
            image: image ?? "",                         // TODO: Add placeholder image
            rating: rating,
        });
    }

    localStorage.setItem(TBR_STORAGE_KEY, JSON.stringify(storedBooks)); // Saves the updated list of books back to localStorage as a JSON string.
};

/** 
 * A React component that displays information about a single book in a card layout.
 * The component includes the book's cover image, title, authors, and rating. It also 
 * features a heart button that allows users to add or remove the book from their TBR list.
 * 
 * @param book - The book data to display.
 * @returns {JSX.Element} - The rendered book card.
 */
const BookCard = ({ book  }: BookCardProps) => { 
    const navigate = useNavigate();
    const [liked, setLiked] = useState(checkBookIsInTbr(book.id));

    // Join multiple authors into a single string, or show "Unknown author" if no authors are available.
    const authors = book.authors?.map((author) => author.name).join(", ") || "Unknown author";

    // Convert rating from 0-1 scale to 0-5 scale and format it. 
    const rating = book.rating?.average ? `${(book.rating.average * 5).toFixed(1)} / 5` : "No rating";

    return (
        <Card
            className="book-card"
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/books/${book.id}`)}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                    navigate(`/books/${book.id}`);
                }
            }}
        >
            {book.image ? (
                <Card.Img
                    className="book-card__cover"
                    variant="top"
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                />
            ) : (
                <div className="book-card__cover book-card__cover--missing">
                    No cover
                </div>
            )}

            <Card.Body className="book-card__body">
                <div className="book-card__content">
                    <Card.Title className="book-card__title">{book.title}</Card.Title>
                    <Card.Text className="book-card__author">{authors}</Card.Text>
                    <Card.Text className="book-card__rating">{rating}</Card.Text>
                </div>

                <Button
                    className="book-card__heart-button"
                    variant={liked ? "danger" : "outline-danger"}
                    type="button"
                    aria-label={liked ? "Remove from TBR" : "Save to TBR"}
                    aria-pressed={liked}
                    onClick={(event) => {
                        event.stopPropagation();
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
            </Card.Body>
        </Card>
    );
};

export default BookCard;

import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { ApiBook, Author, Rating } from "../../../types/ApiBook";
import type { UserBookData } from "../../../types/UserBookData";
import "./BookCard.css";

interface BookCardProps {

    book: ApiBook; //Should be made required when real data is passed, remove "?" when that happens
    
}

const TBR_STORAGE_KEY = "userBooks"; // Key used for storing TBR data in localStorage

export const getStoredBooks = (): UserBookData[] => { // Retrieves the list of books from localStorage, or returns an empty array if none are stored.
    const storedBooks = localStorage.getItem(TBR_STORAGE_KEY); 
    return storedBooks ? JSON.parse(storedBooks) : []; // Parses the stored JSON string into an array of UserBookData objects, or returns an empty array if no data is found.
};

const checkBookIsInTbr = (bookId: number) => { 
    return getStoredBooks().some( 
        (storedBook) => storedBook.bookId === bookId && storedBook.status === "tbr" //Check if the book with the given ID is in the TBR list 
    );
};


export const updateBookTbrStatus = (bookId: number, shouldSaveToTbr: boolean, authors? : Author[], image? : string, title? : string, rating? : Rating) => { // Updates the TBR status of a book in localStorage based on the provided book ID and whether it should be saved to TBR or not.
    const storedBooks = getStoredBooks();
    const existingBook = storedBooks.find((storedBook) => storedBook.bookId === bookId);
    
    if (existingBook) { // If the book already exists in storage, update its status based on whether it should be saved to TBR or not.
        existingBook.status = shouldSaveToTbr ? "tbr" : "none";
    } else { // If the book does not exist in storage, add it with the appropriate status.
        storedBooks.push({
            bookId,
            status: shouldSaveToTbr ? "tbr" : "none",
            authors: authors ?? [],
            title: title ?? "",
            image: image ?? "", // todo Add placeholder image
            rating: rating,
        });
    }

    localStorage.setItem(TBR_STORAGE_KEY, JSON.stringify(storedBooks)); // Saves the updated list of books back to localStorage as a JSON string.
};

const BookCard = ({ book }: BookCardProps) => {   // "= testBook" is only used for testing purposes, should be removed when real API data is passed into BookCard
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

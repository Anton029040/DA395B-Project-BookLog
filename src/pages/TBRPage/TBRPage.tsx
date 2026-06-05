// This is the page connected to the endpoint "/tbr"
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import BookCard, { getStoredBooks } from "../../components/books/BookCard/BookCard";
import type { ApiBook } from "../../types/ApiBook";

import "./TBRPage.css"

const TBRPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");

    const [ booksInTBR, setBooksInTBR ] = useState<ApiBook[]>([]);

    useEffect(() => {
        if(query) {
            console.log(query);
            // todo Search for books that is in TBR list
            let savedBooks = getStoredBooks();
            const tbrBooks: ApiBook[] = [];

            for (let i = 0; i < savedBooks.length; i++) {
                if (savedBooks[i].status === "tbr" && savedBooks[i].title.toLocaleLowerCase().includes(
                    query.toLocaleLowerCase())) {

                    const tbrBook: ApiBook = {
                        id: savedBooks[i].bookId,
                        image: savedBooks[i].image,
                        title: savedBooks[i].title,
                        rating: savedBooks[i].rating,
                        authors: savedBooks[i].authors,
                    };
                    tbrBooks.push(tbrBook);
                }
            }
            setBooksInTBR(tbrBooks);
        } else {
            let savedBooks = getStoredBooks();
            const tbrBooks: ApiBook[] = [];

            for (let i = 0; i < savedBooks.length; i++) {
                if (savedBooks[i].status === "tbr") {
                    console.log(savedBooks[i].rating);

                    const tbrBook: ApiBook = {
                        id: savedBooks[i].bookId,
                        image: savedBooks[i].image,
                        title: savedBooks[i].title,
                        rating: savedBooks[i].rating,
                        authors: savedBooks[i].authors,
                    };
                    tbrBooks.push(tbrBook);
                }
            }
            setBooksInTBR(tbrBooks);
        }
        

    }, [query]);

    return(
        <main>
            <h1>Books to be read</h1>
            <div className="book-card-section">
                {booksInTBR.map((book) => (
                    <BookCard 
                    key={book.id}
                    book={book}/> 
                ))}
            </div>
        </main>
    );
};

export default TBRPage;
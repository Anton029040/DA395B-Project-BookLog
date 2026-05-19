import { useParams } from "react-router-dom";

// This is the page connected to the endpoint "/books/:bookId"
const BookDetailsPage = () => {
    const { bookId } = useParams();

    return(
        <main>
            <p>Book ID : {bookId} </p>
            { /* placeholder for testing */ }
        </main>
    );
};

export default BookDetailsPage;
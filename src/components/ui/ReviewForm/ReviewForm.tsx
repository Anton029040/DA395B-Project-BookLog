import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import "./ReviewForm.css";
import { getRating, getReview, saveReview } from '../../../hooks/useLocalStorage';
import type { BookReview } from '../../../types/BookReview';

type ReviewFormProps = {
    book : BookReview;
};

/* Component that contains the input fields of a review. Contains a textarea for writing a review / seeing an old one.
   Also contains a dropdown menu where user can pick between 1-5 stars to give a book. There is also a submit button
*/
const ReviewForm = ({ book }: ReviewFormProps) => {
    const [review, setReview] = useState("");
    const [rating, setRating] = useState("0");

    useEffect (() => {
        if (book.id) {
            setRating(getRating(book.id.toString()));
            setReview(getReview(book.id.toString()));
        }
    }, [book.id]);

    /* Function for doing controls before a book review is saved */
    function onSubmit() {
        console.log(rating);
        if (!rating || rating === "0") {
            alert("The book needs to have a rating before marking it as read");
            return;
        }
        saveReview(review, rating, book);
    }

    return (
        <Form className='container'>
            {/* Textarea. The component is taken from Bootstrap */}
            <FloatingLabel className = "text-area-label" controlId="reviewTextArea" label="Review">
                <Form.Control
                    className='review-text-area mb-3' 
                    as="textarea"
                    placeholder="Leave a review here"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    style={{ height: '300px' }} // Tried to do this in CSS but it wouldnt work so it'll have to be here. This is how Bootstrap docs does it
                />
            </FloatingLabel>

            {/* Dropdown list. The component is taken from Bootstrap */}
            <FloatingLabel controlId="reviewSelect" label="Rating">
                <Form.Select 
                    className='rating-dropdown mb-3'
                    aria-label="Floating label select example"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                >
                    <option value="0">Choose a rating</option>
                    <option value="1">⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="5">⭐⭐⭐⭐⭐</option>
                </Form.Select>
            </FloatingLabel>

            {/* Button for submiting the review. The component is taken from Bootstrap */}
            <Button 
                className = "submit-button mb-3" 
                onClick={onSubmit} 
                variant="primary"
            > Save as read</Button>
        </Form>
    )
}

export default ReviewForm;
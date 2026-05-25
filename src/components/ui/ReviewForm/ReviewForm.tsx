import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import "./ReviewForm.css";

type reviewForm = {
    oldReview? : string;
    oldRating? : string;
}


/* Component that contains the input fields of a review. Contains a textarea for writing a review / seeing an old one.
   Also contains a dropdown menu where user can pick between 1-5 stars to give a book. There is also a submit button
*/
const ReviewForm = ({oldReview, oldRating} : reviewForm) => {
    const [review, setReview] = useState(oldReview ?? "");
    const [rating, setRating] = useState(oldRating ?? "0");

    /* Function for doing controls before a book review is saved */
    function onSubmit() {
        console.log(rating);
        if (!rating || rating === "0") {
            alert("The book needs to have a rating before marking it as read");
            return;
        }

        // todo Needs to call method that saves book. There is one already in hooks/useLocalStorage called saveReview. Cant call now since there is nothing to save
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
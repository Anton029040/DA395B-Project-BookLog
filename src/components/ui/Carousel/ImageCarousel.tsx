import Carousel from 'react-bootstrap/Carousel';
import { useNavigate } from 'react-router-dom';

import type { SimilarBook } from '../../../types/SimilarBook';

import "./ImageCarousel.css";

 /**
 * Props for the ImageCarousel component.
 * @param images - An array of similar books to display in the carousel.
 * @returns ImageCarousel component
 */
type ImageCarouselProps = {
    images : SimilarBook[];
}

/**
 * Component for carousel. Uses Bootstrap components to create a carousel of similar books. 
 * Each book is displayed as an image with a title. 
 * When an image is clicked, the user is navigated to the book's page.
 * 
 * @param images The similar books that are to be inserted into the carousel
 * @returns image carousel component
 */
const ImageCarousel= ({images}: ImageCarouselProps) => {
    const navigate = useNavigate();

    /**
     * Handles the click event on an image in the carousel. Navigates the user to the book's page using the book's id.
     * @param image
     */
    function imagePressed(image : SimilarBook) {
        if (image) {
            navigate(`/books/${image.id}`);
        }
    }

    return (
        <Carousel> 

            {/* Map each similar book into the carousel and insert an image, alt and title */}
            {images.map((image) => (
                <Carousel.Item key={image.id}>
                    <img 
                        className="carousel-image"
                        src={image.image}
                        alt={image.title}
                        onClick={() => {
                            imagePressed(image);
                        }}
                    />

                    <Carousel.Caption>
                        <h3>{image.title}</h3>
                    </Carousel.Caption>

                </Carousel.Item>
            ))}

        </Carousel>
    );
};

export default ImageCarousel;
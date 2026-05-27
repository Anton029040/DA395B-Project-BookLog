import Carousel from 'react-bootstrap/Carousel';
import type { SimilarBook } from '../../../types/SimilarBook';
import "./ImageCarousel.css";
import { useNavigate } from 'react-router-dom';
 

type ImageCarouselProps = {
    images : SimilarBook[];
}

/**
 * Component for carousel. Uses Bootstrap components.
 * @param images The similar books that are to be inserted into the carousel
 * @returns Component
 */
const ImageCarousel= ({images}: ImageCarouselProps) => {
    const navigate = useNavigate();

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
}

export default ImageCarousel;
// This is the page connected to the endpoint "/"
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";

import { searchBooks } from "../api/bigBookApi";
import type { ApiBook } from "../types/ApiBook";
import { useBookFilters } from "../hooks/useBookFilters";

import FilterSidebar from "../components/filters/FilterSidebar";


const HomePage = () => {
    /* ======================================================
                    Search bar (user input)
       ====================================================== */
    const [searchParams] = useSearchParams();
    const query = searchParams.get("search");

    /* ====================================================== 
                        Filter sidebar 
       ====================================================== */
    const [books, setbooks] = useState<ApiBook[]>([]);
    const {
        selectedAuthors,
        selectedGenres,
        selectedRating,
        earliestPublishYear,
        latestPublishYear,
        setSelectedRating,
        setEarliestPublishYear,
        setLatestPublishYear,
        toggleAuthor,
        toggleGenre,
        clearFilters,
    } = useBookFilters();

    const availableAuthors = [...new Set(
        books.flatMap((book) => 
            book.authors?.map((author) => author.name) ?? []
        )
    ),];

    // TODO: add more genres 
    const availableGenres = [
        "fantasy",
        "romance",
    ];

    /* ====================================================== 
                        use Effect
       ====================================================== */
    useEffect(() => {
        if(query) {
            searchBooks(query).then((result) => {
                console.log(result)
            })
        }
    }, [query]);

    return(
        <main>
            <p>You are in Home page</p>

            <Container>
                <Row>
                    <Col>
                        <FilterSidebar
                            availableAuthors = {availableAuthors}
                        />
                    </Col>
                </Row>
            </Container>
            
        </main>
    );
};

export default HomePage;
import { useState } from "react";

// re-useable logic for filtering books by the users selected filters 
export const useBookFilters = () => {

    const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);       // type = string array
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedRating, setSelectedRating] = useState<number | undefined>(); // type = number or undefined
    const [selectEarliestPublishYear, setEarliestPublishYear] = useState<number | undefined>();
    const [selectLatestPublishYear, setLatestPublishYear] = useState<number | undefined>();

    // function to update the selected authors
    const toggleAuthor = (author: string) => {
        setSelectedAuthors((previousAuthors) => previousAuthors.includes(author)
            ? previousAuthors.filter((item) => (item !== author))
            : [...previousAuthors, author]
        );
    };
}
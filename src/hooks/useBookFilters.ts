import { useState } from "react";


//Type definition for the return value of the useBookFilters hook, which includes the current filter states and functions to update them.
type UseBookFiltersReturn = {
    selectedAuthors: string[];
    selectedGenres: string[];
    selectedRating: number | undefined;
    selectedEarliestPublishYear: number | undefined;
    selectedLatestPublishYear: number | undefined;
    setSelectedRating: React.Dispatch<React.SetStateAction<number | undefined>>;
    setEarliestPublishYear: React.Dispatch<React.SetStateAction<number | undefined>>;
    setLatestPublishYear: React.Dispatch<React.SetStateAction<number | undefined>>;
    toggleAuthor: (author: string) => void;
    toggleGenre: (genre: string) => void;
    clearFilters: () => void;
};

/**
 *  Custom hook that manages the state of book filters, including selected authors, genres, ratings, and publish years. 
 * It provides functions to toggle filters and clear all filters.
 * 
 * @returns An object containing the current filter states and functions to update them.
 */
export const useBookFilters = (): UseBookFiltersReturn => {
    const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);                           // start = no authors selected = empty string array
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedRating, setSelectedRating] = useState<number | undefined>();                     // start = no rating selected = undefined
    const [selectedEarliestPublishYear, setEarliestPublishYear] = useState<number | undefined>();
    const [selectedLatestPublishYear, setLatestPublishYear] = useState<number | undefined>();

    /**
     * Toggles the selection of an author in the filters.
     * @param author The name of the author to toggle.
     */
    const toggleAuthor = (author: string) => {      // accepts an author name as a string
        setSelectedAuthors((previousAuthors) => {   // updates state (async), using callback version of setState    // <- TESTING: REMOVE "{" LATER
            const updatedAuthors =                   
                previousAuthors.includes(author)    // is this author in our "filter" array?
                ? previousAuthors.filter((item) =>  // true: "yes they have already added this author as a filter" then
                    (item !== author))              // remove the author from the "filter" array
                : [...previousAuthors, author]      // false: add the author to the "filter" array

            console.log("updated selected authors: ", updatedAuthors);

            return updatedAuthors;                                      
        });                                                             
    };

    /**
     * Toggles the selection of a genre in the filters.
     * @param genre The name of the genre to toggle.
     */
    const toggleGenre = (genre: string) => {  
        setSelectedGenres((previousGenres) => previousGenres.includes(genre)    
            ? previousGenres.filter((item) => (item !== genre))              
            : [...previousGenres, genre]      
        );
    };

    // Function to clear all selected filters, resetting them to their initial states.
    const clearFilters = () => {
        setSelectedAuthors([]);
        setSelectedGenres([]);
        setSelectedRating(undefined);
        setEarliestPublishYear(undefined);
        setLatestPublishYear(undefined);
    };

   // Return the current filter states and the functions to update them, which can be used in components that consume this hook.
    return {
        // the users currently selected filters:
        selectedAuthors,
        selectedGenres,
        selectedRating,
        selectedEarliestPublishYear,
        selectedLatestPublishYear,

        // the methods to set the selected/deselected filters (toggling)
        setSelectedRating,
        setEarliestPublishYear,
        setLatestPublishYear,
        toggleAuthor,
        toggleGenre,

        // the method to clear all of the selected filters
        clearFilters,
    };
};
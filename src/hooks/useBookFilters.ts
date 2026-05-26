import { useState } from "react";

// re-useable logic for filtering books by the users selected filters 
export const useBookFilters = () => {

    const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);                           // type = string array
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedRating, setSelectedRating] = useState<number | undefined>();                     // type = number or undefined
    const [selectedEarliestPublishYear, setEarliestPublishYear] = useState<number | undefined>();
    const [selectedLatestPublishYear, setLatestPublishYear] = useState<number | undefined>();

    /* function to update the selected authors based on the users selected/deselected filters.

        This is a simple toggle check: "is the author already in the "filter" array"?
            true: yes they are -> then the user has previously selected this author from the filter list (toggled it on), 
                therefore this new click (callback state change), means that they have deselected it (toggled off),
                in that case, the user no longer wants that author as a part of the filter when searchinging for books.
                => remove the author from the "filter" array.
            false: no they are not -> then the user has selected this author from the filter list (toggled it on),
                therefore this new click (callback state change), means theat they want the author added as a filter.
                => add it to the "filter" array.

        - filter() = new array with only items that pass the condition (immutable datatype)
        - [...previousAuthors, author] = creates a new array and adds the author
    */
    const toggleAuthor = (author: string) => {  // accepts an author name as a string
        setSelectedAuthors((previousAuthors) => // updates state (async), using callback version of setState
            previousAuthors.includes(author)    // is this author in our "filter" array?
            ? previousAuthors.filter((item) =>  // true: "yes they have already added this author as a filter" then
                (item !== author))              // remove the author from the "filter" array
            : [...previousAuthors, author]      // false: add the author to the "filter" array
        );
    };

    // function to update(toggle) the selected genres based on the users selected/deselected filters.
    const toggleGenre = (genre: string) => {  
        setSelectedGenres((previousGenres) => previousGenres.includes(genre)    
            ? previousGenres.filter((item) => (item !== genre))              
            : [...previousGenres, genre]      
        );
    };

    // function to clear all the users selected filters
    const clearFilters = () => {
        setSelectedAuthors([]);
        setSelectedGenres([]);
        setSelectedRating(undefined);
        setEarliestPublishYear(undefined);
        setLatestPublishYear(undefined);
    };

    // returning the filters as an object
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
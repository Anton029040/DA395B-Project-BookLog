import { useState } from "react";

// import helper functions to sort authors alphabetically and normalise text for searching (removing "." and case sensitivity)
import { normaliseText, sortAuthorsAlphabetically } from "../utils/filterBooks";    


/**
 * Custom hook to manage the logic for filtering authors in the FilterSidebar.
 *
 * @param {useAuthorFilterProps} props - The properties for the useAuthorFilter hook.
 * @returns {Object} An object containing the current search text, visible authors, total filtered authors, 
 *                  and functions to update the search and handle scrolling.
 * @property {string[]} availableAuthors - All available authors for display in the sidebar.
 * @property {string[]} selectedAuthors - Authors currently selected by the user.
 */
interface useAuthorFilterProps {
    availableAuthors: string[];         // all available authors for display in the sidebar (after filtering by category/genre) - passed from parent component
    selectedAuthors: string[];          // authors currently selected by the user
}

/**
 * useAuthorFilter is a custom React hook that manages the state and logic for filtering authors in a sidebar component. 
 * It takes in available authors and selected authors as props, and returns the current search text, visible authors based on 
 * the search and selection, total number of filtered authors, and functions to update the search text and handle scrolling 
 * for lazy loading more authors.
 * 
 * @param {useAuthorFilterProps} props - An object containing the available authors and selected authors for filtering.
 * @returns {Object} An object containing the current search text, visible authors, total filtered authors, 
 *                  and functions to update the search and handle scrolling.
 * @property {string} authorSearch - The current text in the author search input.
 * @property {string[]} visibleAuthors - The list of authors currently visible based on the search and selection.
 */
const useAuthorFilter = ({ availableAuthors, selectedAuthors}: useAuthorFilterProps): object => {    // <- destrcuted prop
    const [authorSearch, setAuthorSearch] = useState("");                           // state: user input in searchbar (update as user types)
    const [showAuthorCount, setShowAuthorCount] = useState(25);                     // state: controls how many authors are currently visible

    const searchedAuthors = sortAuthorsAlphabetically(availableAuthors)             // sort all authors alphabetically (input doesn't require ".") and store in searchedAuthors
        .filter((author) =>                                                         // then filter based on user input
            normaliseText(author)                                                   // input isnt case-sensitive, and doesn't contain "."
            .includes(normaliseText(authorSearch))                                  // comparison of input vs actual authors
    );

    const userSelectedAuthors = selectedAuthors.filter((author) =>                  // finds authors that match the search & selected by the user.
        searchedAuthors.includes(author)                                            // -> selected authors stay visible at the top of the filter list
    );

    const unselectedAuthors = searchedAuthors.filter((author) =>                    // finds authors that match the search & NOT selected by the user.
        !selectedAuthors.includes(author)                                           // -> place these after our selected authors
    );

    const orderedAuthors = [                                                        // combines the selected and unselected lists (for UI)
        ...userSelectedAuthors,                                                     // users selected authors on top
        ...unselectedAuthors,                                                       // unselected authors below
    ];

    const visibleAuthors = orderedAuthors.slice(0, showAuthorCount);                //  limits shown authors to 25 (rendering & performance)

    const updateAuthorSearch = (value: string) => {                                 // runs when user types in search field
        setAuthorSearch(value);                                                     // updates search text
        setShowAuthorCount(25);                                                     // resets # authors shown (incase user scrolls in previous search)
    };

    const handleScroll = (event: React.UIEvent< HTMLDivElement >) => {              // runs when the authors filter list is scrolled
        const element = event.currentTarget;                                        // store the div element being scrolled

        const isAtBottomOfScroll = 
            (element.scrollTop + element.clientHeight) >= element.scrollHeight - 10;    // near bottom of scroll list? -10 buffer triggers loading early

        if (isAtBottomOfScroll) {                                                       // load 25 more authors
            setShowAuthorCount((previousCount) => previousCount + 25);                  // callback version of setState (ensures use of latest state value)
        }

    };

    /** Returns the filtered and ordered list of authors based on the search and selection criteria. */
    return {                                                                        // <- makes these values/functions available to component
        authorSearch,                                                               // current search text
        visibleAuthors,                                                             // authors currently visible
        totalFilteredAuthors: orderedAuthors.length,                                // total number after filtering/seaerching
        updateAuthorSearch,                                                         // function to update the search
        handleScroll,                                                               // function to handle "infinite scroll"
    };
};

export default useAuthorFilter;
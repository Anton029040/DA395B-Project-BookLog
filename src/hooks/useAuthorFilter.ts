import { useState } from "react";

import { normaliseText, sortAuthorsAlphabetically } from "../utils/filterBooks";    // helper functions to sort authors alphabetically

// The types of props expected to be passed to the hook are: authors available for filtering, and the authors selected by the user
interface useAuthorFilterProps {
    availableAuthors: string[];                     // all available authors (for display in the sidebar)
    selectedAuthors: string[];                      // authors currently selected by the user
}

/* Hook responsible for the logic pertaining to filtering authors in the FilterSidebar.
    -> filters authors using search input (search bar in the sidebar)
    -> sorting authors alphabetically (input doesn't require ".")
    -> selected authors stay visible at the top of the authors search field
    -> "lazy loading": loads more authors only when the user scrolls
    -> controls the author filter UI logic   */
export const useAuthorFilter = ({ availableAuthors, selectedAuthors}: useAuthorFilterProps) => {    // <- destrcuted prop
    const [authorSearch, setAuthorSearch] = useState("");                                   // state: user input in searchbar (update as user types)
    const [showAuthorCount, setShowAuthorCount] = useState(25);                             // state: controls how many authors are currently visible

    const searchedAuthors = sortAuthorsAlphabetically(availableAuthors)                     // sort all authors,
        .filter((author) =>                                                                 // then filter based on user input
            normaliseText(author)                                                           // input isnt case-sensitive, and doesn't contain "."
            .includes(normaliseText(authorSearch))                                          // comparison of input vs actual authors
    );

    const userSelectedAuthors = selectedAuthors.filter((author) =>                  // finds authors that match the search & selected by the user.
        searchedAuthors.includes(author)                                            // -> selected authors stay visible at the top of the filter list
    );

    const unselectedAuthors = searchedAuthors.filter((author) =>                    // finds authors that match the search & not selected by the user.
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

    return {                                                                        // <- makes these values/functions available to component
        authorSearch,                                                               // current search text
        visibleAuthors,                                                             // authors currently visible
        totalFilteredAuthors: orderedAuthors.length,                                // total number after filtering/seaerching
        updateAuthorSearch,                                                         // function to update the search
        handleScroll,                                                               // function to handle "infinite scroll"
    };
};
import { useEffect, useState, useMemo } from "react";   // Effect = run code on changes, State = stores states/values

import { searchAuthors } from "../api/bigBookApi";                                  // fetch authors from external API (function)
import { getUniqueValues, sortAuthorsAlphabetically, normaliseText } from "../utils/filterBooks";  // removes duplicates & sort alphabetically (helper functions)
import { useDebounce } from "./useDebounce";                                        // delays api requests (to avoid spam for every key press)

// ================= CUSTOM HOOK: useAvailableAuthors  =================  
// -> Handles the author search field in the filter sidebar
// -> calls ONLY the search-author endpoint (NEVER search-books)
// -> stores available authors from the API
// -> stores / loads error states
// -> delays (debounce) API requests to avoid spam (we have 50/ day)
// -> loads the first author page on app start, and more on scroll
// =====================================================================
export const useAvailableAuthors = () => {
    // state variables:
    const [authorSearch, setAuthorSearch] = useState("");                   // current USER INPUT text in the author filter text field
    const [searchedAuthors, setSearchedAuthors] = useState<string[]>([]);   // AUTHORS from API -> typed search by name (authorSearch)

    const [defaultAuthors, setDefaultAuthors] = useState<string[]>([]);     // main loaded author list (localStorage if available, expand list on scroll)
    const [nextOffset, setNextOffset] = useState(0);                        // next offset for loading more defaultAuthors (might be capped at 200)
    const [hasMoreAuthors, setHasMoreAuthors] = useState(true);             // flag for if the API has no more defaultAuthors to load (see cap)

    const [loadAuthors, setLoadAuthors] = useState(false);                  // loading indicator (fetching / finished fetching authors (API response))
    const [authorError, setAuthorError] = useState("");                     // error message (for display to the user)

    const debouncedAuthorSearch = useDebounce(authorSearch, 500);           // adds the delay before sending API request (avoid every keystroke)

    // localStorage state variables:
    const AUTHOR_CACHE_KEY = "Api-default-authors";                         // key for key-value pair in localStorage
    const PAGE_SIZE = 100;                                                  // allows max number of 100
    const saveDefaultAuthorsToStorage = (authors: string[]) => {            // stores growing defaultAuthors list in localStorage (key and value pair)
        localStorage.setItem(AUTHOR_CACHE_KEY, JSON.stringify(authors));    
    };

    // final authors list state variable:
    const mergeUniqueSortedAuthors = (currentAuthors: string[], newAuthors: string[]) => {  // receives 2 author arrays
        return sortAuthorsAlphabetically(getUniqueValues([                                  // merges them, removes duplicates, and sorts alphabetically
            ...currentAuthors,
            ...newAuthors,
        ]));
    };

    // ============= IMPORTANT HELPER: loadDefaultAuthorPage() =============
    // -> calls the search-author endpoint & loads ONE page (100 authors)
    // -> NO author name sent (intentional)
    // -> used for: App start and when user scrolls near the bottom
    // =====================================================================
    const loadDefaultAuthorPage = async (offset: number) => {
        console.log("useAvailableAuthors-> Loading default authors:", {
            number: PAGE_SIZE,
            offset,
        });

        const result = await searchAuthors({
            number: PAGE_SIZE,
            offset,
        });

        return result.authors.map((author) => author.name);
    };

    // ================ IMPORTANT HELPER: fetchAuthorsByName() ================
    // -> calls the search-author endpoint based on USER INPUT (name parameter)
    // -> only used when user types in the search bar in the filter sidebar.
    // ========================================================================
    const searchAuthorsByName = async (search: string) => {
        console.log("useAvailableAuthors-> Searching authors by name:", {
            name: search,
            number: PAGE_SIZE,
            offset: 0,
        });

        const result = await searchAuthors({
            name: search,
            number: PAGE_SIZE,
            offset: 0,
        });

        return result.authors.map((author) => author.name);
    };

    // =========== IMPORTANT HELPER: loadMoreDefaultAuthors() ===========
    // -> loads the next author page and appends unique authors
    //      -> to both React and localStorage 
    // ==================================================================
    const loadMoreDefaultAuthors = async () => {
        if (loadAuthors || !hasMoreAuthors) {                               // if authors are already loading or there are no more authors
            return;                                                         // don't send a new API request
        }

        setLoadAuthors(true);                                               // show the user we are fetching authors
        setAuthorError("");                                                 // reset error messages

        try {
            const newAuthors = await loadDefaultAuthorPage(nextOffset);     // wait for the new authors to load and store them

            setDefaultAuthors((previousAuthors) => {                        // merge the previous authors with the newly fetched ones
                const mergedAuthors = mergeUniqueSortedAuthors(
                    previousAuthors,
                    newAuthors
                );

                saveDefaultAuthorsToStorage(mergedAuthors);                 // save the new merged authors list to localStorage

                return mergedAuthors;                                       // return the new merged list
            });

            setNextOffset((previousOffset) => previousOffset + PAGE_SIZE);  // change page starting point (like turning a page)

            if (newAuthors.length < PAGE_SIZE) {                            // if there are < 100 authors on the new page, we have all the authors
                setHasMoreAuthors(false);                                   // we change the flag so that we don't keep searching
            }

        } catch (error) {
            console.error("useAvailableAuthors-> Could not load default authors:", error);
            setAuthorError("Could not load authors.");

        } finally {
            setLoadAuthors(false);                                          // show the user we are NOT fetching authors                          
        }
    };


    // ===================== useEffect() on App start =====================
    // -> runs when component is first loaded
    // -> calls the search-author endpoint OR localStorage
    // -> updates authors in the filter sidebar:
    //   -> if there are authors in localStorage, load them immediately & 
    //      change offset based on the number of cached authors.
    //          -> if not, fetch the first page from the API.
    // =====================================================================
    useEffect(() =>{
        const storedAuthors = localStorage.getItem(AUTHOR_CACHE_KEY);          // checks localStorage

        if (storedAuthors) {                                                   // if authors cached
            const cachedAuthors: string[] = JSON.parse(storedAuthors);         // grab them

            setDefaultAuthors(cachedAuthors);                                  // update our authors list for the filter
            setNextOffset(cachedAuthors.length);                               // change page

            console.log("useAvailableAuthors-> Loaded authors from localStorage:", {
                count: cachedAuthors.length,
                authors: cachedAuthors,
            });

            return;
        }

        loadMoreDefaultAuthors();                                               // gets the authors from the next page
    }, []);

    // ========= useEffect() when user types in the search field =========
    // -> if search bar is empty: show the default author list
    // -> if there is text in the input field:
    //      -> first search localStorage
    //      -> second, send request to API search-authors endpoint
    //      -> merge the local and API results 
    // ====================================================================
    useEffect(() => {
        let ignoreOldRequest = false;

        const runAuthorSearch = async () => {
            const trimmedSearch = debouncedAuthorSearch.trim();                 // removes whitespace from user input

            if (trimmedSearch === "") {                                         // if the user erases their text
                setSearchedAuthors([]);                                         // reset the state
                setAuthorError("");                                             // reset the error state
                return;
            }

            const localMatches = defaultAuthors.filter((author) =>              //  check user input vs already-loaded / cached authors array
                normaliseText(author).includes(normaliseText(trimmedSearch))
            );

            /* ----------------- IMPORTANT -> NEED TO DECIDE -------------------------------------------------------- 
            this section is purely to reduce the number of API calls BUT it might miss some authors:
            ie. if we have "j k rowling", in localstorage, when the user types "row" it finds "rowling" in
            our cahce and so it doesn't make an API request. This potentially misses finding 
            "Rowan Williams" or "Rowena Cory Daniells" if they aren't already in our cache. 
            
            remove this single if statement to ensure that we always make an API call: */

            if (localMatches.length > 0) {                                      // if the author exists in local storage      
                setSearchedAuthors(localMatches);                               // set the state (use them)
                setAuthorError("");                                             // reset the error message

                console.log("useAvailableAuthors-> Local author matches found. API not called:", {
                    search: trimmedSearch,
                    localMatches,
                });

                return;                                                         // stop
            }
            // --------- remove up to here only if we want the user to always find new authors on partial inputs -------

            // if no author were found in local storage then this runs:
            setLoadAuthors(true);                                               // show the user we are fetching authors
            setAuthorError("");                                                 // reset author error

            try {
                const apiMatches = await searchAuthorsByName(trimmedSearch);    // send a request to the api with the user input

                const mergedSearchResults = mergeUniqueSortedAuthors(           // add author to the localStorage (no duplicates)
                    localMatches,
                    apiMatches
                );

                if (!ignoreOldRequest) {                                        // if the request is outdated (new input since delay)
                    setSearchedAuthors(mergedSearchResults);                    // then update the searchedAuthors

                    if (mergedSearchResults.length === 0) {     
                        setAuthorError("No authors found.");
                    }
                }

                console.log("useAvailableAuthors-> No chached matches, API was called: ", {
                    search: trimmedSearch,
                    apiMatches,
                });

            } catch (error) {
                console.error("useAvailableAuthors-> Author search failed:", error);

                if (!ignoreOldRequest) {                                        // if there is an error and the request is outdated
                    setSearchedAuthors(localMatches);                           // use the local storage authors list

                    if (localMatches.length === 0) {
                        setAuthorError("Could not search authors.");
                    }
                }

            } finally {
                if (!ignoreOldRequest) {                                        
                    setLoadAuthors(false);                                      // stop the "loading authors" message to user
                }
            }
        };

        runAuthorSearch();                                                      // run the async function                                      

        return () => {
            ignoreOldRequest = true;                                            // ignore previous user input changes, use new input
        };

    }, [debouncedAuthorSearch, defaultAuthors]);

    // ========= CHOOSES WHICH AUTHOR LIST TO DISPLAY =========
    // -> if user is searching: show search results
    // -> if search field is empty: show default list
    // ========================================================
    const visibleAuthors = useMemo(() => {                                      // memo stores calculated states
        if (debouncedAuthorSearch.trim() !== "") {                              
            return searchedAuthors;
        }

        return defaultAuthors;
    }, [debouncedAuthorSearch, searchedAuthors, defaultAuthors]);

    // ========= HANDLES SCROLLING IN THE AUTHOR FILTER LIST =========
    // -> if user scrolls near the bottom of the page, load next page
    // IMPORTANT: only works if the search field is empty =(
    // ===============================================================
    const handleAuthorScroll = (event: React.UIEvent<HTMLDivElement>) => {              // creates a div element
        if (debouncedAuthorSearch.trim() !== "") {                              
            return;
        }

        const element = event.currentTarget;                                            // if we are in the div (scroll list)

        const isNearBottom =                                    
            element.scrollTop + element.clientHeight >= element.scrollHeight - 20;

        if (isNearBottom) {
            loadMoreDefaultAuthors();
        }
    };

    return {
        authorSearch,
        setAuthorSearch,
        availableAuthors: visibleAuthors,
        loadAuthors,
        authorError,
        hasMoreAuthors,
        handleAuthorScroll,
    };
};
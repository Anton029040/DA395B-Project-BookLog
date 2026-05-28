import { useEffect, useState } from "react";   // Effect = run code on changes, State = stores states/values

import { searchAuthors } from "../api/bigBookApi";                                  // fetch authors from external API (function)
import { getUniqueValues, sortAuthorsAlphabetically } from "../utils/filterBooks";  // removes duplicates & sort alphabetically (helper functions)
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

    const debouncedAuthorSearch = useDebounce(authorSearch, 300);           // adds the delay before sending API request (avoid every keystroke)

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

        setLoadAuthors(true);                                               // we want to fetch more authors
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
            setLoadAuthors(false);                                           
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
    
};













    useEffect(() =>{   
        let ignoreOldRequest = "false";                                         // prevents old request overwriting a newer state

        const loadAuthors = async () => {                                       // useEffect cant be async, this loads authors from the API
            const trimmedSearch = debouncedAuthorSearch.trim();
            setLoadAuthors(true);
            setAuthorError("");

            try {
                // ============================ STORE AUTHORS TO LOCALSTORAGE ============================
                const storageKey = "Api-default-authors";                       // allows different searches to have their own lists in localStorage
                const storedAuthors = localStorage.getItem(storageKey);         // retrieve cached authors from localStorage (strings ONLY)

                if (storedAuthors) {                                            // if author exists in localStorage
                    const cachedAuthors: string[] = JSON.parse(storedAuthors);  // -> convert JSON string back to an array
                
                    if (!ignoreOldRequest) {
                        setApiAuthors(cachedAuthors);

                        if (cachedAuthors.length === 0){
                            setAuthorError("No Authors in localStorage matching your search were found.")
                        }
                    }

                    return;
                }

                console.log("useAvailableAuthors-> calling search-authors with:", trimmedSearch || "(default ")

                const authorsListFromApi = await fetchAuthorPages(              // fetch authors from API
                    debouncedAuthorSearch
                );

                const uniqueSortedAuthors = sortAuthorsAlphabetically(          // merge selected & API authors, remove duplicates and sort
                    getUniqueValues(authorsListFromApi)
                );  

                if (!ignoreOldRequest) {
                    setApiAuthors(uniqueSortedAuthors);

                    if (uniqueSortedAuthors.length === 0){
                        setAuthorError("No Authors in the API matching your search were found.")
                    }
                }

                localStorage.setItem(                                           // save authors to localStorage (strings only hence conversion)
                    storageKey,                                                 // -> this prevents repeated API requests for the same author
                    JSON.stringify(uniqueSortedAuthors)
                );

            } catch (error) {
                console.error["useAvailableAuthors -> Could not load authors:", error];

                if (!ignoreOldRequest) {
                    setApiAuthors([]);
                    setAuthorError("Could not load authors, Please try a different search.");
                }

            } finally {                                                         // always runs (success or error)!!!
                if (!ignoreOldRequest) {                                                       
                    setLoadAuthors(false);                                      // stops the loading state.
                }
            }
        };

        loadAuthors();                                                          // execute the async function

        return () => {
            ignoreOldRequest = true;
        };
    }, [debouncedAuthorSearch, selectedAuthors]);                               // re-run whenever the search or selected authors change
    
    const availableAuthors = useMemo(() => {                                    // merge selected & API authors, remove duplicates and sort
        return sortAuthorsAlphabetically( getUniqueValues([
            ...selectedAuthors,
            ...apiAuthors,
        ]));
    }, [selectedAuthors, apiAuthors]);  
                
    return {                                                                    // allows components to access the values in this hook
        availableAuthors,                                                       // authors shown in the accordion
        loadAuthors,                                                            // loading state
        authorSearch,                                                           // current search input value    
        setAuthorSearch,                                                        // function for updating search input
        authorError                                                             // error messages to be displayed to user
    };
};
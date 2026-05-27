import { useEffect, useState } from "react";   // useEffect = run code on changes, useState = stores states/values in the hook

import { searchAuthors } from "../api/bigBookApi";                                  // fetch authors from external API (function)
import { getUniqueValues, sortAuthorsAlphabetically } from "../utils/filterBooks";  // removes duplicates & sort alphabetically (helper functions)
import { useDebounce } from "./useDebounce";                                        // delays api requests (to avoid spam for every key press)


// The hook expects to receive a string array of selected authors to know what authors are currently selected
interface useAvailableAuthorProps {
    selectedAuthors: string[];
}

/* Hook responsible for fetching authors from the search-authors endpoint (FilterSidebar).
    -> fetches / searches for authors from the API (also controls the author search field)
    -> removes duplicate authors
    -> sorts authors alphabetically
    -> caches authors in localStorage
    -> returns author search state to the component 
    
    on first run this should make an API request but once/if the author
    information is in local storage, it should make 0 API requests */
export const useAvailableAuthors = ({selectedAuthors,}: useAvailableAuthorProps) => {

    const [authorSearch, setAuthorSearch] = useState("");                       // state: current text in the user input (search bar)
    const [availableAuthors, setAvailableAuthors] = useState<string[]>([]);     // state: authors available for display in the checklist
    const [loadAuthors, setLoadAuthors] = useState(false);                      // state: loading indicator (fetching / finished fetching authors)

    const debouncedAuthorSearch = useDebounce(authorSearch);                    // adds the delay before sending a request to the api

    /* IMPORTANT: helper function to fetch author pages from the API:
        - the api returns limited number of authors per request (offsets and then merge the results together) */
    const fetchAuthorPages = async (name: string) => {
        const allAuthors: string[] = [];                                        // stores all fetched author names
        const pageSize = 100;                                                   // max results per request (ux loading speed / rendering)
        const offsets = [0, 100];                                               // pagination: fetch first 100 authors, then next 100

        for (const offset of offsets) {                                         // loop through all pages
            const data = await searchAuthors({                                  // call the API
                name,                                                           // user typed input
                number: pageSize,                                               // number of results to return
                offset,                                                         // current page offset
            });

            // retrieve only the authors name (not id) from the API (converts Author[] to string[])
            const authorsFromCurrentPage = data.authors.map(                    
                (author) => author.name
            );

            allAuthors.push(...authorsFromCurrentPage);                         // add fetched authors to the master array

            if (authorsFromCurrentPage.length < pageSize){                      // stop requesting more pages if the page returns < 100 authors
                break;                                                          // -> we have already gotten all the authors
            }
        }

        return allAuthors;                                                      // the merged author list
    }

    /* runs when components is first loaded or when the query changes
        -> loading authors
        -> checking localStorageCache
        -> updating state */
    useEffect(() =>{   

        const loadAuthors = async () => {                                       // useEffect cant be async hence this function

            const storageKey = `authors-${debouncedAuthorSearch || "default"}`; // allows different searches to have their own lists in localStorage
            const storedAuthors = localStorage.getItem(storageKey);             // retrieve cached authors from localStorage (strings ONLY)

            if (storedAuthors) {                                                // if author exists in localStorage
                const cachedAuthors: string[] = JSON.parse(storedAuthors);      // -> convert JSON string back to an array
                
                const newAllAuthorsList = sortAuthorsAlphabetically(            // merge lists: users author filters on top, and the rest below
                    getUniqueValues([               
                        ...selectedAuthors,                                     // this ensures that selected authors always remain visible
                        ...cachedAuthors,
                    ])
                );

                setAvailableAuthors(newAllAuthorsList);                         // store in state
                return;                                                         // stop execution if author found, avoids unnecessary API requests
            }

            setLoadAuthors(true);                                               // show loading state (only needed if we want to notify user)

            try{                                                                // ensures loading state always stops, even on request failures
                const authorsListFromApi = await fetchAuthorPages(              // fetch authors from API
                    debouncedAuthorSearch
                );

                const uniqueSortedAuthors = sortAuthorsAlphabetically(          // merge selected & API authors, remove duplicates and sort
                    getUniqueValues([
                        ...selectedAuthors,
                        ...authorsListFromApi,
                    ])
                );  
                
                setAvailableAuthors(uniqueSortedAuthors);                       // state: store processed authors (update visible authors in UI)

                localStorage.setItem(                                           // save authors to localStorage (strings only hence conversion)
                    storageKey,                                                 // -> this prevents repeated API requests for the same author
                    JSON.stringify(uniqueSortedAuthors)
                );
            }

            finally{                                                            // always runs (success or error)!!!
                setLoadAuthors(false);                                          // stops the loading state
            }
        };

        loadAuthors();                                                          // execute the async function

    }, [debouncedAuthorSearch, selectedAuthors]);                               // re-run whenever the search or selected authors change

    return {                                                                    // allows components to access the values in this hook
        availableAuthors,                                                       // authors shown in the accordion
        loadAuthors,                                                            // loading state
        authorSearch,                                                           // current search input value    
        setAuthorSearch,                                                        // function for updating search input
    };
};
import { useEffect, useState } from "react";   // useEffect = run code on changes, useState = stores states/values in the hook

import { searchBooks } from "../api/bigBookApi";                                // fetch books from external API
import type { ApiBook } from "../types/ApiBook";                                // Typescript (book object from the API)
import { getUniqueValues, sortAuthorsAlphabetically } from "../utils/filterBooks";   // uniqueValues = removes duplicates. sort alphabetically by surname


// The hook expects a query string to know what authors to fetch from the API / Local Storage (ie. "Jane Austin")
interface useAvailableAuthorProps {
    query: string;
}

/* Hook responsible for the logic pertaining to retrieving and storing authors for the FilterSidebar.
    -> fetches all authors from the API
    -> removes duplicate authors
    -> sorts authors by surname (alphabetically)
    -> caches authors in localStorage
    -> returns author data to the component 
    
    on first run this should make an API request but once/if the author
    information is in local storage, it should make 0 API requests */
export const useAvailableAuthors = ({query,}: useAvailableAuthorProps) => {
    const [availableAuthors, setAvailableAuthors] = useState<string[]>([]);     // stores all authors as an array of strings
    const [loadAuthors, setLoadAuthors] = useState(false);                      // loading state (fetching authors or finished fetching)

    useEffect(() =>{                                                            // runs when components is first loaded or when the query changes
        const loadAuthors = async () => {                                       // useEffect cant be async hence this function
            const storageKey = `authors-${query}`;                              // allows different searches to have different author lists cached
            const storedAuthors = localStorage.getItem(storageKey);            // retrieve cached authors from localStorage (strings ONLY)

            if (storedAuthors) {                                                // if author exists in localStorage
                setAvailableAuthors(JSON.parse(storedAuthors));                 // convert JSON string to array, store in state
                return;                                                         // stop execution if author found, avoids unnecessary API requests
            }

            setLoadAuthors(true);                                               // if not cached data, start loading (state)

            try{                                                                // ensures loading state always stops, even on request failures
                const data = await searchBooks({                                // fetch books from API (THIS IS OUR REQUEST)
                    query,                                                  
                    number: 100,                                                 
                    offset: 0,                                                 
                });                                                         

                const books: ApiBook[] = data.books.flat();                     // API returns nested arrays, flat() converts them into 1 array

                const authorsListFromApi = books.flatMap((book) =>              // loops through all books
                    book.authors?.map((author) => author.name)                  // extracts authors, flattens to 1 array
                    ?? []                                                       // if authors dont exist, returns and empty array
                );
                    
                const uniqueSortedAuthors = sortAuthorsAlphabetically(getUniqueValues(authorsListFromApi));  // remove duplicate authors and sort
                setAvailableAuthors(uniqueSortedAuthors);                       // store processed authors in the state

                localStorage.setItem(                                          // save authors to localStorage (strings only hence conversion)
                    storageKey,
                    JSON.stringify(uniqueSortedAuthors)
                );
            }

            finally{                                                            // always runs (success or error)!!!
                setLoadAuthors(false);                                          // stop loading (state)
            }
        };

        loadAuthors();                                                          // execute the async function
    }, [query]);                                                                // re-run whenever the query changes

    return {                                                                    // allows components to access the values in this hook
        availableAuthors,
        loadAuthors,
    };
};
import { useEffect, useState, useMemo } from "react";   // Effect = run code on changes, State = stores states/values

import { searchAuthors } from "../api/bigBookApi";                                  // fetch authors from external API (function)
import { getUniqueValues, sortAuthorsAlphabetically, normaliseText } from "../utils/filterBooks";  // removes duplicates & sort alphabetically (helper functions)
import { useDebounce } from "./useDebounce";                                        // delays api requests (to avoid spam for every key press)


const AUTHOR_CACHE_KEY = "Api-default-authors"; // key for key-value pair in localStorage
const PAGE_SIZE = 100;  // allows 100 authors per API request(default loading + search)-> max allowed by the API -> fewer requests, more authors per request

/**
 * Custom hook to manage the logic for fetching and displaying available authors in the FilterSidebar.
 * This hook handles fetching authors from the API, managing search input, and implementing lazy loading as 
 * the user scrolls through the list of authors. It also manages error states and debounces search input to optimize API calls.
 */
type UseAvailableAuthorsReturn = {
    authorSearch: string;
    setAuthorSearch: React.Dispatch<React.SetStateAction<string>>;
    availableAuthors: string[];
    loadAuthors: boolean;
    authorError: string;
    hasMoreAuthors: boolean;
    handleAuthorScroll: (event: React.UIEvent<HTMLDivElement>) => void;
}

/**
 * Saves a list of author names to localStorage.
 * @param authors - The list of author names to save.
 */
const saveAuthorsToStorage = (authors: string[]): void => { // stores growing defaultAuthors list in localStorage (key and value pair)
    localStorage.setItem(AUTHOR_CACHE_KEY, JSON.stringify(authors));
};

/**
* This function is used to combine authors from different sources (like localStorage and API search results) 
* while ensuring that there are no duplicates and that the list remains sorted for better user experience in 
* the filter sidebar.
* @param currentAuthors - The existing list of author names.
* @param newAuthors - The new list of author names to merge.
* @returns A sorted array of unique author names.
 */
const mergeUniqueSortedAuthors = (currentAuthors: string[], newAuthors: string[]): string[] => {
    return sortAuthorsAlphabetically(
        getUniqueValues([...currentAuthors, ...newAuthors])
    );
};

/**
 * Fetches a page of default authors from the API based on the provided offset. 
 * This function is used for the initial loading of authors when the app starts and for loading more authors as the user scrolls through the list.
 * @param offset - The offset for pagination, indicating how many authors to skip before starting to return results. 
 * @returns A promise that resolves to an array of author names fetched from the API.
 */
const fetchDefaultAuthorPage = async (offset: number): Promise<string[]> => {
    console.log("useAvailableAuthors-> Loading default authors:", { number: PAGE_SIZE, offset, });

    const result = await searchAuthors({
        number: PAGE_SIZE,
        offset,
    });

    return getAuthorNames(result.authors);      // extract just the author names from the API response
};

/**
 * Extracts the names of authors from an array of author objects.
 * @param authors - An array of author objects.
 * @returns An array of author names.
 */
const getAuthorNames = (authors: { name: string }[]): string[] => {
    return authors.map((author) => author.name);
};

/**
 * Fetches authors by name from the API.
 * @param search - The search term for filtering authors.
 * @returns A promise that resolves to an array of author names.
 */
const fetchAuthorsByName = async (search: string): Promise<string[]> => {
    console.log("useAvailableAuthors-> Searching authors by name:", { name: search, number: PAGE_SIZE, offset: 0, });

    const result = await searchAuthors({
        name: search,
        number: PAGE_SIZE,
        offset: 0,
    });

    return getAuthorNames(result.authors);
};

/**
 * Loads authors from localStorage if available. This function checks if there is a cached list of authors in localStorage under the specified key.
 * If a cached list is found, it parses the JSON string and returns the array of author names. If no cached authors are available, it returns null.
 * @returns An array of author names if found in localStorage, or null if no cached authors are available.
 */
const loadAuthorsFromStorage = (): string[] | null => {
    const storedAuthors = localStorage.getItem(AUTHOR_CACHE_KEY);

    if (!storedAuthors) {
        return null;
    }

    return JSON.parse(storedAuthors);
};

/**
 * Finds authors in the local list that match the search term.
 * @param authors - The list of author names to search through.
 * @param search - The search term to match against author names.
 * @returns An array of author names that match the search term.
 */
const findLocalAuthorMatches = (authors: string[], search: string): string[] => {
    return authors.filter((author) =>
        normaliseText(author).includes(normaliseText(search))
    );
};

/**
 * Checks if the user has scrolled near the bottom of a scrollable element.
 * @param element - The scrollable element to check.
 * @returns A boolean indicating whether the user is near the bottom of the element.
 */
const isNearBottomOfScroll = (element: HTMLDivElement): boolean => {
    return element.scrollTop + element.clientHeight >= element.scrollHeight - 20;
};

/**
 * Custom hook to manage the logic for fetching and displaying available authors in the FilterSidebar.
 * This hook handles fetching authors from the API, managing search input, and implementing lazy loading as 
 * the user scrolls through the list of authors. It also manages error states and debounces search input to optimize API calls.
 * -> calls ONLY the search-author endpoint (NEVER search-books)
 * -> loads the first author page on app start, and more on scroll
 * 
 * @returns {Object} An object containing the current search text, available authors for display, 
 *                   loading state, error messages, and a scroll handler function.
 * @property {string} authorSearch - The current text in the author search input.
 * @property {string[]} availableAuthors - The list of authors currently available for display based on the search and pagination.
 */
export const useAvailableAuthors = (): UseAvailableAuthorsReturn => {
    // state variables:
    const [authorSearch, setAuthorSearch] = useState("");                   // current USER INPUT text in the author filter text field
    const [searchedAuthors, setSearchedAuthors] = useState<string[]>([]);   // AUTHORS from API -> typed search by name (authorSearch)

    const [defaultAuthors, setDefaultAuthors] = useState<string[]>([]);     // main loaded author list (localStorage if available, expand list on scroll)
    const [nextOffset, setNextOffset] = useState(0);                        // next offset for loading more defaultAuthors (might be capped at 200)
    const [hasMoreAuthors, setHasMoreAuthors] = useState(true);             // flag for if the API has no more defaultAuthors to load (see cap)

    const [loadAuthors, setLoadAuthors] = useState(false);                  // loading indicator (fetching / finished fetching authors (API response))
    const [authorError, setAuthorError] = useState("");                     // error message (for display to the user)

    const debouncedAuthorSearch = useDebounce(authorSearch, 500);           // adds the delay before sending API request (avoid every keystroke)

    // Loads more default authors from the API when the user scrolls to the bottom of the list.
    const loadMoreDefaultAuthors = async (): Promise<void> => {
        if (loadAuthors || !hasMoreAuthors) {                               // if authors are already loading or there are no more authors
            return;                                                         // don't send a new API request
        }

        setLoadAuthors(true);                                               // show the user we are fetching authors
        setAuthorError("");                                                 // reset error messages

        try {
            // fetch the next page of authors from the API using the current offset for pagination (wait for the response)
            const newAuthors = await fetchDefaultAuthorPage(nextOffset);

            // merge the newly fetched authors with the existing list of default authors, ensuring uniqueness and sorting
            setDefaultAuthors((previousAuthors) => { 
                const mergedAuthors = mergeUniqueSortedAuthors(previousAuthors, newAuthors);
                saveAuthorsToStorage(mergedAuthors);

                return mergedAuthors;                                       
            });

            // update the offset for the next page of authors to load (like turning a page)
            setNextOffset((previousOffset) => previousOffset + PAGE_SIZE);

            // if the number of authors returned from the API is less than the page size, we have likely reached the end of the available authors
            if (newAuthors.length < PAGE_SIZE) {
                setHasMoreAuthors(false);                                   // we change the flag so that we don't keep searching
            }

        } catch (error) {
            console.error("useAvailableAuthors-> Could not load default authors:", error);
            setAuthorError("Could not load authors.");

        } finally {
            setLoadAuthors(false);                                          // show the user we are NOT fetching authors                          
        }
    };

   // Initializes the list of authors from localStorage if available, otherwise loads the first page of default authors from the API.
    const initialiseDefaultAuthors = (): void => {
        const cachedAuthors = loadAuthorsFromStorage();

        if (cachedAuthors) {
            setDefaultAuthors(cachedAuthors);                                  // update our authors list for the filter
            setNextOffset(cachedAuthors.length);                               // change page

            console.log("useAvailableAuthors-> Loaded authors from localStorage:", {
                count: cachedAuthors.length, authors: cachedAuthors,
            });

            return;                                                            // if we have cached authors, we skip loading from the API  
        }

        loadMoreDefaultAuthors();                                              // gets the authors from the next page
    };

    // Resets the searched authors and error state when the search input is cleared.
    const resetAuthorSearch = (): void => {
        setSearchedAuthors([]);
        setAuthorError("");
    };

    /**
     * Updates the searched authors state with the provided local matches and clears any error messages.
     * @param localMatches - An array of author names that match the search term from the local cache (localStorage).
     */
    const useLocalMatches = (localMatches: string[]): void => {
        setSearchedAuthors(localMatches);   
        setAuthorError("");
    };
    
    /**
     * @description When the user types in the search field, this function first trims the input and checks if it is empty. 
     *              If the input is empty, it resets the search results and error state. 
     *              If there is input, it checks for local matches in the cached authors list. 
     *              If local matches are found, it updates the state with those matches. 
     *              If no local matches are found, it makes an API call to search for authors by name, merges the results with 
     *              any local matches, and updates the state accordingly. 
     *              It also handles loading states and error messages throughout the process.
     * @param search - The search term entered by the user in the author search input field.
     * @param localMatches - An array of author names that match the search term from the local cache (localStorage).
     * @param ignoreOldRequest - A boolean flag to indicate whether the current search request should be ignored 
     *        (used to prevent updating state with outdated results).
     * @returns void
     */
    const searchAuthorsFromApi = async (
        search: string,
        localMatches: string[],
        ignoreOldRequest: boolean
    ): Promise<void> => {                   // runs when there are no local matches for the user input-> API request to search for authors by name
        setLoadAuthors(true);
        setAuthorError("");

        try {
            const apiMatches = await fetchAuthorsByName(search);                            // send request to api with user input & get the matching authors
            const mergedSearchResults = mergeUniqueSortedAuthors(localMatches, apiMatches); // merge the results from the local matches and the API matches.

            if (!ignoreOldRequest) {                                        // if request outdated (new input since delay), ignore results, don't update state
                setSearchedAuthors(mergedSearchResults);                    // update the searched authors with the merged results (local + API)

                if (mergedSearchResults.length === 0) {                     // if there are no matches at all (local or API), show the user an error message
                    setAuthorError("No authors found.");
                }
            }

            console.log("useAvailableAuthors-> No cached matches, API was called: ", { search, apiMatches, });

        } catch (error) {                   // if error with API request, log it & show error message to user (but still use any local matches if they exist)
            console.error("useAvailableAuthors-> Author search failed:", error);

            if (!ignoreOldRequest) {                                        // if error & the request is outdated, ignore results, don't update state
                setSearchedAuthors(localMatches);

                if (localMatches.length === 0) {                            // if there are no local matches either, show the user an error message
                    setAuthorError("Could not search authors.");
                }
            }

        } finally {
            if (!ignoreOldRequest) {                                        // if the request is outdated, ignore results, don't update state
                setLoadAuthors(false);                                      // stop the "loading authors" message to user (whether success or error)
            }
        }
    };

    /**
     * Toggles the selected state of an author in the filter. 
     * If the author is already selected, it removes it from the selected authors list;
     * if the author is not selected, it adds it to the selected authors list.
     * 
     * The function uses the callback version of the state setter to ensure that it operates on the most up-to-date state value, 
     * which is important in cases where multiple rapid updates might occur (like quickly toggling filters).
     * 
     * @description When the user clicks on an author in the filter list, this function checks if the author is already in the selected authors array.
     * @param ignoreOldRequest - A boolean flag to indicate whether the current search request should be ignored (prevent updating state with outdated results).
     * @returns void
     */
    const runAuthorSearch = async (ignoreOldRequest: boolean): Promise<void> => {
        const trimmedSearch = debouncedAuthorSearch.trim();                     // removes whitespace from user input

        if (trimmedSearch === "") {                                             // if the search input is empty after trimming                       
            resetAuthorSearch();                                                // reset the searched authors and error state, show default authors
            return;
        }

        const localMatches = findLocalAuthorMatches(defaultAuthors, trimmedSearch); // check user input vs already-loaded / cached authors array (localStorage)

        // --------- IMPORTANT -> NEED TO DECIDE: this section is purely to reduce the number of API calls BUT it might miss some authors: ----------
        // ie. if we have "j k rowling", in localstorage, when the user types "row" it finds "rowling" in our cache and so it doesn't make an API request.
        // This potentially misses finding "Rowan Williams" or "Rowena Cory Daniells" if they aren't already in our cache.
        if (localMatches.length > 0) {
            useLocalMatches(localMatches);                  // if author exists in local storage, set searched authors to local matches & reset error messages

            console.log("useAvailableAuthors-> Local author matches found. API not called:", { search: trimmedSearch, localMatches, });
            return;
        }
        // --------- remove up to here only if we want the user to always find new authors on partial inputs -------

        // if no author were found in local storage then this runs: set loading state and call the function to search authors from the API
        await searchAuthorsFromApi(
            trimmedSearch,
            localMatches,
            ignoreOldRequest
        );
        
    };

    /**
     * Initialises the default authors list.
     */
    useEffect(() => { 
        initialiseDefaultAuthors(); 
    }, []);         // runs once on component mount to load the initial list of authors (from localStorage if available, otherwise from the API)


    /**
     * Runs the author search function whenever the debounced search term changes. 
     * It also includes a mechanism to ignore outdated API responses in case the user types a new search term before the previous API call returns.
     */
    useEffect(() => {
        let ignoreOldRequest = false;
        runAuthorSearch(ignoreOldRequest);

        return () => {
            ignoreOldRequest = true;
        };
    }, [debouncedAuthorSearch, defaultAuthors]);    // runs the search when the user input(+delay) changes, or the default authors list changes (could affect local matches)

    // determines which authors to show in the filter: if there is a search term, show searched authors, otherwise show default authors (from lS or API)
    const visibleAuthors = useMemo(() => {          
        if (debouncedAuthorSearch.trim() !== "") {
            return searchedAuthors;
        }

        return defaultAuthors;
    }, [debouncedAuthorSearch, searchedAuthors, defaultAuthors]);   // recalculates visible authors when search term, searched authors, or default authors change

    // If the user has scrolled near the bottom of the list and there is no active search term, it triggers loading more default authors.
    const handleAuthorScroll = (event: React.UIEvent<HTMLDivElement>): void => {
        if (debouncedAuthorSearch.trim() !== "") {
            return;
        }

        if (isNearBottomOfScroll(event.currentTarget)) {
            loadMoreDefaultAuthors();
        }
    };

    // returns the relevant states and functions for use in the component
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
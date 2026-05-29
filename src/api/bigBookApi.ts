import type { SearchBookParams, SearchBooksResponse } from "../types/SearchBook";       // this is a type(ts) not a js runtime value hence "type"
import type { SearchAuthorParams, SearchAuthorResponse } from "../types/SearchAuthor";

const API_KEY = import.meta.env.VITE_BIG_BOOK_API_KEY;                                  // api key from .env
const BASE_URL = import.meta.env.VITE_BIG_BOOK_API_URL;                                 // url from .env


// Converting request parameters into safe console log object (avoid logging our API key)
const paramsForLog = (searchParams: URLSearchParams) => {
    const logParams = Object.fromEntries(searchParams.entries());

    if (logParams["api-key"]) {                                                         // if the console log shows includes our api key
        logParams["api-key"] = "**hiden_api***";                                        // <- change it to this text 
    }

    return logParams;
}

/*  FETCHES MULTIPLE BOOKS -> Calls the API's "search books" endpoint using ONLY active user searches (search bar / filters).
      -> takes the chosen search/ filter/ sort options, turns them into URL query parameters, sends the
      request to the api, and returns the API response as a JSON. */
export const searchBooks = async (params: SearchBookParams, signal?:AbortSignal): Promise<SearchBooksResponse> => {
    const searchParams = new URLSearchParams();                                         // built in JS class for creating and managing URL query params
    searchParams.append("api-key", API_KEY);                                            // adds our api key

    // selected AUTHORS: there can be more than 1
    if (params.authors?.length) {
        searchParams.append("authors", params.authors.join(","));
    }

    // selected GENRES: there can be more than 1
    if (params.genres?.length) {
        searchParams.append("genres", params.genres.join(","));
    }

    // selected MINIMUM RATING
    if (params.minRating !== undefined) {
        searchParams.append("min-rating", String(params.minRating));
    }

    // selected MAXIMUM RATING
    if (params.maxRating !== undefined) {
        searchParams.append("max-rating", String(params.maxRating));
    }

    // selected EARLIEST PUBLISH YEAR
    if (params.earliestPublishYear !== undefined) {
        searchParams.append("earliest-publish-year", String(params.earliestPublishYear));
    }

    // selected LATEST PUBLISH YEAR
    if (params.latestPublishYear !== undefined) {
        searchParams.append("latest-publish-year", String(params.latestPublishYear));
    }

    if (params.sort) {
        searchParams.append("sort", params.sort);
    }

    if (params.sortDirection) {
        searchParams.append("sort-direction", params.sortDirection);
    }

    // unless otherwise specified, this shows 100 results per page -> can: load more/next page/previous page
    searchParams.append("number", String(params.number ?? 100));                                // how many books to return
    searchParams.append("offset", String(params.offset ?? 0));                                  // how many books to skip (pagination)
    
    // query = user input of type string -> the SEARCH BARs (in filter and header)
    if (params.query?.trim()) {
        searchParams.append("query", params.query.trim());                                      // removes white spaces before and after the input text
    }

    console.log("bigBookAPI-> search-books params:", paramsForLog(searchParams));               // <- TESTING: REMOVE LATER

    // ====================== REQUEST TO API: ======================
    const url = `${BASE_URL}/search-books?${searchParams.toString()}`;                          // setting up URL with the chosen parameters    
    const response = await fetch(url, { signal });                                              // waiting for API response & stoping old requests(don't spam API)

    if (!response.ok) {
        throw new Error(`bigBookAPI-> Book search failed, status: ${response.status}`);
    }

    const data = await response.json();

    console.log("bigBookAPI-> search-books response:", data);                                   // <- TESTING: REMOVE LATER

    return data;                            
};

// FETCHES A SINGLE BOOK -> Calls the API's "search books" endpoint to retreive a book by its ID.
export const searchBook = async (id : string) => {
    const response = await fetch(
        `${BASE_URL}/${id}?api-key=${API_KEY}`
    );

    if (!response.ok) {
        throw new Error(`bigBookAPI-> finding a single book by ID failed, status: ${response.status}`);
    }

    return response.json();
}

// FETCHES SIMILAR BOOKS -> Calls the API's "find similar books" endpoint to retreive similar books based on the current book ID.
export const searchSimilarBooks = async (id : string) => {
    const response = await fetch(
        `${BASE_URL}/${id}/similar?api-key=${API_KEY}`
    );

    if (!response.ok) {
        throw new Error(`bigBookAPI-> finding similar books failed, status: ${response.status}`);
    }

    return response.json();
}


// calls search-authors endpoint with input from ONLY the author search bar in the filter sidebar.
export const searchAuthors = async (params: SearchAuthorParams): Promise<SearchAuthorResponse> => {
    const searchParams = new URLSearchParams();     
    searchParams.append("api-key", API_KEY);  

    if (params.name?.trim()){
        searchParams.append("name", params.name.trim());
    }

    searchParams.append("number", String(params.number ?? 100));                                    // how many books to return
    searchParams.append("offset", String(params.offset ?? 0));                                      // how many books to skip (pagination)

    const url = `${BASE_URL}/search-authors?${searchParams.toString()}`;

    console.log("bigBookAPI-> search-authors params:", paramsForLog(searchParams));                 // <- TESTING: REMOVE LATER

    const response = await fetch(url);

    if (!response.ok) {                                                                             // stop is the API request fails
        throw new Error(`bigBookAPI-> searching authors failed, status: ${response.status}`);
    }

    const data = await response.json();                                                             // convert response body to JSON

    console.log("bigBookAPI-> search-authors response:", data);                                     // <- TESTING: REMOVE LATER

    return data;  
};
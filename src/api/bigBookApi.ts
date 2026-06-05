import type { SearchBookParams, SearchBooksResponse } from "../types/SearchBook";       // this is a type(ts) not a js runtime value hence "type"
import type { SearchAuthorParams, SearchAuthorResponse } from "../types/SearchAuthor";

const API_KEY = import.meta.env.VITE_BIG_BOOK_API_KEY;                                  // api key from .env
const BASE_URL = import.meta.env.VITE_BIG_BOOK_API_URL;                                 // url from .env

/** 
 * Converts request parameters into a safe object for console logging (avoids logging the API key)
 * @param searchParams - The URL search parameters
 * @returns A safe object with the search parameters
 */
const paramsForLog = (searchParams: URLSearchParams) => {
    const logParams = Object.fromEntries(searchParams.entries());

    if (logParams["api-key"]) {                                                         // if the console log shows includes our api key
        logParams["api-key"] = "**hiden_api***";                                        // <- change it to this text 
    }

    return logParams;
};

/**
 * FETCHES MULTIPLE BOOKS from the "search books" endpoint.
 * 
 * @param params - An object containing the ACTIVE search and filter parameters chosen by the user in the UI, 
 *        to be converted into URL query parameters for the API request which may include:
 *         - query: the search bar input (string)
 *         - authors: the selected authors (array of strings)
 *         - genres: the selected genres (array of strings)
 *         - minRating: the selected minimum rating (number)
 *         - maxRating: the selected maximum rating (number)
 *         - earliestPublishYear: the selected earliest publish year (number)
 *         - latestPublishYear: the selected latest publish year (number)
 *         - sort: the selected sort option (string: "rating" or "publish-date")
 *         - sortDirection: the selected sort direction (string: "ASC" or "DESC")
 * 
 * @returns the API response as a JSON object, which includes the list of books matching the search 
 *          and filter criteria, as well as pagination info (available, number, offset).
 */
export const searchBooks = async (params: SearchBookParams, signal?: AbortSignal): Promise<SearchBooksResponse> => {
    const searchParams = new URLSearchParams();                                         // built in JS class for creating and managing URL query params
    searchParams.append("api-key", API_KEY);                                            // adds our api key
    
    // query = user input of type string -> the SEARCH BARs (in filter and header)
    if (params.query?.trim()) { searchParams.append("query", params.query.trim()); }

    // selected AUTHORS: there can be more than 1
    if (params.authors?.length) { searchParams.append("authors", params.authors.join(",")); }

    // selected GENRES: there can be more than 1
    if (params.genres?.length) { searchParams.append("genres", params.genres.join(",")); }

    // selected MINIMUM RATING
    if (params.minRating !== undefined) { searchParams.append("min-rating", String(params.minRating)); }

    // selected MAXIMUM RATING
    if (params.maxRating !== undefined) { searchParams.append("max-rating", String(params.maxRating)); } 

    // selected EARLIEST PUBLISH YEAR
    if (params.earliestPublishYear !== undefined) { searchParams.append("earliest-publish-year", String(params.earliestPublishYear));}

    // selected LATEST PUBLISH YEAR
    if (params.latestPublishYear !== undefined) { searchParams.append("latest-publish-year", String(params.latestPublishYear));}

    if (params.sort) { searchParams.append("sort", params.sort); }

    if (params.sortDirection) { searchParams.append("sort-direction", params.sortDirection); }

    // unless otherwise specified, this shows 10 results per page -> can: load more/next page/previous page
    searchParams.append("number", String(params.number ?? 40));                                 // how many books to return
    searchParams.append("offset", String(params.offset ?? 0));                                  // how many books to skip (pagination)

    console.log("bigBookAPI-> search-books params:", paramsForLog(searchParams));               // <- TESTING: REMOVE LATER

    // ====================== REQUEST TO API: ======================   
    const response = await fetch(`${BASE_URL}/search-books?${searchParams.toString()}`, { signal });  // sending request and waiting for API response

    if (!response.ok) { 
        throw new Error(`bigBookAPI-> Book search failed, status: ${response.status}`); 
    }

    const data = await response.json();

    console.log("bigBookAPI-> search-books response:", data);                                   // <- TESTING: REMOVE LATER

    return data;                            
};

/**
 * FETCHES A SINGLE BOOK from the "search books" endpoint by its ID 
 * (called when user clicks on a book to see details).
 * 
 * @param id - The ID of the book to fetch details for.
 * @returns the API response as a JSON object, which includes the details of the book with the specified ID.
 */
export const searchBook = async (id : string) => {
    const response = await fetch(`${BASE_URL}/${id}?api-key=${API_KEY}`);

    if (!response.ok) {
        throw new Error(`bigBookAPI-> finding a single book by ID failed, status: ${response.status}`);
    }

    return response.json();
};

/**
 * FETCHES SIMILAR BOOKS from the "find similar books" endpoint by a book ID
 * (called when user clicks on a book to see details, to show similar book recommendations).
 * @param id - The ID of the book to find similar books for.
 * @returns the API response as a JSON object, which includes a list of similar
 *  books based on the specified book ID.
 */
export const searchSimilarBooks = async (id : string) => {
    const response = await fetch(`${BASE_URL}/${id}/similar?api-key=${API_KEY}`);

    if (!response.ok) {
        throw new Error(`bigBookAPI-> finding similar books failed, status: ${response.status}`);
    }

    return response.json();
};

/**
 * FETCHES AUTHORS from the "search authors" endpoint based on the user's input in the 
 * AUTHOR SEARCH BAR in the filter sidebar. This is a separate endpoint from the "search books" 
 * endpoint, because the author search bar has an autocomplete feature that requires more 
 * flexible searching (e.g. partial name matches) and faster responses, which is better handled 
 * by a dedicated endpoint.
 * 
 * @param params - An object containing the ACTIVE search parameters for authors, to be converted 
 *        into URL query parameters for the API request which may include:
 *         - name: the search bar input for authors (string)
 *         - number: how many authors to return (number)
 *         - offset: how many authors to skip (number, for pagination)
 * @returns 
 */
export const searchAuthors = async (params: SearchAuthorParams): Promise<SearchAuthorResponse> => {
    const searchParams = new URLSearchParams();     
    searchParams.append("api-key", API_KEY);  

    if (params.name?.trim()){
        searchParams.append("name", params.name.trim());
    }

    searchParams.append("number", String(params.number ?? 100));                                    // how many authors to return
    searchParams.append("offset", String(params.offset ?? 0));                                      // how many authors to skip (pagination)

    console.log("bigBookAPI-> search-authors params:", paramsForLog(searchParams));                 // <- TESTING: REMOVE LATER

    const response = await fetch(`${BASE_URL}/search-authors?${searchParams.toString()}`);          // sending request and waiting for API response

    if (!response.ok) {                                                                             // stop is the API request fails
        throw new Error(`bigBookAPI-> searching authors failed, status: ${response.status}`);
    }

    const data = await response.json();                                                             // convert response body to JSON

    console.log("bigBookAPI-> search-authors response:", data);                                     // <- TESTING: REMOVE LATER

    return data;  
};
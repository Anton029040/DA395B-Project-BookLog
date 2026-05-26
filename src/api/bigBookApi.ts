import type { SearchBookParams } from "../types/SearchBookParams";  // this is a type(ts) not a js runtime value hence "type"

const API_KEY = import.meta.env.VITE_BIG_BOOK_API_KEY;  // api key from .env
const BASE_URL = import.meta.env.VITE_BIG_BOOK_API_URL; // url from .env

/* A reusable function for calling the API's "search books" endpoint.
      takes the chosen search/ filter/ sort options, turns them into URL query parameters, sends the
      request to the api, and returns the API response as a JSON. 
      
      NOTE: whilst the api doesn't have the capability of returning a list of genres, each book
            does contain a genre and can therefore be filtered by genre. To use genre as a
            filter a hard-coded list of genres is required */
export const searchBooks = async (params: SearchBookParams) => {

    const searchParams = new URLSearchParams();     // built in JS class for creating and managing URL query params
    searchParams.append("api-key", API_KEY);        
    
    /*********************************************************
                Filter List checks for API-Query
     *********************************************************/
    // query = user input of type string -> the SEARCH BAR in the header
    if (params.query){
        searchParams.append("query", params.query);
    }

    // selected AUTHORS: there can be more than 1
    if (params.authors && params.authors.length > 0){
        searchParams.append("authors", params.authors.join(","));
    }

    // selected GENRES: there can be more than 1
    if (params.genres && params.genres.length > 0){
        searchParams.append("genres", params.genres.join(","));
    }

    // selected MINIMUM RATING
    if (params.minRating !== undefined){
        searchParams.append("min-rating", String(params.minRating));
    }

    // selected MAXIMUM RATING
    if (params.maxRating !== undefined){
        searchParams.append("max-rating", String(params.maxRating));
    }

    // selected EARLIEST PUBLISH YEAR
    if (params.earliestPublishYear !== undefined){
        searchParams.append("earliest-publish-year", String(params.earliestPublishYear));
    }

    // selected LATEST PUBLISH YEAR
    if (params.latestPublishYear !== undefined){
        searchParams.append("latest-publish-year", String(params.latestPublishYear));
    }

    /*********************************************************
                Sorting drop-down checks for API-Query
     *********************************************************/

    // add sorting checks here: alphabetical(both ways), genre, title, author, publish year

    /*********************************************************
                        Final API-Query
     *********************************************************/
    // unless otherwise specified, this shows 10 results (books) per page -> can: load more/next page/ previous page
    searchParams.append("number", String(params.number ?? 10)); // how many books to return
    searchParams.append("offset", String(params.offset ?? 0));  // how many books to skip (pagination)

    // send query and wait for a response
    const response = await fetch(
        `${ BASE_URL }/search-books?${ searchParams.toString() }`
    );

    if (!response.ok) {
        throw new Error("Failure Searching Books, see bigBookApi");
    }

    return response.json();
};

export const searchBook = async (id : string) => {
    const response = await fetch(
        `${BASE_URL}/${id}?api-key=${API_KEY}`
    );

    if (!response.ok) {
        throw new Error("Failure Finding Book, see bigBookApi");
    }

    return response.json();
}

export const searchSimilarBooks = async (id : string) => {
    const response = await fetch(
        `${BASE_URL}/${id}/similar?api-key=${API_KEY}`
    );

    if (!response.ok) {
        throw new Error("Failure Finding Similar Books, see bigBookApi");
    }

    return response.json();
}
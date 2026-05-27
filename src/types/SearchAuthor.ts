import type { Author } from "./ApiBook";

// query parameters accepted by the search-authors enpoint
export interface SearchAuthorParams {
    name?: string;
    number?: number;
    offset?: number;
}

// response returned from the search-authors endpoint
export interface SearchAuthorResponse {
    authors: Author[];
}
// The search options sent to the api (for filtering and sorting) - a request/query to the api to retrieve information

/* ===================================
        Request / Query parameters
   =================================== */
export interface SearchBookParams {
    query?: string;                     // search query ie: "books about wizards"
    authors?: string[];                 // A comma-separated list of author ids or names. Only books from any of the given authors will be returned. 
    genres?: string[];                  // A comma-separated list of genres. Only books from any of the given genres will be returned.
    minRating?: number;                 // The minimum rating the book must have gotten in the interval [0,1].
    maxRating?: number;                 // The maximum rating the book must have gotten in the interval [0,1].
    earliestPublishYear?: number;       // The books must have been published after this year.
    latestPublishYear?: number;         // The books must have been published before this year.
    sort?: "rating" | "publish-date";   // The sorting criteria (publish-date or rating).
    sortDirection?: "ASC" | "DESC";     // Whether to sort ascending or descending (ASC or DESC).
    number?: number;                    // The number of books to return in range [1,100]
    offset?: number;                    // The number of books to skip in range [0,1000]
}

/* ===================================
                API Response
   =================================== */
   export interface SearchBooksResponse {
    available: number;
    number: number;
    offset: number;
    books: ApiBook[][];
   }
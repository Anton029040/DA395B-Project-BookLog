// A book object returned from the API (fileds with ? are optional)
export interface ApiBook {
    id: number;
    title: string;
    subtitle?: string;
    image?: string;
    identifiers?: Identifiers;
    authors?: Author[];
    publish_date?: number;
    number_of_pages?: number;
    description?: string;
    rating?: Rating;
}

// returns nested objects in the API "get-book-information" endpoint (single-book)
export interface Identifiers {
    open_library_id?: string;
    isbn_10?: string;
    isbn_13?: string;
}

// returns Author object for both "book" and "search-authors" endpoints
export interface Author {
    id: number;
    name: string;
}

// returns the API rating object (it uses values between 0-1, not 5 like we have)
export interface Rating {
    average: number;
}
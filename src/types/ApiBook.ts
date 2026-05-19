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

// nested objects in the API Get Book Information call
export interface Identifiers {
    open_library_id?: string;
    isbn_10?: string;
    isbn_13?: string;
}

export interface Author {
    id: number;
    name: string;
}

export interface Rating {
    average: number;
}
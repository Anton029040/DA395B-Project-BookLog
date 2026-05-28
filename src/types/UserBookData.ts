import type { Author, Rating } from "./ApiBook";

// User (localStorage source) Book object
export interface UserBookData {
    bookId: number;
    status: "none" | "tbr" | "read";
    authors? : Author[];
    image?: string;
    title: string;
    rating?: Rating;
}
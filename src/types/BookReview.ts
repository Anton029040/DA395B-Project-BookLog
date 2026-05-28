import type { Author, Rating } from "./ApiBook";

export interface BookReview {
    id: number;
    title: string;
    authors? : Author[];
    image?: string;
    rating?: Rating;
    description?: string;
    number_of_pages?: number;
    publish_date?: number;
}
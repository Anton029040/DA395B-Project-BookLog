// Handles all communication with the external API

// importing the Big Book API key and URL from .env
const API_KEY = import.meta.env.VITE_BIG_BOOK_API_KEY;
const BASE_URL = import.meta.env.VITE_BIG_BOOK_API_URL;

export async function getBooks(query: string) {
    const url = new URL(`${BASE_URL}/search-books`);
    url.searchParams.append("query", query);
    url.searchParams.append("api-key", API_KEY);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch books");
    }

    return await response.json();
}
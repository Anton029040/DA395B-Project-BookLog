import type { BookReview } from "../types/BookReview";

export {};  /* placeholder for testing */



/**
 * Method for saving a book/review. 
 * @param review The review of the book
 * @param rating The rating of the book
 * @param book The data of the book
 * @returns True if saving the review was succesfful. False if not.
 */
export function saveReview(review : string, rating : string, book : BookReview) {
    console.log(book.rating);
    let newReview = {
        review, 
        rating, 
        book,
    };

    let successfulSave = false;
    const key = "bookReviews";
    const reviews = getList(key);

    let found = false;

    for (let i = 0; i < reviews.length; i++) {
        console.log(reviews[i]);
        if (reviews[i].book.id === book.id) {
            reviews[i] = newReview;
            found = true;
            successfulSave = true;
            break;
        }
    }

    if (!found) {
        reviews.push(newReview);
        successfulSave = true;
    }
  
    storeArray(key, reviews);

    return successfulSave;
}

/**
 * Method for saving a book/review. 
 * @param bookId The id of the book to be reviewd
 * @returns True if saving the review was succesfful. False if not.
 */
export function removeReview(bookId : number) {
    console.log(bookId);
    const key = "bookReviews";
    const reviews = getList(key);
    console.log(reviews);
    let removed = false;

    for (let i = 0; i < reviews.length; i++) {
        if (reviews[i].book.id === bookId) {
            reviews.splice(i, 1);
            
            removed = true;
            break;
        }
    }

    storeArray(key, reviews);

    if (!removed) {
        alert("The book does not have a review or rating to remove")
    }

    return removed;
}

/**
 * Function that collects a review based on a books ID
 * @param bookId The ID of the book
 * @returns The review of the book
 */
export function getReview(bookId : string) {
    const key = "bookReviews";
    let reviews = getList(key);
    let review = "";

    for (let i = 0; i < reviews.length; i++) {
        if (reviews[i].book.id === Number(bookId)) {
            review = reviews[i].review;
            break;
        }
    }

    return review;
}

/**
 * Function that collects the rating based on a books ID
 * @param bookId The id of the book
 * @returns The rating of the book
 */
export function getRating(bookId : string) {
    const key = "bookReviews";
    let reviews = getList(key);
    let rating = "";

    for (let i = 0; i < reviews.length; i++) {
        if (reviews[i].book.id === Number(bookId)) {
            rating = reviews[i].rating;
            break;
        }
    }

    return rating;   
}

export function getBookReviews() {
    const key = "bookReviews";
    let reviews = getList(key);
    return reviews;
}

/**
 * Method for retrieving items from local storage
 * @param key The key to the local storage
 */
function getList(key : string) {
    let list = localStorage.getItem(key);
    return list ? JSON.parse(list) : [] ;
}

/**
 * Method for saving 
 * @param key The key to the local storage
 * @param list The list to be stored
 */
function storeArray(key : string, list : []) {
    let listToStore = JSON.stringify(list);
    localStorage.setItem(key, listToStore);
}
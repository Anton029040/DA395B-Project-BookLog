export {};  /* placeholder for testing */

/**
 * Method for saving a book/review. 
 * @param title The title of the book
 * @param authors A list of string containing the authrors names
 * @param imageURL A string containing the url to the image
 * @param review The review of the book
 * @param rating The rating of the book
 * @param bookId The id of the book to be reviewd
 * @returns True if saving the review was succesfful. False if not.
 */
export function saveReview(title : string, authors : [], imageURL : string, review : string, rating : string, bookId : number) {
    let newReview = {review, rating, bookId};
    let successfulSave = false;
    const key = "bookReviews";
    const reviews = getList(key);

    let found = false;

    for (let i = 0; i < reviews.length; i++) {
        if (reviews[i].bookId === bookId) {
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
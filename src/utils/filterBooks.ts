//  extract author Surname from their Full name:
export const getSurname = (fullName: string) => {

    const seperatedName = fullName.trim().split(" ");           // removes whitespaces, splits words by a space, stores them in an array
    return seperatedName[seperatedName.length-1].toLowercase(); // only returns the last word and makes it lower case

    /* example: " J. K. Rowling " 
        -> trim(): removes spaces before and after = "J. K. Rowling"
        -> split(" "): splits the string into an array using spaces as breakpoints = ["J.", "K.", "Rowling"]
            this is stored in "seperatedName"
        -> lenght-1: 3 (["J.", "K.", "Rowling"]) -1 = 2
            seperatedName[2] = word at position 2 in the array = "Rowling"
        -> toLowerCase: converts all letters to lower case = "rowling"
            this makes sure all names are compared as equals 
    */
};

// sorting authors alphabetically by surname
export const sortAuthorsBySurname = (authors: string[]) => {
    return [...authors].sort(a, b) =>
        getSurname(a).localeCompare(getSurname(b));
};

export const groupAuthorsBySurnameLetter = (authors)
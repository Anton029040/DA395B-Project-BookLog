//  extract author Surname from their Full name:
export const getSurname = (fullName: string) => {
    const seperatedName = fullName.trim().split(" ");           // removes whitespaces, splits words by a space, stores them in an array
    return seperatedName[seperatedName.length-1].toLowerCase(); // only returns the last word and makes it lower case

    /* example: " J. K. Rowling " 
        -> trim(): removes spaces before and after = "J. K. Rowling"
        -> split(" "): splits the string into an array using spaces as breakpoints = ["J.", "K.", "Rowling"]
            this is stored in "seperatedName"
        -> lenght-1: 3 (["J.", "K.", "Rowling"]) -1 = 2
            seperatedName[2] = word at position 2 in the array = "Rowling"
        -> toLowerCase: converts all letters to lower case = "rowling"
            this avoids case sensistivity issues. */
};

// sorting authors alphabetically by surname
export const sortAuthorsBySurname = (authors: string[]) => {
    return [...authors].sort((a, b) =>
        getSurname(a).localeCompare(getSurname(b)));
};

// getting unique author names (avoiding duplicates)
export const getUniqueValues = (values: string[]) => {
    return [...new Set(values)];
};



































/* ===================================================
    OLD METHODS: REMOVE BEFORE HAND-IN IF NOT USED
====================================================== */
// sets up the letters and sorts authors into letters by their surnames
/* Explanation:
        -> reduce(): takes an array and reduces it to one final result 
            ["J. K. Rowling", "J. R. R. Tolkien"] becomes
            { 
                R: ["J. K. Rowling"],
                T: ["J. R. R. Tolkien"]
            } 
        
        -> Record: tells typescript what the final object should look like
            {
                [key: string]: string[] (value)
            }    
                
        -> (groups, author) => : callback that runs once for each author 
            groups is the object being built, starts as {}
            author is the current author in the loop
            
        this code takes the current groups object, adds the current author into the correct letter group,
        and then returns the group object.
    */
export const groupAuthorsBySurnameLetter = (authors: string[]) => {
    return authors.reduce <Record <string, string[]> > ( 
        (groups, author) => {
            const surname = getSurname(author);
            const firstLetter = surname.charAt(0).toUpperCase();

            if (!groups[firstLetter]) {
                groups[firstLetter] = [];
            }

            groups[firstLetter].push(author);

            return groups;
        }, {}   // <- {} this is the initial value for the "reduce" object (required)
    );
};

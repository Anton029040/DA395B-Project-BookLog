//  removes "." and extra spaces = user input doesn't need to include dots ("J K Rowling" vs "J. K. Rowling")
export const normaliseText = (value: string) => {
    return value
        .replaceAll(".", "")                    // remove dots
        .replace(/\s+/g, " ")                   // replace multiple spaces with one space
        .trim()                                 // remove spaces before and after text
        .toLowerCase();                         // remove case-sensitivity (converts to lowercase)
};

// sorting authors alphabetically
export const sortAuthorsAlphabetically = (authors: string[]) => {
    return [...authors].sort((a, b) =>
        (a).localeCompare(b));
};

// getting unique author names (removes duplicates from the array)
export const getUniqueValues = (values: string[]) => {
    return [...new Set(values)];
};
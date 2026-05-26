//  removes "." and extra spaces = user input doesn't need to include dots ("J K Rowling" vs "J. K. Rowling")
export const normaliseText = (value: string) => {
    return value
        .replaceAll(".", "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
};

// sorting authors alphabetically
export const sortAuthorsAlphabetically = (authors: string[]) => {
    return [...authors].sort((a, b) =>
        (a).localeCompare(b));
};

// getting unique author names (avoiding duplicates)
export const getUniqueValues = (values: string[]) => {
    return [...new Set(values)];
};
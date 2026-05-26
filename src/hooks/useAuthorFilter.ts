import { sortAuthorsBySurname } from "../utils/filterBooks";

interface useAuthorFilterProps {
    availableAuthors: string[];
    selectedAuthors: string[];
}

export const useAuthorFilter = ({ availableAuthors,}: useAuthorFilterProps) => {
    // store current author search
}
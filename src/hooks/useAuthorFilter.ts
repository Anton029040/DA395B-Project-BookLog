import { useState } from "react";

import { sortAuthorsBySurname } from "../utils/filterBooks";

// expected incoming data from component:
interface useAuthorFilterProps {
    availableAuthors: string[];
}

export const useAuthorFilter = ({ availableAuthors,}: useAuthorFilterProps) => {
    // store current author search
}
import { useEffect, useState } from "react";

// re-useable logic for adding a delay to a users api request (to minimize api calls)
export const useDebounce = <T, >(value: T, ) => {
    const [delayValue, setDelayValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDelayValue(value);
        }, 500);                                // hardcoded delay

        return () => {
            clearTimeout(timer);
        };

    }, [value]);

    return delayValue;
};
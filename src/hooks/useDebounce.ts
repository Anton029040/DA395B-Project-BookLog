import { useEffect, useState } from "react";

// adds a delay to a users input (changing value) before triggering api logic (to minimize api calls)
export const useDebounce = <T, >(value: T, delay = 300) => {
    const [delayValue, setDelayValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDelayValue(value);
        }, delay);                                // hardcoded delay of 300ms

        return () => {
            clearTimeout(timer);                  // clear old timer if value changes before 500ms
        };

    }, [value, delay]);

    return delayValue;
};
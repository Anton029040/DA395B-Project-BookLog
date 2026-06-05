import { useEffect, useState } from "react";

/**
 * Custom hook that introduces a delay before updating a value.
 * @param value The value to debounce.
 * @param delay The delay in milliseconds.
 * @returns The debounced value.
 */
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
import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debounceValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    //   update debounce value after the delay
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    // clear the timeout
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debounceValue;
};

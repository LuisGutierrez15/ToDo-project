import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

/**
 * Custom hook for debounced values to optimize search/filter performance.
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for memoized callbacks with dependencies
 */
export const useMemoizedCallback = <TArgs extends readonly unknown[], TReturn>(
  callback: (...args: TArgs) => TReturn,
  deps: React.DependencyList
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, deps);
};

/**
 * Custom hook for computed values with expensive calculations
 */
export const useComputedValue = <T>(
  computeFn: () => T,
  deps: React.DependencyList
): T => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(computeFn, deps);
};

/**
 * Custom hook for throttling function calls
 */
export const useThrottle = <TArgs extends readonly unknown[]>(
  callback: (...args: TArgs) => void,
  delay: number
) => {
  const lastRun = useRef(Date.now());

  return useCallback((...args: TArgs) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

export { useDebounce as default };

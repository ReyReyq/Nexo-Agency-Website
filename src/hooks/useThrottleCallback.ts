import { useCallback, useEffect, useRef } from 'react';

export function useThrottleCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 16 // ~60fps
): T {
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount or when dependencies change
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [callback, delay]);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRunRef.current >= delay) {
        lastRunRef.current = now;
        callback(...args);
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          lastRunRef.current = Date.now();
          callback(...args);
          timeoutRef.current = null;
        }, delay - (now - lastRunRef.current));
      }
    },
    [callback, delay]
  ) as T;
}

export default useThrottleCallback;

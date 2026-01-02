import { useCallback, useEffect, useRef } from 'react';

export function useThrottleCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 16 // ~60fps
): T {
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Store callback in ref to avoid stale closures and unnecessary effect reruns
  const callbackRef = useRef<T>(callback);

  // Update callback ref on every render (no effect needed)
  callbackRef.current = callback;

  // Cleanup timeout on unmount only
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []); // Empty deps - only cleanup on unmount

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRunRef.current >= delay) {
        lastRunRef.current = now;
        callbackRef.current(...args);
      } else if (!timeoutRef.current) {
        const remaining = delay - (now - lastRunRef.current);
        timeoutRef.current = setTimeout(() => {
          lastRunRef.current = Date.now();
          callbackRef.current(...args);
          timeoutRef.current = null;
        }, remaining);
      }
    },
    [delay] // Only depend on delay, callback is accessed via ref
  ) as T;
}

export default useThrottleCallback;

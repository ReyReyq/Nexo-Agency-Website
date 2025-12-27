import { useState, useEffect, useRef, RefObject } from 'react';

/**
 * Hook to determine if a component should pause animations.
 * Returns false (paused) when:
 * - Element is scrolled off-screen (using IntersectionObserver)
 * - Tab is hidden (using visibilitychange event)
 *
 * @param containerRef - Ref to the container element to observe
 * @param options - Configuration options
 * @returns boolean - true if visible and should animate, false if paused
 */
export function useVisibilityPause(
  containerRef: RefObject<HTMLElement>,
  options: {
    threshold?: number;
    rootMargin?: string;
  } = {}
): boolean {
  const { threshold = 0.1, rootMargin = '100px' } = options;

  const [isInViewport, setIsInViewport] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(() =>
    typeof document !== 'undefined' ? document.visibilityState === 'visible' : true
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  // IntersectionObserver for viewport visibility
  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [containerRef, threshold, rootMargin]);

  // Tab visibility listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Only visible if both in viewport AND tab is visible
  return isInViewport && isTabVisible;
}

export default useVisibilityPause;

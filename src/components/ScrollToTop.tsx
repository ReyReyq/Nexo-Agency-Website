import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from '@/lib/lenis';

/**
 * ScrollToTop component - handles scroll restoration on route changes
 *
 * Behavior:
 * - When navigating to a new page (pathname changes): scrolls to top
 * - When navigating with a hash (e.g., /contact#contact-form): scrolls to that element
 * - Uses Lenis smooth scrolling for a polished experience
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    // Small delay to ensure DOM is ready after route change
    const timeoutId = setTimeout(() => {
      if (hash) {
        // If there's a hash, scroll to that element
        const element = document.querySelector(hash) as HTMLElement | null;
        if (element) {
          if (lenis) {
            lenis.scrollTo(element, { offset: 0, duration: 0.8, immediate: false });
          } else {
            // Fallback for when Lenis isn't ready
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      } else {
        // No hash: scroll to top
        if (lenis) {
          lenis.scrollTo(0, { offset: 0, duration: 0.8, immediate: false });
        } else {
          // Fallback for when Lenis isn't ready
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [pathname, hash, lenis]);

  return null; // This component doesn't render anything
}

export default ScrollToTop;

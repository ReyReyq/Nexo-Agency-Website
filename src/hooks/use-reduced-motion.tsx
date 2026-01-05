import * as React from "react";

/**
 * Hook to detect if the user prefers reduced motion.
 *
 * Uses the prefers-reduced-motion media query to detect user preference.
 * Returns true if the user has enabled reduced motion in their OS settings.
 *
 * Usage:
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 *
 * // In Framer Motion components:
 * animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
 * transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState<boolean>(() => {
    // Safe default for SSR - assume no preference
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Get the current reduced motion preference without React state.
 * Useful for one-time checks in effects or callbacks.
 */
export function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

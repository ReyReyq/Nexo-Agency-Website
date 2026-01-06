import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Hook to detect mobile viewport
 * Returns true if viewport is mobile, false if desktop, undefined if not yet determined
 * For SSR-safe code, check for undefined before rendering heavy components
 */
export function useIsMobile(): boolean | undefined {
  // Initialize with synchronous check if window is available (client-side)
  const getInitialValue = (): boolean | undefined => {
    if (typeof window === 'undefined') return undefined;
    return window.innerWidth < MOBILE_BREAKPOINT;
  };

  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(getInitialValue);

  const onChange = React.useCallback(() => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
  }, []);

  React.useEffect(() => {
    // Double-check on mount in case initial value was undefined (SSR)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [onChange]);

  return isMobile;
}

/**
 * SSR-safe version that defaults to a specific value when unknown
 * Use this when you need a boolean and can't handle undefined
 */
export function useIsMobileSafe(defaultValue: boolean = true): boolean {
  const isMobile = useIsMobile();
  return isMobile ?? defaultValue;
}

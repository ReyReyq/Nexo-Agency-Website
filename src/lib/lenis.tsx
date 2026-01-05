import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from 'react';
import Lenis from 'lenis';

// Lenis context
const LenisContext = createContext<Lenis | null>(null);

// Global event for preloader completion
export const PRELOADER_COMPLETE_EVENT = 'nexo:preloader-complete';

// Helper to dispatch preloader complete event
export const dispatchPreloaderComplete = () => {
  window.dispatchEvent(new CustomEvent(PRELOADER_COMPLETE_EVENT));
};

// Hook to access Lenis instance
export const useLenis = () => {
  const lenis = useContext(LenisContext);
  return lenis;
};

// Hook for scroll-to functionality
export const useScrollTo = () => {
  const lenis = useLenis();

  return (target: string | HTMLElement | number, options?: {
    offset?: number;
    duration?: number;
    immediate?: boolean;
  }) => {
    if (!lenis) return;
    lenis.scrollTo(target, {
      offset: options?.offset ?? 0,
      duration: options?.duration ?? 1.2,
      immediate: options?.immediate ?? false,
    });
  };
};

// Hook to stop/start scroll
export const useScrollControl = () => {
  const lenis = useLenis();

  return {
    stop: () => lenis?.stop(),
    start: () => lenis?.start(),
  };
};

interface LenisProviderProps {
  children: ReactNode;
  options?: {
    duration?: number;
    easing?: (t: number) => number;
    orientation?: 'vertical' | 'horizontal';
    gestureOrientation?: 'vertical' | 'horizontal' | 'both';
    smoothWheel?: boolean;
    wheelMultiplier?: number;
    touchMultiplier?: number;
    infinite?: boolean;
  };
}

export const LenisProvider = ({ children, options = {} }: LenisProviderProps) => {
  // Use state instead of ref so context updates trigger re-renders
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(false);
  // Store options in ref to avoid dependency issues
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const [isTabVisible, setIsTabVisible] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.visibilityState === 'visible';
    }
    return true;
  });

  // Start RAF loop
  const startRafLoop = useCallback((lenisInstance: Lenis) => {
    if (isRunningRef.current) return;

    isRunningRef.current = true;

    function raf(time: number) {
      if (!isRunningRef.current) return;

      lenisInstance.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);
  }, []);

  // Stop RAF loop
  const stopRafLoop = useCallback(() => {
    if (!isRunningRef.current) return;

    isRunningRef.current = false;

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

    const opts = optionsRef.current;

    // Initialize Lenis with optimized defaults
    const lenisInstance = new Lenis({
      duration: opts.duration ?? 1.2,
      easing: opts.easing ?? ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
      orientation: opts.orientation ?? 'vertical',
      gestureOrientation: opts.gestureOrientation ?? 'vertical',
      smoothWheel: opts.smoothWheel ?? true,
      wheelMultiplier: opts.wheelMultiplier ?? 1,
      touchMultiplier: opts.touchMultiplier ?? 2,
      infinite: opts.infinite ?? false,
    });

    // Set state to trigger re-render and update context
    setLenis(lenisInstance);

    // Handle visibility change - pause RAF when tab is hidden
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      stopRafLoop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      lenisInstance.destroy();
      setLenis(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopRafLoop]); // Only run once on mount, options are read from ref

  // Control RAF loop based on visibility and lenis instance
  useEffect(() => {
    if (isTabVisible && lenis) {
      startRafLoop(lenis);
    } else {
      stopRafLoop();
    }
  }, [isTabVisible, lenis, startRafLoop, stopRafLoop]);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
};

export default LenisProvider;

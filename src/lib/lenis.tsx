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
    smoothTouch?: boolean;
    wheelMultiplier?: number;
    touchMultiplier?: number;
    infinite?: boolean;
  };
}

export const LenisProvider = ({ children, options = {} }: LenisProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(false);
  // Note: We no longer block scroll during preloader - users should be able to scroll
  // while the preloader animation plays. The preloader is a fixed overlay on top.
  const [isTabVisible, setIsTabVisible] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.visibilityState === 'visible';
    }
    return true;
  });

  // Start RAF loop
  const startRafLoop = useCallback(() => {
    if (isRunningRef.current || !lenisRef.current) return;

    isRunningRef.current = true;

    function raf(time: number) {
      if (!isRunningRef.current || !lenisRef.current) return;

      lenisRef.current.raf(time);
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

    // Initialize Lenis with optimized defaults
    const lenis = new Lenis({
      duration: options.duration ?? 1.2,
      easing: options.easing ?? ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
      orientation: options.orientation ?? 'vertical',
      gestureOrientation: options.gestureOrientation ?? 'vertical',
      smoothWheel: options.smoothWheel ?? true,
      smoothTouch: options.smoothTouch ?? false, // Better mobile performance
      wheelMultiplier: options.wheelMultiplier ?? 1,
      touchMultiplier: options.touchMultiplier ?? 2,
      infinite: options.infinite ?? false,
    });

    lenisRef.current = lenis;

    // Handle visibility change - pause RAF when tab is hidden
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      stopRafLoop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [options, stopRafLoop]);

  // Control RAF loop based on visibility only (scroll works even during preloader)
  useEffect(() => {
    const shouldRun = isTabVisible && lenisRef.current !== null;

    if (shouldRun) {
      startRafLoop();
    } else {
      stopRafLoop();
    }
  }, [isTabVisible, startRafLoop, stopRafLoop]);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
};

export default LenisProvider;

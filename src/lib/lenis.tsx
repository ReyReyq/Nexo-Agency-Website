import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';

// Lenis context
const LenisContext = createContext<Lenis | null>(null);

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

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [options]);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
};

export default LenisProvider;

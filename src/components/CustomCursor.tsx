import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { useThrottleCallback } from "../hooks/useThrottleCallback";

const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInHero, setIsInHero] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isPreloaderActive, setIsPreloaderActive] = useState(true);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Cache hero section reference and bounds
  const heroSectionRef = useRef<Element | null>(null);
  const heroBoundsRef = useRef<DOMRect | null>(null);

  // RAF reference for cleanup
  const rafRef = useRef<number | null>(null);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Update cached hero bounds
  const updateHeroBoundsCallback = useCallback(() => {
    if (!heroSectionRef.current) {
      heroSectionRef.current = document.querySelector('section#home');
    }
    if (heroSectionRef.current) {
      heroBoundsRef.current = heroSectionRef.current.getBoundingClientRect();
    }
  }, []);

  // Throttle scroll updates to reduce layout thrashing
  const updateHeroBounds = useThrottleCallback(updateHeroBoundsCallback, 100);

  // Check if preloader is still in DOM - optimized observer
  useEffect(() => {
    const preloader = document.querySelector('[data-preloader]');
    if (!preloader) {
      setIsPreloaderActive(false);
      return;
    }

    setIsPreloaderActive(true);

    // Only observe direct children of body for preloader removal (not subtree)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const removed of mutation.removedNodes) {
          if (removed instanceof Element && removed.hasAttribute('data-preloader')) {
            setIsPreloaderActive(false);
            observer.disconnect();
            return;
          }
        }
      }
    });

    // Observe only direct children of body, not entire subtree
    observer.observe(document.body, { childList: true, subtree: false });

    return () => observer.disconnect();
  }, []);

  // Check if cursor is within the hero section using cached bounds
  const checkIfInHero = useCallback((clientY: number): boolean => {
    if (!heroBoundsRef.current) return false;
    const rect = heroBoundsRef.current;
    return clientY >= rect.top && clientY <= rect.bottom;
  }, []);

  // Throttled mouse move handler with RAF optimization
  const moveCursorCallback = useCallback((e: MouseEvent) => {
    // Cancel any pending RAF to prevent stacking
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsInHero(checkIfInHero(e.clientY));
      rafRef.current = null;
    });
  }, [cursorX, cursorY, checkIfInHero]);

  const throttledMoveCursor = useThrottleCallback(moveCursorCallback, 16);

  // Combined mouseover handler - checks both position and element type
  const handleMouseOverCallback = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const inHero = checkIfInHero(e.clientY);

    // Check if hovering over clickable element
    const isClickable =
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      !!target.closest('button') ||
      !!target.closest('a') ||
      target.classList.contains('cursor-pointer') ||
      target.dataset.clickable === 'true' ||
      !!target.closest('[data-clickable="true"]');

    // Check if hovering over image or button specifically
    const isImageOrButton =
      target.tagName === 'BUTTON' ||
      target.tagName === 'IMG' ||
      !!target.closest('button') ||
      !!target.closest('img');

    if (inHero) {
      // In hero: show pointer effect on clickables
      setIsPointer(isClickable);
      setIsHoveringInteractive(true); // Always show in hero
    } else {
      // Outside hero: only show on images and buttons
      setIsPointer(isImageOrButton);
      setIsHoveringInteractive(isImageOrButton);
    }
  }, [checkIfInHero]);

  // Throttle mouseover to reduce excessive state updates
  const handleMouseOver = useThrottleCallback(handleMouseOverCallback, 32);

  const handleMouseLeave = useCallback(() => {
    setIsHidden(true);
    setIsHoveringInteractive(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHidden(false);
  }, []);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();

    // Initial hero bounds calculation (use direct callback, not throttled)
    updateHeroBoundsCallback();

    // Throttled resize handler for both mobile check and hero bounds update
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        checkMobile();
        updateHeroBoundsCallback();
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', updateHeroBounds, { passive: true });
    window.addEventListener('mousemove', throttledMoveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });

    return () => {
      // Clear resize timeout
      if (resizeTimeout) clearTimeout(resizeTimeout);

      // Cancel any pending RAF
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      // Clear cached refs to prevent memory leaks
      heroSectionRef.current = null;
      heroBoundsRef.current = null;

      // Remove all event listeners
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateHeroBounds);
      window.removeEventListener('mousemove', throttledMoveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [throttledMoveCursor, handleMouseOver, handleMouseLeave, handleMouseEnter, updateHeroBounds, updateHeroBoundsCallback]);

  if (isMobile) return null;

  // Determine if cursor should be visible - hide during preloader
  const shouldShowCursor = !isPreloaderActive && (isInHero || isHoveringInteractive);

  return (
    <>
      {/* Main Cursor - Only visible in hero or when hovering interactive elements */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: isPointer ? 60 : 12,
            height: isPointer ? 60 : 12,
            opacity: isHidden ? 0 : (shouldShowCursor ? 1 : 0),
          }}
          transition={{ duration: 0.2 }}
          className="rounded-full bg-hero-fg"
        />
      </motion.div>

      {/* Cursor Ring - Visible only in hero or on interactive elements outside hero */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: isPointer ? 80 : 40,
            height: isPointer ? 80 : 40,
            opacity: isHidden ? 0 : (shouldShowCursor ? 0.5 : 0),
            borderColor: isPointer ? 'hsl(var(--primary))' : 'hsl(var(--hero-fg) / 0.3)',
          }}
          transition={{ duration: 0.3 }}
          className="rounded-full border-2"
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;

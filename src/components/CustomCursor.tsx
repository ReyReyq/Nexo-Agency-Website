import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInHero, setIsInHero] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isPreloaderActive, setIsPreloaderActive] = useState(true);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Check if preloader is still in DOM
  useEffect(() => {
    const checkPreloader = () => {
      const preloader = document.querySelector('[data-preloader]');
      setIsPreloaderActive(!!preloader);
    };

    // Check immediately and set up observer
    checkPreloader();

    const observer = new MutationObserver(checkPreloader);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // Check if cursor is within the hero section
  const checkIfInHero = (clientY: number): boolean => {
    const heroSection = document.querySelector('section#home');
    if (!heroSection) return false;

    const rect = heroSection.getBoundingClientRect();
    return clientY >= rect.top && clientY <= rect.bottom;
  };

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsInHero(checkIfInHero(e.clientY));
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const inHero = checkIfInHero(e.clientY);

      // Check if hovering over clickable element
      const isClickable =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        !!target.closest('button') ||
        !!target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';

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
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
      setIsHoveringInteractive(false);
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('resize', checkMobile);
    };
  }, [cursorX, cursorY]);

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

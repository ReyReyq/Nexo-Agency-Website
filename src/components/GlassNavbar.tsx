import { useCallback, useEffect, useRef, useState, memo, lazy, Suspense } from "react";
import { useAnimate, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Menu, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

// Lazy load heavy components that are not immediately needed
// LiquidSideNav is only shown when menu is opened
// TypeformPopup is 1000+ lines with confetti library - lazy load for initial bundle reduction
const LiquidSideNav = lazy(() => import("./LiquidSideNav"));
const TypeformPopup = lazy(() => import("@/components/TypeformPopup"));

// MarqueeButton with smooth infinite scrolling text animation
const MarqueeButton = ({
  children,
  onClick,
  isPastHero
}: {
  children: React.ReactNode;
  onClick: () => void;
  isPastHero: boolean;
}) => {
  const text = children as string;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative h-11 w-44 overflow-hidden rounded-full text-sm font-bold transition-all duration-300 ${
        isPastHero
          ? "bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
          : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
      }`}
    >
      {/* Gradient fades for smooth edges */}
      <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-inherit to-transparent z-10 pointer-events-none"
           style={{ background: isPastHero ? 'linear-gradient(to right, #1a1a1a, transparent)' : 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-inherit to-transparent z-10 pointer-events-none"
           style={{ background: isPastHero ? 'linear-gradient(to left, #1a1a1a, transparent)' : 'linear-gradient(to left, rgba(255,255,255,0.2), transparent)' }} />

      {/* Marquee container with CSS animation for truly seamless loop */}
      <div className="absolute inset-0 flex items-center">
        <div className="flex items-center whitespace-nowrap animate-marquee-scroll">
          {/* Duplicate content 4 times for seamless infinite loop */}
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center">
              <span className="px-3">{text}</span>
              <span className="text-white/60 px-1">•</span>
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
};

const GlassNavbar = () => {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // Track if menu has ever been opened - keeps component mounted for AnimatePresence exit animations
  const [menuHasOpened, setMenuHasOpened] = useState(false);
  // Track if popup has ever been opened
  const [popupHasOpened, setPopupHasOpened] = useState(false);

  const [scope, animate] = useAnimate();
  const navRef = useRef<HTMLElement>(null);
  // Store animate function in ref to avoid recreating callbacks
  const animateRef = useRef(animate);
  animateRef.current = animate;

  // Ref to track requestAnimationFrame ID for cleanup
  const rafIdRef = useRef<number | null>(null);
  // Ref to track if a scroll update is pending
  const isScrollPendingRef = useRef(false);

  // Scroll progress for navbar border
  const { scrollYProgress } = useScroll({
    layoutEffect: false, // Prevent layout thrashing
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  // Transform scroll progress to degrees (0 to 360) for conic gradient
  const borderProgress = useTransform(smoothProgress, [0, 1], [0, 360]);

  // Track scroll position for styling changes - throttled with requestAnimationFrame
  const updateScrollState = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
    setIsPastHero(window.scrollY > window.innerHeight - 100);
    isScrollPendingRef.current = false;
  }, []);

  const handleScroll = useCallback(() => {
    // Only schedule a new frame if one isn't already pending
    if (!isScrollPendingRef.current) {
      isScrollPendingRef.current = true;
      rafIdRef.current = requestAnimationFrame(updateScrollState);
    }
  }, [updateScrollState]);

  useEffect(() => {
    // Initial check
    updateScrollState();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Cancel any pending animation frame on cleanup
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [handleScroll, updateScrollState]);

  // Cursor follower effect - memoized with useCallback
  // Uses refs to avoid dependency on animate/scope which change on each render
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = navRef.current?.getBoundingClientRect();
    if (!rect) return;

    const isNavElement = (e.target as HTMLElement).closest(".glass-nav-area");

    if (isNavElement) {
      setHovered(true);
      const top = e.clientY - rect.top + "px";
      const left = e.clientX - rect.left + "px";
      animateRef.current(scope.current, { top, left }, { duration: 0 });
    } else {
      setHovered(false);
    }
  }, [scope]);

  // Memoized onMouseLeave handler
  const handleMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  // Memoized popup handlers to prevent unnecessary re-renders
  const handleOpenPopup = useCallback(() => {
    setPopupHasOpened(true);
    setIsPopupOpen(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  // Track when menu opens for the first time (for lazy loading + exit animations)
  useEffect(() => {
    if (menuOpen && !menuHasOpened) {
      setMenuHasOpened(true);
    }
  }, [menuOpen, menuHasOpened]);

  // Track when popup opens for the first time
  useEffect(() => {
    if (isPopupOpen && !popupHasOpened) {
      setPopupHasOpened(true);
    }
  }, [isPopupOpen, popupHasOpened]);

  return (
    <>
      <motion.nav
        ref={navRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          cursor: hovered ? "none" : "auto",
        }}
        className={`
          glass-nav-area fixed left-4 right-4 top-4 z-40 mx-auto max-w-6xl overflow-hidden
          transition-all duration-500
          ${isScrolled
            ? isPastHero
              ? "bg-white/80 shadow-lg"
              : "bg-[#1a1a1a]/40"
            : "bg-transparent"
          }
          backdrop-blur-xl rounded-2xl
        `}
      >
        {/* Scroll Progress Border */}
        <ScrollProgressBorder progress={borderProgress} />
        <div className="glass-nav-area grid grid-cols-3 items-center px-4 md:px-6 py-4" dir="ltr">
          {/* Cursor Follower */}
          <Cursor hovered={hovered} scope={scope} />

          {/* Left - CTA Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="hidden lg:flex items-center z-10 justify-self-start"
          >
            <MarqueeButton onClick={handleOpenPopup} isPastHero={isPastHero}>
              צרו קשר עכשיו
            </MarqueeButton>
          </motion.div>
          {/* Mobile spacer for left column */}
          <div className="lg:hidden" />

          {/* Center - Logo */}
          <Logo isPastHero={isPastHero} />

          {/* Right - Menu Button */}
          <div className="justify-self-end">
            <MenuButton
              setMenuOpen={setMenuOpen}
              isPastHero={isPastHero}
              isScrolled={isScrolled}
            />
          </div>
        </div>
      </motion.nav>

      {/* Liquid Side Navigation - lazy loaded on first open, stays mounted for exit animations */}
      {menuHasOpened && (
        <Suspense fallback={null}>
          <LiquidSideNav isOpen={menuOpen} setIsOpen={setMenuOpen} />
        </Suspense>
      )}

      {/* Contact Form Popup - lazy loaded on first open, stays mounted for exit animations */}
      {popupHasOpened && (
        <Suspense fallback={null}>
          <TypeformPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
        </Suspense>
      )}
    </>
  );
};

// Memoized Cursor component
interface CursorProps {
  hovered: boolean;
  scope: React.RefObject<HTMLSpanElement>;
}

const Cursor = memo(({ hovered, scope }: CursorProps) => {
  return (
    <motion.span
      initial={false}
      animate={{
        opacity: hovered ? 1 : 0,
        transform: `scale(${hovered ? 1 : 0}) translateX(-50%) translateY(-50%)`,
      }}
      transition={{ duration: 0.15 }}
      ref={scope}
      className="pointer-events-none absolute z-0 grid h-[50px] w-[50px] origin-[0px_0px] place-content-center rounded-full bg-primary text-2xl"
    >
      <ArrowUpRight className="text-white w-5 h-5" />
    </motion.span>
  );
});

Cursor.displayName = 'Cursor';

// Memoized Logo component
interface LogoProps {
  isPastHero: boolean;
}

const Logo = memo(({ isPastHero }: LogoProps) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, duration: 0.6 }}
    className="flex items-center justify-center z-10"
  >
    <Link to="/" className="block">
      <img
        src="/logo.svg"
        alt="Nexo"
        width={120}
        height={40}
        decoding="async"
        className={`
          h-8 md:h-10 w-auto transition-all duration-500
          ${isPastHero ? "" : "brightness-0 invert"}
        `}
      />
    </Link>
  </motion.div>
));

Logo.displayName = 'Logo';

// Memoized MenuButton component
interface MenuButtonProps {
  setMenuOpen: (fn: (prev: boolean) => boolean) => void;
  isPastHero: boolean;
  isScrolled: boolean;
}

const MenuButton = memo(({ setMenuOpen, isPastHero, isScrolled }: MenuButtonProps) => {
  const handleClick = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, [setMenuOpen]);

  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      onClick={handleClick}
      whileHover={{
        rotate: "180deg",
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ scale: 0.9 }}
      className={`
        relative z-10 flex items-center justify-center w-10 h-10 md:w-12 md:h-12
        rounded-full transition-all duration-300
        ${isPastHero
          ? "bg-[#1a1a1a] text-white hover:bg-primary"
          : isScrolled
            ? "bg-white/20 text-white hover:bg-white/30"
            : "bg-white text-[#1a1a1a] hover:bg-primary hover:text-white"
        }
      `}
    >
      <Menu className="w-5 h-5" />
    </motion.button>
  );
});

MenuButton.displayName = 'MenuButton';

// Memoized Scroll Progress Border Component
interface ScrollProgressBorderProps {
  progress: any; // MotionValue<number>
}

const ScrollProgressBorder = memo(({ progress }: ScrollProgressBorderProps) => {
  const background = useTransform(progress, (deg: number) =>
    `conic-gradient(from 0deg, hsl(328 100% 54%) ${deg}deg, transparent ${deg}deg)`
  );

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl pointer-events-none z-0"
      style={{
        background,
        padding: "1px",
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    />
  );
});

ScrollProgressBorder.displayName = 'ScrollProgressBorder';

export default GlassNavbar;

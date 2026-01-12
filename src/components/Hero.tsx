import { useState, useEffect, useRef, useCallback } from "react";
import { useThrottleCallback } from "@/hooks/useThrottleCallback";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

// Spring configuration - defined outside component to prevent recreating on each render
const SPRING_CONFIG = { stiffness: 150, damping: 15 } as const;
import { ArrowLeft } from "lucide-react";
import { HERO_TRANSITION_IMAGE } from "./Preloader";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Spotlight } from "./ui/spotlight";
import { BackgroundBeams } from "./ui/background-beams";

// First image MUST match Preloader's HERO_TRANSITION_IMAGE for seamless transition
// Using AVIF format with WebP fallback for optimal compression
// AVIF provides 30-50% better compression than WebP
// Responsive variants (-sm: 640px, -md: 1024px) exist for mobile optimization
const heroImages = [
  {
    src: HERO_TRANSITION_IMAGE, // Same as preloader middle image (already optimized)
    avifSrc: "/images/hero/team-collaboration.avif",
    avifSrcSet: "/images/hero/team-collaboration-sm.avif 640w, /images/hero/team-collaboration-md.avif 1024w, /images/hero/team-collaboration.avif 1920w",
    srcSet: "/images/hero/team-collaboration-sm.webp 640w, /images/hero/team-collaboration-md.webp 1024w, /images/hero/team-collaboration.webp 1920w",
  },
  {
    src: "/images/hero/creative-team-meeting.webp",
    avifSrc: "/images/hero/creative-team-meeting.avif",
    avifSrcSet: "/images/hero/creative-team-meeting-sm.avif 640w, /images/hero/creative-team-meeting-md.avif 1024w, /images/hero/creative-team-meeting.avif 1920w",
    srcSet: "/images/hero/creative-team-meeting-sm.webp 640w, /images/hero/creative-team-meeting-md.webp 1024w, /images/hero/creative-team-meeting.webp 1920w",
  },
  {
    src: "/images/hero/team-collaboration.webp",
    avifSrc: "/images/hero/team-collaboration.avif",
    avifSrcSet: "/images/hero/team-collaboration-sm.avif 640w, /images/hero/team-collaboration-md.avif 1024w, /images/hero/team-collaboration.avif 1920w",
    srcSet: "/images/hero/team-collaboration-sm.webp 640w, /images/hero/team-collaboration-md.webp 1024w, /images/hero/team-collaboration.webp 1920w",
  },
];

// Distance threshold in pixels before changing image
const MOUSE_DISTANCE_THRESHOLD = 800;

// Hero content
const heroHeadlines = ["הופכים", "חזון", "למציאות", "דיגיטלית."];

// Text reveal animation variants
// Using opacity: 0 for clean animations - text is gated by hasAnimated so LCP is not affected
const lineVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: i * 0.12,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

const fadeUpVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: (delay: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

// Subheadline animation variant
const lcpTextVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: 0.1,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const accumulatedDistanceRef = useRef(0);
  const isInitializedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  // Magnetic button effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, SPRING_CONFIG);
  const springY = useSpring(mouseY, SPRING_CONFIG);

  // Trigger animation when preloader signals it's ready
  // The preloader dispatches this event during settling phase (when hero image is visible)
  // This allows Hero text to animate in while preloader image is still showing
  useEffect(() => {
    const PRELOADER_COMPLETE_EVENT = 'nexo:preloader-complete';

    // Check if preloader already completed (e.g., returning visitor in same session)
    const preloaderShown = sessionStorage.getItem('nexo-preloader-shown');
    if (preloaderShown) {
      // Preloader was already shown, animate immediately
      setHasAnimated(true);
      return;
    }

    // Wait for preloader to signal it's ready for text animation
    const handlePreloaderComplete = () => {
      setHasAnimated(true); // Start text animation immediately
    };

    window.addEventListener(PRELOADER_COMPLETE_EVENT, handlePreloaderComplete);
    return () => window.removeEventListener(PRELOADER_COMPLETE_EVENT, handlePreloaderComplete);
  }, []);

  // Check for mobile viewport to disable parallax
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"] as const,
  });

  // Disable parallax effects when reduced motion is preferred or on mobile devices
  // Mobile devices have limited CPU/GPU resources, so we skip expensive scroll-based transforms
  const disableParallax = prefersReducedMotion || isMobile;
  const imageScale = useTransform(scrollYProgress, [0, 1], disableParallax ? [1, 1] : [1, 1.3]);
  const textY = useTransform(scrollYProgress, [0, 1], disableParallax ? [0, 0] : [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], disableParallax ? [1, 1] : [1, 0]);

  // Mouse movement handler for image changes
  // Disabled when reduced motion is preferred - no image cycling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Skip image cycling when reduced motion is preferred
    if (prefersReducedMotion) return;

    // Check if mouse is within hero section
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const isInHero = e.clientY >= rect.top && e.clientY <= rect.bottom;

    if (!isInHero) return;

    const currentPos = { x: e.clientX, y: e.clientY };

    // Initialize position on first move
    if (!isInitializedRef.current) {
      mousePositionRef.current = currentPos;
      isInitializedRef.current = true;
      return;
    }

    const prevPos = mousePositionRef.current;

    // Calculate Euclidean distance between current and previous position
    const distance = Math.hypot(
      currentPos.x - prevPos.x,
      currentPos.y - prevPos.y
    );

    // Accumulate distance
    accumulatedDistanceRef.current += distance;

    // Check if threshold reached
    if (accumulatedDistanceRef.current >= MOUSE_DISTANCE_THRESHOLD) {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
      accumulatedDistanceRef.current = 0;
    }

    // Update reference position
    mousePositionRef.current = currentPos;
  }, [prefersReducedMotion]);

  // Throttle the mouse move handler to ~60fps
  const throttledMouseMove = useThrottleCallback(handleMouseMove, 16);

  // Mouse movement tracking for image changes
  useEffect(() => {
    window.addEventListener("mousemove", throttledMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", throttledMouseMove);
  }, [throttledMouseMove]);

  const navigateToContact = useCallback(() => {
    // Navigate to contact page and scroll to the form section
    window.location.href = "/contact#contact-form";
  }, []);

  // Magnetic button handler - memoized to prevent unnecessary re-renders
  const handleButtonMouseMove = useCallback((e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) * 0.3);
    mouseY.set((e.clientY - centerY) * 0.3);
  }, [mouseX, mouseY]);

  const handleButtonMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  const handleButtonMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative h-full w-full flex items-end overflow-hidden bg-hero-bg"
    >
      {/* Spotlight Effect - Positioned at top-right */}
      <Spotlight
        className="-top-40 right-0 md:right-60 md:-top-20"
        fill="hsl(var(--primary-bright))"
      />

      {/* Background Image with Parallax */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={currentImage === 0 ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: currentImage === 0 ? 0 : 0.5 }}
            className="absolute inset-0"
            style={isMobile ? undefined : { scale: imageScale }}
          >
            {/* Hero images: Above the fold - no lazy loading, high priority fetch */}
            {/* Using picture element with AVIF source for modern browsers, WebP fallback */}
            {/* AVIF saves ~30-50% over WebP, srcset for responsive sizing */}
            <picture>
              {/* AVIF source for browsers that support it (Chrome 85+, Firefox 93+, Safari 16.4+) */}
              <source
                type="image/avif"
                srcSet={heroImages[currentImage].avifSrcSet}
                sizes="100vw"
              />
              {/* WebP fallback with responsive srcset */}
              <source
                type="image/webp"
                srcSet={heroImages[currentImage].srcSet}
                sizes="100vw"
              />
              <img
                src={heroImages[currentImage].src}
                alt="עבודה יצירתית"
                width={1920}
                height={1080}
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                className="w-full h-full object-cover"
              />
            </picture>
          </motion.div>
        </AnimatePresence>

        {/* Subtle Gradient Overlay - matches preloader */}
        <div className="absolute inset-0 bg-gradient-to-t from-hero-bg/80 via-hero-bg/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-hero-bg/60 to-transparent" />
      </div>

      {/* Background Beams Effect - Subtle animated beams */}
      {/* Disabled on mobile for performance - complex SVG animations are expensive */}
      {!isMobile && <BackgroundBeams className="opacity-30" />}

      {/* Content - Bottom Right with text reveal animations */}
      <motion.div
        style={isMobile ? { opacity } : { y: textY, opacity }}
        className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pb-16 sm:pb-24 md:pb-32"
      >
        <div className="max-w-4xl ml-auto text-right" dir="rtl">
          {/* Stacked Headlines with reveal animation - Single h1 for SEO */}
          <h1 className="sr-only">הופכים חזון למציאות דיגיטלית.</h1>
          {heroHeadlines.map((line, index) => (
            <div key={index} className="overflow-hidden">
              <motion.span
                custom={index}
                initial="hidden"
                animate={hasAnimated ? "visible" : "hidden"}
                variants={lineVariants}
                aria-hidden="true"
                className="block text-fluid-hero sm:text-[clamp(3rem,10vw,7rem)] md:text-[clamp(4rem,10vw,8rem)] lg:text-[clamp(5rem,9vw,10rem)] font-black text-hero-fg leading-[0.85] tracking-[-0.02em]"
              >
                {line}
              </motion.span>
            </div>
          ))}

          {/* Subheadline - gated by hasAnimated to prevent showing through preloader */}
          <motion.p
            initial="hidden"
            animate={hasAnimated ? "visible" : "hidden"}
            variants={lcpTextVariants}
            className="text-hero-fg/80 text-fluid-base sm:text-fluid-lg md:text-fluid-xl lg:text-fluid-2xl max-w-2xl mt-6 sm:mt-8 leading-relaxed"
          >
            סוכנות דיגיטל שמובילה מותגים לצמיחה אמיתית. אסטרטגיה, עיצוב ופיתוח - הכל תחת קורת גג אחת.
          </motion.p>

          {/* Premium CTA Button with ShimmerButton */}
          <motion.div
            custom={0.9}
            initial="hidden"
            animate={hasAnimated ? "visible" : "hidden"}
            variants={fadeUpVariants}
            className="mt-8 sm:mt-10"
          >
            <motion.div
              style={{ x: springX, y: springY }}
              onMouseMove={handleButtonMouseMove}
              onMouseEnter={handleButtonMouseEnter}
              onMouseLeave={handleButtonMouseLeave}
              className="inline-block"
            >
              <ShimmerButton
                onClick={navigateToContact}
                shimmerColor="rgba(255, 255, 255, 0.5)"
                shimmerSize="0.1em"
                shimmerDuration="2.5s"
                borderRadius="9999px"
                background="linear-gradient(90deg, hsl(328, 100%, 54%), hsl(328, 100%, 48%))"
                className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] text-white font-semibold text-base sm:text-lg shadow-[0_0_30px_rgba(255,20,147,0.3)] hover:shadow-[0_0_50px_rgba(255,20,147,0.5)] transition-shadow duration-300"
              >
                <span className="relative z-10">בואו נדבר על הפרויקט שלכם</span>
                <motion.span
                  className="relative z-10"
                  animate={isHovered ? { x: -5, scale: 1.1 } : { x: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.span>
              </ShimmerButton>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

    </section>
  );
};

export default Hero;

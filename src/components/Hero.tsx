import { useState, useEffect, useRef, useCallback } from "react";
import { useThrottleCallback } from "@/hooks/useThrottleCallback";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { HERO_TRANSITION_IMAGE } from "./Preloader";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Spotlight } from "./ui/spotlight";
import { BackgroundBeams } from "./ui/background-beams";

// First image MUST match Preloader's HERO_TRANSITION_IMAGE for seamless transition
// Using WebP format for better compression, q=80 for good quality/size balance
const heroImages = [
  HERO_TRANSITION_IMAGE, // Same as preloader middle image (already optimized)
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80&fm=webp&fit=crop",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80&fm=webp&fit=crop",
];

// Distance threshold in pixels before changing image
const MOUSE_DISTANCE_THRESHOLD = 800;

// Hero content
const heroHeadlines = ["הופכים", "חזון", "למציאות", "דיגיטלית."];

// Text reveal animation variants
const lineVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: i * 0.12,
      ease: [0.16, 1, 0.3, 1],
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
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const accumulatedDistanceRef = useRef(0);
  const isInitializedRef = useRef(false);

  // Magnetic button effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  // Trigger animation after preloader
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
    layoutEffect: false, // Prevent layout thrashing - use passive scroll measurement
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse movement handler for image changes
  const handleMouseMove = useCallback((e: MouseEvent) => {
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
  }, []);

  // Throttle the mouse move handler to ~60fps
  const throttledMouseMove = useThrottleCallback(handleMouseMove, 16);

  // Mouse movement tracking for image changes
  useEffect(() => {
    window.addEventListener("mousemove", throttledMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", throttledMouseMove);
  }, [throttledMouseMove]);

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Magnetic button handler
  const handleButtonMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) * 0.3);
    mouseY.set((e.clientY - centerY) * 0.3);
  };

  const handleButtonMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative h-full w-full flex items-end overflow-hidden bg-hero-bg"
    >
      {/* Spotlight Effect - Positioned at top-right */}
      <Spotlight
        className="-top-40 right-0 md:right-60 md:-top-20"
        fill="#FF1493"
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
            style={{ scale: imageScale }}
          >
            {/* Hero images: Above the fold - no lazy loading needed, but add dimensions for layout stability */}
            {/* TODO: Consider converting external Unsplash URLs to local optimized images for better performance */}
            <img
              src={heroImages[currentImage]}
              alt="Creative work"
              width={1920}
              height={1080}
              decoding="async"
              fetchPriority="high"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Subtle Gradient Overlay - matches preloader */}
        <div className="absolute inset-0 bg-gradient-to-t from-hero-bg/80 via-hero-bg/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-hero-bg/60 to-transparent" />
      </div>

      {/* Background Beams Effect - Subtle animated beams */}
      <BackgroundBeams className="opacity-30" />

      {/* Content - Bottom Right with text reveal animations */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 container mx-auto px-6 md:px-12 pb-24 md:pb-32"
      >
        <div className="max-w-4xl ml-auto text-right" dir="rtl">
          {/* Stacked Headlines with reveal animation */}
          {heroHeadlines.map((line, index) => (
            <div key={index} className="overflow-hidden">
              <motion.h1
                custom={index}
                initial="hidden"
                animate={hasAnimated ? "visible" : "hidden"}
                variants={lineVariants}
                className="text-[12vw] md:text-[10vw] lg:text-[9vw] font-black text-hero-fg leading-[0.85] tracking-[-0.02em]"
              >
                {line}
              </motion.h1>
            </div>
          ))}

          {/* Subheadline with fade up */}
          <motion.p
            custom={0.6}
            initial="hidden"
            animate={hasAnimated ? "visible" : "hidden"}
            variants={fadeUpVariants}
            className="text-hero-fg/70 text-lg md:text-xl max-w-2xl mt-8 leading-relaxed"
          >
            סוכנות דיגיטל שמובילה מותגים לצמיחה אמיתית. אסטרטגיה, עיצוב ופיתוח - הכל תחת קורת גג אחת.
          </motion.p>

          {/* Premium CTA Button with ShimmerButton */}
          <motion.div
            custom={0.9}
            initial="hidden"
            animate={hasAnimated ? "visible" : "hidden"}
            variants={fadeUpVariants}
            className="mt-10"
          >
            <motion.div
              style={{ x: springX, y: springY }}
              onMouseMove={handleButtonMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleButtonMouseLeave}
              className="inline-block"
            >
              <ShimmerButton
                onClick={scrollToContact}
                shimmerColor="rgba(255, 255, 255, 0.5)"
                shimmerSize="0.1em"
                shimmerDuration="2.5s"
                borderRadius="9999px"
                background="linear-gradient(90deg, hsl(328, 100%, 54%), hsl(328, 100%, 48%))"
                className="group relative inline-flex items-center gap-3 px-8 py-4 text-white font-semibold text-lg shadow-[0_0_30px_rgba(255,20,147,0.3)] hover:shadow-[0_0_50px_rgba(255,20,147,0.5)] transition-shadow duration-300"
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

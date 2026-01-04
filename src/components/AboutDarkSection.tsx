import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, lazy, Suspense, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import RippleButton from "./RippleButton";

// Lazy load PixelTrail - heavy Three.js/WebGL component
const PixelTrail = lazy(() => import("./ui/PixelTrail"));

// Memoized PixelTrail config to prevent unnecessary re-renders
const PIXEL_TRAIL_CONFIG = {
  gridSize: 50,
  trailSize: 0.12,
  maxAge: 400,
  interpolate: 8,
  color: "#FF1493",
} as const;

const AboutDarkSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Memoize scroll options to prevent re-subscription on each render
  const scrollOptions = useMemo(() => ({
    target: sectionRef,
    offset: ["start start", "end start"] as const,
    layoutEffect: false, // Prevent layout thrashing
  }), []);

  // Scroll-linked animations for parallax effect
  const { scrollYProgress } = useScroll(scrollOptions);

  // Memoize transform input/output arrays to prevent recreation
  const scaleInput = useMemo(() => [0, 1], []);
  const scaleOutput = useMemo(() => [1, 1.2], []);

  // Background image zooms as user scrolls
  const imageScale = useTransform(scrollYProgress, scaleInput, scaleOutput);

  // Memoize gooey filter config to prevent object recreation
  const gooeyFilterConfig = useMemo(() => ({ id: "about-dark-goo-filter", strength: 3 }), []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] md:min-h-screen w-full overflow-hidden bg-hero-bg"
    >
      {/* Background Image with parallax zoom - z-0 */}
      {/* Optimized with WebP format for full-width hero background */}
      <motion.div
        style={{ scale: imageScale }}
        className="absolute inset-0 bg-cover bg-center z-0"
      >
        <img
          src="/images/gallery/team-office-meeting.jpg"
          alt="Team collaboration"
          loading="lazy"
          decoding="async"
          width={1920}
          height={1280}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-hero-bg via-hero-bg/70 to-hero-bg/40" />
      </motion.div>

      {/* PixelTrail Layer - z-10, receives all mouse events */}
      {/* Lazy loaded to reduce initial bundle size - Three.js is heavy */}
      <div className="absolute inset-0 z-10">
        <Suspense fallback={null}>
          <PixelTrail
            gridSize={PIXEL_TRAIL_CONFIG.gridSize}
            trailSize={PIXEL_TRAIL_CONFIG.trailSize}
            maxAge={PIXEL_TRAIL_CONFIG.maxAge}
            interpolate={PIXEL_TRAIL_CONFIG.interpolate}
            color={PIXEL_TRAIL_CONFIG.color}
            gooeyFilter={gooeyFilterConfig}
          />
        </Suspense>
      </div>

      {/* Content - z-20, pointer-events-none except for interactive elements */}
      <div className="relative z-20 container mx-auto px-6 py-24 md:py-32 flex items-center h-full pointer-events-none">
        <div className="max-w-3xl">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-primary mb-8"
          />

          <motion.h2
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-7xl font-black text-hero-fg leading-[1.1] mb-8"
          >
            כל פיקסל. כל שורת קוד.
            <br />
            <span className="text-gradient">נבנו בשבילכם.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-hero-fg/80 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl"
          >
            אנחנו לא סוכנות עוד אחת. אנחנו שותפים לצמיחה שלכם. כל פרויקט מותאם אישית, כל פתרון נמדד בתוצאות.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-6 pointer-events-auto"
          >
            <RippleButton to="/contact#contact-form" variant="charcoal" size="sm">
              <span className="flex items-center gap-2">
                התחילו פרויקט
                <ArrowLeft className="w-4 h-4" />
              </span>
            </RippleButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutDarkSection;

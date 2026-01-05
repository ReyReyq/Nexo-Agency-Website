import { memo, useRef, useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronRight, Home } from "lucide-react";
import Magnet from "@/components/Magnet";
import ErrorBoundary, { SectionErrorFallback } from "@/components/ErrorBoundary";
import { cn } from "@/lib/utils";
import type { SubServiceDetail as SubServiceDetailType } from "@/data/subServices";
import type { Service } from "@/data/services";

// Lazy load heavy Three.js component for better performance
const Ballpit = lazy(() => import("@/components/Ballpit"));

// Animation constants
const INITIAL_FADE_UP_40 = { opacity: 0, y: 40 };
const INITIAL_FADE_UP_30 = { opacity: 0, y: 30 };
const INITIAL_FADE_UP_20 = { opacity: 0, y: 20 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const ANIMATE_EMPTY = {};
const TRANSITION_MAIN = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const };
const IN_VIEW_OPTIONS_ONCE = { once: true };

export interface SubServiceHeroProps {
  subService: SubServiceDetailType;
  parentService: Service;
}

const SubServiceHero = memo(({ subService, parentService }: SubServiceHeroProps) => {
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, IN_VIEW_OPTIONS_ONCE);
  const animateState = isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY;

  // Mobile detection for performance optimization
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Convert hex accent color to number for Three.js
  const accentColorNum = parseInt(parentService.accentColor.replace('#', ''), 16);

  return (
    <section
      className="relative overflow-hidden bg-black min-h-screen min-h-[100dvh]"
      style={{ minHeight: 'min(700px, 100svh)', height: '100svh', maxHeight: '900px' }}
    >
      {/* Background - Ballpit on desktop, gradient on mobile for performance */}
      <div className="absolute inset-0">
        {isMobile ? (
          // Mobile: Animated gradient background instead of heavy Three.js
          <div
            className="w-full h-full"
            style={{
              background: `radial-gradient(ellipse at 30% 20%, ${parentService.accentColor}40 0%, transparent 50%),
                          radial-gradient(ellipse at 70% 80%, ${parentService.accentColor}30 0%, transparent 40%),
                          linear-gradient(180deg, #000 0%, #111 50%, #000 100%)`
            }}
          />
        ) : (
          // Desktop: Full Ballpit experience with lazy loading
          <ErrorBoundary fallback={<SectionErrorFallback />}>
            <Suspense fallback={<div className="animate-pulse bg-muted h-full w-full" />}>
              <Ballpit
                className="w-full h-full"
                count={200}
                colors={[0xffffff, 0x000000, accentColorNum]}
                gravity={0.2}
                friction={0.9975}
                wallBounce={0.95}
                followCursor={true}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>

      {/* Dark overlay for text readability - stronger on mobile */}
      <div className={cn(
        "absolute inset-0 pointer-events-none",
        isMobile ? "bg-black/40" : "bg-black/20"
      )} />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center justify-center h-full">
        <motion.div
          ref={heroRef}
          initial={INITIAL_FADE_UP_40}
          animate={animateState}
          transition={TRANSITION_MAIN}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Breadcrumb */}
          <motion.nav
            initial={INITIAL_FADE_UP_20}
            animate={animateState}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex items-center justify-center gap-2 text-sm text-hero-fg/60 mb-6 flex-wrap"
            dir="rtl"
          >
            <Link to="/" className="flex items-center gap-1 hover:text-hero-fg transition-colors">
              <Home className="w-4 h-4" />
              <span>ראשי</span>
            </Link>
            <ChevronRight className="w-4 h-4 rotate-180" />
            <Link to="/services" className="hover:text-hero-fg transition-colors">
              שירותים
            </Link>
            <ChevronRight className="w-4 h-4 rotate-180" />
            <Link to={`/services/${parentService.slug}`} className="hover:text-hero-fg transition-colors">
              {parentService.name}
            </Link>
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span className="text-hero-fg font-medium">{subService.name}</span>
          </motion.nav>

          {/* Title */}
          <motion.h1
            initial={INITIAL_FADE_UP_30}
            animate={animateState}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-hero-fg leading-tight mb-4"
          >
            {subService.name}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={INITIAL_FADE_UP_20}
            animate={animateState}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl text-hero-fg/80 font-medium mb-4"
          >
            {subService.subtitle}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={INITIAL_FADE_UP_20}
            animate={animateState}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-hero-fg/60 text-base sm:text-lg max-w-2xl mx-auto mb-10"
          >
            {subService.heroDescription}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={INITIAL_FADE_UP_20}
            animate={animateState}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4"
          >
            <Magnet magnetStrength={3} padding={60}>
              <Link
                to="/contact#contact-form"
                className="group relative inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] rounded-full text-base sm:text-lg font-bold bg-white text-black transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10 flex items-center gap-2">
                  בואו נתחיל
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </span>
              </Link>
            </Magnet>

            <Magnet magnetStrength={3} padding={60}>
              <a
                href="#what-is-this"
                className="group relative inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-hero-fg px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] rounded-full text-base sm:text-lg font-medium hover:bg-white/20 hover:scale-105 active:scale-95 transition-all border border-white/20 overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  למידע נוסף
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </span>
              </a>
            </Magnet>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

SubServiceHero.displayName = 'SubServiceHero';

export default SubServiceHero;

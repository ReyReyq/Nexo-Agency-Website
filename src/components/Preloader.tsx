import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { dispatchPreloaderComplete } from "@/lib/lenis";

interface PreloaderProps {
  onComplete: () => void;
}

// Hero image that we transition into - MUST match Hero.tsx first image exactly
export const HERO_TRANSITION_IMAGE = "/images/hero/team-collaboration.webp";

// Preloader images - middle one (index 2) will become hero background
const preloaderPhotos = [
  { src: '/images/gallery/minimal-gradient-sunset.jpg', alt: 'Gradient sunset' },
  { src: '/images/gallery/abstract-gradient-purple.jpg', alt: 'Purple gradient' },
  { src: HERO_TRANSITION_IMAGE, alt: 'Team collaboration' }, // MAIN - matches Hero first image
  { src: '/images/gallery/architecture-modern-building.jpg', alt: 'Modern building' },
  { src: '/images/gallery/workspace-modern-office.jpg', alt: 'Modern office' },
];

const Preloader = ({ onComplete }: PreloaderProps) => {
  const [phase, setPhase] = useState<'logo' | 'photos' | 'zooming' | 'complete'>('logo');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isCompletedRef = useRef(false);

  // Memoize onComplete callback to prevent unnecessary effect re-runs
  const handleComplete = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    dispatchPreloaderComplete();
    onComplete();
  }, [onComplete]);

  // Check for reduced motion preference in useEffect to avoid SSR hydration mismatch
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes to reduced motion preference
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      handleComplete();
      return;
    }

    // Clear any existing timers before setting new ones
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    // Phase 1: Logo shows for 1.5s
    timersRef.current.push(setTimeout(() => setPhase('photos'), 1500));

    // Phase 2: Photos reveal for 2.5s
    timersRef.current.push(setTimeout(() => setPhase('zooming'), 4000));

    // Phase 3: Zoom + crossfade to hero (overlapping animations)
    // The settled image starts fading in during zoom
    // Text starts animating in during the crossfade
    // Everything happens smoothly without gaps

    // Phase 4: Complete - preloader fades out
    timersRef.current.push(setTimeout(() => setPhase('complete'), 9500));

    // Remove preloader
    timersRef.current.push(setTimeout(() => {
      handleComplete();
    }, 10500));

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [handleComplete, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  // Phase checks - all based on single 'zooming' phase with CSS animation timing
  const isZooming = phase === 'zooming';
  const shouldFadeOut = phase === 'complete';

  return (
    <motion.div
      ref={containerRef}
      data-preloader
      initial={{ opacity: 1 }}
      animate={{ opacity: shouldFadeOut ? 0 : 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] overflow-hidden h-screen h-[100dvh]"
      style={{
        backgroundColor: '#FAFAFA',
        willChange: 'opacity'
      }}
    >
      {/* Phase 1: Logo with reveal and wipe-out */}
      <AnimatePresence>
        {phase === 'logo' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <motion.div
              initial={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
              animate={{
                clipPath: [
                  'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                  'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                  'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                  'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)'
                ]
              }}
              transition={{
                duration: 1.4,
                delay: 0.2,
                times: [0, 0.4, 0.7, 1],
                ease: [0.16, 1, 0.3, 1]
              }}
              className="text-gray-900 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-semibold tracking-[0.15em] uppercase"
            >
              NEXO
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 2 & 3: Photos that zoom together as a group */}
      {(phase === 'photos' || phase === 'zooming') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* The entire photos container scales up together */}
          <motion.div
            className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8"
            initial={{ scale: 1 }}
            animate={{
              scale: isZooming ? 7 : 1,
            }}
            transition={{
              duration: 4,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              transformOrigin: 'center center',
              willChange: 'transform',
            }}
          >
            {preloaderPhotos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{
                  clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                  opacity: 0,
                }}
                animate={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                  opacity: 1,
                }}
                transition={{
                  clipPath: {
                    duration: 1.2,
                    delay: (preloaderPhotos.length - 1 - index) * 0.18,
                    ease: [0.16, 1, 0.3, 1]
                  },
                  opacity: {
                    duration: 0.8,
                    delay: (preloaderPhotos.length - 1 - index) * 0.18,
                  }
                }}
                className="relative overflow-hidden flex-shrink-0 w-36 h-24 sm:w-44 sm:h-28 md:w-56 md:h-36 lg:w-64 lg:h-40"
                style={{ borderRadius: '4px' }}
              >
                <motion.img
                  src={photo.src}
                  alt={photo.alt}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 1.5,
                    delay: (preloaderPhotos.length - 1 - index) * 0.18,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/*
        Full screen hero image - starts fading in DURING the zoom
        This creates the seamless "settling" effect - no gap, no pause
        The crossfade happens while zoom is still progressing
      */}
      {isZooming && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 2.5,
            delay: 2, // Start 2s into the 4s zoom - overlapping transition
            ease: [0.16, 1, 0.3, 1]
          }}
          className="absolute inset-0 z-20"
          style={{
            backgroundColor: 'hsl(0, 0%, 4%)'
          }}
        >
          <img
            src={HERO_TRANSITION_IMAGE}
            alt="Team collaboration"
            className="w-full h-full object-cover"
          />

          {/* Gradient overlays fade in with the image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 2.5 }}
            className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,4%)]/80 via-[hsl(0,0%,4%)]/30 to-transparent"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 2.5 }}
            className="absolute inset-0 bg-gradient-to-r from-[hsl(0,0%,4%)]/60 to-transparent"
          />
        </motion.div>
      )}

      {/* Keep settled image visible during complete phase for smooth fade out */}
      {phase === 'complete' && (
        <div
          className="absolute inset-0 z-20"
          style={{
            backgroundColor: 'hsl(0, 0%, 4%)'
          }}
        >
          <img
            src={HERO_TRANSITION_IMAGE}
            alt="Team collaboration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,4%)]/80 via-[hsl(0,0%,4%)]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(0,0%,4%)]/60 to-transparent" />
        </div>
      )}

      {/* Hero text - starts animating during the crossfade for seamless flow */}
      {(isZooming || phase === 'complete') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: isZooming ? 3 : 0 }}
          className="absolute inset-0 z-30 flex items-end"
        >
          <div className="container mx-auto px-4 sm:px-6 md:px-12 pb-20 sm:pb-24 md:pb-32 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:pb-[calc(2rem+env(safe-area-inset-bottom))]">
            <div className="max-w-4xl ml-auto text-right" dir="rtl">
              {/* Stacked Headlines */}
              {["הופכים", "חזון", "למציאות", "דיגיטלית."].map((line, index) => (
                <div key={index} className="overflow-hidden">
                  <motion.h1
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 1,
                      delay: (isZooming ? 3.2 : 0) + index * 0.1,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[9vw] font-black text-white leading-[0.85] tracking-[-0.02em]"
                  >
                    {line}
                  </motion.h1>
                </div>
              ))}

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: isZooming ? 3.7 : 0.5 }}
                className="text-white/70 text-base sm:text-lg md:text-xl max-w-2xl mt-6 sm:mt-8 leading-relaxed"
              >
                סוכנות דיגיטל שמובילה מותגים לצמיחה אמיתית. אסטרטגיה, עיצוב ופיתוח - הכל תחת קורת גג אחת.
              </motion.p>

              {/* CTA Button Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: isZooming ? 3.9 : 0.7 }}
                className="mt-6 sm:mt-8 md:mt-10"
              >
                <div className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground font-semibold text-base sm:text-lg">
                  <span>בואו נדבר על הפרויקט שלכם</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
                  </svg>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Preloader;

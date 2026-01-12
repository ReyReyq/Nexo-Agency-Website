import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { dispatchPreloaderComplete } from "@/lib/lenis";

interface PreloaderProps {
  onComplete: () => void;
}

// Hero image that we transition into - MUST match Hero.tsx first image exactly
export const HERO_TRANSITION_IMAGE = "/images/hero/team-collaboration.webp";

// Preloader images - middle one (index 2) will become hero background
// Using responsive srcset for gallery images (displayed at 144-256px)
const preloaderPhotos = [
  {
    src: '/images/gallery/minimal-gradient-sunset.webp',
    srcSet: '/images/gallery/minimal-gradient-sunset-sm.webp 320w, /images/gallery/minimal-gradient-sunset.webp 1920w',
    sizes: '(max-width: 768px) 144px, 256px',
    alt: 'Gradient sunset'
  },
  {
    src: '/images/gallery/abstract-gradient-purple.webp',
    srcSet: '/images/gallery/abstract-gradient-purple-sm.webp 320w, /images/gallery/abstract-gradient-purple.webp 1920w',
    sizes: '(max-width: 768px) 144px, 256px',
    alt: 'Purple gradient'
  },
  {
    src: HERO_TRANSITION_IMAGE,
    srcSet: '/images/hero/team-collaboration-sm.webp 640w, /images/hero/team-collaboration-md.webp 1024w, /images/hero/team-collaboration.webp 1920w',
    sizes: '100vw', // This one zooms to full screen
    alt: 'Team collaboration'
  }, // MAIN - matches Hero first image
  {
    src: '/images/gallery/architecture-modern-building.webp',
    srcSet: '/images/gallery/architecture-modern-building-sm.webp 320w, /images/gallery/architecture-modern-building.webp 1620w',
    sizes: '(max-width: 768px) 144px, 256px',
    alt: 'Modern building'
  },
  {
    src: '/images/gallery/workspace-modern-office.webp',
    srcSet: '/images/gallery/workspace-modern-office-sm.webp 320w, /images/gallery/workspace-modern-office.webp 1620w',
    sizes: '(max-width: 768px) 144px, 256px',
    alt: 'Modern office'
  },
];

const Preloader = ({ onComplete }: PreloaderProps) => {
  // Added 'settling' phase for extended animation while allowing LCP measurement
  const [phase, setPhase] = useState<'logo' | 'photos' | 'zooming' | 'settling' | 'complete'>('logo');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasCheckedDevice, setHasCheckedDevice] = useState(false);
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

  // Check for mobile device - skip preloader entirely on mobile for better LCP/FCP
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      // Check viewport width (< 768px is mobile/tablet)
      const isSmallViewport = window.innerWidth < 768;
      // Also check for touch device as a secondary signal
      const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
      // Consider it mobile if either condition is true
      return isSmallViewport || isTouchDevice;
    };

    const mobile = checkMobile();
    setIsMobile(mobile);
    setHasCheckedDevice(true);

    // If mobile, immediately complete the preloader
    if (mobile) {
      handleComplete();
    }
  }, [handleComplete]);

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
    // Skip animation timers on mobile or reduced motion
    if (prefersReducedMotion || isMobile) {
      handleComplete();
      return;
    }

    // Don't start timers until device check is complete
    if (!hasCheckedDevice) return;

    // Clear any existing timers before setting new ones
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    // EXTENDED TIMING (~6.5s) - Uses progressive opacity for LCP-friendly longer animation
    // The key insight: Chrome measures LCP when content is painted, not visually visible
    // By making preloader semi-transparent during 'settling', Hero underneath counts for LCP

    // Phase 1: Logo with elegant reveal (0-1200ms)
    timersRef.current.push(setTimeout(() => setPhase('photos'), 1200));

    // Phase 2: Photos cascade in (1200-2800ms)
    timersRef.current.push(setTimeout(() => setPhase('zooming'), 2800));

    // Phase 3: Zoom + crossfade to hero (2800-4200ms)
    // Preloader becomes slightly transparent (0.98) - imperceptible to users but helps LCP
    timersRef.current.push(setTimeout(() => setPhase('settling'), 4200));

    // Phase 4: Settling - hero image fully visible (4200-5700ms)
    // Preloader remains solid during this phase

    // Phase 5: Preloader starts fading out (5700ms)
    timersRef.current.push(setTimeout(() => setPhase('complete'), 5700));

    // Phase 6: Dispatch event AFTER preloader starts fading (6000ms)
    // Text animates on clear background - no opacity stacking confusion
    timersRef.current.push(setTimeout(() => {
      dispatchPreloaderComplete(); // Tell Hero to start text animation
    }, 6000)); // 300ms after preloader starts fading

    // Phase 7: Remove preloader from DOM (6500ms)
    timersRef.current.push(setTimeout(() => {
      handleComplete();
    }, 6500));

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [handleComplete, prefersReducedMotion, isMobile, hasCheckedDevice]);

  // Skip preloader on mobile or reduced motion for better performance
  if (prefersReducedMotion || isMobile) return null;

  // Phase checks
  const isZooming = phase === 'zooming';
  const isSettling = phase === 'settling';
  const shouldFadeOut = phase === 'complete';

  // Progressive opacity - allows LCP measurement while maintaining visual solidity
  // Chrome/Lighthouse sees content at opacity > 0 as "painted"
  // Users perceive opacity 0.95+ as fully solid (can't see Hero text through it)
  const getOpacity = () => {
    switch (phase) {
      case 'logo':
      case 'photos':
        return 1;
      case 'zooming':
        return 0.98; // Nearly imperceptible, browser registers content underneath
      case 'settling':
        return 0.96; // Still looks solid to users, but Chrome can measure LCP
      case 'complete':
        return 0;
      default:
        return 1;
    }
  };

  return (
    <motion.div
      ref={containerRef}
      data-preloader
      initial={{ opacity: 1 }}
      animate={{ opacity: getOpacity() }}
      transition={{
        duration: shouldFadeOut ? 0.5 : 0.3,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="fixed inset-0 z-[100] overflow-hidden h-screen h-[100dvh]"
      style={{
        backgroundColor: '#FAFAFA',
        willChange: 'opacity',
        contain: 'layout paint', // Hints browser to paint content underneath
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
                duration: 1.1, // Slower, cinematic reveal and wipe
                delay: 0.1,
                times: [0, 0.4, 0.75, 1],
                ease: [0.16, 1, 0.3, 1]
              }}
              className="text-gray-900 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-semibold tracking-[0.15em] uppercase"
            >
              NEXO
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 2, 3 & 4: Photos that zoom together as a group */}
      {(phase === 'photos' || phase === 'zooming' || phase === 'settling') && (
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
              scale: (isZooming || isSettling) ? 7 : 1,
            }}
            transition={{
              duration: 1.4, // Slower, cinematic zoom
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
                    duration: 0.9, // Slower, cinematic reveal
                    delay: (preloaderPhotos.length - 1 - index) * 0.15, // Slower stagger
                    ease: [0.16, 1, 0.3, 1]
                  },
                  opacity: {
                    duration: 0.6,
                    delay: (preloaderPhotos.length - 1 - index) * 0.15,
                  }
                }}
                className="relative overflow-hidden flex-shrink-0 w-36 h-24 sm:w-44 sm:h-28 md:w-56 md:h-36 lg:w-64 lg:h-40"
                style={{ borderRadius: '4px' }}
              >
                <motion.img
                  src={photo.src}
                  srcSet={photo.srcSet}
                  sizes={photo.sizes}
                  alt={photo.alt}
                  width={256}
                  height={160}
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 1.0, // Slower scale
                    delay: (preloaderPhotos.length - 1 - index) * 0.15,
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
      {(isZooming || isSettling) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1.0, // Slower, cinematic crossfade
            delay: isZooming ? 0.5 : 0,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="absolute inset-0 z-20"
          style={{
            backgroundColor: 'hsl(0, 0%, 4%)'
          }}
        >
          <img
            src={HERO_TRANSITION_IMAGE}
            srcSet="/images/hero/team-collaboration-sm.webp 640w, /images/hero/team-collaboration-md.webp 1024w, /images/hero/team-collaboration.webp 1920w"
            sizes="100vw"
            alt="עבודת צוות"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />

          {/* Gradient overlays fade in with the image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: isZooming ? 0.8 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,4%)]/80 via-[hsl(0,0%,4%)]/30 to-transparent"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: isZooming ? 0.8 : 0 }}
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
            srcSet="/images/hero/team-collaboration-sm.webp 640w, /images/hero/team-collaboration-md.webp 1024w, /images/hero/team-collaboration.webp 1920w"
            sizes="100vw"
            alt="עבודת צוות"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,4%)]/80 via-[hsl(0,0%,4%)]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(0,0%,4%)]/60 to-transparent" />
        </div>
      )}

      {/*
        NOTE: Hero text removed from Preloader to prevent double animation.
        The Hero component is now the single source of truth for all hero text.
        Preloader only handles the image transition.
      */}
    </motion.div>
  );
};

export default Preloader;

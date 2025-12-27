import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { dispatchPreloaderComplete } from "@/lib/lenis";

interface PreloaderProps {
  onComplete: () => void;
}

// Hero image that we transition into - MUST match Hero.tsx first image exactly
// Full resolution for hero transition, WebP format for smaller file size
export const HERO_TRANSITION_IMAGE = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80&fm=webp&fit=crop";

/**
 * Optimized Preloader - ~2.5 second total duration
 *
 * Timeline:
 * - 0.0s: Logo appears with clip-path reveal animation (faster 450ms)
 * - 0.5s: Logo wipes out, fade to dark begins
 * - 1.6s: Preloader starts fading out
 * - 2.0s: onComplete called, preloader removed
 */
const Preloader = ({ onComplete }: PreloaderProps) => {
  const [phase, setPhase] = useState<'logo' | 'transition' | 'complete'>('logo');
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  useEffect(() => {
    if (prefersReducedMotion) {
      dispatchPreloaderComplete();
      onComplete();
      return;
    }

    const timers: NodeJS.Timeout[] = [];

    // Phase 1: Logo shows for 0.5s (faster reveal + hold)
    timers.push(setTimeout(() => setPhase('transition'), 500));

    // Phase 2: Transition to dark, start fade out
    timers.push(setTimeout(() => setPhase('complete'), 1600));

    // Remove preloader at 2s total
    timers.push(setTimeout(() => {
      // Notify Lenis that preloader is complete so it can start RAF loop
      dispatchPreloaderComplete();
      onComplete();
    }, 2000));

    return () => timers.forEach(clearTimeout);
  }, [onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  const shouldFadeOut = phase === 'complete';

  return (
    <motion.div
      ref={containerRef}
      data-preloader
      initial={{ opacity: 1 }}
      animate={{ opacity: shouldFadeOut ? 0 : 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{
        backgroundColor: phase === 'logo' ? '#FAFAFA' : 'hsl(0, 0%, 4%)',
        willChange: 'opacity'
      }}
    >
      {/* Dark background that fades in during transition */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase !== 'logo' ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 bg-[hsl(0,0%,4%)]"
      />

      {/* Phase 1: Logo with reveal and wipe-out */}
      <AnimatePresence>
        {phase === 'logo' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
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
                duration: 0.45,
                delay: 0.05,
                times: [0, 0.5, 0.7, 1],
                ease: [0.16, 1, 0.3, 1]
              }}
              className="text-gray-900 text-5xl md:text-7xl font-medium tracking-[0.1em] uppercase"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              NEXO
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient overlays for smooth transition to hero */}
      {phase !== 'logo' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,4%)]/80 via-[hsl(0,0%,4%)]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(0,0%,4%)]/60 to-transparent" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Preloader;

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const timeoutIdsRef = useRef<NodeJS.Timeout[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Memoize onComplete to prevent unnecessary effect re-runs
  const stableOnComplete = useCallback(() => {
    if (isMountedRef.current) {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    // Mark component as mounted
    isMountedRef.current = true;

    // Clear any existing timeouts and interval from previous renders
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = [];

    intervalRef.current = setInterval(() => {
      // Check if component is still mounted before updating state
      if (!isMountedRef.current) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        return;
      }

      setProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          const exitingTimeoutId = setTimeout(() => {
            // Check if still mounted before state updates
            if (!isMountedRef.current) return;

            setIsExiting(true);
            const completeTimeoutId = setTimeout(() => {
              // Check if still mounted before calling onComplete
              if (isMountedRef.current) {
                stableOnComplete();
              }
            }, 800);
            timeoutIdsRef.current.push(completeTimeoutId);
          }, 300);
          timeoutIdsRef.current.push(exitingTimeoutId);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    return () => {
      // Mark component as unmounted to prevent state updates
      isMountedRef.current = false;

      // Clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Clear all tracked timeouts
      timeoutIdsRef.current.forEach(clearTimeout);
      timeoutIdsRef.current = [];
    };
  }, [stableOnComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-hero-bg flex flex-col items-center justify-center"
        >
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-12"
          >
            {/* Glow Effect */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px hsl(var(--primary) / 0.3)",
                  "0 0 60px hsl(var(--primary) / 0.6)",
                  "0 0 20px hsl(var(--primary) / 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full blur-xl"
            />
            
            {/* Logo Text */}
            <div className="relative">
              {"NEXO".split("").map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block text-6xl md:text-8xl font-black text-hero-fg"
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-hero-fg/60 text-lg mb-12 tracking-widest"
          >
            DIGITAL AGENCY
          </motion.p>

          {/* Progress Bar */}
          <div className="w-64 md:w-80">
            <div className="h-[2px] bg-hero-fg/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                className="h-full bg-gradient-to-r from-primary to-primary/60 relative"
              >
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-hero-fg/30 to-transparent"
                />
              </motion.div>
            </div>
            
            {/* Progress Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex justify-between text-hero-fg/40 text-sm font-medium"
            >
              <span>טוען חוויה</span>
              <span>{Math.round(Math.min(progress, 100))}%</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;

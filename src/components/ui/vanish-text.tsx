"use client";

import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface VanishTextProps {
  /** Array of text strings to cycle through */
  texts: string[];
  /** Interval in milliseconds between text changes (default: 3000) */
  interval?: number;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Duration of the animation in seconds (default: 0.5) */
  duration?: number;
  /** Direction of text (default: "rtl" for Hebrew support) */
  direction?: "rtl" | "ltr";
  /** Custom exit animation offset in pixels (default: -20) */
  exitOffset?: number;
  /** Custom enter animation offset in pixels (default: 20) */
  enterOffset?: number;
}

const textVariants: Variants = {
  initial: (custom: { enterOffset: number }) => ({
    opacity: 0,
    y: custom.enterOffset,
    filter: "blur(4px)",
  }),
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
  exit: (custom: { exitOffset: number }) => ({
    opacity: 0,
    y: custom.exitOffset,
    filter: "blur(4px)",
  }),
};

function VanishTextComponent({
  texts,
  interval = 3000,
  className,
  style,
  duration = 0.5,
  direction = "rtl",
  exitOffset = -20,
  enterOffset = 20,
}: VanishTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Memoize the custom values for animation variants
  const customValues = useMemo(
    () => ({
      exitOffset,
      enterOffset,
    }),
    [exitOffset, enterOffset]
  );

  // Memoize transition config
  const transition = useMemo(
    () => ({
      duration,
      ease: [0.25, 0.4, 0.25, 1] as const,
    }),
    [duration]
  );

  // Callback to advance to next text
  const advanceText = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % texts.length);
  }, [texts.length]);

  // Set up interval for cycling through texts
  useEffect(() => {
    if (texts.length <= 1) return;

    const timer = setInterval(advanceText, interval);
    return () => clearInterval(timer);
  }, [texts.length, interval, advanceText]);

  // Get current text
  const currentText = texts[currentIndex] || "";

  return (
    <span
      className={cn("relative inline-block", className)}
      style={{ direction, ...style }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={currentIndex}
          custom={customValues}
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          className="inline-block"
        >
          {currentText}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// Wrap in memo to prevent unnecessary re-renders when parent re-renders with same props
export const VanishText = memo(VanishTextComponent);

export default VanishText;

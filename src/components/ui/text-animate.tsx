"use client";

import { memo, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimationType =
  | "fadeIn"
  | "slideUp"
  | "slideDown"
  | "blurInUp"
  | "blurInDown"
  | "wordFadeIn"
  | "charFadeIn";

interface TextAnimateProps {
  children: string;
  type?: AnimationType;
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  by?: "word" | "character";
}

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const blurInUpVariants: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const blurInDownVariants: Variants = {
  hidden: { opacity: 0, y: -10, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const wordFadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const charFadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const variantsMap: Record<AnimationType, Variants> = {
  fadeIn: fadeInVariants,
  slideUp: slideUpVariants,
  slideDown: slideDownVariants,
  blurInUp: blurInUpVariants,
  blurInDown: blurInDownVariants,
  wordFadeIn: wordFadeInVariants,
  charFadeIn: charFadeInVariants,
};

function TextAnimateComponent({
  children,
  type = "blurInUp",
  delay = 0,
  duration = 0.4,
  stagger = 0.03,
  className,
  by = "word",
}: TextAnimateProps) {
  // Memoize variants lookup to prevent unnecessary object creation
  const variants = useMemo(() => variantsMap[type], [type]);

  // Memoize animation type flags
  const isWordAnimation = useMemo(
    () => type === "wordFadeIn" || by === "word",
    [type, by]
  );
  const isCharAnimation = useMemo(
    () => type === "charFadeIn" || by === "character",
    [type, by]
  );

  // Memoize split arrays to prevent recalculation on every render
  const words = useMemo(
    () => (isWordAnimation ? children.split(" ") : []),
    [children, isWordAnimation]
  );
  const characters = useMemo(
    () => (isCharAnimation ? children.split("") : []),
    [children, isCharAnimation]
  );

  // Memoize transition objects to prevent new object creation on each render
  const simpleTransition = useMemo(
    () => ({
      duration,
      delay,
      ease: [0.25, 0.4, 0.25, 1] as const,
    }),
    [duration, delay]
  );

  const staggerTransition = useMemo(
    () => ({
      staggerChildren: stagger,
      delayChildren: delay,
    }),
    [stagger, delay]
  );

  const childTransition = useMemo(
    () => ({
      duration,
      ease: [0.25, 0.4, 0.25, 1] as const,
    }),
    [duration]
  );

  // Simple animation (no splitting)
  if (!isWordAnimation && !isCharAnimation) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={simpleTransition}
        className={cn(className)}
      >
        {children}
      </motion.div>
    );
  }

  // Split by words
  if (isWordAnimation) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        transition={staggerTransition}
        className={cn("inline-block", className)}
      >
        {words.map((word, wordIndex) => (
          <motion.span
            key={`${word}-${wordIndex}`}
            variants={variants}
            transition={childTransition}
            className="inline-block mr-[0.25em]"
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  // Split by characters
  if (isCharAnimation) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        transition={staggerTransition}
        className={cn("inline-block", className)}
      >
        {characters.map((char, charIndex) => (
          <motion.span
            key={`${char}-${charIndex}`}
            variants={variants}
            transition={childTransition}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  return null;
}

// Wrap in memo to prevent unnecessary re-renders when parent re-renders with same props
export const TextAnimate = memo(TextAnimateComponent);

export default TextAnimate;

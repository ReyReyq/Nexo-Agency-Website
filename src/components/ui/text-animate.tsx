"use client";

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

export function TextAnimate({
  children,
  type = "blurInUp",
  delay = 0,
  duration = 0.4,
  stagger = 0.03,
  className,
  by = "word",
}: TextAnimateProps) {
  const variants = variantsMap[type];

  const isWordAnimation = type === "wordFadeIn" || by === "word";
  const isCharAnimation = type === "charFadeIn" || by === "character";

  // Simple animation (no splitting)
  if (!isWordAnimation && !isCharAnimation) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.4, 0.25, 1],
        }}
        className={cn(className)}
      >
        {children}
      </motion.div>
    );
  }

  // Split by words
  if (isWordAnimation) {
    const words = children.split(" ");
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{
          staggerChildren: stagger,
          delayChildren: delay,
        }}
        className={cn("inline-block", className)}
      >
        {words.map((word, wordIndex) => (
          <motion.span
            key={`${word}-${wordIndex}`}
            variants={variants}
            transition={{
              duration,
              ease: [0.25, 0.4, 0.25, 1],
            }}
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
    const characters = children.split("");
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{
          staggerChildren: stagger,
          delayChildren: delay,
        }}
        className={cn("inline-block", className)}
      >
        {characters.map((char, charIndex) => (
          <motion.span
            key={`${char}-${charIndex}`}
            variants={variants}
            transition={{
              duration,
              ease: [0.25, 0.4, 0.25, 1],
            }}
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

export default TextAnimate;

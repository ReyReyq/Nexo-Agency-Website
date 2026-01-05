import { ReactNode, useState, useMemo, memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import Magnet from "./Magnet";

interface RippleButtonProps {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "dark" | "charcoal";
}

// Static configurations moved outside component to prevent recreation on each render
const SIZE_CLASSES = {
  sm: "h-14 px-8 text-sm",
  md: "h-[70px] px-12 text-base",
  lg: "h-[104px] px-12 text-lg",
} as const;

// Using design tokens where available
const COLOR_CONFIG = {
  primary: {
    base: "bg-primary",
    ripple1: "bg-primary-bright/90",
    ripple2: "bg-primary-bright/80",
    text: "text-white",
  },
  secondary: {
    base: "bg-brand-purple",
    ripple1: "bg-brand-purple-light/90",
    ripple2: "bg-brand-purple-light",
    text: "text-white",
  },
  dark: {
    base: "bg-nexo-charcoal",
    ripple1: "bg-nexo-graphite",
    ripple2: "bg-nexo-slate",
    text: "text-white",
  },
  charcoal: {
    base: "bg-nexo-graphite",
    ripple1: "bg-nexo-slate",
    ripple2: "bg-nexo-steel",
    text: "text-white",
  },
} as const;

// Memoized spring transition config
const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 400,
  damping: 10,
  mass: 1,
} as const;

/**
 * RippleButton - Elastic button with horizontal ripple effect
 * Features elastic scale animation and staggered ripple layers on hover
 */
const RippleButton = memo(({
  children,
  to,
  href,
  onClick,
  className = "",
  size = "md",
  variant = "primary",
}: RippleButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Memoized callbacks to prevent recreation on each render
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const colors = COLOR_CONFIG[variant];
  const sizeClass = SIZE_CLASSES[size];

  // Memoize animation states to prevent object recreation
  const animateState = useMemo(() =>
    isHovered ? { scaleX: 1.03, scaleY: 0.98 } : { scaleX: 1, scaleY: 1 },
    [isHovered]
  );

  // Memoize ripple transition configs
  const ripple1Transition = useMemo(() => ({
    duration: 0.8,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    delay: isHovered ? 0 : 0.15,
  }), [isHovered]);

  const ripple2Transition = useMemo(() => ({
    duration: 0.8,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    delay: isHovered ? 0.15 : 0,
  }), [isHovered]);

  const rippleAnimate = useMemo(() =>
    isHovered ? { x: "0%" } : { x: "100%" },
    [isHovered]
  );

  const buttonContent = (
    <motion.button
      className={cn(
        "relative inline-flex items-center justify-center rounded-full border-none cursor-pointer overflow-hidden",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-nexo-charcoal",
        sizeClass,
        colors.text,
        className
      )}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ scaleX: 1, scaleY: 1 }}
      animate={animateState}
      transition={SPRING_TRANSITION}
    >
      {/* Base background */}
      <span
        className={cn(
          "absolute inset-0 rounded-full transition-colors duration-300",
          colors.base
        )}
      />

      {/* Ripple Layer 1 */}
      <motion.span
        className={cn(
          "absolute inset-[-1px] rounded-full",
          colors.ripple1
        )}
        initial={{ x: "-100%" }}
        animate={rippleAnimate}
        transition={ripple1Transition}
      />

      {/* Ripple Layer 2 */}
      <motion.span
        className={cn(
          "absolute inset-[-1px] rounded-full",
          colors.ripple2
        )}
        initial={{ x: "-100%" }}
        animate={rippleAnimate}
        transition={ripple2Transition}
      />

      {/* Text content */}
      <span className="relative z-10 font-semibold uppercase tracking-wide">
        {children}
      </span>
    </motion.button>
  );

  // Render with appropriate wrapper
  if (to) {
    return (
      <Magnet magnetStrength={3} padding={60}>
        <Link to={to} className="inline-block">
          {buttonContent}
        </Link>
      </Magnet>
    );
  }

  if (href) {
    return (
      <Magnet magnetStrength={3} padding={60}>
        <a href={href} className="inline-block">
          {buttonContent}
        </a>
      </Magnet>
    );
  }

  return (
    <Magnet magnetStrength={3} padding={60}>
      {buttonContent}
    </Magnet>
  );
});

// Display name for React DevTools debugging
RippleButton.displayName = "RippleButton";

export default RippleButton;

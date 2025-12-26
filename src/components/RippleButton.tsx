import { ReactNode, useState } from "react";
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

/**
 * RippleButton - Elastic button with horizontal ripple effect
 * Features elastic scale animation and staggered ripple layers on hover
 */
const RippleButton = ({
  children,
  to,
  href,
  onClick,
  className = "",
  size = "md",
  variant = "primary",
}: RippleButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Size configurations
  const sizeClasses = {
    sm: "h-14 px-8 text-sm",
    md: "h-[70px] px-12 text-base",
    lg: "h-[104px] px-12 text-lg",
  };

  // Color configurations
  const colorConfig = {
    primary: {
      base: "bg-primary",
      ripple1: "bg-[hsl(328,100%,60%)]",
      ripple2: "bg-[hsl(328,100%,65%)]",
      text: "text-white",
    },
    secondary: {
      base: "bg-[#8330c2]",
      ripple1: "bg-[#933bd7]",
      ripple2: "bg-[#9e4cdc]",
      text: "text-white",
    },
    dark: {
      base: "bg-[#1a1a1a]",
      ripple1: "bg-[#2a2a2a]",
      ripple2: "bg-[#3a3a3a]",
      text: "text-white",
    },
    charcoal: {
      base: "bg-[#2d3748]",
      ripple1: "bg-[#3d4a5c]",
      ripple2: "bg-[#4a5568]",
      text: "text-white",
    },
  };

  const colors = colorConfig[variant];

  const buttonContent = (
    <motion.button
      className={cn(
        "relative inline-flex items-center justify-center rounded-full border-none cursor-pointer overflow-hidden",
        sizeClasses[size],
        colors.text,
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ scaleX: 1, scaleY: 1 }}
      animate={
        isHovered
          ? { scaleX: 1.03, scaleY: 0.98 }
          : { scaleX: 1, scaleY: 1 }
      }
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 10,
        mass: 1,
      }}
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
        animate={isHovered ? { x: "0%" } : { x: "100%" }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
          delay: isHovered ? 0 : 0.15,
        }}
      />

      {/* Ripple Layer 2 */}
      <motion.span
        className={cn(
          "absolute inset-[-1px] rounded-full",
          colors.ripple2
        )}
        initial={{ x: "-100%" }}
        animate={isHovered ? { x: "0%" } : { x: "100%" }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
          delay: isHovered ? 0.15 : 0,
        }}
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
};

export default RippleButton;

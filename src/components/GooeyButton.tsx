import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import Magnet from "./Magnet";

interface GooeyButtonProps {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "accent" | "purple";
}

/**
 * GooeyButton - Wave fill button with staggered layer animations
 * Pure CSS/Tailwind implementation for smooth wave effect on hover
 * Based on poppr.be button design
 */
const GooeyButton = ({
  children,
  to,
  href,
  onClick,
  className = "",
  size = "md",
  variant = "primary",
}: GooeyButtonProps) => {
  // Size configurations
  const sizeClasses = {
    sm: "h-12 min-w-[140px] text-sm",
    md: "h-[60px] min-w-[165px] text-base",
    lg: "h-[70px] min-w-[200px] text-lg",
  };

  // Color configurations matching your theme
  const colorConfig = {
    primary: {
      base: "bg-primary", // Neon pink
      wave1: "bg-[#a474ff]", // Purple
      wave2: "bg-[#17f1d1]", // Cyan
      wave3: "bg-primary", // Back to primary
      text: "text-white",
    },
    secondary: {
      base: "bg-[#1a1a1a]", // Dark
      wave1: "bg-primary", // Primary pink
      wave2: "bg-[#a474ff]", // Purple
      wave3: "bg-[#1a1a1a]", // Dark
      text: "text-white",
    },
    accent: {
      base: "bg-[#FFAB70]", // Orange
      wave1: "bg-[#a474ff]", // Purple
      wave2: "bg-[#17f1d1]", // Cyan
      wave3: "bg-[#FFAB70]", // Orange
      text: "text-black",
    },
    purple: {
      base: "bg-[#8330c2]", // Purple
      wave1: "bg-[#9e4cdc]", // Lighter purple
      wave2: "bg-[#17f1d1]", // Cyan
      wave3: "bg-[#8330c2]", // Purple
      text: "text-white",
    },
  };

  const colors = colorConfig[variant];

  const buttonContent = (
    <button
      className={cn(
        "group relative inline-block overflow-hidden rounded-full cursor-pointer border-none",
        sizeClasses[size],
        colors.text,
        className
      )}
      onClick={onClick}
    >
      {/* Background container - scales down on hover */}
      <div
        className={cn(
          "h-full w-full overflow-hidden rounded-full",
          colors.base,
          "[transition:transform_2s_cubic-bezier(.19,1,.22,1)]",
          "group-hover:scale-[.94]"
        )}
      >
        {/* Wave Layer 1 */}
        <span
          className={cn(
            "absolute bottom-0 left-1/2 z-20 block h-[200%] w-[120%]",
            "translate-y-[100%] -translate-x-1/2",
            "[border-radius:999px_999px_0_0]",
            colors.wave1,
            "group-hover:translate-y-[10px]",
            "group-hover:[border-radius:60%_60%_0_0]",
            "group-hover:[transition:transform_1.4s_cubic-bezier(.19,1,.22,1)_250ms,border-radius_.3s_cubic-bezier(.19,1,.22,1)_350ms]"
          )}
        />
        {/* Wave Layer 2 */}
        <span
          className={cn(
            "absolute bottom-0 left-1/2 z-20 block h-[200%] w-[120%]",
            "translate-y-[100%] -translate-x-1/2",
            "[border-radius:999px_999px_0_0]",
            colors.wave2,
            "group-hover:translate-y-[10px]",
            "group-hover:[border-radius:60%_60%_0_0]",
            "group-hover:[transition:transform_1.4s_cubic-bezier(.19,1,.22,1)_400ms,border-radius_.3s_cubic-bezier(.19,1,.22,1)_550ms]"
          )}
        />
        {/* Wave Layer 3 */}
        <span
          className={cn(
            "absolute bottom-0 left-1/2 z-20 block h-[200%] w-[120%]",
            "translate-y-[100%] -translate-x-1/2",
            "[border-radius:999px_999px_0_0]",
            colors.wave3,
            "group-hover:translate-y-[10px]",
            "group-hover:[border-radius:60%_60%_0_0]",
            "group-hover:[transition:transform_1.4s_cubic-bezier(.19,1,.22,1)_520ms,border-radius_.3s_cubic-bezier(.19,1,.22,1)_750ms]"
          )}
        />
      </div>

      {/* Text that slides out */}
      <span
        className={cn(
          "absolute inset-0 z-10 m-auto flex items-center justify-center font-semibold",
          "group-hover:-translate-y-1/3 group-hover:opacity-0",
          "group-hover:[transition:transform_1.4s_cubic-bezier(.32,.99,.49,.99),opacity_.6s]"
        )}
      >
        {children}
      </span>

      {/* Text that slides in */}
      <span
        className={cn(
          "absolute inset-0 z-10 m-auto flex items-center justify-center font-semibold",
          "translate-y-1/3 opacity-0",
          "group-hover:translate-y-0 group-hover:opacity-100",
          "group-hover:[transition:1.4s_all_cubic-bezier(.32,.99,.49,.99)]"
        )}
      >
        {children}
      </span>
    </button>
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

export default GooeyButton;

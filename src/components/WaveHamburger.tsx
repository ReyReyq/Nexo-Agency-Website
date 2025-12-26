import { cn } from "@/lib/utils";

interface WaveHamburgerProps {
  isOpen?: boolean;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * WaveHamburger - Animated hamburger menu button with wave color effect
 * Pure CSS/Tailwind implementation with staggered color waves on hover
 * Based on poppr.be burger design
 */
const WaveHamburger = ({
  isOpen = false,
  onClick,
  className = "",
  size = "md",
}: WaveHamburgerProps) => {
  // Size configurations
  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-14 w-14",
    lg: "h-[70px] w-[70px]",
  };

  const lineClasses = {
    sm: "h-[2px] w-4",
    md: "h-[2.5px] w-5",
    lg: "h-[3px] w-6",
  };

  const gapClasses = {
    sm: "gap-[3px]",
    md: "gap-1",
    lg: "gap-[5px]",
  };

  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full border-none cursor-pointer bg-primary",
        sizeClasses[size],
        className
      )}
      onClick={onClick}
    >
      {/* Wave Layer 1 - Orange */}
      <span
        className={cn(
          "absolute bottom-0 left-1/2 block h-[30%] w-[30%] -translate-x-1/2 rounded-full",
          "bg-[#FFAB70] scale-0",
          "[transition:transform_.3s_ease]",
          "group-hover:scale-[6]"
        )}
      />
      {/* Wave Layer 2 - Cyan */}
      <span
        className={cn(
          "absolute bottom-0 left-1/2 block h-[30%] w-[30%] -translate-x-1/2 rounded-full",
          "bg-[#17f1d1] scale-0",
          "[transition:transform_.3s_ease_.1s]",
          "group-hover:scale-[6]"
        )}
      />
      {/* Wave Layer 3 - Primary */}
      <span
        className={cn(
          "absolute bottom-0 left-1/2 block h-[30%] w-[30%] -translate-x-1/2 rounded-full",
          "bg-primary scale-0",
          "[transition:transform_.3s_ease_.2s]",
          "group-hover:scale-[6]"
        )}
      />

      {/* Hamburger Lines */}
      <div className={cn("relative z-10 flex flex-col items-center justify-center", gapClasses[size])}>
        <span
          className={cn(
            "block bg-white rounded-full transition-transform duration-300",
            lineClasses[size],
            isOpen && "translate-y-[7px] rotate-45"
          )}
        />
        <span
          className={cn(
            "block bg-white rounded-full transition-all duration-300",
            lineClasses[size],
            isOpen && "opacity-0 -translate-x-2"
          )}
        />
        <span
          className={cn(
            "block bg-white rounded-full transition-transform duration-300",
            lineClasses[size],
            isOpen && "-translate-y-[7px] -rotate-45"
          )}
        />
      </div>
    </button>
  );
};

export default WaveHamburger;

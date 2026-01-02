import { motion, useMotionValue, useSpring } from "framer-motion";
import React, { useRef, ReactNode, useCallback, useEffect } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

// Moved outside component to prevent recreation on every render
const springConfig = { damping: 15, stiffness: 150 };

const MagneticButton = React.memo(({ children, className = "", onClick }: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  // Cleanup: Reset motion values on unmount to prevent stale state
  useEffect(() => {
    return () => {
      x.set(0);
      y.set(0);
    };
  }, [x, y]);

  return (
    <motion.button
      ref={ref}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative overflow-hidden group ${className}`}
    >
      {/* Glow Effect */}
      <motion.span
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 blur-xl"
      />
      
      {/* Shimmer Effect */}
      <motion.span
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-hero-fg/10 to-transparent"
      />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
});

MagneticButton.displayName = "MagneticButton";

export default MagneticButton;

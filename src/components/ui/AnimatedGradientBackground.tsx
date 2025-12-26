import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedGradientBackgroundProps {
  activeStep: number;
  className?: string;
}

// Color palettes for each step
const stepColorPalettes = {
  1: {
    primary: 'rgba(103, 126, 234, 0.4)',
    secondary: 'rgba(103, 126, 234, 0.2)',
    accent: 'rgba(118, 75, 162, 0.15)',
  },
  2: {
    primary: 'rgba(118, 75, 162, 0.4)',
    secondary: 'rgba(245, 87, 108, 0.2)',
    accent: 'rgba(103, 126, 234, 0.15)',
  },
  3: {
    primary: 'rgba(245, 87, 108, 0.4)',
    secondary: 'rgba(255, 159, 64, 0.2)',
    accent: 'rgba(118, 75, 162, 0.15)',
  },
  4: {
    primary: 'rgba(255, 159, 64, 0.4)',
    secondary: 'rgba(75, 192, 192, 0.2)',
    accent: 'rgba(245, 87, 108, 0.15)',
  },
  5: {
    primary: 'rgba(75, 192, 192, 0.4)',
    secondary: 'rgba(103, 126, 234, 0.2)',
    accent: 'rgba(255, 159, 64, 0.15)',
  },
};

const AnimatedGradientBackground: React.FC<AnimatedGradientBackgroundProps> = ({
  activeStep,
  className,
}) => {
  const colors = stepColorPalettes[activeStep as keyof typeof stepColorPalettes] || stepColorPalettes[1];

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {/* Animated gradient blobs */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colors.primary}, transparent 70%)`,
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colors.secondary}, transparent 70%)`,
        }}
        animate={{
          x: [0, -40, 50, 0],
          y: [0, 50, -40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colors.accent}, transparent 70%)`,
        }}
        animate={{
          x: [0, 40, -50, 0],
          y: [0, -50, 40, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Additional smaller blobs for depth */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl opacity-50"
        style={{
          background: `radial-gradient(circle, ${colors.primary}, transparent 70%)`,
        }}
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 20, -30, 0],
          scale: [1, 1.15, 0.85, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/3 right-1/3 w-56 h-56 rounded-full blur-3xl opacity-40"
        style={{
          background: `radial-gradient(circle, ${colors.secondary}, transparent 70%)`,
        }}
        animate={{
          x: [0, 35, -25, 0],
          y: [0, -25, 35, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Subtle grain/noise overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Animated grain for subtle movement */}
      <motion.div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter2)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '150px 150px',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Radial gradient overlay for vignette effect */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
        }}
      />

      {/* Top and bottom fade for seamless integration */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
};

export default AnimatedGradientBackground;

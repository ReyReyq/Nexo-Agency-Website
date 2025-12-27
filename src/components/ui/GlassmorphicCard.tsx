import React from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
  animated?: boolean;
}

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  className,
  glowColor,
  intensity = 'medium',
  animated = false,
}) => {
  const intensityStyles = {
    subtle: 'bg-white/5 backdrop-blur-sm border-white/5',
    medium: 'bg-white/10 backdrop-blur-md border-white/10',
    strong: 'bg-white/15 backdrop-blur-lg border-white/15',
  };

  const glowStyles = glowColor
    ? {
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          0 0 20px ${glowColor}30,
          0 0 40px ${glowColor}20,
          0 0 60px ${glowColor}10
        `,
      }
    : {
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
      };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border duration-300',
        intensityStyles[intensity],
        animated && 'hover:scale-[1.02] hover:shadow-2xl',
        className
      )}
      style={{
        ...glowStyles,
        // Performance: Use specific transition properties instead of transition-all
        transitionProperty: 'transform, box-shadow, border-color',
        // Performance: GPU acceleration for backdrop-filter
        transform: 'translateZ(0)',
        willChange: animated ? 'transform, box-shadow' : 'auto',
      }}
    >
      {/* Border gradient overlay */}
      <div
        className={cn(
          'absolute inset-0 rounded-2xl opacity-50',
          'bg-gradient-to-br from-white/20 via-transparent to-transparent',
          'pointer-events-none'
        )}
      />

      {/* Animated glow pulse (if animated is true) */}
      {animated && glowColor && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none animate-[pulse-glow_3s_ease-in-out_infinite]"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${glowColor}15, transparent 70%)`,
            // Performance: GPU acceleration for animation
            willChange: 'opacity',
            transform: 'translateZ(0)',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Bottom highlight */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-px',
          'bg-gradient-to-r from-transparent via-white/20 to-transparent',
          'pointer-events-none'
        )}
      />
    </div>
  );
};

export default GlassmorphicCard;

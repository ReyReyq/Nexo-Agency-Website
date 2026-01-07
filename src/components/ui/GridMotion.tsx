import { useEffect, useMemo, FC, ReactNode, useState, memo } from 'react';
import { motion, useMotionValue, useSpring, MotionValue } from 'framer-motion';

interface GridMotionProps {
  items?: (string | ReactNode)[];
  gradientColor?: string;
  mobileRows?: number;
  mobileItemsPerRow?: number;
}

const NUM_ROWS = 4;
const ITEMS_PER_ROW = 7;
const MOBILE_BREAKPOINT = 768;
const MAX_MOVE_AMOUNT = 300;

// Spring configs for different row inertia levels (replaces GSAP duration + ease)
// Higher damping = less oscillation, stiffness controls responsiveness
const SPRING_CONFIGS = [
  { stiffness: 80, damping: 20 },   // Row 0: slowest, most inertia
  { stiffness: 100, damping: 22 },  // Row 1
  { stiffness: 120, damping: 24 },  // Row 2
  { stiffness: 140, damping: 26 },  // Row 3: fastest, least inertia
];

// Animated row component using Framer Motion springs
const AnimatedRow = memo(({
  rowIndex,
  itemsPerRow,
  combinedItems,
  isMobile,
  mouseX
}: {
  rowIndex: number;
  itemsPerRow: number;
  combinedItems: (string | ReactNode)[];
  isMobile: boolean;
  mouseX: MotionValue<number>;
}) => {
  const direction = rowIndex % 2 === 0 ? 1 : -1;
  const springConfig = SPRING_CONFIGS[rowIndex % SPRING_CONFIGS.length];

  // Create a spring-animated motion value for smooth row movement
  const targetX = useMotionValue(0);
  const springX = useSpring(targetX, springConfig);

  // Update target based on mouse position
  useEffect(() => {
    const unsubscribe = mouseX.on('change', (latest) => {
      const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
      const moveAmount = ((latest / windowWidth) * MAX_MOVE_AMOUNT - MAX_MOVE_AMOUNT / 2) * direction;
      targetX.set(moveAmount);
    });
    return unsubscribe;
  }, [mouseX, targetX, direction]);

  return (
    <motion.div
      className={isMobile ? 'grid grid-cols-4 gap-6' : 'grid grid-cols-7 gap-4'}
      style={{ x: springX, willChange: 'transform' }}
    >
      {Array.from({ length: itemsPerRow }, (_, itemIndex) => {
        const content = combinedItems[rowIndex * itemsPerRow + itemIndex];
        return (
          <div key={itemIndex} className="w-full">
            {typeof content === 'string' && content.startsWith('http') ? (
              <div className="w-full aspect-[4/3] overflow-hidden rounded-xl bg-white/60 backdrop-blur-sm border border-nexo-mist/50 shadow-sm">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${content})` }}
                />
              </div>
            ) : (
              <div className="w-full">{content}</div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
});

AnimatedRow.displayName = 'AnimatedRow';

const GridMotion: FC<GridMotionProps> = memo(({
  items = [],
  gradientColor = 'rgba(250, 249, 246, 0.8)',
  mobileRows = 2,
  mobileItemsPerRow = 4
}) => {
  // Shared motion value for mouse X position - all rows subscribe to this
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 960);

  // Track mobile state for responsive row count
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  // Calculate current grid dimensions based on screen size
  const numRows = isMobile ? mobileRows : NUM_ROWS;
  const itemsPerRow = isMobile ? mobileItemsPerRow : ITEMS_PER_ROW;

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoize combined items to prevent recreation on every render
  const combinedItems = useMemo(() => {
    const totalNeeded = numRows * itemsPerRow;
    if (items.length > 0) {
      return items.slice(0, totalNeeded);
    }
    return Array.from({ length: totalNeeded }, (_, index) => `Item ${index + 1}`);
  }, [items, numRows, itemsPerRow]);

  // Track mouse/touch position and update the shared motion value
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      mouseX.set(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent): void => {
      if (e.touches.length > 0) {
        mouseX.set(e.touches[0].clientX);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [mouseX]);

  return (
    <div className="h-full w-full overflow-hidden">
      <section
        className="w-full h-full overflow-hidden relative flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at center, ${gradientColor} 0%, transparent 70%)`
        }}
      >
        {/* Grid container - uses CSS grid for consistent cell sizing */}
        <div className={`flex-none relative w-[200vw] flex flex-col gap-4 md:gap-4 rotate-[-12deg] origin-center z-[2] ${isMobile ? 'gap-6' : ''}`}>
          {Array.from({ length: numRows }, (_, rowIndex) => (
            <AnimatedRow
              key={rowIndex}
              rowIndex={rowIndex}
              itemsPerRow={itemsPerRow}
              combinedItems={combinedItems}
              isMobile={isMobile}
              mouseX={mouseX}
            />
          ))}
        </div>
      </section>
    </div>
  );
});

GridMotion.displayName = 'GridMotion';

export default GridMotion;

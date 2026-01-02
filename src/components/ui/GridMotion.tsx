import { useEffect, useRef, useMemo, useCallback, FC, ReactNode } from 'react';
import { gsap } from 'gsap';

interface GridMotionProps {
  items?: (string | ReactNode)[];
  gradientColor?: string;
}

const TOTAL_ITEMS = 28;
const NUM_ROWS = 4;
const ITEMS_PER_ROW = 7;

const GridMotion: FC<GridMotionProps> = ({
  items = [],
  gradientColor = 'rgba(250, 249, 246, 0.8)'
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseXRef = useRef<number>(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);

  // Memoize combined items to prevent recreation on every render
  const combinedItems = useMemo(() => {
    if (items.length > 0) {
      return items.slice(0, TOTAL_ITEMS);
    }
    return Array.from({ length: TOTAL_ITEMS }, (_, index) => `Item ${index + 1}`);
  }, [items]);

  // Memoize ref callback to prevent new function creation on every render
  const setRowRef = useCallback((el: HTMLDivElement | null, index: number) => {
    rowRefs.current[index] = el;
  }, []);

  useEffect(() => {
    // Store original lag smoothing to restore on cleanup
    gsap.ticker.lagSmoothing(0);

    const handleMouseMove = (e: MouseEvent): void => {
      mouseXRef.current = e.clientX;
    };

    const updateMotion = (): void => {
      const maxMoveAmount = 300;
      const baseDuration = 0.8;
      const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

      rowRefs.current.forEach((row, index) => {
        if (row) {
          const direction = index % 2 === 0 ? 1 : -1;
          const moveAmount = ((mouseXRef.current / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) * direction;

          gsap.to(row, {
            x: moveAmount,
            duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
            ease: 'power3.out',
            overwrite: 'auto'
          });
        }
      });
    };

    const removeAnimationLoop = gsap.ticker.add(updateMotion);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      // Remove event listener
      window.removeEventListener('mousemove', handleMouseMove);

      // Remove ticker callback
      removeAnimationLoop();

      // Kill all GSAP animations on row elements to prevent memory leaks
      rowRefs.current.forEach((row) => {
        if (row) {
          gsap.killTweensOf(row);
        }
      });

      // Restore default lag smoothing
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, []);

  return (
    <div ref={gridRef} className="h-full w-full overflow-hidden">
      <section
        className="w-full h-full overflow-hidden relative flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at center, ${gradientColor} 0%, transparent 70%)`
        }}
      >
        {/* Grid container - uses CSS grid for consistent cell sizing */}
        <div className="flex-none relative w-[200vw] flex flex-col gap-4 rotate-[-12deg] origin-center z-[2]">
          {Array.from({ length: NUM_ROWS }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-7 gap-4"
              style={{ willChange: 'transform, filter' }}
              ref={(el) => setRowRef(el, rowIndex)}
            >
              {Array.from({ length: ITEMS_PER_ROW }, (_, itemIndex) => {
                const content = combinedItems[rowIndex * ITEMS_PER_ROW + itemIndex];
                return (
                  // Each cell fills its grid space
                  <div key={itemIndex} className="w-full">
                    {typeof content === 'string' && content.startsWith('http') ? (
                      <div className="w-full aspect-[4/3] overflow-hidden rounded-xl bg-white/60 backdrop-blur-sm border border-[#e5e5e5]/50 shadow-sm">
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${content})` }}
                        />
                      </div>
                    ) : (
                      // ReactNode content - rendered at full size within cell
                      <div className="w-full">{content}</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GridMotion;

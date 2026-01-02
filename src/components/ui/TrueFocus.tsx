import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

interface TrueFocusProps {
  sentence?: string;
  separator?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
}

interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const TrueFocus = ({
  sentence = "True Focus",
  separator = " ",
  manualMode = false,
  blurAmount = 5,
  borderColor = "green",
  glowColor = "rgba(0, 255, 0, 0.6)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  className = "",
}: TrueFocusProps) => {
  // Memoize words array to prevent unnecessary recalculations
  const words = useMemo(() => sentence.split(separator), [sentence, separator]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rafIdRef = useRef<number | null>(null);
  const [focusRect, setFocusRect] = useState<FocusRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Memoized function to update focus rect position
  const updateFocusRect = useCallback((index: number) => {
    if (index === null || index === -1) return;
    if (!wordRefs.current[index] || !containerRef.current) return;

    // Cancel any pending RAF to prevent stale updates
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // Use RAF for smoother performance and to batch with browser paint
    rafIdRef.current = requestAnimationFrame(() => {
      if (!wordRefs.current[index] || !containerRef.current) return;

      const parentRect = containerRef.current.getBoundingClientRect();
      const activeRect = wordRefs.current[index]!.getBoundingClientRect();

      setFocusRect({
        x: activeRect.left - parentRect.left,
        y: activeRect.top - parentRect.top,
        width: activeRect.width,
        height: activeRect.height,
      });

      rafIdRef.current = null;
    });
  }, []);

  // Auto-advance interval effect with proper cleanup
  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(
        () => {
          setCurrentIndex((prev) => (prev + 1) % words.length);
        },
        (animationDuration + pauseBetweenAnimations) * 1000
      );

      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  // Focus rect update effect with RAF cleanup
  useEffect(() => {
    updateFocusRect(currentIndex);

    // Cleanup: cancel any pending RAF on unmount or dependency change
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [currentIndex, updateFocusRect]);

  // ResizeObserver to update focus rect on container resize
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      updateFocusRect(currentIndex);
    });

    resizeObserver.observe(containerRef.current);

    // Cleanup ResizeObserver on unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, [currentIndex, updateFocusRect]);

  // Reset wordRefs array when words change to prevent memory leaks
  useEffect(() => {
    wordRefs.current = wordRefs.current.slice(0, words.length);
  }, [words.length]);

  // Memoized event handlers to prevent unnecessary child re-renders
  const handleMouseEnter = useCallback((index: number) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  }, [manualMode]);

  const handleMouseLeave = useCallback(() => {
    if (manualMode) {
      setCurrentIndex((prev) => lastActiveIndex ?? prev);
    }
  }, [manualMode, lastActiveIndex]);

  return (
    <div
      className={`relative flex gap-4 justify-center items-center flex-wrap ${className}`}
      ref={containerRef}
      style={{ outline: "none", userSelect: "none" }}
      dir="rtl"
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={(el) => {
              wordRefs.current[index] = el;
            }}
            className="relative text-[3rem] font-black cursor-pointer"
            style={{
              filter: isActive ? `blur(0px)` : `blur(${blurAmount}px)`,
              transition: `filter ${animationDuration}s ease`,
              outline: "none",
              userSelect: "none",
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        className="absolute top-0 left-0 pointer-events-none box-border border-0"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0,
        }}
        transition={{
          duration: animationDuration,
        }}
        style={
          {
            "--border-color": borderColor,
            "--glow-color": glowColor,
          } as React.CSSProperties
        }
      >
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] top-[-10px] left-[-10px] border-r-0 border-b-0"
          style={{
            borderColor: borderColor,
            filter: `drop-shadow(0 0 4px ${glowColor})`,
          }}
        />
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] top-[-10px] right-[-10px] border-l-0 border-b-0"
          style={{
            borderColor: borderColor,
            filter: `drop-shadow(0 0 4px ${glowColor})`,
          }}
        />
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] bottom-[-10px] left-[-10px] border-r-0 border-t-0"
          style={{
            borderColor: borderColor,
            filter: `drop-shadow(0 0 4px ${glowColor})`,
          }}
        />
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] bottom-[-10px] right-[-10px] border-l-0 border-t-0"
          style={{
            borderColor: borderColor,
            filter: `drop-shadow(0 0 4px ${glowColor})`,
          }}
        />
      </motion.div>
    </div>
  );
};

export default TrueFocus;

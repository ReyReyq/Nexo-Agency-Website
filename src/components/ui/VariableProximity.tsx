import { forwardRef, useMemo, useRef, useEffect, useCallback, MutableRefObject, CSSProperties, HTMLAttributes, useState } from 'react';
import { motion } from 'framer-motion';

// Performance: throttle function to limit event frequency
function throttle<T extends (...args: Parameters<T>) => void>(fn: T, ms: number): T {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const throttled = ((...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = ms - (now - lastCall);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCall = now;
      fn(...args);
    } else if (!timeoutId) {
      // Schedule trailing call to ensure final position is captured
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn(...args);
      }, remaining);
    }
  }) as T;

  // Attach cleanup method
  (throttled as T & { cancel: () => void }).cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return throttled as T;
}

// Performance: visibility-aware animation frame hook
function useAnimationFrame(callback: () => void, isActive: boolean = true) {
  useEffect(() => {
    if (!isActive) return;

    let frameId: number;
    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback, isActive]);
}

// Cache container rect and update only on resize
function useMousePositionRef(containerRef: MutableRefObject<HTMLElement | null>) {
  const positionRef = useRef({ x: 0, y: 0 });
  const containerRectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    // Update cached container rect
    const updateContainerRect = () => {
      if (containerRef?.current) {
        containerRectRef.current = containerRef.current.getBoundingClientRect();
      }
    };

    // Initial measurement
    updateContainerRect();

    // Set up ResizeObserver for container rect updates
    const resizeObserver = new ResizeObserver(updateContainerRect);
    if (containerRef?.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Performance: throttle scroll handler to 16ms (~60fps) to reduce layout thrashing
    const throttledScrollHandler = throttle(updateContainerRect, 16);
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });

    const updatePosition = (x: number, y: number) => {
      const rect = containerRectRef.current;
      if (rect) {
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (ev: MouseEvent) => updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      resizeObserver.disconnect();
      // Clean up throttled handler's pending timeout
      (throttledScrollHandler as typeof throttledScrollHandler & { cancel: () => void }).cancel();
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}

interface VariableProximityProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: MutableRefObject<HTMLElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>((props, ref) => {
  const {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius = 50,
    falloff = 'linear',
    className = '',
    onClick,
    style,
    ...restProps
  } = props;

  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const interpolatedSettingsRef = useRef<string[]>([]);
  const mousePositionRef = useMousePositionRef(containerRef);
  const lastPositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  // Performance: Clean up refs when label changes to prevent memory leaks
  const labelLength = label.replace(/ /g, '').length;
  useEffect(() => {
    // Trim refs arrays to match current label length
    letterRefs.current.length = labelLength;
    interpolatedSettingsRef.current.length = labelLength;
  }, [labelLength]);

  // Performance: track visibility for pausing animations
  const [isVisible, setIsVisible] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(() =>
    typeof document !== 'undefined' ? document.visibilityState === 'visible' : true
  );

  // IntersectionObserver for viewport visibility
  useEffect(() => {
    if (!containerRef?.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);

  // Tab visibility listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const shouldAnimate = isVisible && isTabVisible;

  // Cache letter positions - only update on resize, not every frame
  const letterPositionsRef = useRef<{ centerX: number; centerY: number }[]>([]);
  const containerRectCacheRef = useRef<DOMRect | null>(null);

  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsStr: string) =>
      new Map(
        settingsStr
          .split(',')
          .map(s => s.trim())
          .map(s => {
            const [name, value] = s.split(' ');
            return [name.replace(/['"]/g, ''), parseFloat(value)];
          })
      );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const calculateFalloff = useCallback((distance: number) => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    switch (falloff) {
      case 'exponential':
        return norm ** 2;
      case 'gaussian':
        return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
      case 'linear':
      default:
        return norm;
    }
  }, [radius, falloff]);

  // Cache letter positions - update only on resize/scroll, not every frame
  const updateLetterPositions = useCallback(() => {
    if (!containerRef?.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    containerRectCacheRef.current = containerRect;

    // Batch read all letter positions at once
    letterPositionsRef.current = letterRefs.current.map((letterRef) => {
      if (!letterRef) return { centerX: 0, centerY: 0 };
      const rect = letterRef.getBoundingClientRect();
      return {
        centerX: rect.left + rect.width / 2 - containerRect.left,
        centerY: rect.top + rect.height / 2 - containerRect.top
      };
    });
  }, [containerRef]);

  // Set up ResizeObserver and scroll listener to update cached positions
  useEffect(() => {
    // Initial position calculation (delayed to allow render)
    const timeoutId = setTimeout(updateLetterPositions, 100);

    const resizeObserver = new ResizeObserver(() => {
      updateLetterPositions();
    });

    if (containerRef?.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Performance: throttle scroll/resize handlers to 16ms (~60fps) to reduce layout thrashing
    const throttledScrollHandler = throttle(updateLetterPositions, 16);
    const throttledResizeHandler = throttle(updateLetterPositions, 100); // Resize is less frequent, use 100ms

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    window.addEventListener('resize', throttledResizeHandler, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      // Clean up throttled handlers' pending timeouts
      (throttledScrollHandler as typeof throttledScrollHandler & { cancel: () => void }).cancel();
      (throttledResizeHandler as typeof throttledResizeHandler & { cancel: () => void }).cancel();
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('resize', throttledResizeHandler);
    };
  }, [containerRef, updateLetterPositions]);

  const animationCallback = useCallback(() => {
    if (!containerRef?.current) return;
    const { x, y } = mousePositionRef.current;
    if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) {
      return;
    }
    lastPositionRef.current = { x, y };

    // Use cached positions instead of calling getBoundingClientRect every frame
    const positions = letterPositionsRef.current;
    if (positions.length === 0) return;

    // Batch all style writes together (no DOM reads in this loop)
    letterRefs.current.forEach((letterRef, index) => {
      if (!letterRef) return;

      const pos = positions[index];
      if (!pos) return;

      const distance = calculateDistance(x, y, pos.centerX, pos.centerY);

      if (distance >= radius) {
        letterRef.style.fontVariationSettings = fromFontVariationSettings;
        return;
      }

      const falloffValue = calculateFalloff(distance);
      const newSettings = parsedSettings
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
          return `'${axis}' ${interpolatedValue}`;
        })
        .join(', ');

      interpolatedSettingsRef.current[index] = newSettings;
      letterRef.style.fontVariationSettings = newSettings;
    });
  }, [containerRef, mousePositionRef, radius, fromFontVariationSettings, parsedSettings, calculateFalloff]);

  // Performance: only run animation loop when visible
  useAnimationFrame(animationCallback, shouldAnimate);

  const words = label.split(' ');
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      onClick={onClick}
      style={{
        display: 'inline',
        fontFamily: '"Roboto Flex", sans-serif',
        ...style
      }}
      className={className}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split('').map(letter => {
            const currentLetterIndex = letterIndex++;
            return (
              <motion.span
                key={currentLetterIndex}
                ref={el => {
                  letterRefs.current[currentLetterIndex] = el;
                }}
                style={{
                  display: 'inline-block',
                  fontVariationSettings: interpolatedSettingsRef.current[currentLetterIndex] || fromFontVariationSettings
                }}
                aria-hidden="true"
              >
                {letter}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.displayName = 'VariableProximity';
export default VariableProximity;

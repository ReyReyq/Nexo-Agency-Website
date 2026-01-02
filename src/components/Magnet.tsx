import React, { useState, useEffect, useRef, useCallback, ReactNode, HTMLAttributes } from 'react';

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.5s ease-in-out',
  wrapperClassName = '',
  innerClassName = '',
  ...props
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const magnetRef = useRef<HTMLDivElement>(null);
  // Cache bounds to avoid calling getBoundingClientRect on every mousemove
  const boundsRef = useRef<DOMRect | null>(null);
  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef<boolean>(true);
  // Store props in refs to avoid recreating callbacks when props change
  const paddingRef = useRef(padding);
  const magnetStrengthRef = useRef(magnetStrength);
  // Track throttle state
  const lastRunRef = useRef<number>(0);
  const throttleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep refs in sync with props
  useEffect(() => {
    paddingRef.current = padding;
    magnetStrengthRef.current = magnetStrength;
  }, [padding, magnetStrength]);

  // Update cached bounds on resize
  const updateBounds = useCallback(() => {
    if (magnetRef.current && isMountedRef.current) {
      boundsRef.current = magnetRef.current.getBoundingClientRect();
    }
  }, []);

  // Handle mouse movement with cached bounds - stable reference using refs
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!magnetRef.current || !boundsRef.current || !isMountedRef.current) return;

    const { left, top, width, height } = boundsRef.current;
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distX = Math.abs(centerX - e.clientX);
    const distY = Math.abs(centerY - e.clientY);

    const currentPadding = paddingRef.current;
    const currentMagnetStrength = magnetStrengthRef.current;

    if (distX < width / 2 + currentPadding && distY < height / 2 + currentPadding) {
      setIsActive(true);
      const offsetX = (e.clientX - centerX) / currentMagnetStrength;
      const offsetY = (e.clientY - centerY) / currentMagnetStrength;
      setPosition({ x: offsetX, y: offsetY });
    } else {
      setIsActive(false);
      setPosition({ x: 0, y: 0 });
    }
  }, []);

  // Inline throttled handler to ensure proper cleanup
  const throttledMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    const delay = 16; // ~60fps

    if (now - lastRunRef.current >= delay) {
      lastRunRef.current = now;
      handleMouseMove(e);
    } else if (!throttleTimeoutRef.current) {
      const remainingTime = delay - (now - lastRunRef.current);
      throttleTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          lastRunRef.current = Date.now();
          handleMouseMove(e);
        }
        throttleTimeoutRef.current = null;
      }, remainingTime);
    }
  }, [handleMouseMove]);

  // Set mounted ref on mount/unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (disabled) {
      setPosition({ x: 0, y: 0 });
      setIsActive(false);
      return;
    }

    // Initial bounds calculation
    updateBounds();

    // Update bounds on resize and scroll (scroll can change element position)
    window.addEventListener('resize', updateBounds, { passive: true });
    window.addEventListener('scroll', updateBounds, { passive: true });
    window.addEventListener('mousemove', throttledMouseMove, { passive: true });

    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds);
      window.removeEventListener('mousemove', throttledMouseMove);

      // Clear any pending throttle timeout
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
        throttleTimeoutRef.current = null;
      }
    };
  }, [disabled, updateBounds, throttledMouseMove]);

  const transitionStyle = isActive ? activeTransition : inactiveTransition;

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: 'relative', display: 'inline-block' }}
      {...props}
    >
      <div
        className={innerClassName}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: transitionStyle,
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Magnet;

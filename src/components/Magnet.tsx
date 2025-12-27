import React, { useState, useEffect, useRef, useCallback, ReactNode, HTMLAttributes } from 'react';
import { useThrottleCallback } from '../hooks/useThrottleCallback';

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

  // Update cached bounds on resize
  const updateBounds = useCallback(() => {
    if (magnetRef.current) {
      boundsRef.current = magnetRef.current.getBoundingClientRect();
    }
  }, []);

  // Handle mouse movement with cached bounds
  const handleMouseMoveCallback = useCallback((e: MouseEvent) => {
    if (!magnetRef.current || !boundsRef.current) return;

    const { left, top, width, height } = boundsRef.current;
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distX = Math.abs(centerX - e.clientX);
    const distY = Math.abs(centerY - e.clientY);

    if (distX < width / 2 + padding && distY < height / 2 + padding) {
      setIsActive(true);
      const offsetX = (e.clientX - centerX) / magnetStrength;
      const offsetY = (e.clientY - centerY) / magnetStrength;
      setPosition({ x: offsetX, y: offsetY });
    } else {
      setIsActive(false);
      setPosition({ x: 0, y: 0 });
    }
  }, [padding, magnetStrength]);

  // Throttle mousemove to ~60fps
  const throttledMouseMove = useThrottleCallback(handleMouseMoveCallback, 16);

  useEffect(() => {
    if (disabled) {
      setPosition({ x: 0, y: 0 });
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

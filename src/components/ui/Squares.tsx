import React, { useRef, useEffect, useCallback } from 'react';
import { useVisibilityPause } from '@/hooks/useVisibilityPause';

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern;

interface GridOffset {
  x: number;
  y: number;
}

interface SquaresProps {
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
  speed?: number;
  borderColor?: CanvasStrokeStyle;
  squareSize?: number;
  hoverFillColor?: CanvasStrokeStyle;
}

const Squares: React.FC<SquaresProps> = ({
  direction = 'right',
  speed = 1,
  borderColor = '#999',
  squareSize = 40,
  hoverFillColor = '#222'
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const numSquaresX = useRef<number>(0);
  const numSquaresY = useRef<number>(0);
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
  const hoveredSquareRef = useRef<GridOffset | null>(null);
  const gradientRef = useRef<CanvasGradient | null>(null);
  const lastFrameTimeRef = useRef(0);
  const canvasSizeRef = useRef({ width: 0, height: 0 });
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isUnmountedRef = useRef(false);

  // Visibility-based pause
  const isVisible = useVisibilityPause(wrapperRef);
  // Use ref for visibility to avoid effect re-runs
  const isVisibleRef = useRef(isVisible);
  isVisibleRef.current = isVisible;

  // Create cached gradient when canvas size changes
  const updateGradient = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const gradient = ctx.createRadialGradient(
      w / 2,
      h / 2,
      0,
      w / 2,
      h / 2,
      Math.sqrt(w ** 2 + h ** 2) / 2
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, '#060010');
    gradientRef.current = gradient;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Store context ref for cleanup
    ctxRef.current = ctx;
    isUnmountedRef.current = false;

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const resizeCanvas = () => {
      // Guard against calls after unmount
      if (isUnmountedRef.current) return;

      // Debounce resize
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (isUnmountedRef.current) return;

        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        if (w === canvasSizeRef.current.width && h === canvasSizeRef.current.height) return;

        canvas.width = w;
        canvas.height = h;
        canvasSizeRef.current = { width: w, height: h };
        numSquaresX.current = Math.ceil(w / squareSize) + 1;
        numSquaresY.current = Math.ceil(h / squareSize) + 1;
        updateGradient(ctx, w, h);
      }, 100);
    };

    // Use ResizeObserver instead of window resize
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    resizeCanvas();
    // Force immediate first resize
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvasSizeRef.current = { width: canvas.width, height: canvas.height };
    numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
    numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
    updateGradient(ctx, canvas.width, canvas.height);

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);

          if (
            hoveredSquareRef.current &&
            Math.floor((x - startX) / squareSize) === hoveredSquareRef.current.x &&
            Math.floor((y - startY) / squareSize) === hoveredSquareRef.current.y
          ) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          ctx.strokeStyle = borderColor;
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }

      // Use cached gradient
      if (gradientRef.current) {
        ctx.fillStyle = gradientRef.current;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    const updateAnimation = (t: number) => {
      // Guard against calls after unmount
      if (isUnmountedRef.current) return;

      // Skip when not visible but still schedule next frame
      if (!isVisibleRef.current) {
        requestRef.current = requestAnimationFrame(updateAnimation);
        return;
      }

      // Throttle to ~30fps
      if (t - lastFrameTimeRef.current < 33) {
        requestRef.current = requestAnimationFrame(updateAnimation);
        return;
      }
      lastFrameTimeRef.current = t;

      const effectiveSpeed = Math.max(speed, 0.1);
      switch (direction) {
        case 'right':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          break;
        case 'left':
          gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
          break;
        case 'up':
          gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
          break;
        case 'down':
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        case 'diagonal':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        default:
          break;
      }

      drawGrid();

      // Schedule next frame after drawing
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      const hoveredSquareX = Math.floor((mouseX + gridOffset.current.x - startX) / squareSize);
      const hoveredSquareY = Math.floor((mouseY + gridOffset.current.y - startY) / squareSize);

      if (
        !hoveredSquareRef.current ||
        hoveredSquareRef.current.x !== hoveredSquareX ||
        hoveredSquareRef.current.y !== hoveredSquareY
      ) {
        hoveredSquareRef.current = { x: hoveredSquareX, y: hoveredSquareY };
      }
    };

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      // Mark as unmounted to prevent any callbacks from running
      isUnmountedRef.current = true;

      // Clear debounce timeout
      if (resizeTimeout) clearTimeout(resizeTimeout);

      // Disconnect resize observer
      resizeObserver.disconnect();

      // Cancel animation frame
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }

      // Remove event listeners
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);

      // Clear cached gradient to release memory
      gradientRef.current = null;

      // Clear canvas context reference
      ctxRef.current = null;

      // Release canvas GPU memory by resizing to 0
      canvas.width = 0;
      canvas.height = 0;
      canvasSizeRef.current = { width: 0, height: 0 };

      // Clear hovered state
      hoveredSquareRef.current = null;
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize, updateGradient]);

  return (
    <div ref={wrapperRef} className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full border-none block" />
    </div>
  );
};

export default Squares;

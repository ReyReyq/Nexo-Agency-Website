"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import createGlobe, { COBEOptions } from "cobe";

import { cn } from "@/lib/utils";

// Default config with Israel as a prominent marker
const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [0.3, 0.3, 0.3],
  markerColor: [1, 0.08, 0.58], // Pink/magenta to match brand
  glowColor: [0.3, 0.3, 0.3],
  markers: [
    // Tel Aviv, Israel (Nexo HQ)
    { location: [32.0853, 34.7818], size: 0.15 },
    // Major tech hubs worldwide
    { location: [40.7128, -74.006], size: 0.08 }, // New York
    { location: [51.5074, -0.1278], size: 0.08 }, // London
    { location: [48.8566, 2.3522], size: 0.06 }, // Paris
    { location: [52.52, 13.405], size: 0.06 }, // Berlin
    { location: [35.6762, 139.6503], size: 0.07 }, // Tokyo
    { location: [37.7749, -122.4194], size: 0.08 }, // San Francisco
    { location: [1.3521, 103.8198], size: 0.06 }, // Singapore
    { location: [55.7558, 37.6173], size: 0.05 }, // Moscow
    { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
  ],
};

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const phiRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  // Use ResizeObserver to get reliable dimensions
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0) {
          setIsReady(true);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Initialize globe once container is ready
  useEffect(() => {
    if (!isReady || !canvasRef.current || !containerRef.current) return;

    let animationFrameId: number;
    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Get dimensions using getBoundingClientRect for accuracy
    const rect = container.getBoundingClientRect();
    const width = rect.width;

    if (width === 0) return;

    // Create the globe
    try {
      const globe = createGlobe(canvas, {
        ...config,
        width: width * 2,
        height: width * 2,
        onRender: (state) => {
          // Smooth rotation
          if (!pointerInteracting.current) {
            phiRef.current += 0.005;
          }
          state.phi = phiRef.current + pointerInteractionMovement.current;
          state.width = width * 2;
          state.height = width * 2;
        },
      });

      globeRef.current = globe;

      // Fade in the canvas
      requestAnimationFrame(() => {
        if (canvas) {
          canvas.style.opacity = "1";
        }
      });

      return () => {
        globe.destroy();
        globeRef.current = null;
      };
    } catch (error) {
      console.warn("Globe WebGL initialization failed:", error);
      return;
    }
  }, [isReady, config]);

  // Pointer event handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grabbing";
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    pointerInteracting.current = null;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grab";
    }
  }, []);

  const handlePointerOut = useCallback(() => {
    pointerInteracting.current = null;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grab";
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (pointerInteracting.current !== null) {
      const delta = e.clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta / 100;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches[0] && pointerInteracting.current !== null) {
      const delta = e.touches[0].clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta / 100;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative mx-auto aspect-[1/1] w-full h-full",
        className
      )}
    >
      <canvas
        className="w-full h-full opacity-0 transition-opacity duration-500 cursor-grab"
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerOut}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      />
    </div>
  );
}

export default Globe;

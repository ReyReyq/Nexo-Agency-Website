/* eslint-disable react/no-unknown-property */
import React, { useMemo, useEffect, useRef, createContext, useContext } from 'react';
import { Canvas, useThree, CanvasProps, ThreeEvent } from '@react-three/fiber';
import { shaderMaterial, useTrailTexture } from '@react-three/drei';
import {
  Vector2,
  Color,
  Texture,
  NearestFilter,
  ClampToEdgeWrapping
} from 'three';
import { useVisibilityPause } from '@/hooks/useVisibilityPause';

// Context to pass visibility state to Scene component
const VisibilityContext = createContext(true);

interface GooeyFilterProps {
  id?: string;
  strength?: number;
}

interface SceneProps {
  gridSize: number;
  trailSize: number;
  maxAge: number;
  interpolate: number;
  easingFunction: (x: number) => number;
  pixelColor: string;
  externalMouseRef?: React.RefObject<{ x: number; y: number } | null>;
}

interface PixelTrailProps {
  gridSize?: number;
  trailSize?: number;
  maxAge?: number;
  interpolate?: number;
  easingFunction?: (x: number) => number;
  canvasProps?: Partial<CanvasProps>;
  glProps?: WebGLContextAttributes & { powerPreference?: string };
  gooeyFilter?: { id: string; strength: number };
  color?: string;
  className?: string;
  /** Reference to the container element to track mouse within */
  containerRef?: React.RefObject<HTMLElement | null>;
}

const GooeyFilter: React.FC<GooeyFilterProps> = ({ id = 'goo-filter', strength = 10 }) => {
  return (
    <svg className="absolute overflow-hidden z-1 w-0 h-0">
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={strength} result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
};

const DotMaterial = shaderMaterial(
  {
    resolution: new Vector2(),
    mouseTrail: null,
    gridSize: 100,
    pixelColor: new Color('#ffffff')
  },
  /* glsl vertex shader */ `
    varying vec2 vUv;
    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  /* glsl fragment shader */ `
    uniform vec2 resolution;
    uniform sampler2D mouseTrail;
    uniform float gridSize;
    uniform vec3 pixelColor;

    vec2 coverUv(vec2 uv) {
      vec2 s = resolution.xy / max(resolution.x, resolution.y);
      vec2 newUv = (uv - 0.5) * s + 0.5;
      return clamp(newUv, 0.0, 1.0);
    }

    float sdfCircle(vec2 p, float r) {
        return length(p - 0.5) - r;
    }

    void main() {
      vec2 screenUv = gl_FragCoord.xy / resolution;
      vec2 uv = coverUv(screenUv);

      vec2 gridUv = fract(uv * gridSize);
      vec2 gridUvCenter = (floor(uv * gridSize) + 0.5) / gridSize;

      float trail = texture2D(mouseTrail, gridUvCenter).r;

      gl_FragColor = vec4(pixelColor, trail);
    }
  `
);

function Scene({ gridSize, trailSize, maxAge, interpolate, easingFunction, pixelColor, externalMouseRef }: SceneProps) {
  const size = useThree(s => s.size);
  const viewport = useThree(s => s.viewport);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const isVisible = useContext(VisibilityContext);
  // Ref to track visibility in animation frame without stale closure
  const isVisibleRef = useRef(isVisible);
  isVisibleRef.current = isVisible;

  const dotMaterial = useMemo(() => new DotMaterial(), []);

  // Cleanup: dispose material on unmount to prevent WebGL memory leak
  useEffect(() => {
    return () => {
      dotMaterial.dispose();
    };
  }, [dotMaterial]);

  // Reuse color object to avoid creating new Color on every render
  const colorRef = useRef(new Color(pixelColor));
  if (colorRef.current.getHexString() !== new Color(pixelColor).getHexString()) {
    colorRef.current.set(pixelColor);
  }

  // Update ALL uniforms directly - primitive props don't work for shader uniforms
  dotMaterial.uniforms.pixelColor.value = colorRef.current;
  dotMaterial.uniforms.gridSize.value = gridSize;
  dotMaterial.uniforms.resolution.value.set(size.width * viewport.dpr, size.height * viewport.dpr);

  // Performance: reduce trail texture size from 512 to 256
  const [trail, onMove] = useTrailTexture({
    size: 256,
    radius: trailSize,
    maxAge: maxAge,
    interpolate: interpolate || 0.1,
    ease: easingFunction || ((x: number) => x)
  }) as [Texture | null, (e: ThreeEvent<PointerEvent>) => void];

  // Track trail texture for cleanup
  const trailRef = useRef<Texture | null>(null);
  trailRef.current = trail;

  // Cleanup: dispose trail texture on unmount
  useEffect(() => {
    return () => {
      if (trailRef.current) {
        trailRef.current.dispose();
      }
    };
  }, []);

  // Update trail texture and its settings
  if (trail) {
    trail.minFilter = NearestFilter;
    trail.magFilter = NearestFilter;
    trail.wrapS = ClampToEdgeWrapping;
    trail.wrapT = ClampToEdgeWrapping;
    dotMaterial.uniforms.mouseTrail.value = trail;
  }

  const scale = Math.max(viewport.width, viewport.height) / 2;

  // Handle external mouse position updates (for when canvas has pointer-events: none)
  // Performance: only process when visible
  useEffect(() => {
    if (!externalMouseRef) return;

    let animationFrameId: number;
    let isRunning = true;

    const updateFromExternalMouse = () => {
      if (!isRunning) return;

      // Performance: skip updates when not visible (use ref to avoid stale closure)
      if (!isVisibleRef.current) {
        animationFrameId = requestAnimationFrame(updateFromExternalMouse);
        return;
      }

      if (externalMouseRef.current) {
        const { x, y } = externalMouseRef.current;

        // Only trigger if position changed
        if (!lastMousePos.current || lastMousePos.current.x !== x || lastMousePos.current.y !== y) {
          lastMousePos.current = { x, y };

          // Create a synthetic event-like object that useTrailTexture expects
          // The onMove function from useTrailTexture expects UV coordinates (0-1 range)
          const syntheticEvent = {
            uv: new Vector2(x, y)
          } as ThreeEvent<PointerEvent>;

          onMove(syntheticEvent);
        }
      }

      animationFrameId = requestAnimationFrame(updateFromExternalMouse);
    };

    animationFrameId = requestAnimationFrame(updateFromExternalMouse);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [externalMouseRef, onMove]);

  return (
    <mesh scale={[scale, scale, 1]} onPointerMove={externalMouseRef ? undefined : onMove}>
      <planeGeometry args={[2, 2]} />
      <primitive object={dotMaterial} attach="material" />
    </mesh>
  );
}

export default function PixelTrail({
  gridSize = 40,
  trailSize = 0.1,
  maxAge = 250,
  interpolate = 5,
  easingFunction = (x: number) => x,
  canvasProps = {},
  glProps = {
    antialias: false,
    powerPreference: 'high-performance',
    alpha: true
  },
  gooeyFilter,
  color = '#ffffff',
  className = '',
  containerRef
}: PixelTrailProps) {
  // Ref to store normalized mouse position (0-1 UV coordinates)
  const mousePositionRef = useRef<{ x: number; y: number } | null>(null);
  const pixelTrailRef = useRef<HTMLDivElement>(null);
  // Cache container rect to avoid getBoundingClientRect on every mousemove
  const containerRectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);

  // Performance: visibility-based pausing
  const isVisible = useVisibilityPause(pixelTrailRef);

  // Track mouse position relative to container (or this component if no containerRef)
  // Performance: only track when visible, cache rect to avoid layout thrashing
  useEffect(() => {
    if (!isVisible) return;

    const targetElement = containerRef?.current || pixelTrailRef.current?.parentElement;
    if (!targetElement) return;

    // Update cached rect
    const updateRect = () => {
      const rect = targetElement.getBoundingClientRect();
      containerRectRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      };
    };

    // Initial measurement
    updateRect();

    // Set up ResizeObserver for rect updates
    const resizeObserver = new ResizeObserver(updateRect);
    resizeObserver.observe(targetElement);

    // Update on scroll (position may change)
    window.addEventListener('scroll', updateRect, { passive: true });
    window.addEventListener('resize', updateRect, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      // Use cached rect instead of calling getBoundingClientRect every time
      const rect = containerRectRef.current;
      if (!rect) return;

      // Calculate UV coordinates (0-1 range, with Y inverted for WebGL)
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height; // Invert Y for WebGL coordinate system

      // Clamp to valid range
      mousePositionRef.current = {
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y))
      };
    };

    targetElement.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('resize', updateRect);
      targetElement.removeEventListener('mousemove', handleMouseMove);
      // Clear cached rect and mouse position on cleanup
      containerRectRef.current = null;
    };
  }, [containerRef, isVisible]);

  // Determine if we should use external mouse tracking
  const useExternalTracking = containerRef !== undefined;

  return (
    <div
      ref={pixelTrailRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        ...(gooeyFilter ? { filter: `url(#${gooeyFilter.id})` } : {}),
        // When using external tracking, disable pointer events on the container
        pointerEvents: useExternalTracking ? 'none' : 'auto'
      }}
    >
      {gooeyFilter && <GooeyFilter id={gooeyFilter.id} strength={gooeyFilter.strength} />}
      <Canvas
        {...canvasProps}
        gl={glProps}
        // Performance: pause rendering when off-screen
        frameloop={isVisible ? 'always' : 'demand'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: useExternalTracking ? 'none' : 'auto'
        }}
      >
        <VisibilityContext.Provider value={isVisible}>
          <Scene
            gridSize={gridSize}
            trailSize={trailSize}
            maxAge={maxAge}
            interpolate={interpolate}
            easingFunction={easingFunction}
            pixelColor={color}
            externalMouseRef={useExternalTracking ? mousePositionRef : undefined}
          />
        </VisibilityContext.Provider>
      </Canvas>
    </div>
  );
}

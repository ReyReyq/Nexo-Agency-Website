/* eslint-disable react/no-unknown-property */
import React, { useMemo, useEffect, useRef } from 'react';
import { Canvas, useThree, CanvasProps, ThreeEvent } from '@react-three/fiber';
import { shaderMaterial, useTrailTexture } from '@react-three/drei';
import * as THREE from 'three';

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
    resolution: new THREE.Vector2(),
    mouseTrail: null,
    gridSize: 100,
    pixelColor: new THREE.Color('#ffffff')
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

  const dotMaterial = useMemo(() => new DotMaterial(), []);

  // Update ALL uniforms directly - primitive props don't work for shader uniforms
  dotMaterial.uniforms.pixelColor.value = new THREE.Color(pixelColor);
  dotMaterial.uniforms.gridSize.value = gridSize;
  dotMaterial.uniforms.resolution.value.set(size.width * viewport.dpr, size.height * viewport.dpr);

  const [trail, onMove] = useTrailTexture({
    size: 512,
    radius: trailSize,
    maxAge: maxAge,
    interpolate: interpolate || 0.1,
    ease: easingFunction || ((x: number) => x)
  }) as [THREE.Texture | null, (e: ThreeEvent<PointerEvent>) => void];

  // Update trail texture and its settings
  if (trail) {
    trail.minFilter = THREE.NearestFilter;
    trail.magFilter = THREE.NearestFilter;
    trail.wrapS = THREE.ClampToEdgeWrapping;
    trail.wrapT = THREE.ClampToEdgeWrapping;
    dotMaterial.uniforms.mouseTrail.value = trail;
  }

  const scale = Math.max(viewport.width, viewport.height) / 2;

  // Handle external mouse position updates (for when canvas has pointer-events: none)
  useEffect(() => {
    if (!externalMouseRef) return;

    let animationFrameId: number;

    const updateFromExternalMouse = () => {
      if (externalMouseRef.current) {
        const { x, y } = externalMouseRef.current;

        // Only trigger if position changed
        if (!lastMousePos.current || lastMousePos.current.x !== x || lastMousePos.current.y !== y) {
          lastMousePos.current = { x, y };

          // Create a synthetic event-like object that useTrailTexture expects
          // The onMove function from useTrailTexture expects UV coordinates (0-1 range)
          const syntheticEvent = {
            uv: new THREE.Vector2(x, y)
          } as ThreeEvent<PointerEvent>;

          onMove(syntheticEvent);
        }
      }

      animationFrameId = requestAnimationFrame(updateFromExternalMouse);
    };

    animationFrameId = requestAnimationFrame(updateFromExternalMouse);

    return () => {
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

  // Track mouse position relative to container (or this component if no containerRef)
  useEffect(() => {
    const targetElement = containerRef?.current || pixelTrailRef.current?.parentElement;
    if (!targetElement) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = targetElement.getBoundingClientRect();

      // Calculate UV coordinates (0-1 range, with Y inverted for WebGL)
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height; // Invert Y for WebGL coordinate system

      // Clamp to valid range
      mousePositionRef.current = {
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y))
      };
    };

    targetElement.addEventListener('mousemove', handleMouseMove);

    return () => {
      targetElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, [containerRef]);

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
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: useExternalTracking ? 'none' : 'auto'
        }}
      >
        <Scene
          gridSize={gridSize}
          trailSize={trailSize}
          maxAge={maxAge}
          interpolate={interpolate}
          easingFunction={easingFunction}
          pixelColor={color}
          externalMouseRef={useExternalTracking ? mousePositionRef : undefined}
        />
      </Canvas>
    </div>
  );
}

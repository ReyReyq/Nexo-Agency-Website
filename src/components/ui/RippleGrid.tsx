import { useRef, useEffect } from 'react';
import { Renderer, Program, Triangle, Mesh } from 'ogl';
import { useVisibilityPause } from '@/hooks/useVisibilityPause';

type Props = {
  enableRainbow?: boolean;
  gridColor?: string;
  rippleIntensity?: number;
  gridSize?: number;
  gridThickness?: number;
  fadeDistance?: number;
  vignetteStrength?: number;
  glowIntensity?: number;
  opacity?: number;
  gridRotation?: number;
  mouseInteraction?: boolean;
  mouseInteractionRadius?: number;
};

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255]
    : [1, 1, 1];
};

const vert = `
attribute vec2 position;
varying vec2 vUv;
void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}`;

const frag = `precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform bool enableRainbow;
uniform vec3 gridColor;
uniform float rippleIntensity;
uniform float gridSize;
uniform float gridThickness;
uniform float fadeDistance;
uniform float vignetteStrength;
uniform float glowIntensity;
uniform float opacity;
uniform float gridRotation;
uniform bool mouseInteraction;
uniform vec2 mousePosition;
uniform float mouseInfluence;
uniform float mouseInteractionRadius;
varying vec2 vUv;

float pi = 3.141592;

mat2 rotate(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;

    if (gridRotation != 0.0) {
        uv = rotate(gridRotation * pi / 180.0) * uv;
    }

    float dist = length(uv);
    float func = sin(pi * (iTime - dist));
    vec2 rippleUv = uv + uv * func * rippleIntensity;

    if (mouseInteraction && mouseInfluence > 0.0) {
        vec2 mouseUv = (mousePosition * 2.0 - 1.0);
        mouseUv.x *= iResolution.x / iResolution.y;
        float mouseDist = length(uv - mouseUv);

        float influence = mouseInfluence * (1.0 - smoothstep(0.0, mouseInteractionRadius, mouseDist));

        float mouseWave = sin(pi * (iTime * 2.0 - mouseDist * 3.0)) * influence;
        rippleUv += normalize(uv - mouseUv + 0.001) * mouseWave * rippleIntensity * 0.3;
    }

    vec2 a = sin(gridSize * 0.5 * pi * rippleUv - pi / 2.0);
    vec2 b = abs(a);

    float aaWidth = 0.5;
    vec2 smoothB = vec2(
        smoothstep(0.0, aaWidth, b.x),
        smoothstep(0.0, aaWidth, b.y)
    );

    vec3 color = vec3(0.0);
    float thickX = gridThickness * smoothB.x;
    float thickY = gridThickness * smoothB.y;
    color += 1.0 / (1.0 + thickX * (0.8 + 0.5 * sin(pi * iTime)));
    color += 1.0 / (1.0 + thickY);
    color += 0.5 / (1.0 + (gridThickness / 4.0) * sin(smoothB.x));
    color += 0.5 / (1.0 + (gridThickness / 3.0) * smoothB.y);

    if (glowIntensity > 0.0) {
        color += glowIntensity / (1.0 + gridThickness * 0.5 * smoothB.x);
        color += glowIntensity / (1.0 + gridThickness * 0.5 * smoothB.y);
    }

    float ddd = 1.0 / (1.0 + 2.0 * clamp(pow(dist, fadeDistance), 0.0, 1.0));

    vec2 vignetteCoords = vUv - 0.5;
    float vignetteDistance = length(vignetteCoords);
    float vignette = 1.0 - pow(vignetteDistance * 2.0, vignetteStrength);
    vignette = clamp(vignette, 0.0, 1.0);

    vec3 t;
    if (enableRainbow) {
        t = vec3(
            uv.x * 0.5 + 0.5 * sin(iTime),
            uv.y * 0.5 + 0.5 * cos(iTime),
            pow(cos(iTime), 4.0)
        ) + 0.5;
    } else {
        t = gridColor;
    }

    float finalFade = ddd * vignette;
    float alpha = length(color) * finalFade * opacity;
    gl_FragColor = vec4(color * t * finalFade * opacity, alpha);
}`;

const RippleGrid: React.FC<Props> = ({
  enableRainbow = false,
  gridColor = '#ffffff',
  rippleIntensity = 0.05,
  gridSize = 10.0,
  gridThickness = 15.0,
  fadeDistance = 1.5,
  vignetteStrength = 2.0,
  glowIntensity = 0.1,
  opacity = 1.0,
  gridRotation = 0,
  mouseInteraction = true,
  mouseInteractionRadius = 1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePositionRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const mouseInfluenceRef = useRef(0);
  const uniformsRef = useRef<any>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const rafRef = useRef<number>(0);
  const lastFrameTimeRef = useRef(0);

  // Visibility-based pause
  const isVisible = useVisibilityPause(containerRef);

  // WebGL setup - only runs once
  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 1.5), // Cap DPR at 1.5 for performance
      alpha: true
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    containerRef.current.appendChild(gl.canvas);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: [1, 1] },
      enableRainbow: { value: enableRainbow },
      gridColor: { value: hexToRgb(gridColor) },
      rippleIntensity: { value: rippleIntensity },
      gridSize: { value: gridSize },
      gridThickness: { value: gridThickness },
      fadeDistance: { value: fadeDistance },
      vignetteStrength: { value: vignetteStrength },
      glowIntensity: { value: glowIntensity },
      opacity: { value: opacity },
      gridRotation: { value: gridRotation },
      mouseInteraction: { value: mouseInteraction },
      mousePosition: { value: [0.5, 0.5] },
      mouseInfluence: { value: 0 },
      mouseInteractionRadius: { value: mouseInteractionRadius }
    };

    uniformsRef.current = uniforms;

    const geometry = new Triangle(gl);
    const program = new Program(gl, { vertex: vert, fragment: frag, uniforms });
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    const resize = () => {
      if (!containerRef.current) return;
      const { clientWidth: w, clientHeight: h } = containerRef.current;
      renderer.setSize(w, h);
      uniforms.iResolution.value = [w, h];
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouseRef.current = { x, y };
    };

    const handleMouseEnter = () => {
      mouseInfluenceRef.current = 1.0;
    };

    const handleMouseLeave = () => {
      mouseInfluenceRef.current = 0.0;
    };

    // Use ResizeObserver instead of window resize
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(containerRef.current);
    resize();

    const currentContainer = containerRef.current;
    currentContainer.addEventListener('mousemove', handleMouseMove);
    currentContainer.addEventListener('mouseenter', handleMouseEnter);
    currentContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      currentContainer.removeEventListener('mousemove', handleMouseMove);
      currentContainer.removeEventListener('mouseenter', handleMouseEnter);
      currentContainer.removeEventListener('mouseleave', handleMouseLeave);
      renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();
      if (gl.canvas.parentNode === currentContainer) {
        currentContainer.removeChild(gl.canvas);
      }
      rendererRef.current = null;
      meshRef.current = null;
      uniformsRef.current = null;
    };
  }, []); // Only run on mount

  // Update uniforms when props change (no re-init)
  useEffect(() => {
    const uniforms = uniformsRef.current;
    if (!uniforms) return;

    uniforms.enableRainbow.value = enableRainbow;
    uniforms.gridColor.value = hexToRgb(gridColor);
    uniforms.rippleIntensity.value = rippleIntensity;
    uniforms.gridSize.value = gridSize;
    uniforms.gridThickness.value = gridThickness;
    uniforms.fadeDistance.value = fadeDistance;
    uniforms.vignetteStrength.value = vignetteStrength;
    uniforms.glowIntensity.value = glowIntensity;
    uniforms.opacity.value = opacity;
    uniforms.gridRotation.value = gridRotation;
    uniforms.mouseInteraction.value = mouseInteraction;
    uniforms.mouseInteractionRadius.value = mouseInteractionRadius;
  }, [enableRainbow, gridColor, rippleIntensity, gridSize, gridThickness, fadeDistance, vignetteStrength, glowIntensity, opacity, gridRotation, mouseInteraction, mouseInteractionRadius]);

  // Animation loop - separate, respects visibility
  useEffect(() => {
    const uniforms = uniformsRef.current;
    const renderer = rendererRef.current;
    const mesh = meshRef.current;
    if (!uniforms || !renderer || !mesh) return;

    const render = (t: number) => {
      rafRef.current = requestAnimationFrame(render);

      // Skip rendering when not visible
      if (!isVisible) return;

      // Throttle to ~30fps for performance
      if (t - lastFrameTimeRef.current < 33) return;
      lastFrameTimeRef.current = t;

      uniforms.iTime.value = t * 0.001;

      const lerpFactor = 0.1;
      mousePositionRef.current.x += (targetMouseRef.current.x - mousePositionRef.current.x) * lerpFactor;
      mousePositionRef.current.y += (targetMouseRef.current.y - mousePositionRef.current.y) * lerpFactor;

      const currentInfluence = uniforms.mouseInfluence.value;
      const targetInfluence = mouseInfluenceRef.current;
      uniforms.mouseInfluence.value += (targetInfluence - currentInfluence) * 0.05;

      uniforms.mousePosition.value = [mousePositionRef.current.x, mousePositionRef.current.y];

      renderer.render({ scene: mesh });
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible]);

  return <div ref={containerRef} className="w-full h-full relative overflow-hidden [&_canvas]:block" />;
};

export default RippleGrid;

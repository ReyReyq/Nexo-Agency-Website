// Component ported and enhanced from https://codepen.io/JuanFuentes/pen/eYEeoyE

import { useRef, useEffect } from 'react';
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Camera,
  CanvasTexture,
  NearestFilter,
  PlaneGeometry,
  ShaderMaterial,
  Mesh
} from 'three';
import { useVisibilityPause } from '@/hooks/useVisibilityPause';

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float mouse;
uniform float uEnableWaves;

void main() {
    vUv = uv;
    float time = uTime;

    float waveFactor = uEnableWaves;

    vec3 transformed = position;

    // Varied time multipliers for more organic, complex wave motion
    transformed.x += sin(time * 0.8 + position.y) * 0.3 * waveFactor;
    transformed.y += cos(time * 0.5 + position.z) * 0.1 * waveFactor;
    transformed.z += sin(time * 1.2 + position.x) * 0.2 * waveFactor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float mouse;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    float time = uTime;
    vec2 pos = vUv;

    // Subtle RGB shift - reduced from .01 to .003
    float r = texture2D(uTexture, pos + cos(time * 2. - time + pos.x) * .003).r;
    float g = texture2D(uTexture, pos + sin(time * .5 + pos.x - time) * .003).g;
    float b = texture2D(uTexture, pos - cos(time * 2. + time + pos.y) * .003).b;
    float a = texture2D(uTexture, pos).a;
    gl_FragColor = vec4(r, g, b, a);
}
`;

function map(n: number, start: number, stop: number, start2: number, stop2: number) {
  return ((n - start) / (stop - start)) * (stop2 - start2) + start2;
}

const PX_RATIO = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

interface AsciiFilterOptions {
  fontSize?: number;
  fontFamily?: string;
  charset?: string;
  invert?: boolean;
}

class AsciiFilter {
  renderer: WebGLRenderer;
  domElement: HTMLDivElement;
  pre: HTMLPreElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  deg: number;
  invert: boolean;
  fontSize: number;
  fontFamily: string;
  charset: string;
  width: number = 0;
  height: number = 0;
  center: { x: number; y: number } = { x: 0, y: 0 };
  mouse: { x: number; y: number } = { x: 0, y: 0 };
  cols: number = 0;
  rows: number = 0;
  // Performance: cache ASCII output
  cachedAscii: string = '';
  lastRenderTime: number = 0;
  // Performance: track disposed state
  isDisposed: boolean = false;
  // Performance: limit max resolution for ASCII conversion
  static readonly MAX_COLS = 80;
  static readonly MAX_ROWS = 40;
  // Performance: throttle render frequency
  static readonly MIN_RENDER_INTERVAL = 33; // ~30fps max for ASCII

  constructor(renderer: WebGLRenderer, { fontSize, fontFamily, charset, invert }: AsciiFilterOptions = {}) {
    this.renderer = renderer;
    this.domElement = document.createElement('div');
    this.domElement.style.position = 'absolute';
    this.domElement.style.top = '0';
    this.domElement.style.left = '0';
    this.domElement.style.width = '100%';
    this.domElement.style.height = '100%';

    this.pre = document.createElement('pre');
    this.domElement.appendChild(this.pre);

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.domElement.appendChild(this.canvas);

    this.deg = 0;
    this.invert = invert ?? true;
    this.fontSize = fontSize ?? 12;
    this.fontFamily = fontFamily ?? "'Courier New', monospace";
    this.charset = charset ?? ' .\'`^",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@';

    if (this.context) {
      this.context.imageSmoothingEnabled = false;
    }

    this.onMouseMove = this.onMouseMove.bind(this);
    document.addEventListener('mousemove', this.onMouseMove, { passive: true });
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
    this.reset();

    this.center = { x: width / 2, y: height / 2 };
    this.mouse = { x: this.center.x, y: this.center.y };
  }

  reset() {
    if (this.context) {
      this.context.font = `${this.fontSize}px ${this.fontFamily}`;
      const charWidth = this.context.measureText('A').width;

      // Calculate cols/rows with performance cap
      let cols = Math.floor(this.width / (this.fontSize * (charWidth / this.fontSize)));
      let rows = Math.floor(this.height / this.fontSize);

      // Performance: cap resolution to reduce pixel evaluations
      this.cols = Math.min(cols, AsciiFilter.MAX_COLS);
      this.rows = Math.min(rows, AsciiFilter.MAX_ROWS);

      this.canvas.width = this.cols;
      this.canvas.height = this.rows;
      this.pre.style.fontFamily = this.fontFamily;
      this.pre.style.fontSize = `${this.fontSize}px`;
      this.pre.style.margin = '0';
      this.pre.style.padding = '0';
      this.pre.style.lineHeight = '1em';
      this.pre.style.position = 'absolute';
      this.pre.style.left = '50%';
      this.pre.style.top = '50%';
      this.pre.style.transform = 'translate(-50%, -50%)';
      this.pre.style.zIndex = '9';
      this.pre.style.backgroundAttachment = 'fixed';
      this.pre.style.mixBlendMode = 'difference';

      // Clear cache when size changes
      this.cachedAscii = '';
    }
  }

  render(scene: Scene, camera: Camera) {
    this.renderer.render(scene, camera);

    const w = this.canvas.width;
    const h = this.canvas.height;
    if (this.context) {
      this.context.clearRect(0, 0, w, h);
      if (this.context && w && h) {
        this.context.drawImage(this.renderer.domElement, 0, 0, w, h);
      }

      this.asciify(this.context, w, h);
      this.hue();
    }
  }

  onMouseMove(e: MouseEvent) {
    if (this.isDisposed) return;
    this.mouse = { x: e.clientX * PX_RATIO, y: e.clientY * PX_RATIO };
  }

  get dx() {
    return this.mouse.x - this.center.x;
  }

  get dy() {
    return this.mouse.y - this.center.y;
  }

  hue() {
    const deg = (Math.atan2(this.dy, this.dx) * 180) / Math.PI;
    this.deg += (deg - this.deg) * 0.075;
    this.domElement.style.filter = `hue-rotate(${this.deg.toFixed(1)}deg)`;
  }

  asciify(ctx: CanvasRenderingContext2D, w: number, h: number) {
    if (w && h) {
      const imgData = ctx.getImageData(0, 0, w, h).data;
      // Performance: pre-allocate array instead of string concatenation (O(n) vs O(n^2))
      const charsetLen = this.charset.length;
      const totalChars = w * h + h; // characters + newlines
      const chars: string[] = new Array(totalChars);
      let charIdx = 0;

      for (let y = 0; y < h; y++) {
        const rowOffset = y * 4 * w;
        for (let x = 0; x < w; x++) {
          const i = x * 4 + rowOffset;
          const a = imgData[i + 3];

          if (a === 0) {
            chars[charIdx++] = ' ';
            continue;
          }

          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          let gray = (0.3 * r + 0.6 * g + 0.1 * b) / 255;
          let idx = Math.floor((1 - gray) * (charsetLen - 1));
          if (this.invert) idx = charsetLen - idx - 1;
          chars[charIdx++] = this.charset[idx];
        }
        chars[charIdx++] = '\n';
      }
      // Performance: use textContent instead of innerHTML (no HTML parsing overhead)
      this.pre.textContent = chars.join('');
    }
  }

  dispose() {
    this.isDisposed = true;
    document.removeEventListener('mousemove', this.onMouseMove);
  }
}

interface CanvasTxtOptions {
  fontSize?: number;
  fontFamily?: string;
  color?: string;
}

class CanvasTxt {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  txt: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  font: string;

  constructor(txt: string, { fontSize = 200, fontFamily = 'Arial', color = '#fdf9f3' }: CanvasTxtOptions = {}) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.txt = txt;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.color = color;

    this.font = `600 ${this.fontSize}px ${this.fontFamily}`;
  }

  resize() {
    if (this.context) {
      this.context.font = this.font;
      const metrics = this.context.measureText(this.txt);

      const textWidth = Math.ceil(metrics.width) + 20;
      const textHeight = Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) + 20;

      this.canvas.width = textWidth;
      this.canvas.height = textHeight;
    }
  }

  render() {
    if (this.context) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.fillStyle = this.color;
      this.context.font = this.font;

      const metrics = this.context.measureText(this.txt);
      const yPos = 10 + metrics.actualBoundingBoxAscent;

      this.context.fillText(this.txt, 10, yPos);
    }
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  get texture() {
    return this.canvas;
  }
}

interface CanvAsciiOptions {
  text: string;
  asciiFontSize: number;
  textFontSize: number;
  textColor: string;
  planeBaseHeight: number;
  enableWaves: boolean;
}

class CanvAscii {
  textString: string;
  asciiFontSize: number;
  textFontSize: number;
  textColor: string;
  planeBaseHeight: number;
  container: HTMLElement;
  width: number;
  height: number;
  enableWaves: boolean;
  camera: PerspectiveCamera;
  scene: Scene;
  mouse: { x: number; y: number };
  textCanvas!: CanvasTxt;
  texture!: CanvasTexture;
  geometry!: PlaneGeometry;
  material!: ShaderMaterial;
  mesh!: Mesh;
  renderer!: WebGLRenderer;
  filter!: AsciiFilter;
  center!: { x: number; y: number };
  animationFrameId: number = 0;
  // Performance: visibility-based pausing
  isPaused: boolean = false;
  // Performance: track disposed state to prevent operations after cleanup
  isDisposed: boolean = false;
  // Performance: cache text canvas when unchanged
  lastTextRendered: string = '';
  // Performance: cache container bounds to avoid getBoundingClientRect on every mousemove
  containerBounds: { left: number; top: number } = { left: 0, top: 0 };
  boundUpdateHandler: (() => void) | null = null;

  constructor(
    { text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves }: CanvAsciiOptions,
    containerElem: HTMLElement,
    width: number,
    height: number
  ) {
    this.textString = text;
    this.asciiFontSize = asciiFontSize;
    this.textFontSize = textFontSize;
    this.textColor = textColor;
    this.planeBaseHeight = planeBaseHeight;
    this.container = containerElem;
    this.width = width;
    this.height = height;
    this.enableWaves = enableWaves;

    this.camera = new PerspectiveCamera(45, this.width / this.height, 1, 1000);
    this.camera.position.z = 14;

    this.scene = new Scene();
    this.mouse = { x: 0, y: 0 };

    this.onMouseMove = this.onMouseMove.bind(this);

    this.setMesh();
    this.setRenderer();
  }

  setMesh() {
    this.textCanvas = new CanvasTxt(this.textString, {
      fontSize: this.textFontSize,
      fontFamily: 'IBM Plex Mono',
      color: this.textColor
    });
    this.textCanvas.resize();
    this.textCanvas.render();

    this.texture = new CanvasTexture(this.textCanvas.texture);
    this.texture.minFilter = NearestFilter;

    const textAspect = this.textCanvas.width / this.textCanvas.height;
    const baseH = this.planeBaseHeight;
    const planeW = baseH * textAspect;
    const planeH = baseH;

    this.geometry = new PlaneGeometry(planeW, planeH, 36, 36);
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        mouse: { value: 1.0 },
        uTexture: { value: this.texture },
        uEnableWaves: { value: this.enableWaves ? 0.4 : 0.0 }
      }
    });

    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  setRenderer() {
    this.renderer = new WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);

    this.filter = new AsciiFilter(this.renderer, {
      fontFamily: 'IBM Plex Mono',
      fontSize: this.asciiFontSize,
      invert: true
    });

    this.container.appendChild(this.filter.domElement);
    this.setSize(this.width, this.height);

    // Performance: cache container bounds and update on scroll/resize
    this.updateContainerBounds();
    this.boundUpdateHandler = () => this.updateContainerBounds();
    window.addEventListener('scroll', this.boundUpdateHandler, { passive: true });
    window.addEventListener('resize', this.boundUpdateHandler, { passive: true });

    this.container.addEventListener('mousemove', this.onMouseMove, { passive: true });
    this.container.addEventListener('touchmove', this.onMouseMove, { passive: true });
  }

  // Performance: update cached bounds
  updateContainerBounds() {
    if (this.isDisposed) return;
    const bounds = this.container.getBoundingClientRect();
    this.containerBounds = { left: bounds.left, top: bounds.top };
  }

  setSize(w: number, h: number) {
    this.width = w;
    this.height = h;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this.filter.setSize(w, h);

    this.center = { x: w / 2, y: h / 2 };
  }

  load() {
    this.animate();
  }

  onMouseMove(evt: MouseEvent | TouchEvent) {
    if (this.isDisposed) return;
    const e = (evt as TouchEvent).touches ? (evt as TouchEvent).touches[0] : (evt as MouseEvent);
    // Performance: use cached bounds instead of calling getBoundingClientRect every time
    const x = e.clientX - this.containerBounds.left;
    const y = e.clientY - this.containerBounds.top;
    this.mouse = { x, y };
  }

  animate() {
    const animateFrame = () => {
      // Performance: stop animation loop if disposed
      if (this.isDisposed) return;

      this.animationFrameId = requestAnimationFrame(animateFrame);
      // Performance: skip render when paused (off-screen)
      if (!this.isPaused) {
        this.render();
      }
    };
    animateFrame();
  }

  // Performance: pause when off-screen
  pause() {
    this.isPaused = true;
  }

  // Performance: resume when visible
  resume() {
    this.isPaused = false;
  }

  render() {
    // Performance: use performance.now() instead of creating new Date objects
    const time = performance.now() * 0.001;

    // Performance: only re-render text canvas if text changed
    if (this.lastTextRendered !== this.textString) {
      this.textCanvas.render();
      this.texture.needsUpdate = true;
      this.lastTextRendered = this.textString;
    }

    // Use continuous time for smooth wave animation
    (this.mesh.material as ShaderMaterial).uniforms.uTime.value = time;

    this.updateRotation(time);
    this.filter.render(this.scene, this.camera);
  }

  updateRotation(time: number) {
    // Auto-rotation: gentle continuous floating motion
    const autoX = Math.sin(time * 0.3) * 0.12;
    const autoY = Math.cos(time * 0.25) * 0.15;

    // Mouse-based rotation (when user hovers)
    const mouseX = map(this.mouse.y, 0, this.height, 0.3, -0.3);
    const mouseY = map(this.mouse.x, 0, this.width, -0.3, 0.3);

    // Combine auto-rotation with mouse input
    const targetX = autoX + mouseX * 0.5;
    const targetY = autoY + mouseY * 0.5;

    // Smooth interpolation
    this.mesh.rotation.x += (targetX - this.mesh.rotation.x) * 0.03;
    this.mesh.rotation.y += (targetY - this.mesh.rotation.y) * 0.03;
  }

  clear() {
    this.scene.traverse(object => {
      const obj = object as unknown as Mesh;
      if (!obj.isMesh) return;
      [obj.material].flat().forEach(material => {
        material.dispose();
        Object.keys(material).forEach(key => {
          const matProp = material[key as keyof typeof material];
          if (matProp && typeof matProp === 'object' && 'dispose' in matProp && typeof matProp.dispose === 'function') {
            matProp.dispose();
          }
        });
      });
      obj.geometry.dispose();
    });
    this.scene.clear();
  }

  dispose() {
    // Performance: mark as disposed to stop animation loop and prevent further operations
    this.isDisposed = true;

    cancelAnimationFrame(this.animationFrameId);
    this.filter.dispose();

    // Safely remove DOM element
    if (this.filter.domElement.parentNode === this.container) {
      this.container.removeChild(this.filter.domElement);
    }

    this.container.removeEventListener('mousemove', this.onMouseMove);
    this.container.removeEventListener('touchmove', this.onMouseMove);

    // Performance: clean up bound update listeners
    if (this.boundUpdateHandler) {
      window.removeEventListener('scroll', this.boundUpdateHandler);
      window.removeEventListener('resize', this.boundUpdateHandler);
      this.boundUpdateHandler = null;
    }

    // Performance: dispose texture to free GPU memory
    if (this.texture) {
      this.texture.dispose();
    }

    this.clear();
    this.renderer.dispose();
  }
}

interface ASCIITextProps {
  text?: string;
  asciiFontSize?: number;
  textFontSize?: number;
  textColor?: string;
  planeBaseHeight?: number;
  enableWaves?: boolean;
}

export default function ASCIIText({
  text = 'Design',
  asciiFontSize = 8,
  textFontSize = 200,
  textColor = '#fdf9f3',
  planeBaseHeight = 8,
  enableWaves = true
}: ASCIITextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const asciiRef = useRef<CanvAscii | null>(null);
  const isVisible = useVisibilityPause(containerRef);

  // Performance: pause/resume based on visibility
  useEffect(() => {
    if (asciiRef.current) {
      if (isVisible) {
        asciiRef.current.resume();
      } else {
        asciiRef.current.pause();
      }
    }
  }, [isVisible]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Performance: track cleanup state to prevent memory leaks
    let isDisposed = false;
    let intersectionObserver: IntersectionObserver | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const initAscii = (container: HTMLElement, w: number, h: number) => {
      if (isDisposed) return; // Don't initialize if already cleaned up

      asciiRef.current = new CanvAscii(
        {
          text,
          asciiFontSize,
          textFontSize,
          textColor,
          planeBaseHeight,
          enableWaves
        },
        container,
        w,
        h
      );
      asciiRef.current.load();

      // Set up resize observer after initialization
      resizeObserver = new ResizeObserver(entries => {
        if (!entries[0] || !asciiRef.current || isDisposed) return;
        const { width: rw, height: rh } = entries[0].contentRect;
        if (rw > 0 && rh > 0) {
          asciiRef.current.setSize(rw, rh);
        }
      });
      resizeObserver.observe(container);
    };

    const { width, height } = containerRef.current.getBoundingClientRect();

    if (width === 0 || height === 0) {
      // Wait for element to become visible
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          if (isDisposed) return; // Don't proceed if already cleaned up

          if (entry.isIntersecting && entry.boundingClientRect.width > 0 && entry.boundingClientRect.height > 0) {
            const { width: w, height: h } = entry.boundingClientRect;
            initAscii(containerRef.current!, w, h);
            intersectionObserver?.disconnect();
            intersectionObserver = null;
          }
        },
        { threshold: 0.1 }
      );

      intersectionObserver.observe(containerRef.current);
    } else {
      // Initialize immediately if dimensions are available
      initAscii(containerRef.current, width, height);
    }

    // Performance: unified cleanup function handles all cases
    return () => {
      isDisposed = true;

      if (intersectionObserver) {
        intersectionObserver.disconnect();
        intersectionObserver = null;
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }

      if (asciiRef.current) {
        asciiRef.current.dispose();
        asciiRef.current = null;
      }
    };
  }, [text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves]);

  return (
    <div
      ref={containerRef}
      className="ascii-text-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&display=swap');

        .ascii-text-container canvas {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          image-rendering: optimizeSpeed;
          image-rendering: -moz-crisp-edges;
          image-rendering: -o-crisp-edges;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: pixelated;
        }

        .ascii-text-container pre {
          margin: 0;
          user-select: none;
          padding: 0;
          line-height: 1em;
          text-align: left;
          position: absolute;
          left: 0;
          top: 0;
          background-image: radial-gradient(circle, #8B5CF6 0%, #A78BFA 50%, #C4B5FD 100%);
          background-attachment: fixed;
          -webkit-text-fill-color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          z-index: 9;
          mix-blend-mode: difference;
        }
      `}</style>
    </div>
  );
}

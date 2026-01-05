import { useRef, useState, useEffect } from 'react';
import Matter from 'matter-js';
import DOMPurify from 'dompurify';
import { useVisibilityPause } from '@/hooks/useVisibilityPause';

interface FallingTextProps {
  text?: string;
  highlightWords?: string[];
  trigger?: 'auto' | 'scroll' | 'click' | 'hover';
  backgroundColor?: string;
  wireframes?: boolean;
  gravity?: number;
  mouseConstraintStiffness?: number;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
}

const FallingText: React.FC<FallingTextProps> = ({
  text = '',
  highlightWords = [],
  trigger = 'auto',
  backgroundColor = 'transparent',
  wireframes = false,
  gravity = 1,
  mouseConstraintStiffness = 0.2,
  fontSize = '1rem',
  fontWeight = '600',
  fontFamily = 'Heebo, sans-serif'
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const mouseRef = useRef<Matter.Mouse | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const [effectStarted, setEffectStarted] = useState(false);

  // Performance: visibility-based pausing
  const isVisible = useVisibilityPause(containerRef);

  // Performance: pause/resume physics engine based on visibility
  useEffect(() => {
    if (runnerRef.current && engineRef.current) {
      if (isVisible) {
        runnerRef.current.enabled = true;
      } else {
        runnerRef.current.enabled = false;
      }
    }
  }, [isVisible]);

  // Initialize text spans using innerHTML
  // Split by '|' for phrases, or by space for words
  useEffect(() => {
    if (!textRef.current) return;
    const phrases = text.includes('|') ? text.split('|').map(p => p.trim()).filter(p => p) : text.split(' ');

    const newHTML = phrases
      .map(phrase => {
        const isHighlighted = highlightWords.some(hw => phrase.includes(hw));
        return `<span
          class="inline-block mx-1 my-1 select-none ${isHighlighted ? 'text-primary' : 'text-nexo-charcoal'}"
          style="cursor: grab; white-space: nowrap; font-weight: ${isHighlighted ? '700' : fontWeight}; font-family: ${fontFamily}; text-shadow: 0 1px 2px rgba(0,0,0,0.1);"
        >
          ${phrase}
        </span>`;
      })
      .join('');

    textRef.current.innerHTML = DOMPurify.sanitize(newHTML);
  }, [text, highlightWords, fontWeight, fontFamily]);

  // Handle triggers
  useEffect(() => {
    if (trigger === 'auto') {
      setEffectStarted(true);
      return;
    }
    if (trigger === 'scroll' && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setEffectStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [trigger]);

  // Physics effect
  useEffect(() => {
    if (!effectStarted) return;

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;

    if (!containerRef.current || !canvasContainerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    if (width <= 0 || height <= 0) return;

    const engine = Engine.create();
    engine.world.gravity.y = gravity;

    const render = Render.create({
      element: canvasContainerRef.current,
      engine,
      options: {
        width,
        height,
        background: backgroundColor,
        wireframes
      }
    });

    // Store render ref for cleanup
    renderRef.current = render;

    // Invisible boundaries
    const boundaryOptions = {
      isStatic: true,
      render: { fillStyle: 'transparent' }
    };
    const floor = Bodies.rectangle(width / 2, height + 25, width, 50, boundaryOptions);
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundaryOptions);
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, boundaryOptions);
    const ceiling = Bodies.rectangle(width / 2, -25, width, 50, boundaryOptions);

    if (!textRef.current) return;
    const wordSpans = textRef.current.querySelectorAll('span');
    const wordBodies = [...wordSpans].map(elem => {
      const rect = elem.getBoundingClientRect();

      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;

      // Add significant padding to body size to prevent overlapping
      const bodyWidth = rect.width + 20;
      const bodyHeight = rect.height + 16;

      const body = Bodies.rectangle(x, y, bodyWidth, bodyHeight, {
        render: { fillStyle: 'transparent' },
        restitution: 0.8,        // Higher bounce for more dynamic tumbling
        frictionAir: 0.02,       // Less air resistance
        friction: 0.4,           // Surface friction to induce spin on contact
        density: 0.001,          // Lower density = easier to rotate
        chamfer: { radius: 4 },  // Rounded corners for smoother collisions and rotation
      });

      // Add random initial angular velocity for natural tumbling
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);

      // Add slight random horizontal velocity for more dynamic falling
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 2,
        y: Math.random() * 2
      });

      return { elem: elem as HTMLElement, body };
    });

    // Set initial absolute positioning
    wordBodies.forEach(({ elem }) => {
      elem.style.position = 'absolute';
      elem.style.transform = 'none';
    });

    // Mouse constraint for dragging
    const mouse = Mouse.create(containerRef.current);
    mouseRef.current = mouse;
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: mouseConstraintStiffness,
        render: { visible: false }
      }
    });
    render.mouse = mouse;

    World.add(engine.world, [floor, leftWall, rightWall, ceiling, mouseConstraint, ...wordBodies.map(wb => wb.body)]);

    const runner = Runner.create();
    runnerRef.current = runner;
    engineRef.current = engine;
    Runner.run(runner, engine);
    Render.run(render);

    // Update loop - sync DOM positions with physics bodies
    // Track if effect is still mounted to prevent updates after cleanup
    let isMounted = true;
    const updateLoop = () => {
      if (!isMounted) return;
      rafIdRef.current = requestAnimationFrame(updateLoop);

      // Always update DOM positions (even when physics is paused, to show final state)
      wordBodies.forEach(({ body, elem }) => {
        const { x, y } = body.position;
        elem.style.left = `${x}px`;
        elem.style.top = `${y}px`;
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
      });
    };
    rafIdRef.current = requestAnimationFrame(updateLoop);

    // Store reference to canvasContainer for cleanup
    const canvasContainer = canvasContainerRef.current;

    return () => {
      // Stop the animation loop first
      isMounted = false;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      // Stop Matter.js render and runner
      Render.stop(render);
      Runner.stop(runner);

      // Clean up mouse event listeners (Matter.js Mouse adds these)
      if (mouse && mouse.element) {
        // Matter.js Mouse.create adds mousemove, mousedown, mouseup, mousewheel listeners
        // We need to clear the mouse to remove these
        Mouse.clearSourceEvents(mouse);
      }

      // Remove canvas from DOM safely
      if (render.canvas && canvasContainer && canvasContainer.contains(render.canvas)) {
        canvasContainer.removeChild(render.canvas);
      }

      // Clear render textures cache to prevent memory leaks
      if (render.textures) {
        render.textures = {};
      }

      // Clear world and engine
      World.clear(engine.world, false);
      Engine.clear(engine);

      // Nullify refs to prevent stale references
      runnerRef.current = null;
      engineRef.current = null;
      renderRef.current = null;
      mouseRef.current = null;
    };
  }, [effectStarted, gravity, wireframes, backgroundColor, mouseConstraintStiffness]);

  const handleTrigger = () => {
    if (!effectStarted && (trigger === 'click' || trigger === 'hover')) {
      setEffectStarted(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative z-[1] w-full h-full cursor-pointer text-center overflow-hidden"
      onClick={trigger === 'click' ? handleTrigger : undefined}
      onMouseEnter={trigger === 'hover' ? handleTrigger : undefined}
      dir="rtl"
    >
      <div
        ref={textRef}
        className="inline-block pt-4"
        style={{
          fontSize,
          lineHeight: 1.6
        }}
      />

      <div className="absolute top-0 left-0 z-0" ref={canvasContainerRef} />
    </div>
  );
};

export default FallingText;

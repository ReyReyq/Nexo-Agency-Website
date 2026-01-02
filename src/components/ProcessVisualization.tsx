"use client";

import { useRef, useState, useEffect, createContext, useContext, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles, MeshWobbleMaterial } from "@react-three/drei";
import { MathUtils, Mesh } from "three";
import { useVisibilityPause } from "@/hooks/useVisibilityPause";

// Context to pass visibility state to 3D components
const VisibilityContext = createContext(true);

interface ProcessVisualizationProps {
  activeStep: number;
  steps: Array<{
    number: string;
    color: string;
  }>;
}

// Color mapping per step
const STEP_COLORS = [
  { primary: "#8B5CF6", secondary: "#D946EF", emissive: "#6D28D9" }, // Violet to Fuchsia
  { primary: "#D946EF", secondary: "#EC4899", emissive: "#A21CAF" }, // Fuchsia to Pink
  { primary: "#EC4899", secondary: "#F43F5E", emissive: "#BE185D" }, // Pink to Rose
  { primary: "#F43F5E", secondary: "#F59E0B", emissive: "#E11D48" }, // Rose to Amber
  { primary: "#F59E0B", secondary: "#FB923C", emissive: "#D97706" }, // Amber to Orange
];

// Animated morphing shape
const MorphingShape = ({ activeStep }: { activeStep: number }) => {
  const meshRef = useRef<Mesh>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentColors, setCurrentColors] = useState(STEP_COLORS[0]);
  const isVisible = useContext(VisibilityContext);

  // Smooth color transition
  useEffect(() => {
    setCurrentColors(STEP_COLORS[activeStep] || STEP_COLORS[0]);
  }, [activeStep]);

  // Mouse parallax effect - only track when visible for performance
  useEffect(() => {
    if (!isVisible) return;

    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x: x * 0.3, y: y * 0.3 });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isVisible]);

  // Animate rotation based on mouse and step
  useFrame((state) => {
    if (!isVisible) return; // Skip updates when off-screen
    if (meshRef.current) {
      // Gentle auto-rotation
      meshRef.current.rotation.x = MathUtils.lerp(
        meshRef.current.rotation.x,
        mousePosition.y + Math.sin(state.clock.elapsedTime * 0.3) * 0.1,
        0.05
      );
      meshRef.current.rotation.y = MathUtils.lerp(
        meshRef.current.rotation.y,
        mousePosition.x + state.clock.elapsedTime * 0.15,
        0.05
      );
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.4}
      floatIntensity={0.6}
      floatingRange={[-0.1, 0.1]}
    >
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color={currentColors.primary}
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive={currentColors.emissive}
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
};

// Animated rings around the shape
const AnimatedRings = ({ activeStep }: { activeStep: number }) => {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const isVisible = useContext(VisibilityContext);

  const currentColors = STEP_COLORS[activeStep] || STEP_COLORS[0];

  useFrame((state) => {
    if (!isVisible) return; // Skip updates when off-screen
    const t = state.clock.elapsedTime;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.sin(t * 0.3) * 0.2;
      ring1Ref.current.rotation.y = t * 0.2;
      ring1Ref.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.05);
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.cos(t * 0.4) * 0.2;
      ring2Ref.current.rotation.y = -t * 0.15;
      ring2Ref.current.scale.setScalar(1 + Math.cos(t * 0.8 + 1) * 0.05);
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = Math.sin(t * 0.5) * 0.2;
      ring3Ref.current.rotation.y = t * 0.25;
      ring3Ref.current.scale.setScalar(1 + Math.sin(t * 0.8 + 2) * 0.05);
    }
  });

  return (
    <>
      <mesh ref={ring1Ref} scale={2.2}>
        <torusGeometry args={[1, 0.02, 16, 100]} />
        <meshStandardMaterial
          color={currentColors.primary}
          transparent
          opacity={0.4}
          emissive={currentColors.primary}
          emissiveIntensity={0.5}
        />
      </mesh>

      <mesh ref={ring2Ref} scale={2.6} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1, 0.015, 16, 100]} />
        <meshStandardMaterial
          color={currentColors.secondary}
          transparent
          opacity={0.3}
          emissive={currentColors.secondary}
          emissiveIntensity={0.4}
        />
      </mesh>

      <mesh ref={ring3Ref} scale={3.0} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[1, 0.01, 16, 100]} />
        <meshStandardMaterial
          color={currentColors.primary}
          transparent
          opacity={0.2}
          emissive={currentColors.primary}
          emissiveIntensity={0.3}
        />
      </mesh>
    </>
  );
};

// Floating particles
const FloatingParticles = ({ activeStep }: { activeStep: number }) => {
  const currentColors = STEP_COLORS[activeStep] || STEP_COLORS[0];

  return (
    <Sparkles
      count={50}
      scale={6}
      size={3}
      speed={0.4}
      opacity={0.7}
      color={currentColors.primary}
    />
  );
};

// Scene content
const SceneContent = ({ activeStep, isVisible }: { activeStep: number; isVisible: boolean }) => {
  return (
    <VisibilityContext.Provider value={isVisible}>
      {/* Lighting setup */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8B5CF6" />
      <spotLight
        position={[0, 5, 5]}
        angle={0.4}
        penumbra={1}
        intensity={0.8}
        color="#D946EF"
      />

      {/* Main components */}
      <MorphingShape activeStep={activeStep} />
      <AnimatedRings activeStep={activeStep} />
      <FloatingParticles activeStep={activeStep} />
    </VisibilityContext.Provider>
  );
};

// Main component - memoized to prevent unnecessary re-renders
const ProcessVisualization = memo(({ activeStep, steps }: ProcessVisualizationProps) => {
  const currentStep = steps[activeStep];
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useVisibilityPause(containerRef);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        frameloop={isVisible ? "always" : "demand"}
      >
        <SceneContent activeStep={activeStep} isVisible={isVisible} />
      </Canvas>

      {/* Step number overlay badge */}
      <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-2xl bg-hero-bg border-2 border-primary flex items-center justify-center shadow-xl pointer-events-none z-10">
        <span className="text-3xl font-black text-primary">{currentStep?.number || "01"}</span>
      </div>
    </div>
  );
});

ProcessVisualization.displayName = 'ProcessVisualization';

export default ProcessVisualization;

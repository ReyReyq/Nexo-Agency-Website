import { useRef, createContext, useContext } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useVisibilityPause } from "@/hooks/useVisibilityPause";

// Context to pass visibility state to 3D components
const VisibilityContext = createContext(true);

const AnimatedShape = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const isVisible = useContext(VisibilityContext);

  useFrame((state) => {
    // Performance: skip updates when off-screen
    if (!isVisible) return;
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={2.5}>
        {/* Performance: reduced geometry complexity from 128,32 to 64,16 */}
        <torusKnotGeometry args={[1, 0.35, 64, 16]} />
        <MeshDistortMaterial
          color="#EC4899"
          attach="material"
          distort={0.25}
          speed={1.5}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </Float>
  );
};

const Scene3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useVisibilityPause(containerRef);

  return (
    <div ref={containerRef} className="w-full h-[400px] md:h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 2]}
        // Performance: pause rendering when off-screen
        frameloop={isVisible ? "always" : "demand"}
      >
        <VisibilityContext.Provider value={isVisible}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <pointLight position={[-10, -10, -5]} color="#EC4899" intensity={0.8} />
          <pointLight position={[10, -10, 5]} color="#F472B6" intensity={0.4} />
          <AnimatedShape />
        </VisibilityContext.Provider>
      </Canvas>
    </div>
  );
};

export default Scene3D;
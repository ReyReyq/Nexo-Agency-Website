import { useRef, createContext, useContext, useMemo, useEffect, memo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useVisibilityPause } from "@/hooks/useVisibilityPause";

// Context to pass visibility state to 3D components
const VisibilityContext = createContext(true);

// Memoized geometry args to prevent recreation
const TORUS_KNOT_ARGS: [number, number, number, number] = [1, 0.35, 64, 16];

const AnimatedShape = memo(() => {
  const meshRef = useRef<THREE.Mesh>(null);
  const isVisible = useContext(VisibilityContext);

  // Cleanup: dispose geometry and material on unmount
  useEffect(() => {
    return () => {
      if (meshRef.current) {
        meshRef.current.geometry?.dispose();
        if (meshRef.current.material) {
          if (Array.isArray(meshRef.current.material)) {
            meshRef.current.material.forEach((mat) => mat.dispose());
          } else {
            meshRef.current.material.dispose();
          }
        }
      }
    };
  }, []);

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
        <torusKnotGeometry args={TORUS_KNOT_ARGS} />
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
});

AnimatedShape.displayName = "AnimatedShape";

// Memoized camera config to prevent recreation
const CAMERA_CONFIG = { position: [0, 0, 7] as [number, number, number], fov: 45 };

// Component to handle WebGL cleanup on unmount
const SceneCleanup = () => {
  const { gl, scene } = useThree();

  useEffect(() => {
    return () => {
      // Dispose all scene objects
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((mat) => {
                mat.dispose();
                // Dispose any textures on the material
                Object.values(mat).forEach((value) => {
                  if (value instanceof THREE.Texture) {
                    value.dispose();
                  }
                });
              });
            } else {
              object.material.dispose();
              // Dispose any textures on the material
              Object.values(object.material).forEach((value) => {
                if (value instanceof THREE.Texture) {
                  value.dispose();
                }
              });
            }
          }
        }
      });

      // Clear scene
      scene.clear();

      // Dispose WebGL renderer and release context
      gl.dispose();
      gl.forceContextLoss();
    };
  }, [gl, scene]);

  return null;
};

const Scene3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useVisibilityPause(containerRef);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => isVisible, [isVisible]);

  return (
    <div ref={containerRef} className="w-full h-[400px] md:h-[600px]">
      <Canvas
        camera={CAMERA_CONFIG}
        dpr={[1, 2]}
        // Performance: pause rendering when off-screen
        frameloop={isVisible ? "always" : "demand"}
      >
        <SceneCleanup />
        <VisibilityContext.Provider value={contextValue}>
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
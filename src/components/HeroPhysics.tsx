import { useRef, useState, useMemo, createContext, useContext } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { Float, Environment, MeshTransmissionMaterial } from '@react-three/drei';
import {
  Mesh,
  Vector3,
  OctahedronGeometry,
  TorusGeometry,
  ConeGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  SphereGeometry,
  BoxGeometry
} from 'three';
import { motion } from 'framer-motion';
import { useVisibilityPause } from '@/hooks/useVisibilityPause';

// Context to pass visibility state to 3D components
const VisibilityContext = createContext(true);

// Shape types for variety
const SHAPE_TYPES = ['star', 'moon', 'crystal', 'ring', 'key', 'heart', 'diamond', 'sphere'] as const;
type ShapeType = typeof SHAPE_TYPES[number];

// Colors matching pink-purple gradient theme
const SHAPE_COLORS = [
  '#FF1493', // Deep Pink
  '#DA70D6', // Orchid
  '#BA55D3', // Medium Orchid
  '#9370DB', // Medium Purple
  '#8A2BE2', // Blue Violet
  '#FF69B4', // Hot Pink
  '#DDA0DD', // Plum
  '#EE82EE', // Violet
];

// Individual 3D Shape Component
function Shape3D({ type, position, color, scale = 1 }: {
  type: ShapeType;
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const meshRef = useRef<Mesh>(null);
  const rigidBodyRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isVisible = useContext(VisibilityContext);

  // Rotate shapes gently - skip when off-screen
  useFrame((state) => {
    if (!isVisible) return;
    if (meshRef.current && !isDragging) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.008;
    }
  });

  // Get geometry based on shape type
  const geometry = useMemo(() => {
    switch (type) {
      case 'star':
        return new OctahedronGeometry(0.5 * scale, 0);
      case 'moon':
        return new TorusGeometry(0.4 * scale, 0.15 * scale, 8, 24, Math.PI * 1.5);
      case 'crystal':
        return new ConeGeometry(0.3 * scale, 0.8 * scale, 6);
      case 'ring':
        return new TorusGeometry(0.35 * scale, 0.1 * scale, 8, 32);
      case 'key':
        return new CylinderGeometry(0.15 * scale, 0.15 * scale, 0.6 * scale, 6);
      case 'heart':
        return new IcosahedronGeometry(0.4 * scale, 0);
      case 'diamond':
        return new OctahedronGeometry(0.45 * scale, 0);
      case 'sphere':
        return new SphereGeometry(0.35 * scale, 16, 16);
      default:
        return new BoxGeometry(0.5 * scale, 0.5 * scale, 0.5 * scale);
    }
  }, [type, scale]);

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      colliders="hull"
      restitution={0.7}
      friction={0.3}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh
        ref={meshRef}
        geometry={geometry}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <MeshTransmissionMaterial
          color={color}
          thickness={0.5}
          roughness={0.1}
          transmission={0.9}
          ior={1.5}
          chromaticAberration={0.1}
          backside={true}
        />
      </mesh>
    </RigidBody>
  );
}

// Mouse interaction - applies force to nearby objects
function MouseForce() {
  const { camera, pointer, scene } = useThree();
  const lastPos = useRef(new Vector3());
  const isVisible = useContext(VisibilityContext);

  useFrame(() => {
    if (!isVisible) return; // Skip when off-screen

    const vec = new Vector3(pointer.x, pointer.y, 0.5);
    vec.unproject(camera);

    // Calculate velocity from mouse movement
    const velocity = vec.clone().sub(lastPos.current);
    lastPos.current.copy(vec);

    // Apply gentle push to nearby rigid bodies
    scene.traverse((obj: any) => {
      if (obj.rigidBody) {
        const pos = obj.rigidBody.translation();
        const dist = vec.distanceTo(new Vector3(pos.x, pos.y, pos.z));

        if (dist < 2) {
          const force = velocity.clone().multiplyScalar(50 / (dist + 0.5));
          obj.rigidBody.applyImpulse(
            { x: force.x, y: force.y, z: force.z },
            true
          );
        }
      }
    });
  });

  return null;
}

// Floor collider (invisible)
function Floor() {
  return (
    <RigidBody type="fixed" position={[0, -5, 0]}>
      <CuboidCollider args={[50, 0.5, 50]} />
    </RigidBody>
  );
}

// Walls to keep shapes in view
function Walls() {
  return (
    <>
      {/* Left wall */}
      <RigidBody type="fixed" position={[-10, 0, 0]}>
        <CuboidCollider args={[0.5, 20, 20]} />
      </RigidBody>
      {/* Right wall */}
      <RigidBody type="fixed" position={[10, 0, 0]}>
        <CuboidCollider args={[0.5, 20, 20]} />
      </RigidBody>
      {/* Back wall */}
      <RigidBody type="fixed" position={[0, 0, -10]}>
        <CuboidCollider args={[20, 20, 0.5]} />
      </RigidBody>
      {/* Front wall (transparent) */}
      <RigidBody type="fixed" position={[0, 0, 10]}>
        <CuboidCollider args={[20, 20, 0.5]} />
      </RigidBody>
    </>
  );
}

// Scene with all 3D elements
function Scene({ isVisible }: { isVisible: boolean }) {
  // Generate random shapes - reduced from 40 to 25 for better performance
  const shapes = useMemo(() => {
    const items = [];
    for (let i = 0; i < 25; i++) {
      items.push({
        id: i,
        type: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
        position: [
          (Math.random() - 0.5) * 12,
          Math.random() * 15 + 5, // Start above view, rain down
          (Math.random() - 0.5) * 8,
        ] as [number, number, number],
        color: SHAPE_COLORS[Math.floor(Math.random() * SHAPE_COLORS.length)],
        scale: 0.6 + Math.random() * 0.8,
      });
    }
    return items;
  }, []);

  return (
    <VisibilityContext.Provider value={isVisible}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#FF69B4" />
      <pointLight position={[10, -10, 10]} intensity={0.5} color="#8A2BE2" />

      <Physics gravity={[0, -3, 0]} paused={!isVisible}>
        <Floor />
        <Walls />

        {shapes.map((shape) => (
          <Shape3D
            key={shape.id}
            type={shape.type}
            position={shape.position}
            color={shape.color}
            scale={shape.scale}
          />
        ))}
      </Physics>

      <Environment preset="city" />
    </VisibilityContext.Provider>
  );
}

// Main Hero Component
const HeroPhysics = () => {
  const containerRef = useRef<HTMLElement>(null);
  const isVisible = useVisibilityPause(containerRef);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #FF1493 0%, #8A2BE2 50%, #4B0082 100%)',
        }}
      />

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          shadows
          camera={{ position: [0, 0, 12], fov: 50 }}
          style={{ background: 'transparent' }}
          frameloop={isVisible ? 'always' : 'demand'}
        >
          <Scene isVisible={isVisible} />
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center px-6"
          dir="rtl"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6"
            style={{
              textShadow: '0 0 40px rgba(255, 105, 180, 0.5), 0 0 80px rgba(138, 43, 226, 0.3)',
            }}
          >
            NEXO
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8"
          >
            פתרונות דיגיטליים שמניעים תוצאות אמיתיות
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white font-medium text-lg hover:bg-white/30 transition-all"
          >
            בואו נתחיל
          </motion.button>
        </motion.div>
      </div>

      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm"
      >
        הזיזו את העכבר כדי לשחק עם הצורות ✨
      </motion.p>
    </section>
  );
};

export default HeroPhysics;

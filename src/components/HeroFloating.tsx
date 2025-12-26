'use client';

import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Float, Sphere, Environment, shaderMaterial, MeshWobbleMaterial } from '@react-three/drei';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Simplex 3D Noise GLSL - for organic but controlled deformation
const simplex3d = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

// FIRM organic blob shader - subtle deformation with elastic feel
const FirmBlobMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color('#FFB6C1'),
    uColor2: new THREE.Color('#FFC4D6'),
    uDistortAmount: 0.08,  // VERY LOW for firm feel
    uNoiseFreq: 1.8,       // HIGH for tight, controlled patterns
  },
  // Vertex Shader
  `
    ${simplex3d}

    uniform float uTime;
    uniform float uDistortAmount;
    uniform float uNoiseFreq;

    varying vec3 vNormal;
    varying float vDisplacement;

    void main() {
      vec3 pos = position;

      // Subtle, controlled noise displacement
      float displacement = snoise(vec3(
        pos.x * uNoiseFreq + uTime * 0.15,
        pos.y * uNoiseFreq + uTime * 0.12,
        pos.z * uNoiseFreq + uTime * 0.1
      )) * uDistortAmount;

      vDisplacement = displacement;

      // Apply displacement while maintaining solid form
      vec3 newPosition = normalize(pos) * (1.0 + displacement);

      vNormal = normalize(normalMatrix * normal);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uDistortAmount;

    varying vec3 vNormal;
    varying float vDisplacement;

    void main() {
      // Subtle gradient based on displacement
      float t = smoothstep(-uDistortAmount, uDistortAmount, vDisplacement);
      vec3 color = mix(uColor1, uColor2, t * 0.5 + 0.25);

      // Soft lighting for solid appearance
      vec3 light = normalize(vec3(0.5, 0.8, 1.0));
      float diffuse = max(dot(vNormal, light), 0.0);
      float ambient = 0.5;

      vec3 finalColor = color * (ambient + diffuse * 0.5);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

// Extend for R3F
extend({ FirmBlobMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      firmBlobMaterial: any;
    }
  }
}

// Firm organic blob with custom shader - HIGH RESOLUTION
function FirmBlob({
  position,
  scale,
  color1 = '#FFB6C1',
  color2 = '#FFC4D6',
  speed = 0.5,
  distortAmount = 0.08,
  noiseFreq = 1.8,
  floatSpeed = 1.2,
}: any) {
  const materialRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uTime = clock.getElapsedTime() * speed;
    }
  });

  return (
    <Float
      speed={floatSpeed}
      rotationIntensity={0.05}
      floatIntensity={0.15}
      floatingRange={[-0.05, 0.05]}
    >
      <mesh position={position} scale={scale}>
        <icosahedronGeometry args={[1, 128]} />
        <firmBlobMaterial
          ref={materialRef}
          uColor1={new THREE.Color(color1)}
          uColor2={new THREE.Color(color2)}
          uDistortAmount={distortAmount}
          uNoiseFreq={noiseFreq}
        />
      </mesh>
    </Float>
  );
}

// Wobbly blob using drei's MeshWobbleMaterial - HIGH RESOLUTION
function WobblyBlob({
  position,
  scale,
  color,
  factor = 0.1,
  speed = 0.8,
  floatSpeed = 1.4
}: any) {
  return (
    <Float
      speed={floatSpeed}
      rotationIntensity={0.06}
      floatIntensity={0.18}
      floatingRange={[-0.06, 0.06]}
    >
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 128, 128]} />
        <MeshWobbleMaterial
          color={color}
          factor={factor}
          speed={speed}
          roughness={0.3}
          metalness={0.05}
        />
      </mesh>
    </Float>
  );
}

// High-res solid sphere with premium finish
function SolidSphere({
  position,
  scale,
  color,
  floatSpeed = 1.4,
  opacity = 1
}: any) {
  return (
    <Float
      speed={floatSpeed}
      rotationIntensity={0.04}
      floatIntensity={0.12}
      floatingRange={[-0.04, 0.04]}
    >
      <Sphere args={[1, 128, 128]} position={position} scale={scale}>
        <meshStandardMaterial
          color={color}
          roughness={0.35}
          metalness={0.1}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </Sphere>
    </Float>
  );
}

// 3D Scene - Smaller shapes arranged in a CIRCLE around the hero
function FloatingShapes({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const unsubscribeX = mouseX.on('change', (latest: number) => {
      if (groupRef.current) {
        groupRef.current.rotation.y = latest * 0.05;
      }
    });

    const unsubscribeY = mouseY.on('change', (latest: number) => {
      if (groupRef.current) {
        groupRef.current.rotation.x = latest * 0.03;
      }
    });

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [mouseX, mouseY]);

  // Circular arrangement parameters
  const centerX = 0;
  const centerY = 0;
  const radiusOuter = 6;    // Outer ring
  const radiusMiddle = 4;   // Middle ring
  const radiusInner = 2.5;  // Inner ring

  // Colors for the shapes
  const pinkColors = ['#FFB6C1', '#FFC4D6', '#FFD1DC', '#FFAEC9', '#FF9EBB'];
  const blueColors = ['#A7D8F0', '#B4E1FF', '#ADD8E6', '#C8E6FF', '#87CEEB'];

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* OUTER RING - 8 shapes in a circle */}
      {/* Top */}
      <FirmBlob
        position={[centerX, centerY + radiusOuter, -3]}
        scale={0.7}
        color1="#FFB6C1"
        color2="#FFC4D6"
        speed={0.4}
        distortAmount={0.05}
        noiseFreq={2.0}
        floatSpeed={1.0}
      />
      {/* Top-right */}
      <SolidSphere
        position={[centerX + radiusOuter * 0.7, centerY + radiusOuter * 0.7, -2.5]}
        scale={0.55}
        color="#A7D8F0"
        floatSpeed={1.2}
      />
      {/* Right */}
      <WobblyBlob
        position={[centerX + radiusOuter, centerY, -2]}
        scale={0.65}
        color="#FFD1DC"
        factor={0.06}
        speed={0.5}
        floatSpeed={1.1}
      />
      {/* Bottom-right */}
      <SolidSphere
        position={[centerX + radiusOuter * 0.7, centerY - radiusOuter * 0.7, -3]}
        scale={0.5}
        color="#B4E1FF"
        floatSpeed={1.3}
      />
      {/* Bottom */}
      <FirmBlob
        position={[centerX, centerY - radiusOuter, -2.5]}
        scale={0.6}
        color1="#FFC4D6"
        color2="#FFB6C1"
        speed={0.45}
        distortAmount={0.05}
        noiseFreq={1.9}
        floatSpeed={1.0}
      />
      {/* Bottom-left */}
      <SolidSphere
        position={[centerX - radiusOuter * 0.7, centerY - radiusOuter * 0.7, -2]}
        scale={0.55}
        color="#ADD8E6"
        floatSpeed={1.2}
      />
      {/* Left */}
      <WobblyBlob
        position={[centerX - radiusOuter, centerY, -3]}
        scale={0.7}
        color="#FFAEC9"
        factor={0.06}
        speed={0.55}
        floatSpeed={1.1}
      />
      {/* Top-left */}
      <SolidSphere
        position={[centerX - radiusOuter * 0.7, centerY + radiusOuter * 0.7, -2.5]}
        scale={0.5}
        color="#C8E6FF"
        floatSpeed={1.3}
      />

      {/* MIDDLE RING - 6 shapes offset from outer ring */}
      <FirmBlob
        position={[centerX + radiusMiddle * 0.9, centerY + radiusMiddle * 0.4, -1.5]}
        scale={0.5}
        color1="#A7D8F0"
        color2="#B4E1FF"
        speed={0.5}
        distortAmount={0.04}
        noiseFreq={2.2}
        floatSpeed={1.4}
      />
      <SolidSphere
        position={[centerX + radiusMiddle * 0.5, centerY - radiusMiddle * 0.85, -2]}
        scale={0.4}
        color="#FFD1DC"
        floatSpeed={1.5}
      />
      <WobblyBlob
        position={[centerX - radiusMiddle * 0.4, centerY - radiusMiddle * 0.9, -1.5]}
        scale={0.45}
        color="#87CEEB"
        factor={0.05}
        speed={0.6}
        floatSpeed={1.3}
      />
      <SolidSphere
        position={[centerX - radiusMiddle * 0.95, centerY + radiusMiddle * 0.3, -2]}
        scale={0.5}
        color="#FF9EBB"
        floatSpeed={1.4}
      />
      <FirmBlob
        position={[centerX - radiusMiddle * 0.3, centerY + radiusMiddle * 0.95, -1.8]}
        scale={0.45}
        color1="#B4E1FF"
        color2="#A7D8F0"
        speed={0.4}
        distortAmount={0.04}
        noiseFreq={2.1}
        floatSpeed={1.5}
      />
      <SolidSphere
        position={[centerX + radiusMiddle * 0.85, centerY - radiusMiddle * 0.5, -1.5]}
        scale={0.35}
        color="#FFC4D6"
        floatSpeed={1.6}
      />

      {/* INNER RING - Small accent spheres closer to center */}
      <SolidSphere
        position={[centerX + radiusInner, centerY + 0.3, -1]}
        scale={0.3}
        color="#FFB6C1"
        floatSpeed={1.8}
        opacity={0.9}
      />
      <SolidSphere
        position={[centerX - radiusInner * 0.8, centerY + radiusInner * 0.6, -1.2]}
        scale={0.25}
        color="#ADD8E6"
        floatSpeed={1.9}
        opacity={0.85}
      />
      <SolidSphere
        position={[centerX - radiusInner * 0.5, centerY - radiusInner * 0.85, -1]}
        scale={0.28}
        color="#FFD4E5"
        floatSpeed={1.7}
        opacity={0.9}
      />
      <SolidSphere
        position={[centerX + radiusInner * 0.6, centerY - radiusInner * 0.8, -1.3]}
        scale={0.22}
        color="#C8E6FF"
        floatSpeed={2.0}
        opacity={0.85}
      />

      {/* Tiny floating accents in the far background */}
      <SolidSphere position={[7, 3, -5]} scale={0.35} color="#FFE4EC" floatSpeed={2.2} opacity={0.7} />
      <SolidSphere position={[-7, -3, -5]} scale={0.3} color="#E0F0FF" floatSpeed={2.1} opacity={0.7} />
      <SolidSphere position={[5, -4, -6]} scale={0.25} color="#FFD4E5" floatSpeed={2.3} opacity={0.6} />
      <SolidSphere position={[-5, 4, -6]} scale={0.28} color="#D0E8FF" floatSpeed={2.0} opacity={0.65} />

      {/* Environment for soft lighting */}
      <Environment preset="sunset" environmentIntensity={0.4} />

      {/* Premium lighting setup */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 5, 5]} intensity={0.55} color="#FFFFFF" />
      <directionalLight position={[-5, 3, 5]} intensity={0.3} color="#FFE4EC" />
      <pointLight position={[0, 0, 6]} intensity={0.2} color="#FFFFFF" />
      <pointLight position={[-4, 2, 4]} intensity={0.15} color="#FFB6C1" />
      <pointLight position={[4, -2, 4]} intensity={0.12} color="#87CEEB" />
    </group>
  );
}

export default function HeroFloating() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 35, stiffness: 100 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    mouseX.set((clientX / innerWidth - 0.5) * 2);
    mouseY.set((clientY / innerHeight - 0.5) * 2);
  };

  return (
    <div
      className="relative h-screen w-full bg-[#FAFAFA] overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Content Section - RIGHT SIDE */}
      <div className="absolute inset-0 z-10 flex items-center justify-end">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-2xl ml-auto">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-6 text-right"
              dir="rtl"
            >
              {/* Eyebrow text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block"
              >
                <span className="text-sm font-medium text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
                  פלטפורמת הויזואליה המתקדמת
                </span>
              </motion.div>

              {/* Main headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-tight"
              >
                הדמיה חכמה
                <br />
                <span className="bg-gradient-to-l from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                  בזמן אמת
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl"
              >
                צור, ערוך והדמה פרויקטים ויזואליים מורכבים עם טכנולוגיית AI מתקדמת.
                חוויה תלת-מימדית חלקה ואינטואיטיבית.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex gap-4 items-center justify-end pt-4"
              >
                <button className="group relative px-8 py-4 bg-gradient-to-l from-purple-600 via-pink-500 to-blue-500 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105">
                  <span className="relative z-10">התחל עכשיו</span>
                  <div className="absolute inset-0 bg-gradient-to-l from-purple-700 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                <button className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-2xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 hover:scale-105">
                  צפה בהדגמה
                </button>
              </motion.div>

              {/* Stats/Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex gap-8 pt-8 justify-end"
              >
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">משתמשים פעילים</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">500K+</div>
                  <div className="text-sm text-gray-600">פרויקטים נוצרו</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-600">זמן פעילות</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 3D Canvas - FULL SCREEN with circular shapes */}
      <div className="absolute top-0 left-0 w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 12], fov: 45 }}
          dpr={[1.5, 2.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <FloatingShapes mouseX={mouseXSpring} mouseY={mouseYSpring} />
        </Canvas>
      </div>

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-pink-50/20 via-transparent to-blue-50/20" />
    </div>
  );
}

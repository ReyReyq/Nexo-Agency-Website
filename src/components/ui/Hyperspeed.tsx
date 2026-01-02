import { useEffect, useRef, FC } from 'react';
import * as THREE from 'three';
import { BloomEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect, SMAAPreset } from 'postprocessing';

interface Colors {
  roadColor: number;
  islandColor: number;
  background: number;
  shoulderLines: number;
  brokenLines: number;
  leftCars: number[];
  rightCars: number[];
  sticks: number;
}

interface HyperspeedOptions {
  onSpeedUp?: (ev: MouseEvent | TouchEvent) => void;
  onSlowDown?: (ev: MouseEvent | TouchEvent) => void;
  distortion?: string;
  length: number;
  roadWidth: number;
  islandWidth: number;
  lanesPerRoad: number;
  fov: number;
  fovSpeedUp: number;
  speedUp: number;
  carLightsFade: number;
  totalSideLightSticks: number;
  lightPairsPerRoadWay: number;
  shoulderLinesWidthPercentage: number;
  brokenLinesWidthPercentage: number;
  brokenLinesLengthPercentage: number;
  lightStickWidth: [number, number];
  lightStickHeight: [number, number];
  movingAwaySpeed: [number, number];
  movingCloserSpeed: [number, number];
  carLightsLength: [number, number];
  carLightsRadius: [number, number];
  carWidthPercentage: [number, number];
  carShiftX: [number, number];
  carFloorSeparation: [number, number];
  colors: Colors;
}

interface HyperspeedProps {
  effectOptions?: Partial<HyperspeedOptions>;
}

const defaultOptions: HyperspeedOptions = {
  onSpeedUp: () => {},
  onSlowDown: () => {},
  distortion: 'turbulentDistortion',
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 4,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 40,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [60, 80],
  movingCloserSpeed: [-120, -160],
  carLightsLength: [400 * 0.03, 400 * 0.2],
  carLightsRadius: [0.05, 0.14],
  carWidthPercentage: [0.3, 0.5],
  carShiftX: [-0.8, 0.8],
  carFloorSeparation: [0, 5],
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0xffffff,
    brokenLines: 0xffffff,
    leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
    rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
    sticks: 0x03b3c3
  }
};

function random(base: number | [number, number]): number {
  if (Array.isArray(base)) {
    return Math.random() * (base[1] - base[0]) + base[0];
  }
  return Math.random() * base;
}

function pickRandom<T>(arr: T | T[]): T {
  if (Array.isArray(arr)) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  return arr;
}

function lerp(current: number, target: number, speed = 0.1, limit = 0.001): number {
  let change = (target - current) * speed;
  if (Math.abs(change) < limit) {
    change = target - current;
  }
  return change;
}

const turbulentUniforms = {
  uFreq: { value: new THREE.Vector4(4, 8, 8, 1) },
  uAmp: { value: new THREE.Vector4(25, 5, 10, 10) }
};

const distortion_vertex = `
  uniform vec4 uFreq;
  uniform vec4 uAmp;
  float nsin(float val){
    return sin(val) * 0.5 + 0.5;
  }
  #define PI 3.14159265358979
  float getDistortionX(float progress){
    return (
      cos(PI * progress * uFreq.r + uTime) * uAmp.r +
      pow(cos(PI * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2. ) * uAmp.g
    );
  }
  float getDistortionY(float progress){
    return (
      -nsin(PI * progress * uFreq.b + uTime) * uAmp.b +
      -pow(nsin(PI * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.) * uAmp.a
    );
  }
  vec3 getDistortion(float progress){
    return vec3(
      getDistortionX(progress) - getDistortionX(0.0125),
      getDistortionY(progress) - getDistortionY(0.0125),
      0.
    );
  }
`;

function nsin(val: number) {
  return Math.sin(val) * 0.5 + 0.5;
}

const getDistortionJS = (progress: number, time: number) => {
  const uFreq = turbulentUniforms.uFreq.value;
  const uAmp = turbulentUniforms.uAmp.value;

  const getX = (p: number) =>
    Math.cos(Math.PI * p * uFreq.x + time) * uAmp.x +
    Math.pow(Math.cos(Math.PI * p * uFreq.y + time * (uFreq.y / uFreq.x)), 2) * uAmp.y;

  const getY = (p: number) =>
    -nsin(Math.PI * p * uFreq.z + time) * uAmp.z -
    Math.pow(nsin(Math.PI * p * uFreq.w + time / (uFreq.z / uFreq.w)), 5) * uAmp.w;

  const distortion = new THREE.Vector3(
    getX(progress) - getX(progress + 0.007),
    getY(progress) - getY(progress + 0.007),
    0
  );
  const lookAtAmp = new THREE.Vector3(-2, -5, 0);
  const lookAtOffset = new THREE.Vector3(0, 0, -10);
  return distortion.multiply(lookAtAmp).add(lookAtOffset);
};

const carLightsFragment = `
  #define USE_FOG;
  ${THREE.ShaderChunk['fog_pars_fragment']}
  varying vec3 vColor;
  varying vec2 vUv;
  uniform vec2 uFade;
  void main() {
    vec3 color = vec3(vColor);
    float alpha = smoothstep(uFade.x, uFade.y, vUv.x);
    gl_FragColor = vec4(color, alpha);
    if (gl_FragColor.a < 0.0001) discard;
    ${THREE.ShaderChunk['fog_fragment']}
  }
`;

const carLightsVertex = `
  #define USE_FOG;
  ${THREE.ShaderChunk['fog_pars_vertex']}
  attribute vec3 aOffset;
  attribute vec3 aMetrics;
  attribute vec3 aColor;
  uniform float uTravelLength;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vColor;
  ${distortion_vertex}
  void main() {
    vec3 transformed = position.xyz;
    float radius = aMetrics.r;
    float myLength = aMetrics.g;
    float speed = aMetrics.b;

    transformed.xy *= radius;
    transformed.z *= myLength;

    transformed.z += myLength - mod(uTime * speed + aOffset.z, uTravelLength);
    transformed.xy += aOffset.xy;

    float progress = abs(transformed.z / uTravelLength);
    transformed.xyz += getDistortion(progress);

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv;
    vColor = aColor;
    ${THREE.ShaderChunk['fog_vertex']}
  }
`;

const sideSticksVertex = `
  #define USE_FOG;
  ${THREE.ShaderChunk['fog_pars_vertex']}
  attribute float aOffset;
  attribute vec3 aColor;
  attribute vec2 aMetrics;
  uniform float uTravelLength;
  uniform float uTime;
  varying vec3 vColor;
  mat4 rotationY( in float angle ) {
    return mat4(
      cos(angle),        0,        sin(angle),    0,
      0,                1.0,    0,            0,
      -sin(angle),        0,        cos(angle),    0,
      0,                 0,        0,            1
    );
  }
  ${distortion_vertex}
  void main(){
    vec3 transformed = position.xyz;
    float width = aMetrics.x;
    float height = aMetrics.y;

    transformed.xy *= vec2(width, height);
    float time = mod(uTime * 60. * 2. + aOffset, uTravelLength);

    transformed = (rotationY(3.14/2.) * vec4(transformed,1.)).xyz;
    transformed.z += - uTravelLength + time;

    float progress = abs(transformed.z / uTravelLength);
    transformed.xyz += getDistortion(progress);

    transformed.y += height / 2.;
    transformed.x += -width / 2.;
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vColor = aColor;
    ${THREE.ShaderChunk['fog_vertex']}
  }
`;

const sideSticksFragment = `
  #define USE_FOG;
  ${THREE.ShaderChunk['fog_pars_fragment']}
  varying vec3 vColor;
  void main(){
    vec3 color = vec3(vColor);
    gl_FragColor = vec4(color,1.);
    ${THREE.ShaderChunk['fog_fragment']}
  }
`;

const roadVertex = `
  #define USE_FOG;
  uniform float uTime;
  ${THREE.ShaderChunk['fog_pars_vertex']}
  uniform float uTravelLength;
  varying vec2 vUv;
  ${distortion_vertex}
  void main() {
    vec3 transformed = position.xyz;
    vec3 distortion = getDistortion((transformed.y + uTravelLength / 2.) / uTravelLength);
    transformed.x += distortion.x;
    transformed.z += distortion.y;
    transformed.y += -1. * distortion.z;

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv;
    ${THREE.ShaderChunk['fog_vertex']}
  }
`;

const islandFragment = `
  #define USE_FOG;
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uTime;
  ${THREE.ShaderChunk['fog_pars_fragment']}
  void main() {
    vec2 uv = vUv;
    vec3 color = vec3(uColor);
    gl_FragColor = vec4(color, 1.);
    ${THREE.ShaderChunk['fog_fragment']}
  }
`;

const roadFragment = `
  #define USE_FOG;
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uLanes;
  uniform vec3 uBrokenLinesColor;
  uniform vec3 uShoulderLinesColor;
  uniform float uShoulderLinesWidthPercentage;
  uniform float uBrokenLinesWidthPercentage;
  uniform float uBrokenLinesLengthPercentage;
  ${THREE.ShaderChunk['fog_pars_fragment']}
  void main() {
    vec2 uv = vUv;
    vec3 color = vec3(uColor);

    uv.y = mod(uv.y + uTime * 0.05, 1.);
    float laneWidth = 1.0 / uLanes;
    float brokenLineWidth = laneWidth * uBrokenLinesWidthPercentage;
    float laneEmptySpace = 1. - uBrokenLinesLengthPercentage;

    float brokenLines = step(1.0 - brokenLineWidth, fract(uv.x * 2.0)) * step(laneEmptySpace, fract(uv.y * 10.0));
    float sideLines = step(1.0 - brokenLineWidth, fract((uv.x - laneWidth * (uLanes - 1.0)) * 2.0)) + step(brokenLineWidth, uv.x);

    brokenLines = mix(brokenLines, sideLines, uv.x);

    gl_FragColor = vec4(color, 1.);
    ${THREE.ShaderChunk['fog_fragment']}
  }
`;

const Hyperspeed: FC<HyperspeedProps> = ({ effectOptions = {} }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const options = { ...defaultOptions, ...effectOptions };

    // Setup
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(options.fov, container.offsetWidth / container.offsetHeight, 0.1, 10000);
    camera.position.set(0, 8, -5);

    const scene = new THREE.Scene();
    scene.background = null;

    const fog = new THREE.Fog(options.colors.background, options.length * 0.2, options.length * 500);
    scene.fog = fog;

    const fogUniforms = {
      fogColor: { value: fog.color },
      fogNear: { value: fog.near },
      fogFar: { value: fog.far }
    };

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new EffectPass(camera, new BloomEffect({ luminanceThreshold: 0.2, luminanceSmoothing: 0, resolutionScale: 1 }));
    const smaaPass = new EffectPass(camera, new SMAAEffect({ preset: SMAAPreset.MEDIUM }));

    renderPass.renderToScreen = false;
    bloomPass.renderToScreen = false;
    smaaPass.renderToScreen = true;

    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(smaaPass);

    // Create road
    const createPlane = (side: number, isRoad: boolean) => {
      const geometry = new THREE.PlaneGeometry(
        isRoad ? options.roadWidth : options.islandWidth,
        options.length,
        20,
        100
      );

      let uniforms: any = {
        uTravelLength: { value: options.length },
        uColor: { value: new THREE.Color(isRoad ? options.colors.roadColor : options.colors.islandColor) },
        uTime: { value: 0 },
        ...fogUniforms,
        ...turbulentUniforms
      };

      if (isRoad) {
        uniforms = {
          ...uniforms,
          uLanes: { value: options.lanesPerRoad },
          uBrokenLinesColor: { value: new THREE.Color(options.colors.brokenLines) },
          uShoulderLinesColor: { value: new THREE.Color(options.colors.shoulderLines) },
          uShoulderLinesWidthPercentage: { value: options.shoulderLinesWidthPercentage },
          uBrokenLinesLengthPercentage: { value: options.brokenLinesLengthPercentage },
          uBrokenLinesWidthPercentage: { value: options.brokenLinesWidthPercentage }
        };
      }

      const material = new THREE.ShaderMaterial({
        fragmentShader: isRoad ? roadFragment : islandFragment,
        vertexShader: roadVertex,
        side: THREE.DoubleSide,
        uniforms
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.z = -options.length / 2;
      mesh.position.x += (options.islandWidth / 2 + options.roadWidth / 2) * side;

      scene.add(mesh);
      return mesh;
    };

    const leftRoad = createPlane(-1, true);
    const rightRoad = createPlane(1, true);
    const island = createPlane(0, false);

    // Create car lights
    const createCarLights = (colors: number[], speed: [number, number], fade: THREE.Vector2, xOffset: number) => {
      const curve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1));
      const geometry = new THREE.TubeGeometry(curve, 40, 1, 8, false);
      const instanced = new THREE.InstancedBufferGeometry().copy(geometry as any);
      instanced.instanceCount = options.lightPairsPerRoadWay * 2;

      const laneWidth = options.roadWidth / options.lanesPerRoad;
      const aOffset: number[] = [];
      const aMetrics: number[] = [];
      const aColor: number[] = [];
      const colorArray = colors.map(c => new THREE.Color(c));

      for (let i = 0; i < options.lightPairsPerRoadWay; i++) {
        const radius = random(options.carLightsRadius);
        const length = random(options.carLightsLength);
        const spd = random(speed);
        const carLane = i % options.lanesPerRoad;
        let laneX = carLane * laneWidth - options.roadWidth / 2 + laneWidth / 2;
        const carWidth = random(options.carWidthPercentage) * laneWidth;
        const carShiftX = random(options.carShiftX) * laneWidth;
        laneX += carShiftX;
        const offsetY = random(options.carFloorSeparation) + radius * 1.3;
        const offsetZ = -random(options.length);

        aOffset.push(laneX - carWidth / 2, offsetY, offsetZ);
        aOffset.push(laneX + carWidth / 2, offsetY, offsetZ);
        aMetrics.push(radius, length, spd, radius, length, spd);

        const color = pickRandom(colorArray);
        aColor.push(color.r, color.g, color.b, color.r, color.g, color.b);
      }

      instanced.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false));
      instanced.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3, false));
      instanced.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false));

      const material = new THREE.ShaderMaterial({
        fragmentShader: carLightsFragment,
        vertexShader: carLightsVertex,
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uTravelLength: { value: options.length },
          uFade: { value: fade },
          ...fogUniforms,
          ...turbulentUniforms
        }
      });

      const mesh = new THREE.Mesh(instanced, material);
      mesh.frustumCulled = false;
      mesh.position.x = xOffset;
      scene.add(mesh);
      return mesh;
    };

    const leftCarLights = createCarLights(
      options.colors.leftCars,
      options.movingAwaySpeed,
      new THREE.Vector2(0, 1 - options.carLightsFade),
      -options.roadWidth / 2 - options.islandWidth / 2
    );

    const rightCarLights = createCarLights(
      options.colors.rightCars,
      options.movingCloserSpeed,
      new THREE.Vector2(1, 0 + options.carLightsFade),
      options.roadWidth / 2 + options.islandWidth / 2
    );

    // Create light sticks
    const createLightSticks = () => {
      const geometry = new THREE.PlaneGeometry(1, 1);
      const instanced = new THREE.InstancedBufferGeometry().copy(geometry as any);
      instanced.instanceCount = options.totalSideLightSticks;

      const stickOffset = options.length / (options.totalSideLightSticks - 1);
      const aOffset: number[] = [];
      const aColor: number[] = [];
      const aMetrics: number[] = [];
      const color = new THREE.Color(options.colors.sticks);

      for (let i = 0; i < options.totalSideLightSticks; i++) {
        const width = random(options.lightStickWidth);
        const height = random(options.lightStickHeight);
        aOffset.push((i - 1) * stickOffset * 2 + stickOffset * Math.random());
        aColor.push(color.r, color.g, color.b);
        aMetrics.push(width, height);
      }

      instanced.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 1, false));
      instanced.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false));
      instanced.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 2, false));

      const material = new THREE.ShaderMaterial({
        fragmentShader: sideSticksFragment,
        vertexShader: sideSticksVertex,
        side: THREE.DoubleSide,
        uniforms: {
          uTravelLength: { value: options.length },
          uTime: { value: 0 },
          ...fogUniforms,
          ...turbulentUniforms
        }
      });

      const mesh = new THREE.Mesh(instanced, material);
      mesh.frustumCulled = false;
      mesh.position.x = -(options.roadWidth + options.islandWidth / 2);
      scene.add(mesh);
      return mesh;
    };

    const lightSticks = createLightSticks();

    // Animation
    const clock = new THREE.Clock();
    let fovTarget = options.fov;
    let speedUpTarget = 0;
    let speedUp = 0;
    let timeOffset = 0;

    const onMouseDown = () => {
      fovTarget = options.fovSpeedUp;
      speedUpTarget = options.speedUp;
    };

    const onMouseUp = () => {
      fovTarget = options.fov;
      speedUpTarget = 0;
    };

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mouseleave', onMouseUp);
    container.addEventListener('touchstart', onMouseDown, { passive: true });
    container.addEventListener('touchend', onMouseUp, { passive: true });

    const onResize = () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      composer.setSize(width, height);
    };

    window.addEventListener('resize', onResize);

    let animationId: number;
    const animate = () => {
      const delta = clock.getDelta();
      const lerpPercentage = Math.exp(-(-60 * Math.log2(1 - 0.1)) * delta);

      speedUp += lerp(speedUp, speedUpTarget, lerpPercentage, 0.00001);
      timeOffset += speedUp * delta;
      const time = clock.elapsedTime + timeOffset;

      // Update uniforms
      (leftRoad.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
      (rightRoad.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
      (island.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
      (leftCarLights.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
      (rightCarLights.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
      (lightSticks.material as THREE.ShaderMaterial).uniforms.uTime.value = time;

      // FOV animation
      const fovChange = lerp(camera.fov, fovTarget, lerpPercentage);
      if (fovChange !== 0) {
        camera.fov += fovChange * delta * 6;
      }

      // Camera look-at
      const distortion = getDistortionJS(0.025, time);
      camera.lookAt(
        new THREE.Vector3(
          camera.position.x + distortion.x,
          camera.position.y + distortion.y,
          camera.position.z + distortion.z
        )
      );
      camera.updateProjectionMatrix();

      composer.render(delta);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    appRef.current = { renderer, scene, composer };

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mouseleave', onMouseUp);
      container.removeEventListener('touchstart', onMouseDown);
      container.removeEventListener('touchend', onMouseUp);
      renderer.dispose();
      composer.dispose();
      scene.clear();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [effectOptions]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default Hyperspeed;

export const hyperspeedPresets = {
  one: {
    onSpeedUp: () => {},
    onSlowDown: () => {},
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5] as [number, number],
    lightStickHeight: [1.3, 1.7] as [number, number],
    movingAwaySpeed: [60, 80] as [number, number],
    movingCloserSpeed: [-120, -160] as [number, number],
    carLightsLength: [400 * 0.03, 400 * 0.2] as [number, number],
    carLightsRadius: [0.05, 0.14] as [number, number],
    carWidthPercentage: [0.3, 0.5] as [number, number],
    carShiftX: [-0.8, 0.8] as [number, number],
    carFloorSeparation: [0, 5] as [number, number],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
      rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
      sticks: 0x03b3c3
    }
  },
  two: {
    onSpeedUp: () => {},
    onSlowDown: () => {},
    distortion: 'mountainDistortion',
    length: 400,
    roadWidth: 9,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 50,
    lightPairsPerRoadWay: 50,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5] as [number, number],
    lightStickHeight: [1.3, 1.7] as [number, number],
    movingAwaySpeed: [60, 80] as [number, number],
    movingCloserSpeed: [-120, -160] as [number, number],
    carLightsLength: [400 * 0.05, 400 * 0.15] as [number, number],
    carLightsRadius: [0.05, 0.14] as [number, number],
    carWidthPercentage: [0.3, 0.5] as [number, number],
    carShiftX: [-0.2, 0.2] as [number, number],
    carFloorSeparation: [0.05, 1] as [number, number],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0xff102a, 0xeb383e, 0xff102a],
      rightCars: [0xdadafa, 0xbebae3, 0x8f97e4],
      sticks: 0xdadafa
    }
  },
  three: {
    onSpeedUp: () => {},
    onSlowDown: () => {},
    distortion: 'xyDistortion',
    length: 400,
    roadWidth: 9,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 3,
    carLightsFade: 0.4,
    totalSideLightSticks: 50,
    lightPairsPerRoadWay: 30,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.02, 0.05] as [number, number],
    lightStickHeight: [0.3, 0.7] as [number, number],
    movingAwaySpeed: [20, 50] as [number, number],
    movingCloserSpeed: [-150, -230] as [number, number],
    carLightsLength: [400 * 0.05, 400 * 0.2] as [number, number],
    carLightsRadius: [0.03, 0.08] as [number, number],
    carWidthPercentage: [0.1, 0.5] as [number, number],
    carShiftX: [-0.5, 0.5] as [number, number],
    carFloorSeparation: [0, 0.1] as [number, number],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0x7d0d1b, 0xa90519, 0xff102a],
      rightCars: [0xf1eece, 0xe6e2b1, 0xdfd98a],
      sticks: 0xf1eece
    }
  },
  four: {
    onSpeedUp: () => {},
    onSlowDown: () => {},
    distortion: 'LongRaceDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 5,
    lanesPerRoad: 2,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 50,
    lightPairsPerRoadWay: 70,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5] as [number, number],
    lightStickHeight: [1.3, 1.7] as [number, number],
    movingAwaySpeed: [60, 80] as [number, number],
    movingCloserSpeed: [-120, -160] as [number, number],
    carLightsLength: [400 * 0.05, 400 * 0.15] as [number, number],
    carLightsRadius: [0.05, 0.14] as [number, number],
    carWidthPercentage: [0.3, 0.5] as [number, number],
    carShiftX: [-0.2, 0.2] as [number, number],
    carFloorSeparation: [0.05, 1] as [number, number],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0xff5f73, 0xe74d60, 0xff102a],
      rightCars: [0xa4e3e6, 0x80d1d4, 0x53c2c6],
      sticks: 0xa4e3e6
    }
  },
  five: {
    onSpeedUp: () => {},
    onSlowDown: () => {},
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 9,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 50,
    lightPairsPerRoadWay: 50,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5] as [number, number],
    lightStickHeight: [1.3, 1.7] as [number, number],
    movingAwaySpeed: [60, 80] as [number, number],
    movingCloserSpeed: [-120, -160] as [number, number],
    carLightsLength: [400 * 0.05, 400 * 0.15] as [number, number],
    carLightsRadius: [0.05, 0.14] as [number, number],
    carWidthPercentage: [0.3, 0.5] as [number, number],
    carShiftX: [-0.2, 0.2] as [number, number],
    carFloorSeparation: [0.05, 1] as [number, number],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0xdc5b20, 0xdca320, 0xdc2020],
      rightCars: [0x334bf7, 0xe5e6ed, 0xbfc6f3],
      sticks: 0xc5e8eb
    }
  },
  six: {
    onSpeedUp: () => {},
    onSlowDown: () => {},
    distortion: 'deepDistortion',
    length: 400,
    roadWidth: 18,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 50,
    lightPairsPerRoadWay: 50,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5] as [number, number],
    lightStickHeight: [1.3, 1.7] as [number, number],
    movingAwaySpeed: [60, 80] as [number, number],
    movingCloserSpeed: [-120, -160] as [number, number],
    carLightsLength: [400 * 0.05, 400 * 0.15] as [number, number],
    carLightsRadius: [0.05, 0.14] as [number, number],
    carWidthPercentage: [0.3, 0.5] as [number, number],
    carShiftX: [-0.2, 0.2] as [number, number],
    carFloorSeparation: [0.05, 1] as [number, number],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0xff322f, 0xa33010, 0xa81508],
      rightCars: [0xfdfdf0, 0xf3dea0, 0xe2bb88],
      sticks: 0xfdfdf0
    }
  },
  // Alias presets for services
  marketing: {
    onSpeedUp: () => {},
    onSlowDown: () => {},
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 50,
    lightPairsPerRoadWay: 50,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5] as [number, number],
    lightStickHeight: [1.3, 1.7] as [number, number],
    movingAwaySpeed: [60, 80] as [number, number],
    movingCloserSpeed: [-120, -160] as [number, number],
    carLightsLength: [400 * 0.05, 400 * 0.15] as [number, number],
    carLightsRadius: [0.05, 0.14] as [number, number],
    carWidthPercentage: [0.3, 0.5] as [number, number],
    carShiftX: [-0.2, 0.2] as [number, number],
    carFloorSeparation: [0.05, 1] as [number, number],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0xff102a, 0xeb383e, 0xff102a],
      rightCars: [0xdadafa, 0xbebae3, 0x8f97e4],
      sticks: 0xdadafa
    }
  },
  appDev: {
    onSpeedUp: () => {},
    onSlowDown: () => {},
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 9,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 85,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 50,
    lightPairsPerRoadWay: 50,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5] as [number, number],
    lightStickHeight: [1.3, 1.7] as [number, number],
    movingAwaySpeed: [60, 80] as [number, number],
    movingCloserSpeed: [-120, -160] as [number, number],
    carLightsLength: [400 * 0.05, 400 * 0.15] as [number, number],
    carLightsRadius: [0.05, 0.14] as [number, number],
    carWidthPercentage: [0.3, 0.5] as [number, number],
    carShiftX: [-0.2, 0.2] as [number, number],
    carFloorSeparation: [0.05, 1] as [number, number],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0x03b3c3, 0x0e5ea5, 0x324555],
      rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
      sticks: 0x03b3c3
    }
  }
};

import React, { useMemo, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { WEATHER_CONFIGS } from '../constants/weather';

/**
 * GPU Vertex Shader Rain Particle System
 * All downward motion and wind slant are calculated in the vertex shader.
 * Zero CPU array iterations and zero buffer re-uploads per frame.
 */
function RainParticles() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isMobile ? 180 : 380;

  const { positions, speeds, offsets } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const off = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 55;
      pos[i * 3 + 1] = Math.random() * 30 - 2.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 55;
      spd[i] = 18 + Math.random() * 10;
      off[i] = Math.random() * 30;
    }
    return { positions: pos, speeds: spd, offsets: off };
  }, [count]);

  const matRef = useRef();

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#93c5fd') },
      uOpacity: { value: 0.65 }
    },
    vertexShader: `
      uniform float uTime;
      attribute float aSpeed;
      attribute float aOffset;
      varying float vAlpha;

      void main() {
        vec3 pos = position;
        float fall = uTime * aSpeed + aOffset;
        float totalH = 30.0;
        pos.y = 27.5 - mod(27.5 - pos.y + fall, totalH);
        
        // Slight wind slant
        pos.x -= mod(fall * 0.08, 55.0) - 27.5;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = max(1.5, 12.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
        vAlpha = smoothstep(-2.5, 0.0, pos.y);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vAlpha;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        if (length(coord) > 0.5) discard;
        gl_FragColor = vec4(uColor, uOpacity * vAlpha);
      }
    `,
    transparent: true,
    depthWrite: false
  }), []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          count={count}
          array={speeds}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          count={count}
          array={offsets}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial ref={matRef} args={[shaderArgs]} />
    </points>
  );
}

/**
 * Atmospheric Environment & Lighting with Smooth Weather Interpolation
 * Lerps sky, lights, and atmospheric colors smoothly over ~1 second.
 */
export function SceneEnvironment({ weather = 'sunny' }) {
  const { scene } = useThree();
  const config = WEATHER_CONFIGS[weather] || WEATHER_CONFIGS.sunny;

  const ambientRef = useRef();
  const hemiRef = useRef();
  const dirLightRef = useRef();
  const fogRef = useRef();

  // Scratch Color instances to avoid per-frame allocations
  const targetSkyColor = useMemo(() => new THREE.Color(), []);
  const targetAmbColor = useMemo(() => new THREE.Color(), []);
  const targetHemiSky = useMemo(() => new THREE.Color(), []);
  const targetHemiGround = useMemo(() => new THREE.Color(), []);
  const targetSunColor = useMemo(() => new THREE.Color(), []);
  const targetFogColor = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const lerpFactor = dt * 2.8; // Smooth 1-second transition

    // 1. Smooth Sky Color Transition
    targetSkyColor.set(config.skyColor);
    if (!scene.background) {
      scene.background = new THREE.Color(config.skyColor);
    } else {
      scene.background.lerp(targetSkyColor, lerpFactor);
    }

    // 2. Smooth Ambient Light
    if (ambientRef.current) {
      targetAmbColor.set(config.ambientColor);
      ambientRef.current.color.lerp(targetAmbColor, lerpFactor);
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        config.ambientIntensity,
        lerpFactor
      );
    }

    // 3. Smooth Hemisphere Light
    if (hemiRef.current) {
      targetHemiSky.set(config.hemiSky);
      targetHemiGround.set(config.hemiGround);
      hemiRef.current.color.lerp(targetHemiSky, lerpFactor);
      hemiRef.current.groundColor.lerp(targetHemiGround, lerpFactor);
      hemiRef.current.intensity = THREE.MathUtils.lerp(
        hemiRef.current.intensity,
        config.hemiIntensity,
        lerpFactor
      );
    }

    // 4. Smooth Directional Sun / Moon
    if (dirLightRef.current) {
      targetSunColor.set(config.sunColor);
      dirLightRef.current.color.lerp(targetSunColor, lerpFactor);
      dirLightRef.current.intensity = THREE.MathUtils.lerp(
        dirLightRef.current.intensity,
        config.sunIntensity,
        lerpFactor
      );

      // Smooth position transition
      dirLightRef.current.position.lerp(
        new THREE.Vector3(...config.sunPosition),
        lerpFactor
      );
    }

    // 5. Smooth Fog
    if (config.fog) {
      if (!scene.fog) {
        scene.fog = new THREE.Fog(config.fog.color, config.fog.near, config.fog.far);
      } else if (scene.fog.isFog) {
        targetFogColor.set(config.fog.color);
        scene.fog.color.lerp(targetFogColor, lerpFactor);
        scene.fog.near = THREE.MathUtils.lerp(scene.fog.near, config.fog.near, lerpFactor);
        scene.fog.far = THREE.MathUtils.lerp(scene.fog.far, config.fog.far, lerpFactor);
      }
    } else {
      // Clear weather: smoothly push fog away then remove
      if (scene.fog && scene.fog.isFog) {
        scene.fog.far = THREE.MathUtils.lerp(scene.fog.far, 300, lerpFactor * 2);
        if (scene.fog.far > 250) {
          scene.fog = null;
        }
      }
    }
  });

  return (
    <>
      {/* Ambient & Hemisphere Lighting */}
      <ambientLight
        ref={ambientRef}
        color={config.ambientColor}
        intensity={config.ambientIntensity}
      />
      <hemisphereLight
        ref={hemiRef}
        skyColor={config.hemiSky}
        groundColor={config.hemiGround}
        intensity={config.hemiIntensity}
      />

      {/* Primary Directional Sunlight / Moonlight */}
      <directionalLight
        ref={dirLightRef}
        position={config.sunPosition}
        color={config.sunColor}
        intensity={config.sunIntensity}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={70}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0004}
      />

      {/* Daylight Golden Motes / Sunset Embers */}
      {config.sparkles && (
        <Sparkles
          count={config.sparkles.count}
          scale={[36, 12, 36]}
          size={config.sparkles.size}
          speed={config.sparkles.speed}
          color={config.sparkles.color}
          opacity={config.sparkles.opacity}
        />
      )}

      {/* Falling Rain Particle System */}
      {config.isRain && <RainParticles />}

      {/* Glowing Night Fireflies */}
      {config.fireflies && (
        <Sparkles
          count={config.fireflies.count}
          scale={[32, 8, 32]}
          position={[0, 0.5, 0]}
          size={config.fireflies.size}
          speed={config.fireflies.speed}
          color={config.fireflies.color}
          opacity={config.fireflies.opacity}
        />
      )}
    </>
  );
}

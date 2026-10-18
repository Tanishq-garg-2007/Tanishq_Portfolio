import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DRACO_URL } from '../constants/config';
import { queryGroundElevation } from '../utils/terrain';
import { useAutonomousMood } from '../hooks/useAutonomousMood';
import { PokemonBadge } from './PokemonBadge';
import { POKEMON_DATA } from '../data/pokemon';

/**
 * Animated Pokemon Companion Component
 * - Autonomous mood cycles with cycle-keyed timers.
 * - Real-time BVH-accelerated terrain clamping.
 * - Smooth deceleration on mood change (eliminates foot sliding).
 * - Smooth hover scale and elevation transitions.
 * - Interactive dialog trigger and camera face tracking.
 */
export function PokemonCompanion({
  config,
  isSelected,
  activePokemon,
  onSelect,
  villageScene,
}) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const { scene, animations } = useGLTF(config.file, DRACO_URL);
  const { actions } = useAnimations(animations, scene);

  const isInteracting = activePokemon === config.id;

  // Autonomous mood cycles and animation cross-fading
  const { isMoving } = useAutonomousMood({
    pokemonId: config.id,
    defaultAnim: config.anim || 'idle',
    isInteracting,
    actions,
  });

  // Path progress, velocity smoothing, and elevation tracking
  const progress = useRef(Math.random());
  const currentGroundY = useRef(config.pos[1] || 0);
  const targetGroundY = useRef(config.pos[1] || 0);
  const speedRef = useRef(0);
  const hoverScaleRef = useRef(1.0);
  const hoverLiftRef = useRef(0.0);
  const lastRaycastTime = useRef(Math.random() * 0.15); // Stagger initial frame checks
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  // Spline path for roaming
  const pathCurve = useMemo(() => {
    if (!config.waypoints || config.waypoints.length < 2) return null;
    const points = config.waypoints.map((wp) => {
      const z = wp.length === 2 ? wp[1] : wp[2];
      return new THREE.Vector3(wp[0], 0, z);
    });
    return new THREE.CatmullRomCurve3(points, true, 'centripetal');
  }, [config.waypoints]);

  // Actual arc length of the path in meters
  const pathLength = useMemo(() => {
    return pathCurve ? pathCurve.getLength() : 10;
  }, [pathCurve]);

  // Model scale calculation and shadow enablement
  const { baseScale } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const targetScale = config.height / (size.y || 1);

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return { baseScale: targetScale };
  }, [scene, config.height]);

  // Initial terrain height calibration
  useEffect(() => {
    if (villageScene) {
      villageScene.updateMatrixWorld(true);
      const groundY = queryGroundElevation(
        raycaster,
        villageScene,
        config.pos[0],
        config.pos[2],
        config.id
      );
      if (groundY !== null && !isNaN(groundY)) {
        currentGroundY.current = groundY;
        targetGroundY.current = groundY;
      }
    }
  }, [villageScene, config.pos, config.id, raycaster]);

  // Frame update: movement along spline path, ground clamping, hover animation, and orientation
  useFrame((state, delta) => {
    if (!groupRef.current || !pathCurve) return;

    // 1. Physically accurate speed in m/s with smooth ease-to-stop (prevents foot-sliding)
    const targetSpeedMps = isMoving ? (config.speed || 1.2) : 0;
    speedRef.current = THREE.MathUtils.damp(speedRef.current, targetSpeedMps, 5.0, delta);

    if (speedRef.current > 0.001) {
      const progressDelta = (speedRef.current / pathLength) * delta;
      progress.current = (progress.current + progressDelta) % 1;
    }

    const worldPos = pathCurve.getPointAt(progress.current);
    const tangent = pathCurve.getTangentAt(progress.current);

    // 2. Throttled & staggered ground raycasting (8 times/sec instead of 60/sec)
    const now = state.clock.elapsedTime;
    if (villageScene && isMoving && now - lastRaycastTime.current > 0.12) {
      lastRaycastTime.current = now;
      const groundY = queryGroundElevation(
        raycaster,
        villageScene,
        worldPos.x,
        worldPos.z,
        config.id,
        targetGroundY.current + 2.5,
        6.0
      );
      if (groundY !== null && !isNaN(groundY)) {
        targetGroundY.current = groundY;
      }
    }

    // Smooth vertical lerping on every frame
    currentGroundY.current = THREE.MathUtils.lerp(
      currentGroundY.current,
      targetGroundY.current,
      0.18
    );

    // 3. Smooth hover scale and elevation lift animation
    const targetHoverScale = isSelected ? 1.05 : (hovered ? 1.08 : 1.0);
    const targetLift = hovered ? 0.16 : 0.0;
    hoverScaleRef.current = THREE.MathUtils.damp(hoverScaleRef.current, targetHoverScale, 10.0, delta);
    hoverLiftRef.current = THREE.MathUtils.damp(hoverLiftRef.current, targetLift, 10.0, delta);

    const effectiveScale = baseScale * hoverScaleRef.current;
    groupRef.current.scale.set(effectiveScale, effectiveScale, effectiveScale);

    // Mew floats gracefully above ground; others stand firmly with feet touching terrain
    const floatBonus = config.id === 'mew' ? 0.35 : 0;
    groupRef.current.position.set(
      worldPos.x,
      currentGroundY.current + floatBonus + hoverLiftRef.current,
      worldPos.z
    );

    // 4. Orientation: Face visitor camera when talking, or face direction of movement
    if (isInteracting) {
      const camPos = state.camera.position;
      const dx = camPos.x - groupRef.current.position.x;
      const dz = camPos.z - groupRef.current.position.z;
      const lookAngle = Math.atan2(dx, dz);

      const diff = THREE.MathUtils.euclideanModulo(
        lookAngle - groupRef.current.rotation.y + Math.PI,
        Math.PI * 2
      ) - Math.PI;
      groupRef.current.rotation.y += diff * Math.min(delta * 5, 1);
    } else if (speedRef.current > 0.05 && tangent.lengthSq() > 0.001) {
      const targetRotY = Math.atan2(tangent.x, tangent.z);
      const diff = THREE.MathUtils.euclideanModulo(
        targetRotY - groupRef.current.rotation.y + Math.PI,
        Math.PI * 2
      ) - Math.PI;
      groupRef.current.rotation.y += diff * Math.min(delta * 6, 1);
    }
  });

  // Cursor pointer on hover
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'default';
  }, [hovered]);

  return (
    <group
      ref={groupRef}
      name={'pokemon-' + config.id}
      rotation={[0, config.rotY || 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(config.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={scene} />

      {/* Floating 3D HTML Name & Role Badge (hidden during close-up dialogue) */}
      <PokemonBadge
        name={config.name}
        icon={config.icon}
        height={config.height}
        hovered={hovered}
        visible={!isSelected && activePokemon !== config.id}
        onClick={() => onSelect(config.id)}
        onHoverChange={setHovered}
      />
    </group>
  );
}

// Preload all companion models for instant zero-lag rendering
Object.values(POKEMON_DATA).forEach((p) => {
  if (p.file) {
    useGLTF.preload(p.file, DRACO_URL);
  }
});

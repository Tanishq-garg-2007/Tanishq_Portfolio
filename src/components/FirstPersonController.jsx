import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { POKEMON_DATA } from '../data/pokemon';
import { queryGroundElevation } from '../utils/terrain';
import { isPositionInWater } from '../constants/config';

// Default spawn location in the village plaza near the bridge
const DEFAULT_SPAWN = [2.5, -1.25, 3.5];
const EYE_HEIGHT = 1.6;
// Calibrated walking and sprinting speeds matching village proportions
const WALK_SPEED = 1.6;
const SPRINT_SPEED = 3.2;

const ENTER_RADIUS = 3.2;
const EXIT_RADIUS = 3.8;

// Reusable scratch vectors outside component to prevent garbage collection
const _vForward = new THREE.Vector3();
const _vRight = new THREE.Vector3();

/**
 * FirstPersonController
 * - Calibrated natural walking speed (1.6 m/s walk, 3.2 m/s sprint).
 * - Smooth exponential damping for mouse look (no packet jitter).
 * - Multi-axis velocity inertia with smooth acceleration/deceleration.
 * - Localized BVH-accelerated terrain checks with canal water avoidance.
 * - Walkable bridge deck & crop fields support.
 * - Clean separation between pointer-lock release and exiting first-person mode.
 * - Keys reset on window blur and pointer lock change (no stuck keys).
 * - Arrow keys prevent default scrolling.
 * - Proximity hysteresis (3.2m enter, 3.8m exit) to prevent edge flickering.
 * - Mobile touch drag support for looking and moving.
 */
export function FirstPersonController({
  spawnPoint,
  villageScene,
  onExitFirstPerson,
  onTalkToPokemon,
  onNearbyPokemonChange,
  onPointerLockStatusChange,
  isDialogueOpen
}) {
  const { camera, gl, scene } = useThree();

  // Lazy position ref to prevent allocating Vector3 on every component render
  const posRef = useRef(null);
  if (!posRef.current) {
    posRef.current = new THREE.Vector3(
      spawnPoint ? spawnPoint[0] : DEFAULT_SPAWN[0],
      (spawnPoint ? spawnPoint[1] : DEFAULT_SPAWN[1]) + EYE_HEIGHT,
      spawnPoint ? spawnPoint[2] : DEFAULT_SPAWN[2]
    );
  }

  // Mouse orientation (target vs smoothed current)
  const targetYawRef = useRef(0);
  const targetPitchRef = useRef(-0.08);
  const currentYawRef = useRef(0);
  const currentPitchRef = useRef(-0.08);

  // Velocity smoothing
  const currentVelRef = useRef({ x: 0, z: 0 });

  // Head bobbing state (timer wrapped at 2PI)
  const bobTimerRef = useRef(0);
  const bobAmountRef = useRef(0);

  // Proximity tracking & hysteresis
  const lastNearbyIdRef = useRef(null);
  const lastProximityCheckRef = useRef(0);

  const keysRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false
  });

  const raycasterRef = useRef(new THREE.Raycaster());
  const isPointerLockedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Touch controls for mobile
  const touchStartPos = useRef({ x: 0, y: 0 });
  const activeTouchIdRef = useRef(null);

  // Reset keys helper
  const resetKeys = () => {
    keysRef.current = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false
    };
  };

  // 1. Initialize camera at spawn point on mount
  useEffect(() => {
    const startPos = spawnPoint || DEFAULT_SPAWN;
    let spawnY = startPos[1] + EYE_HEIGHT;

    // If spawned from default or click, verify with terrain
    const trueGround = queryGroundElevation(
      raycasterRef.current,
      villageScene,
      startPos[0],
      startPos[2],
      null,
      startPos[1] + 3.0,
      10.0
    );
    if (trueGround !== null && !isNaN(trueGround)) {
      spawnY = trueGround + EYE_HEIGHT;
    }

    posRef.current.set(startPos[0], spawnY, startPos[2]);
    camera.position.copy(posRef.current);
    camera.rotation.order = 'YXZ';

    targetYawRef.current = 0;
    targetPitchRef.current = -0.08;
    currentYawRef.current = 0;
    currentPitchRef.current = -0.08;
    currentVelRef.current = { x: 0, z: 0 };
    bobAmountRef.current = 0;
  }, [spawnPoint, villageScene, camera]);

  // 2. Keyboard Event Listeners with preventDefault and key reset on blur
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isDialogueOpen) return;

      // Prevent arrow keys or Space from scrolling the webpage
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysRef.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysRef.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysRef.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysRef.current.right = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keysRef.current.sprint = true;
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysRef.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysRef.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysRef.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysRef.current.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keysRef.current.sprint = false;
          break;
        default:
          break;
      }
    };

    const handleWindowBlur = () => {
      resetKeys();
    };

    const handleMobileMove = (e) => {
      keysRef.current.forward = !!e.detail?.forward;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('fp-mobile-move', handleMobileMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('fp-mobile-move', handleMobileMove);
    };
  }, [isDialogueOpen]);

  // 3. Mouse Look & PointerLock Listeners
  useEffect(() => {
    const domElement = gl.domElement;

    const handlePointerLockChange = () => {
      const isLocked = document.pointerLockElement === domElement;
      isPointerLockedRef.current = isLocked;
      onPointerLockStatusChange?.(isLocked);
      if (!isLocked) {
        resetKeys(); // Clear keys when pointer lock is dropped
      }
    };

    const handleMouseMove = (e) => {
      if (isDialogueOpen) return;

      let dx = 0;
      let dy = 0;

      if (isPointerLockedRef.current) {
        dx = e.movementX;
        dy = e.movementY;
      } else if (isDraggingRef.current) {
        dx = e.clientX - lastMousePosRef.current.x;
        dy = e.clientY - lastMousePosRef.current.y;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      } else {
        return;
      }

      const SENSITIVITY = 0.0022;
      targetYawRef.current -= dx * SENSITIVITY;
      targetPitchRef.current -= dy * SENSITIVITY;

      // Clamp vertical pitch (-80 deg to +80 deg)
      targetPitchRef.current = Math.max(-1.4, Math.min(1.4, targetPitchRef.current));
    };

    const handleMouseDown = (e) => {
      if (isDialogueOpen) return;
      if (e.button === 0) {
        isDraggingRef.current = true;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };

        // Request pointer lock on click
        if (document.pointerLockElement !== domElement) {
          try {
            domElement.requestPointerLock?.();
          } catch (_) { }
        }
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Multi-touch aware camera look for mobile phones
    const handleTouchStart = (e) => {
      if (isDialogueOpen) return;
      if (activeTouchIdRef.current === null && e.changedTouches.length > 0) {
        const t = e.changedTouches[0];
        activeTouchIdRef.current = t.identifier;
        touchStartPos.current = { x: t.clientX, y: t.clientY };
      }
    };

    const handleTouchMove = (e) => {
      if (isDialogueOpen || activeTouchIdRef.current === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === activeTouchIdRef.current) {
          const dx = t.clientX - touchStartPos.current.x;
          const dy = t.clientY - touchStartPos.current.y;
          touchStartPos.current = { x: t.clientX, y: t.clientY };

          const SENSITIVITY = 0.0035;
          targetYawRef.current -= dx * SENSITIVITY;
          targetPitchRef.current -= dy * SENSITIVITY;
          targetPitchRef.current = Math.max(-1.4, Math.min(1.4, targetPitchRef.current));
          break;
        }
      }
    };

    const handleTouchEnd = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === activeTouchIdRef.current) {
          activeTouchIdRef.current = null;
          break;
        }
      }
    };

    // Release pointer lock if dialogue opens
    if (isDialogueOpen && document.pointerLockElement) {
      try {
        document.exitPointerLock?.();
      } catch (_) { }
    }

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    domElement.addEventListener('mousemove', handleMouseMove);
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    domElement.addEventListener('touchmove', handleTouchMove, { passive: true });
    domElement.addEventListener('touchend', handleTouchEnd, { passive: true });
    domElement.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      domElement.removeEventListener('mousemove', handleMouseMove);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('touchstart', handleTouchStart);
      domElement.removeEventListener('touchmove', handleTouchMove);
      domElement.removeEventListener('touchend', handleTouchEnd);
      domElement.removeEventListener('touchcancel', handleTouchEnd);
      if (document.pointerLockElement) {
        try {
          document.exitPointerLock?.();
        } catch (_) { }
      }
    };
  }, [gl, isDialogueOpen, onPointerLockStatusChange]);

  // 4. Per-Frame Physics, Movement & Companion Proximity
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);

    // 4A. Smooth Camera Orientation Damping
    currentYawRef.current = THREE.MathUtils.damp(currentYawRef.current, targetYawRef.current, 28, dt);
    currentPitchRef.current = THREE.MathUtils.damp(currentPitchRef.current, targetPitchRef.current, 28, dt);
    camera.rotation.set(currentPitchRef.current, currentYawRef.current, 0, 'YXZ');

    const currentPos = posRef.current;

    // 4B. Horizontal Movement with Velocity Inertia
    if (!isDialogueOpen) {
      const keys = keysRef.current;
      const targetSpeed = keys.sprint ? SPRINT_SPEED : WALK_SPEED;

      _vForward.set(-Math.sin(currentYawRef.current), 0, -Math.cos(currentYawRef.current));
      _vRight.set(Math.cos(currentYawRef.current), 0, -Math.sin(currentYawRef.current));

      let wishX = 0;
      let wishZ = 0;

      if (keys.forward) {
        wishX += _vForward.x;
        wishZ += _vForward.z;
      }
      if (keys.backward) {
        wishX -= _vForward.x;
        wishZ -= _vForward.z;
      }
      if (keys.right) {
        wishX += _vRight.x;
        wishZ += _vRight.z;
      }
      if (keys.left) {
        wishX -= _vRight.x;
        wishZ -= _vRight.z;
      }

      const wishLen = Math.hypot(wishX, wishZ);
      let targetVx = 0;
      let targetVz = 0;

      if (wishLen > 0.001) {
        targetVx = (wishX / wishLen) * targetSpeed;
        targetVz = (wishZ / wishLen) * targetSpeed;
      }

      currentVelRef.current.x = THREE.MathUtils.damp(currentVelRef.current.x, targetVx, 16, dt);
      currentVelRef.current.z = THREE.MathUtils.damp(currentVelRef.current.z, targetVz, 16, dt);

      const vx = currentVelRef.current.x;
      const vz = currentVelRef.current.z;
      const speed = Math.hypot(vx, vz);

      if (speed > 0.02) {
        const stepX = vx * dt;
        const stepZ = vz * dt;
        const targetX = currentPos.x + stepX;
        const targetZ = currentPos.z + stepZ;
        const currentGround = currentPos.y - EYE_HEIGHT;

        // Localized fast raycast from near the player's waist
        let groundY = queryGroundElevation(
          raycasterRef.current,
          villageScene,
          targetX,
          targetZ,
          null,
          currentGround + 2.0,
          5.0
        );

        if (groundY === null) {
          groundY = queryGroundElevation(
            raycasterRef.current,
            villageScene,
            targetX,
            targetZ,
            null,
            currentGround + 6.0,
            12.0
          );
        }

        // Avoid canal water explicitly without blocking low crop fields
        const isWater = groundY !== null && isPositionInWater(targetX, groundY, targetZ);
        const isWalkable =
          groundY !== null &&
          !isWater &&
          Math.abs(groundY - currentGround) <= 0.85;

        if (isWalkable) {
          currentPos.x = targetX;
          currentPos.z = targetZ;
          currentPos.y = THREE.MathUtils.damp(currentPos.y, groundY + EYE_HEIGHT, 15, dt);
        } else {
          // Axis sliding along X
          const slideX = queryGroundElevation(
            raycasterRef.current,
            villageScene,
            targetX,
            currentPos.z,
            null,
            currentGround + 2.0,
            5.0
          );
          if (slideX !== null && !isPositionInWater(targetX, slideX, currentPos.z) && Math.abs(slideX - currentGround) <= 0.85) {
            currentPos.x = targetX;
            currentPos.y = THREE.MathUtils.damp(currentPos.y, slideX + EYE_HEIGHT, 15, dt);
          } else {
            // Axis sliding along Z
            const slideZ = queryGroundElevation(
              raycasterRef.current,
              villageScene,
              currentPos.x,
              targetZ,
              null,
              currentGround + 2.0,
              5.0
            );
            if (slideZ !== null && !isPositionInWater(currentPos.x, slideZ, targetZ) && Math.abs(slideZ - currentGround) <= 0.85) {
              currentPos.z = targetZ;
              currentPos.y = THREE.MathUtils.damp(currentPos.y, slideZ + EYE_HEIGHT, 15, dt);
            }
          }
        }

        // Head bobbing with speed scaling; wrapped at 2PI
        const targetBobAmount = (keys.sprint ? 0.03 : 0.018) * Math.min(speed / WALK_SPEED, 1.2);
        bobAmountRef.current = THREE.MathUtils.damp(bobAmountRef.current, targetBobAmount, 12, dt);
        bobTimerRef.current = (bobTimerRef.current + dt * (keys.sprint ? 14 : 9.5)) % (Math.PI * 2);
      } else {
        bobAmountRef.current = THREE.MathUtils.damp(bobAmountRef.current, 0, 12, dt);
      }

      const bobOffset = Math.sin(bobTimerRef.current) * bobAmountRef.current;
      camera.position.set(currentPos.x, currentPos.y + bobOffset, currentPos.z);
    } else {
      camera.position.copy(currentPos);
    }

    // 4C. Check Proximity to Pokémon Companions with Hysteresis
    const now = state.clock.elapsedTime;
    if (now - lastProximityCheckRef.current > 0.08) {
      lastProximityCheckRef.current = now;

      let closestCompanion = null;

      // Hysteresis: If we already have a companion nearby, keep it until player exits EXIT_RADIUS (3.8m)
      if (lastNearbyIdRef.current) {
        const curConfig = POKEMON_DATA[lastNearbyIdRef.current];
        if (curConfig) {
          const curObj = scene.getObjectByName('pokemon-' + lastNearbyIdRef.current);
          const px = curObj ? curObj.position.x : curConfig.pos[0];
          const pz = curObj ? curObj.position.z : curConfig.pos[2];
          const curDist = Math.hypot(currentPos.x - px, currentPos.z - pz);

          if (curDist <= EXIT_RADIUS) {
            closestCompanion = {
              id: lastNearbyIdRef.current,
              name: curConfig.name,
              icon: curConfig.icon,
              role: curConfig.role,
              distance: curDist
            };
          }
        }
      }

      // If no current companion or exceeded exit radius, search for nearest within ENTER_RADIUS (3.2m)
      if (!closestCompanion) {
        let minDistance = ENTER_RADIUS;
        for (const [id, config] of Object.entries(POKEMON_DATA)) {
          const obj = scene.getObjectByName('pokemon-' + id);
          const px = obj ? obj.position.x : config.pos[0];
          const pz = obj ? obj.position.z : config.pos[2];

          const dist = Math.hypot(currentPos.x - px, currentPos.z - pz);
          if (dist < minDistance) {
            minDistance = dist;
            closestCompanion = {
              id,
              name: config.name,
              icon: config.icon,
              role: config.role,
              distance: dist
            };
          }
        }
      }

      const newId = closestCompanion ? closestCompanion.id : null;
      if (newId !== lastNearbyIdRef.current) {
        lastNearbyIdRef.current = newId;
        onNearbyPokemonChange?.(closestCompanion);
      }
    }
  });

  return null;
}

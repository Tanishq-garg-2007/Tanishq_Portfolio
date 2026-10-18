import React, { useEffect, useRef } from 'react';
import { CameraControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { POKEMON_DATA } from '../data/pokemon';
import { DEFAULT_OVERVIEW_POS, DEFAULT_OVERVIEW_LOOK } from '../constants/config';

export { DEFAULT_OVERVIEW_POS, DEFAULT_OVERVIEW_LOOK };

/**
 * CameraController
 * Handles silky-smooth camera transitions between village overview and companion focus.
 * When returning from First Person mode, smoothly animates camera back to overview.
 */
export function CameraController({ activePokemon, villageScene }) {
  const controlsRef = useRef();
  const isFirstMount = useRef(true);
  const { camera, scene } = useThree();

  useEffect(() => {
    if (!controlsRef.current) return;

    if (isFirstMount.current) {
      // If camera is already away from overview (e.g. returning from first-person), smoothly animate back
      const currentPos = camera.position;
      const distToOverview = Math.hypot(
        currentPos.x - DEFAULT_OVERVIEW_POS[0],
        currentPos.y - DEFAULT_OVERVIEW_POS[1],
        currentPos.z - DEFAULT_OVERVIEW_POS[2]
      );
      const shouldAnimate = distToOverview > 3;

      controlsRef.current.setLookAt(
        DEFAULT_OVERVIEW_POS[0],
        DEFAULT_OVERVIEW_POS[1],
        DEFAULT_OVERVIEW_POS[2],
        DEFAULT_OVERVIEW_LOOK[0],
        DEFAULT_OVERVIEW_LOOK[1],
        DEFAULT_OVERVIEW_LOOK[2],
        shouldAnimate
      );
      isFirstMount.current = false;
      return;
    }

    const applyCameraFraming = (enableTransition = true) => {
      if (!controlsRef.current) return;

      if (activePokemon && POKEMON_DATA[activePokemon]) {
        const p = POKEMON_DATA[activePokemon];

        // Query real-time position of the Pokemon object in the scene
        const companionObj = scene.getObjectByName('pokemon-' + activePokemon);
        const posX = companionObj ? companionObj.position.x : p.pos[0];
        const posY = companionObj ? companionObj.position.y : p.pos[1];
        const posZ = companionObj ? companionObj.position.z : p.pos[2];

        const isMobilePortrait =
          typeof window !== 'undefined' &&
          window.innerWidth <= 768 &&
          window.innerHeight > window.innerWidth;

        if (isMobilePortrait) {
          // On mobile portrait, the dialogue sheet occupies the bottom 40% of the screen.
          // By applying a proportional parallel downward shift to BOTH target and eye,
          // the companion is cleanly elevated into the upper visible window (top 15%-55% of the screen)
          // while maintaining natural eye-level perspective pitch and avoiding any hiding behind the card.
          const distScale = 1.35;
          const verticalShift = p.height * 0.42 + 0.30;

          const targetLookX = posX;
          const targetLookY = posY + p.height * 0.65 - verticalShift;
          const targetLookZ = posZ;

          const eyeX = posX + p.cameraOffset[0] * distScale;
          const eyeY = posY + p.height * 0.85 + p.cameraOffset[1] * distScale - verticalShift;
          const eyeZ = posZ + p.cameraOffset[2] * distScale;

          controlsRef.current.setLookAt(
            eyeX,
            eyeY,
            eyeZ,
            targetLookX,
            targetLookY,
            targetLookZ,
            enableTransition
          );
        } else {
          // Desktop / Landscape widescreen framing
          const targetLookX = posX;
          const targetLookY = posY + p.height * 0.65;
          const targetLookZ = posZ;

          const eyeX = posX + p.cameraOffset[0];
          const eyeY = posY + p.height * 0.85 + p.cameraOffset[1];
          const eyeZ = posZ + p.cameraOffset[2];

          controlsRef.current.setLookAt(
            eyeX,
            eyeY,
            eyeZ,
            targetLookX,
            targetLookY,
            targetLookZ,
            enableTransition
          );
        }
      } else {
        // Zoom out to full village overview
        controlsRef.current.setLookAt(
          DEFAULT_OVERVIEW_POS[0],
          DEFAULT_OVERVIEW_POS[1],
          DEFAULT_OVERVIEW_POS[2],
          DEFAULT_OVERVIEW_LOOK[0],
          DEFAULT_OVERVIEW_LOOK[1],
          DEFAULT_OVERVIEW_LOOK[2],
          enableTransition
        );
      }
    };

    applyCameraFraming(true);

    const handleResize = () => {
      applyCameraFraming(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activePokemon, scene, villageScene, camera]);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      smoothTime={0.75}
      minDistance={2.5}
      maxDistance={60}
      maxPolarAngle={Math.PI / 2.05}
    />
  );
}

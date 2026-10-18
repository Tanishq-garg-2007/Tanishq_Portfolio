import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { DRACO_URL, isPositionInWater } from '../constants/config';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';

// Attach three-mesh-bvh methods
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

/**
 * Prebuilt Complete Cozy Fantasy Village
 * Loads unified village mesh, plays ambient animations (windmill, waterwheel),
 * computes hierarchical BVH bounds trees for instant raycasting, and validates walkable ground clicks.
 */
export function CozyVillage({ onGroundClick }) {
  const groupRef = useRef();
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const { scene, animations } = useGLTF('/models/village.glb', DRACO_URL);
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    // Play built-in ambient animations (windmill, waterwheel, flags)
    Object.values(actions).forEach((action) => action?.play());
  }, [actions]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        const name = child.name || '';
        const isWaterOrDecal = name.includes('Waterfall') || name.includes('gloss') || name.includes('Book-tittle') || name.includes('deers');
        // Limit shadow casters to key buildings and major architectural structures
        child.castShadow = !isWaterOrDecal && (name.includes('Scene_Texture-base') || name.includes('Mill'));
        child.receiveShadow = true;

        // Compute BVH bounding tree for accelerated raycasting
        if (child.geometry && !child.geometry.boundsTree) {
          try {
            child.geometry.computeBoundsTree();
          } catch (_) {}
        }
      }
    });

    return () => {
      scene.traverse((child) => {
        if (child.isMesh && child.geometry?.boundsTree) {
          try {
            child.geometry.disposeBoundsTree();
          } catch (_) {}
        }
      });
    };
  }, [scene]);

  return (
    <primitive
      ref={groupRef}
      object={scene}
      position={[0, 0, 0]}
      scale={1}
      onPointerDown={(e) => {
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
      }}
      onClick={(e) => {
        if (!onGroundClick || !e.point) return;

        // 1. Prevent accidental ground clicks after dragging/orbiting the camera
        const dragDist = Math.hypot(
          e.clientX - pointerDownPos.current.x,
          e.clientY - pointerDownPos.current.y
        );
        if (dragDist > 6) return; // Dragged more than 6px: was an orbit camera drag!

        // 2. Reject clicks on vertical walls, fences, and cliffs (face normal must point largely upward)
        if (e.face && e.face.normal && e.face.normal.y < 0.6) {
          return;
        }

        // 3. Reject clicks on high roofs, towers, and chimneys (Y > 2.8)
        if (e.point.y > 2.8) {
          return;
        }

        // 4. Reject clicks into the canal water or waterfall mesh
        if (
          isPositionInWater(e.point.x, e.point.y, e.point.z) ||
          e.object?.name?.toLowerCase().includes('waterfall')
        ) {
          return;
        }

        // Valid walkable surface clicked: pass exact [x, y, z]
        onGroundClick([e.point.x, e.point.y, e.point.z]);
      }}
    />
  );
}

useGLTF.preload('/models/village.glb', DRACO_URL);

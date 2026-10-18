import * as THREE from 'three';
import { DOWN_VECTOR, TERRAIN_BOUNDS, isPositionInWater } from '../constants/config';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';

// Attach three-mesh-bvh acceleration prototypes to Three.js
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

/**
 * Accurately filters raycast hits to find the solid walkable surface / terrain:
 * - Bridge walkway deck (Y ≈ 1.4 to 2.8) when within bridge bounds.
 * - Outdoor terrain / courtyard / farm / docks / Jigglypuff's crop fields (Y ≈ -3.0 to +0.45).
 * - Excludes canal water surface (X in [-1.35, 1.35], Y <= -2.4).
 * - Excludes high roofs (Y > 3.0), castle spires, and tree branches.
 *
 * @param {THREE.Intersection[]} hits
 * @param {number} x
 * @param {number} z
 * @param {string|null} pokemonId
 * @returns {number | null} Elevation Y coordinate or null
 */
export function findGroundElevation(hits, x, z, pokemonId) {
  if (!hits || hits.length === 0) return null;

  // 1. Check if on the Arched Wooden Bridge walkway
  const isNearBridge = x >= -2.6 && x <= 2.6 && z >= -0.5 && z <= 9.5;
  if (isNearBridge || pokemonId === 'eevee') {
    const bridgeHit = hits.find(
      (h) => h.point.y >= TERRAIN_BOUNDS.BRIDGE_MIN_Y && h.point.y <= TERRAIN_BOUNDS.BRIDGE_MAX_Y
    );
    if (bridgeHit) return bridgeHit.point.y;
  }

  // 2. Outdoor ground, stone pavement, crop fields, dock:
  // Filters out canal water and high roofs
  const groundHit = hits.find((h) => {
    const y = h.point.y;
    const isWater = isPositionInWater(x, y, z) || h.object?.name?.toLowerCase().includes('waterfall');
    if (isWater) return false;
    return y <= TERRAIN_BOUNDS.GROUND_MAX_Y && y >= TERRAIN_BOUNDS.GROUND_MIN_Y;
  });
  if (groundHit) return groundHit.point.y;

  // 3. Fallback for low stone steps and elevated terraces
  const stepHit = hits.find((h) => {
    const y = h.point.y;
    const isWater = isPositionInWater(x, y, z) || h.object?.name?.toLowerCase().includes('waterfall');
    if (isWater) return false;
    return y <= TERRAIN_BOUNDS.STEP_MAX_Y && y >= -3.5;
  });
  return stepHit ? stepHit.point.y : null;
}

const _rayOrigin = new THREE.Vector3();

/**
 * Casts a ray downward from (x, startRayY, z) through the villageScene and computes ground Y.
 * Uses three-mesh-bvh accelerated raycasting when geometry has bounds trees computed.
 *
 * @param {THREE.Raycaster} raycaster
 * @param {THREE.Object3D} villageScene
 * @param {number} x
 * @param {number} z
 * @param {string|null} [pokemonId=null]
 * @param {number} [startRayY=40]
 * @param {number} [rayFar=80]
 * @returns {number | null}
 */
export function queryGroundElevation(raycaster, villageScene, x, z, pokemonId = null, startRayY = 40, rayFar = 80) {
  if (!villageScene) return null;
  _rayOrigin.set(x, startRayY, z);
  raycaster.set(_rayOrigin, DOWN_VECTOR);
  raycaster.far = rayFar;
  raycaster.firstHitOnly = true; // three-mesh-bvh optimization
  const hits = raycaster.intersectObject(villageScene, true);
  return findGroundElevation(hits, x, z, pokemonId);
}

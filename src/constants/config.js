import * as THREE from 'three';

// Self-hosted Draco decoder (copied from three/examples/jsm/libs/draco/gltf/ into public/draco/)
export const DRACO_URL = '/draco/';

export const DEFAULT_OVERVIEW_POS = [14, 14, 17];
export const DEFAULT_OVERVIEW_LOOK = [0, 0.8, 0];

export const DOWN_VECTOR = new THREE.Vector3(0, -1, 0);

/**
 * Terrain elevation clamping boundaries
 * Calibrated against public/models/village.glb geometry
 */
export const TERRAIN_BOUNDS = {
  // Bridge walkway surface
  BRIDGE_MIN_Y: 1.4,
  BRIDGE_MAX_Y: 2.8,
  // General ground terrain (courtyard, lawn, meadow, farm, docks, crop fields)
  GROUND_MIN_Y: -3.0,
  GROUND_MAX_Y: 0.45,
  // Low stone step fallback
  STEP_MAX_Y: 1.4,
  // Canal water boundary (canal runs along Z between X: -1.35 and 1.35, water surface is Y: -2.66)
  CANAL_X_MIN: -1.35,
  CANAL_X_MAX: 1.35,
  CANAL_WATER_Y: -2.4,
};

/**
 * Checks whether a given (x, y, z) position falls into the deep canal water
 */
export function isPositionInWater(x, y, z) {
  return x >= TERRAIN_BOUNDS.CANAL_X_MIN &&
         x <= TERRAIN_BOUNDS.CANAL_X_MAX &&
         y <= TERRAIN_BOUNDS.CANAL_WATER_Y &&
         z >= -35 && z <= 35;
}

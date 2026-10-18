import React, { Suspense, lazy } from 'react';
import { useGLTF } from '@react-three/drei';
import { POKEMON_DATA } from '../data/pokemon';
import { DRACO_URL } from '../constants/config';
import { SceneEnvironment } from './SceneEnvironment';
import { CozyVillage } from './CozyVillage';
import { PokemonCompanion } from './PokemonCompanion';
import { CameraController } from './CameraController';
import { CompanionErrorBoundary } from './ErrorBoundary';

// Lazy-load FirstPersonController to split bundle size
const FirstPersonController = lazy(() =>
  import('./FirstPersonController').then((m) => ({ default: m.FirstPersonController }))
);

/**
 * 3D Scene Root
 * Composes environment lighting, village world mesh, companion roster with ErrorBoundaries,
 * and dual camera controls (Overview/Third-Person vs First Person POV).
 */
export function Scene({
  activePokemon,
  onSelect,
  povMode,
  firstPersonSpawn,
  onEnterFirstPerson,
  onExitFirstPerson,
  onTalkToPokemon,
  onNearbyPokemonChange,
  onPointerLockStatusChange,
  isDialogueOpen,
  weather = 'sunny'
}) {
  const { scene: villageScene } = useGLTF('/models/village.glb', DRACO_URL);

  return (
    <>
      {/* Lighting, atmospheric skies, and smooth weather interpolation */}
      <SceneEnvironment weather={weather} />

      {/* Prebuilt Complete Fantasy Village with BVH Bounds */}
      <CozyVillage
        onGroundClick={(point) => {
          if (povMode === 'overview' && !activePokemon) {
            onEnterFirstPerson?.(point);
          }
        }}
      />

      {/* Pokemon Companions Roster wrapped in Error Boundaries */}
      {Object.values(POKEMON_DATA).map((config) => (
        <CompanionErrorBoundary key={config.id} id={config.id}>
          <PokemonCompanion
            config={config}
            isSelected={activePokemon === config.id}
            activePokemon={activePokemon}
            onSelect={(id) => {
              if (povMode === 'first_person') {
                onTalkToPokemon?.(id);
              } else {
                onSelect(id);
              }
            }}
            villageScene={villageScene}
          />
        </CompanionErrorBoundary>
      ))}

      {/* Dual Camera Controller: Overview Orbit vs First Person Explorer */}
      {povMode === 'first_person' ? (
        <Suspense fallback={null}>
          <FirstPersonController
            spawnPoint={firstPersonSpawn}
            villageScene={villageScene}
            onExitFirstPerson={onExitFirstPerson}
            onTalkToPokemon={onTalkToPokemon}
            onNearbyPokemonChange={onNearbyPokemonChange}
            onPointerLockStatusChange={onPointerLockStatusChange}
            isDialogueOpen={isDialogueOpen}
          />
        </Suspense>
      ) : (
        <CameraController activePokemon={activePokemon} villageScene={villageScene} />
      )}
    </>
  );
}

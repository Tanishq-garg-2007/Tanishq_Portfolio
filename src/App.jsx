import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { POKEMON_DATA } from './data/pokemon';
import { HeaderNav } from './components/HeaderNav';
import { Scene } from './components/Scene';
import { DialogueModal } from './components/DialogueModal';
import { SidePanel } from './components/SidePanel';
import { CanvasLoader } from './components/CanvasLoader';
import { DEFAULT_OVERVIEW_POS } from './components/CameraController';

/**
 * Root Portfolio Application
 * Brings together the 3D village scene, interactive companions,
 * accessible HUD, responsive navigation, side panel guide, and performance-capped Canvas.
 */
export default function App() {
  const [activePokemon, setActivePokemon] = useState(null);
  const [povMode, setPovMode] = useState('overview'); // 'overview' | 'first_person'
  const [firstPersonSpawn, setFirstPersonSpawn] = useState(null);
  const [nearbyPokemon, setNearbyPokemon] = useState(null);
  const [weather, setWeather] = useState('sunny'); // 'sunny' | 'sunset' | 'rain' | 'night'
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const handleEnterFirstPerson = (point) => {
    setActivePokemon(null);
    setFirstPersonSpawn(point || null);
    setPovMode('first_person');
  };

  const handleExitFirstPerson = () => {
    setPovMode('overview');
    setActivePokemon(null);
  };

  const handleTogglePovMode = () => {
    if (povMode === 'first_person') {
      handleExitFirstPerson();
    } else {
      handleEnterFirstPerson(null);
    }
  };

  // Keyboard shortcut handling:
  // - Closes sidepanel or dialogue on Escape
  // - Separates releasing pointer-lock from exiting first-person mode
  // - E key opens conversation with nearby companion
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isSidePanelOpen) {
          setIsSidePanelOpen(false);
        } else if (activePokemon) {
          setActivePokemon(null);
        } else if (povMode === 'first_person') {
          // If pointer is locked, let the browser release it without leaving first-person mode!
          if (document.pointerLockElement) {
            // Pointer lock release is handled by browser native behavior
            return;
          }
          // Pointer is already free: now exit first-person mode
          handleExitFirstPerson();
        }
      } else if (e.code === 'KeyE') {
        if (povMode === 'first_person' && nearbyPokemon && !activePokemon) {
          setActivePokemon(nearbyPokemon.id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePokemon, povMode, nearbyPokemon, isSidePanelOpen]);

  const activeData = activePokemon ? POKEMON_DATA[activePokemon] : null;

  return (
    <div className={`portfolio-app ${povMode === 'first_person' ? 'is-first-person' : ''} weather-${weather}`}>
      {/* Real-time 3D Asset Loading Screen */}
      <CanvasLoader />

      {/* Top Header Navigation */}
      <HeaderNav
        activePokemon={activePokemon}
        onSelect={setActivePokemon}
        povMode={povMode}
        onTogglePovMode={handleTogglePovMode}
        weather={weather}
        onWeatherChange={setWeather}
        isSidePanelOpen={isSidePanelOpen}
        onToggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
      />

      {/* 3D WebGL Canvas (capped DPR 1.5 to prevent retina GPU lag) */}
      <div id="canvas-container">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: DEFAULT_OVERVIEW_POS, fov: 45 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          onPointerMissed={() => {
            if (activePokemon) setActivePokemon(null);
          }}
        >
          <Scene
            activePokemon={activePokemon}
            onSelect={setActivePokemon}
            povMode={povMode}
            firstPersonSpawn={firstPersonSpawn}
            onEnterFirstPerson={handleEnterFirstPerson}
            onExitFirstPerson={handleExitFirstPerson}
            onTalkToPokemon={(id) => setActivePokemon(id)}
            onNearbyPokemonChange={setNearbyPokemon}
            onPointerLockStatusChange={setIsPointerLocked}
            isDialogueOpen={!!activePokemon}
            weather={weather}
          />
        </Canvas>
      </div>

      {/* First Person POV HUD Overlays */}
      {povMode === 'first_person' && !activePokemon && (
        <div className="fp-hud-container">
          {/* Center Crosshair Dot */}
          <div className="fp-reticle" />

          {/* Click to Look indicator when mouse is unlocked */}
          {!isPointerLocked && (
            <div className="fp-click-to-look-chip">
              <span>🖱️ Click canvas to look around</span>
            </div>
          )}

          {/* Proximity Interaction Prompt */}
          {nearbyPokemon && (
            <button
              type="button"
              className="fp-interact-prompt"
              onClick={() => setActivePokemon(nearbyPokemon.id)}
              aria-label={`Talk with ${nearbyPokemon.name}`}
            >
              <span className="prompt-icon" aria-hidden="true">{nearbyPokemon.icon}</span>
              <span className="prompt-text">
                Tap or Press <strong>[E]</strong> to talk with <strong>{nearbyPokemon.name}</strong>
              </span>
            </button>
          )}

          {/* Mobile On-Screen Hold to Walk Button */}
          <button
            type="button"
            className="fp-mobile-walk-btn"
            onTouchStart={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('fp-mobile-move', { detail: { forward: true } }));
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('fp-mobile-move', { detail: { forward: false } }));
            }}
            onTouchCancel={() => {
              window.dispatchEvent(new CustomEvent('fp-mobile-move', { detail: { forward: false } }));
            }}
            onMouseDown={() => {
              window.dispatchEvent(new CustomEvent('fp-mobile-move', { detail: { forward: true } }));
            }}
            onMouseUp={() => {
              window.dispatchEvent(new CustomEvent('fp-mobile-move', { detail: { forward: false } }));
            }}
            onMouseLeave={() => {
              window.dispatchEvent(new CustomEvent('fp-mobile-move', { detail: { forward: false } }));
            }}
            aria-label="Hold to Walk forward"
          >
            🚶 Hold to Walk
          </button>

          {/* Controls Mini-Bar */}
          <div className="fp-controls-bar">
            <span className="desktop-keys">
              <strong>W A S D</strong> Walk <span className="sep">•</span> <strong>Shift</strong> Sprint <span className="sep">•</span> <strong>Mouse</strong> Look
            </span>
            <span className="mobile-touch-hint">
              👆 Drag: Look • Hold button: Walk
            </span>
            <span className="sep">•</span>
            <button
              type="button"
              className="fp-exit-btn"
              onClick={handleExitFirstPerson}
              title="Return to 3D Overview"
            >
              🗺️ Exit (Esc)
            </button>
          </div>
        </div>
      )}

      {/* SidePanel Guide (Which Pokemon represents what) */}
      <SidePanel
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        onSelect={setActivePokemon}
        activePokemon={activePokemon}
      />

      {/* Interactive Dialogue Modal */}
      <DialogueModal
        activeData={activeData}
        onClose={() => setActivePokemon(null)}
        onSelect={setActivePokemon}
      />
    </div>
  );
}

import React from 'react';
import { useProgress } from '@react-three/drei';

/**
 * Modern glassmorphic loader driven by Drei's useProgress
 * Displays real-time loading percentage and current loaded asset,
 * smoothly fading out once all 3D assets are ready.
 */
export function CanvasLoader() {
  const { active, progress, item } = useProgress();

  if (!active && progress === 100) return null;

  const rounded = Math.round(progress);
  const cleanItemName = item ? item.split('/').pop() : 'assets...';

  return (
    <div className={`canvas-loader-overlay ${!active ? 'fade-out' : ''}`} aria-live="polite">
      <div className="loader-card">
        <div className="loader-icon-ring">
          <span className="loader-pokeball" aria-hidden="true">⚡</span>
        </div>
        <h2 className="loader-title">Entering Pokémon Village Haven</h2>
        <p className="loader-subtitle">Loading 3D world: {cleanItemName}</p>

        <div className="loader-progress-track">
          <div
            className="loader-progress-bar"
            style={{ width: `${rounded}%` }}
          />
        </div>
        <span className="loader-percent">{rounded}%</span>
      </div>
    </div>
  );
}

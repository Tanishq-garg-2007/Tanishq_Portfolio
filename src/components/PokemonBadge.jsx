import React from 'react';
import { Html } from '@react-three/drei';

/**
 * Accessible 3D HTML World Badge hovering above a companion's head
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.icon
 * @param {number} props.height
 * @param {boolean} props.hovered
 * @param {boolean} props.visible
 * @param {() => void} props.onClick
 * @param {(hovered: boolean) => void} props.onHoverChange
 */
export function PokemonBadge({
  name,
  icon,
  height,
  hovered,
  visible,
  onClick,
  onHoverChange,
}) {
  if (!visible) return null;

  return (
    <Html position={[0, height + 0.35, 0]} center distanceFactor={24}>
      <button
        type="button"
        className={`pokemon-world-badge ${hovered ? 'hovered' : ''}`}
        aria-label={`Visit ${name} companion`}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation();
            e.preventDefault();
            onClick();
          }
        }}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        onFocus={() => onHoverChange(true)}
        onBlur={() => onHoverChange(false)}
      >
        <span className="badge-icon" aria-hidden="true">{icon}</span>
        <span className="badge-title">{name}</span>
      </button>
    </Html>
  );
}

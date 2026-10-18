import React, { useRef, useEffect } from 'react';
import { POKEMON_DATA } from '../data/pokemon';
import { RESUME_DATA } from '../constants/resumeConfig';
import { WEATHER_PRESETS } from '../constants/weather';

/**
 * HeaderNav Component
 * Top glassmorphic navigation bar with status dot, brand title, companion pills,
 * mouse-wheel horizontal scrolling, weather switcher, and exploration hints.
 */
export function HeaderNav({
  activePokemon,
  onSelect,
  povMode,
  onTogglePovMode,
  weather = 'sunny',
  onWeatherChange,
  isSidePanelOpen,
  onToggleSidePanel
}) {
  const navRef = useRef(null);

  // Mouse wheel vertical-to-horizontal scrolling support
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Auto-scroll active pokemon nav button smoothly into view
  useEffect(() => {
    if (!activePokemon || !navRef.current) return;
    const activeBtn = navRef.current.querySelector('.nav-btn.active');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activePokemon]);

  return (
    <header className="ui-header">
      {/* Top Main Bar: Brand & Quick Action Controls */}
      <div className="header-main-bar">
        <div className="brand-chip">
          <span className="status-dot" aria-hidden="true"></span>
          <span className="brand-name">{RESUME_DATA.profile.name}'s Haven</span>
        </div>

        <div className="header-actions">
          {/* Weather Switcher Pill Bar */}
          <div className="weather-pill-group" role="group" aria-label="Village Weather Controls">
            {WEATHER_PRESETS.map((w) => (
              <button
                key={w.id}
                type="button"
                className={`weather-pill-btn ${weather === w.id ? 'active' : ''}`}
                onClick={() => onWeatherChange?.(w.id)}
                title={`Change Weather: ${w.label}`}
                aria-label={`Set weather to ${w.label}`}
                aria-pressed={weather === w.id}
              >
                <span className="weather-icon" aria-hidden="true">{w.icon}</span>
                <span className="weather-label">{w.label}</span>
              </button>
            ))}
          </div>

          {/* POV Mode Toggle Button */}
          <button
            type="button"
            className={`pov-toggle-btn ${povMode === 'first_person' ? 'active' : ''}`}
            onClick={onTogglePovMode}
            title={povMode === 'first_person' ? "Return to 3D Overview (Esc)" : "Enter First Person Walking Mode"}
            aria-label={povMode === 'first_person' ? "Exit to 3D Overview" : "Enter First Person Walking Mode"}
          >
            <span aria-hidden="true">{povMode === 'first_person' ? '🗺️' : '🚶'}</span>
            <span className="btn-label">{povMode === 'first_person' ? 'Overview' : 'Walk'}</span>
          </button>

          {/* SidePanel Guide Button: See which Pokemon represents what */}
          <button
            type="button"
            className={`sidepanel-toggle-btn ${isSidePanelOpen ? 'active' : ''}`}
            onClick={onToggleSidePanel}
            title="Open Pokémon Directory & Resume Guide"
            aria-label="Open Pokémon Directory Guide"
            aria-expanded={isSidePanelOpen}
          >
            <span aria-hidden="true">📋</span>
            <span className="btn-label">Guide</span>
          </button>

          {/* 1-Click Direct Resume Button */}
          <a
            href={RESUME_DATA.profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="resume-direct-btn"
            title="View / Download Official Resume (PDF)"
            aria-label="View Official Resume (opens in new tab)"
          >
            <span aria-hidden="true">📄</span>
            <span className="btn-label">Resume</span>
          </a>
        </div>
      </div>

      {/* Pokemon Companion Horizontal Navigator */}
      <nav
        ref={navRef}
        className="pokemon-nav"
        aria-label="Pokémon Companion Navigator"
      >
        {Object.values(POKEMON_DATA).map((p) => (
          <button
            key={p.id}
            type="button"
            className={`nav-btn ${activePokemon === p.id ? 'active' : ''}`}
            onClick={() => onSelect(activePokemon === p.id ? null : p.id)}
            aria-pressed={activePokemon === p.id}
          >
            <span aria-hidden="true">{p.icon}</span> {p.name}
          </button>
        ))}
      </nav>

      <div className="controls-hint">
        <span>
          {povMode === 'first_person'
            ? 'WASD: Walk • Shift: Sprint • Click to Look • [E]: Talk'
            : 'Click ground: Walk • Drag: Orbit • Click Pokémon: Talk'}
        </span>
      </div>
    </header>
  );
}

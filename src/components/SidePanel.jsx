import React, { useEffect } from 'react';
import { POKEMON_DATA } from '../data/pokemon';
import { RESUME_DATA } from '../constants/resumeConfig';

/**
 * SidePanel Component
 * Glassmorphic slide-out drawer displaying all 12 Pokemon companions,
 * what resume section each represents, quick travel links, and 1-click resume access.
 */
export function SidePanel({ isOpen, onClose, onSelect, activePokemon }) {
  // Close drawer on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="sidepanel-overlay" onClick={onClose} aria-modal="true" role="dialog">
      <aside className="sidepanel-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="sidepanel-header">
          <div>
            <h2 className="sidepanel-title">📋 Village Guide & Index</h2>
            <p className="sidepanel-subtitle">Which Pokémon represents what in Tanishq's portfolio</p>
          </div>
          <button
            type="button"
            className="sidepanel-close-btn"
            onClick={onClose}
            aria-label="Close guide"
          >
            &times;
          </button>
        </div>

        {/* 1-Click Direct Resume Action Banner */}
        <div className="sidepanel-resume-banner">
          <div>
            <strong>Official Resume</strong>
            <p>B.Tech IT • IIIT Allahabad • CGPA 8.55</p>
          </div>
          <a
            href={RESUME_DATA.profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sidepanel-resume-btn"
          >
            📄 Open Resume
          </a>
        </div>

        {/* Pokemon Companions Directory */}
        <div className="sidepanel-list" role="list">
          {Object.values(POKEMON_DATA).map((p) => {
            const isSelected = activePokemon === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`sidepanel-card ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  onSelect(p.id);
                  onClose();
                }}
              >
                <div className="sidepanel-card-icon" aria-hidden="true">
                  {p.icon}
                </div>
                <div className="sidepanel-card-content">
                  <div className="sidepanel-card-top">
                    <span className="sidepanel-card-name">{p.name}</span>
                    <span className="sidepanel-card-role">{p.role}</span>
                  </div>
                  <p className="sidepanel-card-desc">
                    {p.speech.slice(0, 85)}...
                  </p>
                </div>
                <span className="sidepanel-card-arrow" aria-hidden="true">→</span>
              </button>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="sidepanel-footer">
          <span>Click any card to fly camera & talk</span>
          <button type="button" className="sidepanel-footer-btn" onClick={onClose}>
            Close Guide
          </button>
        </div>
      </aside>
    </div>
  );
}

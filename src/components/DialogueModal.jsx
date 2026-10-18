import React from 'react';

/**
 * DialogueModal Component
 * Displays glassmorphic dialogue card with Pokemon insights, portfolio showcases,
 * tags, and interactive jump navigation.
 */
export function DialogueModal({ activeData, onClose, onSelect }) {
  if (!activeData) return null;

  return (
    <div className="dialogue-container" onClick={onClose}>
      <div className="dialogue-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="close-btn" onClick={onClose} aria-label="Close dialogue">
          &times;
        </button>

        {/* Character Info */}
        <div className="dialogue-header">
          <div className="character-badge">
            <span className="char-icon">{activeData.icon}</span>
            <div>
              <h3>{activeData.name}</h3>
              <span className="char-role">{activeData.role}</span>
            </div>
          </div>
        </div>

        {/* Dialogue Body */}
        <div className="dialogue-body">
          <p className="speech-text">{activeData.speech}</p>
          <div
            className="custom-content"
            dangerouslySetInnerHTML={{ __html: activeData.contentHtml }}
            onClick={(e) => {
              const target = e.target.closest('[data-jump]');
              if (target) {
                e.preventDefault();
                onSelect(target.dataset.jump);
              }
            }}
          />
        </div>

        {/* Modal Footer */}
        <div className="dialogue-footer">
          <span className="footer-hint">Press [Esc] or click outside to return</span>
          <button className="action-btn" onClick={onClose}>
            Back to Village
          </button>
        </div>
      </div>
    </div>
  );
}

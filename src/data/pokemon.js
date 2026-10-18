import { RESUME_DATA } from '../constants/resumeConfig';

/**
 * POKEMON_DATA
 * Defines 3D navigation paths, speeds (m/s), heights, animations,
 * and portfolio speech/content dynamically driven by RESUME_DATA and .env.
 */
export const POKEMON_DATA = {
  // --- 🌬️ WINDMILL HILLTOP: Pikachu (About Me & Overview) ---
  pikachu: {
    id: 'pikachu',
    name: 'Pikachu',
    icon: '⚡',
    role: RESUME_DATA.pikachu.role,
    file: '/models/pikachu.glb',
    anim: 'walk',
    speed: 1.4, // m/s
    height: 1.35,
    pos: [-25.0, -1.50, 18.0],
    waypoints: [
      [-25.0, -1.50, 18.0],
      [-27.5, -1.99, 19.5],
      [-29.0, -2.30, 21.5],
      [-28.0, -2.09, 23.0],
      [-25.5, -1.60, 22.0],
      [-24.0, -1.31, 19.5]
    ],
    cameraOffset: [2.2, 0.8, 2.8],
    speech: RESUME_DATA.pikachu.speech,
    contentHtml: `
      <div class="resume-stat-banner">
        <span class="resume-stat-badge">🎓 ${RESUME_DATA.profile.college}</span>
        <span class="resume-stat-badge">⭐ CGPA: ${RESUME_DATA.profile.cgpa}</span>
      </div>
      <div class="tag-list">
        ${RESUME_DATA.pikachu.tags.map((t) => `<span class="pill-tag">${t}</span>`).join('')}
      </div>
      <div class="resume-section-heading">Explore Village Companions</div>
      <div class="portfolio-link-grid">
        <button type="button" class="link-card" data-jump="dragonite">🐉 Edge VLM (Castle)</button>
        <button type="button" class="link-card" data-jump="squirtle">💧 LeetCode Knight (Canal)</button>
        <button type="button" class="link-card" data-jump="bulbasaur">🌿 AI/ML Tools (Farm)</button>
        <button type="button" class="link-card" data-jump="psyduck">🌊 Connect (Pier)</button>
      </div>
    `
  },

  // --- 🏰 CASTLE CITADEL: Dragonite (Project 1: Edge VLM & Knowledge Graph) ---
  dragonite: {
    id: 'dragonite',
    name: 'Dragonite',
    icon: '🐉',
    role: 'Project 1: Edge VLM & KG',
    file: '/models/dragonite.glb',
    anim: 'happy',
    speed: 1.1, // m/s
    height: 2.3,
    pos: [-20.5, -0.06, -26.6],
    waypoints: [
      [-20.5, -0.06, -26.6],
      [-22.8, -0.11, -27.0],
      [-22.8, -0.15, -28.6],
      [-21.0, -0.12, -29.2],
      [-19.4, 0.02, -28.6],
      [-19.0, -0.03, -27.0]
    ],
    cameraOffset: [-1.8, 1.2, -3.2],
    speech: RESUME_DATA.dragonite.speech,
    contentHtml: `
      <div class="resume-project-header">
        <span class="resume-project-title">${RESUME_DATA.dragonite.name}</span>
        <span class="resume-project-date">${RESUME_DATA.dragonite.date}</span>
      </div>
      <div class="resume-project-subtitle">${RESUME_DATA.dragonite.subtitle} • Advisor: ${RESUME_DATA.dragonite.advisor}</div>
      <div class="resume-metric-grid">
        ${RESUME_DATA.dragonite.metrics.map((m) => `<div class="resume-metric-box">${m}</div>`).join('')}
      </div>
      <ul class="resume-bullet-list">
        ${RESUME_DATA.dragonite.bullets.map((b) => `<li>${b}</li>`).join('')}
      </ul>
    `
  },

  // --- 🏰 CASTLE SHADOW: Gengar (Project 2: IoT Security & RAG Pipeline) ---
  gengar: {
    id: 'gengar',
    name: 'Gengar',
    icon: '👻',
    role: 'Project 2: Security & RAG',
    file: '/models/gengar.glb',
    anim: 'attack',
    speed: 1.3, // m/s
    height: 1.55,
    pos: [-16.5, -0.20, -11.5],
    waypoints: [
      [-16.5, -0.20, -11.5],
      [-14.5, -0.20, -12.0],
      [-14.0, -0.20, -14.5],
      [-16.5, -0.20, -15.0],
      [-18.0, -0.20, -13.5]
    ],
    cameraOffset: [2.2, 0.9, 2.6],
    speech: RESUME_DATA.gengar.speech,
    contentHtml: `
      <div class="resume-project-header">
        <span class="resume-project-title">${RESUME_DATA.gengar.name}</span>
        <span class="resume-project-date">${RESUME_DATA.gengar.date}</span>
      </div>
      <div class="resume-project-subtitle">${RESUME_DATA.gengar.subtitle} • Advisor: ${RESUME_DATA.gengar.advisor}</div>
      <div class="resume-metric-grid">
        ${RESUME_DATA.gengar.metrics.map((m) => `<div class="resume-metric-box">${m}</div>`).join('')}
      </div>
      <ul class="resume-bullet-list">
        ${RESUME_DATA.gengar.bullets.map((b) => `<li>${b}</li>`).join('')}
      </ul>
    `
  },

  // --- 🦊 RIVERSIDE LAWN & BOAT: Eevee (Project 3: LearnNexus) ---
  eevee: {
    id: 'eevee',
    name: 'Eevee',
    icon: '🦊',
    role: 'Project 3: LearnNexus',
    file: '/models/eevee.glb',
    anim: 'walk',
    speed: 1.4, // m/s
    height: 1.25,
    pos: [1.8, -1.39, -13.0],
    waypoints: [
      [1.8, -1.39, -13.0],
      [2.2, -0.19, -15.5],
      [4.2, -0.09, -16.0],
      [5.2, 0.00, -13.8],
      [4.8, -0.02, -12.5],
      [3.0, -0.59, -12.2],
      [1.8, -1.39, -12.5]
    ],
    cameraOffset: [-1.8, 0.9, 2.5],
    speech: RESUME_DATA.eevee.speech,
    contentHtml: `
      <div class="resume-project-header">
        <span class="resume-project-title">${RESUME_DATA.eevee.name}</span>
        <span class="resume-project-date">${RESUME_DATA.eevee.date}</span>
      </div>
      <div class="resume-project-subtitle">${RESUME_DATA.eevee.subtitle}</div>
      <div class="resume-metric-grid">
        ${RESUME_DATA.eevee.metrics.map((m) => `<div class="resume-metric-box">${m}</div>`).join('')}
      </div>
      <ul class="resume-bullet-list">
        ${RESUME_DATA.eevee.bullets.map((b) => `<li>${b}</li>`).join('')}
      </ul>
      <div class="portfolio-link-grid" style="margin-top: 10px;">
        <a href="${RESUME_DATA.eevee.githubUrl}" target="_blank" rel="noopener noreferrer" class="link-card">🐙 GitHub Repo</a>
        <a href="${RESUME_DATA.eevee.liveUrl}" target="_blank" rel="noopener noreferrer" class="link-card">🚀 Live Demo</a>
      </div>
    `
  },

  // --- 🌾 FARM GARDEN: Bulbasaur (Skills: AI/ML & Agent Frameworks) ---
  bulbasaur: {
    id: 'bulbasaur',
    name: 'Bulbasaur',
    icon: '🌿',
    role: RESUME_DATA.bulbasaur.role,
    file: '/models/bulbasaur.glb',
    anim: 'walk',
    speed: 1.2, // m/s
    height: 1.35,
    pos: [14.5, -0.97, -2.5],
    waypoints: [
      [14.5, -0.97, -2.5],
      [17.0, -1.50, -2.5],
      [18.5, -1.84, -0.5],
      [18.5, -0.81, 2.0],
      [16.0, -1.29, 2.0],
      [14.5, -0.97, 0.0]
    ],
    cameraOffset: [-2.0, 0.8, 2.6],
    speech: RESUME_DATA.bulbasaur.speech,
    contentHtml: `
      <div class="tag-list">
        ${RESUME_DATA.bulbasaur.skills.map((s) => `<span class="pill-tag">${s}</span>`).join('')}
      </div>
      <p style="margin-top: 12px; font-size: 0.88rem; color: #cbd5e1; line-height: 1.55;">
        ${RESUME_DATA.bulbasaur.desc}
      </p>
    `
  },

  // --- 🔥 FARM BARN COURTYARD: Charmander (Tech Stack: Backend & Languages) ---
  charmander: {
    id: 'charmander',
    name: 'Charmander',
    icon: '🔥',
    role: RESUME_DATA.charmander.role,
    file: '/models/charmander.glb',
    anim: 'happy',
    speed: 1.3, // m/s
    height: 1.4,
    pos: [12.5, -0.56, -4.5],
    waypoints: [
      [12.5, -0.56, -4.5],
      [15.5, -1.19, -4.5],
      [16.0, -1.30, -6.5],
      [14.5, -0.98, -7.8],
      [12.5, -0.56, -6.5]
    ],
    cameraOffset: [-2.0, 0.8, 2.6],
    speech: RESUME_DATA.charmander.speech,
    contentHtml: `
      <div class="resume-section-heading">Languages</div>
      <div class="tag-list">
        ${RESUME_DATA.charmander.languages.map((l) => `<span class="pill-tag">${l}</span>`).join('')}
      </div>
      <div class="resume-section-heading">Backend & APIs</div>
      <div class="tag-list">
        ${RESUME_DATA.charmander.backend.map((b) => `<span class="pill-tag">${b}</span>`).join('')}
      </div>
      <div class="resume-section-heading">Frontend & 3D</div>
      <div class="tag-list">
        ${RESUME_DATA.charmander.frontend.map((f) => `<span class="pill-tag">${f}</span>`).join('')}
      </div>
      <div class="resume-section-heading">Databases & Storage</div>
      <div class="tag-list">
        ${RESUME_DATA.charmander.databases.map((d) => `<span class="pill-tag">${d}</span>`).join('')}
      </div>
    `
  },

  // --- 🪙 SHEEP PASTURE: Meowth (Achievements & Honors) ---
  meowth: {
    id: 'meowth',
    name: 'Meowth',
    icon: '🪙',
    role: RESUME_DATA.meowth.role,
    file: '/models/meowth.glb',
    anim: 'walk',
    speed: 1.3, // m/s
    height: 1.45,
    pos: [11.5, -0.31, 7.8],
    waypoints: [
      [11.5, -0.31, 7.8],
      [13.8, -0.82, 8.2],
      [14.6, -0.98, 10.6],
      [13.6, -0.77, 12.6],
      [11.8, -0.43, 12.2],
      [10.6, -0.21, 10.0]
    ],
    cameraOffset: [-1.8, 0.8, 2.4],
    speech: RESUME_DATA.meowth.speech,
    contentHtml: `
      <ul class="resume-bullet-list">
        ${RESUME_DATA.meowth.achievements.map((a) => `<li>${a}</li>`).join('')}
      </ul>
    `
  },

  // --- 🌲 DEER MEADOW PINES: Snorlax (Hobbies & Philosophy) ---
  snorlax: {
    id: 'snorlax',
    name: 'Snorlax',
    icon: '💤',
    role: RESUME_DATA.snorlax.role,
    file: '/models/snorlax.glb',
    anim: 'sleep',
    speed: 0.8, // m/s
    height: 2.2,
    pos: [-18.5, -0.43, 11.5],
    waypoints: [
      [-18.5, -0.43, 11.5],
      [-15.5, -0.17, 11.0],
      [-14.0, -0.33, 12.5],
      [-15.5, -0.17, 13.5],
      [-18.0, -0.38, 13.5]
    ],
    cameraOffset: [3.0, 1.2, 3.0],
    speech: RESUME_DATA.snorlax.speech,
    contentHtml: `
      <div class="resume-section-heading">When Not Coding</div>
      <ul class="resume-bullet-list">
        ${RESUME_DATA.snorlax.hobbies.map((h) => `<li>${h}</li>`).join('')}
      </ul>
      <p style="margin-top: 14px; font-style: italic; font-size: 0.86rem; color: #94a3b8; border-left: 2px solid #38bdf8; padding-left: 10px;">
        "${RESUME_DATA.snorlax.quote}"
      </p>
    `
  },

  // --- ✨ MYSTIC GROVE: Mew (Project 4: Civic Sync) ---
  mew: {
    id: 'mew',
    name: 'Mew',
    icon: '✨',
    role: 'Project 4: Civic Sync',
    file: '/models/mew.glb',
    anim: 'run',
    speed: 2.5, // m/s
    height: 1.2,
    pos: [-13.5, -0.34, 1.5],
    waypoints: [
      [-13.5, -0.34, 1.5],
      [-15.5, 0.02, 2.5],
      [-17.0, -0.30, 4.5],
      [-15.5, -0.17, 5.5],
      [-13.5, -0.34, 4.0]
    ],
    cameraOffset: [2.0, 0.8, 2.5],
    speech: RESUME_DATA.mew.speech,
    contentHtml: `
      <div class="resume-project-header">
        <span class="resume-project-title">${RESUME_DATA.mew.name}</span>
        <span class="resume-project-date">${RESUME_DATA.mew.date}</span>
      </div>
      <div class="resume-project-subtitle">${RESUME_DATA.mew.subtitle}</div>
      <div class="resume-metric-grid">
        ${RESUME_DATA.mew.metrics.map((m) => `<div class="resume-metric-box">${m}</div>`).join('')}
      </div>
      <ul class="resume-bullet-list">
        ${RESUME_DATA.mew.bullets.map((b) => `<li>${b}</li>`).join('')}
      </ul>
      <div class="portfolio-link-grid" style="margin-top: 10px;">
        <a href="${RESUME_DATA.mew.githubUrl}" target="_blank" rel="noopener noreferrer" class="link-card">🐙 GitHub Repo</a>
        <a href="${RESUME_DATA.mew.liveUrl}" target="_blank" rel="noopener noreferrer" class="link-card">🚀 Live Demo</a>
      </div>
    `
  },

  // --- 🌊 RIVER PIER: Psyduck (Connect & Inquiries) ---
  psyduck: {
    id: 'psyduck',
    name: 'Psyduck',
    icon: '🌊',
    role: RESUME_DATA.psyduck.role,
    file: '/models/psyduck.glb',
    anim: 'idle',
    speed: 0.9, // m/s
    height: 1.35,
    pos: [0.35, -1.61, 15.6],
    waypoints: [
      [0.35, -1.61, 15.6],
      [0.45, -1.54, 17.8],
      [0.55, -1.51, 20.0],
      [1.20, -1.23, 21.8],
      [2.20, -0.97, 22.4],
      [1.60, -1.09, 22.8],
      [0.60, -1.50, 21.2],
      [0.35, -1.59, 18.5]
    ],
    cameraOffset: [1.2, 0.9, 2.5],
    speech: RESUME_DATA.psyduck.speech,
    contentHtml: `
      <div class="contact-channels-wrapper">
        <!-- Primary Direct Email Action Banner -->
        <a href="mailto:${RESUME_DATA.psyduck.email}" class="contact-email-banner" title="Click to send email to ${RESUME_DATA.psyduck.email}">
          <div class="contact-email-left">
            <div class="contact-email-icon" aria-hidden="true">✉️</div>
            <div class="contact-email-text">
              <span class="contact-email-tag">Official Email</span>
              <span class="contact-email-val">${RESUME_DATA.psyduck.email}</span>
            </div>
          </div>
          <span class="contact-email-cta">Send Mail ↗</span>
        </a>

        <!-- Secondary Contacts (Clean 2x2 Grid) -->
        <div class="contact-subgrid">
          <a href="tel:${RESUME_DATA.psyduck.phone.replace(/[^0-9+]/g, '')}" class="link-card contact-pill-card" title="Call ${RESUME_DATA.psyduck.phone}">
            <span class="contact-pill-icon" aria-hidden="true">📞</span>
            <span class="contact-pill-text">${RESUME_DATA.psyduck.phone}</span>
          </a>
          <a href="${RESUME_DATA.psyduck.githubUrl}" target="_blank" rel="noopener noreferrer" class="link-card contact-pill-card" title="Visit GitHub Profile">
            <span class="contact-pill-icon" aria-hidden="true">🐙</span>
            <span class="contact-pill-text">GitHub Profile</span>
          </a>
          <a href="${RESUME_DATA.psyduck.linkedinUrl}" target="_blank" rel="noopener noreferrer" class="link-card contact-pill-card" title="Visit LinkedIn Profile">
            <span class="contact-pill-icon" aria-hidden="true">💼</span>
            <span class="contact-pill-text">LinkedIn Profile</span>
          </a>
          <a href="${RESUME_DATA.psyduck.resumeUrl}" target="_blank" rel="noopener noreferrer" class="link-card contact-pill-card contact-resume-card" title="Download Official Resume (PDF)">
            <span class="contact-pill-icon" aria-hidden="true">📄</span>
            <span class="contact-pill-text">Resume (PDF)</span>
          </a>
        </div>
      </div>
    `
  },

  // --- 💧 CANAL PROMENADE: Squirtle (DSA & Problem Solving) ---
  squirtle: {
    id: 'squirtle',
    name: 'Squirtle',
    icon: '💧',
    role: RESUME_DATA.squirtle.role,
    file: '/models/squirtle.glb',
    anim: 'walk',
    speed: 1.1, // m/s
    height: 1.3,
    pos: [1.5, -1.58, 2.0],
    waypoints: [
      [1.5, -1.58, 2.0],
      [1.5, -1.58, 4.0],
      [1.5, -1.58, 6.0],
      [1.5, -1.56, 7.5],
      [1.5, -1.58, 5.0],
      [1.5, -1.58, 3.0]
    ],
    cameraOffset: [-2.0, 0.8, 2.6],
    speech: RESUME_DATA.squirtle.speech,
    contentHtml: `
      <div class="resume-stat-banner">
        <span class="resume-stat-badge">⚔️ LeetCode ${RESUME_DATA.squirtle.rank} (${RESUME_DATA.squirtle.rating})</span>
        <span class="resume-stat-badge">🧩 ${RESUME_DATA.squirtle.solved}</span>
        <span class="resume-stat-badge">🔥 ${RESUME_DATA.squirtle.streak}</span>
        <span class="resume-stat-badge">🏅 ${RESUME_DATA.squirtle.badges}</span>
      </div>
      <div class="resume-section-heading">Topics & Strengths (${RESUME_DATA.squirtle.lang})</div>
      <div class="tag-list">
        ${RESUME_DATA.squirtle.tags.map((t) => `<span class="pill-tag">${t}</span>`).join('')}
      </div>
    `
  },

  // --- 🎤 AGRICULTURAL FIELDS: Jigglypuff (Education & Academics) ---
  jigglypuff: {
    id: 'jigglypuff',
    name: 'Jigglypuff',
    icon: '🎤',
    role: RESUME_DATA.jigglypuff.role,
    file: '/models/jigglypuff.glb',
    anim: 'happy',
    speed: 1.1, // m/s
    height: 1.3,
    pos: [19.8, -1.97, 2.5],
    waypoints: [
      [19.8, -1.97, 2.5],
      [22.8, -2.70, 3.0],
      [23.5, -2.78, 5.8],
      [22.5, -2.66, 8.5],
      [20.0, -2.01, 8.0],
      [19.2, -1.99, 5.2]
    ],
    cameraOffset: [-2.2, 1.2, 2.4],
    speech: RESUME_DATA.jigglypuff.speech,
    contentHtml: `
      <div class="resume-stat-banner">
        <span class="resume-stat-badge">🏛️ ${RESUME_DATA.jigglypuff.college}</span>
      </div>
      <div style="background: rgba(255,255,255,0.06); padding: 10px 14px; border-radius: 10px; margin-bottom: 8px;">
        <div style="color: #38bdf8; font-weight: 700; font-size: 0.95rem;">${RESUME_DATA.jigglypuff.degree}</div>
        <div style="color: #fde68a; font-weight: 600; font-size: 0.85rem; margin-top: 2px;">⭐ ${RESUME_DATA.jigglypuff.cgpa}</div>
      </div>
      <div style="background: rgba(255,255,255,0.04); padding: 8px 14px; border-radius: 10px; margin-bottom: 10px;">
        <div style="color: #cbd5e1; font-size: 0.88rem; font-weight: 600;">${RESUME_DATA.jigglypuff.school}</div>
        <div style="color: #94a3b8; font-size: 0.8rem; margin-top: 2px;">${RESUME_DATA.jigglypuff.schoolScore}</div>
      </div>
      <div class="resume-section-heading">Core Computer Science Coursework</div>
      <div class="tag-list">
        ${RESUME_DATA.jigglypuff.coursework.map((c) => `<span class="pill-tag">${c}</span>`).join('')}
      </div>
    `
  }
};

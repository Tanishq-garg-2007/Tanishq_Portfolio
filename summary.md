# 🌸 Pokémon 3D Haven Portfolio — Project Summary

A relaxing, interactive 3D portfolio experience built with **React 19**, **Three.js**, **React Three Fiber (@react-three/fiber)**, **Drei (@react-three/drei)**, **three-mesh-bvh**, and **Vite**.

Visitors explore a cozy fantasy village diorama populated by **12 autonomous, animated Pokémon companions**, each representing different facets of engineering expertise, featured projects, and contact channels.

---

## 🗺️ 1. Core World & Environment

- **Prebuilt Fantasy Village (`public/models/village.glb`)**:
  - Open-book diorama featuring a stone castle citadel, watermill with turning waterwheel, windmill with rotating blades, flowing waterfall canal, covered stone bridge, and an organic farm with crop rows and barn.
  - Active ambient animations (`Mill-wind-wheel`, `Mill-water-wheel`, waving castle flags).
  - Spatial tree acceleration via `three-mesh-bvh` for $O(\log N)$ instant raycasting across 55,000 triangles.
- **Atmospheric Lighting & FX ([SceneEnvironment.jsx](file:///src/components/SceneEnvironment.jsx))**:
  - 4 dynamic weather presets (`☀️ Sunny`, `🌅 Sunset`, `🌧️ Rain`, `🌙 Night`) with 1-second smooth interpolation.
  - Clear sunny daylight sky `#58a6ff` with warm golden sunlight (`intensity: 2.6`) and zero whitish fog.
  - 70 golden ambient dust motes in sunny daylight (`<Sparkles />`).
  - GPU-driven rainfall particle system in rain mode; glowing luminescent fireflies in night mode.

---

## 🐾 2. The 12 Pokémon Companions & Portfolio Distribution

Every companion is strategically placed in a matching thematic district of the village with calibrated patrol paths:

| Companion | District & Territory | Path Circuit | Speed (m/s) | Portfolio Focus (Configurable via `.env`) | Model & Rigged Clips |
| :--- | :--- | :--- | :--- | :--- | :--- |
| ⚡ **Pikachu** | Windmill Hill Base & Lookout ($Y = -1.50$) | **15.1m** loop | 1.4 m/s | **About Me & Welcome** (IIIT Allahabad, CGPA 8.55) | `attack`, `happy`, `idle`, `run`, `sleep`, `walk` |
| 🐉 **Dragonite** | Northern Terrace behind Castle Citadel ($Y = -0.06$) | **11.1m** loop | 1.1 m/s | **Project 1: Edge VLM & KG** (SmolVLM, RPi 5, Prof. Bibhas Ghoshal) | `attack`, `happy`, `idle`, `run`, `sleep`, `walk` |
| 👻 **Gengar** | Castle Inner Wall Shadows ($Y = -0.20$) | **12.3m** loop | 1.3 m/s | **Project 2: Security & RAG** (C3iHub IIT Kanpur, Qwen3.5:0.8B) | `attack`, `happy`, `idle`, `run`, `sleep`, `walk` |
| 🦊 **Eevee** | Riverside Lawn beside Wooden Boat ($Y = -1.39$) | **12.25m** loop | 1.4 m/s | **Project 3: LearnNexus** (CrewAI, Groq, ChromaDB, FastAPI) | `attack`, `happy`, `idle`, `run`, `sleep`, `walk` |
| 🌿 **Bulbasaur** | Deep Organic Farm Crop Furrows ($Y = -0.97$) | **15.5m** loop | 1.2 m/s | **AI/ML & Agent Frameworks** (CrewAI, MCP, Ollama, Unsloth) | `attack`, `happy`, `idle`, `run`, `sleep`, `walk` |
| 🔥 **Charmander** | Farmhouse Barn & Pasture Courtyard ($Y = -0.56$) | **11.9m** loop | 1.3 m/s | **Languages & Tech Stack** (C, C++, Python, FastAPI, React) | `attack`, `happy`, `idle`, `run`, `sleep`, `walk` |
| 🪙 **Meowth** | Farm Sheep Meadow & Pond Pasture ($Y = -0.31$) | **14.4m** loop | 1.3 m/s | **Achievements & Honors** (Top 10 Suvidha, LeetCode Knight, JEE) | `attack`, `happy`, `idle`, `run`, `sleep`, `walk` |
| 💤 **Snorlax** | Pine Tree Deer Meadow Grass ($Y = -0.43$) | **12.0m** stroll | 0.8 m/s | **Hobbies & Philosophy** (Raspberry Pi, AI Papers, Contests) | `attack`, `happy`, `idle`, `run`, `sleep`, `walk` |
| ✨ **Mew** | Meadow Pathway South of Castle (Floats at $Y = 0.01$) | **11.9m** glide | 2.5 m/s | **Project 4: Civic Sync** (Sarvam Voice AI, 13 Modules, Multilingual) | `attack`, `happy`, `idle`, `run`, `sleep`, `walk` |
| 🌊 **Psyduck** | Wooden Bridge Landing & Waterside Quay ($Y = -1.61$) | **16.0m** loop | 0.9 m/s | **Contact & Resume** (Email, Phone, GitHub, LinkedIn, PDF) | `attack`, `happy`, `idle`, `run`, `sleep`, `walk` |
| 💧 **Squirtle** | Mid-Canal Stone Walkway ($Y = -1.58$) | **11.0m** loop | 1.1 m/s | **DSA & Problem Solving** (Knight 2042, 1300+ C++ Solved, 250d Streak) | `attack`, `happy`, `idle`, `run`, `sleep`, `walk` |
| 🎤 **Jigglypuff** | Agricultural Crop Fields ($Y = -1.97$) | **17.8m** loop | 1.1 m/s | **Education & Academics** (IIIT Allahabad B.Tech, 8.55 CGPA, SPS 91.2%) | `attack`, `happy`, `idle`, `run`, `sleep`, `walk` |

---

## 🧠 3. Autonomous Mood & Behavior Cycles

Implemented in [src/hooks/useAutonomousMood.js](file:///src/hooks/useAutonomousMood.js):
- **Cycle-Keyed Scheduler**: Keyed to an incrementing `cycleCount` state, ensuring picking the same mood (e.g. Snorlax sleeping twice) never terminates or freezes the timer cycle.
- **Personality Mood Pools**: Snorlax naps, Charmander cheers, Gengar shadow-attacks, and Mew glides curiously.
- **Smooth Deceleration on Mood Change**: Companions smoothly damp linear velocity to 0 when transitioning to idle/sleep, eliminating foot sliding as the walk animation cross-fades out over 0.4s.
- **Visitor Interaction Priority**: Visiting any Pokémon pauses its walk, plays a cheerful greeting (`happy`), and turns the model to face the visitor camera.

---

## 🏃 4. Expansive Walking Paths & Collision/River Avoidance

Implemented in [src/data/pokemon.js](file:///src/data/pokemon.js) & [src/components/PokemonCompanion.jsx](file:///src/components/PokemonCompanion.jsx):
- **Meter-Per-Second Physics**: Companion speeds are normalized by path arc length ($v = \text{speed} / \text{length}$), creating uniform, natural travel speeds across loops.
- **Canal Water Avoidance**: Canal boundaries ($X \in [-1.35, 1.35], Y \le -2.4$) prevent companions and walkers from walking or dropping into deep canal water.
- **Bridge Walkway Support**: Bridge deck ($Y \in [1.4, 2.8]$) is accessible to both Eevee and first-person walkers.
- **Low Fields Accessibility**: Jigglypuff's agricultural fields ($Y \approx -2.7$) are walkable without height cutoff false-positives.

---

## ⛰️ 5. Precision Terrain Clamping & Anti-Flying Architecture

Implemented in [src/utils/terrain.js](file:///src/utils/terrain.js):
- **BVH Accelerated Raycasting**: Raycasts against `village.glb` use `three-mesh-bvh` hierarchical bounding trees with `firstHitOnly: true`.
- **Walkable Surface Classification**: Validates upward face normals ($n_y > 0.6$), filters roofs ($Y > 2.8$), and allows bridge decks and low field terraces.
- **Self-Hosted Draco**: Pre-packaged Draco WebAssembly decoders served locally from `public/draco/`.

---

## 🎥 6. Dual Camera Architecture: Overview vs First Person POV

Implemented in [src/components/CameraController.jsx](file:///src/components/CameraController.jsx) and [src/components/FirstPersonController.jsx](file:///src/components/FirstPersonController.jsx):

### Mode A: Overview / Third-Person Mode
- **Drei `CameraControls`**: Features `smoothTime: 0.75` for smooth transitions.
- **Smooth Mode Exit**: Returning from First Person mode smoothly blends camera position and target back to the isometric overview angle over 0.75s.
- **Overview Return**: Clicking outside, clicking the "Overview" button, or pressing `Escape` transitions back to the overview (`[14, 14, 17]` looking at `[0, 0.8, 0]`).

### Mode B: First Person POV Walking Mode
- **Drag vs Click Discrimination**: Only stationary ground clicks trigger first-person entry; camera rotation drags are ignored.
- **Calibrated Human Speeds**: $1.6\text{ m/s}$ walk and $3.2\text{ m/s}$ sprint matching village scale.
- **Separate Esc Key Actions**: Pressing `Escape` while pointer-locked frees the cursor to interact with navigation; pressing `Escape` while cursor is free exits to overview mode.
- **Input Sticking Fix**: Key state resets immediately on `window.onblur` and pointer-lock state change.
- **Arrow Keys No-Scroll**: Calls `preventDefault` on directional navigation keys.
- **Proximity Hysteresis**: $3.2\text{m}$ enter distance and $3.8\text{m}$ exit distance prevent interaction prompt flickering.
- **Touch Navigation**: Drag-to-look touch controls on mobile devices.

---

## 💎 7. Modern Glassmorphic UI & Accessibility

- **Header Navigation ([HeaderNav.jsx](file:///src/components/HeaderNav.jsx))**:
  - Frosted glassmorphic pill bar with horizontal mouse-wheel scrolling support.
  - 4 interactive weather presets (`☀️ Sunny`, `🌅 Sunset`, `🌧️ Rain`, `🌙 Night`) with 1-second color lerping.
  - POV Walking mode toggle button.
- **Accessible World Badges ([PokemonBadge.jsx](file:///src/components/PokemonBadge.jsx))**:
  - Implemented as interactive `<button>` elements with `aria-label`, visible `:focus-visible` outlines, and keyboard `Enter`/`Space` trigger support.
- **Asset Loading Screen ([CanvasLoader.jsx](file:///src/components/CanvasLoader.jsx))**:
  - Real-time progress bar powered by Drei's `useProgress`.
- **Reduced Motion Support**: `@media (prefers-reduced-motion: reduce)` disables infinite animations for accessibility compliance.
- **Optimized Bundle Splitting ([vite.config.js](file:///vite.config.js))**:
  - Splits `three`, `fiber`, `drei`, and `bvh` into separate vendor chunks with lazy-loaded first-person controller.

---

## 📂 8. Modular Codebase Structure

```
PortFolio/
├── public/
│   ├── draco/                  # Self-hosted Draco WASM & JS decoders
│   └── models/
│       ├── village.glb          # Prebuilt cozy fantasy village diorama
│       └── [12 pokemon].glb    # Fully rigged companion models
├── src/
│   ├── constants/
│   │   ├── config.js            # Shared constants, local Draco URL, water bounds
│   │   └── weather.js           # Weather presets and atmospheric lighting configs
│   ├── utils/
│   │   └── terrain.js           # BVH-accelerated terrain raycasting & filters
│   ├── hooks/
│   │   └── useAutonomousMood.js # Cycle-keyed mood scheduler & animation mixer
│   ├── components/
│   │   ├── SceneEnvironment.jsx # Weather skybox, dynamic lighting, GPU rain & motes
│   │   ├── CozyVillage.jsx      # Village mesh with BVH trees & click validation
│   │   ├── PokemonBadge.jsx     # Accessible 3D HTML name badge button
│   │   ├── PokemonCompanion.jsx # Companion roaming, m/s speed, smooth hover lift
│   │   ├── CameraController.jsx # Camera transitions with smooth return to overview
│   │   ├── FirstPersonController.jsx # FPS walking, mouse damping, hysteresis
│   │   ├── HeaderNav.jsx        # Glassmorphic top navigation with wheel scrolling
│   │   ├── DialogueModal.jsx    # Glassmorphic portfolio dialogue card
│   │   ├── CanvasLoader.jsx     # Real-time asset loading screen
│   │   ├── ErrorBoundary.jsx    # Subtree error boundary for 3D companion models
│   │   └── Scene.jsx            # 3D Scene assembly
│   ├── data/
│   │   └── pokemon.js           # Companion configurations, calibrated waypoints & links
│   ├── App.jsx                  # Root application orchestrator
│   ├── main.jsx                 # React root entrypoint
│   └── style.css                # Glassmorphism, animations, responsive & a11y CSS
├── index.html                   # HTML shell with Google Fonts
├── package.json                 # Dependencies and build scripts
└── vite.config.js               # Vite manual chunk splitting configuration
```

---

## 🚀 9. Running & Building

- **Development Server**:
  ```bash
  npm run dev
  ```
  Runs Vite dev server with Hot Module Replacement at `http://localhost:5173/`.

- **Production Build**:
  ```bash
  npm run build
  ```
  Compiles optimized code-split production bundle into `dist/`.

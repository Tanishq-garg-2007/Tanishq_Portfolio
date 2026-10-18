# 🌿 3D Pokémon Haven Portfolio

An immersive, interactive 3D portfolio village built with **React Three Fiber**, **Three.js**, and **Vite**. Explore 12 animated Pokémon companions situated across a stylized low-poly village, each representing a section of **Tanishq Garg's** resume—including AI/ML research, Edge VLM systems, LeetCode Knight achievements, and full-stack projects.

![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-r174-black?style=for-the-badge&logo=three.js&logoColor=white)
![React Three Fiber](https://img.shields.io/badge/R3F-v8-blue?style=for-the-badge)

---

## ✨ Features

- **🎮 12 Interactive Pokémon Companions**:
  - **⚡ Pikachu**: About Me, Education (IIIT Allahabad, CGPA 8.55), Overview & Navigation
  - **🐉 Dragonite**: Project 1: Edge VLM & Knowledge Graph (Edge hardware, 1.2M triples)
  - **👻 Gengar**: Project 2: IoT Security Testbed & RAG Pipeline (C3iHub IIT Kanpur)
  - **🦊 Eevee**: Project 3: LearnNexus — Adaptive AI LMS (Next.js, FastAPI, Vector Search)
  - **💧 Squirtle**: LeetCode Knight (Rating 2042, Top 2.7%, 1400+ problems solved)
  - **🌿 Bulbasaur**: AI/ML Tech Stack (PyTorch, LangChain, Ollama, ChromaDB, Hugging Face)
  - **🔥 Charmander**: Core Engineering Stack (Python, C++, TypeScript, React, Docker)
  - **💤 Snorlax**: Competitive Achievements & Hackathons (Smart India Hackathon Finalist)
  - **✨ Mew**: Leadership & Extracurriculars (Technical Coordinator, Club Lead)
  - **🌊 Psyduck**: Direct Contact & Social Links (One-click email, GitHub, LinkedIn, Resume)
  - **🐱 Meowth**: Coursework & Academic Foundations (DSA, DBMS, OS, Computer Networks)
  - **🎤 Jigglypuff**: Philosophy & Interests (Edge Computing, Cognitive AI, Music)

- **🌤️ Dynamic Weather & Time-of-Day System**:
  - Four atmospheric environments: **Noon** ☀️, **Sunset** 🌅, **Rain** 🌧️, and **Night** 🌙
  - GPU-accelerated rain shader running smoothly at 60 FPS on both mobile and desktop.

- **🚶 Dual Viewing Modes**:
  - **Village Overview**: Smooth orbital camera transitions focusing on selected companions.
  - **First-Person Explorer**: Walk through the village using WASD/Arrow keys or mobile touch navigation.

- **📱 Fully Mobile Responsive**:
  - Proportional 3D camera elevation preventing models from hiding behind cards on narrow portrait screens.
  - Compact glassmorphism dialogue sheets with touch-momentum scrolling.

- **⚡ Blazing Fast Performance**:
  - Models optimized with Draco geometry compression and WebP 512px textures (~6MB total for all 13 3D models).
  - Production bundle under 500 KB gzip.

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/Tanishq-garg-2007/Tanishq_Portfolio.git
cd Tanishq_Portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```
The output will be in the `dist/` directory.

---

## 🌐 How to Host Smoothly

### Option A: Vercel (Recommended — Fastest & Zero Configuration)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New Project** and select `Tanishq_Portfolio`.
3. Vercel automatically detects **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. In under 60 seconds, your 3D portfolio will be live with free global CDN and HTTPS!

### Option B: Netlify
1. Go to [netlify.com](https://netlify.com) and log in with GitHub.
2. Click **Add new site** > **Import an existing project** > choose `Tanishq_Portfolio`.
3. Set build command to `npm run build` and publish directory to `dist`.
4. Click **Deploy Site**.

### Option C: GitHub Pages
1. Install `gh-pages` or use GitHub Actions:
2. Go to repository **Settings** > **Pages** > Build and deployment > **GitHub Actions**.
3. Choose the static Vite deployment workflow.

---

## ⚙️ Configuration (.env)

All personal details, project descriptions, LeetCode stats, links, and companion speeches are driven by `.env`:

```env
VITE_USER_NAME="Tanishq Garg"
VITE_USER_TITLE="AI/ML Engineer"
VITE_USER_EMAIL="tanishakgarg@gmail.com"
VITE_GITHUB_URL="https://github.com/Tanishq-garg-2007"
VITE_LINKEDIN_URL="https://www.linkedin.com/in/tanishqgarg2007/"
VITE_RESUME_URL="https://drive.google.com/..."
```

Edit `.env` to update your content without touching application logic!

---

## 📄 License

MIT License © 2026 Tanishq Garg. Pokémon assets and characters are trademarks of Nintendo, Game Freak, and Creatures Inc.

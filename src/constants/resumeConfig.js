/**
 * resumeConfig.js
 * Centralized resume and portfolio data layer.
 * All fields dynamically read from environment variables (import.meta.env.VITE_*)
 * with rich, battle-tested fallback values from Tanishq Garg's official resume.
 */

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

// Helper to get env string with trimmed fallback
function getEnv(key, fallback = '') {
  const val = env[key];
  if (val !== undefined && val !== null && String(val).trim() !== '') {
    return String(val).trim();
  }
  return fallback;
}

// Helper to parse comma-separated tags into an array
function getTags(key, fallbackArray = []) {
  const raw = getEnv(key);
  if (!raw) return fallbackArray;
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

export const RESUME_DATA = {
  // --- 👤 Personal Profile ---
  profile: {
    name: getEnv('VITE_USER_NAME', 'Tanishq Garg'),
    title: getEnv('VITE_USER_TITLE', 'AI/ML Engineer & Systems Developer'),
    email: getEnv('VITE_USER_EMAIL', 'tanishakgarg@gmail.com'),
    phone: getEnv('VITE_USER_PHONE', '+91-9729535333'),
    college: getEnv('VITE_USER_COLLEGE', 'Indian Institute of Information Technology, Allahabad'),
    degree: getEnv('VITE_USER_DEGREE', 'B.Tech in Information Technology'),
    cgpa: getEnv('VITE_USER_CGPA', '8.55'),
    school: getEnv('VITE_USER_SCHOOL', 'Siddhartha Public School, Delhi'),
    schoolScore: getEnv('VITE_USER_SCHOOL_SCORE', '91.2%'),
    githubUrl: getEnv('VITE_GITHUB_URL', 'https://github.com/tanishq'),
    linkedinUrl: getEnv('VITE_LINKEDIN_URL', 'https://linkedin.com/in/tanishq'),
    resumeUrl: getEnv('VITE_RESUME_URL', '/resume.pdf'),
  },

  // --- ⚡ Pikachu: About Me & Welcome ---
  pikachu: {
    role: getEnv('VITE_PIKACHU_ROLE', 'About Me & Welcome'),
    speech: getEnv(
      'VITE_PIKACHU_SPEECH',
      "Pika-pika! ⚡ Welcome to my 3D Pokémon Haven! I'm Tanishq Garg, an IT undergraduate at IIIT Allahabad (CGPA 8.55). I specialize in Agentic AI, Edge Vision-Language Models, and high-performance full-stack architectures. Explore the village to discover my research, systems, and algorithms!"
    ),
    tags: getTags('VITE_PIKACHU_TAGS', [
      'IIIT Allahabad',
      'CGPA 8.55',
      'Agentic AI',
      'Edge LLMs',
      'LeetCode Knight'
    ])
  },

  // --- 💧 Squirtle: DSA & Problem Solving ---
  squirtle: {
    role: getEnv('VITE_SQUIRTLE_ROLE', 'DSA & Problem Solving'),
    rating: getEnv('VITE_SQUIRTLE_RATING', '2042'),
    rank: getEnv('VITE_SQUIRTLE_RANK', 'Knight'),
    solved: getEnv('VITE_SQUIRTLE_SOLVED', '1300+ Problems'),
    streak: getEnv('VITE_SQUIRTLE_STREAK', '250+ Day Streak'),
    badges: getEnv('VITE_SQUIRTLE_BADGES', '12+ Badges'),
    lang: getEnv('VITE_SQUIRTLE_LANG', 'C++'),
    speech: getEnv(
      'VITE_SQUIRTLE_SPEECH',
      'Squirtle-squir! 💧 Strolling along the canal promenade! Keeping code smooth and fluid like water. Tanishq is a Knight on LeetCode (2042 Peak Rating), having solved 1300+ algorithmic problems in C++ with an unbroken 250+ day streak!'
    ),
    tags: getTags('VITE_SQUIRTLE_TAGS', [
      'Dynamic Programming',
      'Graph Theory',
      'Trees & Tries',
      'C++ STL',
      'Binary Search',
      'Bit Manipulation'
    ])
  },

  // --- 🐉 Dragonite: Project 1 (Object Affordance Reasoning) ---
  dragonite: {
    name: getEnv('VITE_PROJECT1_NAME', 'Object Affordance Reasoning System'),
    subtitle: getEnv('VITE_PROJECT1_SUBTITLE', 'Offline Edge VLM for Fire Emergencies (IIIT Allahabad)'),
    advisor: getEnv('VITE_PROJECT1_ADVISOR', 'Prof. Bibhas Ghoshal'),
    date: getEnv('VITE_PROJECT1_DATE', 'Jun 2026 – Present'),
    speech: getEnv(
      'VITE_PROJECT1_SPEECH',
      'Rraaa-on! 🐉 Guardian behind the Castle Citadel! Tanishq architected an offline edge AI survival system for fire hazards, deploying a custom fine-tuned SmolVLM and 330+ physical tool Knowledge Graph on a Raspberry Pi 5!'
    ),
    metrics: [
      getEnv('VITE_PROJECT1_METRIC1', '256M SmolVLM'),
      getEnv('VITE_PROJECT1_METRIC2', '2000+ Image Dataset'),
      getEnv('VITE_PROJECT1_METRIC3', '330+ Tool KG'),
      getEnv('VITE_PROJECT1_METRIC4', 'Raspberry Pi 5')
    ],
    bullets: [
      getEnv('VITE_PROJECT1_BULLET1', 'Fine-tuned a compact 256M-parameter SmolVLM on a custom 2,000+ image dataset to accurately classify environments and detect objects for fire emergencies.'),
      getEnv('VITE_PROJECT1_BULLET2', 'Engineered a structured Knowledge Graph mapping 330+ physical tools to survival affordances across 10 specific hazard states to formulate escape strategies.'),
      getEnv('VITE_PROJECT1_BULLET3', 'Architected the end-to-end assistive survival system for resource-constrained edge deployment on Raspberry Pi 5 for reliable offline inference.')
    ]
  },

  // --- 👻 Gengar: Project 2 (IoT Security Testbed & RAG Pipeline) ---
  gengar: {
    name: getEnv('VITE_PROJECT2_NAME', 'IoT Security Testbed & RAG Pipeline'),
    subtitle: getEnv('VITE_PROJECT2_SUBTITLE', 'C3iHub, IIT Kanpur & IIIT Allahabad'),
    advisor: getEnv('VITE_PROJECT2_ADVISOR', 'Prof. S. Venkatesan'),
    date: getEnv('VITE_PROJECT2_DATE', 'Aug 2025 – Jun 2026'),
    speech: getEnv(
      'VITE_PROJECT2_SPEECH',
      'Gen-gar! 👻 Guarding the shadows so zero vulnerabilities go unnoticed! During an on-site engagement at C3iHub IIT Kanpur, Tanishq engineered automated bootlog analysis using Qwen3.5:0.8B, LMF2.5-Thinking, and a ChromaDB RAG pipeline on edge hardware!'
    ),
    metrics: [
      getEnv('VITE_PROJECT2_METRIC1', 'C3iHub IIT Kanpur'),
      getEnv('VITE_PROJECT2_METRIC2', '10+ IoT Devices'),
      getEnv('VITE_PROJECT2_METRIC3', 'Qwen3.5:0.8B RAG'),
      getEnv('VITE_PROJECT2_METRIC4', 'RPi 4 (8GB RAM)')
    ],
    bullets: [
      getEnv('VITE_PROJECT2_BULLET1', 'Contributed in code deployment and team integration during a 1-month on-site engagement at C3iHub, IIT Kanpur for IoT Security.'),
      getEnv('VITE_PROJECT2_BULLET2', 'Engineered a Regex Filtering and RAG pipeline using Qwen3.5:0.8B and LMF2.5-Thinking to automate bootlog analysis, flagging credentials across 10+ IoT devices.'),
      getEnv('VITE_PROJECT2_BULLET3', 'Developed a context-aware chatbot using ChromaDB and Qwen3.5:0.8B on a Raspberry Pi 4 (8GB RAM), delivering accurate local queries.')
    ]
  },

  // --- 🦊 Eevee: Project 3 (LearnNexus) ---
  eevee: {
    name: getEnv('VITE_PROJECT3_NAME', 'LearnNexus | Agentic EdTech'),
    subtitle: getEnv('VITE_PROJECT3_SUBTITLE', 'CrewAI, FastAPI, Groq, ChromaDB'),
    date: getEnv('VITE_PROJECT3_DATE', 'Apr 2026 – Jun 2026'),
    speech: getEnv(
      'VITE_PROJECT3_SPEECH',
      'Eev-vee! ✨ Just like my versatile evolutions, Tanishq led a 3-member team to build LearnNexus — an agentic learning assistant powered by CrewAI, FastAPI, Groq, and ChromaDB that generates personalized study roadmaps in under 800ms!'
    ),
    metrics: [
      getEnv('VITE_PROJECT3_METRIC1', 'CrewAI Multi-Agent'),
      getEnv('VITE_PROJECT3_METRIC2', '< 800ms Latency'),
      getEnv('VITE_PROJECT3_METRIC3', 'Groq LPU Engine'),
      getEnv('VITE_PROJECT3_METRIC4', '10+ Student Validated')
    ],
    bullets: [
      getEnv('VITE_PROJECT3_BULLET1', 'Identified a gap in cross-institute student collaboration; led a 3-member team to create LearnNexus to serve academic institutes across India.'),
      getEnv('VITE_PROJECT3_BULLET2', 'Implemented an agentic AI learning assistant on Groq, achieving sub-800ms generation for personalized study plans, roadmaps, and skill recommendations.'),
      getEnv('VITE_PROJECT3_BULLET3', 'Formulated a contribution-based ecosystem featuring note-sharing, company engagement portals, and virtual rewards validated with positive feedback.')
    ],
    githubUrl: getEnv('VITE_PROJECT3_GITHUB', 'https://github.com/tanishq'),
    liveUrl: getEnv('VITE_PROJECT3_LIVE', '#')
  },

  // --- ✨ Mew: Project 4 (Civic Sync) ---
  mew: {
    name: getEnv('VITE_PROJECT4_NAME', 'Civic Sync | Multilingual AI'),
    subtitle: getEnv('VITE_PROJECT4_SUBTITLE', 'Groq, ChromaDB, Sarvam, FastAPI'),
    date: getEnv('VITE_PROJECT4_DATE', 'Feb 2026 – Mar 2026'),
    speech: getEnv(
      'VITE_PROJECT4_SPEECH',
      'Mew-mew! ✨ Darting through the mystic glade! Tanishq co-built Civic Sync — a full-stack civic governance platform with 13 modules, 3-tier role authorization, and 5 AI capabilities including Sarvam multilingual voice navigation!'
    ),
    metrics: [
      getEnv('VITE_PROJECT4_METRIC1', '13 Modules'),
      getEnv('VITE_PROJECT4_METRIC2', '3-Tier Roles'),
      getEnv('VITE_PROJECT4_METRIC3', '5 AI Capabilities'),
      getEnv('VITE_PROJECT4_METRIC4', 'EN / HI / AS Voice')
    ],
    bullets: [
      getEnv('VITE_PROJECT4_BULLET1', 'Built full-stack platform making civic services accessible; structured a 3-tier role system (Citizens, District Admins, National Admins) in English, Hindi, and Assamese.'),
      getEnv('VITE_PROJECT4_BULLET2', 'Segmented platform into 13 functional modules: complaint tracking, bill payments, service requests, announcements, GIS mapping, and emergency directory.'),
      getEnv('VITE_PROJECT4_BULLET3', 'Integrated 5 AI capabilities: Sarvam STT/TTS voice navigation for visually impaired, complaint deduplication clustering, fake complaint detection, and recommendations.')
    ],
    githubUrl: getEnv('VITE_PROJECT4_GITHUB', 'https://github.com/tanishq'),
    liveUrl: getEnv('VITE_PROJECT4_LIVE', '#')
  },

  // --- 🌿 Bulbasaur: AI/ML & Agent Frameworks ---
  bulbasaur: {
    role: getEnv('VITE_BULBASAUR_ROLE', 'AI/ML & Agent Frameworks'),
    speech: getEnv(
      'VITE_BULBASAUR_SPEECH',
      'Bulba-saur! 🌿 Cultivating rich harvests of modern AI! Here are the agentic frameworks, LLM toolchains, and model engineering tools Tanishq nurtures daily:'
    ),
    skills: getTags('VITE_BULBASAUR_SKILLS', [
      'CrewAI',
      'Hugging Face',
      'Anthropic MCP',
      'Ollama',
      'Mem0',
      'LLaMA.cpp',
      'Unsloth',
      'SmolVLM',
      'Qwen',
      'LangChain',
      'ChromaDB',
      'PyTorch'
    ]),
    desc: getEnv(
      'VITE_BULBASAUR_DESC',
      'Hands-on mastery in multi-agent orchestration, compact VLM fine-tuning, RAG retrieval pipelines, edge quantizations (GGUF/Ollama), and Model Context Protocol tooling.'
    )
  },

  // --- 🔥 Charmander: Languages & Backend Tech Stack ---
  charmander: {
    role: getEnv('VITE_CHARMANDER_ROLE', 'Languages & Backend Tech Stack'),
    speech: getEnv(
      'VITE_CHARMANDER_SPEECH',
      'Char-char! 🔥 Keeping the engines roaring warm! Tanishq builds robust high-throughput backends and interfaces engineered for ultra-low latency and rock-solid reliability:'
    ),
    languages: getTags('VITE_CHARMANDER_LANGUAGES', ['C', 'C++', 'Python', 'JavaScript', 'SQL']),
    backend: getTags('VITE_CHARMANDER_BACKEND', ['FastAPI', 'Node.js', 'Express.js', 'RESTful APIs']),
    frontend: getTags('VITE_CHARMANDER_FRONTEND', ['React', 'HTML5', 'CSS3', 'Three.js', 'React Three Fiber']),
    databases: getTags('VITE_CHARMANDER_DATABASES', ['ChromaDB', 'SQLite', 'PostgreSQL', 'Vector Databases']),
    coursework: getTags('VITE_CHARMANDER_COURSEWORK', ['DSA', 'OOP', 'DBMS', 'Operating Systems'])
  },

  // --- 🪙 Meowth: Achievements & Honors ---
  meowth: {
    role: getEnv('VITE_MEOWTH_ROLE', 'Achievements & Honors'),
    speech: getEnv(
      'VITE_MEOWTH_SPEECH',
      "Meowth, that's right! 🪙 Nothing shines brighter than hard-earned milestones! Check out the competitive rankings and honors Tanishq has secured:"
    ),
    achievements: [
      getEnv('VITE_ACHIEVEMENT_1', 'Top 10 Nationally | Suvidha 2026 Hackathon for high-impact civic technology solution.'),
      getEnv('VITE_ACHIEVEMENT_2', 'Knight on LeetCode | Peak Rating 2042, solving 1300+ algorithmic problems in C++.'),
      getEnv('VITE_ACHIEVEMENT_3', '250+ Day Coding Streak | 12+ proficiency badges on LeetCode through consistent daily practice.'),
      getEnv('VITE_ACHIEVEMENT_4', 'Anthropic Model Context Protocol (MCP) | Official Certification.'),
      getEnv('VITE_ACHIEVEMENT_5', 'JEE Main AIR 4,228 | Among 1.4 million candidates (Top 0.3%).'),
      getEnv('VITE_ACHIEVEMENT_6', 'JEE Advanced AIR 9,508 | Among 1.86 lakh qualified candidates.')
    ]
  },

  // --- 🎤 Jigglypuff: Education & Academics ---
  jigglypuff: {
    role: getEnv('VITE_JIGGLYPUFF_ROLE', 'Education & Academics'),
    speech: getEnv(
      'VITE_JIGGLYPUFF_SPEECH',
      'Jiggly-puff! 🎤 Singing cheerful melodies across the academic fields! Built upon rock-solid computer science fundamentals and disciplined university coursework:'
    ),
    college: getEnv('VITE_EDUCATION_COLLEGE', 'Indian Institute of Information Technology, Allahabad'),
    degree: getEnv('VITE_EDUCATION_DEGREE', 'B.Tech in Information Technology (2024 – Present)'),
    cgpa: getEnv('VITE_EDUCATION_CGPA', 'CGPA: 8.55 / 10.0'),
    school: getEnv('VITE_EDUCATION_SCHOOL', 'Siddhartha Public School, Delhi'),
    schoolScore: getEnv('VITE_EDUCATION_SCHOOL_PERCENT', 'Class XII: 91.2% (2022 – 2024)'),
    coursework: getTags('VITE_EDUCATION_COURSEWORK', [
      'Data Structures & Algorithms',
      'Object-Oriented Programming (OOP)',
      'Database Management Systems (DBMS)',
      'Operating Systems'
    ])
  },

  // --- 💤 Snorlax: Hobbies & Philosophy ---
  snorlax: {
    role: getEnv('VITE_SNORLAX_ROLE', 'Hobbies & Philosophy'),
    speech: getEnv(
      'VITE_SNORLAX_SPEECH',
      "Zzz... *yawn*... Resting deeply under the pines... 🍃 True engineering excellence comes from disciplined patience and continuous curiosity. When not training models or solving LeetCode problems, here is what Tanishq enjoys:"
    ),
    hobbies: [
      getEnv('VITE_HOBBY_1', 'Tinkering with Raspberry Pi & Edge Hardware'),
      getEnv('VITE_HOBBY_2', 'Reading Latest AI Research Papers & Multi-Agent Architectures'),
      getEnv('VITE_HOBBY_3', 'Competitive Algorithmic Programming & Contests'),
      getEnv('VITE_HOBBY_4', 'Building 3D Interactive Web Experiences & Creative Coding'),
      getEnv('VITE_HOBBY_5', 'Nature Walks & Strategic Board Games')
    ],
    quote: getEnv(
      'VITE_SNORLAX_QUOTE',
      "Great engineering doesn't rush; it is architected with care, tested against reality, and built to bring peace of mind."
    )
  },

  // --- 🌊 Psyduck: Contact & Inquiries ---
  psyduck: {
    role: getEnv('VITE_PSYDUCK_ROLE', 'Connect & Inquiries'),
    speech: getEnv(
      'VITE_PSYDUCK_SPEECH',
      "Psy... duck? 🌊 Resting by the arched wooden bridge watching the river stream! Looking to collaborate on AI projects, discuss opportunities, or explore high-impact engineering? Get in touch with Tanishq:"
    ),
    email: getEnv('VITE_USER_EMAIL', 'tanishakgarg@gmail.com'),
    phone: getEnv('VITE_USER_PHONE', '+91-9729535333'),
    githubUrl: getEnv('VITE_GITHUB_URL', 'https://github.com/tanishq'),
    linkedinUrl: getEnv('VITE_LINKEDIN_URL', 'https://linkedin.com/in/tanishq'),
    resumeUrl: getEnv('VITE_RESUME_URL', '/resume.pdf')
  }
};

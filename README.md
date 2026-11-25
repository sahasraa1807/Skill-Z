# SkillZ 🚀

**Find the right project. Assemble the right team. Build together.**

SkillZ is an intelligent two-sided collaboration platform that matches developers, designers, and AI engineers with projects and complementary teammates based on skills, availability, and career goals.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-skill--z--sable.vercel.app-0284c7?style=for-the-badge&logo=vercel)](https://skill-z-sable.vercel.app/)
[![API Status](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render)](https://skill-z.onrender.com/health)
[![Database](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 📌 Problem Statement

Forming balanced, complementary teams for hackathons, open-source initiatives, or early-stage startups is notoriously broken:

1. **Superficial Tag Matching**: Existing platforms treat collaboration like a basic keyword job board, ignoring weekly availability hours, time slot preferences, and career intent (e.g., pairing a 48-hour hackathon sprinter with someone looking for a 6-month startup commitment).
2. **The Cold-Start Trust Gap**: New developers with empty profiles have zero historical ratings, making it difficult for project leads to gauge real competency or accept applicants.
3. **Unverified Skill Inflation**: Self-reported skill lists are often inflated without code-level proof, leading to mismatched expectations and 60%+ team attrition mid-sprint.
4. **Team Composition Blindspots**: Project leads often fail to realize they are missing critical domain coverage (e.g., lacking backend infrastructure or ML expertise) until deadlines fail.
5. **Fragmented Workspaces**: Once teams form, collaboration splinters across third-party apps with no integrated sprint execution tools tied to user profiles.

---

## 💡 The Core Solution

SkillZ creates a unified, two-sided ecosystem where any user can seamlessly toggle between being a **Project Creator** and a **Contributing Candidate**:

```
                              SKILLZ ECOSYSTEM
                                     │
                   ┌─────────────────┴─────────────────┐
                   ▼                                   ▼
        [ BUILD A PROJECT ]                  [ JOIN A PROJECT ]
     • Define open roles & skills         • 6-step calibrated onboarding
     • Automated candidate backfills      • Multi-factor match breakdown
     • Application review pipeline        • GitHub code verification
     • Integrated Kanban workspace        • One-click pitch applications
```

- **Objective Compatibility**: A 4-factor scoring algorithm calculates real-time fit ($0–100\%$) across Skills (40%), Goals (25%), Schedule Overlap (20%), and Experience Level (15%).
- **Calibrated Credibility**: A 100-point trust calibration engine verifies developer skills by scanning public GitHub repositories via GitHub REST API.
- **Team Intelligence**: Evaluates team composition health (0–100%), flags domain voids (e.g., *"Missing Backend Lead"*), and automates candidate backfill recommendations.
- **Integrated Sprint Workspaces**: Built-in 4-column sprint Kanban boards, shared team resource hubs, live audit event streams, and in-app notifications.

---

## ⚡ Key Features

### 🧠 1. Smart Matching Engine & Transparency Popovers
- Computes weighted compatibility scores for open project roles.
- Interactive UI popovers break down sub-factor percentages so users clearly understand **"Why did I get this score?"**.

### 🔍 2. In-Process Dense Vector Semantic Search
- Features a pure JavaScript 128-dimensional TF-IDF dense vector embedding engine and cosine similarity algorithm running directly inside the Express process.
- Executes natural language queries (e.g., *"looking for a teammate into sustainability and AI"*) in **sub-5ms** without external LLM API latency or third-party vector DB costs.

### 🛡️ 3. Trust Calibration & Automated GitHub Verification
- Categorizes profiles into 3 trust quadrants: `CALIBRATING` ($0–39\%$), `ESTABLISHED` ($40–69\%$), and `VERIFIED` ($70–100\%$).
- Auto-scans candidate public GitHub repositories to extract language stats and automatically award `IS_VERIFIED` badges.

### 📊 4. Team Intelligence & Void Detection
- Dynamically calculates a **Team Health Score (0–100%)** based on role fulfillment and domain coverage.
- Surfaces immediate talent backfill pools tailored to unfilled role voids.

### 📋 5. Integrated Sprint Workspaces
- Interactive 4-column Kanban board (`BACKLOG`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`) with drag/status transitions, priority indicators, and member assignments.
- Centralized **Resource Hub** for sharing GitHub repos, Figma mockups, API specifications, and staging links.
- Real-time audit activity feed logging member actions and sprint milestones.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale & Usage |
| :--- | :--- | :--- |
| **Frontend SPA** | React 18, Vite | Component-driven architecture, instant HMR, high performance |
| **Styling** | Tailwind CSS v3 | Utility-first custom design system, responsive UI |
| **Routing & State** | React Router v6, Context API | Client-side route guards, global authentication state |
| **HTTP Client** | Axios | Automated JWT bearer token injection via interceptors |
| **Backend Runtime** | Node.js, Express.js | Asynchronous event-driven REST API architecture |
| **Database & ORM** | PostgreSQL, Prisma ORM | 17 relational models, type-safe queries, migration control |
| **Authentication** | JWT, bcryptjs | Stateless token auth with salted password hashing |
| **Vector Engine** | Pure JS 128D Embeddings | In-process TF-IDF vectorization and cosine similarity (<5ms) |
| **Cloud Hosting** | Vercel, Render, Supabase | High-availability global CDN, managed Node runtime & cloud DB |

---

## 🏛️ System Architecture

```
[ React 18 SPA (Vercel) ]
           │
           │  HTTPS / JSON API (Axios + JWT)
           ▼
[ Express.js REST API (Render) ]
  ├── Security: CORS, Express-Rate-Limit, AuthGuard
  ├── Routing: 11 API Modules (/api/auth, /api/projects, /api/matching, etc.)
  ├── Core Engines:
  │     ├── Matching Engine (4-Factor Weighted Algorithm)
  │     ├── Team Intelligence Engine (Health Scoring & Void Detection)
  │     └── In-Process 128D Vector Engine (TF-IDF & Cosine Similarity)
  └── ORM Layer: Prisma Client
           │
           │  TCP / Connection Pooler
           ▼
[ Managed PostgreSQL Database (Supabase) ]
  └── 17 Synced Models (Users, Projects, Roles, Tasks, Proofs, Notifications)
```

---

## 📁 Repository Structure

```
skillZ/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # 17 PostgreSQL models
│   │   ├── seed.js                # Master skills & categories seeder
│   │   └── migrations/            # Version-controlled migrations
│   ├── src/
│   │   ├── controllers/           # Request handlers (auth, projects, workspace, AI)
│   │   ├── middleware/            # JWT authentication & error handlers
│   │   ├── routes/                # 11 Express route modules
│   │   ├── services/              # Core business logic & algorithms
│   │   │   ├── aiEmbeddingService.js      # 128D vector embeddings
│   │   │   ├── matchingService.js         # Multi-factor matching
│   │   │   ├── teamIntelligenceService.js # Health score & void analysis
│   │   │   └── workspaceService.js        # Kanban & resources
│   │   ├── app.js                 # Express server configuration
│   │   └── server.js              # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/            # Buttons, Avatars, CompatibilityBadges, Modals
│   │   │   ├── layout/            # Navbar, PageWrapper, NotificationDropdown
│   │   │   ├── onboarding/        # 6-Step Onboarding Wizard
│   │   │   ├── projects/          # RoleBuilder, TeamIntelligenceCard, AIAnalysis
│   │   │   └── workspace/         # KanbanBoard, TaskCard, TaskModal, ResourceHub
│   │   ├── context/               # AuthContext
│   │   ├── pages/                 # 11 Application pages
│   │   └── services/              # Axios API service clients
│   ├── vercel.json                # SPA routing rewrite rule
│   └── vite.config.js
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** (Local instance or cloud connection string from Supabase)
- **npm** or **yarn**

---

### 1. Clone the Repository
```bash
git clone https://github.com/sahasraa1807/Skill-Z.git
cd Skill-Z
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/skillz"
JWT_SECRET="your_development_secret_key"
JWT_EXPIRES_IN="7d"
PORT=5001
NODE_ENV="development"
```

Initialize and seed the database:
```bash
npx prisma db push
node prisma/seed.js
```

Start the backend server:
```bash
npm run dev
# Backend runs at http://localhost:5001
```

---

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL="http://localhost:5001/api"
```

Start the Vite development server:
```bash
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


# IdeaPeerCircle 🌟

> **“Build. Share. Learn. Improve.”**  
> An AI-powered peer learning and collaboration platform designed for students.

IdeaPeerCircle turns student projects into actionable opportunities for active learning. Students showcase what they've built, receive structured peer feedback across 6 dimensions, get AI-synthesized learning snapshots with skill-gap detection, discover personalized learning paths, and connect with peers who have complementary skills.

---

## 🎨 Brand Design & Color System

The application strictly implements the specified brand identity:
- **Transparent Yellow (`#F5EFC6`)**: Primary backgrounds, hero canvas, soft cards, warm highlights
- **Sceptre Red (`#4D0E12`)**: Primary action buttons, strong accents, active badges, key headings
- **Cerulean Blue (`#A5BCD6`) & Soft Blue (`#A0BEDA`)**: Secondary cards, AI panels, project categories, hover states
- **Potting Soil (`#4A2E27`) & Java Brown (`#231815`)**: Typography, navigation, dark high-contrast surfaces, footer

---

## ⚡ The 8-Stage Learning Loop

```text
💡 IDEA ──► 🛠️ BUILD ──► 🌐 SHARE ──► 👥 PEER FEEDBACK
                                             │
🚀 BUILD AGAIN ◄── 📈 IMPROVE ◄── 🤝 COLLABORATE ◄── 🤖 AI INSIGHTS
                                             │
                                             ▼
                                          📚 LEARN
```

1. **IDEA**: Find a real student problem or creative spark.
2. **BUILD**: Construct a functional prototype with actual code.
3. **SHARE**: Publish via the 6-step project wizard with collaboration tags.
4. **PEER FEEDBACK**: Receive ratings (1–10) across 6 meaningful dimensions:
   - UI/UX
   - Technical Implementation
   - Innovation
   - AI Implementation
   - Real-World Usefulness
   - Problem Solving
5. **AI INSIGHTS**: Dedicated server-side AI synthesizes qualitative critiques, detects skill gaps, and formulates an actionable **AI Learning Snapshot**.
6. **LEARN**: "My Learning" page aggregates recommendations into an active roadmap with concept check-offs.
7. **COLLABORATE**: Match with peers who want to learn what you can teach, and vice-versa.
8. **IMPROVE**: Refactor, scale, and polish your project.

---

## ✨ Key Features & Architecture

### 1. 3.5-Second Opening Animation
- Hand-drawn stars/dots appear (0.0–0.7s)
- Original vector logo forms smoothly (0.7–1.5s)
- Brand name "IdeaPeerCircle" appears (1.5–2.4s)
- Tagline "Build. Share. Learn. Improve." slides in (2.4–3.1s)
- Subtle glitter sweep passes through the logo (3.1–3.5s)
- Stored in `sessionStorage` so it doesn't replay on normal navigation (replayable anytime from footer). Respects `prefers-reduced-motion`.

### 2. Original Logo Component
- Combines central idea spark/lightbulb, circular orbit paths, and student nodes collaborating in a community circle.

### 3. Multi-Step Project Creation Wizard (Steps 1–6)
- **Step 1**: Project basics (title, short description, category)
- **Step 2**: Problem & solution (problem, target users, solution, real-world impact)
- **Step 3**: Technology & skills (tech stack chips, skills used, AI toggles, difficulty)
- **Step 4**: Links & visuals (GitHub URL, live demo URL, screenshot)
- **Step 5**: Collaboration requirements ("What kind of help are you looking for?" + "What can you help others with?")
- **Step 6**: Live preview & publish with celebratory sparkles

### 4. Smart Peer Review System
- 6 dimensions (1–10) with interactive sliders
- 3 constructive prompts:
  - *What did they do well?*
  - *Area to strengthen* (encouraging constructive phrasing)
  - *What would you recommend they learn next?*
- **Smart Skill Weighting**: Considers reviewer skill tags (e.g. backend experts provide higher-weighted insights on backend architecture; UI/UX experts provide higher-weighted insights on accessibility).

### 5. Dedicated AI Service Layer
- Secure backend API endpoint `POST /api/ai/projects/:id/analyze`
- Supports Google Gemini API (via `GEMINI_API_KEY`) with a built-in intelligent heuristic synthesis fallback engine.
- 4-Stage processing animation:
  1. *Reading the project…*
  2. *Connecting the feedback…*
  3. *Finding your learning gaps…*
  4. *Building your learning snapshot…*
- Returns structured, validated JSON:
  - Project Strengths
  - Areas to Strengthen
  - Identified Skill Gaps
  - Recommended Next Steps (Why & Action items)
  - Concrete Project Improvements
  - Optimal Collaborator Profiles
- **AI Feedback Synthesis**: Shows consensus ("X peers reviewed", "What people liked", "Common concern", "Unique suggestion", "AI Takeaway").

### 6. Skill-Based Collaboration Matching
- Matches users based on complementary strengths:
  - Student A (Strong in UI/UX, wants to learn Backend) ↔ Student B (Strong in Backend, wants to learn UI/UX)
- "Great potential match" banner with explicit explanations of why the match was generated.
- Full request workflow: Send, Accept, Decline, Cancel.

### 7. "My Learning" & Roadmaps
- Aggregates AI recommendations across all student projects.
- Current focus progress bar (`██████░░░░ 60%`).
- Interactive concept check-offs with confetti particles.

### 8. Gamified Achievements & Notifications
- Badges: *First Project*, *Helpful Reviewer*, *Feedback Champion*, *Community Builder*, *Idea Explorer*.
- Real-time style notification dropdown for reviews, AI analyses, and collaboration requests.

### 9. 1-Click Judge Switcher
- Dedicated demo user switcher in the navbar allowing judges to test the app from 4 different student perspectives instantly:
  - **Alex Chen** (Stanford · Frontend & EdTech)
  - **Maya Patel** (MIT · Backend & ClimateTech)
  - **Liam Vance** (UC Berkeley · UI/UX & Cognitive Science)
  - **Elena Rostova** (Carnegie Mellon · Algorithms & Creative Canvas)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24.15)
- npm 9+

### Installation

Clone the repository and install all dependencies:
```bash
# Clone repository
git clone https://github.com/swastika02-git/IdeaPeerCircle.git
cd IdeaPeerCircle

# Install root, backend, and frontend dependencies
npm run install:all
```

### Seed Demo Data
Populate the database with realistic projects (`StudyBuddy AI`, `GreenRoute`, `CampusCare`, `CodeCanvas`, `SafeShelf`) and pre-computed reviews & AI snapshots:
```bash
npm run seed
```

### Start Development Server
Run frontend (Vite) and backend (Express) concurrently:
```bash
npm run dev
```

- Frontend: `http://localhost:5173` (or port assigned by Vite)
- Backend API: `http://localhost:5000`
- API Healthcheck: `http://localhost:5000/api/health`

### Build for Production
```bash
npm run build
npm start
```
The Express server will automatically serve the optimized production client from `client/dist`.

---

## 🧪 Verification & Testing

Run the included automated integration test suite:
```bash
node server/test-e2e.js
```

---

## 📁 Repository Structure

```text
IdeaPeerCircle/
├── client/                      # React 18 + Vite frontend
│   ├── public/logo-icon.svg     # Original SVG brand icon
│   ├── src/
│   │   ├── api/client.js        # Centralized REST API client
│   │   ├── context/AuthContext  # Session persistence & demo switcher
│   │   ├── components/
│   │   │   ├── brand/           # Logo, 3.5s Opening Animation, Sparkles
│   │   │   ├── layout/          # Navbar, Footer, GlobalSearch, Notifications
│   │   │   ├── projects/        # ProjectCard, Wizard, CollaborationCard
│   │   │   ├── reviews/         # 6D PeerReviewModal, Radar Matrix, ReviewCard
│   │   │   ├── ai/              # AI Learning Snapshot, Synthesis, Loader
│   │   │   └── common/          # EmptyState, Skeleton, ErrorState
│   │   ├── pages/               # Landing, Explore, Detail, Collab, Learning, Dashboard, Profile
│   │   ├── App.jsx              # Main router & layout shell
│   │   └── index.css            # Brand styles, fonts, glitter animations
│   └── tailwind.config.js       # Exact color palette definition
├── server/                      # Node.js + Express backend
│   ├── data/store.json          # Relational file-persisted store
│   ├── src/
│   │   ├── db/database.js       # Relational database engine
│   │   ├── db/schema.sql        # Supabase / PostgreSQL schema definition
│   │   ├── db/seed.js           # 5 realistic student projects & profiles
│   │   ├── middleware/auth.js   # JWT authentication & guest middleware
│   │   ├── services/aiService   # Gemini API + Heuristic AI synthesis
│   │   ├── services/githubService # Public GitHub repo metadata fetcher
│   │   ├── routes/              # Modular Express route controllers
│   │   └── index.js             # Express server entry point
│   └── test-e2e.js              # Full automated E2E integration tests
└── package.json                 # Monorepo runner scripts
```

---

## 🏆 2-Minute Demo Journey for Evaluators

1. **Brand Intro**: Refresh the page to experience the 3.5-second brand animation on `#F5EFC6`.
2. **Landing Page**: View the ecosystem diagram and explore the 8-stage interactive learning loop.
3. **Explore Projects**: Browse the filterable gallery by category (EdTech, Climate, Mental Health) or tech (React, Node, etc.).
4. **Project Detail**: Open **StudyBuddy AI**. View the problem/solution, live demo/GitHub links, and the **AI Feedback Synthesis** card.
5. **AI Learning Snapshot**: Review the student strengths, areas to strengthen, and identified skill gaps (*Asynchronous Job Queues*, *REST API Resiliency*).
6. **Peer Review**: Click **Submit Peer Review** on another project to rate across 6 dimensions.
7. **Skill Matchmaking**: Navigate to **Collaborate** to observe the complementary match between **Alex Chen** (UI/UX) and **Maya Patel** (Backend).
8. **My Learning**: View aggregated skill gaps and interactive roadmaps.
9. **Student Dashboard**: Check statistics, reviews received, and unlocked achievement badges.

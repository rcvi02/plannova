# 📚 StudyFlow — Premium Study Planner

<div align="center">

![StudyFlow Banner](https://img.shields.io/badge/StudyFlow-Premium%20Study%20Planner-7C3AED?style=for-the-badge&logo=bookopen&logoColor=white)

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Redux](https://img.shields.io/badge/Redux%20Toolkit-2-764ABC?style=flat-square&logo=redux)](https://redux-toolkit.js.org)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

**A beautiful, feature-complete study management platform for ambitious students.**

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Pomodoro Focus Timer** | Circular timer with focus/break modes, session tracking, and ambient glow |
| 📊 **Smart Analytics** | Area charts, bar charts, weekday productivity maps, subject distribution |
| 📅 **Study Planner** | Full calendar view with drag-and-drop scheduling |
| ✅ **Task Manager** | Kanban + list views, priority levels, due dates, subject tagging |
| 📖 **Subjects & Progress** | Chapter tracking, study hours, color-coded subjects |
| 🎓 **Exam Countdown** | Prep progress tracking, syllabus checklist, urgency indicators |
| 🧠 **Spaced Repetition** | Smart revision scheduling using SM-2 style intervals |
| 🔥 **Habit Streaks** | Daily habit tracking with 91-day heatmap visualization |
| 🎯 **Goal Tracking** | Daily/weekly/monthly/exam goals with milestone celebrations |
| 📝 **Rich Notes** | TipTap-powered WYSIWYG editor with subject tagging and favorites |
| 🌙 **Dark/Light Mode** | Full system-aware theme with smooth transitions |
| ⌨️ **Command Palette** | `Ctrl+K` global command palette for instant navigation |
| 📱 **Mobile Responsive** | Bottom navigation, drawer sidebars, optimized for all screen sizes |

---

## 🖥️ Screenshots

> *Start the app and navigate to each section to see the full UI.*

- **Dashboard** — `/app/dashboard`
- **Focus Timer** — `/app/timer`
- **Analytics** — `/app/analytics`
- **Habits** — `/app/habits`

---

## 🏗️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18 | UI framework |
| Vite | 5 | Build tool & dev server |
| Redux Toolkit | 2 | State management |
| Redux Persist | 6 | Local storage persistence |
| React Router | 6 | Client-side routing |
| Framer Motion | 10 | Animations & transitions |
| Recharts | 2 | Data visualizations |
| TipTap | 2 | Rich text editor |
| FullCalendar | 6 | Calendar view |
| Tailwind CSS | 3 | Utility-first CSS |
| date-fns | 3 | Date manipulation |
| Lucide React | Latest | Icon system |
| react-hot-toast | 2 | Toast notifications |
| canvas-confetti | 1 | Celebration animations |
| Zod + react-hook-form | Latest | Form validation |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 4 | Web framework |
| MongoDB | 7 | Database |
| Mongoose | 8 | ODM |
| JWT | 9 | Authentication |
| bcryptjs | 2 | Password hashing |
| Helmet | 7 | Security headers |
| express-rate-limit | 6 | Rate limiting |
| node-cron | 3 | Scheduled tasks |
| Multer | 1 | File uploads |

---

## 📁 Project Structure

```
ravi_project/
├── src/                          # Frontend (React)
│   ├── app/
│   │   └── store.js              # Redux store + persist config
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx       # Collapsible sidebar
│   │   │   ├── Navbar.jsx        # Top navigation bar
│   │   │   └── MobileBottomNav.jsx
│   │   └── ui/
│   │       ├── StatCard.jsx      # Dashboard metric cards
│   │       ├── ProgressRing.jsx  # Circular progress
│   │       ├── Modal.jsx         # Accessible modals
│   │       ├── CommandPalette.jsx # Ctrl+K search
│   │       ├── Button.jsx        # Design system button
│   │       └── Badge.jsx         # Status/priority badges
│   ├── features/                 # Redux slices (one per domain)
│   │   ├── authSlice.js
│   │   ├── tasksSlice.js
│   │   ├── subjectsSlice.js
│   │   ├── examsSlice.js
│   │   ├── sessionsSlice.js
│   │   ├── habitsSlice.js
│   │   ├── goalsSlice.js
│   │   ├── notesSlice.js
│   │   ├── revisionsSlice.js
│   │   ├── timerSlice.js
│   │   ├── themeSlice.js
│   │   └── uiSlice.js
│   ├── layouts/
│   │   ├── AppLayout.jsx         # Protected app shell
│   │   └── AuthLayout.jsx
│   ├── pages/                    # Page components (lazy loaded)
│   │   ├── Dashboard/
│   │   ├── FocusTimer/
│   │   ├── Analytics/
│   │   ├── Tasks/
│   │   ├── Subjects/
│   │   ├── Exams/
│   │   ├── Sessions/
│   │   ├── Notes/
│   │   ├── Revision/
│   │   ├── Goals/
│   │   ├── Habits/
│   │   ├── Planner/
│   │   ├── Calendar/
│   │   ├── Settings/
│   │   ├── Today/
│   │   ├── Auth/
│   │   └── Landing/
│   ├── styles/
│   │   └── index.css             # Design tokens + global styles
│   └── utils/
│       ├── helpers.js            # Utility functions
│       └── seedData.js           # Demo data
│
├── server/                       # Backend (Express + MongoDB)
│   └── src/
│       ├── config/
│       │   └── db.js             # MongoDB connection
│       ├── controllers/          # Route handlers
│       │   ├── auth.controller.js
│       │   ├── dashboard.controller.js
│       │   ├── analytics.controller.js
│       │   └── ...
│       ├── middleware/
│       │   ├── auth.js           # JWT verification
│       │   ├── rateLimiter.js    # Rate limiting
│       │   ├── errorHandler.js
│       │   └── validate.js
│       ├── models/               # Mongoose schemas
│       │   ├── User.js
│       │   ├── Task.js
│       │   ├── Session.js
│       │   └── ...
│       ├── routes/               # Express routers
│       ├── app.js                # Express app setup
│       └── server.js             # Entry point
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── .env.example
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+ or pnpm
- MongoDB Atlas account (for backend) or local MongoDB

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/studyflow.git
cd studyflow
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Frontend
VITE_API_URL=http://localhost:5000/api

# Backend (in server/.env)
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studyflow
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3. Run Development Servers

**Frontend only (demo mode — no backend required):**
```bash
npm run dev
```

**Full stack:**
```bash
# Terminal 1 — Frontend
npm run dev

# Terminal 2 — Backend
cd server
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`  
Backend runs at: `http://localhost:5000`

### 4. Demo Mode

The app ships with a fully-seeded demo user. On first launch:
- Auto-login as `Alex Chen` (demo user)
- All seed data is pre-populated
- No signup required to explore all features

---

## 📦 Available Scripts

```bash
# Frontend
npm run dev          # Start dev server (port 5173)
npm run build        # Build production bundle
npm run preview      # Preview production build
npm run lint         # ESLint check

# Backend
cd server
npm run dev          # Start with nodemon
npm start            # Production start
```

---

## 🎨 Design System

The app uses a comprehensive CSS variable system for theming:

```css
/* Core tokens */
--bg-page        /* Page background */
--bg-surface     /* Card/panel background */
--text-primary   /* Main text */
--text-secondary /* Secondary text */
--accent         /* Brand purple (#7C3AED) */
--border         /* Border color */
--success        /* Green (#10B981) */
--danger         /* Red (#F43F5E) */
--warning        /* Amber (#F59E0B) */
```

Themes: `light` | `dark` | `system` (auto-detects OS preference)

---

## 🔐 Backend API Overview

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for the full API reference.

Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/register` — Register new user
- `POST /auth/login` — Login, returns JWT
- `GET /auth/me` — Get current user (requires auth)
- `PUT /auth/me` — Update profile

### Dashboard
- `GET /dashboard/stats` — Today's stats, streak, upcoming exams

### Analytics
- `GET /analytics/overview` — Summary metrics
- `GET /analytics/sessions?days=30` — Session history
- `GET /analytics/subjects` — Subject distribution

---

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step deployment guides for:
- **Frontend** → Vercel
- **Backend** → Render
- **Database** → MongoDB Atlas

---

## 🗺️ Roadmap

- [ ] Google/Apple OAuth login
- [ ] Cloud sync (backend integration)
- [ ] PDF export for notes
- [ ] Study group collaboration
- [ ] AI-powered study recommendations
- [ ] Mobile app (React Native)
- [ ] Offline PWA support
- [ ] Browser extension for distraction blocking

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

<div align="center">

Built with ❤️ for ambitious students everywhere.

**StudyFlow** — *Plan smarter. Focus deeper. Achieve more.*

</div>

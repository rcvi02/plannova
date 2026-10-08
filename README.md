<div align="center">
  <img src="https://raw.githubusercontent.com/SuhaniPatel36/Plannova/main/public/favicon.svg" alt="Plannova Logo" width="100" />

  # 🌟 Plannova (Plannova)
  **Your Ultimate Premium Study Companion**

  [![React](https://img.shields.io/badge/React-19.0-blue.svg?style=for-the-badge&logo=react)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![NodeJS](https://img.shields.io/badge/Node.js-Backend-339933.svg?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248.svg?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
</div>

<br />

Plannova is a highly-polished, enterprise-grade study management platform designed to help students track their academic progress, manage tasks, and stay focused. Featuring a stunning **glassmorphism** design, real-time analytics, and gamified study streaks, Plannova transforms the way you learn.

---

## ✨ Key Features

- 🎯 **Gamified Dashboard**: Track your daily study goals, active streaks, and completed tasks in a beautiful, responsive grid layout.
- ⏱️ **Focus Timer**: Built-in Pomodoro and stopwatch timer to track deep work sessions.
- 📚 **Subject Management**: Organize your curriculum, track syllabus completion, and monitor performance per subject.
- 📝 **Task & Exam Tracking**: Never miss a deadline with prioritized task lists and exam countdowns.
- 📊 **Advanced Analytics**: Beautiful interactive charts (Recharts) showing your weekly study hours and subject distribution.
- 🔐 **Secure Authentication**: Full email/password and **Google OAuth** login integration using JWTs.
- 🎨 **Premium UI/UX**: Fluid micro-animations (Framer Motion), glowing glassmorphism accents, and a dynamic Ocean Blue theme.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS + Custom CSS Variables
- **State Management**: Redux Toolkit + Redux Persist
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT, bcryptjs, Google Auth Library
- **Architecture**: RESTful API design

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/SuhaniPatel36/Plannova.git
cd Plannova
```

### 2. Setup the Backend
Open a terminal and navigate to the backend directory:
```bash
cd server
npm install
```

Create a `.env` file in the `/server` directory and add the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/plannova
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id_here
```

Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal in the project root directory:
```bash
npm install
```

Create a `.env` file in the root directory (optional, for frontend config):
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

Start the development server:
```bash
npm run dev
```
> The frontend will run on `http://localhost:5173`

---

## 💡 Pro Tip: Demo Account
If you want to instantly see the dashboard fully populated with dummy data (tasks, sessions, subjects, analytics), run the seed script!

In the `/server` directory, run:
```bash
node create-demo.js
```
Then log in on the frontend with:
- **Email:** `demo@plannova.com`
- **Password:** `password123`

---

## 🎨 Design System

Plannova heavily relies on CSS variables combined with Tailwind utilities to achieve its sleek, responsive look. Core design pillars include:
1. **Glassmorphism**: Achieved via `glass-surface` utility classes.
2. **Subtle Glows**: Hover states and active elements feature faint `box-shadow` glows (`stat-glow`).
3. **Fluidity**: Route transitions and state changes are animated using `framer-motion`.

---

<div align="center">
  <i>Built with ❤️ for a better study experience.</i>
</div>

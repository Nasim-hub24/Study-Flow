# StudyFlow - Student Study Planner & Analytics Web Application

StudyFlow is a modern single-page web application (SPA) designed to help students plan coursework, track study sessions with interactive Pomodoro timers, and visualize academic habits with clear data analytics.

Reconstructed and built strictly according to the **StudyFlow Product Requirements Document (PRD v1.0)**.

---

## 🌟 Key Features

### 1. Authentication & Accounts (P0)
- **User Registration & Login**: Full auth flow with validation and clear toast feedback via `react-toastify`.
- **Demo Mode**: Instant 1-click test login as pre-configured demo student (Alex Rivera).
- **Session Security**: Client token & state persistence with graceful fallback if the remote backend is cold-starting or unavailable.
- **Profile Management**: Customize student name, avatar URL, program/major, bio, and weekly study goal targets.

### 2. Dashboard Overview (P0)
- **Today's Focus List**: Interactive checkboxes with celebratory confetti upon completion.
- **Summary Metrics**: Real-time counter cards for Today's Tasks, Study Time This Week, Upcoming Deadlines, and Completion Rate. All cards link directly into detailed views.
- **Study Streak**: Active day streak counter with motivational badges.
- **Weekly Progress Chart**: Daily breakdown of study hours logged this week.
- **Empty States**: Helpful guided empty states for new learners.

### 3. Course Subjects & Task Management (P0)
- **Full Task Lifecycle**: Create, edit, complete, and delete tasks with title, course subject, due date, priority (`Urgent`, `High`, `Medium`, `Low`), estimated time, and notes.
- **Subject Management**: Create and customize subjects (e.g. Mathematics, Computer Science, Physics) with distinctive hex color tags used consistently across all charts and schedules.
- **Filters & Search**: Real-time search by keywords, filter by Subject, Status, or Priority, and sort by Due Date, Priority, or Title.
- **Destructive Action Confirmation**: Confirmation dialogs for all deletion operations.

### 4. Interactive Study Timer & Session History (P1)
- **Pomodoro Timer**: 25m Focus / 5m Short Break / 15m Long Break intervals with SVG circular progress ring.
- **Custom Timer & Stopwatch**: Count up or custom countdown focus tracking.
- **Task & Subject Linking**: Link focus minutes directly to any subject or pending assignment.
- **Melodic Audio Chimes**: Web Audio API melodic alerts when timer blocks finish (toggleable).
- **Manual Session Logger**: Record historical or offline study hours with date, duration, and reflection notes.
- **Session History Table**: Searchable, filterable log of all study sessions with duration and reflections.

### 5. Progress Analytics & Visualizations (P1)
- **Recharts Integration**:
  - **Weekly Study Time (Bar Chart)**: Daily focus hours across Monday–Sunday.
  - **Time by Subject (Donut / Pie Chart)**: Subject distribution with accurate subject colors.
  - **Completion Trend**: Task completion velocity, active task breakdowns, and KPI cards.
- **Performance**: Route-level code splitting (`React.lazy`) so Recharts is loaded only when accessing analytics.
- **Accessibility**: All charts include responsive wrappers and accessible text summaries.

### 6. Planning & Goals (P2)
- **7-Day Schedule Grid**: Weekly calendar view mapping out scheduled assignments and completed study blocks by day.
- **Goal Progress Ring**: Visual percentage tracker for weekly study hour targets.
- **Habit Streaks & Motivational Mindset**: Daily rotating focus quotes from renowned thinkers.

### 7. Appearance & Theming (P1)
- **DaisyUI Theme Switcher**: Persisted themes including `Light Flow`, `Dark Mode`, `Cupcake Pastel`, `Emerald Focus`, and `Synthwave Neon`.
- **Responsive Layout**: Mobile-first design tested from 360px up with responsive navigation drawer and desktop sidebar.

---

## 🛠️ Technical Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + React DOM | Component-based reactive UI |
| **Routing** | React Router DOM | Client-side routing with code splitting |
| **Build Tool** | Vite | Dev server & production bundling |
| **Styling** | Tailwind CSS 4 + DaisyUI 5 | Utility CSS & themed UI components |
| **Typography** | Bricolage Grotesque (Google Fonts) | Primary typography |
| **Data Visualisation** | Recharts | Interactive responsive charts |
| **Iconography** | React Icons (`react-icons/fi`) | Consistent Feather icons |
| **Notifications** | React Toastify | Toast feedback for all CRUD & auth actions |
| **Celebrations** | Canvas Confetti | Gamification for task completions & timer goals |
| **Quality** | ESLint 10 (Flat Config) | Static analysis & React Hooks linting |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
# Clone or navigate to the workspace
cd "Study Flow"

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will start at `http://localhost:5173`.

### Production Build & Preview
```bash
# Lint code
npm run lint

# Build production bundle into dist/
npm run build

# Preview build locally
npm run preview
```

---

## 🗺️ Information Architecture & Routes

| Route | Description | Access |
|---|---|---|
| `/` | Landing page with hero, features, testimonials, and demo CTA | Public |
| `/login` | Sign-in page with 1-click Demo Student login | Public |
| `/register` | Account creation page | Public |
| `/dashboard` | Main workspace overview with tasks, metrics & charts | Authenticated |
| `/tasks` | Task list, filtering, and Subject management | Authenticated |
| `/sessions` | Interactive Pomodoro timer & session history | Authenticated |
| `/analytics` | Recharts daily/weekly charts & subject distribution | Authenticated |
| `/planner` | 7-day schedule grid, weekly target & streak badges | Authenticated |
| `/settings` | Profile, appearance, theme switcher & data backup | Authenticated |
| `*` | 404 Not Found error screen with return-to-home actions | Public |

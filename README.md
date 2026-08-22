# ⚡ XDrop — Next-Gen Social Media & Content Broadcasting SPA

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/React_Router-v7.0-CA4245?logo=react-router&logoColor=white" alt="React Router v7" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" />
</p>

> **XDrop** is an ultra-premium, high-performance content publishing and social media Single Page Application (SPA). Designed with senior UI/UX standards, XDrop features Threads/Twitter-style social publishing, custom glassmorphism design systems, real-time fallback mock database architecture, and deep creator analytics.

---

## 📖 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚡ Quick Start & Setup](#-quick-start--setup)
- [🔐 Sandbox Mode & Demo Credentials](#-sandbox-mode--demo-credentials)
- [🏗️ Project Architecture](#️-project-architecture)
- [🔀 Route Reference](#-route-reference)
- [⚙️ Environment Variables](#️-environment-variables)
- [📜 Available Scripts](#-available-scripts)
- [🤝 Contributing & License](#-contributing--license)

---

## ✨ Key Features

### 🚀 Senior-Grade Publisher Canvas
- **Threads/Twitter-Style Publisher:** Minimalist centered post composer with integrated avatar header, public broadcast status, hashtag pills, and cover attachment previews.
- **Collapsible Insights Drawer:** Slide-out inspector containing real-time readability quality metrics (Flesch-Kincaid formula score), word counts, estimated reading time, and local drafts manager.
- **Inline Formatting Tools:** Injection macros for Bold, Italic, Blockquotes, Code blocks, and Lists.
- **Circular Progress Ring:** Dynamic SVG circular meter tracking character density in real time.

### 🤝 Social Interactions & Network Dynamics
- **Interactive Likes Popover:** Split like-toggling from count triggers. Clicking numeric counts opens a glassmorphic **"Liked by"** modal showing creator avatars, handles, professions, and direct **Follow/Unfollow** toggles.
- **Global Event Synchronization:** Follow/unfollow actions automatically update creator cards across the feed in real-time via custom browser events.
- **Interactive User Profiles:** Grid-based post display with a dynamic **Grid/List view switcher**, custom cover photo uploader (persisted in `localStorage`), and audience connection manager.

### 🎨 Premium Aesthetics & UI System
- **Forest Green & Glassmorphism Design:** Solarized-inspired color palette styled with custom CSS variables (`index.css`), smooth backdrop filters, and subtle micro-animations (`framer-motion`).
- **Background Mesh Canvas:** Floating, soft neon gradient spheres drifting in the background to add visual depth without compromising scroll performance.
- **Multi-Theme Support:** Seamless Dark/Light/System theme transitions powered by a custom `ThemeProvider`.

### 🛡️ Offline-First Self-Healing Architecture
- **Automatic Fallback (Sandbox Mode):** If the backend REST API (`localhost:2000`) is offline, Axios interceptors seamlessly switch to a client-side mock database adapter (`mockDb.js`) without breaking user flow.
- **Connection Badge:** Live/Sandbox status pill in the navigation header allowing users to test and recover live server connections at any time.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework & Build** | React 19, Vite 7, React Router DOM v7 |
| **Styling & UI** | Tailwind CSS v4, Vanilla CSS variables, Shadcn/UI (Radix primitives) |
| **State & API** | React Context API, Axios (with dual live/mock interceptors) |
| **Forms & Validation** | React Hook Form, Zod schema validation |
| **Animations & Icons** | Framer Motion, Lucide React Icons |
| **Charts & 3D** | Recharts, Spline 3D (@splinetool/react-spline) |

---

## ⚡ Quick Start & Setup

### Prerequisites
Make sure you have Node.js (v18.x or later) and `npm` installed on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/anshul4117/Blog-client.git
cd Blog-client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (or copy from `.env.example`):
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
VITE_API_BASE_URL=http://localhost:2000/api/v1.2
```

### 4. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 🔐 Sandbox Mode & Demo Credentials

If you do not have the backend API server running locally on port `2000`, **XDrop automatically activates Sandbox Mode**. All creations, likes, edits, and profile updates will be safely persisted in your browser's `localStorage`.

### 🔑 Demo Login Credentials
Click the **"Autofill Demo Credentials"** button on the `/login` page or enter manually:

- **Email:** `demo@example.com`
- **Password:** `password123`

---

## 🏗️ Project Architecture

```
Client/
├── public/                      # Static assets (favicon.svg, manifest)
├── src/
│   ├── main.jsx                 # Application Entry Point
│   ├── App.jsx                  # Main App Component
│   ├── index.css                # Tailwind base + custom CSS variables & theme tokens
│   │
│   ├── routes/                  # Route Guards & Definitions
│   │   ├── AppRoutes.jsx        # Lazy-loaded route map
│   │   ├── PrivateRoute.jsx     # Authentication guard
│   │   └── PublicRoute.jsx      # Guest-only guard
│   │
│   ├── context/                 # Global Context Providers
│   │   └── AuthContext.jsx      # Auth state & user session manager
│   │
│   ├── lib/                     # Utilities & API Interceptors
│   │   ├── secureApi.js         # Primary Axios client with mock fallback interceptor
│   │   ├── api.js               # Secondary Axios client
│   │   ├── mockDb.js            # Standalone LocalStorage Database & API Route Emulator
│   │   └── utils.js             # Utility functions (`cn` class merger)
│   │
│   ├── components/              # Reusable UI Primitives & Layouts
│   │   ├── ui/                  # Shadcn primitives (button, card, dialog, input, etc.)
│   │   ├── blog/                # Blog components (PostCard.jsx)
│   │   └── layout/              # Navbar, Footer, PageTransition, BackgroundMesh
│   │
│   ├── features/                # Domain Feature Modules
│   │   ├── Auth/                # Login & Register pages
│   │   ├── Dashboard/           # Creator dashboard, CreatePost, EditPost, MyPosts
│   │   ├── Profile/             # Profile page, settings sub-pages
│   │   └── Support/             # Help & FAQ page
│   │
│   └── pages/                   # Top-level standalone pages (Home, Feed, About, Contact)
│
├── vite.config.js               # Vite bundler configuration
└── package.json                 # Project dependencies & scripts
```

---

## 🔀 Route Reference

| Route | Component | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | `Home` | Public | Landing page with animated hero, marquee, & counters |
| `/about` | `About` | Public | Manifesto and project mission |
| `/contact` | `Contact` | Public | Contact form with Zod validation |
| `/login` | `Login` | Guest | Login page with Sandbox Autofill |
| `/register` | `Register` | Guest | Account registration |
| `/feed` | `Feed` | Private | Community blog discovery feed |
| `/post/:id` | `PostDetails` | Private | Single post view & comment thread |
| `/dashboard` | `DashboardHome` | Private | Analytics overview & publishing heatmaps |
| `/dashboard/create` | `CreatePost` | Private | Threads/Twitter-style social post publisher |
| `/dashboard/posts` | `MyPosts` | Private | Published posts manager grid |
| `/dashboard/saved` | `SavedPosts` | Private | Bookmarked publications |
| `/dashboard/settings` | `Setting` | Private | User account & security console |
| `/profile` | `Profile` | Private | User profile page with grid/list post view |

---

## ⚙️ Environment Variables

| Variable | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | String | `http://localhost:2000/api/v1.2` | Base URL for backend REST API endpoints |

---

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev`: Starts the Vite development server at `http://localhost:5173`.
- `npm run build`: Bundles the application for production into the `dist/` directory.
- `npm run preview`: Locally previews the production build output.
- `npm run lint`: Scans source code for potential linting issues.

---

## 🤝 Contributing & License

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/anshul4117/Blog-client/issues).

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Designed & Built with ❤️ by <b>Anshul</b> (<a href="https://github.com/anshul4117">@anshul4117</a>)
</p>

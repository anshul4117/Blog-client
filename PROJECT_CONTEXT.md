# 🧠 Master Engineering Context — XDrop (Client)

> **Source of Truth Document for AI Agents & Developers**  
> **Last Verified:** 2026-08-24  
> **Repository:** `https://github.com/anshul4117/Blog-client.git`  
> **Architecture Version:** `v1.2-client`

---

## 1. PROJECT IDENTITY

| Attribute | Specification |
| :--- | :--- |
| **App Name** | **XDrop** (Client) |
| **Type** | Next-Gen Social Media & Content Broadcasting Platform — Frontend SPA |
| **Primary Purpose** | Enable creators, developers, and writers to publish broadcast signals, engage with interactive audience networks, analyze content reach velocity, and manage publications. |
| **Target Users** | Content creators, developers, technical writers, digital storytellers, and designers. |
| **Main UX Characteristics** | Solarized Forest Green glassmorphic design, sub-50ms optimistic social loops, Threads/Twitter-style social post publisher card, interactive likes modal with direct follow triggers, and real-time network reconnection badges. |
| **Differentiators** | **Self-Healing Offline Resilient Sandbox Architecture** (`mockDb.js`) via Axios request/response interceptors; zero-downtime offline fallback to `localStorage` when backend REST servers are unreachable. |
| **Development Stage** | Production-Ready Frontend SPA (Complete Mock DB parity & live API integration ready). |
| **Deployment Status** | Local Dev / Production Vite Build (`npm run build` outputs to `dist/`). |
| **Base API Version** | `v1.2` — Base URL: `VITE_API_BASE_URL` (default: `http://localhost:2000/api/v1.2`). |

---

## 2. TECHNOLOGY STACK

The following dependencies are explicitly installed and used in the actual source code (`package.json`):

| Dependency | Installed Version | Usage Location | Architectural Purpose |
| :--- | :--- | :--- | :--- |
| **React** | `19.1.1` | `src/main.jsx`, `src/App.jsx`, all components | Core UI library for component rendering and state trees. |
| **Vite** | `7.1.7` | `vite.config.js`, `package.json` | High-speed ESM bundler and HMR dev server with `@tailwindcss/vite` `4.1.14`. |
| **Tailwind CSS** | `4.1.14` | `src/index.css`, components | Utility-first styling engine integrated with custom CSS variables. |
| **Vanilla CSS** | Standard CSS3 | `src/index.css`, `src/App.css` | Global CSS design tokens, HSL color variables, and glassmorphism panel utility classes. |
| **React Router DOM** | `7.9.4` | `src/routes/AppRoutes.jsx` | SPA routing with lazy-loaded routes, nested layouts, and route guards (`PrivateRoute`, `PublicRoute`). |
| **Axios** | `1.12.2` | `src/lib/secureApi.js`, `src/lib/api.js` | HTTP client featuring request/response interceptors with automatic sandbox adapter fallback (`handleMockRequest`). |
| **Context API** | Native React | `src/context/AuthContext.jsx` | Global state provider for user authentication session management. |
| **React Hook Form** | `7.65.0` | `src/features/Auth/Pages/*`, `CreatePost.jsx`, `EditPost.jsx` | Uncontrolled form state management with performance optimization. |
| **Zod** | `4.1.12` | `src/features/Auth/Pages/*`, `CreatePost.jsx`, `Contact.jsx` | Schema validation paired with `@hookform/resolvers` `5.2.2`. |
| **Framer Motion** | `12.23.26` | `src/components/layout/PageTransition.jsx`, `DashboardHome.jsx`, modal dialogs | Micro-animations, page route transitions, staggered card entrances, and physics-based popovers. |
| **Lucide React** | `0.546.0` | Entire codebase | Modern icon system for UI controls and visual indicators. |
| **Recharts** | `3.6.0` | `DashboardHome.jsx`, `AnalyticsChart.jsx`, `StatDetailDialog.jsx` | Area charts, Bar charts, Radar charts, and interactive tooltips. |
| **Spline 3D** | `@splinetool/react-spline` `4.1.0` | `src/pages/Home.jsx` | Interactive 3D hero model rendering. |
| **Shadcn/UI (Radix)** | `@radix-ui/react-*` | `src/components/ui/*` | Accessible primitives (Accordion, Dialog, DropdownMenu, Label, Slot, Switch). |
| **React Hot Toast** | `2.6.0` | Entire codebase | Non-blocking toast notification feedback system. |

---

## 3. COMPLETE PROJECT STRUCTURE

```
Client/
├── public/                      # Static public assets (favicon.svg, manifest)
├── src/
│   ├── main.jsx                 # Application entry point (BrowserRouter > AuthProvider > ThemeProvider > App)
│   ├── App.jsx                  # Root container rendering <AppRoutes />
│   ├── index.css                # Global Tailwind v4 base styles, CSS variables, & HSL tokens
│   ├── App.css                  # App-level style overrides
│   │
│   ├── routes/                  # 🔀 Route Configuration & Access Guards
│   │   ├── AppRoutes.jsx        # Lazy-loaded route map and nested router
│   │   ├── PrivateRoute.jsx     # Auth guard — redirects unauthenticated users to /login
│   │   └── PublicRoute.jsx      # Guest guard — redirects authenticated users away from auth pages
│   │
│   ├── context/                 # 🌐 Global State Providers
│   │   └── AuthContext.jsx      # Auth state manager (user session, login, logout)
│   │
│   ├── lib/                     # 📡 Network, Interceptors & Mock Database
│   │   ├── secureApi.js         # Primary Axios client with automatic Sandbox fallback interceptor
│   │   ├── api.js               # Secondary Axios client
│   │   ├── mockDb.js            # Client-side LocalStorage Database Emulator & Mock API Router
│   │   └── utils.js             # Helper utilities (`cn()` class merger using clsx & tailwind-merge)
│   │
│   ├── components/              # 🧩 Reusable UI Components
│   │   ├── ui/                  # Shadcn primitives (button, card, dialog, dropdown-menu, input, password-input, skeleton, switch, textarea)
│   │   │   ├── BackgroundMesh.jsx      # Animated floating neon gradient bubbles
│   │   │   ├── CustomCursor.jsx        # Glowing interactive cursor (desktop only)
│   │   │   ├── ParticleBackground.jsx  # Canvas-based particle animation engine
│   │   │   ├── OptimizedImage.jsx      # Image component with loading state handling
│   │   │   └── SpotlightSearch.jsx     # Cmd/Ctrl+K search modal
│   │   ├── blog/
│   │   │   └── PostCard.jsx            # Multi-layout blog card (Grid/List/Featured) with Likes Popover
│   │   ├── notifications/
│   │   │   └── NotificationPanel.jsx   # Slide-out real-time notifications panel
│   │   └── layout/
│   │       ├── Navbar.jsx              # Navigation header with live/sandbox status badge
│   │       ├── Footer.jsx              # Application footer
│   │       ├── MainLayout.jsx          # Public page wrapper layout
│   │       ├── PageTransition.jsx      # Framer Motion page wrapper
│   │       └── ScrollToTop.jsx         # Automatic scroll reset on route changes
│   │
│   ├── features/                # 📦 Modular Feature Domains
│   │   ├── Auth/
│   │   │   ├── Pages/                  # Login.jsx, Register.jsx, ForgotPassword.jsx
│   │   │   └── Components/             # AuthLayout.jsx
│   │   ├── Dashboard/
│   │   │   ├── Pages/                  # DashboardHome.jsx, MyPosts.jsx, CreatePost.jsx, EditPost.jsx, SavedPosts.jsx, PostDetails.jsx, NotificationsPage.jsx, SettingsPlaceholder.jsx
│   │   │   └── Components/             # DashboardLayout.jsx, Sidebar.jsx, MobileBottomBar.jsx, AnalyticsChart.jsx, StatDetailDialog.jsx
│   │   ├── Profile/
│   │   │   └── Pages/                  # Profile.jsx, Setting.jsx, Security.jsx, Privacy.jsx, Appearance.jsx, UpdateProfile.jsx, BlockedUsers.jsx, AccountCenter.jsx
│   │   └── Support/
│   │       └── Pages/                  # Help.jsx
│   │
│   ├── pages/                   # 📄 Top-Level Standalone Pages
│   │   ├── Home.jsx                    # Landing page with hero 3D, marquee & counter stats
│   │   ├── Feed.jsx                    # Public/Protected blog discovery feed
│   │   ├── About.jsx                   # Project manifesto and story
│   │   ├── Contact.jsx                 # Public contact page with Zod validation
│   │   └── NotFound.jsx                # 404 Catch-all error page
│   │
│   ├── theme-provider.jsx       # Theme state provider (Dark/Light/System)
│   └── mode-toggle.jsx          # Theme mode toggle button component
│
├── vite.config.js               # Vite build & alias configuration (@ -> src)
└── package.json                 # Project manifest & dependency constraints
```

---

## 4. APPLICATION ARCHITECTURE

```
  +-----------------------------------------------------------------------+
  |                             USER BROWSER                              |
  +-----------------------------------------------------------------------+
                                     |
                                 Interacts
                                     v
  +-----------------------------------------------------------------------+
  |                         REACT UI COMPONENTS                           |
  |  (Feed, DashboardHome, CreatePost, Profile, PostCard, Auth Pages)     |
  +-----------------------------------------------------------------------+
                                     |
                          Reads/Mutates State
                                     v
  +-----------------------------------------------------------------------+
  |                     GLOBAL STATE & HOOK CONTEXTS                      |
  |                (AuthContext.jsx -> currentUser Session)               |
  +-----------------------------------------------------------------------+
                                     |
                           Issues HTTP Request
                                     v
  +-----------------------------------------------------------------------+
  |                   AXIOS INTERCEPTOR (secureApi.js)                    |
  |  - Attaches `Authorization: Bearer <token>` Header                    |
  |  - Checks `localStorage.getItem("blog_app_demo_mode") === "true"`     |
  +-----------------------------------------------------------------------+
                        /                         \
         Live Connection                       Network Error / Demo Mode
                       /                           \
                      v                             v
  +-----------------------+             +----------------------------------+
  | BACKEND REST API SERVER|             | STANDALONE SANDBOX MOCK ADAPTER  |
  |  (localhost:2000/api) |             |        (lib/mockDb.js)           |
  +-----------------------+             +----------------------------------+
                                                        |
                                              Reads / Writes Data
                                                        v
                                        +----------------------------------+
                                        |      LOCALSTORAGE PERSISTENCE    |
                                        | (mock_db_blogs, mock_db_users,   |
                                        |  mock_db_drafts, followers, etc.)|
                                        +----------------------------------+
```

---

## 5. ROUTING REFERENCE

All routes are defined in `src/routes/AppRoutes.jsx` using `React.lazy()` code splitting:

| Route Path | Component | Protection | Layout | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `Home` | `PublicRoute` (Guest Only) | Independent | Landing page with 3D Spline hero, infinite marquee, and features. |
| `/login` | `Login` | `PublicRoute` (Guest Only) | `AuthLayout` | Login form with Demo Autofill (`demo@example.com` / `password123`). |
| `/register` | `Register` | `PublicRoute` (Guest Only) | `AuthLayout` | Account creation form with Zod validation. |
| `/forgot-password` | `ForgotPassword` | `PublicRoute` (Guest Only) | `AuthLayout` | Password recovery workflow. |
| `/about` | `About` | Public (All) | `MainLayout` | Manifesto and company vision page. |
| `/contact` | `Contact` | Public (All) | `MainLayout` | Contact form with input validation. |
| `/help` | `Help` | Public (All) | `MainLayout` | Help center and FAQ accordions. |
| `/feed` | `Feed` | `PrivateRoute` (Protected) | `DashboardLayout` | Community blog post discovery feed. |
| `/post/:id` | `PostDetails` | `PrivateRoute` (Protected) | `DashboardLayout` | Single post view, likes popover, and comments thread. |
| `/profile` | `Profile` | `PrivateRoute` (Protected) | `DashboardLayout` | User profile page with grid/list post view and cover uploader. |
| `/dashboard` | `DashboardHome` | `PrivateRoute` (Protected) | `DashboardLayout` | Creator dashboard overview, KPI stats, and reach velocity charts. |
| `/dashboard/posts` | `MyPosts` | `PrivateRoute` (Protected) | `DashboardLayout` | User's published posts grid manager. |
| `/dashboard/saved` | `SavedPosts` | `PrivateRoute` (Protected) | `DashboardLayout` | Bookmarked publications list. |
| `/dashboard/create` | `CreatePost` | `PrivateRoute` (Protected) | Independent Card | Threads/Twitter-style social post publisher with slide-out inspector. |
| `/dashboard/edit/:id` | `EditPost` | `PrivateRoute` (Protected) | Independent Card | Post editing workspace matching `CreatePost.jsx`. |
| `/dashboard/notifications`| `NotificationsPage`| `PrivateRoute` (Protected)| `DashboardLayout` | User notifications stream page. |
| `/dashboard/settings` | `Setting` | `PrivateRoute` (Protected) | `DashboardLayout` | Settings hub navigation page. |
| `/dashboard/settings/profile` | `UpdateProfile` | `PrivateRoute` (Protected) | `DashboardLayout` | Profile details update form. |
| `/dashboard/settings/security` | `Security` | `PrivateRoute` (Protected) | `DashboardLayout` | Password update, 2FA toggle, and active sessions manager. |
| `/dashboard/settings/blocked` | `BlockedUsers` | `PrivateRoute` (Protected) | `DashboardLayout` | Blocked users list and unblock triggers. |
| `/dashboard/settings/account-center` | `AccountCenter` | `PrivateRoute` (Protected) | `DashboardLayout` | Security hub and SaaS profile analytics console. |
| `/dashboard/settings/privacy` | `Privacy` | `PrivateRoute` (Protected) | `DashboardLayout` | Privacy preference settings. |
| `/dashboard/settings/appearance` | `Appearance` | `PrivateRoute` (Protected) | `DashboardLayout` | Theme appearance selector (Dark/Light/System). |
| `/dashboard/settings/:category` | `SettingsPlaceholder` | `PrivateRoute` (Protected) | `DashboardLayout` | Dynamic fallback for under-construction settings routes. |
| `*` | `NotFound` | Public (All) | Independent | 404 Error page. |

---

## 6. AUTHENTICATION SYSTEM

### Session Management & Persistence
* **State Source:** `AuthContext.jsx` manages `user` state, initialized synchronously from `localStorage.getItem("currentUser")`.
* **Session Key:** `"currentUser"` stores `{ _id, name, username, email, profilePicture, token, refreshToken }`.
* **Login Flow:**
  1. User submits `Login.jsx` form or clicks **"Autofill Demo Credentials"** (`demo@example.com` / `password123`).
  2. Request sent to `POST /users/login` via `secureApi.js`.
  3. On success (or mock fallback resolution), `AuthContext.login(userData)` writes to `localStorage` and updates `user` state.
  4. User is redirected to `/feed`.
* **Logout Flow:**
  1. User clicks **Logout** in Navbar or Sidebar.
  2. `AuthContext.logout()` removes `"currentUser"` from `localStorage` and resets state to `null`.
  3. `PrivateRoute` automatically intercepts and redirects user to `/login`.

---

## 7. MOCK DATABASE & SANDBOX MODE (`mockDb.js`)

To guarantee seamless execution when the backend API is offline, XDrop runs a client-side database engine inside `src/lib/mockDb.js`.

### LocalStorage Schema Map

| Key | Purpose | Initial Seed Data |
| :--- | :--- | :--- |
| `blog_app_demo_mode` | String (`"true"` / `"false"`) controlling sandbox bypass. | Set to `"true"` on network error. |
| `currentUser` | Currently authenticated user session object. | Initialized on login. |
| `mock_db_blogs` | Array of blog post objects. | Seeded with 3 rich articles (`mock-blog-1`, `mock-blog-2`, `mock-blog-3`). |
| `mock_db_users` | Array of registered user profile objects. | Seeded with 5 creator profiles (Anshul, Elara, Kaelen, Lyra, Soren). |
| `mock_db_drafts` | Array of unpublished draft post objects. | Initialized as `[]`. |
| `mock_db_saved_blogs` | Array of bookmarked blog post IDs. | Initialized as `[]`. |
| `mock_db_followers` | Array of user IDs following the current user. | Seeded with `["mock-user-admin", "mock-user-lyra", "mock-user-soren"]`. |
| `mock_db_following` | Array of user IDs the current user is following. | Seeded with `["mock-user-admin", "mock-user-elara", "mock-user-kaelen"]`. |
| `mock_db_notifications` | Array of user notification items. | Seeded with system alerts. |
| `profile_cover_<id>` | Base64 string of uploaded profile cover photo. | Saved on profile cover change. |

### Automatic Sandbox Network Fallback Workflow
1. User interacts with UI (e.g. likes a post, fetches feed, updates profile).
2. `secureApi.js` executes HTTP request to `import.meta.env.VITE_API_BASE_URL`.
3. If the backend is offline (`ERR_NETWORK`), the Axios response interceptor catches the error.
4. `secureApi.js` sets `localStorage.setItem("blog_app_demo_mode", "true")` and dispatches `window.dispatchEvent(new Event("connection-change"))`.
5. The request is dynamically re-routed to `handleMockRequest(config)` inside `mockDb.js`.
6. Subsequent requests automatically bypass the network layer because `secureApi.js` request interceptor checks `localStorage.getItem("blog_app_demo_mode") === "true"` and sets `config.adapter = handleMockRequest`.
7. Users can click the **Live/Sandbox** connection pill in the Navbar to test backend connectivity and switch back to Live Mode.

---

## 8. API & AXIOS ARCHITECTURE

### Configuration (`secureApi.js`)
* **Base URL:** `import.meta.env.VITE_API_BASE_URL` (default: `http://localhost:2000/api/v1.2`).
* **Headers:** `Content-Type: application/json`, `X-Content-Type-Options: nosniff`.
* **Authorization:** Automatically attaches `Authorization: Bearer <token>` from `"currentUser"`.

### Intercepted Mock Endpoint Parity

| Method | Endpoint Path | Mock Implementation in `mockDb.js` |
| :--- | :--- | :--- |
| `POST` | `/users/login` | Authenticates against `mock_db_users` or generates demo session. |
| `POST` | `/users/register` | Creates new user entry in `mock_db_users`. |
| `GET` | `/users/profile` | Resolves profile info for logged-in user or `userId` query param. |
| `PUT` / `PATCH` | `/users/update-profile` | Merges profile updates and saves to `mock_db_users`. |
| `GET` | `/blogs/allblogs` | Returns all blogs from `mock_db_blogs`. |
| `GET` | `/blogs/myblogs` | Filters `mock_db_blogs` authored by current user or `userId`. |
| `GET` | `/blogs/post/:id/likes` | Resolves list of user objects who liked post `:id`. (Positioned *above* generic single post lookup). |
| `GET` | `/blogs/post/:id` | Returns single blog post object matching `:id`. |
| `POST` | `/blogs/create` | Adds new post to `mock_db_blogs`. |
| `PATCH` / `PUT` | `/blogs/edit/:id` | Updates existing post in `mock_db_blogs`. |
| `DELETE` | `/blogs/del-blog/:id` | Removes post from `mock_db_blogs`. |
| `POST` | `/blogs/like/:id` | Toggles user ID in post's `likes` array and updates `likeCount`. |

---

## 9. DATA MODELS

### 1. User Model
```typescript
interface User {
  _id: string;                  // e.g. "mock-user-admin"
  name: string;                 // e.g. "Anshul"
  username: string;             // e.g. "anshul4117"
  email: string;                // e.g. "demo@example.com"
  profilePicture?: string;      // Avatar URL
  profession?: string;          // e.g. "Founder & Architect"
  role?: string;                // e.g. "Admin"
  bio?: string;                 // Profile bio text
  location?: string;            // e.g. "Neo-Tokyo, Earth"
  dateOfJoin?: string;          // ISO Date string
  token?: string;               // JWT Bearer token
  socialLinks?: {
    github?: string;
    twitter?: string;
    website?: string;
  };
  interests?: string[];
}
```

### 2. Blog / Post Model
```typescript
interface Blog {
  _id: string;                  // e.g. "mock-blog-1"
  title: string;                // Post title
  content: string;              // Post body (supports Markdown)
  createdAt: string;            // ISO Date string
  tags: string[];               // Array of hashtag strings
  likes: string[];              // Array of user IDs who liked this post
  likeCount: number;            // Length of likes array
  comments?: Comment[];         // Array of comment objects
  commentCount: number;         // Total comment count
  bookmarks?: number;           // Total bookmark count
  image?: string | { url: string }; // Cover image URL or nested object
  userId: {                     // Author details
    _id: string;
    name: string;
    username: string;
    profilePicture?: string;
  };
}
```

---

## 10. FEATURE INVENTORY

| Feature Category | Implementation Status | Details |
| :--- | :---: | :--- |
| **Authentication** | ✅ Complete | Login, Register, Demo Autofill, Logout, Forgot Password with Zod validation. |
| **Blog Feed** | ✅ Complete | Discovery feed (`Feed.jsx`), multi-layout cards, lazy loading. |
| **Social Publisher** | ✅ Complete | Threads/Twitter-style card publisher (`CreatePost.jsx`, `EditPost.jsx`), inline Markdown tools, circular SVG character meter, slide-out inspector drawer. |
| **Drafts Management** | ✅ Complete | Save to draft, edit draft, load draft into publisher, delete draft. |
| **Likes Popover** | ✅ Complete | Separated heart toggle from numeric count trigger. Popover displays list of user profiles with follow triggers. |
| **Follow System** | ✅ Complete | Optimistic follow/unfollow toggle, custom `following-change` window event sync across all post cards. |
| **Creator Dashboard** | ✅ Complete | KPI stats cards, channel reach breakdown, Recharts area growth chart, recent publications feed, quick action bar (`DashboardHome.jsx`). |
| **Profile Management** | ✅ Complete | Profile view (`Profile.jsx`), custom cover banner uploader, publications grid/list view switcher, audience modal dialog. |
| **Settings Hub** | ✅ Complete | Working Security (2FA toggle, active sessions), Blocked Users list, Account Center SaaS analytics, Privacy, and Appearance theme switcher. Dynamic fallback (`SettingsPlaceholder.jsx`) for placeholder sub-routes. |
| **Dark/Light Theme** | ✅ Complete | System-aware theme toggle via `ThemeProvider` and CSS variables. |
| **Spotlight Search** | ✅ Complete | Cmd/Ctrl+K modal (`SpotlightSearch.jsx`) for instant navigation. |
| **Notifications** | ✅ Complete | Notifications panel (`NotificationPanel.jsx`) and dedicated page (`NotificationsPage.jsx`). |
| **Offline Sandbox Mode** | ✅ Complete | Automatic Axios interception on network failure, full CRUD emulation in `mockDb.js`. |

---

## 11. UI & DESIGN SYSTEM

* **Color Palette:** Solarized Forest Green theme (`#2B5748` in light mode, `#4B7E6B` in dark mode) dynamically mapped via CSS variables in `index.css`.
* **Glassmorphism:** Class utilities `.glass-panel` and `.glass-card` providing background blur (`backdrop-blur-xl`), subtle borders (`border-primary/10`), and soft drop shadows.
* **Background Mesh:** `<BackgroundMesh />` component rendering floating, soft neon gradient spheres that drift in the background.
* **Typography:** Inter & Outfit sans-serif font pairings with strict uppercase tracking badges.

---

## 12. RESPONSIVE & PERFORMANCE OPTIMIZATIONS

1. **Code Splitting:** All top-level page routes in `AppRoutes.jsx` use `React.lazy()` and `Suspense` with a custom loading indicator.
2. **Mobile Viewport Optimization (<768px):**
   * Particle counts and canvas drawings in `ParticleBackground.jsx` and `BackgroundMesh.jsx` are dynamically throttled on mobile viewports to preserve scroll FPS.
   * Touch viewports suppress mousemove tracking listeners in `CustomCursor.jsx` to prevent repaint lag.
3. **Marquee Infinite Scroll:** Uses a `w-max` container with `shrink-0` copy layers to guarantee non-wrapping, hardware-accelerated CSS translation.
4. **Optimized Images:** `<OptimizedImage />` component handles image loading states and fallback placeholders.

---

## 13. ERROR HANDLING & SECURITY AUDIT

* **Native Dialog Audit:** Zero instances of native `alert()`, `confirm()`, or `prompt()` exist in `src/`. All alerts use `react-hot-toast` toasts or Shadcn `Dialog` modals.
* **Form Validation:** React Hook Form + Zod schema validation on Login, Register, Contact, CreatePost, and Settings.
* **404 Catch-All:** Unmatched routes redirect to `NotFound.jsx`.

---

## 14. FRONTEND ROADMAP

### Completed ✅
- Senior-grade social media publisher card (`CreatePost.jsx`, `EditPost.jsx`).
- Dynamic creator dashboard (`DashboardHome.jsx`) with Recharts area chart and KPI cards.
- Profile page with custom cover uploader and grid/list publications switcher.
- Interactive likes modal dialog with inline follow toggles.
- Self-healing offline sandbox adapter (`mockDb.js`) with automatic network failure interception.

### Remaining / Optional Enhancements 🟡
- WebSockets for live server notifications (currently emulated).
- Multi-file image carousel uploads in publisher.

---

## 15. RULES FOR FUTURE AI AGENTS

1. **Preserve Design Language:** Always follow XDrop's Forest Green color palette, glassmorphism panel styles, and HSL CSS variables.
2. **Do Not Break Sandbox Mode:** Never disable or bypass `mockDb.js` or the Axios network error fallback interceptor in `secureApi.js`.
3. **Reuse Existing Components:** Reuse `Button`, `Card`, `Dialog`, `PostCard`, `BackgroundMesh`, and Shadcn primitives instead of writing duplicate components.
4. **No Native Alerts:** Always use `react-hot-toast` or Shadcn `Dialog` for notifications and confirmations. Never use native `alert()`, `confirm()`, or `prompt()`.
5. **Maintain Route Priority in MockDB:** In `mockDb.js`, specific route matchers (e.g. `/blogs/post/:id/likes`) MUST remain defined *above* generic parametric matchers (e.g. `/blogs/post/:id`).
6. **Keep Mobile Performance Fast:** Keep particle count throttling and touch listener suppression intact for viewports `<768px`.

---

## 16. INTERVIEW / PORTFOLIO SUMMARY

* **30-Second Summary:** XDrop is a high-performance content publishing SPA built with React 19, Vite 7, and Tailwind v4. It features a Threads/Twitter-style card publisher, creator analytics, and a self-healing offline sandbox adapter that guarantees zero downtime when the backend is offline.
* **Strongest Technical Feature:** The automatic network interception pipeline in `secureApi.js` that seamlessly falls back to a client-side LocalStorage database emulator (`mockDb.js`) on network failures, preserving user actions offline.
* **Key Architectural Highlight:** Decoupled social interaction loops (splitting like toggling from count clicks) synced across components via window events and optimistic state updates.

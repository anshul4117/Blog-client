# 📘 Technical Documentation — XDrop (Client)

This document provides a comprehensive technical overview of the architecture, design patterns, routes, APIs, and data schemas governing the **XDrop (Client)** Single Page Application.

---

## 1. Project Overview & Aesthetic Principles

**XDrop** is a Web3-inspired, highly animated social media and blogging platform. It is designed around premium UX guidelines:
*   **Visual Styling:** Curated, HSL-tailored **Forest Green Theme** (`#2B5748` light / `#4B7E6B` dark) mapped dynamically via CSS custom variables in `index.css`.
*   **Tactility:** Leverages glassmorphic panels (`glass-panel`, `glass-card`), blur backdrops, custom mouse cursors, and Framer Motion micro-animations to make components feel responsive and organic.
*   **Mobile Adaptability:** Suppresses CPU-intensive mouse tracking, throttles particle counts, and converts desktop preview widgets into overlays/dialogs on touch devices to guarantee maximum scroll performance (INP/LCP).

---

## 2. System Architecture & Failover Mechanics

The client utilizes a self-healing Request-Response lifecycle to support offline standalone execution.

```
                  ┌───────────────────────────────┐
                  │       React Components        │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                     ┌──────────────────────────┐
                     │ Axios Interceptor Logic  │
                     └────────────┬─────────────┘
                                  │
                     (Check blog_app_demo_mode)
                     ┌────────────┴────────────┐
                     │                         │
            demo_mode == true          demo_mode == false
                     │                         │
                     ▼                         ▼
         ┌───────────────────────┐   ┌───────────────────┐
         │  Mock DB REST Router  │   │ Live Node Server  │
         │     (mockDb.js)       │   │ (localhost:2000)  │
         └───────────┬───────────┘   └─────────┬─────────┘
                     │                         │
                     │                     (Connection
                     ▼                       Failed)
              ┌─────────────┐                  │
              │             │                  ▼
              │LocalStorage │        ┌───────────────────┐
              │             │        │ Activate demoMode │
              └─────────────┘        │  & Retry request  │
                                     └─────────┬─────────┘
                                               │
                                               ▼
                                     ┌───────────────────┐
                                     │  mockDb.js Router │
                                     └───────────────────┘
```

### 2.1 Request Interception (`secureApi.js` & `api.js`)
If `localStorage.getItem("blog_app_demo_mode") === "true"`, the requests are intercepted. Instead of hitting the live network, Axios routes the configuration into `handleMockRequest(config)` inside [mockDb.js](file:///Users/anshul/OurUses/Daily%20projects/1-Bloging%20App/Client/src/lib/mockDb.js).

### 2.2 Response Interceptor Recovery
If a request is sent to `localhost:2000` while the server is offline, the response interceptor catches the connection timeout (`ERR_NETWORK` / `Network Error`), sets `blog_app_demo_mode = "true"`, fires a `"connection-change"` window event to update the Navbar pill, and automatically retries the operation using the local mock database.

---

## 3. Frontend Routing Map

All routes are lazy-loaded via `React.lazy()` and wrapped inside a `<Suspense>` boundary containing a loading spinner.

| Route | Component | Access Guard | Description |
| :--- | :--- | :--- | :--- |
| `/` | `Home.jsx` | Public | Rebranded landing page featuring counters, Infinite Marquee, and editor widgets. |
| `/about` | `About.jsx` | Public | Manifesto and project philosophy. |
| `/contact` | `Contact.jsx` | Public | Contact form with Zod schema validation and responsive check animations. |
| `/login` | `Login.jsx` | Public Only | Authentication page with one-click autofill credentials for Sandbox Mode. |
| `/register` | `Register.jsx` | Public Only | User registration form utilizing Zod schema validation. |
| `/forgot-password` | `ForgotPassword.jsx` | Public Only | Two-step wizard to request verification tokens and reset user passwords. |
| `/feed` | `Feed.jsx` | Private | Feed stream of publications with comments drawers, likes, and share features. |
| `/post/:id` | `PostDetails.jsx` | Private | Full-length publication page with engagement statistics. |
| `/profile` | `Profile.jsx` | Private | Customizable user details page with clickable Followers/Following list modals. |
| `/dashboard` | `DashboardHome.jsx` | Private | Analytics hub featuring heatmaps and Recharts engagement grids. |
| `/dashboard/posts` | `MyPosts.jsx` | Private | Creator catalog containing Publications vs Drafts tab panels. |
| `/dashboard/saved` | `SavedPosts.jsx` | Private | Bookmarked/Saved posts list. |
| `/dashboard/create` | `CreatePost.jsx` | Private | Composer with draft saving triggers and responsive drafts sidebar. |
| `/dashboard/edit/:id` | `EditPost.jsx` | Private | Editor to update and save modifications to live published stories. |
| `/dashboard/settings` | `Settings.jsx` | Private | Account and profile settings navigation node. |
| `/dashboard/settings/profile`| `UpdateProfile.jsx` | Private | Editor to update bio, location, interests, and profile details. |
| `/dashboard/settings/security`| `Security.jsx` | Private | Password updates, 2FA toggle, and active session manager. |
| `/dashboard/settings/privacy`| `Privacy.jsx` | Private | Visibility rules toggles. |
| `/dashboard/settings/:category`| `SettingsPlaceholder.jsx`| Private | Dynamic fallback screen for settings. |
| `/dashboard/help` & `/help` | `Help.jsx` | Private/Public| FAQ center containing accordion layouts. |

---

## 4. Mock REST API Specifications (`mockDb.js`)

All endpoints simulate a network latency of **250ms** via a promise delay to ensure loader skeletons and buttons transition smoothly in Sandbox Mode.

### 4.1 Authentication & Profile APIs

#### `POST /users/login`
*   **Request Body:** `{ email, password }`
*   **Success Response (200 OK):**
    ```json
    {
      "user": { "_id": "...", "name": "...", "username": "...", "email": "...", "role": "..." },
      "accessToken": "mock-access-token-...",
      "refreshToken": "mock-refresh-token-..."
    }
    ```
*   **Error Response (401 Unauthorized):** `{ "message": "Invalid email or password ❌" }`
*   **Side Effect:** Sets `currentUser` session in `localStorage`.

#### `POST /users/create` (Registration)
*   **Request Body:** `{ name, email, password, username }`
*   **Success Response (201 Created):** `{ "success": true, "message": "Registration successful!", "user": { ... } }`
*   **Side Effect:** Appends new user to `mock_db_users`.

#### `GET /users/profile`
*   **Query Parameters:** `userId` (Optional)
*   **Success Response (200 OK):** `{ "getProfile": { ...userProfileDetails } }`
*   **Logic:** If `userId` is passed, fetches the matching creator profile from system database. Otherwise, returns the active session profile.

#### `PATCH /users/update-user-profile`
*   **Request Body:** `{ name, username, bio, location, profession, interests, socialLinks }`
*   **Success Response (200 OK):** `{ "success": true, "user": { ...updatedProfile } }`
*   **Side Effect:** Merges changes into `mock_db_users` and updates active `currentUser` session.

#### `POST /users/forgot-password`
*   **Request Body:** `{ email }`
*   **Success Response (200 OK):** `{ "success": true, "message": "Simulation: Reset link generated.", "resetToken": "RESET-123456" }`
*   **Error Response (404 Not Found):** `{ "message": "No account found with this email address ❌" }`

#### `POST /users/reset-password`
*   **Request Body:** `{ email, token, password }`
*   **Success Response (200 OK):** `{ "success": true, "message": "Password reset successfully! 🔑" }`
*   **Error Response (400 Bad Request):** `{ "message": "Invalid or expired reset token ❌" }`
*   **Side Effect:** Updates password index for user inside `mock_db_users`.

---

### 4.2 Blogs & Publications APIs

#### `GET /blogs/allblogs`
*   **Success Response (200 OK):** `{ "data": { "blogs": [ ...allBlogs ] } }`
*   **Source:** Reads `mock_db_blogs`.

#### `GET /blogs/myblogs`
*   **Query Parameters:** `userId` (Optional)
*   **Success Response (200 OK):** `{ "blogs": [ ...userBlogs ] }`
*   **Logic:** If `userId` is passed, returns publications authored by that specific user. Otherwise, filters `mock_db_blogs` for the logged-in user.

#### `GET /blogs/post/:id`
*   **Success Response (200 OK):** `{ "blog": { ...blogDetails } }`
*   **Error Response (404 Not Found):** `{ "message": "Publication signal not found." }`

#### `POST /blogs/create`
*   **Request Body:** `{ title, content, tags, image }`
*   **Success Response (200 OK):** `{ "success": true, "blog": { ...newBlogObject } }`
*   **Side Effect:** Adds new blog post to `mock_db_blogs`.

#### `PUT /blogs/update/:id`
*   **Request Body:** `{ title, content, tags, image }`
*   **Success Response (200 OK):** `{ "success": true, "blog": { ...updatedBlogObject } }`
*   **Side Effect:** Updates post properties in `mock_db_blogs`.

#### `DELETE /blogs/del-blog/:id`
*   **Success Response (200 OK):** `{ "success": true, "message": "Broadcast terminated." }`
*   **Side Effect:** Filters out the post from `mock_db_blogs`.

---

## 5. Mock Database Schema (`localStorage`)

The database uses raw JSON string representations inside key-value storage.

### 5.1 `mock_db_users`
An array of objects representing registered profiles:
```typescript
interface UserSchema {
  _id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: string;
  profilePicture: string;
  location: string;
  profession: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  dateOfJoin: string; // ISO String
  socialLinks: {
    github: string;
    twitter: string;
    website: string;
  };
  interests: string[];
}
```

### 5.2 `mock_db_blogs`
An array of objects representing published stories:
```typescript
interface BlogSchema {
  _id: string;
  title: string;
  content: string;
  createdAt: string; // ISO String
  tags: string[];
  likes: number;
  likeCount: number;
  comments: number;
  commentCount: number;
  bookmarks: number;
  bookmarkCount: number;
  image: string; // Base64 data URI or Unsplash URL
  userId: {
    _id: string;
    name: string;
    username: string;
    profilePicture: string;
  };
  author: {
    name: string;
    avatar: string;
  };
}
```

### 5.3 `mock_db_drafts`
An array of composer drafts saved locally:
```typescript
interface DraftSchema {
  _id: string; // "draft-" + timestamp
  title: string;
  content: string;
  tags: string; // Comma separated string
  image: string; // Base64 cover preview
  updatedAt: string; // ISO String
}
```

---

## 6. Premium UI Components & Core Features

### 6.1 Custom Canvas Particle Systems
*   **Files:** `ParticleBackground.jsx`, `GeometricParticleBackground.jsx`, `MagneticOrbBackground.jsx`.
*   **Optimization:** Counts are capped (max 40 elements) on mobile screens (`window.innerWidth < 768`) to prevent repaints and layout shifts. Canvas draws are throttled via `requestAnimationFrame`.

### 6.2 Comments Overlay Drawer (`PostCard.jsx`)
*   To bypass grid height stretching in the Feed view, the comments panel renders as an **absolute overlay** directly inside the relative parent container of the `PostCard` (`inset-0`). This ensures a slick comments drawer that slides up smoothly without affecting neighboring cards in the grid.

### 6.3 Followers Modal & Scroll Lock (`Profile.jsx`)
*   Modals use an `overflow: hidden` lock on `document.body` while active to prevent background scrolling.
*   Connection lists dynamically navigate `/profile?userId=...` to load profiles of other members. Clicking the active profile menu item resets parameters and returns the user back to their personal dashboard.

---

## 7. Performance & Optimization Checklist

1.  **Code Splitting:** Standardized `React.lazy()` code boundaries.
2.  **Resource Manager (Drafts & Resets):** Form inputs are automatically purged (`reset()`) and states cleared when choosing **Save Draft** in the editor.
3.  **Mouse Event Overrides:** Canvas movement listeners are suppressed on touch viewports to save memory cycles.
4.  **Cover Image Reader:** Converts input files to base64 Strings via a `FileReader` buffer, ensuring persistence directly inside the LocalStorage draft key arrays without requiring separate server uploads.

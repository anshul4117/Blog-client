# 📘 Project Documentation: Social Media App

## 1. Project Overview
This is a modern, responsive social media application built with React 19, Vite, and Tailwind CSS v4. The goal is to provide a premium user experience for creating, sharing, and interacting with content.

## 2. Architecture
### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 + Vanilla CSS customizations
- **Routing**: React Router DOM v7 (with Lazy Loading)
- **State Management**: React Context + Local State
- **HTTP Client**: Axios (Secure Instance)

### Backend (Assumed/Integrated)
- REST API integration via `src/lib/secureApi.js`
- JWT Authentication flow

## 3. Feature Status Matrix

| Feature | Status | Notes |
| :--- | :--- | :--- |
| **Authentication** | 🟢 Implemented | Login/Register with Zod validation & Secure API. |
| **Feed** | 🟢 Implemented | Fetches posts. Optimization: Lazy loaded images. |
| **Post Creation** | 🟢 Implemented | Protected route. Zod validation for inputs. |
| **Post Interaction** | 🔴 Pending | Likes, Comments, and Shares logic needs implementation. |
| **Profile** | 🟡 Partial | Basic profile page exists. Needs edit functionality & user stats. |
| **Dashboard** | 🟡 Partial | My Posts view exists. Analytics missing. |

## 4. Security & Optimization Standards

### Security
- **Input Validation**: using `zod` and `react-hook-form` on all mutation points.
- **Secure Headers**: `secureApi.js` enforces `X-Content-Type-Options: nosniff`.
- **Token Handling**: Tokens are validated before being attached to headers.

### Optimization
- **Code Splitting**: All routes are lazy-loaded using `React.lazy()` and `Suspense`.
- **Image Optimization**: `<OptimizedImage />` component handles lazy loading and fallback states.

## 5. Directory Structure
```
src/
├── features/       # Feature-based moduls (Auth, Dashboard, Profile)
│   ├── Auth/       # Login, Register
│   ├── Dashboard/  # Post management
│   └── Profile/    # User settings
├── components/     # Reusable UI components
│   ├── ui/         # Shadcn/Base UI (OptimizedImage, Button, etc.)
│   └── blog/       # Blog specific (PostCard)
├── pages/          # Main route compositions (Home, Feed)
├── lib/            # Utilities (secureApi, helpers)
├── routes/         # AppRoutes, Private/Public Route guards
└── context/        # Global providers (AuthContext)
```

## 6. Development Workflow
1.  **Update Task**: Check `task.md`.
2.  **Implementation**: Follow "Modern UI" guidelines.
3.  **Verification**: Test locally.
4.  **Documentation**: Update this file on major changes.

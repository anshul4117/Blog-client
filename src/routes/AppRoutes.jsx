import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";
import DashboardLayout from "../features/Dashboard/Components/DashboardLayout.jsx";

// Lazy load pages
const Home = lazy(() => import("../pages/Home.jsx"));
const About = lazy(() => import("../pages/About.jsx"));
const Feed = lazy(() => import("../pages/Feed.jsx"));

// Auth
const Login = lazy(() => import("../features/Auth/Pages/Login.jsx"));
const Register = lazy(() => import("../features/Auth/Pages/Register.jsx"));

// Dashboard / Features
const DashboardHome = lazy(() => import("../features/Dashboard/Pages/DashboardHome.jsx"));
const MyPosts = lazy(() => import("../features/Dashboard/Pages/MyPosts.jsx"));
const CreatePost = lazy(() => import("../features/Dashboard/Pages/CreatePost.jsx"));
const SavedPosts = lazy(() => import("../features/Dashboard/Pages/SavedPosts.jsx"));
const PostDetails = lazy(() => import("../features/Dashboard/Pages/PostDetails.jsx"));

// Profile
const Profile = lazy(() => import("../features/Profile/Pages/Profile.jsx"));
const Settings = lazy(() => import("../features/Profile/Pages/Setting.jsx"));
const SettingsPlaceholder = lazy(() => import("../features/Dashboard/Pages/SettingsPlaceholder.jsx"));

const Security = lazy(() => import("../features/Profile/Pages/Security.jsx"));

const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/feed" element={<Feed />} />

        {/* 🔒 Auth routes (PublicRoute prevents logged-in users) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* 🔐 Dashboard (Protected Layout) */}
        <Route element={<PrivateRoute />}>
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="posts" element={<MyPosts />} />
            <Route path="saved" element={<SavedPosts />} />
            <Route path="create" element={<CreatePost />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings/security" element={<Security />} />
            <Route path="settings/:category" element={<SettingsPlaceholder />} />
          </Route>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

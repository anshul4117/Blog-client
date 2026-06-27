import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";
import DashboardLayout from "../features/Dashboard/Components/DashboardLayout.jsx";

// Lazy load pages
const Home = lazy(() => import("../pages/Home.jsx"));
const About = lazy(() => import("../pages/About.jsx"));
const Feed = lazy(() => import("../pages/Feed.jsx"));
const Contact = lazy(() => import("../pages/Contact.jsx"));

// Auth
const Login = lazy(() => import("../features/Auth/Pages/Login.jsx"));
const Register = lazy(() => import("../features/Auth/Pages/Register.jsx"));
const ForgotPassword = lazy(() => import("../features/Auth/Pages/ForgotPassword.jsx"));

// Dashboard / Features
const DashboardHome = lazy(() => import("../features/Dashboard/Pages/DashboardHome.jsx"));
const MyPosts = lazy(() => import("../features/Dashboard/Pages/MyPosts.jsx"));
const CreatePost = lazy(() => import("../features/Dashboard/Pages/CreatePost.jsx"));
const SavedPosts = lazy(() => import("../features/Dashboard/Pages/SavedPosts.jsx"));
const PostDetails = lazy(() => import("../features/Dashboard/Pages/PostDetails.jsx"));
const EditPost = lazy(() => import("../features/Dashboard/Pages/EditPost.jsx"));

// Profile
const Profile = lazy(() => import("../features/Profile/Pages/Profile.jsx"));
const Settings = lazy(() => import("../features/Profile/Pages/Setting.jsx"));
const SettingsPlaceholder = lazy(() => import("../features/Dashboard/Pages/SettingsPlaceholder.jsx"));
const UpdateProfile = lazy(() => import("../features/Profile/Pages/UpdateProfile.jsx"));
const BlockedUsers = lazy(() => import("../features/Profile/Pages/BlockedUsers.jsx"));
const AccountCenter = lazy(() => import("../features/Profile/Pages/AccountCenter.jsx"));

const Security = lazy(() => import("../features/Profile/Pages/Security.jsx"));
const Help = lazy(() => import("../features/Support/Pages/Help.jsx"));
const Privacy = lazy(() => import("../features/Profile/Pages/Privacy.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

import ScrollToTop from "../components/layout/ScrollToTop.jsx";
import MainLayout from "../components/layout/MainLayout.jsx";

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <ScrollToTop />
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<MainLayout><Help /></MainLayout>} />

        {/* 🔒 Auth routes (PublicRoute prevents logged-in users) */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* 🔐 Dashboard (Protected Layout) */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/post/:id" element={<PostDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard">
              <Route index element={<DashboardHome />} />
              <Route path="posts" element={<MyPosts />} />
              <Route path="saved" element={<SavedPosts />} />
              <Route path="create" element={<CreatePost />} />
              <Route path="edit/:id" element={<EditPost />} />
              <Route path="settings" element={<Settings />} />
              <Route path="settings/profile" element={<UpdateProfile />} />
              <Route path="settings/security" element={<Security />} />
              <Route path="settings/blocked" element={<BlockedUsers />} />
              <Route path="settings/account-center" element={<AccountCenter />} />
              <Route path="help" element={<Help />} />
              <Route path="settings/help" element={<Help />} />
              <Route path="settings/privacy" element={<Privacy />} />
              <Route path="settings/:category" element={<SettingsPlaceholder />} />
            </Route>
          </Route>
        </Route>

        {/* 🚫 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Login from "../features/Auth/Pages/Login.jsx";
import Register from "../features/Auth/pages/Register.jsx";
import DashboardLayout from "../features/Dashboard/Components/DashboardLayout.jsx"
import DashboardHome from "../features/Dashboard/Pages/DashboardHome.jsx";
import MyPosts from "../features/Dashboard/Pages/MyPosts.jsx";
import CreatePost from "../features/Dashboard/Pages/CreatePost.jsx";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />

      {/* 🔐 Dashboard (Protected Layout) */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="posts" element={<MyPosts />} />
        <Route path="create" element={<CreatePost />} />
      </Route>

      {/* later: add /login, /register, /post/:id, /dashboard, etc. */}
    </Routes>
  );
}

import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Login from "../features/Auth/Pages/Login.jsx";
import Register from "../features/Auth/pages/Register.jsx";
import DashboardLayout from "../features/Dashboard/Components/DashboardLayout.jsx"
import DashboardHome from "../features/Dashboard/Pages/DashboardHome.jsx";
import MyPosts from "../features/Dashboard/Pages/MyPosts.jsx";
import CreatePost from "../features/Dashboard/Pages/CreatePost.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import PostDetails from "../features/Dashboard/Pages/PostDetails.jsx";
import PublicRoute from "./PublicRoute.jsx";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />


      {/* 🔒 Auth routes (PublicRoute prevents logged-in users) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="/post/:id" element={<PostDetails />} />

      {/* 🔐 Dashboard (Protected Layout) */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="posts" element={<MyPosts />} />
          <Route path="create" element={<CreatePost />} />
        </Route>
      </Route>

    </Routes>
  );
}

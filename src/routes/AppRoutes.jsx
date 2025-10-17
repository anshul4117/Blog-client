import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Login from "../features/Auth/Pages/Login.jsx";
import Register from "../features/Auth/pages/Register.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />

      {/* later: add /login, /register, /post/:id, /dashboard, etc. */}
    </Routes>
  );
}

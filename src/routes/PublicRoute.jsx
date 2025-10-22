// src/routes/PublicRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function PublicRoute() {
  const { user } = useAuth();

  // If user is logged in, redirect to dashboard or home
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, render the public route (login/register)
  return <Outlet />;
}

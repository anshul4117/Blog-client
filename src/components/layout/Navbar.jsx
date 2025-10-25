import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          <span className="text-primary">My</span>Blog
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-primary font-semibold" : "hover:text-primary"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-primary font-semibold" : "hover:text-primary"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/feed"
            className={({ isActive }) =>
              isActive ? "text-primary font-semibold" : "hover:text-primary"
            }
          >
            Explore
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "text-primary font-semibold" : "hover:text-primary"
                }
              >
                Dashboard
              </NavLink>

              {/* Avatar Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || "avatar"}
                        className="w-9 h-9 rounded-full object-cover border border-gray-200 hover:opacity-80"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium hover:bg-slate-300">
                        {(user?.user?.name || "U")
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48 mt-2 bg-white">
                  <div className="px-3 py-2 text-sm border-b">
                    <p className="font-medium">{user?.user?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer"
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/settings")}
                    className="cursor-pointer"
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500 focus:text-red-500"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "text-primary font-semibold" : "hover:text-primary"
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "text-primary font-semibold" : ""
                }
              >
                <Button size="sm">Sign up</Button>
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-accent"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden border-t p-4 flex flex-col gap-3 bg-background">
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className={({ isActive }) => (isActive ? "font-semibold" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setOpen(false)}
            className={({ isActive }) => (isActive ? "font-semibold" : "")}
          >
            About
          </NavLink>
          <NavLink
            to="/feed"
            onClick={() => setOpen(false)}
            className={({ isActive }) => (isActive ? "font-semibold" : "")}
          >
            Explore
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink
                to="/dashboard"
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "font-semibold" : "")}
              >
                Dashboard
              </NavLink>

              {/* ✅ Profile + Settings added here */}
              <NavLink
                to="/profile"
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "font-semibold" : "")}
              >
                Profile
              </NavLink>
              <NavLink
                to="/settings"
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "font-semibold" : "")}
              >
                Settings
              </NavLink>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="mt-2"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "font-semibold" : "")}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "font-semibold" : "")}
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

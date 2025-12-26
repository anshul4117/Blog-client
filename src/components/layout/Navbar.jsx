import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, Laptop } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import { ModeToggle } from "@/components/mode-toggle";
import { useTheme } from "@/components/theme-provider";
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
  const { setTheme } = useTheme();
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
    <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
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

              <ModeToggle />

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
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium hover:bg-slate-300 text-slate-700">
                        {(user?.user?.name || "U")
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48 mt-2 bg-popover text-popover-foreground">
                  <div className="px-3 py-2 text-sm border-b border-border">
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
                    onClick={() => navigate("/dashboard/settings")}
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
              <ModeToggle />
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
          className="md:hidden p-2 rounded-lg hover:bg-accent text-foreground"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden border-t border-border p-4 flex flex-col gap-3 bg-background animate-in slide-in-from-top-2">
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className={({ isActive }) => (isActive ? "font-semibold text-primary" : "text-foreground")}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setOpen(false)}
            className={({ isActive }) => (isActive ? "font-semibold text-primary" : "text-foreground")}
          >
            About
          </NavLink>
          <NavLink
            to="/feed"
            onClick={() => setOpen(false)}
            className={({ isActive }) => (isActive ? "font-semibold text-primary" : "text-foreground")}
          >
            Explore
          </NavLink>

          <div className="flex items-center justify-between py-2 border-y border-border">
            <span className="text-sm font-medium text-muted-foreground">Theme</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setTheme("light")} className="h-8 w-8 p-0">
                <Sun className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setTheme("dark")} className="h-8 w-8 p-0">
                <Moon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setTheme("system")} className="h-8 w-8 p-0">
                <Laptop className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isLoggedIn ? (
            <>
              <NavLink
                to="/dashboard"
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "font-semibold text-primary" : "text-foreground")}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/profile"
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "font-semibold text-primary" : "text-foreground")}
              >
                Profile
              </NavLink>

              <NavLink
                to="/dashboard/saved"
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "font-semibold text-primary" : "text-foreground")}
              >
                Saved Posts
              </NavLink>

              <NavLink
                to="/dashboard/settings"
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "font-semibold text-primary" : "text-foreground")}
              >
                Settings
              </NavLink>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="mt-2 w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "font-semibold text-primary" : "text-foreground")}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "font-semibold text-primary" : "text-foreground")}
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

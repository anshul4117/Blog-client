import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, Sparkles, User, LogOut, LayoutDashboard, Settings, Globe, Shield, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import { ModeToggle } from "@/components/mode-toggle";
import { motion, AnimatePresence } from "framer-motion";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const [isDemoMode, setIsDemoMode] = useState(() => localStorage.getItem("blog_app_demo_mode") === "true");
  const [checkingConnection, setCheckingConnection] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleConnectionChange = () => {
      setIsDemoMode(localStorage.getItem("blog_app_demo_mode") === "true");
    };
    window.addEventListener("connection-change", handleConnectionChange);
    return () => window.removeEventListener("connection-change", handleConnectionChange);
  }, []);

  const handleReconnect = async () => {
    setCheckingConnection(true);
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2000/api/v1.2";
      const res = await fetch(`${baseURL}/blogs/allblogs`, { method: "GET" });
      if (res.ok || res.status < 500) {
        localStorage.setItem("blog_app_demo_mode", "false");
        setIsDemoMode(false);
        window.dispatchEvent(new Event("connection-change"));
        alert("Connected to Live Server! 🟢 Switching to Live Mode.");
        window.location.reload();
      } else {
        throw new Error("Offline");
      }
    } catch {
      alert("Live Server is offline. Check if your backend is running on http://localhost:2000 ❌");
    } finally {
      setCheckingConnection(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-8 py-4 ${
        scrolled ? "mt-2" : "mt-0"
      }`}
    >
      <div 
        className={`max-w-7xl mx-auto rounded-[24px] transition-all duration-500 ${
          scrolled 
            ? "glass-panel px-6 py-2 shadow-2xl shadow-primary/10 border-primary/20" 
            : "bg-transparent px-2 py-2 border-transparent"
        } flex items-center justify-between`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500 text-white">
            <svg viewBox="0 0 512 512" className="h-6 w-6 fill-current">
              <path d="M256,48 C160,192 96,280 96,352 A160,160 0 0,0 416,352 C416,280 352,192 256,48 Z" />
              <path d="M200,240 L240,290 L200,340 H235 L256,310 L277,340 H312 L272,290 L312,240 H277 L256,270 L235,240 Z" fill="var(--color-background)" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">
            X<span className="text-primary">Drop</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {isLoggedIn && (
            <NavLink to="/feed" className={({isActive}) => `text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              Feed
            </NavLink>
          )}
          <NavLink to="/about" className={({isActive}) => `text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
            About
          </NavLink>
          <NavLink to="/contact" className={({isActive}) => `text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
            Contact
          </NavLink>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search universe..." 
                className="bg-muted/30 border border-transparent focus:border-primary/30 rounded-full pl-10 pr-4 py-2 text-sm w-40 focus:w-64 transition-all duration-500 outline-none backdrop-blur-md"
              />
            </div>
          )}

          {/* Connection Status Badge */}
          {!isHomePage && (
            <button
              onClick={handleReconnect}
              disabled={checkingConnection}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all active:scale-95 ${
                isDemoMode 
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20" 
                  : "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
              }`}
              title={isDemoMode ? "Sandbox mode: click to check live server availability" : "Live mode: connected to local backend"}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isDemoMode ? 'bg-amber-500 animate-pulse' : 'bg-green-500'} `} />
              {checkingConnection ? "Scanning..." : isDemoMode ? "Sandbox" : "Live"}
            </button>
          )}

          <ModeToggle />

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-all p-0.5 group">
                   <img 
                    src={user.profilePicture || user.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                    alt="User" 
                    className="h-full w-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                   />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-panel mt-2 rounded-2xl p-2 border-primary/20">
                <div className="px-3 py-2">
                  <p className="text-xs font-black uppercase tracking-widest text-primary mb-1 font-mono">Authenticated</p>
                  <p className="text-sm font-bold truncate">{user.name}</p>
                </div>
                <DropdownMenuSeparator className="bg-primary/10" />
                <DropdownMenuItem onClick={() => navigate("/dashboard")} className="rounded-xl font-bold cursor-pointer hover:bg-primary/10 focus:bg-primary/10 gap-2">
                  <LayoutDashboard size={16} /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")} className="rounded-xl font-bold cursor-pointer hover:bg-primary/10 focus:bg-primary/10 gap-2">
                  <User size={16} /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="rounded-xl font-bold cursor-pointer hover:bg-primary/10 focus:bg-primary/10 gap-2">
                  <Settings size={16} /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-primary/10" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl font-bold cursor-pointer text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 gap-2">
                  <LogOut size={16} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" className="font-bold text-xs uppercase tracking-widest hover:text-primary">Login</Button>
              </Link>
              <Link to="/register">
                {/* Mobile: Small Icon Button | Desktop: Full Text Button */}
                <Button className="font-black text-[10px] sm:text-xs uppercase tracking-widest rounded-lg sm:rounded-xl px-3 sm:px-5 h-8 sm:h-10 shadow-md sm:shadow-lg shadow-primary/20 flex items-center gap-1.5">
                  <UserPlus size={14} />
                  <span className="hidden sm:inline">Register</span>
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          {!isLoggedIn && (
            <button 
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-xl glass-panel text-foreground"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-y-0 right-0 w-[80%] max-w-sm glass-panel z-50 p-8 flex flex-col border-l border-primary/20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex justify-between items-center mb-12">
               <Link to="/" className="text-xl font-black tracking-tighter" onClick={() => setOpen(false)}>
                X<span className="text-primary">Drop</span>
              </Link>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-primary/10">
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {isLoggedIn && (
                <NavLink to="/feed" onClick={() => setOpen(false)} className="text-2xl font-black uppercase tracking-tighter hover:text-primary transition-colors">Feed</NavLink>
              )}
              <NavLink to="/about" onClick={() => setOpen(false)} className="text-2xl font-black uppercase tracking-tighter hover:text-primary transition-colors">About</NavLink>
              <NavLink to="/contact" onClick={() => setOpen(false)} className="text-2xl font-black uppercase tracking-tighter hover:text-primary transition-colors">Contact</NavLink>
              
              <DropdownMenuSeparator className="bg-primary/10 my-4" />
              
              {isLoggedIn ? (
                <>
                  <NavLink to="/dashboard" onClick={() => setOpen(false)} className="text-xl font-bold hover:text-primary flex items-center gap-3">
                    <LayoutDashboard size={20} /> Dashboard
                  </NavLink>
                  <NavLink to="/profile" onClick={() => setOpen(false)} className="text-xl font-bold hover:text-primary flex items-center gap-3">
                    <User size={20} /> Profile
                  </NavLink>
                  <button onClick={handleLogout} className="text-xl font-bold text-red-500 flex items-center gap-3 mt-8">
                    <LogOut size={20} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-4 mt-8">
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)}>
                    <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">Register</Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-auto pt-8 border-t border-primary/10 flex justify-between items-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">XDrop System v1.0</p>
              {!isHomePage && (
                <button
                  onClick={handleReconnect}
                  disabled={checkingConnection}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                    isDemoMode ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"
                  }`}
                >
                  {checkingConnection ? "..." : isDemoMode ? "Sandbox" : "Live"}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

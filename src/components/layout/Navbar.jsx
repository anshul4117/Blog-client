import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, Sparkles, User, LogOut, LayoutDashboard, Settings } from "lucide-react";
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
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
            <Sparkles className="text-white" size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">
            My<span className="text-primary">Blog</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <NavLink to="/feed" className={({isActive}) => `text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
            Discover
          </NavLink>
          <NavLink to="/about" className={({isActive}) => `text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
            Manifesto
          </NavLink>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search universe..." 
              className="bg-muted/30 border border-transparent focus:border-primary/30 rounded-full pl-10 pr-4 py-2 text-sm w-40 focus:w-64 transition-all duration-500 outline-none backdrop-blur-md"
            />
          </div>

          <ModeToggle />

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-all p-0.5 group">
                   <img 
                    src={user.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                    alt="User" 
                    className="h-full w-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                   />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-panel mt-2 rounded-2xl p-2 border-primary/20">
                <div className="px-3 py-2">
                  <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Authenticated as</p>
                  <p className="text-sm font-bold truncate">{user.name}</p>
                </div>
                <DropdownMenuSeparator className="bg-primary/10" />
                <DropdownMenuItem onClick={() => navigate("/dashboard")} className="rounded-xl font-bold cursor-pointer hover:bg-primary/10 focus:bg-primary/10 gap-2">
                  <LayoutDashboard size={16} /> Workspace
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")} className="rounded-xl font-bold cursor-pointer hover:bg-primary/10 focus:bg-primary/10 gap-2">
                  <User size={16} /> Identity
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="rounded-xl font-bold cursor-pointer hover:bg-primary/10 focus:bg-primary/10 gap-2">
                  <Settings size={16} /> Config
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-primary/10" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl font-bold cursor-pointer text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 gap-2">
                  <LogOut size={16} /> Terminate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" className="font-bold text-xs uppercase tracking-widest hover:text-primary">Inbound</Button>
              </Link>
              <Link to="/register">
                <Button className="font-black text-xs uppercase tracking-widest rounded-xl px-5 h-10 shadow-lg shadow-primary/20">Initialize</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-xl glass-panel text-foreground"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
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
                My<span className="text-primary">Blog</span>
              </Link>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-primary/10">
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              <NavLink to="/feed" onClick={() => setOpen(false)} className="text-2xl font-black uppercase tracking-tighter hover:text-primary transition-colors">Discover</NavLink>
              <NavLink to="/about" onClick={() => setOpen(false)} className="text-2xl font-black uppercase tracking-tighter hover:text-primary transition-colors">Manifesto</NavLink>
              
              <DropdownMenuSeparator className="bg-primary/10 my-4" />
              
              {isLoggedIn ? (
                <>
                  <NavLink to="/dashboard" onClick={() => setOpen(false)} className="text-xl font-bold hover:text-primary flex items-center gap-3">
                    <LayoutDashboard size={20} /> Workspace
                  </NavLink>
                  <NavLink to="/profile" onClick={() => setOpen(false)} className="text-xl font-bold hover:text-primary flex items-center gap-3">
                    <User size={20} /> Identity
                  </NavLink>
                  <button onClick={handleLogout} className="text-xl font-bold text-red-500 flex items-center gap-3 mt-8">
                    <LogOut size={20} /> Terminate
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-4 mt-8">
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest">Inbound</Button>
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)}>
                    <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">Initialize</Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-auto pt-8 border-t border-primary/10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">MyBlog System v1.0</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

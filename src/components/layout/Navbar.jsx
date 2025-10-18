import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          <span className="text-primary">My</span>Blog
        </Link>

        {/* desktop menu */}
        <div className="hidden md:flex gap-6 items-center">
          <NavLink to="/" className={({isActive})=> isActive ? 'text-primary font-semibold' : 'hover:text-primary'}>Home</NavLink>
          <NavLink to="/about" className={({isActive})=> isActive ? 'text-primary font-semibold' : 'hover:text-primary'}>About</NavLink>

          {isLoggedIn ? (
            <>
              <NavLink to="/dashboard" className={({isActive})=> isActive ? 'text-primary font-semibold' : 'hover:text-primary'}>Dashboard</NavLink>
              <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
              {/* avatar */}
              <div className="ml-2">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name || 'avatar'} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium">{(user?.name || 'U').split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({isActive})=> isActive ? 'text-primary font-semibold' : 'hover:text-primary'}>Login</NavLink>
              <NavLink to="/register" className={({isActive})=> isActive ? 'text-primary font-semibold' : ''}>
                <span size="sm">Sign up</span>
              </NavLink>
            </>
          )}
        </div>

        {/* mobile menu */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-accent"
        >
          <Menu />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t p-4 flex flex-col gap-3">
          <NavLink to="/" className={({isActive})=> isActive ? 'font-semibold' : ''}>Home</NavLink>
          <NavLink to="/about" className={({isActive})=> isActive ? 'font-semibold' : ''}>About</NavLink>
          {isLoggedIn ? (
            <>
              <NavLink to="/dashboard" className={({isActive})=> isActive ? 'font-semibold' : ''}>Dashboard</NavLink>
              <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
              <div className="mt-2">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name || 'avatar'} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium">{(user?.name || 'U').split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({isActive})=> isActive ? 'font-semibold' : ''}>Login</NavLink>
              <NavLink to="/register" className={({isActive})=> isActive ? 'font-semibold' : ''}>
                <span size="sm">Sign up</span>
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

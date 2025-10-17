import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const isLoggedIn = false; // mock for now

  return (
    <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          <span className="text-primary">My</span>Blog
        </Link>

        {/* desktop menu */}
        <div className="hidden md:flex gap-6 items-center">
          <NavLink to="/" className={({isActive}) => isActive ? 'text-primary text-blue-400' : 'hover:text-primary'}>Home</NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? 'text-primary text-blue-400' : 'hover:text-primary'}>About</NavLink>

          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
              <Button variant="outline" size="sm">Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-primary">Login</Link>
              <Link to="/register">
                <Button size="sm">Sign up</Button>
              </Link>
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
          <NavLink to="/" className={({isActive})=> isActive ? 'text-primary font-semibold' : ''}>Home</NavLink>
          <NavLink to="/about" className={({isActive})=> isActive ? 'text-primary font-semibold' : ''}>About</NavLink>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Button variant="outline" size="sm">Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

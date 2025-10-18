import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../AuthContext.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const NavLinks = () => (
    <>
      <Link to="/" className="hover:text-primary">Home</Link>
      <Link to="/about" className="hover:text-primary">About</Link>
      {user ? (
        <>
          <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link to="/login" className="hover:text-primary">Login</Link>
          <Link to="/register">
            <Button size="sm">Sign up</Button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          <span className="text-primary">My</span>Blog
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-6 items-center">
          <NavLinks />
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-accent"
        >
          <Menu />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t p-4 flex flex-col gap-3">
          <NavLinks />
        </div>
      )}
    </nav>
  );
}

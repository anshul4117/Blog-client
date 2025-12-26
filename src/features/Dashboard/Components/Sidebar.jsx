import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FilePlus, FileText, User, Settings, LogOut, LogIn, UserPlus, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/posts", label: "My Posts", icon: FileText },
  { to: "/dashboard/create", label: "Create Post", icon: FilePlus },
];

const bottomLinks = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

const publicLinks = [
  { to: "/login", label: "Login", icon: LogIn },
  { to: "/register", label: "Register", icon: UserPlus },
]

export default function Sidebar({ className = "", mobile = false, onClose, showDesktopBrand = true }) {
  const { pathname } = useLocation();
  const { logout, user } = useAuth(); // Assuming logout exists in context

  const baseClasses = mobile
    ? "flex flex-col w-[85vw] max-w-[300px] h-full bg-background/95 backdrop-blur-xl border-r border-border shadow-2xl"
    : "hidden sm:flex flex-col w-64 min-h-screen bg-background border-r border-border/40 sticky top-0";

  // Content wrapper to avoid duplicating logic
  const content = (
    <>
      {/* Mobile Header with Logo and Close Button - OR Desktop Header if explicitly requested */}
      {(mobile || showDesktopBrand) && (
        <div className="p-6 border-b border-border/40 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            <span className="text-primary">My</span>Blog
          </Link>

          {/* Close Button only for Mobile */}
          {mobile && (
            <button onClick={onClose} className="p-1 rounded-full hover:bg-accent text-foreground/70">
              <X size={20} />
            </button>
          )}
        </div>
      )}

      <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto">
        {!user ? (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Join Us</p>
            {publicLinks.map((link) => (
              <SidebarItem key={link.to} link={link} active={pathname === link.to} />
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Menu</p>
              {links.map((link) => (
                <SidebarItem key={link.to} link={link} active={pathname === link.to} />
              ))}
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Account</p>
              {bottomLinks.map((link) => (
                <SidebarItem key={link.to} link={link} active={pathname === link.to} />
              ))}
            </div>
          </>
        )}
      </div>

      {user && (
        <div className="p-4 border-t border-border/40">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </>
  );

  return (
    <aside className={`${baseClasses} ${className}`}>
      {content}
    </aside>
  );
}

function SidebarItem({ link, active }) {
  return (
    <Link to={link.to} className="block relative group">
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 bg-primary/10 rounded-xl"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <div className={`relative flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
        <link.icon size={20} />
        {link.label}
      </div>
    </Link>
  );
}

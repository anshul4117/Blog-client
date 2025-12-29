import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FilePlus, FileText, User, Settings, LogOut, LogIn, UserPlus, X, Bookmark,
  ChevronDown, ChevronRight, Shield, Lock, HelpCircle, UserCog, Ban, Fingerprint
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/posts", label: "My Posts", icon: FileText },
  { to: "/dashboard/saved", label: "Saved", icon: Bookmark },
  { to: "/dashboard/create", label: "Create Post", icon: FilePlus },
];

const bottomLinks = [
  { to: "/profile", label: "Profile", icon: User },
  {
    label: "Settings",
    icon: Settings,
    to: "/dashboard/settings", // Base path or just identifier
    subItems: [
      { to: "/dashboard/settings/security", label: "Password & Security", icon: Lock },
      { to: "/dashboard/settings/blocked", label: "Blocked", icon: Ban },
      { to: "/dashboard/settings/help", label: "Help", icon: HelpCircle },
      { to: "/dashboard/settings/privacy", label: "Privacy Center", icon: Shield },
      { to: "/dashboard/settings/account-center", label: "Account Center", icon: Fingerprint },
      { to: "/dashboard/settings", label: "Edit Account", icon: UserCog }, // Matches default settings page
    ]
  },
  { to: "/dashboard/help", label: "Help & Support", icon: HelpCircle },
];

const publicLinks = [
  { to: "/login", label: "Login", icon: LogIn },
  { to: "/register", label: "Register", icon: UserPlus },
]

export default function Sidebar({ className = "", mobile = false, onClose, showDesktopBrand = true }) {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();

  // State to track expanded menus (by label)
  const [expanded, setExpanded] = useState({ "Settings": false });

  const toggleExpand = (label) => {
    setExpanded(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const positionClasses = showDesktopBrand
    ? "h-screen sticky top-0"
    : "h-[calc(100vh-4rem)] sticky top-16";

  const baseClasses = mobile
    ? "flex flex-col w-[85vw] max-w-[300px] h-full bg-background/95 backdrop-blur-xl border-r border-border shadow-2xl"
    : `hidden sm:flex flex-col w-64 bg-background border-r border-border/40 ${positionClasses}`;

  const renderLinks = (items) => (
    items.map((link) => (
      <SidebarItem
        key={link.label}
        link={link}
        activePath={pathname}
        expanded={expanded}
        onToggle={toggleExpand}
        onCloseMobile={mobile ? onClose : undefined}
      />
    ))
  );

  const content = (
    <>
      {(mobile || showDesktopBrand) && (
        <div className="p-6 border-b border-border/40 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            <span className="text-primary">My</span>Blog
          </Link>
          {mobile && (
            <button onClick={onClose} className="p-1 rounded-full hover:bg-accent text-foreground/70">
              <X size={20} />
            </button>
          )}
        </div>
      )}

      <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto no-scrollbar overflow-x-hidden">
        {!user ? (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Join Us</p>
            {renderLinks(publicLinks)}
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Menu</p>
              {renderLinks(links)}
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Account</p>
              {renderLinks(bottomLinks)}
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

function SidebarItem({ link, activePath, expanded, onToggle, onCloseMobile }) {
  const hasSubItems = link.subItems && link.subItems.length > 0;
  const isExpanded = expanded[link.label];

  // Check if main link or any sub-item is active
  const isActive = activePath === link.to || (hasSubItems && link.subItems.some(sub => activePath === sub.to));

  const handleClick = (e) => {
    if (hasSubItems) {
      e.preventDefault(); // Prevent navigation if it has sub-items, just toggle
      onToggle(link.label);
    } else {
      if (onCloseMobile) onCloseMobile();
    }
  };

  return (
    <div className="mb-1">
      <Link
        to={link.to || "#"}
        onClick={handleClick}
        className="block relative group"
      >
        {/* Active Background for standalone items */}
        {isActive && !hasSubItems && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute inset-0 bg-primary/10 rounded-xl"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        <div className={`relative flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
          <div className="flex items-center gap-3">
            <link.icon size={20} />
            {link.label}
          </div>
          {hasSubItems && (
            <div className="text-muted-foreground/70">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          )}
        </div>
      </Link>

      {/* Sub-items */}
      <AnimatePresence>
        {hasSubItems && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden ml-4 pl-4 border-l border-border/50"
          >
            {link.subItems.map(sub => (
              <Link
                key={sub.to}
                to={sub.to}
                onClick={onCloseMobile}
                className={`block py-2 text-sm transition-colors ${activePath === sub.to ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
              >
                <div className="flex items-center gap-3">
                  {/* Optional: Show icon for sub-items too if simpler */}
                  {/* <sub.icon size={16} /> */}
                  {sub.label}
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

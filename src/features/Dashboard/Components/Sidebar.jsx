import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FilePlus, FileText, User, Settings, LogOut, LogIn, UserPlus, X, Bookmark,
  ChevronDown, ChevronRight, Shield, Lock, HelpCircle, UserCog, Ban, Fingerprint, Sparkles
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
    to: "/dashboard/settings",
    subItems: [
      { to: "/dashboard/settings/security", label: "Password & Security", icon: Lock },
      { to: "/dashboard/settings/blocked", label: "Blocked", icon: Ban },
      { to: "/dashboard/settings/help", label: "Help Center", icon: HelpCircle },
      { to: "/dashboard/settings/privacy", label: "Privacy Hub", icon: Shield },
      { to: "/dashboard/settings/account-center", label: "Account Center", icon: Fingerprint },
      { to: "/dashboard/settings", label: "Config Account", icon: UserCog },
    ]
  },
  { to: "/dashboard/help", label: "Support", icon: HelpCircle },
];

const publicLinks = [
  { to: "/login", label: "Login", icon: LogIn },
  { to: "/register", label: "Register", icon: UserPlus },
]

export default function Sidebar({ className = "", mobile = false, onClose, showDesktopBrand = true }) {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const [expanded, setExpanded] = useState({ "Settings": false });

  const toggleExpand = (label) => {
    setExpanded(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const positionClasses = showDesktopBrand
    ? "h-screen sticky top-0"
    : "h-[calc(100vh-4rem)] sticky top-16";

  const baseClasses = mobile
    ? "flex flex-col w-[85vw] max-w-[300px] h-full glass-panel border-r border-primary/10 shadow-2xl z-[100]"
    : `hidden lg:flex flex-col w-72 glass-panel border-r border-primary/10 ${positionClasses}`;

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
        <div className="p-8 border-b border-primary/5 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Sparkles className="text-white" size={16} />
            </div>
            <span className="text-xl font-black tracking-tighter">
                My<span className="text-primary">Blog</span>
            </span>
          </Link>
          {mobile && (
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-primary/10 text-foreground/70">
              <X size={20} />
            </button>
          )}
        </div>
      )}

      <div className="flex-1 py-8 px-6 space-y-10 overflow-y-auto no-scrollbar overflow-x-hidden">
        {!user ? (
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 px-2">Access Portal</p>
            <div className="space-y-1">{renderLinks(publicLinks)}</div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 px-2">Workspace</p>
              <div className="space-y-1">{renderLinks(links)}</div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 px-2">Identity & Config</p>
              <div className="space-y-1">{renderLinks(bottomLinks)}</div>
            </div>
          </>
        )}
      </div>

      {user && (
        <div className="p-6 border-t border-primary/5">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-4 text-sm font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-2xl transition-all group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Terminate</span>
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
  const isActive = activePath === link.to || (hasSubItems && link.subItems.some(sub => activePath === sub.to));

  const handleClick = (e) => {
    if (hasSubItems) {
      e.preventDefault();
      onToggle(link.label);
    } else {
      if (onCloseMobile) onCloseMobile();
    }
  };

  return (
    <div className="mb-2">
      <Link
        to={link.to || "#"}
        onClick={handleClick}
        className="block relative group"
      >
        {isActive && !hasSubItems && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute inset-0 bg-primary/10 rounded-2xl border border-primary/20 shadow-lg shadow-primary/5"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        <div className={`relative flex items-center justify-between px-4 py-3.5 text-sm font-bold tracking-tight transition-all duration-300 ${isActive ? "text-primary" : "text-foreground/70 hover:text-primary hover:translate-x-1"}`}>
          <div className="flex items-center gap-3">
            <div className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                <link.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            {link.label}
          </div>
          {hasSubItems && (
            <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} className="text-muted-foreground/40">
              <ChevronRight size={16} />
            </motion.div>
          )}
        </div>
      </Link>

      <AnimatePresence>
        {hasSubItems && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden ml-6 pl-4 border-l-2 border-primary/10 mt-2 space-y-1"
          >
            {link.subItems.map(sub => (
              <Link
                key={sub.to}
                to={sub.to}
                onClick={onCloseMobile}
                className={`block py-2.5 text-xs font-bold uppercase tracking-widest transition-all ${activePath === sub.to ? "text-primary" : "text-muted-foreground hover:text-foreground hover:translate-x-1"}`}
              >
                <div className="flex items-center gap-3">
                  <sub.icon size={14} className={activePath === sub.to ? "text-primary" : "text-muted-foreground/40"} />
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

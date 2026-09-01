import React, { useState, useEffect, useRef } from "react";
import { 
  Search, Sparkles, FileText, ArrowRight, CornerDownLeft, Heart, MessageCircle,
  User, Settings, Shield, Lock, Ban, HelpCircle, Sun, UserCog, X, Compass, PlusCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const SYSTEM_ACTIONS = [
  {
    _id: "sys-settings",
    title: "Account Settings",
    content: "Update biography, location, and user preferences.",
    path: "/dashboard/settings/profile",
    category: "system",
    type: "settings"
  },
  {
    _id: "sys-security",
    title: "Password & Security",
    content: "Change password, setup 2FA, and manage active sessions.",
    path: "/dashboard/settings/security",
    category: "system",
    type: "security"
  },
  {
    _id: "sys-privacy",
    title: "Privacy Hub",
    content: "Manage search visibility, online status, and activity tracking.",
    path: "/dashboard/settings/privacy",
    category: "system",
    type: "privacy"
  },
  {
    _id: "sys-blocked",
    title: "Blocked Users",
    content: "Manage accounts you have blocked from contacting you.",
    path: "/dashboard/settings/blocked",
    category: "system",
    type: "blocked"
  },
  {
    _id: "sys-help",
    title: "Help & FAQ Center",
    content: "Read FAQs, guides, and get technical support.",
    path: "/dashboard/settings/help",
    category: "system",
    type: "help"
  },
  {
    _id: "sys-appearance",
    title: "Appearance Settings",
    content: "Switch between light, dark, and system themes.",
    path: "/dashboard/settings/appearance",
    category: "system",
    type: "appearance"
  }
];

const getSystemIcon = (type) => {
  switch (type) {
    case "settings": return <UserCog size={16} />;
    case "security": return <Lock size={16} />;
    case "privacy": return <Shield size={16} />;
    case "blocked": return <Ban size={16} />;
    case "help": return <HelpCircle size={16} />;
    case "appearance": return <Sun size={16} />;
    default: return <Settings size={16} />;
  }
};

export default function SpotlightSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("for_you"); // "for_you" | "users" | "more"
  const [searchResults, setSearchResults] = useState({
    forYou: [],
    users: [],
    more: []
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Bind ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen to custom window event to open spotlight search
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-spotlight-search", handleOpen);
    return () => window.removeEventListener("open-spotlight-search", handleOpen);
  }, []);

  // Reset selected index when active tab switches
  useEffect(() => {
    setSelectedIndex(0);
  }, [activeTab]);

  // Live filter query
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults({ forYou: [], users: [], more: [] });
      return;
    }

    try {
      const blogs = JSON.parse(localStorage.getItem("mock_db_blogs") || "[]");
      const drafts = JSON.parse(localStorage.getItem("mock_db_drafts") || "[]");
      const mockUsers = JSON.parse(localStorage.getItem("mock_db_users") || "[]");

      const queryLower = query.toLowerCase().trim();

      // 1. Filter Blogs (For You)
      const matchedBlogs = blogs.filter(b => 
        b.title?.toLowerCase().includes(queryLower) ||
        b.content?.toLowerCase().includes(queryLower) ||
        (Array.isArray(b.tags) 
          ? b.tags.some(t => t.toLowerCase().includes(queryLower)) 
          : b.tags?.toLowerCase().includes(queryLower))
      ).map(b => ({ ...b, category: "publication" }));

      // 2. Filter Users (Merge registered users and unique blog authors)
      const userMap = new Map();
      mockUsers.forEach(u => userMap.set(u._id || u.username, u));
      blogs.forEach(b => {
        if (b.userId && !userMap.has(b.userId._id || b.userId.username)) {
          userMap.set(b.userId._id || b.userId.username, {
            _id: b.userId._id,
            name: b.userId.name,
            username: b.userId.username,
            profilePicture: b.userId.profilePicture,
            profession: "Creator",
            bio: `Writer on XDrop. Author of "${b.title}".`
          });
        }
      });
      const allUsers = Array.from(userMap.values());
      const matchedUsers = allUsers.filter(u => 
        u.name?.toLowerCase().includes(queryLower) ||
        u.username?.toLowerCase().includes(queryLower) ||
        u.bio?.toLowerCase().includes(queryLower) ||
        u.profession?.toLowerCase().includes(queryLower)
      ).map(u => ({ ...u, category: "user" }));

      // 3. Filter Drafts & System Actions (More)
      const matchedDrafts = drafts.filter(d => 
        d.title?.toLowerCase().includes(queryLower) ||
        d.content?.toLowerCase().includes(queryLower) ||
        d.tags?.toLowerCase().includes(queryLower)
      ).map(d => ({ ...d, category: "draft" }));

      const matchedSystemActions = SYSTEM_ACTIONS.filter(s => 
        s.title?.toLowerCase().includes(queryLower) ||
        s.content?.toLowerCase().includes(queryLower)
      );

      const matchedMore = [...matchedDrafts, ...matchedSystemActions];

      setSearchResults({
        forYou: matchedBlogs,
        users: matchedUsers,
        more: matchedMore
      });

      setSelectedIndex(0);
    } catch (err) {
      console.error("Error querying DB for Spotlight:", err);
    }
  }, [query]);

  // Helper to get active results list
  const getActiveList = () => {
    if (activeTab === "for_you") return searchResults.forYou;
    if (activeTab === "users") return searchResults.users;
    if (activeTab === "more") return searchResults.more;
    return [];
  };

  const activeList = getActiveList();

  // Handle keyboard navigation inside search list
  const handleInputKeyDown = (e) => {
    const list = getActiveList();
    if (list.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % list.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + list.length) % list.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = list[selectedIndex];
      if (selected) {
        handleSelect(selected);
      }
    }
  };

  const handleSelect = (item) => {
    setOpen(false);
    setQuery("");
    if (item.category === "publication") {
      navigate(`/post/${item._id}`);
    } else if (item.category === "user") {
      navigate(`/profile?userId=${item._id}`);
    } else if (item.category === "draft") {
      navigate(`/dashboard/create?draftId=${item._id}`);
    } else if (item.category === "system") {
      navigate(item.path);
    }
  };

  // Reset query and states on close
  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveTab("for_you");
      setSearchResults({ forYou: [], users: [], more: [] });
    }
  }, [open]);

  const tabs = [
    { id: "for_you", label: "For You", icon: Sparkles, dataKey: "forYou" },
    { id: "users", label: "Users", icon: User, dataKey: "users" },
    { id: "more", label: "Drafts & Settings", icon: FileText, dataKey: "more" }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl w-[92vw] sm:w-full rounded-2xl sm:rounded-3xl border border-primary/20 glass-panel shadow-2xl p-0 overflow-hidden font-sans z-[150] top-[15%] sm:top-[20%] translate-y-0 flex flex-col gap-0 [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">Spotlight Search</DialogTitle>
        <DialogDescription className="sr-only">Search publications, creators, drafts, and system settings across XDrop.</DialogDescription>
        
        {/* Search Header Input */}
        <div className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-primary/10 relative bg-background/50">
          <Search size={20} className="text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search blogs, authors, drafts or settings..."
            className="flex-1 bg-transparent border-none text-foreground outline-none text-sm sm:text-base font-bold placeholder-muted-foreground/50 w-full min-w-0 pr-1"
            autoFocus
          />
          
          {/* Clear input button when query is present */}
          {query.trim() !== "" && (
            <button 
              onClick={() => setQuery("")}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
              title="Clear input"
            >
              <X size={15} />
            </button>
          )}

          {/* Dedicated ESC Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground/80 bg-primary/10 hover:bg-primary/20 border border-primary/15 px-2 py-1 rounded-md font-mono shrink-0 transition-colors cursor-pointer"
            title="Close modal (ESC)"
          >
            <span>ESC</span>
          </button>
        </div>

        {/* Tab Selectors */}
        <div className="flex items-center gap-1.5 sm:gap-2 border-b border-primary/10 px-3 sm:px-4 py-2 bg-primary/[0.02] overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const count = searchResults[tab.dataKey]?.length || 0;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border",
                  isActive
                    ? "bg-primary text-primary-foreground border-transparent shadow-md shadow-primary/20"
                    : "bg-muted/15 border-primary/5 text-muted-foreground hover:text-foreground hover:bg-primary/10"
                )}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
                {query.trim() !== "" && (
                  <span className={cn(
                    "ml-1 px-1.5 py-0.25 rounded-full text-[9px] font-bold font-mono border",
                    isActive 
                      ? "bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground" 
                      : "bg-muted/30 border-primary/10 text-muted-foreground"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Scrollable Results Area */}
        <div className="p-3 sm:p-4 max-h-[55vh] sm:max-h-[400px] overflow-y-auto no-scrollbar">
          {query.trim() === "" ? (
            /* Quick actions / landing view */
            <div className="space-y-3 py-1">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/70 px-1">Quick Destinations</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { title: "Explore Feed", path: "/feed", desc: "Discover latest broadcasts", icon: Sparkles },
                  { title: "Create Post", path: "/dashboard/create", desc: "Share your thoughts", icon: PlusCircle },
                  { title: "My Profile", path: "/profile", desc: "Configure your identity", icon: User },
                  { title: "Help Center", path: "/dashboard/help", desc: "Read FAQs and guides", icon: HelpCircle }
                ].map((dest) => (
                  <div
                    key={dest.path}
                    onClick={() => {
                      setOpen(false);
                      navigate(dest.path);
                    }}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-primary/10 hover:border-primary/30 bg-muted/10 hover:bg-primary/10 transition-all cursor-pointer group"
                  >
                    <div className="p-2.5 rounded-xl bg-primary/15 text-primary shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <dest.icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{dest.title}</p>
                      <p className="text-[10px] text-muted-foreground/80 truncate mt-0.5 font-medium">{dest.desc}</p>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          ) : activeList.length === 0 ? (
            /* Empty State for current tab */
            <div className="text-center py-12 px-4 text-muted-foreground/60 space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
                <Compass size={22} />
              </div>
              <p className="font-extrabold text-sm text-foreground uppercase tracking-wider pt-1">No matching signals</p>
              <p className="text-xs max-w-xs mx-auto leading-relaxed font-medium">
                No results found in "{tabs.find(t => t.id === activeTab)?.label}" matching "{query}".
              </p>
            </div>
          ) : (
            /* Results listing */
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1 mb-2">
                <p className="text-[9px] font-black uppercase tracking-wider text-primary/70 font-mono">
                  {tabs.find(t => t.id === activeTab)?.label} ({activeList.length})
                </p>
                <p className="text-[9px] font-bold text-muted-foreground/50 hidden sm:block font-mono">
                  Use ↑ ↓ to navigate, Enter to select
                </p>
              </div>

              {activeList.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item._id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer group text-left gap-3 relative overflow-hidden",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-md shadow-primary/5"
                        : "border-primary/5 hover:border-primary/20 hover:bg-muted/15"
                    )}
                  >
                    {/* Render according to Category */}
                    {activeTab === "for_you" && (
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {item.image && (
                          <img 
                            src={typeof item.image === "string" ? item.image : item.image?.url} 
                            alt={item.title} 
                            className="w-11 h-11 sm:w-12 sm:h-12 object-cover rounded-xl border border-primary/15 shrink-0 mt-0.5" 
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-bold sm:font-extrabold text-xs sm:text-sm text-foreground truncate group-hover:text-primary transition-colors flex-1">
                              {item.title}
                            </span>
                            {item.tags && (
                              <span className="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0 font-mono hidden sm:inline-block">
                                {Array.isArray(item.tags) ? item.tags[0] : String(item.tags).split(',')[0]}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] sm:text-xs text-muted-foreground/80 line-clamp-1 leading-relaxed mt-0.5 font-medium">
                            {item.content}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-[9px] sm:text-[10px] text-muted-foreground/60 font-semibold font-mono">
                            <span className="flex items-center gap-1"><Heart size={10} className="text-rose-500" /> {item.likes || 0}</span>
                            <span className="flex items-center gap-1"><MessageCircle size={10} className="text-blue-500" /> {item.comments || 0}</span>
                            <span>• by {item.author?.name || item.userId?.name || "Creator"}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "users" && (
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img 
                          src={item.profilePicture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80"} 
                          alt={item.name} 
                          className="w-10 h-10 sm:w-11 sm:h-11 object-cover rounded-full border border-primary/15 shrink-0" 
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-1.5 min-w-0">
                            <span className="font-bold sm:font-extrabold text-xs sm:text-sm text-foreground truncate">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground/60 font-mono shrink-0">
                              @{item.username}
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1 mt-0.5 font-medium">
                            {item.profession || item.bio || "Creator on XDrop"}
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === "more" && (
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={cn(
                          "p-2.5 rounded-xl shrink-0 transition-colors border",
                          item.category === "draft"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-primary/10 text-primary border-primary/20"
                        )}>
                          {item.category === "draft" ? <FileText size={16} /> : getSystemIcon(item.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-bold sm:font-extrabold text-xs sm:text-sm text-foreground truncate flex-1">
                              {item.title}
                            </span>
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border shrink-0 font-mono",
                              item.category === "draft"
                                ? "bg-amber-500/20 text-amber-500 border-amber-500/30"
                                : "bg-primary/20 text-primary border-primary/30"
                            )}>
                              {item.category === "draft" ? "Draft" : "Setting"}
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1 mt-0.5 font-medium">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Right action indicator */}
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {isSelected ? (
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-lg border border-primary/20">
                          <span className="hidden sm:inline">Select</span>
                          <CornerDownLeft size={10} className="stroke-[3]" />
                        </div>
                      ) : (
                        <ArrowRight size={14} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

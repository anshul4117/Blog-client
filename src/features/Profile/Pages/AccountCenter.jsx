import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import secureAPI from "@/lib/secureApi";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, Lock, Shield, Activity, LogOut, Compass, Trash2, Edit, Fingerprint, 
  Globe, Github, Twitter, Chrome, CloudDownload, Share2, Key, Sparkles, CheckCircle2, 
  AlertTriangle, AlertCircle, Laptop, Smartphone, FileDown, ArrowLeft, X, Layers,
  ChevronRight, Check, CheckSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AccountCenter() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Active Category Navigation Tab ("profile" | "security" | "integrations" | "data" | "sessions" | "danger" | "all")
  const [activeTab, setActiveTab] = useState("profile");

  // States
  const [profile, setProfile] = useState(null);
  const [postsCount, setPostsCount] = useState(0);
  const [draftsCount, setDraftsCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Connection states
  const [connections, setConnections] = useState({
    github: true,
    google: true,
    twitter: false,
    website: false
  });

  const [isDisconnecting, setIsDisconnecting] = useState(null);
  const [pendingDisconnectKey, setPendingDisconnectKey] = useState("");
  const [pendingDeleteExport, setPendingDeleteExport] = useState(null);

  // Available Data Exports List
  const [exportsList, setExportsList] = useState([
    { id: "exp-1", filename: "xdrop-data-archive.json", size: "248 KB", date: "June 20, 2026" },
    { id: "exp-2", filename: "xdrop-story-posts.zip", size: "1.2 MB", date: "June 22, 2026" }
  ]);

  // Modals
  const [activeModal, setActiveModal] = useState(null); // "logout-all" | "deactivate" | "delete" | "disconnect" | "delete-export" | "reset-security"
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Fetch metrics dynamically
  useEffect(() => {
    let mounted = true;
    
    const timer = setTimeout(() => {
      if (mounted) setIsLoading(false);
    }, 400);
    
    // Fetch profile
    secureAPI.get("/users/profile")
      .then(res => {
        if (mounted) {
          const data = res.data?.data?.getProfile || res.data?.getProfile || res.data || {};
          setProfile(data);
        }
      })
      .catch(err => console.error("Error fetching profile stats:", err));

    // Fetch my blogs count
    secureAPI.get("/blogs/myblogs")
      .then(res => {
        if (mounted) {
          const blogsData = res.data?.blogs || res.data?.data?.blogs || res.data?.data || [];
          setPostsCount(blogsData.length);
        }
      })
      .catch(err => console.error("Error fetching blogs length:", err));

    // Get drafts
    try {
      const storedDrafts = JSON.parse(localStorage.getItem("mock_db_drafts") || "[]");
      setDraftsCount(storedDrafts.length);
    } catch {
      setDraftsCount(0);
    }

    // Get saved bookmarks
    try {
      const storedSaved = JSON.parse(localStorage.getItem("mock_db_saved") || "[]");
      setSavedCount(storedSaved.length);
    } catch {
      setSavedCount(0);
    }

    // Get following/followers IDs
    try {
      const storedFollowers = JSON.parse(localStorage.getItem("mock_db_followers") || "[]");
      setFollowersCount(storedFollowers.length);
      const storedFollowing = JSON.parse(localStorage.getItem("mock_db_following") || "[]");
      setFollowingCount(storedFollowing.length);
    } catch {
      setFollowersCount(3);
      setFollowingCount(3);
    }

    return () => { 
      mounted = false; 
      clearTimeout(timer);
    };
  }, []);

  const handleConnectionClick = (key) => {
    if (connections[key]) {
      setPendingDisconnectKey(key);
      setActiveModal("disconnect");
    } else {
      setIsDisconnecting(key);
      setTimeout(() => {
        setConnections(prev => ({ ...prev, [key]: true }));
        toast.success(`${key.toUpperCase()} integration connected successfully. ✨`);
        setIsDisconnecting(null);
      }, 500);
    }
  };

  const handleConfirmDisconnect = () => {
    if (!pendingDisconnectKey) return;
    const key = pendingDisconnectKey;
    setIsDisconnecting(key);
    setActiveModal(null);
    setTimeout(() => {
      setConnections(prev => ({ ...prev, [key]: false }));
      toast.success(`${key.toUpperCase()} authentication disconnected. 🔓`);
      setIsDisconnecting(null);
      setPendingDisconnectKey("");
    }, 500);
  };

  const handleSimulatedExport = (actionName, extension) => {
    toast.success(`Export started: Compiling ${actionName}... 📂`);
    setTimeout(() => {
      const newExport = {
        id: "exp-" + Date.now(),
        filename: `xdrop-export-${actionName.toLowerCase().replace(/\s+/g, "-")}.${extension}`,
        size: "450 KB",
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setExportsList(prev => [newExport, ...prev]);
      toast.success(`${actionName} export archive compiled and created! 📝`);
    }, 1200);
  };

  const handleDeleteExportRequest = (exp) => {
    setPendingDeleteExport(exp);
    setActiveModal("delete-export");
  };

  const handleConfirmDeleteExport = () => {
    if (!pendingDeleteExport) return;
    setExportsList(prev => prev.filter(e => e.id !== pendingDeleteExport.id));
    setActiveModal(null);
    toast.success("Data archive deleted successfully. 🗑️");
    setPendingDeleteExport(null);
  };

  const handleConfirmResetSecurity = () => {
    setActiveModal(null);
    toast.success("Security preferences restored to defaults. 🛡️");
  };

  const handleConfirmLogoutAll = () => {
    setActiveModal(null);
    toast.success("Logged out of all other active sessions successfully. 🔐");
  };

  const handleConfirmDeactivate = () => {
    setActiveModal(null);
    toast.success("Your creator account has been deactivated. 🔴");
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmText !== "DELETE") return;
    setActiveModal(null);
    setDeleteConfirmText("");
    toast.success("Account deletion request submitted. Goodbye! 👋");
    setTimeout(() => {
      logout();
      navigate("/");
    }, 2000);
  };

  // Format Join Date
  const joinDate = profile?.dateOfJoin 
    ? new Date(profile.dateOfJoin).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : "Dec, 2024";

  // Category navigation items
  const navCategories = [
    { id: "profile", label: "Profile & Identity", icon: User, badge: "Overview" },
    { id: "security", label: "Login & Security", icon: Lock, badge: "Score 92%" },
    { id: "integrations", label: "Integrations", icon: Key, badge: `${Object.values(connections).filter(Boolean).length} Active` },
    { id: "data", label: "Data & Privacy", icon: FileDown, badge: `${exportsList.length} Files` },
    { id: "sessions", label: "Active Sessions", icon: Activity, badge: "3 Devices" },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle, badge: "Warning" },
    { id: "all", label: "View All Sections", icon: Layers, badge: "Full Workspace" }
  ];

  return (
    <PageTransition className="w-full space-y-6 font-sans pb-28 sm:pb-32 min-w-0">
      
      {/* 1. Account Identity Hero Header */}
      <div className="p-6 sm:p-7 rounded-[32px] glass-panel border border-primary/15 bg-gradient-to-r from-primary/10 via-background to-primary/5 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <img 
                src={profile?.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-primary/30 shadow-xl" 
                alt="Avatar" 
              />
              <div className="absolute -bottom-1 -right-1 h-4.5 w-4.5 rounded-full bg-emerald-500 border-2 border-background shadow-sm" title="Verified Creator Online" />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground truncate max-w-[280px] sm:max-w-md">
                  {profile?.name || "Demo User"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/25 font-mono shrink-0">
                  Premium Creator
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium flex-wrap">
                <span className="text-primary font-bold font-mono">@{profile?.username || "demouser"}</span>
                <span className="hidden sm:inline">•</span>
                <span className="truncate">{profile?.email || "demo@example.com"}</span>
              </div>

              <p className="text-[11px] text-muted-foreground/70 font-semibold font-mono">Member Since: {joinDate}</p>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-primary/10">
            <Link to="/dashboard/settings/profile">
              <Button className="w-full h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 gap-2 cursor-pointer">
                <Edit size={14} /> Edit Profile
              </Button>
            </Link>
            <Button 
              variant="outline"
              onClick={() => navigate("/profile")}
              className="w-full h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/20 hover:bg-primary/5 gap-2 cursor-pointer"
            >
              <User size={14} /> View Card
            </Button>
          </div>

        </div>
      </div>

      {/* 2. Mobile Horizontal Section Tabs Selector (<1024px) */}
      <div className="block lg:hidden overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-1.5 shrink-0">
          {navCategories.map((cat) => {
            const isActive = activeTab === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 border cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground border-transparent shadow-md shadow-primary/20"
                    : "bg-muted/15 border-primary/10 text-muted-foreground hover:text-foreground hover:bg-primary/10"
                )}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        /* Loading Skeleton */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="rounded-[32px] glass-card border-primary/10 p-6 space-y-4">
              <Skeleton className="h-10 w-full rounded-2xl" />
              <Skeleton className="h-10 w-full rounded-2xl" />
              <Skeleton className="h-10 w-full rounded-2xl" />
            </Card>
          </div>
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Card className="rounded-[32px] glass-panel border-primary/10 p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Executive Two-Column Settings Architecture */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-w-0">
          
          {/* 3. Left Contextual Settings Navigation (Desktop 4 cols) */}
          <aside className="hidden lg:flex lg:col-span-4 flex-col gap-6 sticky top-24">
            
            <Card className="rounded-[32px] glass-card border border-primary/15 shadow-xl overflow-hidden p-3 space-y-1">
              <div className="px-4 py-3 border-b border-primary/10 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary font-mono">Settings Categories</p>
                <Fingerprint size={14} className="text-primary" />
              </div>

              <div className="space-y-1 pt-1">
                {navCategories.map((cat) => {
                  const isActive = activeTab === cat.id;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id)}
                      className={cn(
                        "w-full px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-between gap-3 text-left cursor-pointer border group",
                        isActive 
                          ? "bg-primary text-primary-foreground border-transparent shadow-md shadow-primary/20" 
                          : "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:border-primary/10"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon size={16} className={cn("shrink-0", isActive ? "text-primary-foreground" : "text-primary group-hover:scale-110 transition-transform")} />
                        <span className="truncate">{cat.label}</span>
                      </div>
                      <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-md font-mono shrink-0 border",
                        isActive 
                          ? "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30" 
                          : "bg-muted/20 text-muted-foreground/80 border-primary/10"
                      )}>
                        {cat.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Compact Security Score Gauge Widget */}
            <Card className="rounded-[32px] glass-card border border-primary/15 shadow-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-primary" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary font-mono">Security Health Score</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase font-mono border border-emerald-500/20">92%</span>
              </div>

              <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} transition={{ duration: 1.5 }} className="h-full bg-primary" />
              </div>
              <p className="text-[10px] text-muted-foreground/80 font-medium leading-relaxed">OAuth encryption & 2FA active across all sessions.</p>
            </Card>

          </aside>

          {/* 4. Right Active Settings Workspace (Desktop 8 cols) */}
          <main className="lg:col-span-8 flex flex-col gap-6 min-w-0 w-full">
            
            {/* Section A: Profile & Identity Overview */}
            {(activeTab === "profile" || activeTab === "all") && (
              <Card className="rounded-[32px] glass-panel border border-primary/15 shadow-xl overflow-hidden min-w-0">
                <CardHeader className="bg-primary/5 border-b border-primary/10 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-extrabold text-foreground flex items-center gap-2">
                        <User size={18} className="text-primary" /> Profile & Account Overview
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground font-medium mt-0.5">
                        Your central account attributes, resonance statistics, and membership clearance.
                      </CardDescription>
                    </div>
                    <Link to="/dashboard/settings/profile">
                      <Button variant="outline" className="h-8 text-[10px] font-black uppercase tracking-wider px-3 rounded-xl border-primary/20 hover:bg-primary/10">
                        Edit Information
                      </Button>
                    </Link>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Account Metadata Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-muted/10 border border-primary/10 space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60 font-mono">Full Name</p>
                      <p className="text-sm font-extrabold text-foreground truncate">{profile?.name || "Demo User"}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/10 border border-primary/10 space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60 font-mono">Handle Name</p>
                      <p className="text-sm font-extrabold text-primary font-mono truncate">@{profile?.username || "demouser"}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/10 border border-primary/10 space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60 font-mono">Primary Email</p>
                      <p className="text-sm font-extrabold text-foreground truncate">{profile?.email || "demo@example.com"}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/10 border border-primary/10 space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60 font-mono">Clearance Status</p>
                      <p className="text-sm font-extrabold text-emerald-500 font-mono flex items-center gap-1">
                        <CheckCircle2 size={14} /> Verified Account
                      </p>
                    </div>
                  </div>

                  {/* Resonance Statistics Grid */}
                  <div className="space-y-3 pt-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary font-mono">Content & Audience Analytics</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 bg-primary/5 rounded-2xl border border-primary/10 text-center hover:bg-primary/10 transition-colors">
                        <span className="text-2xl font-black text-foreground font-mono">{postsCount}</span>
                        <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/70 mt-0.5">Publications</p>
                      </div>
                      <div className="p-3.5 bg-primary/5 rounded-2xl border border-primary/10 text-center hover:bg-primary/10 transition-colors">
                        <span className="text-2xl font-black text-foreground font-mono">{draftsCount}</span>
                        <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/70 mt-0.5">Active Drafts</p>
                      </div>
                      <div className="p-3.5 bg-primary/5 rounded-2xl border border-primary/10 text-center hover:bg-primary/10 transition-colors">
                        <span className="text-2xl font-black text-foreground font-mono">{savedCount}</span>
                        <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/70 mt-0.5">Saved Posts</p>
                      </div>
                      <div className="p-3.5 bg-primary/5 rounded-2xl border border-primary/10 text-center hover:bg-primary/10 transition-colors">
                        <span className="text-2xl font-black text-foreground font-mono">12.8K</span>
                        <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/70 mt-0.5">Total Reach</p>
                      </div>
                      <div className="p-3.5 bg-primary/5 rounded-2xl border border-primary/10 text-center hover:bg-primary/10 transition-colors">
                        <span className="text-xl font-black text-foreground font-mono">{1417 + followersCount}</span>
                        <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/70 mt-0.5">Audience</p>
                      </div>
                      <div className="p-3.5 bg-primary/5 rounded-2xl border border-primary/10 text-center hover:bg-primary/10 transition-colors">
                        <span className="text-xl font-black text-foreground font-mono">{677 + followingCount}</span>
                        <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/70 mt-0.5">Following</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Section B: Login & Security Console */}
            {(activeTab === "security" || activeTab === "all") && (
              <Card className="rounded-[32px] glass-panel border border-primary/15 shadow-xl overflow-hidden min-w-0">
                <CardHeader className="bg-primary/5 border-b border-primary/10 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-extrabold text-foreground flex items-center gap-2">
                      <Lock size={18} className="text-primary" /> Login & Security Console
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground font-medium mt-0.5">
                      Configure authentication credentials, 2-Factor protection, and backup keys.
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => setActiveModal("reset-security")}
                    className="h-8 text-[10px] font-extrabold uppercase tracking-wider px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 cursor-pointer shrink-0"
                  >
                    Reset Defaults
                  </Button>
                </CardHeader>

                <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-muted/10 border border-primary/10 flex justify-between items-center gap-3 hover:border-primary/25 transition-all">
                    <div>
                      <h4 className="font-extrabold text-sm text-foreground">Account Password</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">Last updated 3 months ago</p>
                    </div>
                    <Button 
                      onClick={() => navigate("/dashboard/settings/security")}
                      variant="outline" 
                      className="h-8 text-[10px] font-black uppercase tracking-wider px-3.5 rounded-xl border-primary/20 hover:bg-primary/10 shrink-0 cursor-pointer"
                    >
                      Configure
                    </Button>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/10 border border-primary/10 flex justify-between items-center gap-3 hover:border-primary/25 transition-all">
                    <div>
                      <h4 className="font-extrabold text-sm text-foreground">Two-Factor Auth</h4>
                      <p className="text-[11px] text-primary font-bold mt-0.5 flex items-center gap-1"><CheckCircle2 size={13} /> Active & Configured</p>
                    </div>
                    <Button 
                      onClick={() => navigate("/dashboard/settings/security")}
                      variant="outline" 
                      className="h-8 text-[10px] font-black uppercase tracking-wider px-3.5 rounded-xl border-primary/20 hover:bg-primary/10 shrink-0 cursor-pointer"
                    >
                      Configure
                    </Button>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/10 border border-primary/10 flex justify-between items-center gap-3 hover:border-primary/25 transition-all">
                    <div>
                      <h4 className="font-extrabold text-sm text-foreground">Trusted Login Keys</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">2 devices authorized</p>
                    </div>
                    <Button 
                      onClick={() => navigate("/dashboard/settings/security")}
                      variant="outline" 
                      className="h-8 text-[10px] font-black uppercase tracking-wider px-3.5 rounded-xl border-primary/20 hover:bg-primary/10 shrink-0 cursor-pointer"
                    >
                      Configure
                    </Button>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/10 border border-primary/10 flex justify-between items-center gap-3 hover:border-primary/25 transition-all">
                    <div>
                      <h4 className="font-extrabold text-sm text-foreground">Recovery Backup</h4>
                      <p className="text-[11px] text-primary font-bold mt-0.5 flex items-center gap-1"><CheckCircle2 size={13} /> 10 Codes Active</p>
                    </div>
                    <Button 
                      onClick={() => navigate("/dashboard/settings/security")}
                      variant="outline" 
                      className="h-8 text-[10px] font-black uppercase tracking-wider px-3.5 rounded-xl border-primary/20 hover:bg-primary/10 shrink-0 cursor-pointer"
                    >
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Section C: Connected Auth & Publishing Nodes */}
            {(activeTab === "integrations" || activeTab === "all") && (
              <Card className="rounded-[32px] glass-panel border border-primary/15 shadow-xl overflow-hidden min-w-0">
                <CardHeader className="bg-primary/5 border-b border-primary/10 py-5">
                  <CardTitle className="text-base font-extrabold text-foreground flex items-center gap-2">
                    <Key size={18} className="text-primary" /> Connected Auth & Publishing Integrations
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground font-medium mt-0.5">
                    Connect single sign-on providers and custom domain publishing endpoints.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* GitHub */}
                  <div className="p-4 rounded-2xl bg-muted/10 border border-primary/10 flex items-center justify-between gap-3 hover:border-primary/25 transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0"><Github size={20} /></div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs text-foreground truncate">GitHub OAuth</h4>
                        <span className={cn("inline-block text-[10px] font-bold mt-0.5 font-mono", connections.github ? "text-emerald-500" : "text-muted-foreground/60")}>
                          {connections.github ? "🟢 Connected" : "Disconnected"}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleConnectionClick("github")}
                      disabled={isDisconnecting === "github"}
                      variant={connections.github ? "destructive" : "outline"}
                      className="h-8 text-[10px] font-black uppercase tracking-wider px-3.5 rounded-xl shrink-0 cursor-pointer"
                    >
                      {connections.github ? "Disconnect" : "Connect"}
                    </Button>
                  </div>

                  {/* Google */}
                  <div className="p-4 rounded-2xl bg-muted/10 border border-primary/10 flex items-center justify-between gap-3 hover:border-primary/25 transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0"><Chrome size={20} /></div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs text-foreground truncate">Google Identity</h4>
                        <span className={cn("inline-block text-[10px] font-bold mt-0.5 font-mono", connections.google ? "text-emerald-500" : "text-muted-foreground/60")}>
                          {connections.google ? "🟢 Connected" : "Disconnected"}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleConnectionClick("google")}
                      disabled={isDisconnecting === "google"}
                      variant={connections.google ? "destructive" : "outline"}
                      className="h-8 text-[10px] font-black uppercase tracking-wider px-3.5 rounded-xl shrink-0 cursor-pointer"
                    >
                      {connections.google ? "Disconnect" : "Connect"}
                    </Button>
                  </div>

                  {/* X/Twitter */}
                  <div className="p-4 rounded-2xl bg-muted/10 border border-primary/10 flex items-center justify-between gap-3 hover:border-primary/25 transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0"><Twitter size={20} /></div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs text-foreground truncate">X / Twitter Signal</h4>
                        <span className={cn("inline-block text-[10px] font-bold mt-0.5 font-mono", connections.twitter ? "text-emerald-500" : "text-muted-foreground/60")}>
                          {connections.twitter ? "🟢 Connected" : "Disconnected"}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleConnectionClick("twitter")}
                      disabled={isDisconnecting === "twitter"}
                      variant={connections.twitter ? "destructive" : "outline"}
                      className="h-8 text-[10px] font-black uppercase tracking-wider px-3.5 rounded-xl shrink-0 cursor-pointer"
                    >
                      {connections.twitter ? "Disconnect" : "Connect"}
                    </Button>
                  </div>

                  {/* Custom Domain */}
                  <div className="p-4 rounded-2xl bg-muted/10 border border-primary/10 flex items-center justify-between gap-3 hover:border-primary/25 transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0"><Globe size={20} /></div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs text-foreground truncate">Custom Domain</h4>
                        <span className={cn("inline-block text-[10px] font-bold mt-0.5 font-mono", connections.website ? "text-emerald-500" : "text-muted-foreground/60")}>
                          {connections.website ? "🟢 Connected" : "Disconnected"}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleConnectionClick("website")}
                      disabled={isDisconnecting === "website"}
                      variant={connections.website ? "destructive" : "outline"}
                      className="h-8 text-[10px] font-black uppercase tracking-wider px-3.5 rounded-xl shrink-0 cursor-pointer"
                    >
                      {connections.website ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Section D: Data Portability Workspace */}
            {(activeTab === "data" || activeTab === "all") && (
              <Card className="rounded-[32px] glass-panel border border-primary/15 shadow-xl overflow-hidden min-w-0">
                <CardHeader className="bg-primary/5 border-b border-primary/10 py-5">
                  <CardTitle className="text-base font-extrabold text-foreground flex items-center gap-2">
                    <FileDown size={18} className="text-primary" /> Data Portability & Archive Downloads
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground font-medium mt-0.5">
                    Export your profile data, story posts, and active composition drafts.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    <div className="p-4.5 rounded-2xl bg-muted/10 border border-primary/10 flex flex-col justify-between h-44 hover:border-primary/25 transition-all">
                      <div>
                        <h4 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                          <CloudDownload size={16} className="text-primary" /> Full Log Archive
                        </h4>
                        <p className="text-xs text-muted-foreground/80 mt-2 leading-relaxed font-medium">Download JSON snapshot of user profile and logs.</p>
                      </div>
                      <Button 
                        onClick={() => handleSimulatedExport("Download User Data", "json")}
                        className="h-10 w-full rounded-xl text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                      >
                        Download JSON
                      </Button>
                    </div>

                    <div className="p-4.5 rounded-2xl bg-muted/10 border border-primary/10 flex flex-col justify-between h-44 hover:border-primary/25 transition-all">
                      <div>
                        <h4 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                          <Share2 size={16} className="text-primary" /> Export Posts
                        </h4>
                        <p className="text-xs text-muted-foreground/80 mt-2 leading-relaxed font-medium">Export publication history as Markdown files.</p>
                      </div>
                      <Button 
                        onClick={() => handleSimulatedExport("Export Publications", "zip")}
                        className="h-10 w-full rounded-xl text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                      >
                        Export Posts
                      </Button>
                    </div>

                    <div className="p-4.5 rounded-2xl bg-muted/10 border border-primary/10 flex flex-col justify-between h-44 hover:border-primary/25 transition-all">
                      <div>
                        <h4 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                          <Sparkles size={16} className="text-primary" /> Drafts Backup
                        </h4>
                        <p className="text-xs text-muted-foreground/80 mt-2 leading-relaxed font-medium">Backup composition drafts from local database.</p>
                      </div>
                      <Button 
                        onClick={() => handleSimulatedExport("Export Drafts", "zip")}
                        className="h-10 w-full rounded-xl text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                      >
                        Backup Drafts
                      </Button>
                    </div>

                  </div>

                  {/* Active Compiled Archives */}
                  {exportsList.length > 0 && (
                    <div className="pt-6 border-t border-primary/10 space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary font-mono">Compiled Archives Available for Download</p>
                      <div className="space-y-2">
                        {exportsList.map((exp) => (
                          <div key={exp.id} className="p-3.5 rounded-2xl bg-muted/10 border border-primary/10 flex items-center justify-between gap-4 hover:border-primary/25 transition-all">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2.5 rounded-xl bg-primary/15 text-primary shrink-0"><FileDown size={16} /></div>
                              <div className="min-w-0">
                                <p className="text-xs font-extrabold text-foreground truncate font-mono">{exp.filename}</p>
                                <p className="text-[10px] text-muted-foreground/70 font-semibold font-mono">{exp.size} • Compiled: {exp.date}</p>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleDeleteExportRequest(exp)}
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 shrink-0 cursor-pointer"
                              title="Delete archive"
                            >
                              <Trash2 size={15} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Section E: Active Sessions Timeline */}
            {(activeTab === "sessions" || activeTab === "all") && (
              <Card className="rounded-[32px] glass-panel border border-primary/15 shadow-xl overflow-hidden min-w-0">
                <CardHeader className="bg-primary/5 border-b border-primary/10 py-5">
                  <CardTitle className="text-base font-extrabold text-foreground flex items-center gap-2">
                    <Activity size={18} className="text-primary" /> Active Device Sessions Timeline
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground font-medium mt-0.5">
                    Authorized browser and mobile sessions currently authenticated with your profile.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6 space-y-5">
                  <div className="flex gap-4 items-start relative pl-2">
                    <div className="absolute left-6 top-10 bottom-0 w-[2px] bg-primary/20" />
                    <div className="h-11 w-11 rounded-2xl bg-primary/15 border border-primary/30 text-primary flex items-center justify-center shrink-0 shadow-md">
                      <Laptop size={20} />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="font-extrabold text-sm text-foreground flex items-center gap-2">
                          MacBook Pro M3 Max 
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-wider border border-emerald-500/20 font-mono">Current Device</span>
                        </p>
                        <span className="text-[10px] font-bold text-emerald-500 font-mono">🟢 Active Now</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">Chrome Browser • Neo-Tokyo, Earth</p>
                      <p className="text-[10px] text-muted-foreground/60 font-semibold font-mono">IP Address: 192.168.1.14</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start relative pl-2">
                    <div className="absolute left-6 top-10 bottom-0 w-[2px] bg-primary/20" />
                    <div className="h-11 w-11 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-sm">
                      <Smartphone size={20} />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="font-extrabold text-sm text-foreground">iPhone 15 Pro</p>
                        <span className="text-[10px] font-semibold text-muted-foreground/60 font-mono">4 hours ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">Safari Mobile • Kyoto, Japan</p>
                      <p className="text-[10px] text-muted-foreground/60 font-semibold font-mono">IP Address: 192.168.1.28</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start pl-2">
                    <div className="h-11 w-11 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-sm">
                      <Laptop size={20} />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="font-extrabold text-sm text-foreground">iPad Air 5th Gen</p>
                        <span className="text-[10px] font-semibold text-muted-foreground/60 font-mono">2 days ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">Safari Browser • London, UK</p>
                      <p className="text-[10px] text-muted-foreground/60 font-semibold font-mono">IP Address: 84.21.33.109</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Section F: Danger Zone */}
            {(activeTab === "danger" || activeTab === "all") && (
              <Card className="rounded-[32px] glass-panel border border-red-500/25 bg-red-500/5 shadow-2xl overflow-hidden min-w-0">
                <CardHeader className="bg-red-500/10 border-b border-red-500/15 py-5">
                  <CardTitle className="text-base font-extrabold text-red-500 flex items-center gap-2">
                    <AlertTriangle size={18} /> Danger Authorization Zone
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground font-medium mt-0.5">
                    Irreversible actions that affect your creator account and credentials.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 flex flex-col sm:flex-row gap-5 justify-between items-center">
                  <div className="text-center sm:text-left space-y-1">
                    <h4 className="font-extrabold text-sm text-foreground">Destructive Profile Actions</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-md font-medium">Terminating active sessions or wiping your account cannot be undone. Please proceed with caution.</p>
                  </div>

                  <div className="flex gap-2.5 flex-wrap w-full sm:w-auto shrink-0 justify-end">
                    <Button
                      onClick={() => setActiveModal("logout-all")}
                      variant="outline"
                      className="flex-1 sm:flex-none h-11 text-xs font-bold uppercase tracking-wider px-4 rounded-xl border-red-500/30 hover:bg-red-500/15 text-red-500 cursor-pointer"
                    >
                      Logout All
                    </Button>
                    <Button
                      onClick={() => setActiveModal("deactivate")}
                      className="flex-1 sm:flex-none h-11 text-xs font-bold uppercase tracking-wider px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                    >
                      Deactivate
                    </Button>
                    <Button
                      onClick={() => setActiveModal("delete")}
                      className="flex-1 sm:flex-none h-11 text-xs font-bold uppercase tracking-wider px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25 cursor-pointer"
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

          </main>
        </div>
      )}

      {/* 5. Confirmation Modals Panel (100% Contained & Portal Covered) */}
      <Dialog open={!!activeModal} onOpenChange={() => { setActiveModal(null); setDeleteConfirmText(""); }}>
        
        {/* Disconnect Integration Modal */}
        {activeModal === "disconnect" && (
          <DialogContent className="glass-panel border border-primary/20 max-w-md w-[92vw] sm:w-full rounded-3xl p-6 bg-background/95 backdrop-blur-xl shadow-2xl [&>button:last-child]:hidden">
            <DialogHeader className="mb-4 space-y-2">
              <DialogTitle className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                <AlertCircle size={20} className="text-red-500" /> Disconnect Integration Node?
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium text-xs leading-relaxed">
                Are you sure you want to remove your connected {pendingDisconnectKey.toUpperCase()} integration from your account authentication index?
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-2">
              <Button
                variant="outline"
                onClick={() => { setActiveModal(null); setPendingDisconnectKey(""); }}
                className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/20 hover:bg-primary/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDisconnect}
                className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white"
              >
                Disconnect
              </Button>
            </div>
          </DialogContent>
        )}

        {/* Delete Export Archive Modal */}
        {activeModal === "delete-export" && (
          <DialogContent className="glass-panel border border-primary/20 max-w-md w-[92vw] sm:w-full rounded-3xl p-6 bg-background/95 backdrop-blur-xl shadow-2xl [&>button:last-child]:hidden">
            <DialogHeader className="mb-4 space-y-2">
              <DialogTitle className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                <Trash2 size={20} className="text-red-500" /> Delete Archive File?
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium text-xs leading-relaxed">
                Delete compiled data archive <code className="bg-primary/10 px-1.5 py-0.5 rounded font-mono font-bold text-xs text-primary">{pendingDeleteExport?.filename}</code>? This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-2">
              <Button
                variant="outline"
                onClick={() => { setActiveModal(null); setPendingDeleteExport(null); }}
                className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/20 hover:bg-primary/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDeleteExport}
                className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Archive
              </Button>
            </div>
          </DialogContent>
        )}

        {/* Reset Security Settings Modal */}
        {activeModal === "reset-security" && (
          <DialogContent className="glass-panel border border-primary/20 max-w-md w-[92vw] sm:w-full rounded-3xl p-6 bg-background/95 backdrop-blur-xl shadow-2xl [&>button:last-child]:hidden">
            <DialogHeader className="mb-4 space-y-2">
              <DialogTitle className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                <Shield size={20} className="text-primary" /> Reset Security Defaults?
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium text-xs leading-relaxed">
                Restores security preferences to factory defaults, clears active login keys, and refreshes session tokens.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-2">
              <Button
                variant="outline"
                onClick={() => setActiveModal(null)}
                className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/20 hover:bg-primary/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmResetSecurity}
                className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Reset Settings
              </Button>
            </div>
          </DialogContent>
        )}

        {/* Logout All Devices Modal */}
        {activeModal === "logout-all" && (
          <DialogContent className="glass-panel border border-primary/20 max-w-md w-[92vw] sm:w-full rounded-3xl p-6 bg-background/95 backdrop-blur-xl shadow-2xl [&>button:last-child]:hidden">
            <DialogHeader className="mb-4 space-y-2">
              <DialogTitle className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                <LogOut size={20} className="text-red-500" /> Terminate All Other Sessions?
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium text-xs leading-relaxed">
                You will be immediately logged out of all other active browser session tabs and mobile devices.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-2">
              <Button
                variant="outline"
                onClick={() => setActiveModal(null)}
                className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/20 hover:bg-primary/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmLogoutAll}
                className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm Logout
              </Button>
            </div>
          </DialogContent>
        )}

        {/* Deactivate Account Modal */}
        {activeModal === "deactivate" && (
          <DialogContent className="glass-panel border border-primary/20 max-w-md w-[92vw] sm:w-full rounded-3xl p-6 bg-background/95 backdrop-blur-xl shadow-2xl [&>button:last-child]:hidden">
            <DialogHeader className="mb-4 space-y-2">
              <DialogTitle className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                <AlertCircle size={20} className="text-amber-500" /> Deactivate Creator Profile?
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium text-xs leading-relaxed">
                Temporarily disables your feed signals. Your profile and story history will be hidden until you sign back in.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-2">
              <Button
                variant="outline"
                onClick={() => setActiveModal(null)}
                className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/20 hover:bg-primary/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDeactivate}
                className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-600 hover:bg-amber-700 text-white"
              >
                Deactivate
              </Button>
            </div>
          </DialogContent>
        )}

        {/* Delete Account Modal */}
        {activeModal === "delete" && (
          <DialogContent className="glass-panel border border-red-500/25 max-w-md w-[92vw] sm:w-full rounded-3xl p-6 bg-background/95 backdrop-blur-xl shadow-2xl [&>button:last-child]:hidden">
            <DialogHeader className="mb-4 space-y-2">
              <DialogTitle className="text-xl font-extrabold tracking-tight flex items-center gap-2 text-red-500">
                <AlertTriangle size={20} /> Permanent Account Wiping
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium text-xs leading-relaxed">
                This action is irreversible. All your publications, local drafts database, and credentials will be permanently wiped.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-2">
              <div className="space-y-2 text-left">
                <Label htmlFor="delete-input" className="text-[10px] font-black uppercase tracking-widest text-red-500">Type DELETE to unlock button</Label>
                <Input
                  id="delete-input"
                  type="text"
                  placeholder="DELETE"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="h-12 bg-muted/20 border-red-500/25 focus:border-red-500/60 focus:ring-4 focus:ring-red-500/10 transition-all rounded-xl text-foreground font-extrabold uppercase tracking-widest text-center"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => { setActiveModal(null); setDeleteConfirmText(""); }}
                  className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/20 hover:bg-primary/10"
                >
                  Cancel
                </Button>
                <Button
                  disabled={deleteConfirmText !== "DELETE"}
                  onClick={handleConfirmDelete}
                  className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-red-500/25"
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

    </PageTransition>
  );
}

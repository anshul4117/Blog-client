import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import secureAPI from "@/lib/secureApi";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, Settings, Lock, Shield, Activity, LogOut, Compass, Trash2, Edit, Fingerprint, 
  Globe, Github, Twitter, Chrome, CloudDownload, Share2, Key, Sparkles, Check, 
  CheckCircle2, AlertTriangle, AlertCircle, Laptop, Smartphone, FileDown
} from "lucide-react";

export default function AccountCenter() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
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

  const [isDisconnecting, setIsDisconnecting] = useState(null); // Key being updated
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
    
    // Simulated entry loading
    const timer = setTimeout(() => {
      if (mounted) setIsLoading(false);
    }, 600);
    
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
      // Disconnect requires confirmation dialog
      setPendingDisconnectKey(key);
      setActiveModal("disconnect");
    } else {
      // Connect directly with loading state
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
    }, 2000);
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
  };igate("/");
    }, 2000);
  };

  // Format Dates
  const joinDate = profile?.dateOfJoin 
    ? new Date(profile.dateOfJoin).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : "Dec, 2024";

  return (
    <PageTransition className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 rounded-xl hover:bg-primary/10">
          <ArrowLeft size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Back</span>
        </Button>
        <Link to="/feed">
          <Button variant="outline" className="gap-2 rounded-xl border-primary/20 hover:bg-primary/5">
            <Compass size={18} /> Explore Feed
          </Button>
        </Link>
      </div>

      {/* Header Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 font-mono">
          <Fingerprint size={12} /> Account Center Hub
        </div>
        <h2 className="text-4xl font-extrabold tracking-tighter">
          Central <span className="text-gradient">Account Center</span>
        </h2>
        <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed font-medium">
          Manage your unified profile attributes, connected auth nodes, check security metrics, and control privacy data downloads.
        </p>
      </div>

      {isLoading ? (
        // Loading Skeleton
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 flex flex-col gap-6 w-full">
            <Card className="rounded-[32px] glass-card border-primary/5 overflow-hidden p-6 space-y-4">
              <Skeleton className="h-20 w-20 rounded-[24px] mx-auto" />
              <Skeleton className="h-6 w-32 mx-auto" />
              <Skeleton className="h-4 w-40 mx-auto" />
              <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
              <Skeleton className="h-11 w-full rounded-xl mt-4" />
            </Card>
            <Card className="rounded-[32px] glass-card border-primary/5 p-6 space-y-4">
              <Skeleton className="h-5 w-40" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 rounded-2xl" />)}
              </div>
            </Card>
          </div>
          <div className="lg:col-span-8 flex flex-col gap-6 w-full">
            <Card className="rounded-[32px] glass-panel border-primary/5 p-6 space-y-4">
              <Skeleton className="h-5 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 rounded-2xl" />)}
              </div>
            </Card>
            <Card className="rounded-[32px] glass-panel border-primary/5 p-6 space-y-4">
              <Skeleton className="h-5 w-44" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 rounded-2xl" />)}
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel - Profile & Stats (4cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 w-full">
            {/* Section 1: Account Information */}
            <Card className="rounded-[32px] glass-card border-primary/5 shadow-2xl overflow-hidden relative">
              <div className="h-20 bg-gradient-to-r from-primary/30 to-secondary/30 relative" />
              <CardContent className="p-6 pt-0 flex flex-col items-center -mt-10 relative z-10 text-center space-y-4">
                <div className="h-20 w-20 rounded-[24px] overflow-hidden border-4 border-background shadow-lg">
                  <img 
                    src={profile?.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                    className="w-full h-full object-cover" 
                    alt="Avatar" 
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-foreground truncate">{profile?.name || "Demo User"}</h3>
                  <p className="text-xs text-primary font-bold">@{profile?.username || "demouser"}</p>
                  <p className="text-[10px] text-muted-foreground/60 font-semibold">{profile?.email || "demo@example.com"}</p>
                </div>

                <div className="w-full h-[1px] bg-primary/10 my-1" />

                <div className="w-full space-y-2.5 text-left text-xs font-semibold text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Member Since:</span>
                    <span className="text-foreground">{joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Type:</span>
                    <span className="text-primary font-bold">Premium Creator</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Level:</span>
                    <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[8px] font-black uppercase tracking-wider border border-primary/25">Verified Identity</span>
                  </div>
                </div>

                <div className="flex gap-2 w-full pt-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast.success("Redirecting to profile card... 📂");
                      navigate(`/profile`);
                    }}
                    className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider gap-1.5 border-primary/15 hover:bg-primary/5"
                  >
                    <User size={13} /> View Profile
                  </Button>
                  <Link to="/dashboard/settings/profile" className="flex-1">
                    <Button className="w-full h-11 rounded-xl text-xs font-bold uppercase tracking-wider gap-1.5">
                      <Edit size={13} /> Edit Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Account Statistics */}
            <Card className="rounded-[32px] glass-card border-primary/5 shadow-xl overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/5">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-primary font-mono">Resonance Statistics</CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-2 gap-4">
                <div className="p-3 bg-primary/5 rounded-2xl border border-primary/5 text-center">
                  <span className="text-2xl font-black text-foreground">{postsCount}</span>
                  <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60 mt-1">Publications</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-2xl border border-primary/5 text-center">
                  <span className="text-2xl font-black text-foreground">{draftsCount}</span>
                  <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60 mt-1">Drafts</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-2xl border border-primary/5 text-center">
                  <span className="text-2xl font-black text-foreground">{savedCount}</span>
                  <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60 mt-1">Saved Posts</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-2xl border border-primary/5 text-center">
                  <span className="text-2xl font-black text-foreground">12.4K</span>
                  <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60 mt-1">Mock Views</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-2xl border border-primary/5 text-center">
                  <span className="text-xl font-black text-foreground">{1417 + followersCount}</span>
                  <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60 mt-1">Audience</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-2xl border border-primary/5 text-center">
                  <span className="text-xl font-black text-foreground">{677 + followingCount}</span>
                  <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60 mt-1">Following</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Configuration & Danger Zone (8cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6 w-full">
            {/* Section 3: Login & Security Summary */}
            <Card className="rounded-[32px] glass-panel border-primary/5 shadow-lg overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-primary font-mono flex items-center gap-1.5"><Lock size={14} /> Login & Security Index</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-primary/20 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/10">Security Score: 92%</span>
                  <Button 
                    onClick={() => setActiveModal("reset-security")}
                    className="h-7 text-[9px] font-bold uppercase tracking-wider px-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/15 cursor-pointer"
                  >
                    Reset Security
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-muted/10 border border-primary/5 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">Account Password</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Last changed 3 months ago</p>
                  </div>
                  <Button 
                    onClick={() => navigate("/dashboard/settings/security")}
                    variant="outline" 
                    className="h-8 text-[10px] font-bold uppercase tracking-wider px-3 rounded-lg border-primary/10 hover:bg-primary/5"
                  >
                    Manage
                  </Button>
                </div>

                <div className="p-4 rounded-2xl bg-muted/10 border border-primary/5 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">Two-Factor Auth</h4>
                    <p className="text-[10px] text-primary font-bold mt-0.5 flex items-center gap-1"><CheckCircle2 size={12} /> Configured</p>
                  </div>
                  <Button 
                    onClick={() => navigate("/dashboard/settings/security")}
                    variant="outline" 
                    className="h-8 text-[10px] font-bold uppercase tracking-wider px-3 rounded-lg border-primary/10 hover:bg-primary/5"
                  >
                    Manage
                  </Button>
                </div>

                <div className="p-4 rounded-2xl bg-muted/10 border border-primary/5 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">Trusted Login Keys</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">2 devices authorized</p>
                  </div>
                  <Button 
                    onClick={() => navigate("/dashboard/settings/security")}
                    variant="outline" 
                    className="h-8 text-[10px] font-bold uppercase tracking-wider px-3 rounded-lg border-primary/10 hover:bg-primary/5"
                  >
                    Manage
                  </Button>
                </div>

                <div className="p-4 rounded-2xl bg-muted/10 border border-primary/5 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">Recovery Codes</h4>
                    <p className="text-[10px] text-primary font-bold mt-0.5 flex items-center gap-1"><CheckCircle2 size={12} /> Secure backup active</p>
                  </div>
                  <Button 
                    onClick={() => navigate("/dashboard/settings/security")}
                    variant="outline" 
                    className="h-8 text-[10px] font-bold uppercase tracking-wider px-3 rounded-lg border-primary/10 hover:bg-primary/5"
                  >
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Section 4: Connected Accounts */}
            <Card className="rounded-[32px] glass-panel border-primary/5 shadow-lg overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/5">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-primary font-mono flex items-center gap-1.5"><Key size={14} /> Connected Integrations</CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* GitHub */}
                <div className="p-4 rounded-2xl bg-muted/10 border border-primary/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary"><Github size={18} /></div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs">GitHub Authentication</h4>
                      <span className={`inline-block text-[9px] font-bold mt-0.5 ${connections.github ? "text-primary" : "text-muted-foreground/60"}`}>
                        {connections.github ? "🟢 Connected" : "Not Connected"}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleConnectionClick("github")}
                    disabled={isDisconnecting === "github"}
                    variant={connections.github ? "destructive" : "outline"}
                    className="h-8 text-[10px] font-bold uppercase tracking-wider px-3 rounded-lg shrink-0 cursor-pointer"
                  >
                    {connections.github ? "Disconnect" : "Connect"}
                  </Button>
                </div>

                {/* Google */}
                <div className="p-4 rounded-2xl bg-muted/10 border border-primary/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary"><Chrome size={18} /></div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs">Google Account</h4>
                      <span className={`inline-block text-[9px] font-bold mt-0.5 ${connections.google ? "text-primary" : "text-muted-foreground/60"}`}>
                        {connections.google ? "🟢 Connected" : "Not Connected"}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleConnectionClick("google")}
                    disabled={isDisconnecting === "google"}
                    variant={connections.google ? "destructive" : "outline"}
                    className="h-8 text-[10px] font-bold uppercase tracking-wider px-3 rounded-lg shrink-0 cursor-pointer"
                  >
                    {connections.google ? "Disconnect" : "Connect"}
                  </Button>
                </div>

                {/* X/Twitter */}
                <div className="p-4 rounded-2xl bg-muted/10 border border-primary/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary"><Twitter size={18} /></div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs">X / Twitter Node</h4>
                      <span className={`inline-block text-[9px] font-bold mt-0.5 ${connections.twitter ? "text-primary" : "text-muted-foreground/60"}`}>
                        {connections.twitter ? "🟢 Connected" : "Not Connected"}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleConnectionClick("twitter")}
                    disabled={isDisconnecting === "twitter"}
                    variant={connections.twitter ? "destructive" : "outline"}
                    className="h-8 text-[10px] font-bold uppercase tracking-wider px-3 rounded-lg shrink-0 cursor-pointer"
                  >
                    {connections.twitter ? "Disconnect" : "Connect"}
                  </Button>
                </div>

                {/* Web Domain */}
                <div className="p-4 rounded-2xl bg-muted/10 border border-primary/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary"><Globe size={18} /></div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs">Domain Mapping</h4>
                      <span className={`inline-block text-[9px] font-bold mt-0.5 ${connections.website ? "text-primary" : "text-muted-foreground/60"}`}>
                        {connections.website ? "🟢 Connected" : "Not Connected"}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleConnectionClick("website")}
                    disabled={isDisconnecting === "website"}
                    variant={connections.website ? "destructive" : "outline"}
                    className="h-8 text-[10px] font-bold uppercase tracking-wider px-3 rounded-lg shrink-0 cursor-pointer"
                  >
                    {connections.website ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Section 5: Data & Privacy Portability */}
            <Card className="rounded-[32px] glass-panel border-primary/5 shadow-lg overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/5">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-primary font-mono flex items-center gap-1.5"><FileDown size={14} /> Data Portability & Privacy</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-muted/10 border border-primary/5 flex flex-col justify-between h-40">
                    <div>
                      <h4 className="font-bold text-sm flex items-center gap-1.5"><CloudDownload size={16} className="text-primary" /> Archive Log</h4>
                      <p className="text-[10px] text-muted-foreground mt-1.5 leading-normal">Download a full JSON archive of your user logs and data logs.</p>
                    </div>
                    <Button 
                      onClick={() => handleSimulatedExport("Download My Data", "json")}
                      className="h-9 w-full rounded-xl text-[10px] font-bold uppercase tracking-wider gap-1.5 cursor-pointer"
                    >
                      Download Log
                    </Button>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/10 border border-primary/5 flex flex-col justify-between h-40">
                    <div>
                      <h4 className="font-bold text-sm flex items-center gap-1.5"><Share2 size={16} className="text-primary" /> Export Posts</h4>
                      <p className="text-[10px] text-muted-foreground mt-1.5 leading-normal">Export your publication history as standard Markdown files.</p>
                    </div>
                    <Button 
                      onClick={() => handleSimulatedExport("Export Publications", "zip")}
                      className="h-9 w-full rounded-xl text-[10px] font-bold uppercase tracking-wider gap-1.5 cursor-pointer"
                    >
                      Export Posts
                    </Button>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/10 border border-primary/5 flex flex-col justify-between h-40">
                    <div>
                      <h4 className="font-bold text-sm flex items-center gap-1.5"><Sparkles size={16} className="text-primary" /> Backup Drafts</h4>
                      <p className="text-[10px] text-muted-foreground mt-1.5 leading-normal">Backup your current active composition drafts database.</p>
                    </div>
                    <Button 
                      onClick={() => handleSimulatedExport("Export Drafts", "zip")}
                      className="h-9 w-full rounded-xl text-[10px] font-bold uppercase tracking-wider gap-1.5 cursor-pointer"
                    >
                      Backup Drafts
                    </Button>
                  </div>
                </div>

                {/* Simulated exports list */}
                {exportsList.length > 0 && (
                  <div className="pt-6 border-t border-primary/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary font-mono mb-3">Available Export Archives</p>
                    <div className="space-y-2">
                      {exportsList.map((exp) => (
                        <div key={exp.id} className="p-3.5 rounded-2xl bg-muted/10 border border-primary/5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0"><FileDown size={14} /></div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-foreground truncate">{exp.filename}</p>
                              <p className="text-[9px] text-muted-foreground/60 font-semibold">{exp.size} • Compiled: {exp.date}</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleDeleteExportRequest(exp)}
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 shrink-0 cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section 6: Login Session Activity */}
            <Card className="rounded-[32px] glass-panel border-primary/5 shadow-lg overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/5">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-primary font-mono flex items-center gap-1.5"><Activity size={14} /> Active Sessions Timeline</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 font-sans">
                {/* Session 1 */}
                <div className="flex gap-4 items-start relative">
                  <div className="absolute left-5 top-10 bottom-0 w-[1px] bg-primary/20" />
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center shrink-0 shadow-sm">
                    <Laptop size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-xs text-foreground flex items-center gap-2">
                      MacBook Pro M3 Max 
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-wider border border-emerald-500/20">Current Device</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground">Chrome Browser • Neo-Tokyo, Earth</p>
                    <p className="text-[9px] text-muted-foreground/60 font-semibold">Active Now • 192.168.1.14</p>
                  </div>
                </div>

                {/* Session 2 */}
                <div className="flex gap-4 items-start relative">
                  <div className="absolute left-5 top-10 bottom-0 w-[1px] bg-primary/20" />
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center shrink-0 shadow-sm">
                    <Smartphone size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-xs text-foreground">iPhone 15 Pro</p>
                    <p className="text-[10px] text-muted-foreground">Safari Mobile • Kyoto, Japan</p>
                    <p className="text-[9px] text-muted-foreground/60 font-semibold">4 hours ago • 192.168.1.28</p>
                  </div>
                </div>

                {/* Session 3 */}
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center shrink-0 shadow-sm">
                    <Laptop size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-xs text-foreground">iPad Air 5th Gen</p>
                    <p className="text-[10px] text-muted-foreground">Safari Browser • London, UK</p>
                    <p className="text-[9px] text-muted-foreground/60 font-semibold">2 days ago • 84.21.33.109</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 7: Danger Zone (Red themed) */}
            <Card className="rounded-[32px] glass-panel border-red-500/20 bg-red-500/5 shadow-2xl overflow-hidden">
              <CardHeader className="bg-red-500/10 border-b border-red-500/10">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-red-500 font-mono flex items-center gap-1.5"><AlertTriangle size={14} /> Danger Authorization Zone</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="text-center sm:text-left">
                  <h4 className="font-bold text-sm text-foreground">Destructive Profile Controls</h4>
                  <p className="text-[10px] text-muted-foreground mt-1 max-w-md leading-normal">Terminating all other active login keys or permanently wiping your creator database cannot be undone.</p>
                </div>

                <div className="flex gap-2 flex-wrap w-full sm:w-auto shrink-0 justify-end">
                  <Button
                    onClick={() => setActiveModal("logout-all")}
                    variant="outline"
                    className="flex-1 sm:flex-none h-11 text-[10px] font-bold uppercase tracking-wider px-4 rounded-xl border-red-500/25 hover:bg-red-500/10 text-red-500 cursor-pointer"
                  >
                    Logout All
                  </Button>
                  <Button
                    onClick={() => setActiveModal("deactivate")}
                    className="flex-1 sm:flex-none h-11 text-[10px] font-bold uppercase tracking-wider px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
                  >
                    Deactivate
                  </Button>
                  <Button
                    onClick={() => setActiveModal("delete")}
                    className="flex-1 sm:flex-none h-11 text-[10px] font-bold uppercase tracking-wider px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25 cursor-pointer"
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Confirmation Modals Panel */}
      <Dialog open={!!activeModal} onOpenChange={() => { setActiveModal(null); setDeleteConfirmText(""); }}>
        {/* Disconnect Google/GitHub Connected Accounts */}
        {activeModal === "disconnect" && (
          <DialogContent className="glass-panel border-primary/15 max-w-sm w-[90%] rounded-[32px] p-6 bg-background/95 backdrop-blur-xl">
            <DialogHeader className="mb-4 space-y-2">
              <DialogTitle className="text-xl font-extrabold tracking-tighter flex items-center gap-2">
                <AlertCircle size={18} className="text-red-500 animate-pulse" /> Disconnect Integration?
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-semibold text-xs leading-normal">
                Are you sure you want to remove your connected {pendingDisconnectKey.toUpperCase()} integration node from your profile auth index?
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-2">
              <Button
                variant="outline"
                onClick={() => { setActiveModal(null); setPendingDisconnectKey(""); }}
                className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/10 hover:bg-primary/5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDisconnect}
                className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-500 hover:bg-red-600 text-white"
              >
                Disconnect
              </Button>
            </div>
          </DialogContent>
        )}

        {/* Delete Export Archive */}
        {activeModal === "delete-export" && (
          <DialogContent className="glass-panel border-primary/15 max-w-sm w-[90%] rounded-[32px] p-6 bg-background/95 backdrop-blur-xl">
            <DialogHeader className="mb-4 space-y-2">
              <DialogTitle className="text-xl font-extrabold tracking-tighter flex items-center gap-2">
                <Trash2 size={18} className="text-red-500" /> Delete Archive?
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-semibold text-xs leading-normal">
                Are you sure you want to delete the compiled archive <code className="bg-primary/5 px-1 py-0.5 rounded font-bold text-[11px] text-primary">{pendingDeleteExport?.filename}</code>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-2">
              <Button
                variant="outline"
                onClick={() => { setActiveModal(null); setPendingDeleteExport(null); }}
                className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/10 hover:bg-primary/5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDeleteExport}
                className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        )}

        {/* Reset Security Settings */}
        {activeModal === "reset-security" && (
          <DialogContent className="glass-panel border-primary/15 max-w-sm w-[90%] rounded-[32px] p-6 bg-background/95 backdrop-blur-xl">
            <DialogHeader className="mb-4 space-y-2">
              <DialogTitle className="text-xl font-extrabold tracking-tighter flex items-center gap-2">
                <Shield size={18} className="text-red-500 animate-pulse" /> Reset Security Index?
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-semibold text-xs leading-normal">
                This will restore all security preferences to default settings, clear active browser sessions, and trigger a session refresh.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-2">
              <Button
                variant="outline"
                onClick={() => setActiveModal(null)}
                className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/10 hover:bg-primary/5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmResetSecurity}
                className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-500 hover:bg-red-600 text-white"
              >
                Reset Settings
              </Button>
            </div>
          </DialogContent>
        )}

        {/* Logout All Devices */}
        {activeModal === "logout-all" && (
          <DialogContent className="glass-panel border-primary/15 max-w-sm w-[90%] rounded-[32px] p-6 bg-background/95 backdrop-blur-xl">
            <DialogHeader className="mb-4 space-y-2">
              <DialogTitle className="text-xl font-extrabold tracking-tighter flex items-center gap-2">
                <LogOut size={18} className="text-red-500" /> Logout All Sessions?
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-semibold text-xs leading-normal">
                You will be immediately logged out of all other active browser session tabs and devices.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-2">
              <Button
                variant="outline"
                onClick={() => setActiveModal(null)}
                className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/10 hover:bg-primary/5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmLogoutAll}
                className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-500 hover:bg-red-600 text-white"
              >
                Confirm Logout
              </Button>
            </div>
          </DialogContent>
        )}

        {/* Deactivate Account */}
        {activeModal === "deactivate" && (
          <DialogContent className="glass-panel border-primary/15 max-w-sm w-[90%] rounded-[32px] p-6 bg-background/95 backdrop-blur-xl">
            <DialogHeader className="mb-4 space-y-2">
              <DialogTitle className="text-xl font-extrabold tracking-tighter flex items-center gap-2">
                <AlertCircle size={18} className="text-orange-500" /> Deactivate Account?
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-semibold text-xs leading-normal">
                This temporarily disables your feed signals. Your profile and story history will be hidden until you sign back in.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-2">
              <Button
                variant="outline"
                onClick={() => setActiveModal(null)}
                className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/10 hover:bg-primary/5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDeactivate}
                className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider bg-orange-600 hover:bg-orange-700 text-white"
              >
                Deactivate
              </Button>
            </div>
          </DialogContent>
        )}

        {/* Delete Account */}
        {activeModal === "delete" && (
          <DialogContent className="glass-panel border-red-500/20 max-w-md w-[90%] rounded-[32px] p-6 bg-background/95 backdrop-blur-xl">
            <DialogHeader className="mb-4 space-y-2">
              <DialogTitle className="text-xl font-extrabold tracking-tighter flex items-center gap-2 text-red-500">
                <AlertTriangle size={18} /> Permanent Deletion
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-semibold text-xs leading-normal">
                This action is irreversible. All your publications, local drafts database, and credentials will be permanently wiped.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-2">
              <div className="space-y-2 text-left">
                <Label htmlFor="delete-input" className="text-[10px] font-black uppercase tracking-widest text-red-500">Type DELETE to unlock</Label>
                <Input
                  id="delete-input"
                  type="text"
                  placeholder="DELETE"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="h-12 bg-muted/20 border-red-500/20 focus:border-red-500/60 focus:ring-4 focus:ring-red-500/5 transition-all rounded-xl text-foreground font-extrabold uppercase tracking-widest text-center"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => { setActiveModal(null); setDeleteConfirmText(""); }}
                  className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/10 hover:bg-primary/5"
                >
                  Cancel
                </Button>
                <Button
                  disabled={deleteConfirmText !== "DELETE"}
                  onClick={handleConfirmDelete}
                  className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
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

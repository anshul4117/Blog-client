import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/layout/PageTransition";
import BackgroundMesh from "@/components/ui/BackgroundMesh.jsx";
import PostCard from "@/components/blog/PostCard.jsx";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext.jsx";
import secureAPI from "@/lib/secureApi";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { 
  MapPin, Calendar, Edit, Award, LayoutGrid, List, ArrowLeft, 
  Compass, X, Share2, Github, Twitter, Globe, Link as LinkIcon, 
  Sparkles, ImagePlus, UserPlus, UserCheck, ShieldCheck, 
  TrendingUp, FileText
} from "lucide-react";

const MOCK_SYSTEM_USERS = [
  {
    _id: "mock-user-admin",
    name: "Anshul",
    username: "anshul4117",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
    role: "Founder & Architect",
    bio: "Creator of XDrop platform. Exploring next-gen user experience models and digital content broadcast channels."
  },
  {
    _id: "mock-user-elara",
    name: "Elara Vance",
    username: "elaravance",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80",
    role: "Lead Typographer",
    bio: "Obsessed with variable type scales, responsive spacing curves, and editorial design systems."
  },
  {
    _id: "mock-user-kaelen",
    name: "Kaelen Voss",
    username: "kaelenvoss",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    role: "Systems Engineer",
    bio: "Optimizing Vite runtimes, high-throughput API gateway nodes, and concurrent React compilation layers."
  },
  {
    _id: "mock-user-lyra",
    name: "Lyra Sterling",
    username: "lyrasterling",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=250&q=80",
    role: "UX Researcher",
    bio: "Studying cognitive load in highly animated, dark-mode interfaces and creator publishing workflows."
  },
  {
    _id: "mock-user-soren",
    name: "Soren Thorne",
    username: "sorenthorne",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
    role: "Security Cryptographer",
    bio: "Fusing decentralized identity concepts into standard web tokens and secure session stores."
  }
];

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get("userId");
  
  // Profile states
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [myBlogs, setMyBlogs] = useState([]);
  const [myBlogsLoading, setMyBlogsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [isGridView, setIsGridView] = useState(true);
  const [showFollowDialog, setShowFollowDialog] = useState(null); // "followers" | "following" | null

  // Cover image banner state
  const [profileCover, setProfileCover] = useState(() => {
    return localStorage.getItem(`profile_cover_${targetUserId || "me"}`) || null;
  });

  // Lock body scroll when dialogs are open
  useEffect(() => {
    if (showFollowDialog || showImageModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showFollowDialog, showImageModal]);

  // Followers & Following state management
  const [followerIds, setFollowerIds] = useState(() => {
    try {
      const stored = localStorage.getItem("mock_db_followers");
      if (!stored) {
        const initial = ["mock-user-admin", "mock-user-lyra", "mock-user-soren"];
        localStorage.setItem("mock_db_followers", JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(stored);
    } catch {
      return ["mock-user-admin", "mock-user-lyra", "mock-user-soren"];
    }
  });

  const [followingIds, setFollowingIds] = useState(() => {
    try {
      const stored = localStorage.getItem("mock_db_following");
      if (!stored) {
        const initial = ["mock-user-admin", "mock-user-elara", "mock-user-kaelen"];
        localStorage.setItem("mock_db_following", JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(stored);
    } catch {
      return ["mock-user-admin", "mock-user-elara", "mock-user-kaelen"];
    }
  });

  useEffect(() => {
    const handleFollowingChange = () => {
      try {
        const ids = JSON.parse(localStorage.getItem("mock_db_following") || "[]");
        setFollowingIds(ids);
      } catch (err) {
        console.error("Error listening to following state:", err);
      }
    };
    window.addEventListener("following-change", handleFollowingChange);
    return () => {
      window.removeEventListener("following-change", handleFollowingChange);
    };
  }, []);

  const handleFollowToggle = (targetId) => {
    const isFollowing = followingIds.includes(targetId);
    let updated;
    if (isFollowing) {
      updated = followingIds.filter(id => id !== targetId);
      toast.success("Unfollowed creator.");
    } else {
      updated = [...followingIds, targetId];
      toast.success("Following creator! ✨");
    }
    setFollowingIds(updated);
    localStorage.setItem("mock_db_following", JSON.stringify(updated));
    window.dispatchEvent(new Event("following-change"));
  };
  
  // Fetch creator profile
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const fetchProfile = async () => {
      try {
        const url = targetUserId ? `/users/profile?userId=${targetUserId}` : "/users/profile";
        const res = await secureAPI.get(url);
        if (mounted) {
          const data = res.data?.data?.getProfile || res.data?.getProfile || res.data?.data || res.data || {};
          setProfile(data);
          setProfileCover(localStorage.getItem(`profile_cover_${targetUserId || "me"}`) || null);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => { mounted = false; };
  }, [targetUserId]);

  // Fetch creator publications
  useEffect(() => {
    let mounted = true;
    setMyBlogsLoading(true);
    const fetchMyBlogs = async () => {
      try {
        const url = targetUserId ? `/blogs/myblogs?userId=${targetUserId}` : "/blogs/myblogs";
        const res = await secureAPI.get(url);
        if (mounted) {
          const blogsData = res.data?.blogs || res.data?.data?.blogs || res.data?.data || [];
          setMyBlogs(blogsData);
        }
      } catch (err) {
        console.error("Error fetching my blogs:", err);
      } finally {
        if (mounted) setMyBlogsLoading(false);
      }
    };
    fetchMyBlogs();

    const handleBlogDeleted = () => {
      fetchMyBlogs();
    };
    window.addEventListener("blog-deleted", handleBlogDeleted);

    return () => { 
      mounted = false; 
      window.removeEventListener("blog-deleted", handleBlogDeleted);
    };
  }, [targetUserId]);

  // Cover image change handler
  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileCover(reader.result);
        localStorage.setItem(`profile_cover_${targetUserId || "me"}`, reader.result);
        toast.success("Cover banner updated! 🎨");
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerCoverInput = () => {
    if (!targetUserId || targetUserId === user?._id) {
      document.getElementById("coverImageInput")?.click();
    }
  };

  const handleShareProfile = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Profile URL copied to clipboard! 📋");
  };

  const fallbackProfile = {
    name: user?.name || "John Doe",
    username: user?.username || "johndoe",
    role: "Digital Visionary",
    followersCount: 0,
    followingCount: 0,
    location: "Neo-Tokyo, Earth",
    memberSince: "Dec, 2024",
    bio: "Pioneering the next wave of digital storytelling. Building scalable architectures and beautiful experiences at the intersection of design, typography, and code.",
    techStack: ["React 19", "Node.js", "Tailwind v4", "Framer Motion", "MongoDB", "Design Systems"],
    badges: [
      { name: "Verified Creator", earnedOn: "Jan 2025", icon: Sparkles },
      { name: "Early Adopter", earnedOn: "Dec 2024", icon: Award }
    ],
    socials: {
      github: "https://github.com",
      twitter: "https://twitter.com",
      website: "https://anshul.dev"
    }
  };

  const profileData = profile ?? fallbackProfile;

  const memberSinceDate = profileData.dateOfJoin 
    ? new Date(profileData.dateOfJoin).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : profileData.memberSince || "Dec, 2024";

  const professionTitle = profileData.profession || profileData.role || "Digital Visionary";
  const isOwnProfile = !targetUserId || targetUserId === user?._id;

  const totalPosts = myBlogs.length;
  const totalLikes = myBlogs.reduce((acc, curr) => {
    if (Array.isArray(curr.likes)) return acc + curr.likes.length;
    return acc + (curr.likeCount || 0);
  }, 0);
  const totalComments = myBlogs.reduce((acc, curr) => acc + (curr.commentCount || 0), 0);

  if (loading) return (
    <PageTransition className="w-full space-y-6 font-sans pb-28 sm:pb-32 min-w-0">
      <div className="w-full h-56 rounded-[32px] bg-muted/20 animate-pulse" />
      <div className="flex items-center gap-6 px-6 -mt-16">
        <div className="w-32 h-32 rounded-3xl bg-muted/30 animate-pulse border-4 border-background" />
        <div className="space-y-2 flex-1 pt-8">
          <div className="h-7 w-48 bg-muted/30 rounded-xl animate-pulse" />
          <div className="h-4 w-32 bg-muted/20 rounded-lg animate-pulse" />
        </div>
      </div>
    </PageTransition>
  );

  return (
    <div className="relative min-h-screen bg-background w-full overflow-x-hidden">
      <BackgroundMesh />
      
      <PageTransition className="relative z-10 pb-28 sm:pb-32 pt-4 sm:pt-6 space-y-8 px-4 sm:px-6 max-w-7xl mx-auto min-w-0">
      
        {/* Navigation Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="gap-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/10 text-foreground hover:text-primary transition-all cursor-pointer border border-primary/10"
            >
              <ArrowLeft size={16} /> <span>Back</span>
            </Button>
            {!isOwnProfile && (
              <Button 
                variant="ghost" 
                onClick={() => navigate("/profile")} 
                className="gap-2 rounded-xl text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/10 transition-all cursor-pointer"
              >
                <Compass size={15} /> <span>My Profile</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleShareProfile}
              className="gap-2 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/20 text-foreground hover:bg-primary/10 cursor-pointer"
            >
              <Share2 size={15} /> <span className="hidden sm:inline">Share</span>
            </Button>
            <Link to="/feed">
              <Button className="gap-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90">
                <Compass size={16} /> <span className="hidden sm:inline">Explore Feed</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Hidden Cover Image file input */}
        <input
          type="file"
          id="coverImageInput"
          accept="image/*"
          className="hidden"
          onChange={handleCoverImageChange}
        />

        {/* 1. CREATOR IDENTITY HERO SURFACE */}
        <div className="relative rounded-[36px] overflow-hidden glass-panel border border-primary/15 shadow-2xl bg-gradient-to-b from-primary/5 via-background to-background">
          
          {/* Cover Section */}
          <div 
            onClick={triggerCoverInput}
            className={cn(
              "h-52 sm:h-64 relative group overflow-hidden bg-primary/10 transition-all",
              isOwnProfile ? "cursor-pointer" : ""
            )}
          >
            {profileCover ? (
              <img 
                src={profileCover} 
                alt="Cover Banner" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" 
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/15 to-secondary/20 mesh-gradient opacity-90" />
            )}
            
            {isOwnProfile && (
              <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                <span className="px-4 py-2 bg-background/90 border border-primary/20 rounded-2xl text-xs font-extrabold uppercase tracking-wider text-foreground shadow-xl flex items-center gap-2">
                  <ImagePlus size={15} className="text-primary" /> Update Banner
                </span>
              </div>
            )}
            
            {/* Fade transition into profile info */}
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>

          {/* Identity Information Composition — Full Name priority + Action Buttons on Metadata Row */}
          <div className="px-5 sm:px-8 pb-8 pt-2 relative z-10 space-y-5">
            
            {/* Top Identity Block: Avatar + Full Name & Role */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 min-w-0 w-full">
              
              {/* Avatar ONLY bridges the banner boundary */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="relative shrink-0 group -mt-16 sm:-mt-20 z-20"
              >
                <img
                  src={profileData.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                  alt="Avatar"
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-background shadow-2xl cursor-pointer group-hover:scale-[1.02] transition-transform bg-background"
                  onClick={() => setShowImageModal(true)}
                />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-background shadow-sm" title="Active Creator" />
                
                {isOwnProfile && (
                  <Link to="/dashboard/settings/profile">
                    <Button size="icon" className="absolute -top-2 -right-2 rounded-2xl w-9 h-9 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90">
                      <Edit size={15} />
                    </Button>
                  </Link>
                )}
              </motion.div>

              {/* Primary Identity Info — Full Name has highest layout priority */}
              <div className="space-y-1.5 min-w-0 flex-1 pt-1 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight break-words">
                  {profileData.name}
                </h1>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-0.5">
                  <p className="text-primary font-extrabold text-base sm:text-lg font-mono">
                    @{profileData.username}
                  </p>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/25 font-mono shrink-0 flex items-center gap-1">
                    <ShieldCheck size={13} /> {professionTitle}
                  </span>
                </div>
              </div>

            </div>

            {/* Metadata & Actions Row — Action buttons placed at right of Location/Joined metadata */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-1">
              
              {/* Location & Joined Date */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> {profileData.location || "Earth"}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> Joined {memberSinceDate}</span>
              </div>

              {/* Action Buttons — Moved after metadata to prevent squeezing the name */}
              <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-center md:justify-end">
                {!isOwnProfile ? (
                  <Button
                    onClick={() => handleFollowToggle(profileData._id)}
                    className={cn(
                      "h-10 px-5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md gap-2",
                      followingIds.includes(profileData._id)
                        ? "bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/25"
                        : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
                    )}
                  >
                    {followingIds.includes(profileData._id) ? <UserCheck size={15} /> : <UserPlus size={15} />}
                    <span>{followingIds.includes(profileData._id) ? "Following" : "Follow Creator"}</span>
                  </Button>
                ) : (
                  <>
                    <Link to="/dashboard/settings/profile" className="flex-1 sm:flex-initial">
                      <Button className="w-full h-10 px-5 rounded-xl text-xs font-black uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 gap-2 cursor-pointer">
                        <Edit size={14} /> Edit Profile
                      </Button>
                    </Link>
                    <Link to="/dashboard/settings/account-center" className="flex-1 sm:flex-initial">
                      <Button variant="outline" className="w-full h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/20 text-foreground hover:bg-primary/10 cursor-pointer">
                        Account Center
                      </Button>
                    </Link>
                  </>
                )}
              </div>

            </div>

            {/* 2. INTEGRATED SOCIAL RESONANCE & STATS BAR */}
            <div className="pt-6 border-t border-primary/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              
              <div className="p-3.5 rounded-2xl bg-muted/10 border border-primary/10">
                <span className="block text-2xl font-black text-foreground font-mono">{totalPosts}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-mono">Publications</span>
              </div>

              <button 
                onClick={() => setShowFollowDialog("followers")}
                className="p-3.5 rounded-2xl bg-muted/10 border border-primary/10 hover:bg-primary/10 hover:border-primary/20 transition-all cursor-pointer"
              >
                <span className="block text-2xl font-black text-foreground font-mono">{1417 + followerIds.length}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary font-mono">Audience</span>
              </button>

              <button 
                onClick={() => setShowFollowDialog("following")}
                className="p-3.5 rounded-2xl bg-muted/10 border border-primary/10 hover:bg-primary/10 hover:border-primary/20 transition-all cursor-pointer"
              >
                <span className="block text-2xl font-black text-foreground font-mono">{677 + followingIds.length}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-mono">Following</span>
              </button>

              <div className="p-3.5 rounded-2xl bg-muted/10 border border-primary/10">
                <span className="block text-2xl font-black text-foreground font-mono">12.8K</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-mono">Total Reach</span>
              </div>

            </div>

          </div>
        </div>

        {/* 3. CREATOR CONTEXT & DETAILS GRID (ASYMMETRIC 12-COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0">
          
          {/* Left Main Bio & Manifesto (8 cols) */}
          <div className="lg:col-span-8 space-y-6 min-w-0">
            <Card className="rounded-[32px] glass-card border border-primary/15 shadow-xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                  <Sparkles size={18} className="text-primary" /> Creator Bio & Manifesto
                </h2>
                <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-mono font-bold uppercase border border-primary/15">
                  Identity Token
                </span>
              </div>

              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-medium">
                {profileData.bio || "Pioneering the next wave of digital storytelling. Building scalable architectures and beautiful experiences."}
              </p>

              {/* Creator Tech Stack / Competencies */}
              <div className="pt-3 space-y-2.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary font-mono">Core Competencies & Stack</p>
                <div className="flex flex-wrap gap-2">
                  {(profileData.techStack || fallbackProfile.techStack).map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-muted/15 border border-primary/10 text-xs font-bold text-foreground font-mono">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Portals & Social Links (4 cols) */}
          <div className="lg:col-span-4 space-y-6 min-w-0">
            <Card className="rounded-[32px] glass-card border border-primary/15 shadow-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary font-mono flex items-center gap-2">
                  <Globe size={15} /> Social Portals
                </h3>
                <span className="text-[10px] font-bold text-muted-foreground font-mono">Verified</span>
              </div>

              <div className="space-y-2.5">
                <a href={profileData.socialLinks?.github || fallbackProfile.socials.github} target="_blank" rel="noreferrer" className="block">
                  <Button variant="outline" className="w-full justify-between h-10 px-4 rounded-xl text-xs font-bold border-primary/15 text-foreground hover:bg-primary/10 cursor-pointer">
                    <span className="flex items-center gap-2"><Github size={16} className="text-primary" /> GitHub Workspace</span>
                    <LinkIcon size={13} className="text-muted-foreground" />
                  </Button>
                </a>

                <a href={profileData.socialLinks?.twitter || fallbackProfile.socials.twitter} target="_blank" rel="noreferrer" className="block">
                  <Button variant="outline" className="w-full justify-between h-10 px-4 rounded-xl text-xs font-bold border-primary/15 text-foreground hover:bg-primary/10 cursor-pointer">
                    <span className="flex items-center gap-2"><Twitter size={16} className="text-primary" /> X / Twitter Handle</span>
                    <LinkIcon size={13} className="text-muted-foreground" />
                  </Button>
                </a>

                <a href={profileData.socialLinks?.website || fallbackProfile.socials.website} target="_blank" rel="noreferrer" className="block">
                  <Button variant="outline" className="w-full justify-between h-10 px-4 rounded-xl text-xs font-bold border-primary/15 text-foreground hover:bg-primary/10 cursor-pointer">
                    <span className="flex items-center gap-2"><Globe size={16} className="text-primary" /> Creator Portfolio</span>
                    <LinkIcon size={13} className="text-muted-foreground" />
                  </Button>
                </a>
              </div>

              {/* Verified Badges */}
              <div className="pt-2 border-t border-primary/10 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-mono">Platform Clearances</p>
                <div className="space-y-1.5">
                  {(profileData.badges || fallbackProfile.badges).map((badge, bIdx) => (
                    <div key={bIdx} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/10 border border-primary/10 text-xs font-bold text-foreground">
                      <span className="flex items-center gap-2"><Sparkles size={14} className="text-primary" /> {badge.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{badge.earnedOn}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

        </div>

        {/* 4. CONTENT WORKSPACE SECTION TRANSITION */}
        <div className="space-y-6 pt-4 min-w-0">
          
          {/* Section Divider & Tabs Header */}
          <div className="flex flex-wrap items-center justify-between border-b border-primary/15 pb-3 gap-4">
            
            <div className="flex items-center gap-3 sm:gap-6">
              <button 
                onClick={() => setActiveTab("posts")}
                className={cn(
                  "flex items-center gap-2 pb-2 text-xs sm:text-sm font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer",
                  activeTab === "posts" 
                    ? "border-primary text-foreground" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid size={16} className="text-primary" />
                <span>Publications ({myBlogs.length})</span>
              </button>

              <button 
                onClick={() => setActiveTab("analytics")}
                className={cn(
                  "flex items-center gap-2 pb-2 text-xs sm:text-sm font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer",
                  activeTab === "analytics" 
                    ? "border-primary text-foreground" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <TrendingUp size={16} className="text-primary" />
                <span>Analytics Overview</span>
              </button>
            </div>

            {/* Grid vs List View Controls */}
            {activeTab === "posts" && myBlogs.length > 0 && (
              <div className="flex items-center gap-1 bg-muted/20 border border-primary/10 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsGridView(true)}
                  className={cn(
                    "p-1.5 rounded-lg transition-all cursor-pointer",
                    isGridView 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Grid View"
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsGridView(false)}
                  className={cn(
                    "p-1.5 rounded-lg transition-all cursor-pointer",
                    !isGridView 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="List View"
                >
                  <List size={14} />
                </button>
              </div>
            )}

          </div>

          {/* Tab Content Display */}
          {activeTab === "posts" ? (
            myBlogsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-8">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="h-64 rounded-3xl bg-muted/15 border-primary/10 animate-pulse" />
                ))}
              </div>
            ) : myBlogs.length === 0 ? (
              <Card className="p-12 text-center glass-panel rounded-[36px] border-dashed border-primary/20 bg-primary/5 space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-lg">
                  <FileText className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-foreground">No publications broadcasted yet</h3>
                  <p className="text-xs text-muted-foreground font-medium max-w-sm mx-auto">
                    This creator hasn't published story signals yet. Check back soon for new content.
                  </p>
                </div>
                {isOwnProfile && (
                  <Link to="/dashboard/create" className="inline-block pt-2">
                    <Button className="rounded-xl h-11 px-6 text-xs font-black uppercase tracking-wider bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90">
                      Create First Publication
                    </Button>
                  </Link>
                )}
              </Card>
            ) : isGridView ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 min-w-0">
                {myBlogs.map((p, index) => (
                  <PostCard key={p._id} post={p} index={index} isGrid={true} />
                ))}
              </div>
            ) : (
              <div className="space-y-6 min-w-0">
                {myBlogs.map((p, index) => (
                  <PostCard key={p._id} post={p} index={index} isGrid={false} />
                ))}
              </div>
            )
          ) : (
            /* Analytics Overview Tab */
            <div className="space-y-6 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                
                <Card className="glass-panel p-6 rounded-[28px] border border-primary/15 text-center space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-mono">Total Publications</h4>
                  <span className="text-3xl font-black text-foreground font-mono">{totalPosts}</span>
                </Card>

                <Card className="glass-panel p-6 rounded-[28px] border border-primary/15 text-center space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-mono">Total Likes Received</h4>
                  <span className="text-3xl font-black text-primary font-mono">{totalLikes}</span>
                </Card>

                <Card className="glass-panel p-6 rounded-[28px] border border-primary/15 text-center space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-mono">Total Discussions</h4>
                  <span className="text-3xl font-black text-secondary font-mono">{totalComments}</span>
                </Card>

              </div>

              <Card className="glass-panel p-6 sm:p-7 rounded-[32px] border border-primary/15 space-y-4">
                <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                  <TrendingUp size={18} className="text-primary" /> Engagement Ratio & Velocity
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-muted-foreground font-mono">
                    <span>Average Interaction Density</span>
                    <span className="text-primary font-black">{totalPosts > 0 ? ((totalLikes + totalComments) / totalPosts).toFixed(1) : 0} signals / post</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000" 
                      style={{ width: `${Math.min(100, totalPosts > 0 ? ((totalLikes + totalComments) / totalPosts) * 12 : 0)}%` }} 
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}

        </div>

        {/* 5. PROFILE PICTURE LIGHTBOX MODAL */}
        <AnimatePresence>
          {showImageModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
              onClick={() => setShowImageModal(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative max-w-lg w-[92vw] sm:w-full p-2 glass-panel rounded-[36px] bg-background/95 border border-primary/20 shadow-2xl" 
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-4 right-4 rounded-full z-10 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 cursor-pointer"
                  onClick={() => setShowImageModal(false)}
                >
                  <X size={20} />
                </Button>
                <img
                  src={profileData.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                  alt="Profile High-Res"
                  className="w-full rounded-[30px] shadow-2xl object-cover aspect-square"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 6. FOLLOWERS / FOLLOWING CONNECTIONS DIALOG MODAL */}
        <AnimatePresence>
          {showFollowDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFollowDialog(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="relative w-full max-w-md max-h-[80vh] flex flex-col rounded-[32px] glass-panel border border-primary/20 bg-background/95 text-foreground backdrop-blur-xl overflow-hidden shadow-2xl z-10"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-primary/10 bg-primary/5 shrink-0">
                  <h3 className="font-extrabold text-base tracking-tight text-foreground flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" />
                    <span>{showFollowDialog === "followers" ? "Audience Connection Network" : "Outbound Following Nodes"}</span>
                  </h3>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => setShowFollowDialog(null)}
                    className="rounded-xl hover:bg-primary/10 h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X size={16} />
                  </Button>
                </div>

                {/* Connections List */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-3">
                  {(showFollowDialog === "followers" ? MOCK_SYSTEM_USERS.filter(u => followerIds.includes(u._id)) : MOCK_SYSTEM_USERS).map((prof) => {
                    const isFollowing = followingIds.includes(prof._id);
                    return (
                      <div key={prof._id} className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-muted/10 border border-primary/10 hover:border-primary/25 transition-all group">
                        <div 
                          onClick={() => {
                            setShowFollowDialog(null);
                            navigate(`/profile?userId=${prof._id}`);
                          }}
                          className="flex items-center gap-3 min-w-0 cursor-pointer"
                        >
                          <img src={prof.avatar} alt={prof.name} className="w-10 h-10 rounded-xl object-cover border border-primary/20 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-extrabold text-xs text-foreground truncate group-hover:text-primary transition-colors">{prof.name}</p>
                            <p className="text-[10px] text-primary font-bold font-mono truncate">@{prof.username}</p>
                            <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">{prof.bio}</p>
                          </div>
                        </div>
                        
                        {prof._id !== user?._id && (
                          <button
                            onClick={() => handleFollowToggle(prof._id)}
                            className={cn(
                              "text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer",
                              isFollowing
                                ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25 hover:bg-red-500/20"
                                : "bg-primary text-primary-foreground border-transparent hover:bg-primary/90 shadow-sm"
                            )}
                          >
                            {isFollowing ? "Following" : "Follow"}
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {showFollowDialog === "followers" && followerIds.length === 0 && (
                    <p className="text-center text-xs text-muted-foreground italic py-8">No audience connection signals detected.</p>
                  )}
                  {showFollowDialog === "following" && followingIds.length === 0 && (
                    <p className="text-center text-xs text-muted-foreground italic py-8">No outbound following links active.</p>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </PageTransition>
    </div>
  );
}

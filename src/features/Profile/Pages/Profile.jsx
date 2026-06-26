import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext.jsx";
import { useEffect, useState } from "react";
import secureAPI from "@/lib/secureApi";
import { MapPin, Calendar, Edit, Award, LayoutGrid, List, ArrowLeft, Compass, X, Share2, Github, Twitter, Globe, Link as LinkIcon, Sparkles, Heart, MessageSquare, Bookmark, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "@/components/blog/PostCard.jsx";

const MOCK_SYSTEM_USERS = [
  {
    _id: "mock-user-admin",
    name: "Anshul",
    username: "anshul4117",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
    role: "Founder & Architect",
    bio: "Creator of XDrop platform. Exploring next-gen user experience models."
  },
  {
    _id: "mock-user-elara",
    name: "Elara Vance",
    username: "elaravance",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80",
    role: "Lead Typographer",
    bio: "Obsessed with variable type scales and responsive spacing curves."
  },
  {
    _id: "mock-user-kaelen",
    name: "Kaelen Voss",
    username: "kaelenvoss",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    role: "Systems Engineer",
    bio: "Optimizing Vite runtimes and concurrent React compilation layers."
  },
  {
    _id: "mock-user-lyra",
    name: "Lyra Sterling",
    username: "lyrasterling",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=250&q=80",
    role: "UX Researcher",
    bio: "Studying cognitive load in highly animated, dark-mode interfaces."
  },
  {
    _id: "mock-user-soren",
    name: "Soren Thorne",
    username: "sorenthorne",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
    role: "Security Cryptographer",
    bio: "Fusing decentralized identity concepts into standard web tokens."
  }
];

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get("userId");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [myBlogs, setMyBlogs] = useState([]);
  const [myBlogsLoading, setMyBlogsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts"); // "posts" or "analytics"
  const [showFollowDialog, setShowFollowDialog] = useState(null); // null, "followers", or "following"

  // Prevent background scroll when dialogs/modals are open
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
        console.error(err);
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
    } else {
      updated = [...followingIds, targetId];
    }
    setFollowingIds(updated);
    localStorage.setItem("mock_db_following", JSON.stringify(updated));
    window.dispatchEvent(new Event("following-change"));
  };
  
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

  const fallbackProfile = {
    name: user?.name || "John Doe",
    username: user?.username || "johndoe",
    role: "Digital Visionary",
    followersCount: 0,
    followingCount: 0,
    location: "Neo-Tokyo, Earth",
    memberSince: "Dec, 2024",
    bio: "Pioneering the next wave of digital storytelling. Building scalable architectures and beautiful experiences at the intersection of design and code.",
    techStack: ["React 19", "Node.js", "Tailwind v4", "Framer Motion", "MongoDB"],
    badges: [
      { name: "Early Adopter", earnedOn: "Dec 2024", icon: <Award className="w-5 h-5 text-yellow-500" /> },
      { name: "Verified Creator", earnedOn: "Jan 2025", icon: <Sparkles className="w-5 h-5 text-primary" /> },
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

  const totalPosts = myBlogs.length;
  const totalLikes = myBlogs.reduce((acc, curr) => acc + (curr.likeCount || 0), 0);
  const totalComments = myBlogs.reduce((acc, curr) => acc + (curr.commentCount || 0), 0);

  if (loading) return (
    <PageTransition className="flex items-center justify-center min-h-[50vh]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg shadow-primary/20"></div>
    </PageTransition>
  );

  return (
    <div className="relative min-h-screen bg-background w-full overflow-x-hidden">
      <PageTransition className="relative z-10 pb-32 pt-6 sm:pt-8 space-y-8 px-4 max-w-7xl mx-auto">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 rounded-xl hover:bg-primary/10">
              <ArrowLeft size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Back</span>
            </Button>
            {targetUserId && targetUserId !== user?._id && (
                <Button 
                    variant="ghost" 
                    onClick={() => navigate("/profile")} 
                    className="gap-2 rounded-xl hover:bg-primary/10 text-primary font-bold text-xs"
                >
                    <Compass size={16} /> My Profile
                </Button>
            )}
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="gap-2 rounded-xl border-primary/20 hover:bg-primary/5">
                <Share2 size={16} /> <span className="hidden sm:inline">Share</span>
            </Button>
            <Link to="/feed">
                <Button className="gap-2 rounded-xl shadow-lg shadow-primary/20">
                    <Compass size={18} /> <span className="hidden sm:inline">Explore Feed</span>
                </Button>
            </Link>
        </div>
      </div>

      {/* Profile Identity Card */}
      <div className="relative rounded-[40px] overflow-hidden glass-panel border-primary/20 shadow-2xl">
        {/* Cover Section */}
        <div className="h-64 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary/80 opacity-80" />
            <div className="absolute inset-0 mesh-gradient opacity-40" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Info Section */}
        <div className="px-4 sm:px-8 pb-10 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8 text-center md:text-left">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative group"
            >
              <img
                src={profileData.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                alt="avatar"
                className="w-40 h-40 rounded-[32px] object-cover border-8 border-background shadow-2xl cursor-pointer hover:rotate-3 transition-transform"
                onClick={() => setShowImageModal(true)}
              />
              {(!targetUserId || targetUserId === user?._id) && (
                <Link to="/dashboard/settings/profile">
                  <Button size="icon" className="absolute -bottom-2 -right-2 rounded-2xl w-10 h-10 shadow-xl">
                    <Edit size={16} />
                  </Button>
                </Link>
              )}
            </motion.div>
 
            <div className="flex-1 pb-2 w-full">
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                    <h1 className="text-4xl font-extrabold tracking-tighter">{profileData.name}</h1>
                    {targetUserId && targetUserId !== user?._id ? (
                      <button
                        onClick={() => handleFollowToggle(profileData._id)}
                        className={`text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${
                          followingIds.includes(profileData._id)
                            ? "text-primary bg-primary/10 border-primary/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                            : "text-primary-foreground bg-primary border-transparent hover:bg-primary/95 shadow-md shadow-primary/20"
                        }`}
                      >
                        {followingIds.includes(profileData._id) ? "Following" : "Follow"}
                      </button>
                    ) : (
                      <div className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">Verified Identity</div>
                    )}
                </div>
                <p className="text-primary font-bold text-lg mb-1">@{profileData.username}</p>
                <p className="text-muted-foreground/80 font-semibold text-sm mb-4">{professionTitle}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5"><MapPin size={16} className="text-primary/60" /> {profileData.location || "Earth"}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={16} className="text-primary/60" /> Joined {memberSinceDate}</span>
                </div>
            </div>

            <div className="flex gap-8 px-8 py-6 rounded-3xl glass-panel bg-white/5 border-white/10 shrink-0">
                <button 
                    onClick={() => setShowFollowDialog("followers")}
                    className="text-center hover:bg-white/5 px-4 py-2 rounded-2xl transition-all duration-300 focus:outline-none cursor-pointer"
                >
                    <span className="block text-3xl font-black tracking-tighter">{1417 + followerIds.length}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Audience</span>
                </button>
                <button 
                    onClick={() => setShowFollowDialog("following")}
                    className="text-center hover:bg-white/5 px-4 py-2 rounded-2xl transition-all duration-300 focus:outline-none cursor-pointer"
                >
                    <span className="block text-3xl font-black tracking-tighter">{677 + followingIds.length}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Following</span>
                </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-6 border-t border-white/5 w-full">
                <a href={profileData.socialLinks?.github || fallbackProfile.socials.github} target="_blank" rel="noreferrer">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:text-primary"><Github size={20} /></Button>
                </a>
                <a href={profileData.socialLinks?.twitter || fallbackProfile.socials.twitter} target="_blank" rel="noreferrer">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:text-primary"><Twitter size={20} /></Button>
                </a>
                <a href={profileData.socialLinks?.website || fallbackProfile.socials.website} target="_blank" rel="noreferrer">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:text-primary"><Globe size={20} /></Button>
                </a>
                <div className="hidden sm:block h-10 w-[1px] bg-white/5 mx-2" />
                <a href={profileData.socialLinks?.website || fallbackProfile.socials.website} target="_blank" rel="noreferrer">
                    <Button variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/5 gap-2 px-6">
                        <LinkIcon size={16} /> Portfolio Link
                    </Button>
                </a>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar Intel */}
        <div className="space-y-6">
          <Card className="rounded-[32px] glass-panel border-primary/5 overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/5">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-primary">Mission Brief</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-sm text-muted-foreground leading-relaxed font-medium">
              {profileData.bio || "No mission bio set yet."}
            </CardContent>
          </Card>

          <Card className="rounded-[32px] glass-panel border-primary/5 overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/5">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-primary">Core Interests</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex flex-wrap gap-2">
              {(profileData.interests && profileData.interests.length > 0 ? profileData.interests : fallbackProfile.techStack).map((tech) => (
                <span key={tech} className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-[11px] font-bold border border-primary/10">
                  {tech}
                </span>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[32px] glass-panel border-primary/5 overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/5">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-primary">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              {fallbackProfile.badges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-4 group cursor-help">
                  <div className="p-3 rounded-2xl bg-yellow-500/10 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition-all">
                    {badge.icon}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{badge.name}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{badge.earnedOn}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Production Area */}
        <div className="md:col-span-2 space-y-8">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 border-b border-white/5 pb-1">
            <button 
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-2 pb-3 sm:pb-4 font-black uppercase tracking-widest text-[9px] sm:text-[11px] border-b-4 transition-all ${activeTab === "posts" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid size={16} /> Recent Publications
            </button>
            <button 
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 pb-3 sm:pb-4 font-black uppercase tracking-widest text-[9px] sm:text-[11px] border-b-4 transition-all ${activeTab === "analytics" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <List size={16} /> Performance Analytics
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
             {activeTab === "posts" ? (
               myBlogsLoading ? (
                 <div className="flex justify-center py-20">
                     <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg shadow-primary/20"></div>
                 </div>
               ) : myBlogs.length === 0 ? (
                 <div className="p-16 text-center glass-panel rounded-[40px] border-dashed border-primary/20 bg-primary/5">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-6 shadow-xl shadow-primary/10">
                        <LayoutGrid className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-foreground mb-2">No active publications</h3>
                    <p className="text-muted-foreground font-medium max-w-sm mx-auto">Your journey starts with a single word. Create your first post to populate your workspace.</p>
                    <Link to="/dashboard/create" className="inline-block mt-8">
                        <Button className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20">Initiate Project</Button>
                    </Link>
                 </div>
               ) : (
                 <div className="space-y-6">
                    {myBlogs.map((p, index) => (
                        <PostCard key={p._id} post={p} index={index} />
                    ))}
                 </div>
               )
             ) : (
               <div className="space-y-6">
                 {/* Stats summary cards */}
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                     <div className="glass-panel p-6 rounded-[32px] border-primary/10 bg-primary/5 text-center">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Total Publications</h4>
                         <span className="text-4xl font-black text-foreground">{totalPosts}</span>
                     </div>
                     <div className="glass-panel p-6 rounded-[32px] border-primary/10 bg-primary/5 text-center">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Total Likes</h4>
                         <span className="text-4xl font-black text-primary">{totalLikes}</span>
                     </div>
                     <div className="glass-panel p-6 rounded-[32px] border-primary/10 bg-primary/5 text-center">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Total Comments</h4>
                         <span className="text-4xl font-black text-secondary">{totalComments}</span>
                     </div>
                 </div>

                 {/* Influence overview */}
                 <div className="glass-panel p-8 rounded-[40px] border-primary/10 space-y-6">
                     <h3 className="text-xl font-bold tracking-tight text-foreground">Influence Index</h3>
                     <div className="space-y-4">
                         <div className="space-y-2">
                             <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                                 <span>Engagement Ratio</span>
                                 <span>{totalPosts > 0 ? ((totalLikes + totalComments) / totalPosts).toFixed(1) : 0} interactions/post</span>
                             </div>
                             <div className="h-2 w-full bg-muted/20 rounded-full overflow-hidden">
                                 <div className="h-full bg-primary" style={{ width: `${Math.min(100, totalPosts > 0 ? ((totalLikes + totalComments) / totalPosts) * 10 : 0)}%` }} />
                             </div>
                         </div>
                     </div>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Profile Picture Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-xl"
            onClick={() => setShowImageModal(false)}
          >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative max-w-xl w-[90vw] p-2 glass-panel rounded-[40px]" 
                onClick={(e) => e.stopPropagation()}
            >
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-4 right-4 rounded-full z-10 hover:bg-red-500/10 hover:text-red-500"
                onClick={() => setShowImageModal(false)}
              >
                <X size={24} />
              </Button>
              <img
                src={profileData.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                alt="Profile"
                className="w-full rounded-[36px] shadow-2xl object-cover aspect-square"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Follower/Following Modal Dialog */}
      <AnimatePresence>
        {showFollowDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFollowDialog(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-md max-h-[80vh] flex flex-col rounded-[32px] glass-panel border border-primary/25 bg-background/90 backdrop-blur-2xl overflow-hidden shadow-2xl z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-primary/10 bg-primary/5 shrink-0">
                <h3 className="font-extrabold text-xl tracking-tighter">
                  {showFollowDialog === "followers" ? "Audience Connection" : "Following Connections"}
                </h3>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => setShowFollowDialog(null)}
                  className="rounded-full hover:bg-primary/10 h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </Button>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
                {(showFollowDialog === "followers" ? MOCK_SYSTEM_USERS.filter(u => followerIds.includes(u._id)) : MOCK_SYSTEM_USERS).map((profile) => {
                  const isFollowing = followingIds.includes(profile._id);
                  return (
                    <div key={profile._id} className="flex gap-3.5 items-start py-3.5 px-4 rounded-[20px] bg-primary/5 border border-primary/5 hover:border-primary/10 hover:bg-primary/10 transition-all duration-300 group">
                      <div 
                        onClick={() => {
                          setShowFollowDialog(null);
                          navigate(`/profile?userId=${profile._id}`);
                        }}
                        className="h-10 w-10 rounded-full overflow-hidden border border-primary/10 shrink-0 mt-0.5 cursor-pointer hover:border-primary/30 transition-all"
                      >
                        <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                      </div>
                      <div 
                        onClick={() => {
                          setShowFollowDialog(null);
                          navigate(`/profile?userId=${profile._id}`);
                        }}
                        className="flex-1 min-w-0 cursor-pointer group/info text-left"
                      >
                        <p className="font-bold text-sm text-foreground truncate group-hover/info:text-primary transition-colors">{profile.name}</p>
                        <p className="text-xs text-primary font-medium">@{profile.username}</p>
                        <p className="text-[10px] text-muted-foreground font-semibold mt-0.5 leading-snug">{profile.bio}</p>
                      </div>
                      
                      {/* Follow Toggle */}
                      <button
                        onClick={() => handleFollowToggle(profile._id)}
                        className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all duration-300 self-center shrink-0 cursor-pointer ${
                          isFollowing
                            ? "text-primary bg-primary/10 border-primary/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                            : "text-primary-foreground bg-primary border-transparent hover:bg-primary/95 shadow-md shadow-primary/20"
                        }`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>
                  );
                })}

                {/* Empty check */}
                {showFollowDialog === "followers" && followerIds.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground italic py-8">No audience connection signals detected.</p>
                )}
                {showFollowDialog === "following" && followingIds.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground italic py-8">No outbound following links active.</p>
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

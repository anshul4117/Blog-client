import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext.jsx";
import { useEffect, useState } from "react";
import secureAPI from "@/lib/secureApi";
import { MapPin, Calendar, Edit, Award, LayoutGrid, List, ArrowLeft, Compass, X, Share2, Github, Twitter, Globe, Link as LinkIcon, Sparkles } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  
  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const res = await secureAPI.get("users/profile");
        if (mounted) {
            const data = res.data?.data?.getProfile || res.data?.getProfile || res.data?.data || res.data || {};
            setProfile(data);
        }
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => { mounted = false; };
  }, []);

  const fallbackProfile = {
    name: user?.name || "John Doe",
    username: user?.username || "johndoe",
    role: "Digital Visionary",
    followersCount: 1240,
    followingCount: 480,
    location: "Neo-Tokyo, Earth",
    memberSince: "Dec, 2024",
    bio: "Pioneering the next wave of digital storytelling. Building scalable architectures and beautiful experiences at the intersection of design and code.",
    techStack: ["React 19", "Node.js", "Tailwind v4", "Framer Motion", "MongoDB"],
    badges: [
      { name: "Early Adopter", earnedOn: "Dec 2024", icon: <Award className="w-5 h-5 text-yellow-500" /> },
      { name: "Verified Creator", earnedOn: "Jan 2025", icon: <Sparkles className="w-5 h-5 text-primary" /> },
    ],
    socials: {
        github: "https://github.com/anshul",
        twitter: "https://twitter.com/anshul",
        website: "https://anshul.dev"
    }
  };

  const profileData = profile ?? fallbackProfile;

  if (loading) return (
    <PageTransition className="flex items-center justify-center min-h-[50vh]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg shadow-primary/20"></div>
    </PageTransition>
  );

  return (
    <PageTransition className="pb-20 space-y-8 px-4 max-w-7xl mx-auto">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 rounded-xl hover:bg-primary/10">
          <ArrowLeft size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Return</span>
        </Button>
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
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-600 to-purple-900 opacity-80" />
            <div className="absolute inset-0 mesh-gradient opacity-40" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Info Section */}
        <div className="px-8 pb-10 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
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
              <Link to="/settings">
                <Button size="icon" className="absolute -bottom-2 -right-2 rounded-2xl w-10 h-10 shadow-xl">
                  <Edit size={16} />
                </Button>
              </Link>
            </motion.div>

            <div className="flex-1 pb-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-extrabold tracking-tighter">{profileData.name}</h1>
                    <div className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">Verified Identity</div>
                </div>
                <p className="text-primary font-bold text-lg mb-4">@{profileData.username}</p>
                
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5"><MapPin size={16} className="text-primary/60" /> {profileData.location}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={16} className="text-primary/60" /> Joined {profileData.memberSince}</span>
                </div>
            </div>

            <div className="flex gap-8 px-8 py-6 rounded-3xl glass-panel bg-white/5 border-white/10">
                <div className="text-center">
                    <span className="block text-3xl font-black tracking-tighter">{profileData.followersCount}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Audience</span>
                </div>
                <div className="text-center">
                    <span className="block text-3xl font-black tracking-tighter">{profileData.followingCount}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Following</span>
                </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-6 border-t border-white/5">
                <Button variant="ghost" size="icon" className="rounded-xl hover:text-primary"><Github size={20} /></Button>
                <Button variant="ghost" size="icon" className="rounded-xl hover:text-primary"><Twitter size={20} /></Button>
                <Button variant="ghost" size="icon" className="rounded-xl hover:text-primary"><Globe size={20} /></Button>
                <div className="h-10 w-[1px] bg-white/5 mx-2" />
                <Button variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/5 gap-2 px-6">
                    <LinkIcon size={16} /> Portfolio Link
                </Button>
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
              {profileData.bio}
            </CardContent>
          </Card>

          <Card className="rounded-[32px] glass-panel border-primary/5 overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/5">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-primary">Core Stack</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex flex-wrap gap-2">
              {(profileData.techStack || []).map((tech) => (
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
              {(profileData.badges || []).map((badge, idx) => (
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
          <div className="flex items-center gap-6 border-b border-white/5 pb-1">
            <button className="flex items-center gap-2 pb-4 border-b-4 border-primary text-foreground font-black uppercase tracking-widest text-[11px]">
              <LayoutGrid size={16} /> Recent Projects
            </button>
            <button className="flex items-center gap-2 pb-4 text-muted-foreground hover:text-foreground transition-colors font-black uppercase tracking-widest text-[11px]">
              <List size={16} /> Log History
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
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
    </PageTransition>
  );
}

import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { ShieldAlert, Search, Compass, Trash2, ArrowLeft, Check, Sparkles, SlidersHorizontal, UserMinus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const INITIAL_BLOCKED_USERS = [
  {
    _id: "mock-user-soren",
    name: "Soren Thorne",
    username: "sorenthorne",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
    role: "Security Cryptographer",
    bio: "Fusing decentralized identity concepts into standard web tokens.",
    location: "Geneva, Switzerland",
    dateBlocked: new Date(Date.now() - 3600000 * 24 * 5).toISOString(), // 5 days ago
    reason: "Spam behavior"
  },
  {
    _id: "mock-user-lyra",
    name: "Lyra Sterling",
    username: "lyrasterling",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=250&q=80",
    role: "UX Researcher",
    bio: "Studying cognitive load in highly animated, dark-mode interfaces.",
    location: "London, UK",
    dateBlocked: new Date(Date.now() - 3600000 * 24 * 12).toISOString(), // 12 days ago
    reason: "Spam behavior"
  }
];

export default function BlockedUsers() {
  const navigate = useNavigate();
  const [blockedList, setBlockedList] = useState(() => {
    try {
      const stored = localStorage.getItem("mock_db_blocked");
      if (!stored) {
        localStorage.setItem("mock_db_blocked", JSON.stringify(INITIAL_BLOCKED_USERS));
        return INITIAL_BLOCKED_USERS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_BLOCKED_USERS;
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // "recent" | "alpha"
  const [selectedUser, setSelectedUser] = useState(null); // User to unblock
  const [isUnblockDialogOpen, setIsUnblockDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Sync with LocalStorage
  const saveToStorage = (list) => {
    localStorage.setItem("mock_db_blocked", JSON.stringify(list));
    setBlockedList(list);
  };

  // Filter and Sort Blocked Users
  const filteredUsers = useMemo(() => {
    let result = [...blockedList];
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.username.toLowerCase().includes(q)
      );
    }

    if (sortBy === "alpha") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Sort by date blocked (descending)
      result.sort((a, b) => new Date(b.dateBlocked) - new Date(a.dateBlocked));
    }

    return result;
  }, [blockedList, searchQuery, sortBy]);

  const handleUnblockRequest = (user) => {
    setSelectedUser(user);
    setIsUnblockDialogOpen(true);
  };

  const handleConfirmUnblock = () => {
    if (!selectedUser) return;
    const updated = blockedList.filter(u => u._id !== selectedUser._id);
    saveToStorage(updated);
    setIsUnblockDialogOpen(false);
    toast.success(`${selectedUser.name} unblocked successfully. ✨`);
    setSelectedUser(null);
  };

  return (
    <PageTransition className="max-w-4xl mx-auto py-8 px-4 space-y-8">
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

      {/* Header Info */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
          <SlidersHorizontal size={12} /> Security Console
        </div>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-4xl font-extrabold tracking-tighter">
            Blocked <span className="text-gradient">Users</span>
          </h2>
          <span className="px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs border border-primary/15 shadow-inner">
            Blocked: {blockedList.length}
          </span>
        </div>
        <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed font-medium">
          Users listed below are restricted from viewing your story cards, sending messages, or interacting with your profile.
        </p>
      </div>

      {/* Controls Deck */}
      {blockedList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="relative md:col-span-8 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary transition-colors" size={16} />
            <Input
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-11 bg-muted/20 border-primary/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all rounded-xl text-foreground font-medium"
            />
          </div>
          <div className="flex gap-2 md:col-span-4 justify-end">
            <Button
              variant={sortBy === "recent" ? "default" : "outline"}
              onClick={() => setSortBy("recent")}
              className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Recent
            </Button>
            <Button
              variant={sortBy === "alpha" ? "default" : "outline"}
              onClick={() => setSortBy("alpha")}
              className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              A-Z
            </Button>
          </div>
        </div>
      )}

      {/* Users Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="rounded-3xl glass-card border-primary/5 p-5 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left min-w-0 w-full">
                  <Skeleton className="h-16 w-16 rounded-[20px] shrink-0" />
                  <div className="space-y-2.5 min-w-0 w-full py-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-[80%] max-w-md" />
                    <div className="flex gap-4 pt-1 justify-center sm:justify-start">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                  <Skeleton className="h-10 w-full sm:w-28 rounded-xl" />
                  <Skeleton className="h-10 w-full sm:w-28 rounded-xl" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[400px] glass-panel rounded-[40px] border-dashed border-primary/20 bg-primary/5 p-12 text-center"
          >
            <div className="h-20 w-20 rounded-[28px] bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/10">
              <ShieldAlert size={36} className="text-primary animate-pulse" />
            </div>
            <h3 className="text-2xl font-black tracking-tighter mb-3 text-foreground">
              {blockedList.length === 0 ? "You haven't blocked anyone" : "No matching users found"}
            </h3>
            <p className="text-muted-foreground font-medium max-w-sm mx-auto mb-8 leading-relaxed text-sm">
              {blockedList.length === 0 
                ? "Your connection lists are clear. Go to the Feed to discover broadcasts and interact with the creator community." 
                : "Adjust your search terms to find users in your blocked list."}
            </p>
            <Link to="/feed">
              <Button size="lg" className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                Back to Feed
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((profile, index) => (
                <motion.div
                  key={profile._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="rounded-3xl glass-card border-primary/5 hover:border-primary/20 transition-all duration-300 overflow-hidden shadow-md">
                    <CardContent className="p-5 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left min-w-0">
                        {/* Avatar */}
                        <div className="h-16 w-16 rounded-[20px] overflow-hidden border border-primary/15 shrink-0 shadow-md">
                          <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                        </div>
                        {/* Profile Info */}
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                            <p className="font-extrabold text-base text-foreground truncate">{profile.name}</p>
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/10 self-center">
                              @{profile.username}
                            </span>
                          </div>
                          <p className="text-xs text-primary font-bold">{profile.role}</p>
                          <p className="text-[11px] text-muted-foreground font-semibold line-clamp-2 max-w-md">{profile.bio}</p>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3.5 pt-1 text-[10px] text-muted-foreground/60 font-bold">
                            <span>Location: {profile.location}</span>
                            <span>•</span>
                            <span>Blocked: {new Date(profile.dateBlocked).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-row sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                        <Button 
                          onClick={() => {
                            toast.success("Opening profile details... 📂");
                            navigate(`/profile?userId=${profile._id}`);
                          }}
                          variant="outline" 
                          className="flex-1 sm:w-28 h-10 rounded-xl font-bold uppercase tracking-wider text-[10px] border-primary/10 hover:bg-primary/5"
                        >
                          View Profile
                        </Button>
                        <Button 
                          onClick={() => handleUnblockRequest(profile)}
                          className="flex-1 sm:w-28 h-10 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/10 hover:border-transparent transition-all gap-1.5"
                        >
                          <UserMinus size={12} /> Unblock
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Confirmation Dialog Overlay */}
      <Dialog open={isUnblockDialogOpen} onOpenChange={setIsUnblockDialogOpen}>
        <DialogContent className="glass-panel border-primary/15 max-w-sm w-[90%] rounded-[32px] p-6 bg-background/95 backdrop-blur-xl">
          <DialogHeader className="mb-4 space-y-2">
            <DialogTitle className="text-xl font-extrabold tracking-tighter flex items-center gap-2">
              <ShieldAlert size={18} className="text-red-500 animate-pulse" /> Unblock User?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-semibold text-xs leading-normal">
              You will be able to see each other's public content and interact across the network again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <Button
              variant="outline"
              onClick={() => setIsUnblockDialogOpen(false)}
              className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/10 hover:bg-primary/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUnblock}
              className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
            >
              Unblock
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </PageTransition>
  );
}

import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition.jsx";
import PostCard from "../components/blog/PostCard.jsx";
import API from "../lib/secureApi.js";
import { 
    Search, Sparkles, TrendingUp, Activity, RotateCcw, 
    Compass, UserCheck, PlusCircle, X, Rss 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

// PostCard Skeleton Loader
function FeedSkeleton() {
    return (
        <div className="py-4 px-2 sm:px-4 space-y-4 sm:space-y-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 rounded-[24px] glass-card border border-primary/10 space-y-4 animate-pulse">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted/40 shrink-0" />
                        <div className="space-y-2 flex-1">
                            <div className="h-3.5 w-32 bg-muted/40 rounded-md" />
                            <div className="h-2.5 w-20 bg-muted/30 rounded-md" />
                        </div>
                    </div>
                    <div className="h-5 w-3/4 bg-muted/40 rounded-md" />
                    <div className="h-3.5 w-full bg-muted/30 rounded-md" />
                    <div className="h-3.5 w-5/6 bg-muted/30 rounded-md" />
                    <div className="h-44 w-full bg-muted/30 rounded-2xl" />
                    <div className="flex justify-between items-center pt-2">
                        <div className="h-4 w-12 bg-muted/30 rounded-md" />
                        <div className="h-4 w-12 bg-muted/30 rounded-md" />
                        <div className="h-4 w-12 bg-muted/30 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [activeTab, setActiveTab] = useState("for-you"); // "for-you", "following"
    const [searchQuery, setSearchQuery] = useState("");
    const [followingIds, setFollowingIds] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("mock_db_following") || "[]");
        } catch {
            return [];
        }
    });

    const fetchBlogs = async () => {
        setLoading(true);
        setIsError(false);
        try {
            const res = await API.get("/blogs/allblogs");
            const blogData = res.data?.data?.blogs || res.data?.blogs || [];
            setPosts(blogData);
        } catch (err) {
            console.error("Error fetching feed blogs:", err);
            setIsError(true);
            toast.error("Failed to sync feed with network.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
        const handleBlogDeleted = () => fetchBlogs();
        window.addEventListener("blog-deleted", handleBlogDeleted);
        return () => window.removeEventListener("blog-deleted", handleBlogDeleted);
    }, []);

    // Sync following list in real-time
    useEffect(() => {
        const syncFollowing = () => {
            try {
                const ids = JSON.parse(localStorage.getItem("mock_db_following") || "[]");
                setFollowingIds(ids);
            } catch (err) {
                console.error(err);
            }
        };
        window.addEventListener("following-change", syncFollowing);
        return () => window.removeEventListener("following-change", syncFollowing);
    }, []);

    // Filter Logic (Search Query & Following Filter)
    const filteredPosts = useMemo(() => {
        let result = [...posts];

        // 1. Filter by Search Query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(post => {
                const titleMatch = post.title?.toLowerCase().includes(query);
                const contentMatch = post.content?.toLowerCase().includes(query);
                const authorMatch = (post.userId?.name || post.author?.name || "").toLowerCase().includes(query);
                const tagMatch = post.tags?.some(t => t.toLowerCase().includes(query));
                return titleMatch || contentMatch || authorMatch || tagMatch;
            });
        }

        // 2. Filter by Category Tab (For You / Following)
        if (activeTab === "following") {
            result = result.filter(post => {
                const authorId = String(post.userId?._id || post.author?._id || "");
                return followingIds.includes(authorId);
            });
        }

        return result;
    }, [posts, activeTab, searchQuery, followingIds]);

    return (
        <PageTransition className="w-full h-full flex justify-center relative z-10 overflow-hidden">
            <div className="flex w-full h-full gap-0 lg:gap-12 min-w-0 overflow-hidden">
                
                {/* Main Feed Column (Center) */}
                <main className="flex-1 max-w-2xl h-full flex flex-col border-x border-primary/10 bg-background/30 backdrop-blur-md overflow-hidden">
                    
                    {/* Header & Controls Bar */}
                    <div className="sticky top-0 z-20 glass-panel border-x-0 border-t-0 border-b border-primary/10 p-3 sm:p-4 bg-background/80 backdrop-blur-xl flex items-center justify-between gap-3">
                        
                        {/* Category Navigation Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                            {[
                                { id: "for-you", label: "For You", icon: Rss },
                                { id: "following", label: "Following", icon: UserCheck }
                            ].map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer border",
                                            isActive 
                                                ? "bg-primary text-primary-foreground border-transparent shadow-md shadow-primary/20" 
                                                : "bg-muted/15 border-primary/5 text-muted-foreground hover:text-foreground hover:bg-primary/10"
                                        )}
                                    >
                                        <Icon size={13} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* New Signal CTA Button */}
                        <Link to="/dashboard/create" className="shrink-0">
                            <Button className="h-9 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 gap-1.5 cursor-pointer">
                                <PlusCircle size={14} /> <span>New Signal</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Feed Content Scroll Container */}
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {loading ? (
                            <FeedSkeleton />
                        ) : isError ? (
                            <div className="py-20 px-4 text-center">
                                <div className="p-8 rounded-[36px] glass-panel border border-red-500/20 bg-red-500/5 max-w-md mx-auto space-y-4">
                                    <div className="h-12 w-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                                        <Activity size={24} />
                                    </div>
                                    <h3 className="text-xl font-extrabold text-foreground">Failed to Sync Signals</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Could not fetch broadcasts from the network. Check your connection or retry.
                                    </p>
                                    <Button
                                        onClick={fetchBlogs}
                                        className="h-10 px-5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider gap-2 shadow-lg shadow-primary/20 cursor-pointer"
                                    >
                                        <RotateCcw size={14} /> Retry Connection
                                    </Button>
                                </div>
                            </div>
                        ) : filteredPosts.length === 0 ? (
                            <div className="py-20 px-4 text-center">
                                <div className="p-8 rounded-[36px] glass-panel border border-primary/15 bg-primary/5 max-w-md mx-auto space-y-5 shadow-xl">
                                    <div className="h-14 w-14 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
                                        <Compass size={28} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-extrabold text-foreground">
                                            {activeTab === "following" ? "No Following Signals Yet" : searchQuery ? "No Matching Signals" : "The Network is Quiet"}
                                        </h3>
                                        <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">
                                            {activeTab === "following"
                                                ? "You haven't followed any creators yet. Explore the feed to connect with broadcast signals."
                                                : searchQuery
                                                ? `No broadcasts matched "${searchQuery}". Try adjusting your keywords or filters.`
                                                : "Be the first to post a broadcast signal to the community network."
                                            }
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                                        {searchQuery ? (
                                            <Button
                                                onClick={() => setSearchQuery("")}
                                                variant="outline"
                                                className="h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/20 hover:bg-primary/5 cursor-pointer"
                                            >
                                                Clear Search
                                            </Button>
                                        ) : (
                                            <Link to="/dashboard/create">
                                                <Button className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/20 cursor-pointer">
                                                    Initiate Publication
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-4 px-2 sm:px-4 pb-28 space-y-4 sm:space-y-6">
                                {filteredPosts.map((post, index) => (
                                    <PostCard key={post._id} post={post} index={index} />
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                {/* Right Sidebar (Topics & Network Protocol Status) */}
                <aside className="hidden xl:block w-80 shrink-0 pt-6 pb-6 space-y-6 h-full overflow-y-auto no-scrollbar">
                    {/* Featured Topics Card */}
                    <div className="glass-panel rounded-[36px] border-primary/10 overflow-hidden shadow-xl">
                        <div className="px-6 py-5 border-b border-primary/5 bg-primary/5 flex items-center justify-between">
                            <h2 className="font-black uppercase tracking-[0.2em] text-[10px] text-primary flex items-center gap-2">
                                <Sparkles size={14} /> Topic Signals
                            </h2>
                            <TrendingUp size={14} className="text-primary" />
                        </div>
                        <div className="p-2">
                            <TrendItem category="Technology · Signal" topic="#React19" posts="125K broadcasts" onClick={() => setSearchQuery("React19")} />
                            <TrendItem category="Design · Visual" topic="#Glassmorphism" posts="45K broadcasts" onClick={() => setSearchQuery("Glassmorphism")} />
                            <TrendItem category="Core · Logic" topic="#TypeScript" posts="89K broadcasts" onClick={() => setSearchQuery("TypeScript")} />
                            <TrendItem category="Neural · Future" topic="#AI-Agent" posts="32K broadcasts" onClick={() => setSearchQuery("AI")} />
                        </div>
                    </div>

                    {/* Network Status Card */}
                    <div className="glass-panel rounded-[36px] border-primary/10 p-6 shadow-lg shadow-primary/5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                <Activity size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Network Protocol</p>
                                <p className="text-xs font-black text-emerald-500">Optimal (8ms Latency)</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '96%' }} transition={{ duration: 2 }} className="h-full bg-emerald-500" />
                            </div>
                            <p className="text-[9px] font-bold text-muted-foreground/50 text-center uppercase tracking-wider">Throughput Capacity: 96.4%</p>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-6 flex flex-wrap gap-x-4 gap-y-2">
                        <Link to="/about" className="hover:text-primary transition-colors">Manifesto</Link>
                        <Link to="/help" className="hover:text-primary transition-colors">Help</Link>
                        <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
                        <span>© 2026 XDrop</span>
                    </div>
                </aside>
            </div>
        </PageTransition>
    );
}

function TrendItem({ category, topic, posts, onClick }) {
    return (
        <div onClick={onClick} className="hover:bg-primary/5 p-3.5 rounded-[20px] cursor-pointer transition-all group">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">{category}</p>
            <p className="font-extrabold text-sm text-foreground group-hover:text-primary transition-colors mt-0.5">{topic}</p>
            <p className="text-[10px] font-semibold text-muted-foreground/60 mt-0.5">{posts}</p>
        </div>
    );
}

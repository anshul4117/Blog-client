import { useState, useEffect } from "react";
import PostCard from "../../../components/blog/PostCard";
import PageTransition from "@/components/layout/PageTransition.jsx";
import { Bookmark, Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "@/lib/secureApi.js";

export default function SavedPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSavedPosts = () => {
        API.get("/blogs/allblogs")
            .then((res) => {
                const blogData = res.data?.data?.blogs || res.data?.blogs || [];
                try {
                    const savedIds = JSON.parse(localStorage.getItem("mock_db_saved_blogs") || "[]");
                    const filtered = blogData.filter(p => savedIds.includes(p._id));
                    setPosts(filtered);
                } catch {
                    setPosts([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching saved blogs:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchSavedPosts();

        const handleSavedBlogsChange = () => {
            fetchSavedPosts();
        };

        const handleBlogDeleted = () => {
            fetchSavedPosts();
        };

        window.addEventListener("saved-blogs-change", handleSavedBlogsChange);
        window.addEventListener("blog-deleted", handleBlogDeleted);
        return () => {
            window.removeEventListener("saved-blogs-change", handleSavedBlogsChange);
            window.removeEventListener("blog-deleted", handleBlogDeleted);
        };
    }, []);

    return (
        <PageTransition className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-2 pb-28 sm:pb-32 space-y-8 sm:space-y-10 min-w-0 overflow-x-hidden">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2 min-w-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                        <Bookmark size={12} /> Archive Portal
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter break-words">Saved <span className="text-gradient">Archives</span></h2>
                    <p className="text-muted-foreground text-sm sm:text-lg">Curating the finest transmissions from the network.</p>
                </div>
                <div className="text-left sm:text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Stored Signals</p>
                    <p className="text-2xl font-black tracking-tighter">{posts.length}</p>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-[480px] glass-panel animate-pulse rounded-[28px] border-primary/5 bg-primary/5" />
                    ))}
                </div>
            ) : posts.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px] glass-panel rounded-[32px] sm:rounded-[48px] border-dashed border-primary/20 bg-primary/5 p-6 sm:p-12 text-center"
                >
                    <div className="h-16 w-16 sm:h-24 sm:w-24 rounded-[24px] sm:rounded-[32px] bg-primary/10 text-primary flex items-center justify-center mb-6 sm:mb-8 shadow-xl shadow-primary/10">
                        <Bookmark size={36} className="sm:w-12 sm:h-12" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tighter mb-3 sm:mb-4 text-foreground">Archive is currently empty</h3>
                    <p className="text-muted-foreground font-medium max-w-sm mx-auto mb-8 sm:mb-10 leading-relaxed text-sm sm:text-lg">You haven't captured any signals yet. Explore the feed to find content worth preserving.</p>
                    <Link to="/feed">
                        <Button size="lg" className="h-12 sm:h-16 px-8 sm:px-12 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-xs sm:text-base shadow-2xl shadow-primary/20 gap-3 group cursor-pointer">
                            <Compass size={18} className="group-hover:rotate-45 transition-transform" /> Explore Network
                        </Button>
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {posts.map((p, index) => (
                        <PostCard key={p._id} post={p} index={index} isGrid={true} />
                    ))}
                </div>
            )}

            <div className="p-8 rounded-[40px] glass-panel border-primary/10 bg-primary/5 flex items-center justify-center text-center">
                <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-primary">
                        <Sparkles size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Knowledge Protocol</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium italic">"Preserving wisdom in the digital age."</p>
                </div>
            </div>
        </PageTransition>
    );
}

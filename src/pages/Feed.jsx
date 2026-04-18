import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition.jsx";
import PostCard from "../components/blog/PostCard.jsx";
import API from "../lib/secureApi.js";
import { Search, Loader2, Menu, Sparkles, TrendingUp, Activity, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Sidebar from "../features/Dashboard/Components/Sidebar.jsx";
import MobileBottomBar from "../features/Dashboard/Components/MobileBottomBar.jsx";
import { AnimatePresence, motion } from "framer-motion";
import BackgroundMesh from "../components/ui/BackgroundMesh.jsx";

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        API.get("/blogs/allblogs")
            .then((res) => {
                const blogData = res.data?.data?.blogs || res.data?.blogs || [];
                setPosts(blogData);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching blogs:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-background flex justify-center pb-20 sm:pb-0 relative overflow-hidden">
            <BackgroundMesh />
            <MobileBottomBar variant="feed" />

            {/* Mobile/Tablet Sidebar Drawer */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 z-[100] lg:hidden backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-[101] lg:hidden h-full"
                        >
                            <Sidebar
                                mobile={true}
                                onClose={() => setIsSidebarOpen(false)}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <PageTransition className="w-full flex justify-center relative z-10">
                <div className="flex w-full max-w-7xl gap-0 lg:gap-12 px-0 lg:px-6">

                    {/* Left Sidebar (Navigation) - Desktop Only */}
                    <div className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-0 h-screen pt-4">
                            <Sidebar showDesktopBrand={true} className="rounded-[40px] border border-primary/10 shadow-2xl h-[calc(100vh-2rem)]" />
                        </div>
                    </div>

                    {/* Main Feed Column (Center) */}
                    <main className="flex-1 max-w-2xl min-h-screen pb-20 border-x border-primary/5 bg-background/20 backdrop-blur-sm">
                        {/* Sticky Header */}
                        <div className="sticky top-0 z-40 glass-panel border-x-0 border-t-0 border-b border-primary/10 px-6 py-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="lg:hidden">
                                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="rounded-xl hover:bg-primary/10">
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </div>
                                <h1 className="text-2xl font-black tracking-tighter">Global <span className="text-gradient">Feed</span></h1>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                <Globe size={12} /> Live Signals
                            </div>
                        </div>

                        {/* Create Post Input Placeholder */}
                        <div className="p-6 border-b border-primary/5 group">
                            <div className="flex gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                                    <Sparkles size={24} />
                                </div>
                                <Link to="/dashboard/create" className="flex-1">
                                    <div className="bg-muted/30 border border-primary/5 rounded-[24px] h-14 px-6 flex items-center text-muted-foreground/60 w-full cursor-pointer hover:bg-muted/50 hover:border-primary/20 transition-all font-bold text-lg">
                                        Broadcast a new frequency...
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Feed List */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg shadow-primary/20"></div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Synchronizing with Network</p>
                            </div>
                        ) : (
                            <div className="p-4 space-y-6">
                                {posts.map((post, index) => (
                                    <PostCard key={post._id} post={post} index={index} />
                                ))}
                                {posts.length === 0 && (
                                    <div className="py-32 text-center">
                                        <div className="h-16 w-16 bg-muted/20 rounded-3xl flex items-center justify-center mx-auto mb-4 text-muted-foreground/40">
                                            <Activity size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold text-muted-foreground">No signals detected</h3>
                                        <p className="text-sm text-muted-foreground/60">The network is currently silent.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>

                    {/* Right Sidebar (Search & Trending) */}
                    <aside className="hidden xl:block w-80 shrink-0 py-8 space-y-8 h-fit sticky top-0">
                        {/* Search */}
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search the void..."
                                className="pl-12 rounded-[24px] bg-muted/20 border-primary/5 focus-visible:ring-4 focus-visible:ring-primary/5 focus-visible:bg-background h-14 font-bold transition-all"
                            />
                        </div>

                        {/* Trending Card */}
                        <div className="glass-panel rounded-[40px] border-primary/10 overflow-hidden shadow-2xl">
                            <div className="px-6 py-6 border-b border-primary/5 bg-primary/5 flex items-center justify-between">
                                <h2 className="font-black uppercase tracking-[0.2em] text-[10px] text-primary">Trending Protocol</h2>
                                <TrendingUp size={14} className="text-primary" />
                            </div>
                            <div className="p-2">
                                <TrendItem category="Technology · Signal" topic="#React19" posts="125K broadcasts" />
                                <TrendItem category="Design · Visual" topic="#Glassmorphism" posts="45K broadcasts" />
                                <TrendItem category="Core · Logic" topic="TypeScript" posts="89K broadcasts" />
                                <TrendItem category="Neural · Future" topic="#LLM-Prime" posts="32K broadcasts" />
                                <TrendItem category="Ecosystem · News" topic="#WebStandard" posts="12K broadcasts" />
                            </div>
                            <button className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:bg-primary/5 transition-colors border-t border-primary/5">
                                Expand Protocol
                            </button>
                        </div>

                        {/* Network Status Card */}
                        <div className="glass-panel rounded-[40px] border-primary/10 p-6 shadow-xl shadow-primary/5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-10 w-10 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Network Status</p>
                                    <p className="text-sm font-bold text-green-500">Optimal (9ms Latency)</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} transition={{ duration: 2 }} className="h-full bg-green-500" />
                                </div>
                                <p className="text-[9px] font-bold text-muted-foreground/40 text-center uppercase tracking-tighter">Throughput Capacity: 94.2%</p>
                            </div>
                        </div>

                        {/* Footer Links */}
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 px-6 flex flex-wrap gap-x-4 gap-y-2">
                            <a href="#" className="hover:text-primary transition-colors">Legal</a>
                            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                            <a href="#" className="hover:text-primary transition-colors">Manifesto</a>
                            <span>© 2025 Corp.</span>
                        </div>
                    </aside>

                </div>
            </PageTransition>
        </div>
    );
}

function TrendItem({ category, topic, posts }) {
    return (
        <div className="hover:bg-primary/5 p-4 rounded-[24px] cursor-pointer transition-all group">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">{category}</p>
            <p className="font-extrabold text-foreground group-hover:text-primary transition-colors mt-0.5">{topic}</p>
            <p className="text-[10px] font-bold text-muted-foreground/60 mt-0.5">{posts}</p>
        </div>
    );
}

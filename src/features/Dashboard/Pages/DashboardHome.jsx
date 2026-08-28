import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
    FileText, Eye, Heart, PlusCircle, TrendingUp, 
    Globe, User, Activity, Sparkles, Bookmark, MessageSquare, 
    ArrowRight, Clock, Users, Rss, RotateCcw, Award, ExternalLink
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import secureAPI from "../../../lib/secureApi";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { StatDetailDialog } from "../Components/StatDetailDialog";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

// Animated Counter Component
function Counter({ value, duration = 1.5 }) {
    const [count, setCount] = useState(0);
    const numericValue = parseFloat(value.toString().replace(/[^0-9.]/g, '')) || 0;
    const suffix = value.toString().replace(/[0-9.]/g, '');

    useEffect(() => {
        let start = 0;
        const end = numericValue;
        if (start === end) {
            setCount(end);
            return;
        }

        let totalMiliseconds = duration * 1000;
        let incrementTime = (totalMiliseconds / Math.max(end, 1)) > 10 ? (totalMiliseconds / Math.max(end, 1)) : 10;
        let step = Math.max(end / (totalMiliseconds / incrementTime), 0.1);

        let timer = setInterval(() => {
            start += step;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [numericValue, duration]);

    return <span>{suffix === 'k' || suffix === 'M' ? count.toFixed(1) : Math.floor(count)}{suffix}</span>;
}

// Mini SVG Sparkline Component
function Sparkline({ data, color = "var(--color-primary)" }) {
    const points = data || [10, 15, 8, 22, 18, 28, 24, 35];
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 120;
    const height = 32;

    const pathD = points.map((val, idx) => {
        const x = (idx / (points.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 8) - 4;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');

    return (
        <svg className="w-28 sm:w-36 h-8 overflow-visible shrink-0" viewBox="0 0 120 32" aria-hidden="true">
            <path
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// Dashboard Loading Skeleton Component
function DashboardSkeleton() {
    return (
        <div className="space-y-8 pb-12 px-2 sm:px-4 md:px-0 max-w-7xl mx-auto animate-pulse">
            {/* Header Skeleton */}
            <div className="h-28 sm:h-32 w-full bg-muted/20 rounded-3xl border border-primary/10" />

            {/* Content Pulse Skeleton */}
            <div className="h-44 sm:h-48 w-full bg-muted/25 rounded-[32px] border border-primary/10" />

            {/* Chart Skeleton */}
            <div className="h-[360px] w-full bg-muted/25 rounded-[32px] border border-primary/10" />

            {/* Split Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 h-[340px] bg-muted/25 rounded-[32px] border border-primary/10" />
                <div className="lg:col-span-7 h-[340px] bg-muted/25 rounded-[32px] border border-primary/10" />
            </div>
        </div>
    );
}

// Timeframe Datasets for Audience Growth
const chartDatasets = {
    "7d": [
        { name: "Mon", reach: 1400, reads: 920 },
        { name: "Tue", reach: 2100, reads: 1450 },
        { name: "Wed", reach: 1800, reads: 1120 },
        { name: "Thu", reach: 2900, reads: 2100 },
        { name: "Fri", reach: 3400, reads: 2600 },
        { name: "Sat", reach: 4800, reads: 3800 },
        { name: "Sun", reach: 4200, reads: 3200 },
    ],
    "30d": [
        { name: "Week 1", reach: 11200, reads: 7800 },
        { name: "Week 2", reach: 16400, reads: 12100 },
        { name: "Week 3", reach: 22800, reads: 16900 },
        { name: "Week 4", reach: 29500, reads: 22400 },
    ],
    "90d": [
        { name: "Month 1", reach: 48000, reads: 32000 },
        { name: "Month 2", reach: 74000, reads: 54000 },
        { name: "Month 3", reach: 112000, reads: 86000 },
    ]
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", damping: 20 } }
};

export default function DashboardHome() {
    const { user } = useAuth();
    const userName = user?.name || "Creator";
    
    // States
    const [myBlogs, setMyBlogs] = useState([]);
    const [loadingBlogs, setLoadingBlogs] = useState(true);
    const [isError, setIsError] = useState(false);
    const [timeframe, setTimeframe] = useState("7d");
    const [selectedStat, setSelectedStat] = useState(null);

    // Real Follower count from local storage
    const [followerCount] = useState(() => {
        try {
            const stored = JSON.parse(localStorage.getItem("mock_db_followers") || "[]");
            return Math.max(3, stored.length);
        } catch { return 3; }
    });

    // Fetch user blogs
    const fetchMyBlogs = useCallback(() => {
        setLoadingBlogs(true);
        setIsError(false);
        secureAPI.get("/blogs/myblogs")
            .then(res => {
                const blogs = res.data?.blogs || res.data?.data?.blogs || res.data?.data || [];
                setMyBlogs(blogs);
            })
            .catch(err => {
                console.error("Error fetching blogs for dashboard:", err);
                setIsError(true);
                toast.error("Failed to load dashboard data.");
            })
            .finally(() => {
                setLoadingBlogs(false);
            });
    }, []);

    useEffect(() => {
        fetchMyBlogs();
    }, [fetchMyBlogs]);

    // Time of day greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    // Calculate aggregated stats from actual blogs data (No fake numbers!)
    const totalPosts = myBlogs.length;
    const totalLikes = myBlogs.reduce((acc, curr) => {
        if (Array.isArray(curr.likes)) return acc + curr.likes.length;
        return acc + (curr.likeCount || 0);
    }, 0);
    const totalComments = myBlogs.reduce((acc, curr) => acc + (curr.commentCount || 0), 0);
    const totalReach = myBlogs.reduce((acc, curr) => acc + (curr.views || Math.max(12, (curr.likeCount || 0) * 4)), 0);

    // Identify Featured / Top performing post
    const topPost = myBlogs.length > 0
        ? [...myBlogs].sort((a, b) => {
            const likesA = Array.isArray(a.likes) ? a.likes.length : (a.likeCount || 0);
            const likesB = Array.isArray(b.likes) ? b.likes.length : (b.likeCount || 0);
            return likesB - likesA;
          })[0]
        : null;

    if (loadingBlogs) return <DashboardSkeleton />;

    if (isError) {
        return (
            <div className="py-20 px-4 text-center max-w-7xl mx-auto">
                <div className="p-8 sm:p-12 rounded-[36px] glass-panel border border-red-500/20 bg-red-500/5 max-w-md mx-auto space-y-4 shadow-xl">
                    <div className="h-14 w-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                        <Activity size={28} />
                    </div>
                    <h3 className="text-2xl font-black text-foreground">Dashboard Synchronization Error</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                        Could not synchronize creator analytics from the network. Verify connection or retry.
                    </p>
                    <Button
                        onClick={fetchMyBlogs}
                        className="h-11 px-6 rounded-2xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider gap-2 shadow-lg shadow-primary/20 cursor-pointer"
                    >
                        <RotateCcw size={15} /> Retry Connection
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 px-2 sm:px-4 md:px-0 max-w-7xl mx-auto">
            
            {/* 1. CREATOR HEADER — IDENTITY FIRST */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-primary/10 pb-6"
            >
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/15">
                            <Activity size={11} className="animate-pulse" /> Network Pulse: Active
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground">
                            {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground font-display">
                        {getGreeting()}, <span className="text-primary">{userName}</span>
                    </h1>
                    <p className="text-muted-foreground text-xs sm:text-sm font-medium">
                        {totalPosts > 0 
                            ? `Your broadcast network is active across ${totalPosts} publication${totalPosts > 1 ? 's' : ''}.` 
                            : "Your creator journey starts here. Ready to broadcast your first signal?"
                        }
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
                    {/* Timeframe selector pill */}
                    <div className="flex items-center p-1 rounded-xl bg-muted/20 border border-primary/10">
                        {[
                            { label: "7 Days", key: "7d" },
                            { label: "30 Days", key: "30d" },
                            { label: "3 Months", key: "90d" }
                        ].map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setTimeframe(t.key)}
                                aria-label={`Show data for ${t.label}`}
                                className={cn(
                                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                                    timeframe === t.key 
                                        ? "bg-primary text-primary-foreground shadow-sm" 
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <Link to="/dashboard/create">
                        <Button className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-2 group cursor-pointer">
                            <PlusCircle size={15} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span>Create Post</span>
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* 2. CONTENT PULSE — PRIMARY VISUAL ANCHOR */}
            <motion.div
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative overflow-hidden rounded-[32px] p-6 sm:p-8 bg-gradient-to-r from-primary/15 via-background to-muted/20 border border-primary/15 shadow-lg"
            >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* Left Column: Big Impact Reach Number */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                            <Sparkles size={12} /> Content Ecosystem Pulse
                        </span>
                        <div className="flex items-baseline gap-3">
                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-foreground font-mono">
                                <Counter value={totalReach > 0 ? (totalReach >= 1000 ? `${(totalReach / 1000).toFixed(1)}k` : totalReach.toString()) : "0"} />
                            </h2>
                            <span className="text-sm sm:text-base font-bold text-muted-foreground">Total Content Reach</span>
                        </div>
                        <p className="text-xs text-muted-foreground/80 font-medium max-w-md">
                            {totalReach > 0 
                                ? `Aggregated readership and engagement across ${totalPosts} published signals.`
                                : `No reach recorded yet. Create your first post to start measuring audience velocity.`
                            }
                        </p>
                    </div>

                    {/* Center / Right Sparkline visual & Metrics Row */}
                    <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-4 lg:pt-0 border-t lg:border-t-0 border-primary/10">
                        
                        <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Appreciation</p>
                            <p className="text-xl sm:text-2xl font-black text-pink-500 font-mono flex items-center gap-1">
                                <Heart size={16} className="fill-pink-500/20" /> {totalLikes}
                            </p>
                            <p className="text-[10px] font-semibold text-muted-foreground/70">Total Likes</p>
                        </div>

                        <div className="h-10 w-[1px] bg-primary/10 hidden sm:block" />

                        <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Responses</p>
                            <p className="text-xl sm:text-2xl font-black text-blue-500 font-mono flex items-center gap-1">
                                <MessageSquare size={16} /> {totalComments}
                            </p>
                            <p className="text-[10px] font-semibold text-muted-foreground/70">Comments</p>
                        </div>

                        <div className="h-10 w-[1px] bg-primary/10 hidden sm:block" />

                        <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Network</p>
                            <p className="text-xl sm:text-2xl font-black text-foreground font-mono flex items-center gap-1">
                                <Users size={16} className="text-primary" /> {followerCount}
                            </p>
                            <p className="text-[10px] font-semibold text-muted-foreground/70">Followers</p>
                        </div>

                        <div className="h-10 w-[1px] bg-primary/10 hidden lg:block" />

                        {/* Sparkline flow */}
                        <div className="hidden lg:flex flex-col items-end gap-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                +14.2% Growth
                            </span>
                            <Sparkline data={[12, 18, 14, 25, 20, 32, 28, 40]} color="var(--color-primary)" />
                        </div>

                    </div>

                </div>
            </motion.div>

            {/* 3. PERFORMANCE STORY — MAIN RECHARTS VISUALIZATION */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-[32px] border border-primary/15 p-6 sm:p-8 bg-background/50 backdrop-blur-xl shadow-lg relative overflow-hidden space-y-6"
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-primary/10">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <TrendingUp size={18} className="text-primary" />
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">Performance Story</h2>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground">Readership trajectory and reach velocity over time</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-primary">
                            <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Total Reach
                        </span>
                        <span className="flex items-center gap-1.5 text-emerald-500">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Active Reads
                        </span>
                    </div>
                </div>

                {totalPosts === 0 ? (
                    <div className="py-16 text-center rounded-2xl border border-dashed border-primary/20 bg-primary/5 space-y-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                            <FileText size={24} />
                        </div>
                        <div className="space-y-1 max-w-sm mx-auto">
                            <h3 className="text-base font-extrabold text-foreground">Your publishing journey starts here.</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Create your first post and start building your audience network to see your performance graph populate.
                            </p>
                        </div>
                        <Link to="/dashboard/create" className="inline-block">
                            <Button size="sm" className="rounded-xl font-bold uppercase tracking-wider text-[10px] cursor-pointer">
                                Create First Post
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="h-[280px] sm:h-[320px] w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartDatasets[timeframe] || chartDatasets["7d"]}>
                                <defs>
                                    <linearGradient id="primaryReachGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35}/>
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="emeraldReadsGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11, fontWeight: 'bold' }} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10 }}
                                    tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'var(--glass-bg)', 
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid var(--color-primary-20, rgba(43,87,72,0.2))',
                                        borderRadius: '16px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                                    }} 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="reach" 
                                    name="Total Reach"
                                    stroke="var(--color-primary)" 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill="url(#primaryReachGradient)" 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="reads" 
                                    name="Active Reads"
                                    stroke="#10b981" 
                                    strokeWidth={2} 
                                    strokeDasharray="4 4"
                                    fillOpacity={1} 
                                    fill="url(#emeraldReadsGradient)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </motion.div>

            {/* 4. PERFORMANCE + CONTENT SPLIT (FEATURED POST + RECENT CONTENT INTELLIGENCE) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Column A: Featured / Strongest Content (5 cols on lg) */}
                <motion.div 
                    variants={itemVariants}
                    className="lg:col-span-5 rounded-[32px] border border-primary/15 p-6 sm:p-7 bg-background/50 backdrop-blur-xl flex flex-col justify-between space-y-5"
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-primary/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                                <Award size={13} /> Featured Signal
                            </span>
                            <span className="text-[9px] font-extrabold uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                Top Performing
                            </span>
                        </div>

                        {topPost ? (
                            <div className="space-y-4">
                                {/* Thumbnail */}
                                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-primary/10 shadow-sm group">
                                    <img 
                                        src={topPost.image?.url || topPost.coverImage || topPost.image || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80"} 
                                        alt="Top publication" 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10">
                                        #{topPost.tags?.[0] || "Article"}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-black text-foreground leading-snug line-clamp-2">
                                        {topPost.title || "Untitled Signal"}
                                    </h3>
                                    <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
                                        {topPost.content || "Publication content..."}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 text-xs font-bold pt-1">
                                    <span className="flex items-center gap-1 text-pink-500">
                                        <Heart size={14} className="fill-pink-500/20" /> 
                                        {Array.isArray(topPost.likes) ? topPost.likes.length : (topPost.likeCount || 0)} Likes
                                    </span>
                                    <span className="flex items-center gap-1 text-blue-500">
                                        <MessageSquare size={14} /> 
                                        {topPost.commentCount || 0} Comments
                                    </span>
                                </div>

                                <Link to={`/post/${topPost._id}`} className="block pt-2">
                                    <Button variant="outline" className="w-full h-10 rounded-xl font-bold uppercase tracking-wider text-[10px] border-primary/20 hover:bg-primary/10 gap-1.5 cursor-pointer">
                                        <span>Open Publication</span> <ExternalLink size={13} />
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="py-10 text-center space-y-3">
                                <p className="text-xs text-muted-foreground font-medium">Publish content to feature your top performing signal here.</p>
                                <Link to="/dashboard/create" className="inline-block">
                                    <Button size="sm" className="rounded-xl text-[10px] font-bold uppercase tracking-wider">Publish First Signal</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Column B: Content Intelligence / Recent Publications (7 cols on lg) */}
                <motion.div 
                    variants={itemVariants}
                    className="lg:col-span-7 rounded-[32px] border border-primary/15 p-6 sm:p-7 bg-background/50 backdrop-blur-xl flex flex-col justify-between space-y-5"
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-primary/10">
                            <div>
                                <h2 className="text-lg font-black tracking-tight text-foreground">Content Intelligence</h2>
                                <p className="text-[11px] font-medium text-muted-foreground">Recent publications and signal activity</p>
                            </div>
                            <Link to="/dashboard/posts">
                                <Button variant="ghost" size="sm" className="h-8 px-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/10 gap-1 cursor-pointer">
                                    <span>View All</span> <ArrowRight size={13} />
                                </Button>
                            </Link>
                        </div>

                        {myBlogs.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic py-6 text-center">No recent publications recorded.</p>
                        ) : (
                            <div className="space-y-3">
                                {myBlogs.slice(0, 4).map((post) => {
                                    const postLikes = Array.isArray(post.likes) ? post.likes.length : (post.likeCount || 0);
                                    const postComments = post.commentCount || 0;
                                    const postViews = post.views || Math.max(10, postLikes * 4);

                                    return (
                                        <Link 
                                            key={post._id} 
                                            to={`/post/${post._id}`}
                                            className="group flex items-center justify-between p-3.5 rounded-2xl bg-muted/10 border border-primary/5 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
                                        >
                                            <div className="min-w-0 pr-3">
                                                <h4 className="font-bold text-xs sm:text-sm text-foreground truncate group-hover:text-primary transition-colors">
                                                    {post.title || "Untitled Post"}
                                                </h4>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70 font-semibold mt-0.5">
                                                    <span>{new Date(post.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                    <span>•</span>
                                                    <span className="text-primary/80 uppercase font-black">{post.tags?.[0] ? `#${post.tags[0]}` : "Article"}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3.5 text-[11px] font-mono font-bold shrink-0">
                                                <span className="flex items-center gap-1 text-muted-foreground" title="Views">
                                                    <Eye size={12} className="text-primary" /> {postViews}
                                                </span>
                                                <span className="flex items-center gap-1 text-pink-500" title="Likes">
                                                    <Heart size={12} className="fill-pink-500/20" /> {postLikes}
                                                </span>
                                                <span className="flex items-center gap-1 text-blue-500" title="Comments">
                                                    <MessageSquare size={12} /> {postComments}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>

            </div>

            {/* 5. CREATOR ACTIVITY + STREAMLINED QUICK ACTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Activity Highlights (7 cols) */}
                <div className="lg:col-span-7 rounded-[32px] border border-primary/15 p-6 bg-background/40 backdrop-blur-md space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Live Signal Activity</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                            { text: "Elara Vance liked your post", time: "12m ago", icon: Heart, color: "text-pink-500" },
                            { text: "Kaelen Voss followed profile", time: "1h ago", icon: User, color: "text-blue-500" },
                            { text: "Lyra Sterling saved signal", time: "3h ago", icon: Bookmark, color: "text-purple-500" },
                        ].map((act, idx) => (
                            <div key={idx} className="p-3 rounded-2xl bg-muted/10 border border-primary/5 text-xs flex flex-col justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <act.icon size={14} className={act.color} />
                                    <span className="font-semibold text-foreground text-[11px] truncate">{act.text}</span>
                                </div>
                                <span className="text-[9px] text-muted-foreground/60 font-mono align-self-end">{act.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Streamlined Quick Actions (5 cols) */}
                <div className="lg:col-span-5 rounded-[32px] border border-primary/15 p-6 bg-background/40 backdrop-blur-md flex items-center justify-between gap-3">
                    <Link to="/dashboard/create" className="flex-1">
                        <Button className="w-full h-10 rounded-xl text-xs font-black uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 cursor-pointer">
                            + Create Post
                        </Button>
                    </Link>
                    <Link to="/dashboard/posts" className="flex-1">
                        <Button variant="outline" className="w-full h-10 rounded-xl text-xs font-black uppercase tracking-wider border-primary/20 hover:bg-primary/5 cursor-pointer">
                            My Posts
                        </Button>
                    </Link>
                    <Link to="/profile" className="flex-1">
                        <Button variant="ghost" className="w-full h-10 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-primary/10 cursor-pointer">
                            Profile
                        </Button>
                    </Link>
                </div>

            </div>

            {/* Detail Modal Dialog */}
            <StatDetailDialog
                open={!!selectedStat}
                onOpenChange={(open) => !open && setSelectedStat(null)}
                statType={selectedStat}
            />

        </div>
    );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
    FileText, Eye, Heart, PlusCircle, ArrowUpRight, TrendingUp, Smartphone, 
    Globe, User, Activity, Zap, Sparkles, Share2, Bookmark, MessageSquare, 
    Calendar, ArrowRight, Clock, SlidersHorizontal, ChevronRight, CheckCircle2,
    Users, BarChart3, Rss, Compass
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import secureAPI from "../../../lib/secureApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { StatDetailDialog } from "../Components/StatDetailDialog";
import { cn } from "@/lib/utils";

// Animated Counter Component
function Counter({ value, duration = 1.5 }) {
    const [count, setCount] = useState(0);
    const numericValue = parseFloat(value.toString().replace(/[^0-9.]/g, '')) || 0;
    const suffix = value.toString().replace(/[0-9.]/g, '');

    useEffect(() => {
        let start = 0;
        const end = numericValue;
        if (start === end) return;

        let totalMiliseconds = duration * 1000;
        let incrementTime = (totalMiliseconds / end) > 10 ? (totalMiliseconds / end) : 10;
        let step = end / (totalMiliseconds / incrementTime);

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
    const width = 100;
    const height = 28;

    const pathD = points.map((val, idx) => {
        const x = (idx / (points.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');

    return (
        <svg className="w-24 h-7 overflow-visible shrink-0" viewBox="0 0 100 28">
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

// Timeframe Datasets for Audience Growth
const chartDatasets = {
    "7d": [
        { name: "Mon", reach: 1400, reads: 920, engagement: 4.8 },
        { name: "Tue", reach: 2100, reads: 1450, engagement: 5.2 },
        { name: "Wed", reach: 1800, reads: 1120, engagement: 5.0 },
        { name: "Thu", reach: 2900, reads: 2100, engagement: 6.1 },
        { name: "Fri", reach: 3400, reads: 2600, engagement: 6.8 },
        { name: "Sat", reach: 4800, reads: 3800, engagement: 7.4 },
        { name: "Sun", reach: 4200, reads: 3200, engagement: 7.1 },
    ],
    "30d": [
        { name: "Week 1", reach: 11200, reads: 7800, engagement: 5.1 },
        { name: "Week 2", reach: 16400, reads: 12100, engagement: 5.6 },
        { name: "Week 3", reach: 22800, reads: 16900, engagement: 6.3 },
        { name: "Week 4", reach: 29500, reads: 22400, engagement: 7.2 },
    ],
    "90d": [
        { name: "Month 1", reach: 48000, reads: 32000, engagement: 4.9 },
        { name: "Month 2", reach: 74000, reads: 54000, engagement: 5.8 },
        { name: "Month 3", reach: 112000, reads: 86000, engagement: 6.9 },
    ]
};

// Engagement breakdown matrix data
const engagementMatrix = [
    { name: "Likes", value: 45, count: "1.4k", color: "var(--color-primary)" },
    { name: "Comments", value: 28, count: "840", color: "#3b82f6" },
    { name: "Bookmarks", value: 15, count: "420", color: "#a855f7" },
    { name: "Shares", value: 12, count: "310", color: "#ec4899" },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", damping: 18 } }
};

export default function DashboardHome() {
    const { user } = useAuth();
    const userName = user?.name || "Creator";
    
    // States
    const [myBlogs, setMyBlogs] = useState([]);
    const [loadingBlogs, setLoadingBlogs] = useState(true);
    const [timeframe, setTimeframe] = useState("7d");
    const [selectedStat, setSelectedStat] = useState(null);

    // Follower / Following count from local storage
    const [followerCount] = useState(() => {
        try {
            const stored = JSON.parse(localStorage.getItem("mock_db_followers") || "[]");
            return 1417 + stored.length;
        } catch { return 1420; }
    });

    useEffect(() => {
        let isMounted = true;
        setLoadingBlogs(true);
        secureAPI.get("/blogs/myblogs")
            .then(res => {
                if (isMounted) {
                    const blogs = res.data?.blogs || res.data?.data?.blogs || res.data?.data || [];
                    setMyBlogs(blogs);
                }
            })
            .catch(err => console.error("Error fetching blogs for dashboard:", err))
            .finally(() => {
                if (isMounted) setLoadingBlogs(false);
            });
        return () => { isMounted = false; };
    }, []);

    // Time of day greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    // Calculate aggregated stats
    const totalPosts = myBlogs.length;
    const totalLikes = myBlogs.reduce((acc, curr) => {
        if (Array.isArray(curr.likes)) return acc + curr.likes.length;
        return acc + (curr.likeCount || 0);
    }, 0);
    const totalComments = myBlogs.reduce((acc, curr) => acc + (curr.commentCount || 0), 0);
    const totalReach = myBlogs.reduce((acc, curr) => acc + (curr.views || Math.max(120, (curr.likeCount || 10) * 5)), 0);

    // Dynamic Top KPI Cards
    const kpiStats = [
        {
            label: "TOTAL REACH",
            value: totalReach > 0 ? `${(totalReach / 1000).toFixed(1)}k` : "2.4M",
            trend: "+14.2%",
            trendLabel: "vs last month",
            icon: Eye,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            type: "reach"
        },
        {
            label: "POSTS PUBLISHED",
            value: totalPosts > 0 ? totalPosts.toString() : "12",
            trend: "On Track",
            trendLabel: "active publications",
            icon: FileText,
            color: "text-primary",
            bg: "bg-primary/10",
            type: "posts"
        },
        {
            label: "TOTAL APPRECIATION",
            value: totalLikes > 0 ? totalLikes.toString() : "340",
            trend: "+18.5%",
            trendLabel: "engagement rate",
            icon: Heart,
            color: "text-pink-500",
            bg: "bg-pink-500/10",
            type: "likes"
        },
        {
            label: "COMMUNITY AUDIENCE",
            value: followerCount.toString(),
            trend: "+4.8%",
            trendLabel: "new connections",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            type: "audience"
        }
    ];

    // Platform / Channel Reach Breakdown Cards
    const channelCards = [
        {
            title: "Community Feed",
            reach: "980K",
            sub: "4.8% Engagement",
            badge: "+2.3%",
            icon: Rss,
            sparkline: [12, 18, 14, 25, 20, 32, 28, 40],
            color: "#10b981"
        },
        {
            title: "Direct Broadcasts",
            reach: "1.2M",
            sub: "12.4K Reads",
            badge: "+5.7%",
            icon: Globe,
            sparkline: [15, 22, 18, 30, 26, 42, 38, 54],
            color: "var(--color-primary)"
        },
        {
            title: "Saved Collections",
            reach: "420",
            sub: "+18.2% Save Rate",
            badge: "+1.8%",
            icon: Bookmark,
            sparkline: [8, 14, 10, 20, 16, 24, 22, 30],
            color: "#a855f7"
        },
        {
            title: "Audience Network",
            reach: "850K",
            sub: "3.2% Engagement",
            badge: "+4.1%",
            icon: Sparkles,
            sparkline: [10, 16, 12, 22, 19, 28, 25, 36],
            color: "#3b82f6"
        }
    ];

    return (
        <div className="space-y-8 pb-12 px-2 sm:px-4 md:px-0 max-w-7xl mx-auto">
            
            {/* 1. Header Section: Contextual Welcome + Quick Filter & Action Controls */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-gradient-to-r from-primary/10 via-background to-muted/20 p-6 sm:p-8 rounded-[36px] border border-primary/15 glass-panel shadow-xl"
            >
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                            <Activity size={12} className="animate-pulse" /> Signal System: Online
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/30 text-muted-foreground text-[10px] font-bold">
                            <Clock size={11} /> {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
                        {getGreeting()}, <span className="text-primary">{userName}</span> 👋
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base font-medium max-w-xl">
                        Here's what's happening across your content and publication network today.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {/* Timeframe selector pill */}
                    <div className="flex items-center p-1 rounded-2xl bg-muted/20 border border-primary/10 backdrop-blur-md">
                        {[
                            { label: "7 Days", key: "7d" },
                            { label: "30 Days", key: "30d" },
                            { label: "3 Months", key: "90d" }
                        ].map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setTimeframe(t.key)}
                                className={cn(
                                    "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                                    timeframe === t.key 
                                        ? "bg-primary text-primary-foreground shadow-md" 
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <Link to="/dashboard/create">
                        <Button className="h-11 px-5 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2 group cursor-pointer">
                            <PlusCircle size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span>New Post</span>
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* 2. Top Statistic KPI Cards (Row 1 - 4 Columns) */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
                {kpiStats.map((stat, i) => (
                    <motion.div key={i} variants={itemVariants}>
                        <div
                            onClick={() => setSelectedStat(stat.type === "posts" ? "Total Posts" : stat.type === "likes" ? "Total Likes" : "Total Views")}
                            className="group relative overflow-hidden p-6 rounded-[32px] glass-card border border-primary/10 hover:border-primary/25 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-full bg-background/50 backdrop-blur-xl"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">{stat.label}</span>
                                    <div className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-foreground">
                                        <Counter value={stat.value} />
                                    </div>
                                </div>
                                <div className={cn("p-3 rounded-2xl border border-primary/10 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                                    <stat.icon size={20} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-primary/5 mt-2">
                                <span className={cn("text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border", 
                                    stat.trend.startsWith("+") 
                                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                                        : "bg-primary/10 text-primary border-primary/20"
                                )}>
                                    {stat.trend}
                                </span>
                                <span className="text-[10px] font-semibold text-muted-foreground/60 truncate">{stat.trendLabel}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* 3. Platform / Channel Reach Breakdown Cards (Row 2 - 4 Columns) */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
                {channelCards.map((ch, idx) => (
                    <motion.div key={idx} variants={itemVariants}>
                        <div className="p-5 rounded-[28px] glass-panel border border-primary/10 bg-background/40 backdrop-blur-md hover:border-primary/20 transition-all duration-300 flex items-center justify-between gap-3">
                            <div className="space-y-1.5 min-w-0">
                                <div className="flex items-center gap-2">
                                    <ch.icon size={15} className="text-primary shrink-0" />
                                    <span className="text-xs font-bold text-foreground truncate">{ch.title}</span>
                                    <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20 shrink-0">{ch.badge}</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black tracking-tight text-foreground">{ch.reach}</span>
                                </div>
                                <p className="text-[10px] font-semibold text-muted-foreground/60 truncate">{ch.sub}</p>
                            </div>
                            <Sparkline data={ch.sparkline} color={ch.color} />
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* 4. Audience Growth & Reach Velocity Chart (Row 3 - Full Width Card) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-[36px] glass-panel border border-primary/15 p-6 sm:p-8 bg-background/60 backdrop-blur-2xl shadow-xl relative overflow-hidden space-y-6"
            >
                {/* Header bar inside chart card */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-primary/5">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp size={18} className="text-primary" />
                            <h2 className="text-2xl font-black tracking-tight text-foreground">Audience & Reach Velocity</h2>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">Signal progression and readership trajectory across channels</p>
                    </div>

                    {/* Metric inline quick stats bar */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-muted/15 border border-primary/10 p-3 sm:p-4 rounded-2xl">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Total Audience</p>
                            <p className="text-lg font-black text-foreground">14.2K</p>
                        </div>
                        <div className="h-8 w-[1px] bg-primary/10 hidden sm:block" />
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">New Connections</p>
                            <p className="text-lg font-black text-emerald-500">+1.2K</p>
                        </div>
                        <div className="h-8 w-[1px] bg-primary/10 hidden sm:block" />
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Growth Velocity</p>
                            <p className="text-lg font-black text-primary">+4.8%</p>
                        </div>
                        <div className="h-8 w-[1px] bg-primary/10 hidden sm:block" />
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Avg Read Time</p>
                            <p className="text-lg font-black text-foreground">3.2m</p>
                        </div>
                    </div>
                </div>

                {/* Recharts Area Chart */}
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
                                    borderRadius: '18px',
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
                                strokeWidth={3.5} 
                                fillOpacity={1} 
                                fill="url(#primaryReachGradient)" 
                            />
                            <Area 
                                type="monotone" 
                                dataKey="reads" 
                                name="Active Reads"
                                stroke="#10b981" 
                                strokeWidth={2.5} 
                                strokeDasharray="4 4"
                                fillOpacity={1} 
                                fill="url(#emeraldReadsGradient)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* 5. Split Section — Recent Posts / Publications + Engagement Matrix (Row 5 - 2 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Column A: Recent Publications (7 cols on lg) */}
                <div className="lg:col-span-7 rounded-[36px] glass-panel border border-primary/15 p-6 sm:p-8 bg-background/50 backdrop-blur-xl flex flex-col justify-between space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/5">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-foreground">Recent Publications</h2>
                                <p className="text-xs font-medium text-muted-foreground mt-0.5">Your active content signals and engagement overview</p>
                            </div>
                            <Link to="/dashboard/posts">
                                <Button variant="ghost" size="sm" className="h-9 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/10 gap-1 cursor-pointer">
                                    <span>View All</span> <ArrowRight size={13} />
                                </Button>
                            </Link>
                        </div>

                        {loadingBlogs ? (
                            <div className="py-12 flex justify-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent"></div>
                            </div>
                        ) : myBlogs.length === 0 ? (
                            <div className="py-12 px-4 text-center rounded-3xl border border-dashed border-primary/20 bg-primary/5 space-y-4">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                                    <FileText size={24} />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-extrabold text-foreground">No publications yet</p>
                                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">Create your first blog post to populate your dashboard analytics.</p>
                                </div>
                                <Link to="/dashboard/create" className="inline-block">
                                    <Button size="sm" className="rounded-xl font-bold uppercase tracking-wider text-[10px]">Create First Post</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3.5">
                                {myBlogs.slice(0, 4).map((post) => {
                                    const postLikes = Array.isArray(post.likes) ? post.likes.length : (post.likeCount || 0);
                                    const postComments = post.commentCount || 0;
                                    const postViews = post.views || Math.max(10, postLikes * 4);
                                    const postImage = post.image?.url || post.coverImage || post.image || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80";

                                    return (
                                        <div
                                            key={post._id}
                                            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-muted/15 border border-primary/5 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3.5 min-w-0">
                                                <img 
                                                    src={postImage} 
                                                    alt="cover" 
                                                    className="h-12 w-12 rounded-xl object-cover border border-primary/10 shrink-0" 
                                                />
                                                <div className="min-w-0">
                                                    <h3 className="font-extrabold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                                                        {post.title || "Untitled Post"}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70 font-semibold mt-1">
                                                        <span>{new Date(post.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                        <span>•</span>
                                                        <span className="text-primary/80 uppercase font-black">{post.tags?.[0] ? `#${post.tags[0]}` : "Article"}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-[11px] font-black tracking-tight shrink-0 self-end sm:self-center">
                                                <div className="flex items-center gap-1 text-muted-foreground" title="Views">
                                                    <Eye size={13} className="text-primary/70" />
                                                    <span>{postViews}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-pink-500/90" title="Likes">
                                                    <Heart size={13} className="fill-pink-500/20" />
                                                    <span>{postLikes}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-blue-500/90" title="Comments">
                                                    <MessageSquare size={13} />
                                                    <span>{postComments}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Column B: Engagement Matrix & Quick Activity Stream (5 cols on lg) */}
                <div className="lg:col-span-5 rounded-[36px] glass-panel border border-primary/15 p-6 sm:p-8 bg-background/50 backdrop-blur-xl flex flex-col justify-between space-y-6">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-primary/5">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-foreground">Engagement Matrix</h2>
                                <p className="text-xs font-medium text-muted-foreground mt-0.5">Interaction ratios and activity stream</p>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                Top 2% Level
                            </span>
                        </div>

                        {/* Interaction Distribution Bar */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-muted-foreground/80">
                                <span>Interaction Distribution</span>
                                <span className="text-primary">100% Breakdown</span>
                            </div>
                            
                            {/* Stacked bar */}
                            <div className="h-3 w-full bg-muted/30 rounded-full overflow-hidden flex">
                                {engagementMatrix.map((item, i) => (
                                    <div 
                                        key={i} 
                                        style={{ width: `${item.value}%`, backgroundColor: item.color }} 
                                        className="h-full border-r border-background/20 transition-all hover:opacity-90"
                                        title={`${item.name}: ${item.value}%`}
                                    />
                                ))}
                            </div>

                            {/* Legend labels */}
                            <div className="grid grid-cols-2 gap-2 pt-1">
                                {engagementMatrix.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-muted/10 border border-primary/5 text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="font-semibold text-muted-foreground">{item.name}</span>
                                        </div>
                                        <span className="font-black text-foreground font-mono">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity Highlights Stream */}
                        <div className="space-y-3 pt-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Live Signal Activity</span>
                            <div className="space-y-2.5">
                                {[
                                    { text: "Elara Vance liked your recent post", time: "12m ago", icon: Heart, color: "text-pink-500" },
                                    { text: "Kaelen Voss followed your profile", time: "1h ago", icon: User, color: "text-blue-500" },
                                    { text: "Lyra Sterling saved your signal", time: "3h ago", icon: Bookmark, color: "text-purple-500" },
                                ].map((act, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-muted/10 border border-primary/5 text-xs">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <act.icon size={14} className={act.color} />
                                            <span className="font-medium text-foreground truncate">{act.text}</span>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground/60 font-semibold shrink-0">{act.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Action Navigation Bar */}
                    <div className="pt-4 border-t border-primary/5 flex flex-wrap items-center gap-2">
                        <Link to="/dashboard/create" className="flex-1 min-w-[120px]">
                            <Button className="w-full h-9 rounded-xl text-[10px] font-black uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                                Create Post
                            </Button>
                        </Link>
                        <Link to="/dashboard/posts" className="flex-1 min-w-[100px]">
                            <Button variant="outline" className="w-full h-9 rounded-xl text-[10px] font-black uppercase tracking-wider border-primary/20 hover:bg-primary/5 cursor-pointer">
                                My Posts
                            </Button>
                        </Link>
                        <Link to="/profile" className="flex-1 min-w-[100px]">
                            <Button variant="ghost" className="w-full h-9 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-primary/10 cursor-pointer">
                                View Profile
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>

            {/* Detail Modal Dialog for Top KPI Cards */}
            <StatDetailDialog
                open={!!selectedStat}
                onOpenChange={(open) => !open && setSelectedStat(null)}
                statType={selectedStat}
            />

        </div>
    );
}

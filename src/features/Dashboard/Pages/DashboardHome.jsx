import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, Eye, Heart, PlusCircle, ArrowUpRight, TrendingUp, Smartphone, Globe, User, Activity, Zap } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnalyticsChart } from "../Components/AnalyticsChart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from "recharts";
import { StatDetailDialog } from "../Components/StatDetailDialog";

// Animated Counter Component
function Counter({ value, duration = 2 }) {
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

    return <span>{suffix === 'k' ? count.toFixed(1) : Math.floor(count)}{suffix}</span>;
}

const stats = [
    { label: "Total Posts", value: "12", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10", type: "vertical" },
    { label: "Total Views", value: "1.2k", icon: Eye, color: "text-green-500", bg: "bg-green-500/10", type: "radial" },
    { label: "Total Likes", value: "340", icon: Heart, color: "text-red-500", bg: "bg-red-500/10", type: "stepped" },
];

const engagementData = [
    { name: "Likes", value: 400, color: "#8b5cf6" },
    { name: "Comments", value: 300, color: "#6366f1" },
    { name: "Shares", value: 200, color: "#a855f7" },
    { name: "Saves", value: 100, color: "#7c3aed" },
];

const topPosts = [
    { id: 1, title: "The Future of AI in Web Development", views: "1.2k", likes: 342, date: "2 days ago" },
    { id: 2, title: "10 Tips for Better CSS Animations", views: "854", likes: 210, date: "5 days ago" },
    { id: 3, title: "Why React 19 Changes Everything", views: "643", likes: 185, date: "1 week ago" },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", damping: 20 } }
};

export default function DashboardHome() {
    const { user } = useAuth();
    const userName = user?.name || "User";
    const [selectedStat, setSelectedStat] = useState(null);

    return (
        <div className="space-y-8 pb-10 px-4 md:px-0">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                        <Activity size={12} /> System Status: Online
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        Hey, <span className="text-gradient">{userName}</span> ⚡
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Your digital influence is expanding. Here's the data.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link to="/dashboard/create">
                        <Button className="gap-2 h-12 px-6 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all font-bold group">
                            <PlusCircle size={18} className="group-hover:rotate-90 transition-transform" /> New Publication
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* Diverse Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-3"
            >
                {stats.map((stat, i) => {
                    const isInteractive = stat.label !== "Total Views";
                    return (
                        <motion.div key={i} variants={item}>
                            <div
                                className={`relative overflow-hidden p-6 rounded-[32px] glass-card h-full flex flex-col justify-between ${isInteractive ? "cursor-pointer group hover:scale-[1.02]" : ""}`}
                                onClick={() => isInteractive && setSelectedStat(stat.label)}
                            >
                                {/* Background Accent based on type */}
                                {stat.type === "vertical" && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-r-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                )}

                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
                                        <div className="text-4xl font-extrabold tracking-tighter">
                                            <Counter value={stat.value} />
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} backdrop-blur-md border border-white/5`}>
                                        <stat.icon size={20} />
                                    </div>
                                </div>

                                {stat.type === "radial" && (
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="relative h-12 w-12 flex items-center justify-center">
                                            <svg className="h-full w-full rotate-[-90deg]">
                                                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-muted/20" />
                                                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="125.6" strokeDashoffset="31.4" className="text-green-500" />
                                            </svg>
                                            <ArrowUpRight size={14} className="absolute text-green-500" />
                                        </div>
                                        <p className="text-xs font-bold text-green-500">+24% velocity</p>
                                    </div>
                                )}

                                {stat.type === "stepped" && (
                                    <div className="flex gap-1 mt-4">
                                        {[40, 70, 50, 90, 60].map((h, idx) => (
                                            <div key={idx} className="flex-1 h-8 bg-muted/30 rounded-md overflow-hidden relative">
                                                <motion.div 
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    transition={{ delay: 0.5 + idx * 0.1, duration: 1 }}
                                                    className="absolute bottom-0 left-0 right-0 bg-red-500/40" 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {stat.type === "vertical" && (
                                    <div className="mt-4 flex items-center gap-2">
                                        <div className="h-1 flex-1 bg-muted/30 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: '65%' }}
                                                transition={{ delay: 0.5, duration: 1.5 }}
                                                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" 
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground">65% Target</span>
                                    </div>
                                )}

                                <div className={`text-[9px] font-black uppercase tracking-widest mt-4 flex items-center gap-1 transition-opacity ${isInteractive ? "opacity-0 group-hover:opacity-100" : "invisible"}`}>
                                    Deep Analysis <ArrowUpRight size={10} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-7">
                {/* Main Growth Chart - Redesigned as Area Gradient */}
                <div className="md:col-span-4 rounded-[32px] glass-panel p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                        <TrendingUp size={120} className="text-primary" />
                    </div>
                    
                    <div className="mb-8">
                        <h2 className="text-2xl font-extrabold tracking-tight">Growth Velocity</h2>
                        <p className="text-muted-foreground text-sm">Visualizing audience reach across the quarter</p>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { name: "Jan", views: 400 },
                                { name: "Feb", views: 300 },
                                { name: "Mar", views: 600 },
                                { name: "Apr", views: 800 },
                                { name: "May", views: 500 },
                                { name: "Jun", views: 900 },
                                { name: "Jul", views: 1200 },
                            ]}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-muted)', fontSize: 10}} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'var(--glass-bg)', 
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '16px',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }} 
                                />
                                <Area type="monotone" dataKey="views" stroke="var(--color-primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Engagement / Audience */}
                <div className="md:col-span-3 rounded-[32px] glass-panel p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-extrabold tracking-tight">Engagement Matrix</h2>
                        <p className="text-muted-foreground text-sm">High-fidelity interaction distribution</p>
                    </div>
                    <div className="h-[250px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={engagementData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: 'var(--color-foreground)', fontSize: 12, fontWeight: 'bold'}} width={80} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                                    {engagementData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-6 flex justify-between items-center p-4 rounded-2xl bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2">
                            <Zap size={16} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Power Ranking</span>
                        </div>
                        <span className="text-sm font-bold text-primary">Top 2%</span>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Top Posts */}
                <div className="rounded-[32px] glass-panel p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-tight">Top Performing</h2>
                            <p className="text-muted-foreground text-sm">Your content that resonates most</p>
                        </div>
                        <Link to="/dashboard/posts">
                            <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-wider hover:text-primary">View All</Button>
                        </Link>
                    </div>
                    
                    <div className="space-y-4">
                        {topPosts.map((post) => (
                            <div key={post.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-all group cursor-pointer border border-transparent hover:border-primary/20">
                                <div className="space-y-1">
                                    <p className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{post.title}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{post.date}</p>
                                </div>
                                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Eye size={14} className="text-primary/60" /> {post.views}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-pink-500/80">
                                        <Heart size={14} fill="currentColor" className="opacity-40" /> {post.likes}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Audience Insights */}
                <div className="rounded-[32px] glass-panel p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-extrabold tracking-tight">Audience Flow</h2>
                        <p className="text-muted-foreground text-sm">Geographical and platform intelligence</p>
                    </div>
                    
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/10">
                                    <Smartphone size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Mobile First</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Dominant device</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-extrabold tracking-tighter">65%</span>
                                <div className="h-1.5 w-32 bg-muted/30 rounded-full mt-1 overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 1.5 }} className="h-full bg-blue-500" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/10">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Loyalty Rate</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Returning readers</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-extrabold tracking-tighter">42%</span>
                                <div className="h-1.5 w-32 bg-muted/30 rounded-full mt-1 overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '42%' }} transition={{ duration: 1.5, delay: 0.2 }} className="h-full bg-primary" />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-primary/5 border border-dashed border-primary/20 text-center">
                            <p className="text-xs font-bold text-muted-foreground italic leading-relaxed">
                                "Peak audience resonance detected on <span className="text-primary">Saturdays</span> at <span className="text-primary">8:00 PM</span> UTC."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Dialog */}
            <StatDetailDialog
                open={!!selectedStat}
                onOpenChange={(open) => !open && setSelectedStat(null)}
                statType={selectedStat}
            />
        </div>
    );
}

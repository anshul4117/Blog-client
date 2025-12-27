import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    BarChart, Bar, LineChart, Line, XAxis, Tooltip, ResponsiveContainer, Cell,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    RadialBarChart, RadialBar, Legend
} from "recharts";
import { FileText, Eye, Heart, Globe, Clock, ArrowUpRight, CheckCircle, PenTool, Zap, AlignLeft, Calendar, Trophy, Sparkles, Activity, Layers } from "lucide-react";

// Mock Data for "Total Posts"
const topicRadarData = [
    { subject: 'Tech', A: 120, fullMark: 150 },
    { subject: 'Opinion', A: 98, fullMark: 150 },
    { subject: 'News', A: 86, fullMark: 150 },
    { subject: 'Life', A: 99, fullMark: 150 },
    { subject: 'Code', A: 85, fullMark: 150 },
    { subject: 'Review', A: 65, fullMark: 150 },
];

const qualityData = [
    { name: 'Readability', uv: 90, fill: '#8b5cf6' },
    { name: 'Sentiment', uv: 75, fill: '#06b6d4' },
    { name: 'Depth', uv: 85, fill: '#ec4899' },
    { name: 'Engagement', uv: 60, fill: '#10b981' },
];

// Mock Heatmap Data (7 days x 4 time slots approx)
const heatmapData = Array.from({ length: 28 }, (_, i) => ({
    value: Math.floor(Math.random() * 4), // 0-3 intensity
}));

// Mock Data for "Total Views"
const sourceData = [
    { name: "Google", value: 45, color: "#ef4444" },
    { name: "Shared Link", value: 30, color: "#3b82f6" },
    { name: "Direct", value: 15, color: "#10b981" },
    { name: "Twitter", value: 10, color: "#f59e0b" },
];

// Mock Data for "Total Likes"
const likeTrendData = [
    { day: "1", value: 12 }, { day: "5", value: 18 },
    { day: "10", value: 9 }, { day: "15", value: 24 },
    { day: "20", value: 32 }, { day: "25", value: 15 },
    { day: "30", value: 45 },
];

export function StatDetailDialog({ open, onOpenChange, statType }) {
    if (!statType) return null;

    const renderContent = () => {
        switch (statType) {
            case "Total Posts":
                return (
                    <div className="space-y-6">
                        {/* 1. Creator Level Card - Premium Gradient */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 text-white shadow-lg">
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-white/80 text-sm font-medium mb-1">
                                        <Trophy size={16} /> CREATOR RANK
                                    </div>
                                    <h3 className="text-3xl font-bold">WordSmith</h3>
                                    <p className="text-white/80 text-xs mt-1">Level 5 • Top 2% of contributors</p>
                                </div>
                                <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                                    <Sparkles size={32} className="text-yellow-300" />
                                </div>
                            </div>
                            {/* Decorative background shapes */}
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-black/10 rounded-full blur-xl" />
                        </div>

                        {/* 2. Publishing Heatmap */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm text-foreground flex items-center gap-2">
                                    <Calendar size={14} className="text-primary" /> Publishing Schedule
                                </h4>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Last 4 Weeks</span>
                            </div>
                            <div className="grid grid-cols-7 gap-2 p-4 bg-muted/40 rounded-xl border border-border/50">
                                {heatmapData.map((d, i) => (
                                    <div
                                        key={i}
                                        className="aspect-square rounded-md transition-all hover:scale-110 cursor-help border border-transparent hover:border-border/50"
                                        style={{
                                            backgroundColor: d.value === 0 ? 'hsl(var(--muted))' :
                                                d.value === 1 ? '#c4b5fd' : // Valid Violet 300
                                                    d.value === 2 ? '#8b5cf6' : // Valid Violet 500
                                                        '#5b21b6' // Valid Violet 800
                                        }}
                                        title={`${d.value} posts`}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                                <span>Less active</span>
                                <span>More active</span>
                            </div>
                        </div>

                        {/* 3. Content Quality Engine & Topics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Quality Radial Chart */}
                            <div className="p-4 bg-background rounded-2xl border border-border/60 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                                <h4 className="font-medium text-xs text-muted-foreground w-full text-left flex items-center gap-2 absolute top-4 left-4">
                                    <Activity size={14} /> Content Health
                                </h4>
                                <div className="h-[200px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={10} data={qualityData}>
                                            <RadialBar
                                                minAngle={15}
                                                background
                                                clockWise
                                                dataKey="uv"
                                                cornerRadius={10}
                                                label={{ position: 'insideStart', fill: '#fff', fontSize: '0px' }} // hiding label visually
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: "8px", border: "none" }}
                                                itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
                                            />
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* Legend manually for clearer view */}
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] w-full px-2">
                                    {qualityData.map((d) => (
                                        <div key={d.name} className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }} />
                                            <span className="text-muted-foreground">{d.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Topics Radar (Unified Theme) */}
                            <div className="p-4 bg-background rounded-2xl border border-border/60 shadow-sm flex flex-col relative overflow-hidden">
                                <h4 className="font-medium text-xs text-muted-foreground w-full text-left flex items-center gap-2 absolute top-4 left-4 z-10">
                                    <Layers size={14} /> Topic Balance
                                </h4>

                                <div className="h-[220px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={topicRadarData}>
                                            <defs>
                                                <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
                                                </linearGradient>
                                            </defs>
                                            <PolarGrid stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                                            <PolarAngleAxis
                                                dataKey="subject"
                                                tick={({ payload, x, y, textAnchor, ...props }) => (
                                                    <text
                                                        x={x}
                                                        y={y}
                                                        textAnchor={textAnchor}
                                                        className="text-[11px] font-medium text-muted-foreground"
                                                        fill="currentColor"
                                                    >
                                                        {payload.value}
                                                    </text>
                                                )}
                                            />
                                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                            <Radar
                                                name="Focus"
                                                dataKey="A"
                                                stroke="#8b5cf6"
                                                strokeWidth={3}
                                                fill="url(#radarFill)"
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: "12px",
                                                    border: "1px solid hsl(var(--border))",
                                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                    backgroundColor: "hsl(var(--background))"
                                                }}
                                                itemStyle={{ color: "#8b5cf6", fontWeight: "bold" }}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "Total Views":
                return (
                    <div className="space-y-6">
                        <div className="p-4 bg-muted/30 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock size={16} className="text-primary" />
                                <h4 className="font-medium text-sm">Peak Viewing Time</h4>
                            </div>
                            <p className="text-2xl font-bold">8:00 PM - 10:00 PM</p>
                            <p className="text-xs text-muted-foreground">Most of your readers are active in the evening.</p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">Traffic Sources</h4>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={sourceData} layout="vertical" margin={{ left: 0 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                                            {sourceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                );

            case "Total Likes":
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                                <p className="text-xs text-muted-foreground uppercase">Like Ratio</p>
                                <p className="text-3xl font-bold text-red-500">28%</p>
                                <p className="text-[10px] text-muted-foreground">of viewers liked your posts</p>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-xl border border-border">
                                <p className="text-xs text-muted-foreground uppercase">Top Liker</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">AJ</div>
                                    <div>
                                        <p className="text-sm font-bold">Alex Johnson</p>
                                        <p className="text-[10px] text-muted-foreground">24 likes</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">Like Velocity (Last 30 Days)</h4>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={likeTrendData}>
                                        <XAxis dataKey="day" fontSize={10} tickLine={false} axisLine={false} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: "#ef4444" }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                );

            default:
                return <p>No details available.</p>;
        }
    };

    const getTitle = () => {
        switch (statType) {
            case "Total Posts": return { title: "Content Analysis", icon: FileText, color: "text-blue-500" };
            case "Total Views": return { title: "Traffic Insights", icon: Eye, color: "text-green-500" };
            case "Total Likes": return { title: "Engagement Pulse", icon: Heart, color: "text-red-500" };
            default: return { title: "Details", icon: ArrowUpRight };
        }
    }

    const header = getTitle();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <header.icon className={header.color} size={24} />
                        {header.title}
                    </DialogTitle>
                    <DialogDescription>
                        Deep dive into your <strong>{statType}</strong> data.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-2">
                    {renderContent()}
                </div>
            </DialogContent>
        </Dialog>
    );
}

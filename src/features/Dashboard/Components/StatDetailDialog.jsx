import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { BarChart, Bar, LineChart, Line, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { FileText, Eye, Heart, Globe, Clock, ArrowUpRight, CheckCircle, PenTool } from "lucide-react";

// Mock Data for "Total Posts"
const categoriesData = [
    { name: "Tech", value: 5, color: "#3b82f6" },
    { name: "Design", value: 3, color: "#ec4899" },
    { name: "Personal", value: 2, color: "#10b981" },
    { name: "Guides", value: 2, color: "#f59e0b" },
];

// Mock Data for "Total Views"
const sourceData = [
    { name: "Google", value: 45, color: "#ef4444" },
    { name: "Shared Link", value: 30, color: "#3b82f6" },
    { name: "Direct", value: 15, color: "#10b981" },
    { name: "Twitter", value: 10, color: "#f59e0b" },
];

// Mock Data for "Total Likes" - trend over last 30 days
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                                    <CheckCircle size={16} /> <span className="text-sm font-medium">Published</span>
                                </div>
                                <div className="text-2xl font-bold">10</div>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                                <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                                    <PenTool size={16} /> <span className="text-sm font-medium">Drafts</span>
                                </div>
                                <div className="text-2xl font-bold">2</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">Category Distribution</h4>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoriesData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {categoriesData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center text-xs">
                                {categoriesData.map(c => (
                                    <div key={c.name} className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                                        <span>{c.name} ({c.value})</span>
                                    </div>
                                ))}
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
            <DialogContent className="sm:max-w-[500px]">
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

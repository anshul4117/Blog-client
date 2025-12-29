import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, Eye, Heart, PlusCircle, ArrowUpRight, TrendingUp, Smartphone, Globe, User } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnalyticsChart } from "../Components/AnalyticsChart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { StatDetailDialog } from "../Components/StatDetailDialog";

// Mock Data for "Stats"
const stats = [
  { label: "Total Posts", value: "12", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Total Views", value: "1.2k", icon: Eye, color: "text-green-500", bg: "bg-green-500/10" },
  { label: "Total Likes", value: "340", icon: Heart, color: "text-red-500", bg: "bg-red-500/10" },
];

// Mock Data for Charts
const monthlyData = [
  { name: "Week 1", views: 400, likes: 240 },
  { name: "Week 2", views: 300, likes: 139 },
  { name: "Week 3", views: 200, likes: 980 },
  { name: "Week 4", views: 278, likes: 390 },
  { name: "Week 5", views: 189, likes: 480 },
  { name: "Week 6", views: 239, likes: 380 },
  { name: "Week 7", views: 349, likes: 430 },
];

const engagementData = [
  { name: "Likes", value: 400, color: "#ef4444" },
  { name: "Comments", value: 300, color: "#3b82f6" },
  { name: "Shares", value: 200, color: "#10b981" },
  { name: "Saves", value: 100, color: "#f59e0b" },
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
  show: { opacity: 1, y: 0 }
};

export default function DashboardHome() {
  const { user } = useAuth();
  const userName = user?.name || "User";
  const [selectedStat, setSelectedStat] = useState(null);

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your content performance at a glance.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/create">
            <Button className="gap-2">
              <PlusCircle size={16} /> New Post
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-3"
      >
        {stats.map((stat, i) => {
          const isInteractive = stat.label !== "Total Views";
          return (
            <motion.div key={i} variants={item}>
              <Card
                className={`transition-all border-border/60 ${isInteractive ? "hover:shadow-md cursor-pointer hover:scale-[1.02] hover:border-border group" : ""}`}
                onClick={() => isInteractive && setSelectedStat(stat.label)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${stat.bg}`}>
                    <stat.icon size={16} className={stat.color} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <ArrowUpRight size={12} className="text-green-500" /> +12% from last week
                  </p>
                  <p className={`text-[10px] text-muted-foreground mt-2 transition-opacity ${isInteractive ? "opacity-0 group-hover:opacity-100" : "invisible"}`}>
                    Click to analyze details →
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4 md:grid-cols-7"
      >
        {/* Main Growth Chart */}
        <AnalyticsChart
          title="Growth Analytics"
          description="Views over the last 7 weeks"
          data={monthlyData}
          dataKey="views"
          color="#8b5cf6"
        />

        {/* Engagement / Audience */}
        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle>Engagement Breakdown</CardTitle>
            <CardDescription>Interaction types distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Section: Top Posts & Demographics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid gap-6 md:grid-cols-2"
      >
        {/* Top Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" /> Top Performing Posts
            </CardTitle>
            <CardDescription>Your most engaging content this week.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="space-y-1">
                  <p className="font-medium line-clamp-1">{post.title}</p>
                  <p className="text-xs text-muted-foreground">{post.date}</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye size={14} /> {post.views}
                  </div>
                  <div className="flex items-center gap-1 text-red-500/80">
                    <Heart size={14} /> {post.likes}
                  </div>
                </div>
              </div>
            ))}
            <Link to="/dashboard/posts" className="block text-center text-xs text-muted-foreground hover:text-primary mt-4">
              View all posts →
            </Link>
          </CardContent>
        </Card>

        {/* Quick Audience Insight (Mock) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe size={18} className="text-primary" /> Audience Insights
            </CardTitle>
            <CardDescription>Where your readers are coming from.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-500">
                  <Smartphone size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">Mobile Users</p>
                  <p className="text-xs text-muted-foreground">65% of traffic</p>
                </div>
              </div>
              <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[65%]" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-500">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">Returning Readers</p>
                  <p className="text-xs text-muted-foreground">42% retention</p>
                </div>
              </div>
              <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[42%]" />
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-xl mt-4">
              <p className="text-sm text-center text-muted-foreground italic">
                "Your audience engages most on <strong>Weekends</strong> between <strong>6 PM - 9 PM</strong>."
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detail Dialog */}
      <StatDetailDialog
        open={!!selectedStat}
        onOpenChange={(open) => !open && setSelectedStat(null)}
        statType={selectedStat}
      />
    </div>
  );
}

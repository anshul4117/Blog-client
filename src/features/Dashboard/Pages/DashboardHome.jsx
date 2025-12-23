import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, Eye, Heart, PlusCircle, ArrowUpRight } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock Data for "Stats" - ideally this comes from an API
const stats = [
  { label: "Total Posts", value: "12", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Total Views", value: "1.2k", icon: Eye, color: "text-green-500", bg: "bg-green-500/10" },
  { label: "Total Likes", value: "340", icon: Heart, color: "text-red-500", bg: "bg-red-500/10" },
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

  return (
    <div className="space-y-8">
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
            Here's what's happening with your content today.
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
        {stats.map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="hover:shadow-md transition-shadow">
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
                  <ArrowUpRight size={12} className="text-green-500" /> +20% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity / Placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
      >
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground italic border-2 border-dashed rounded-lg">
              Chart / Activity Graph Placeholder
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <FileText size={16} />
              </div>
              <div>
                <p className="text-sm font-medium">Write Consistently</p>
                <p className="text-xs text-muted-foreground">Posting regularly boosts engagement.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <Heart size={16} />
              </div>
              <div>
                <p className="text-sm font-medium">Engage with others</p>
                <p className="text-xs text-muted-foreground">Reply to comments to build community.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

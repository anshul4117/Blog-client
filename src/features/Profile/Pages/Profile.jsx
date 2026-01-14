import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext.jsx";
import { MapPin, Calendar, Link2, Edit, Award, LayoutGrid, List, ArrowLeft, Compass } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for demo purposes - should ideally come from API
  const profileData = {
    name: user?.name || "John Doe",
    role: "Full Stack Developer",
    followers: 120,
    following: 15,
    location: "Remote, Earth",
    memberSince: "Dec, 2024",
    about:
      "Passionate about building scalable web applications and exploring new technologies. Lover of clean code and good coffee.",
    techStack: ["React", "Node.js", "Tailwind", "PostgreSQL"],
    blog: {
      title: "My Dev Journey",
      url: "https://dev.to/anshul",
    },
    badges: [
      {
        name: "Early Adopter",
        earnedOn: "Dec 19, 2024",
        icon: <Award className="w-5 h-5 text-yellow-500" />,
      },
    ],
  };

  return (
    <PageTransition className="py-6 space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft size={18} /> Back
        </Button>
        <Link to="/feed">
          <Button variant="outline" className="gap-2">
            <Compass size={18} /> Explore
          </Button>
        </Link>
      </div>
      {/* Header Card */}
      <Card className="border-border/50 shadow-sm overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-purple-500/20" />
        <CardContent className="px-6 pb-6 mt-[-3rem] relative">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <img
                src={user?.user?.profilePicture }
                alt="avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-lg"
              />
              <Link to="/settings">
                <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full w-8 h-8">
                  <Edit size={14} />
                </Button>
              </Link>
            </div>

            <div className="flex-1 mt-12 md:mt-14 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{user?.user?.name}</h1>
                  <p className="text-muted-foreground font-medium">{user?.user?.username}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {user?.user?.location}
                </span>
                <span className="flex items-center gap-1">
                  {/* convert date to readable format */}
                  <Calendar size={14} /> Joined {new Date(user?.user?.dateOfJoin).toLocaleDateString()}

                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-end gap-8 mt-6 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0">
            <div className="text-center">
              <span className="block text-2xl font-bold">{profileData.followers}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Followers</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold">{profileData.following}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Following</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              {user?.user?.bio}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tech Stack</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {profileData.techStack.map(tech => (
                <span key={tech} className="px-2.5 py-1 rounded-md bg-accent/50 text-xs font-medium border border-border/50">
                  {tech}
                </span>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Badges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData.badges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-yellow-500/10 dark:bg-yellow-500/20">
                    {badge.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">Earned {badge.earnedOn}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Navigation Tabs (Visual only) */}
          <div className="flex items-center gap-4 border-b border-border/50 pb-2 mb-4">
            <button className="flex items-center gap-2 pb-2 border-b-2 border-primary text-foreground font-medium text-sm">
              <LayoutGrid size={16} /> Recent Projects
            </button>
            <button className="flex items-center gap-2 pb-2 text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">
              <List size={16} /> Activity Log
            </button>
          </div>

          {/* Activity Feed Placeholder */}
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <LayoutGrid className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No recent projects</h3>
              <p className="text-sm">When you publish content, it will appear here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}

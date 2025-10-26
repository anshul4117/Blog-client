import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext.jsx";
import { MapPin, Calendar, Link2, Edit, Award } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  const profileData = {
    name: user?.user?.name || "John Doe",
    role: "Node.js Developer",
    followers: 1,
    following: 1,
    location: "Meerut, India",
    memberSince: "Dec, 2024",
    about:
      "Backend developer with a strong foundation in Node.js, Express.js, MongoDB, Redis, Docker, and AWS. Passionate about building scalable APIs, event-driven systems, and optimizing backend performance for efficient cloud deployments.",
    techStack: ["Node.js", "Express.js", "MongoDB", "Redis", "Docker", "Kafka"],
    blog: {
      title: "Dev Insights Hub",
      url: "https://the-power-of-indexing-in-mongodb.hashnode.dev",
    },
    badges: [
      {
        name: "Self Starter",
        earnedOn: "Dec 19, 2024",
        icon: <Award className="w-6 h-6 text-blue-500" />,
      },
    ],
    recentActivity: [
      {
        date: "Jan 7",
        title: "Docker Not for Beginners",
        link: "#",
      },
      {
        date: "Dec 19 2024",
        title: "The Power of Indexing in MongoDB",
        link: "#",
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={
              user?.avatar ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover border"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profileData.name}</h1>
            <p className="text-gray-600">{profileData.role}</p>
            <p className="text-sm text-gray-500 mt-1">
              {profileData.followers} Follower • {profileData.following} Following
            </p>

            <div className="flex flex-wrap gap-4 mt-4 text-gray-600 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {profileData.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Member since{" "}
                {profileData.memberSince}
              </span>
            </div>
          </div>
          <Button variant="outline" className="self-start">
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
        </div>
      </Card>

      {/* Blog Section */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Writes at</p>
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{profileData.blog.title}</span>
            </div>
            <a
              href={profileData.blog.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              {profileData.blog.url}
            </a>
          </div>
          <Button variant="outline" size="sm" className="mt-3 md:mt-0">
            Manage Blogs
          </Button>
        </CardContent>
      </Card>

      {/* About + Tech Stack + Availability */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-2">About Me</h2>
            <p className="text-sm text-gray-600">{profileData.about}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-2">My Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {profileData.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs rounded-full bg-gray-100 border"
                >
                  {tech}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col items-start">
            <h2 className="font-semibold mb-2">I am available for</h2>
            <Button variant="outline" size="sm">
              + Add Availability
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Badges */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="font-semibold mb-3">Badges</h2>
          {profileData.badges.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 border p-3 rounded-lg mb-2"
            >
              {badge.icon}
              <div>
                <p className="font-medium">{badge.name}</p>
                <p className="text-xs text-gray-500">
                  Earned on {badge.earnedOn}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-3">Recent Activity</h2>
          {profileData.recentActivity.map((act, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-2 border-b last:border-0"
            >
              <p className="text-sm text-gray-600">{act.date}</p>
              <a
                href={act.link}
                className="font-medium text-primary hover:underline"
              >
                {act.title}
              </a>
            </div>
          ))}
          <Button variant="link" size="sm" className="mt-2 text-primary">
            Show more
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

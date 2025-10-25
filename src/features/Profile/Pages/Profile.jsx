import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import API from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    API.get(`/users/profile/${user.id}`)
      .then((res) => {
        setProfile(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-10 space-y-3">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    );
  }

  if (!profile) {
    return <p className="text-center mt-10">Profile not found ❌</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="p-6">
        <div className="flex items-center gap-6">
          <img
            src={profile.avatar || "/Woman.jpeg"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground">{profile.email}</p>
            <p className="text-sm mt-1">
              Member since:{" "}
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Link to="/settings">
            <Button variant="outline">Edit Profile</Button>
          </Link>
          <Link to="/dashboard/posts">
            <Button>View My Posts</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import API from "../lib/api.js";
import PostCard from "../components/blog/PostCard.jsx";
import MainLayout from "../components/layout/MainLayout.jsx";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/blogs/allblogs")
      .then((res) => {
        setPosts(res.data.blogs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-muted-foreground">Loading blogs...</p>;

  return (
    <MainLayout>
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📰 Latest Blogs</h1>
        <Link to="/dashboard/create">
          <Button>+ Create New Post</Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <Card className="p-6 text-center">
          <CardContent>
            <p className="text-muted-foreground mb-4">
              No blogs yet — be the first to write one!
            </p>
            <Link to="/dashboard/create">
              <Button>Write Your First Blog</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
    </MainLayout>
  );
}

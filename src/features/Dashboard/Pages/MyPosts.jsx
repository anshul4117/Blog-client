import { useEffect, useState } from "react";
import PostCard from "../../../components/blog/PostCard";
import API from "../../../lib/secureApi.js";
import PageTransition from "@/components/layout/PageTransition.jsx";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/blogs/myblogs")
      .then((res) => {
        setPosts(res.data.blogs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">My Posts</h2>
        <div className="text-sm text-muted-foreground">
          {posts.length} published
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-border/50 rounded-2xl bg-muted/20">
          <div className="p-4 rounded-full bg-muted text-muted-foreground mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-medium mb-1">No posts yet</h3>
          <p className="text-muted-foreground mb-6">Start writing your first blog post today.</p>
          <Link to="/dashboard/create">
            <Button>Create Post</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p._id} post={p} />
          ))}
        </div>
      )}
    </PageTransition>
  );
}

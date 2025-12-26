import { useEffect, useState } from "react";
import PostCard from "../../../components/blog/PostCard";
import PageTransition from "@/components/layout/PageTransition.jsx";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function SavedPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false); // Set to false for now as we are mocking empty state

    // TODO: Integrate with backend API when available
    // useEffect(() => {
    //   API.get("/blogs/saved")
    //     .then((res) => {
    //       setPosts(res.data.blogs || []);
    //       setLoading(false);
    //     })
    //     .catch((err) => {
    //       console.error(err);
    //       setLoading(false);
    //     });
    // }, []);

    return (
        <PageTransition>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Saved Posts</h2>
                <div className="text-sm text-muted-foreground">
                    {posts.length} saved
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
                        <Bookmark size={32} />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No saved posts</h3>
                    <p className="text-muted-foreground mb-6">Posts you bookmark will appear here.</p>
                    <Link to="/feed">
                        <Button variant="outline">Explore Posts</Button>
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

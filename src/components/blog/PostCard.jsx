import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition">
      <img
        src={post.image || "/Woman.jpeg"}
        alt={post.title}
        className="h-48 w-full object-cover"
      />
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">
          <Link to={`/post/${post._id}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {post.content}
        </p>
        <div className="mt-3 text-xs text-muted-foreground">
          By <span className="font-medium">{post.author || "Anonymous"}</span> •{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}

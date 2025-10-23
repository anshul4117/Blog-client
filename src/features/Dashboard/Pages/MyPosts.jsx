import { useEffect, useState } from "react";
import PostCard from "../../../components/blog/PostCard";
import API from "../../../lib/api.js";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get("/blogs/myblogs")
      .then((res) => {
        // console.log("API response:", res.data);
        setPosts(res.data.blogs || []); // ✅ extract blogs array
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Posts</h2>

      {posts.length === 0 ? (
        <p>You have not created any posts yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p._id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}

import PostCard from "../../../components/blog/PostCard";

export default function MyPosts() {
  const posts = [
  {
    id: 1,
    title: "Building a MERN Blog App",
    excerpt: "Learn how to build a production-ready MERN stack application step by step.",
    author: "Anshul Kumar",
    date: "Oct 2025",
    image: "../../public/Woman.jpeg",
  },
  {
    id: 2,
    title: "Clean Architecture in Node.js",
    excerpt: "Understanding service layers, repositories, and modular structures.",
    author: "John Doe",
    date: "Oct 2025",
    image: "../../public/Woman.jpeg",
  },
];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Posts</h2>
      {posts.length === 0 ? (
        <p>You have not created any posts yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

    </div>
  );
}

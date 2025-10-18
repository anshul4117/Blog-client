import PostCard from "../../../components/blog/PostCard";

export default function MyPosts() {
  const posts = [
  {
    id: 1,
    title: "Building a MERN Blog App",
    excerpt: "Learn how to build a production-ready MERN stack application step by step.",
    author: "Anshul Kumar",
    date: "Oct 2025",
    image: "https://www.google.com/imgres?q=developer%20image&imgurl=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Fit-developer-online-software-information-looking-camera-gusher_31965-656121.jpg%3Fsemt%3Dais_hybrid%26w%3D740%26q%3D80&imgrefurl=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Ffront-end-developer&docid=W2I1GgeBlVP9qM&tbnid=jr8KAaZCCm8pkM&vet=12ahUKEwjYpKnYl66QAxXqxjgGHcGeM28QM3oECBkQAA..i&w=740&h=494&hcb=2&ved=2ahUKEwjYpKnYl66QAxXqxjgGHcGeM28QM3oECBkQAA",
  },
  {
    id: 2,
    title: "Clean Architecture in Node.js",
    excerpt: "Understanding service layers, repositories, and modular structures.",
    author: "John Doe",
    date: "Oct 2025",
    image: "https://source.unsplash.com/800x400/?javascript,backend",
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

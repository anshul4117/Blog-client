export default function MyPosts() {
  const dummyPosts = [
    { id: 1, title: "My first post", date: "2025-10-16" },
    { id: 2, title: "React patterns I love", date: "2025-10-12" },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Posts</h2>
      <ul className="space-y-3">
        {dummyPosts.map((p) => (
          <li
            key={p.id}
            className="border rounded-lg p-3 hover:bg-muted/30 transition"
          >
            <h3 className="font-medium">{p.title}</h3>
            <p className="text-xs text-muted-foreground">{p.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

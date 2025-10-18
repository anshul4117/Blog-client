import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";


export default function CreatePost() {
  const [form, setForm] = useState({ title: "", content: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Post:", form);
    alert("Post created (mock) ✅");
    setForm({ title: "", content: "" });
  };

  return (
    <div className="space-y-4 max-w-xl">
      <h2 className="text-xl font-semibold">Create a New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          name="title"
          placeholder="Post title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <Textarea
          name="content"
          placeholder="Write something..."
          rows={6}
          value={form.content}
          onChange={handleChange}
          required
        />
        <Button type="submit">Publish</Button>
      </form>
    </div>
  );
}

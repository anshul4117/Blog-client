import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import API from '../../../lib/api.js';


export default function CreatePost() {
  const [form, setForm] = useState({ title: "", content: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    API.post("/blogs/create", form)
      .then((res) => {
        alert("Post created ✅");
        setForm({ title: "", content: "" });
      })
      .catch((err) => alert(err.response?.data?.message || "Failed to create post ❌"));
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

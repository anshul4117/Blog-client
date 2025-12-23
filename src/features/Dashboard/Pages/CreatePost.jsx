import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import API from '../../../lib/secureApi.js';
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition.jsx";
import { Card, CardContent } from "@/components/ui/card";

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

export default function CreatePost() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = async (data) => {
    try {
      await API.post("/blogs/create", data);
      alert("Post created ✅");
      reset();
      navigate("/dashboard/posts");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create post ❌");
    }
  };

  return (
    <PageTransition className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
        <p className="text-muted-foreground mt-1">
          Share your thoughts with the world.
        </p>
      </div>

      <Card className="border-border/50 shadow-md">
        <CardContent className="p-6 pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base">Title</Label>
              <Input
                id="title"
                placeholder="Enter an engaging title..."
                className="text-lg py-6"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-base">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your story here..."
                rows={12}
                className="resize-none leading-relaxed"
                {...register("content")}
              />
              {errors.content && (
                <p className="text-red-500 text-sm">{errors.content.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto min-w-[150px]">
                {isSubmitting ? "Publishing..." : "Publish Post"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageTransition>
  );
}

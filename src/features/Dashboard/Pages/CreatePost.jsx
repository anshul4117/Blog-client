import { useForm, useWatch } from "react-hook-form";
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
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Type, Hash, Sparkles, Eye, Send, ArrowLeft } from "lucide-react";
import PostCard from "@/components/blog/PostCard";
import { useAuth } from "@/context/AuthContext";

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  tags: z.string().optional(),
});

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
        title: "",
        content: "",
        tags: ""
    }
  });

  const watchedValues = useWatch({ control });

  const onSubmit = async (data) => {
    try {
      // Split tags by comma
      const formattedData = {
          ...data,
          tags: data.tags ? data.tags.split(',').map(t => t.trim()) : []
      };
      await API.post("/blogs/create", formattedData);
      reset();
      navigate("/dashboard/posts");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create post ❌");
    }
  };

  const previewPost = {
      _id: "preview",
      title: watchedValues.title || "Post Title Preview",
      content: watchedValues.content || "Your story will appear here as you type...",
      author: user,
      createdAt: new Date().toISOString(),
      image: { url: "" },
      tags: typeof watchedValues.tags === 'string' ? watchedValues.tags.split(',').map(t => t.trim()) : []
  };

  return (
    <PageTransition className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Editor Side */}
        <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 hover:bg-primary/10 rounded-xl">
                    <ArrowLeft size={18} /> Back
                </Button>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                    <Sparkles size={12} /> Composition Mode
                </div>
            </div>

            <div>
                <h1 className="text-4xl font-extrabold tracking-tighter">Draft Your <span className="text-gradient">Masterpiece</span></h1>
                <p className="text-muted-foreground mt-2">Every word counts. Craft something unforgettable.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                    {/* Image Placeholder Dropzone */}
                    <motion.div 
                        whileHover={{ scale: 1.01 }}
                        className="h-48 rounded-[32px] border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-primary/40 transition-all"
                    >
                        <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                            <ImagePlus size={32} />
                        </div>
                        <p className="text-sm font-bold text-muted-foreground">Drop a cover image or click to browse</p>
                    </motion.div>

                    <div className="space-y-4">
                        <div className="relative">
                            <Label htmlFor="title" className="absolute -top-2.5 left-4 px-2 bg-background text-[10px] font-black uppercase tracking-[0.2em] text-primary z-10">Title</Label>
                            <Input
                                id="title"
                                placeholder="The title of your next big idea..."
                                className="h-16 text-xl font-bold rounded-2xl border-primary/10 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-muted/20"
                                {...register("title")}
                            />
                            {errors.title && (
                                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs font-bold mt-2 ml-2">{errors.title.message}</motion.p>
                            )}
                        </div>

                        <div className="relative">
                            <Label htmlFor="tags" className="absolute -top-2.5 left-4 px-2 bg-background text-[10px] font-black uppercase tracking-[0.2em] text-primary z-10">Tags (comma separated)</Label>
                            <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    id="tags"
                                    placeholder="design, coding, lifestyle"
                                    className="h-14 pl-12 rounded-2xl border-primary/10 focus:border-primary transition-all bg-muted/20"
                                    {...register("tags")}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <Label htmlFor="content" className="absolute -top-2.5 left-4 px-2 bg-background text-[10px] font-black uppercase tracking-[0.2em] text-primary z-10">Story Content</Label>
                            
                            {/* Toolbar Placeholder */}
                            <div className="absolute top-4 right-4 z-10 flex gap-1 p-1 rounded-xl glass-panel border-primary/10">
                                <Button type="button" size="icon" variant="ghost" className="h-8 w-8 rounded-lg"><Type size={14} /></Button>
                                <Button type="button" size="icon" variant="ghost" className="h-8 w-8 rounded-lg font-serif">B</Button>
                                <Button type="button" size="icon" variant="ghost" className="h-8 w-8 rounded-lg font-serif italic">i</Button>
                            </div>

                            <Textarea
                                id="content"
                                placeholder="Start writing your story here..."
                                rows={15}
                                className="rounded-[32px] border-primary/10 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-muted/20 p-6 pt-12 resize-none leading-relaxed text-lg"
                                {...register("content")}
                            />
                            {errors.content && (
                                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs font-bold mt-2 ml-2">{errors.content.message}</motion.p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button 
                        type="submit" 
                        size="lg" 
                        disabled={isSubmitting} 
                        className="flex-1 h-16 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all gap-3"
                    >
                        {isSubmitting ? "Publishing..." : <><Send size={18} /> Publish Story</>}
                    </Button>
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="lg" 
                        className="h-16 rounded-2xl px-8 border-primary/10 hover:bg-primary/5 font-bold"
                    >
                        Save Draft
                    </Button>
                </div>
            </form>
        </div>

        {/* Preview Side */}
        <div className="hidden lg:block w-[400px] shrink-0 sticky top-32 h-fit">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Eye size={18} className="text-primary" />
                    <span className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Live Preview</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
            </div>
            
            <div className="scale-90 origin-top">
                <AnimatePresence mode="wait">
                    <PostCard post={previewPost} index={1} />
                </AnimatePresence>
            </div>

            <div className="mt-8 p-6 rounded-[32px] glass-panel border-dashed border-primary/20">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">SEO Insights</h4>
                <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Reading Time</span>
                        <span className="font-bold">{Math.ceil(watchedValues.content?.split(' ').length / 200) || 0} min</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Word Count</span>
                        <span className="font-bold">{watchedValues.content?.split(' ').filter(x => x.length > 0).length || 0} words</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </PageTransition>
  );
}

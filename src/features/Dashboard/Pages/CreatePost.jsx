import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import API from '../../../lib/secureApi.js';
import { initMockDb } from "../../../lib/mockDb.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition.jsx";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Type, Hash, Sparkles, Eye, Send, ArrowLeft, Trash2, Check, AlertTriangle } from "lucide-react";
import PostCard from "@/components/blog/PostCard";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  tags: z.string().optional(),
});

export default function CreatePost() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const { user } = useAuth();
  const [coverImage, setCoverImage] = useState(null);
  const [isDraftsDialogOpen, setIsDraftsDialogOpen] = useState(false);

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

  const [drafts, setDrafts] = useState([]);

  const fetchDrafts = () => {
    try {
      initMockDb();
      const stored = JSON.parse(localStorage.getItem("mock_db_drafts") || "[]");
      setDrafts(stored);
    } catch {
      setDrafts([]);
    }
  };

  useEffect(() => {
    fetchDrafts();
    if (draftId) {
      try {
        const storedDrafts = JSON.parse(localStorage.getItem("mock_db_drafts") || "[]");
        const existingDraft = storedDrafts.find(d => d._id === draftId);
        if (existingDraft) {
          reset({
            title: existingDraft.title || "",
            content: existingDraft.content || "",
            tags: existingDraft.tags || ""
          });
          setCoverImage(existingDraft.image || null);
        }
      } catch (err) {
        console.error("Error loading draft:", err);
      }
    }
  }, [draftId, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("coverImageInput")?.click();
  };

  const removeCoverImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCoverImage(null);
    const input = document.getElementById("coverImageInput");
    if (input) input.value = "";
  };

  const startNewPost = () => {
    reset({ title: "", content: "", tags: "" });
    setCoverImage(null);
    navigate("/dashboard/create");
  };

  const saveDraft = () => {
    const titleVal = watchedValues.title;
    const contentVal = watchedValues.content;
    const tagsVal = watchedValues.tags;

    if (!titleVal && !contentVal) {
      toast.error("Please provide at least a title or some content to save a draft. ⚠️");
      return;
    }

    try {
      const storedDrafts = JSON.parse(localStorage.getItem("mock_db_drafts") || "[]");
      const draftData = {
        _id: draftId || "draft-" + Date.now(),
        title: titleVal || "",
        content: contentVal || "",
        tags: tagsVal || "",
        image: coverImage || "",
        updatedAt: new Date().toISOString()
      };

      let updatedDrafts;
      if (draftId) {
        updatedDrafts = storedDrafts.map(d => d._id === draftId ? draftData : d);
      } else {
        updatedDrafts = [draftData, ...storedDrafts];
      }

      localStorage.setItem("mock_db_drafts", JSON.stringify(updatedDrafts));
      fetchDrafts();
      toast.success("Draft saved successfully! 📝");
      reset({ title: "", content: "", tags: "" });
      setCoverImage(null);
      navigate("/dashboard/create");
    } catch (err) {
      console.error("Error saving draft:", err);
      toast.error("Failed to save draft. ❌");
    }
  };

  const onSubmit = async (data) => {
    try {
      const formattedData = {
          ...data,
          tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
          image: coverImage
      };
      await API.post("/blogs/create", formattedData);
      
      // If publishing a draft, remove it from drafts
      if (draftId) {
        try {
          const storedDrafts = JSON.parse(localStorage.getItem("mock_db_drafts") || "[]");
          const filteredDrafts = storedDrafts.filter(d => d._id !== draftId);
          localStorage.setItem("mock_db_drafts", JSON.stringify(filteredDrafts));
        } catch (e) {
          console.error("Failed to clean up draft:", e);
        }
      }

      toast.success("Publication posted successfully! 🚀");
      reset();
      setCoverImage(null);
      navigate("/dashboard/posts");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post ❌");
    }
  };

  const previewPost = {
      _id: "preview",
      title: watchedValues.title || "Post Title Preview",
      content: watchedValues.content || "Your story will appear here as you type...",
      author: user,
      createdAt: new Date().toISOString(),
      image: coverImage || { url: "" },
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
                <div className="flex items-center gap-2">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setIsDraftsDialogOpen(true)}
                      className="lg:hidden flex items-center gap-1.5 h-8 px-3 rounded-xl border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider"
                    >
                      <Sparkles size={12} className="animate-pulse" /> Drafts ({drafts.length})
                    </Button>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                        <Sparkles size={12} /> Composition Mode
                    </div>
                </div>
            </div>

            <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tighter">Draft Your <span className="text-gradient">Masterpiece</span></h1>
                <p className="text-muted-foreground mt-2">Every word counts. Craft something unforgettable.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                    {/* Image Attachment Dropzone */}
                    <div className="space-y-2">
                        <input
                            type="file"
                            id="coverImageInput"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        {coverImage ? (
                            <div className="relative h-44 sm:h-56 rounded-[24px] sm:rounded-[32px] overflow-hidden border border-primary/20 group">
                                <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3">
                                    <Button type="button" onClick={triggerFileInput} variant="outline" className="text-white border-white/40 hover:bg-white/20">Change Image</Button>
                                    <Button type="button" onClick={removeCoverImage} variant="destructive">Remove</Button>
                                </div>
                            </div>
                        ) : (
                            <div onClick={triggerFileInput}>
                                <motion.div 
                                    whileHover={{ scale: 1.01 }}
                                    className="h-36 sm:h-48 rounded-[24px] sm:rounded-[32px] border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center gap-2 sm:gap-3 group cursor-pointer hover:border-primary/40 transition-all p-4 text-center"
                                >
                                    <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform shrink-0">
                                        <ImagePlus size={24} className="sm:w-8 sm:h-8" />
                                    </div>
                                    <p className="text-xs sm:text-sm font-bold text-muted-foreground px-2">Drop a cover image or click to browse</p>
                                </motion.div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <Label htmlFor="title" className="absolute -top-2.5 left-4 px-2 bg-background text-[10px] font-black uppercase tracking-[0.2em] text-primary z-10">Title</Label>
                            <Input
                                id="title"
                                placeholder="The title of your next big idea..."
                                className="h-13 sm:h-16 text-base sm:text-xl font-bold rounded-xl sm:rounded-2xl border-primary/10 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-muted/20"
                                {...register("title")}
                            />
                            {errors.title && (
                                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs font-bold mt-2 ml-2">{errors.title.message}</motion.p>
                            )}
                        </div>

                        <div className="relative">
                            <Label htmlFor="tags" className="absolute -top-2.5 left-4 px-2 bg-background text-[10px] font-black uppercase tracking-[0.2em] text-primary z-10">Tags (comma separated)</Label>
                            <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <Input
                                    id="tags"
                                    placeholder="design, coding, lifestyle"
                                    className="h-11 sm:h-14 pl-10 sm:pl-12 text-sm sm:text-base rounded-xl sm:rounded-2xl border-primary/10 focus:border-primary transition-all bg-muted/20"
                                    {...register("tags")}
                                />
                            </div>
                        </div>

                        <div className="relative rounded-[24px] sm:rounded-[32px] border border-primary/10 bg-muted/20 flex flex-col focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all pt-4">
                            <Label htmlFor="content" className="absolute -top-2.5 left-4 px-2 bg-background text-[10px] font-black uppercase tracking-[0.2em] text-primary z-10">Story Content</Label>
                            
                            <Textarea
                                id="content"
                                placeholder="Start writing your story here..."
                                rows={12}
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-none focus:ring-0 focus:outline-none bg-transparent p-4 sm:p-6 resize-none leading-relaxed text-sm sm:text-lg shadow-none rounded-[23px] sm:rounded-[31px]"
                                {...register("content")}
                            />
                        </div>
                        {errors.content && (
                            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs font-bold mt-2 ml-2">{errors.content.message}</motion.p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <Button 
                        type="submit" 
                        size="lg" 
                        disabled={isSubmitting} 
                        className="flex-1 h-13 sm:h-16 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all gap-3 text-sm sm:text-base"
                    >
                        {isSubmitting ? "Publishing..." : <><Send size={18} /> Publish Story</>}
                    </Button>
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="lg" 
                        onClick={saveDraft}
                        className="h-13 sm:h-16 rounded-xl sm:rounded-2xl px-8 border-primary/10 hover:bg-primary/5 font-bold text-sm sm:text-base cursor-pointer"
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

            {/* Active Drafts Widget */}
            <div className="mt-8 p-6 rounded-[32px] glass-panel border border-primary/10">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center justify-between">
                    <span>Active Drafts ({drafts.length})</span>
                    <Sparkles size={14} className="text-primary animate-pulse" />
                </h4>
                {drafts.length === 0 ? (
                    <p className="text-xs text-muted-foreground/60 italic">No saved drafts available.</p>
                ) : (
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                        {drafts.map((d) => (
                            <div 
                                key={d._id} 
                                onClick={() => navigate(`/dashboard/create?draftId=${d._id}`)}
                                className={`p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                                    draftId === d._id 
                                        ? "bg-primary/15 border-primary/40 shadow-inner" 
                                        : "bg-muted/10 border-primary/5 hover:border-primary/20 hover:bg-primary/5"
                                }`}
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <p className="font-extrabold text-xs truncate leading-tight text-foreground flex-1">{d.title || "Untitled Draft"}</p>
                                    {draftId === d._id && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1" />}
                                </div>
                                <p className="text-[9px] text-muted-foreground/60 mt-1 font-semibold">
                                    Saved {new Date(d.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
                {draftId && (
                    <Button 
                        type="button" 
                        onClick={startNewPost}
                        className="w-full mt-4 h-10 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary/10 text-primary border border-primary/10 hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                        Create New Draft +
                    </Button>
                )}
            </div>
        </div>
      </div>

      <Dialog open={isDraftsDialogOpen} onOpenChange={setIsDraftsDialogOpen}>
        <DialogContent className="glass-panel border-primary/15 max-w-md w-[90%] rounded-[32px] p-6 bg-background/95 backdrop-blur-xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-extrabold tracking-tighter flex items-center gap-2">
              <Sparkles size={18} className="text-primary animate-pulse" /> Active Drafts ({drafts.length})
            </DialogTitle>
          </DialogHeader>
          {drafts.length === 0 ? (
            <p className="text-sm text-muted-foreground/60 italic text-center py-6">No saved drafts available.</p>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
              {drafts.map((d) => (
                <div 
                  key={d._id} 
                  onClick={() => {
                    navigate(`/dashboard/create?draftId=${d._id}`);
                    setIsDraftsDialogOpen(false);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                    draftId === d._id 
                      ? "bg-primary/15 border-primary/40 shadow-inner" 
                      : "bg-muted/10 border-primary/5 hover:border-primary/20 hover:bg-primary/5"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-extrabold text-sm truncate leading-tight text-foreground flex-1">{d.title || "Untitled Draft"}</p>
                    {draftId === d._id && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 mt-1.5 font-semibold">
                    Saved {new Date(d.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          )}
          {draftId ? (
            <Button 
              type="button" 
              onClick={() => {
                startNewPost();
                setIsDraftsDialogOpen(false);
              }}
              className="w-full mt-4 h-12 rounded-xl font-bold uppercase tracking-wider text-xs bg-primary/10 text-primary border border-primary/10 hover:bg-primary hover:text-primary-foreground transition-all"
            >
              Create New Draft +
            </Button>
          ) : null}
        </DialogContent>
      </Dialog>

    </PageTransition>
  );
}

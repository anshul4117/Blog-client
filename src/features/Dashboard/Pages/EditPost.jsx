import { useState, useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import API from '../../../lib/secureApi.js';
import { useNavigate, useParams } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition.jsx";
import BackgroundMesh from "@/components/ui/BackgroundMesh.jsx";
import { motion } from "framer-motion";
import { 
  ImagePlus, Sparkles, Save, ArrowLeft, Loader2, Hash, FileText, Globe, Layers, 
  Bold, Italic, Quote, Code, List, Eye, Heading1, Heading2, Link2, Activity, RotateCcw
} from "lucide-react";
import PostCard from "@/components/blog/PostCard";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTagsInput, setShowTagsInput] = useState(false);
  const [tagsList, setTagsList] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const contentRef = useRef(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: ""
    }
  });

  const watchedValues = useWatch({ control });

  // Fetch existing post data and populate form
  const fetchPost = () => {
    setLoading(true);
    setNotFound(false);
    API.get(`/blogs/post/${id}`)
      .then((res) => {
        const post = res.data.blog || res.data?.data?.blog || res.data;
        if (post) {
          reset({
            title: post.title || "",
            content: post.content || ""
          });
          
          const initialTags = post.tags 
            ? (Array.isArray(post.tags) 
                ? post.tags 
                : typeof post.tags === "string" 
                  ? post.tags.split(",").map(t => t.trim()).filter(Boolean)
                  : [])
            : [];
          setTagsList(initialTags);
          if (initialTags.length > 0) {
            setShowTagsInput(true);
          }
          setCoverImage(post.image?.url || post.coverImage || post.image || null);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPost();
  }, [id, reset]);

  // Image Upload Handlers
  const handleImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImage(reader.result);
      toast.success("Cover image updated ✨");
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    handleImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleImageFile(file);
  };

  const triggerFileInput = () => {
    document.getElementById("coverImageInput")?.click();
  };

  const removeCoverImage = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCoverImage(null);
    const input = document.getElementById("coverImageInput");
    if (input) input.value = "";
    toast.success("Cover image removed");
  };

  // Tag Handlers
  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/,/g, "");
      if (cleaned && !tagsList.includes(cleaned)) {
        setTagsList([...tagsList, cleaned]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTagsList(tagsList.filter((_, idx) => idx !== indexToRemove));
  };

  // Markdown Formatting Helper
  const insertMarkdown = (syntax, placeholder = "text") => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    let replacement = "";
    if (syntax === "h1") {
      replacement = `\n# ${selectedText || placeholder}\n`;
    } else if (syntax === "h2") {
      replacement = `\n## ${selectedText || placeholder}\n`;
    } else if (syntax === "bold") {
      replacement = `**${selectedText || placeholder}**`;
    } else if (syntax === "italic") {
      replacement = `*${selectedText || placeholder}*`;
    } else if (syntax === "link") {
      replacement = `[${selectedText || "Link Title"}](https://example.com)`;
    } else if (syntax === "quote") {
      replacement = `\n> ${selectedText || placeholder}\n`;
    } else if (syntax === "code") {
      replacement = `\n\`\`\`javascript\n${selectedText || placeholder}\n\`\`\`\n`;
    } else if (syntax === "list") {
      replacement = `\n- ${selectedText || placeholder}\n`;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    
    setValue("content", newValue, { shouldValidate: true, shouldDirty: true });

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Submit Handler
  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        tags: tagsList,
        image: coverImage
      };
      await API.patch(`/blogs/edit/${id}`, formattedData);
      toast.success("Publication updated successfully! 📝");
      window.dispatchEvent(new Event("blog-deleted")); // Refresh feeds
      navigate("/dashboard/posts");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update post ❌");
    }
  };

  // Readability & Stats calculations
  const getReadabilityScore = () => {
    const text = watchedValues.content || "";
    const words = text.split(/\s+/).filter(x => x.length > 0).length;
    const paragraphs = text.split(/\n+/).filter(x => x.trim().length > 0).length;
    if (words === 0) return 0;
    if (words < 15) return 20;
    if (words < 50) return 45;
    if (words < 150) return 75;
    return Math.min(100, 80 + Math.floor(words / 100) + (paragraphs >= 3 ? 10 : 0));
  };

  const readabilityScore = getReadabilityScore();
  const wordsCount = (watchedValues.content || "").split(/\s+/).filter(x => x.length > 0).length || 0;
  const readingTime = Math.max(1, Math.ceil(wordsCount / 200));

  const charLimit = 280;
  const currentChars = (watchedValues.content || "").length;
  const charPercent = Math.min(100, (currentChars / charLimit) * 100);

  const charRadius = 10;
  const charCircumference = 2 * Math.PI * charRadius;
  const charDashoffset = charCircumference - (charPercent / 100) * charCircumference;

  // Preview Post Object
  const previewPost = {
    _id: id,
    title: watchedValues.title || "Post Title Preview",
    content: watchedValues.content || "Your updated story will appear here...",
    author: user || { name: "Demo User", username: "demouser" },
    createdAt: new Date().toISOString(),
    image: coverImage || null,
    tags: tagsList,
    likes: [],
    likeCount: 0,
    commentCount: 0
  };

  const { ref: hookFormContentRef, ...contentRest } = register("content");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg shadow-primary/20"></div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Loading Signal Data...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="p-8 sm:p-12 text-center glass-panel rounded-[36px] border-primary/15 bg-primary/5 max-w-md w-full space-y-5 shadow-2xl">
          <div className="h-16 w-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto border border-primary/20">
            <Activity size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-foreground">Signal Not Found</h3>
            <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">
              The publication you are trying to edit could not be loaded.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              onClick={fetchPost}
              className="h-11 px-5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider gap-2 shadow-lg shadow-primary/20 cursor-pointer"
            >
              <RotateCcw size={15} /> Retry
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard/posts")}
              className="h-11 px-5 rounded-2xl font-bold text-xs uppercase tracking-wider border-primary/20 hover:bg-primary/5 cursor-pointer"
            >
              Back to Posts
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition className="relative min-h-screen w-full flex items-center justify-center py-6 sm:py-10 px-3 sm:px-4 max-w-4xl mx-auto overflow-hidden">
      <BackgroundMesh />
      
      {/* Primary Publisher Container */}
      <div className="max-w-[680px] w-full rounded-[32px] bg-background/60 backdrop-blur-2xl border border-primary/15 p-5 sm:p-8 shadow-2xl relative">
        
        {/* Navigation & Header Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/10 gap-2 flex-wrap">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="h-8 px-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-primary/10 gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={13} /> Back
          </Button>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              <Globe size={11} /> Editing Mode
            </span>
            <span className="text-[9px] font-bold text-muted-foreground/60 hidden sm:inline">
              {isDirty ? "• Unsaved changes" : "• Synced"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
              className="h-8 px-3 rounded-xl border-primary/20 text-xs font-extrabold gap-1.5 hover:bg-primary/10 cursor-pointer"
            >
              <Eye size={14} /> Preview
            </Button>
          </div>
        </div>

        {/* Input file uploader */}
        <input
          type="file"
          id="coverImageInput"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Author info header */}
          <div className="flex items-start gap-3.5">
            <div className="h-11 w-11 rounded-full overflow-hidden border border-primary/15 shrink-0 shadow-inner">
              <img 
                src={user?.profilePicture || user?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                className="w-full h-full object-cover" 
                alt="profile" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-black text-foreground truncate">{user?.name || "Demo User"}</span>
                <span className="text-[11px] text-muted-foreground/60 font-semibold truncate">@{user?.username || "demouser"}</span>
              </div>
              <p className="text-[9px] text-primary/70 font-black uppercase tracking-widest mt-0.5">Editing Existing Broadcast</p>
            </div>
          </div>

          <div className="pl-0 sm:pl-14 space-y-4">
            
            {/* Title field */}
            <div className="relative">
              <input
                type="text"
                placeholder="Publication title..."
                className="w-full bg-transparent border-none text-xl sm:text-2xl font-black placeholder-muted-foreground/35 focus:outline-none focus-visible:ring-0 focus:ring-0 outline-none p-0 text-foreground"
                {...register("title")}
              />
              {errors.title && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[10px] font-bold mt-1">{errors.title.message}</motion.p>
              )}
            </div>

            {/* Tags Pill Manager */}
            {(showTagsInput || tagsList.length > 0) && (
              <div className="flex flex-wrap gap-1.5 items-center p-2.5 rounded-2xl bg-muted/10 border border-primary/10 focus-within:border-primary/20 transition-all">
                {tagsList.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/10"
                  >
                    <span>#{tag}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(idx)} 
                      aria-label="Remove tag"
                      className="text-primary/60 hover:text-red-500 transition-colors cursor-pointer text-[10px] ml-1"
                    >
                      ✕
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add hashtag (Enter or comma)..."
                  className="flex-1 min-w-[120px] bg-transparent border-none text-[11px] font-bold text-foreground outline-none placeholder-muted-foreground/40 p-0"
                />
              </div>
            )}

            {/* Content Field */}
            <div className="relative">
              <textarea
                id="content"
                placeholder="Edit content or format with Markdown..."
                rows={9}
                className="w-full bg-transparent border-none text-sm sm:text-base placeholder-muted-foreground/25 focus:outline-none focus-visible:ring-0 focus:ring-0 outline-none leading-relaxed p-0 text-foreground/90 resize-none no-scrollbar"
                {...contentRest}
                ref={(e) => {
                  hookFormContentRef(e);
                  contentRef.current = e;
                }}
              />
              {errors.content && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[10px] font-bold mt-1">{errors.content.message}</motion.p>
              )}
            </div>

            {/* Drag & Drop Cover Image Attachment Area */}
            {coverImage ? (
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-primary/15 group shadow-md">
                <img src={coverImage} alt="Cover attachment" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={triggerFileInput} 
                    className="h-8 px-3 rounded-xl bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 text-xs font-bold"
                  >
                    Replace Image
                  </Button>
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={removeCoverImage} 
                    className="h-8 px-3 rounded-xl bg-red-500/80 backdrop-blur-md text-white border border-red-500 hover:bg-red-600 text-xs font-bold"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5",
                  isDragging ? "border-primary bg-primary/10" : "border-primary/15 hover:border-primary/30 hover:bg-muted/10"
                )}
              >
                <ImagePlus size={20} className="text-primary/60" />
                <p className="text-xs font-bold text-foreground">Attach Cover Media</p>
                <p className="text-[10px] text-muted-foreground/60 font-medium">Click or drag & drop image file here</p>
              </div>
            )}

            {/* Bottom Actions & Markdown Toolbar Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-primary/10">
              
              {/* Media & Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1">
                
                <button 
                  type="button" 
                  onClick={triggerFileInput} 
                  title="Attach Cover Image"
                  aria-label="Attach cover image"
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition-all border cursor-pointer",
                    coverImage ? "text-primary border-primary/20 bg-primary/10" : "text-muted-foreground border-transparent hover:bg-primary/10"
                  )}
                >
                  <ImagePlus size={14} />
                </button>

                <button 
                  type="button" 
                  onClick={() => setShowTagsInput(!showTagsInput)} 
                  title="Add Tag pills"
                  aria-label="Add tags"
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition-all border cursor-pointer",
                    showTagsInput || tagsList.length > 0 ? "text-primary border-primary/20 bg-primary/10" : "text-muted-foreground border-transparent hover:bg-primary/10"
                  )}
                >
                  <Hash size={14} />
                </button>

                <div className="h-4 w-[1px] bg-primary/15 mx-1" />

                {[
                  { label: "Bold", syntax: "bold", icon: <Bold size={13} /> },
                  { label: "Italic", syntax: "italic", icon: <Italic size={13} /> },
                  { label: "Heading 1", syntax: "h1", icon: <Heading1 size={13} /> },
                  { label: "Heading 2", syntax: "h2", icon: <Heading2 size={13} /> },
                  { label: "Link", syntax: "link", icon: <Link2 size={13} /> },
                  { label: "Quote", syntax: "quote", icon: <Quote size={13} /> },
                  { label: "Code", syntax: "code", icon: <Code size={13} /> },
                  { label: "List", syntax: "list", icon: <List size={13} /> },
                ].map((tool) => (
                  <button
                    key={tool.syntax}
                    type="button"
                    onClick={() => insertMarkdown(tool.syntax)}
                    title={tool.label}
                    aria-label={tool.label}
                    className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/10 cursor-pointer"
                  >
                    {tool.icon}
                  </button>
                ))}
              </div>

              {/* Character Stats & Submission Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-3.5">
                
                <div className="flex items-center gap-2">
                  {/* Circular character progress SVG */}
                  <div className="relative flex items-center justify-center shrink-0 w-6 h-6" title={`${currentChars}/${charLimit} chars`}>
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="12" cy="12" r={charRadius} className="text-muted/20" strokeWidth="2" stroke="currentColor" fill="transparent" />
                      <motion.circle 
                        cx="12" 
                        cy="12" 
                        r={charRadius} 
                        className={cn(charPercent >= 90 ? "text-red-500" : "text-primary")}
                        strokeWidth="2" 
                        stroke="currentColor" 
                        fill="transparent" 
                        strokeDasharray={charCircumference}
                        animate={{ strokeDashoffset: charDashoffset }}
                        transition={{ duration: 0.2 }}
                      />
                    </svg>
                  </div>
                  
                  {/* Collapsible Drawer Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowSidebar(!showSidebar)}
                    title="Toggle Edit Insights"
                    className={cn(
                      "h-8 px-2.5 rounded-xl border flex items-center gap-1 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                      showSidebar 
                        ? "bg-primary/10 border-primary/20 text-primary" 
                        : "bg-muted/10 border-primary/10 text-muted-foreground hover:text-foreground hover:border-primary/20"
                    )}
                  >
                    <Layers size={13} /> Insights
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    type="submit"
                    disabled={isSubmitting} 
                    className="h-9 px-5 rounded-full bg-primary text-primary-foreground font-black text-[11px] uppercase tracking-widest hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <><Loader2 size={11} className="animate-spin" /> Updating...</>
                    ) : (
                      <><Save size={11} /> Save Changes</>
                    )}
                  </Button>
                </div>

              </div>

            </div>

          </div>

        </form>

      </div>

      {/* Slide-out Glass Side Drawer / Mobile Sheet */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full sm:w-[320px] bg-background/95 backdrop-blur-2xl border-l border-primary/10 z-50 p-6 shadow-2xl transition-transform duration-300 ease-out flex flex-col justify-start space-y-6",
        showSidebar ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-primary/10 shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
            <Sparkles size={13} className="animate-pulse" /> Publication Metrics
          </span>
          <button 
            type="button"
            onClick={() => setShowSidebar(false)} 
            className="text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
          >
            Close ✕
          </button>
        </div>

        {/* Analytics Quality Meter */}
        <div className="p-4 rounded-2xl bg-muted/10 border border-primary/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center shrink-0 w-12 h-12">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="18" className="text-muted/20" strokeWidth="3" stroke="currentColor" fill="transparent" />
                <motion.circle 
                  cx="24" 
                  cy="24" 
                  r="18" 
                  className="text-primary" 
                  strokeWidth="3" 
                  stroke="currentColor" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 18}
                  animate={{ strokeDashoffset: (2 * Math.PI * 18) - (readabilityScore / 100) * (2 * Math.PI * 18) }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </svg>
              <span className="absolute text-[10px] font-black tracking-tight text-foreground font-mono">{readabilityScore}%</span>
            </div>

            <div>
              <p className="text-[8px] font-black uppercase tracking-wider text-muted-foreground/60">Quality Meter</p>
              <p className="text-xs font-black text-foreground mt-0.5">
                {readabilityScore < 40 ? "Needs structure" : readabilityScore < 75 ? "Optimal signals" : "Senior quality"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-background/30 border border-primary/10">
              <p className="text-[8px] font-black uppercase tracking-wider text-muted-foreground/50">Word Count</p>
              <p className="text-xs font-black text-foreground mt-0.5 font-mono">{wordsCount}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-background/30 border border-primary/10">
              <p className="text-[8px] font-black uppercase tracking-wider text-muted-foreground/50">Reading Est.</p>
              <p className="text-xs font-black text-foreground mt-0.5 font-mono">{readingTime} min</p>
            </div>
          </div>
        </div>

        {/* Live Preview section */}
        <div className="flex-1 flex flex-col min-h-0 space-y-3">
          <div className="flex items-center justify-between shrink-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Live Preview</span>
            <Eye size={12} className="text-primary" />
          </div>
          <div className="scale-90 origin-top overflow-y-auto pr-1 no-scrollbar flex-1">
            <PostCard post={previewPost} index={1} />
          </div>
        </div>

      </div>

      {/* Live Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="glass-panel border-primary/15 max-w-2xl w-[95%] rounded-[32px] p-6 bg-background/95 backdrop-blur-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-black tracking-tight flex items-center gap-2">
              <Eye size={18} className="text-primary" /> Updated Publication Preview
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              This preview shows how your edited publication will render across the network.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 overflow-y-auto max-h-[60vh]">
            <PostCard post={previewPost} index={0} />
          </div>
        </DialogContent>
      </Dialog>

    </PageTransition>
  );
}

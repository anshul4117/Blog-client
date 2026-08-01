import { useState, useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import API from '../../../lib/secureApi.js';
import { initMockDb } from "../../../lib/mockDb.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition.jsx";
import BackgroundMesh from "@/components/ui/BackgroundMesh.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ImagePlus, Sparkles, Send, ArrowLeft, Hash, FileText
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

export default function CreatePost() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const { user } = useAuth();
  const [coverImage, setCoverImage] = useState(null);
  const [isDraftsDialogOpen, setIsDraftsDialogOpen] = useState(false);
  const [showTagsInput, setShowTagsInput] = useState(false);
  const [tagsList, setTagsList] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const contentRef = useRef(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
        title: "",
        content: ""
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
            content: existingDraft.content || ""
          });
          
          // Load tags properly
          const initialTags = existingDraft.tags 
            ? (Array.isArray(existingDraft.tags) 
                ? existingDraft.tags 
                : typeof existingDraft.tags === "string" 
                  ? existingDraft.tags.split(",").map(t => t.trim()).filter(Boolean)
                  : [])
            : [];
          setTagsList(initialTags);
          if (initialTags.length > 0) {
            setShowTagsInput(true);
          }
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
    reset({ title: "", content: "" });
    setTagsList([]);
    setCoverImage(null);
    setShowTagsInput(false);
    navigate("/dashboard/create");
  };

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

  // Helper function to inject Markdown tags
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
    } else if (syntax === "quote") {
      replacement = `\n> ${selectedText || placeholder}\n`;
    } else if (syntax === "code") {
      replacement = `\n\`\`\`javascript\n${selectedText || placeholder}\n\`\`\`\n`;
    } else if (syntax === "list") {
      replacement = `\n- ${selectedText || placeholder}\n`;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    
    setValue("content", newValue, { shouldValidate: true, shouldDirty: true });

    // Focus & position cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const saveDraft = () => {
    const titleVal = watchedValues.title;
    const contentVal = watchedValues.content;

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
        tags: tagsList,
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
      reset({ title: "", content: "" });
      setTagsList([]);
      setCoverImage(null);
      setShowTagsInput(false);
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
          tags: tagsList,
          image: coverImage
      };
      await API.post("/blogs/create", formattedData);
      
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
      reset({ title: "", content: "" });
      setTagsList([]);
      setCoverImage(null);
      setShowTagsInput(false);
      navigate("/dashboard/posts");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post ❌");
    }
  };

  // Compute readability rating based on length & tags
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
  const readingTime = Math.ceil(wordsCount / 200) || 0;

  // SVG Progress Circle configuration
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readabilityScore / 100) * circumference;

  // Merge hookform ref with custom contentRef
  const { ref: hookFormContentRef, ...contentRest } = register("content");

  return (
    <PageTransition className="relative min-h-screen w-full flex flex-col items-center justify-start py-8 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
      <BackgroundMesh />
      
      <div className="flex flex-col lg:flex-row gap-12 w-full justify-center">
        
        {/* Editor Main Canvas Sheet */}
        <div className="flex-1 max-w-[760px] w-full flex flex-col">
          
          <div className="w-full rounded-[36px] bg-background/40 backdrop-blur-md border border-primary/5 p-6 sm:p-10 shadow-2xl relative">
            
            {/* Contextual Notion-style Header Actions */}
            <div className="flex items-center gap-3 mb-6 border-b border-primary/5 pb-4">
              <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 hover:bg-primary/10 rounded-xl px-3 h-9 text-xs font-bold uppercase tracking-wider">
                <ArrowLeft size={14} /> Back
              </Button>
              
              <div className="ml-auto flex items-center gap-2">
                {!coverImage && (
                  <button 
                    type="button" 
                    onClick={triggerFileInput} 
                    className="text-xs font-black uppercase tracking-wider text-muted-foreground/60 hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary/5 cursor-pointer"
                  >
                    <ImagePlus size={14} /> Cover
                  </button>
                )}
                
                {!showTagsInput && tagsList.length === 0 && (
                  <button 
                    type="button" 
                    onClick={() => setShowTagsInput(true)} 
                    className="text-xs font-black uppercase tracking-wider text-muted-foreground/60 hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary/5 cursor-pointer"
                  >
                    <Hash size={14} /> Tags
                  </button>
                )}

                <div className="h-4 w-[1px] bg-primary/10 mx-1" />

                <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary/80 bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                  <Sparkles size={10} /> Compose
                </span>
              </div>
            </div>

            {/* Input file for Image cover */}
            <input
              type="file"
              id="coverImageInput"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            {/* Banner Cover Image Display */}
            {coverImage && (
              <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden border border-primary/10 group mb-6 shadow-md">
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2.5">
                  <button type="button" onClick={triggerFileInput} className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer">Change</button>
                  <button type="button" onClick={removeCoverImage} className="px-4 py-2 bg-red-500/85 hover:bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer">Remove</button>
                </div>
              </div>
            )}

            {/* Floating Markdown Helper Bar inside Canvas */}
            <div className="flex items-center justify-between border-b border-primary/5 pb-3.5 mb-6">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/20 border border-primary/5">
                {[
                  { label: "Heading 1", syntax: "h1", icon: <span className="font-extrabold text-[10px] font-mono">H1</span> },
                  { label: "Heading 2", syntax: "h2", icon: <span className="font-extrabold text-[10px] font-mono">H2</span> },
                  { label: "Bold", syntax: "bold", icon: <span className="font-black text-xs font-mono">B</span> },
                  { label: "Italic", syntax: "italic", icon: <span className="italic font-bold text-xs font-mono">I</span> },
                  { label: "Quote", syntax: "quote", icon: <span className="font-black text-xs">”</span> },
                  { label: "Code", syntax: "code", icon: <span className="font-mono text-[9px]">&lt;/&gt;</span> },
                  { label: "List", syntax: "list", icon: <span className="font-black text-xs">•</span> },
                ].map((tool) => (
                  <button
                    key={tool.syntax}
                    type="button"
                    onClick={() => insertMarkdown(tool.syntax)}
                    title={tool.label}
                    className="h-7.5 w-7.5 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/5 cursor-pointer"
                  >
                    {tool.icon}
                  </button>
                ))}
              </div>
              
              <button 
                type="button"
                onClick={() => setIsDraftsDialogOpen(true)}
                className="lg:hidden flex items-center gap-1.5 h-8 px-3 rounded-xl border border-primary/10 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-wider hover:bg-primary/10 transition-colors cursor-pointer"
              >
                Drafts ({drafts.length})
              </button>
            </div>

            {/* Immersive Inputs (Title and Content) */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Title Canvas */}
              <div className="relative">
                <textarea
                  rows={1}
                  id="title"
                  placeholder="Give your story a title..."
                  className="w-full bg-transparent border-none text-3xl sm:text-5xl font-black placeholder-muted-foreground/20 focus:outline-none focus-visible:ring-0 focus:ring-0 outline-none leading-tight shadow-none p-0 text-foreground resize-none font-sans"
                  {...register("title")}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                />
                {errors.title && (
                  <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs font-bold mt-2">{errors.title.message}</motion.p>
                )}
              </div>

              {/* Tag pills composer (Fades in dynamically) */}
              {(showTagsInput || tagsList.length > 0) && (
                <div className="flex flex-wrap gap-2 items-center p-3 rounded-2xl bg-muted/10 border border-primary/5 focus-within:border-primary/10 focus-within:ring-2 focus-within:ring-primary/5 transition-all">
                  {tagsList.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/10"
                    >
                      <span>#{tag}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(idx)} 
                        className="text-primary/60 hover:text-red-500 transition-colors cursor-pointer text-[10px]"
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
                    placeholder="Add tag..."
                    className="flex-1 min-w-[100px] bg-transparent border-none text-xs font-bold text-foreground outline-none placeholder-muted-foreground/30"
                  />
                  {tagsList.length === 0 && (
                    <button 
                      type="button" 
                      onClick={() => setShowTagsInput(false)} 
                      className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/45 hover:text-foreground cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}

              <div className="h-[1px] w-full bg-primary/5 my-4" />

              {/* Content Canvas */}
              <div className="relative">
                <textarea
                  id="content"
                  placeholder="Start broadcasting your signal into the void..."
                  rows={14}
                  className="w-full bg-transparent border-none text-sm sm:text-base md:text-lg placeholder-muted-foreground/20 focus:outline-none focus-visible:ring-0 focus:ring-0 outline-none leading-relaxed shadow-none p-0 text-foreground/90 resize-none mt-2 no-scrollbar"
                  {...contentRest}
                  ref={(e) => {
                    hookFormContentRef(e);
                    contentRef.current = e;
                  }}
                />
                {errors.content && (
                  <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs font-bold mt-2">{errors.content.message}</motion.p>
                )}
              </div>

              {/* Mobile Publish Buttons */}
              <div className="lg:hidden flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 border-t border-primary/5">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all gap-2 text-xs"
                >
                  {isSubmitting ? "Publishing..." : <><Send size={14} /> Publish Story</>}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={saveDraft}
                  className="h-12 rounded-xl px-6 border-primary/15 hover:bg-primary/5 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Save Draft
                </Button>
              </div>

            </form>
          </div>
        </div>

        {/* Figma-style Inspector Panel (Right side) */}
        <div className="hidden lg:block w-[320px] shrink-0 sticky top-28 space-y-6 h-fit">
          
          {/* Section 1: Publish Commands */}
          <div className="p-6 rounded-[28px] bg-background/40 backdrop-blur-md border border-primary/5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Publish Protocol</span>
            </div>
            
            <div className="space-y-2.5">
              <Button 
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                {isSubmitting ? "Publishing..." : <><Send size={14} /> Publish Story</>}
              </Button>
              
              <Button 
                type="button" 
                onClick={saveDraft}
                className="w-full h-12 rounded-xl bg-muted/20 border border-primary/10 hover:bg-primary/5 text-foreground font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
              >
                Save Draft
              </Button>
            </div>
          </div>

          {/* Section 2: Real-time SVG Circular Score Analysis */}
          <div className="p-6 rounded-[28px] bg-background/40 backdrop-blur-md border border-primary/5 shadow-xl">
            <div className="flex items-center gap-4">
              
              {/* SVG Circular progress */}
              <div className="relative flex items-center justify-center shrink-0 w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r={radius} className="text-muted/10" strokeWidth="4" stroke="currentColor" fill="transparent" />
                  <motion.circle 
                    cx="32" 
                    cy="32" 
                    r={radius} 
                    className="text-primary" 
                    strokeWidth="4" 
                    stroke="currentColor" 
                    fill="transparent" 
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </svg>
                <span className="absolute text-xs font-black tracking-tighter text-foreground font-mono">{readabilityScore}%</span>
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/50">Readability Index</p>
                <p className="text-xs font-black text-foreground mt-0.5">
                  {readabilityScore < 40 ? "Needs structure" : readabilityScore < 75 ? "Optimal signals" : "Senior grade quality"}
                </p>
                <p className="text-[9px] text-muted-foreground/60 leading-tight mt-0.5">
                  {readabilityScore < 40 
                    ? "Start writing words." 
                    : readabilityScore < 75 
                      ? "Good length, keep going." 
                      : "Masterfully structured."}
                </p>
              </div>
            </div>

            <div className="h-[1px] w-full bg-primary/5 my-4" />

            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-3 rounded-2xl bg-muted/10 border border-primary/5 text-center">
                <p className="text-[8px] font-black uppercase tracking-wider text-muted-foreground/50">Word Count</p>
                <p className="text-sm font-black text-foreground mt-0.5 font-mono">
                  {wordsCount}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-muted/10 border border-primary/5 text-center">
                <p className="text-[8px] font-black uppercase tracking-wider text-muted-foreground/50">Reading Est.</p>
                <p className="text-sm font-black text-foreground mt-0.5 font-mono">
                  {readingTime} <span className="text-[8px] text-muted-foreground/50 font-sans font-bold">MIN</span>
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Draft Manager Cards */}
          <div className="p-6 rounded-[28px] bg-background/40 backdrop-blur-md border border-primary/5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Active Drafts ({drafts.length})</span>
              <FileText size={12} className="text-primary" />
            </div>

            {drafts.length === 0 ? (
              <p className="text-xs text-muted-foreground/40 italic py-2">No drafts found.</p>
            ) : (
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                {drafts.map((d) => (
                  <div 
                    key={d._id} 
                    onClick={() => navigate(`/dashboard/create?draftId=${d._id}`)}
                    className={cn(
                      "p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex gap-2.5 items-center",
                      draftId === d._id 
                        ? "bg-primary/10 border-primary/30" 
                        : "bg-muted/10 border-primary/5 hover:border-primary/20 hover:bg-primary/5"
                    )}
                  >
                    {d.image && (
                      <img src={d.image} className="w-8 h-8 rounded-lg object-cover border border-primary/5 shrink-0" alt="cover" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold text-[11px] truncate leading-tight text-foreground">{d.title || "Untitled Draft"}</p>
                      <p className="text-[9px] text-muted-foreground/60 mt-0.5 font-mono">
                        {new Date(d.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {draftId && (
              <Button 
                type="button" 
                onClick={startNewPost}
                className="w-full h-10 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary/10 text-primary border border-primary/10 hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Create New Draft +
              </Button>
            )}
          </div>

        </div>
      </div>

      {/* Dialog for mobile drafts view */}
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

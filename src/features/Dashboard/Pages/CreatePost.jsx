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
import { motion, AnimatePresence } from "framer-motion";
import { 
  ImagePlus, Sparkles, Send, ArrowLeft, Hash, FileText, Globe, Layers, Bold, Italic, Quote, Code, List, HelpCircle
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
  
  // UI and attachment states
  const [coverImage, setCoverImage] = useState(null);
  const [showTagsInput, setShowTagsInput] = useState(false);
  const [tagsList, setTagsList] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
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

  // Markdown format insertion helper
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

  // Circular character limits display
  const charLimit = 280;
  const currentChars = (watchedValues.content || "").length;
  const charPercent = Math.min(100, (currentChars / charLimit) * 100);

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readabilityScore / 100) * circumference;

  const charRadius = 10;
  const charCircumference = 2 * Math.PI * charRadius;
  const charDashoffset = charCircumference - (charPercent / 100) * charCircumference;

  const { ref: hookFormContentRef, ...contentRest } = register("content");

  return (
    <PageTransition className="relative min-h-screen w-full flex items-center justify-center py-10 px-4 max-w-4xl mx-auto overflow-hidden">
      <BackgroundMesh />
      
      {/* Threads/Twitter style Composer Card */}
      <div className="max-w-[640px] w-full rounded-[32px] bg-background/50 backdrop-blur-2xl border border-primary/15 p-6 sm:p-8 shadow-2xl relative">
        
        {/* Back and Page Actions */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/5">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="h-8 px-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-primary/10 gap-1.5"
          >
            <ArrowLeft size={12} /> Back
          </Button>

          <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-primary/80 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
            <Globe size={11} /> Everyone can reply
          </span>
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
          
          {/* Header row: Profile details */}
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
              <p className="text-[9px] text-primary/70 font-black uppercase tracking-widest mt-0.5">Post a Broadcast Signal</p>
            </div>
          </div>

          <div className="pl-0 sm:pl-14 space-y-4">
            
            {/* Title field */}
            <div className="relative">
              <input
                type="text"
                placeholder="Give it a title..."
                className="w-full bg-transparent border-none text-xl sm:text-2xl font-black placeholder-muted-foreground/35 focus:outline-none focus-visible:ring-0 focus:ring-0 outline-none p-0 text-foreground"
                {...register("title")}
              />
              {errors.title && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[10px] font-bold mt-1">{errors.title.message}</motion.p>
              )}
            </div>

            {/* Tags Composer */}
            {(showTagsInput || tagsList.length > 0) && (
              <div className="flex flex-wrap gap-1.5 items-center p-2.5 rounded-2xl bg-muted/10 border border-primary/5 focus-within:border-primary/10 transition-all">
                {tagsList.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/10"
                  >
                    <span>#{tag}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(idx)} 
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
                  placeholder="Add hashtag..."
                  className="flex-1 min-w-[90px] bg-transparent border-none text-[11px] font-bold text-foreground outline-none placeholder-muted-foreground/35 p-0"
                />
              </div>
            )}

            {/* Content Field */}
            <div className="relative">
              <textarea
                id="content"
                placeholder="What's happening? Start typing details or drop markdown blocks..."
                rows={8}
                className="w-full bg-transparent border-none text-sm sm:text-base placeholder-muted-foreground/20 focus:outline-none focus-visible:ring-0 focus:ring-0 outline-none leading-relaxed p-0 text-foreground/90 resize-none no-scrollbar"
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

            {/* Cover Image attachment preview */}
            {coverImage && (
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-primary/10 group shadow-md">
                <img src={coverImage} alt="Attachment" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={removeCoverImage} 
                  className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all border border-white/10 shadow-lg cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Bottom Actions Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-primary/5">
              
              {/* Media & Tags triggers + Formatting tools */}
              <div className="flex flex-wrap items-center gap-1">
                
                <button 
                  type="button" 
                  onClick={triggerFileInput} 
                  title="Attach Cover Image"
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition-all hover:bg-primary/10 border cursor-pointer",
                    coverImage ? "text-primary border-primary/20 bg-primary/5" : "text-muted-foreground border-transparent"
                  )}
                >
                  <ImagePlus size={14} />
                </button>

                <button 
                  type="button" 
                  onClick={() => setShowTagsInput(!showTagsInput)} 
                  title="Add Tag pills"
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition-all hover:bg-primary/10 border cursor-pointer",
                    showTagsInput || tagsList.length > 0 ? "text-primary border-primary/20 bg-primary/5" : "text-muted-foreground border-transparent"
                  )}
                >
                  <Hash size={14} />
                </button>

                <div className="h-4 w-[1px] bg-primary/10 mx-1" />

                {[
                  { label: "Bold", syntax: "bold", icon: <Bold size={13} /> },
                  { label: "Italic", syntax: "italic", icon: <Italic size={13} /> },
                  { label: "Quote", syntax: "quote", icon: <Quote size={13} /> },
                  { label: "Code", syntax: "code", icon: <Code size={13} /> },
                  { label: "List", syntax: "list", icon: <List size={13} /> },
                ].map((tool) => (
                  <button
                    key={tool.syntax}
                    type="button"
                    onClick={() => insertMarkdown(tool.syntax)}
                    title={tool.label}
                    className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/5 cursor-pointer"
                  >
                    {tool.icon}
                  </button>
                ))}
              </div>

              {/* Character stats, sidebar toggle and Post controls */}
              <div className="flex items-center justify-between sm:justify-end gap-3.5">
                
                <div className="flex items-center gap-2">
                  {/* Circle character progress uploader indicator */}
                  <div className="relative flex items-center justify-center shrink-0 w-6 h-6">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="12" cy="12" r={charRadius} className="text-muted/10" strokeWidth="2" stroke="currentColor" fill="transparent" />
                      <motion.circle 
                        cx="12" 
                        cy="12" 
                        r={charRadius} 
                        className={cn(
                          charPercent >= 90 ? "text-red-500" : "text-primary"
                        )}
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
                    title="Toggle Insights and Drafts"
                    className={cn(
                      "h-8 px-2.5 rounded-xl border flex items-center gap-1 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                      showSidebar 
                        ? "bg-primary/10 border-primary/20 text-primary" 
                        : "bg-muted/10 border-primary/5 text-muted-foreground hover:text-foreground hover:border-primary/10"
                    )}
                  >
                    <Layers size={13} /> Insights ({drafts.length})
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="h-9 px-5 rounded-full bg-primary text-primary-foreground font-black text-[11px] uppercase tracking-widest hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSubmitting ? "Posting..." : <><Send size={11} /> Signal</>}
                  </Button>
                </div>

              </div>

            </div>

          </div>

        </form>

      </div>

      {/* Slide-out Glass Side Drawer (Collapsible drafts and metrics info) */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-[310px] bg-background/95 backdrop-blur-2xl border-l border-primary/10 z-50 p-6 shadow-2xl transition-transform duration-300 ease-out flex flex-col justify-start space-y-6",
        showSidebar ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-primary/5 shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
            <Sparkles size={13} className="animate-pulse" /> Broadcast Signals
          </span>
          <button 
            type="button"
            onClick={() => setShowSidebar(false)} 
            className="text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
          >
            Close ✕
          </button>
        </div>

        {/* Analytics Info (Circular gauge) */}
        <div className="p-4 rounded-2xl bg-muted/10 border border-primary/5 space-y-4">
          <div className="flex items-center gap-3">
            
            {/* SVG circle */}
            <div className="relative flex items-center justify-center shrink-0 w-12 h-12">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="18" className="text-muted/10" strokeWidth="3" stroke="currentColor" fill="transparent" />
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
            <div className="p-2.5 rounded-xl bg-background/30 border border-primary/5">
              <p className="text-[8px] font-black uppercase tracking-wider text-muted-foreground/50">Words</p>
              <p className="text-xs font-black text-foreground mt-0.5 font-mono">{wordsCount}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-background/30 border border-primary/5">
              <p className="text-[8px] font-black uppercase tracking-wider text-muted-foreground/50">Reading Est.</p>
              <p className="text-xs font-black text-foreground mt-0.5 font-mono">{readingTime}m</p>
            </div>
          </div>
        </div>

        {/* Draft Actions Card */}
        <div className="p-4 rounded-2xl bg-muted/10 border border-primary/5 space-y-3">
          <Button 
            type="button" 
            onClick={saveDraft}
            className="w-full h-9 rounded-xl bg-muted/20 border border-primary/10 hover:bg-primary/5 text-foreground font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
          >
            Save as Draft
          </Button>
        </div>

        {/* Active Drafts list */}
        <div className="flex-1 flex flex-col min-h-0 space-y-3">
          <div className="flex items-center justify-between shrink-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Saved Drafts ({drafts.length})</span>
            <FileText size={12} className="text-primary" />
          </div>

          {drafts.length === 0 ? (
            <p className="text-xs text-muted-foreground/45 italic py-4">No drafts found.</p>
          ) : (
            <div className="space-y-2.5 overflow-y-auto pr-1 no-scrollbar flex-1">
              {drafts.map((d) => (
                <div 
                  key={d._id} 
                  onClick={() => {
                    navigate(`/dashboard/create?draftId=${d._id}`);
                    setShowSidebar(false);
                  }}
                  className={cn(
                    "p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex gap-2.5 items-center",
                    draftId === d._id 
                      ? "bg-primary/10 border-primary/30" 
                      : "bg-background/20 border-primary/5 hover:border-primary/15 hover:bg-primary/5"
                  )}
                >
                  {d.image && (
                    <img src={d.image} className="w-8 h-8 rounded-lg object-cover border border-primary/5 shrink-0" alt="draft" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-[10px] truncate leading-tight text-foreground">{d.title || "Untitled Draft"}</p>
                    <p className="text-[8px] text-muted-foreground/60 mt-0.5 font-mono">
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
              className="w-full h-10 rounded-xl font-bold uppercase tracking-wider text-[9px] bg-primary/10 text-primary border border-primary/10 hover:bg-primary hover:text-primary-foreground transition-all shrink-0 cursor-pointer"
            >
              Start New Draft +
            </Button>
          )}
        </div>

      </div>

    </PageTransition>
  );
}

import { useEffect, useRef, useState } from "react";
import MainLayout from "../components/layout/MainLayout.jsx";
import PageTransition from "../components/layout/PageTransition.jsx";
import { Link } from "react-router-dom";
import { 
  PenTool, Zap, Shield, BookOpen, Quote, Star, Code, Feather, Globe, 
  Sparkles, ArrowRight, Play, Activity, Heart, MessageSquare, Bookmark, 
  Check, Copy, Info, RefreshCw, Layers, Search, Eye, Filter, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ParticleBackground from "../components/ui/ParticleBackground.jsx";

// Standard Mock Data for initial Blog Posts
const INITIAL_MOCK_POSTS = [
  {
    id: "mock-1",
    title: "Optimizing React v19 Concurrent Rendering Protocols",
    excerpt: "Vite, concurrent updates, and the transition helper hooks are redefining frontend metrics. Let's inspect how to maximize performance under low memory systems.",
    author: "dev_kestrel",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
    date: "Jun 4",
    tags: ["React19", "Vite", "Performance"],
    likes: 42,
    comments: 8,
    readTime: "4 min read"
  },
  {
    id: "mock-2",
    title: "A Case for Glassmorphism in Modern Typography Layouts",
    excerpt: "Blending frosted-glass properties with carefully mapped variable fonts creates a premium layout hierarchy that is both highly readable and futuristic.",
    author: "design_nomad",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    date: "Jun 2",
    tags: ["Glassmorphism", "CSS", "Design"],
    likes: 89,
    comments: 12,
    readTime: "6 min read"
  },
  {
    id: "mock-3",
    title: "Semantic Solarized Design: HSL Color Systems vs Static Hex values",
    excerpt: "Static Hex palettes limit contrast adjustments. Investigating why HSL mapping enables fluid adjustments for eye comfort and accessibility across device classes.",
    author: "pixel_pioneer",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100",
    date: "May 29",
    tags: ["Solarized", "ColorTheory", "Accessibility"],
    likes: 124,
    comments: 15,
    readTime: "5 min read"
  }
];

// Solarized Color Palette definitions (16 colors)
const SOLARIZED_COLORS = [
  { name: "base03", hex: "#002b36", usage: "Main background (Dark Mode)", type: "Dark Content" },
  { name: "base02", hex: "#073642", usage: "Secondary background (Dark Mode)", type: "Dark Content" },
  { name: "base01", hex: "#586e75", usage: "Content text (Light Mode)", type: "Dark Content" },
  { name: "base00", hex: "#657b83", usage: "Muted text (Light Mode)", type: "Dark Content" },
  { name: "base0", hex: "#839496", usage: "Muted text (Dark Mode)", type: "Light Content" },
  { name: "base1", hex: "#93a1a1", usage: "Content text (Dark Mode)", type: "Light Content" },
  { name: "base2", hex: "#eee8d5", usage: "Secondary background (Light Mode)", type: "Light Content" },
  { name: "base3", hex: "#fdf6e3", usage: "Main background (Light Mode)", type: "Light Content" },
  { name: "yellow", hex: "#b58900", usage: "Accents, warnings, highlights", type: "Accent" },
  { name: "orange", hex: "#cb4b16", usage: "Errors, structural alerts", type: "Accent" },
  { name: "red", hex: "#dc322f", usage: "Critical deletions, highlights", type: "Accent" },
  { name: "magenta", hex: "#d33682", usage: "Featured links, active stats", type: "Accent" },
  { name: "violet", hex: "#6c71c4", usage: "Primary buttons, active links", type: "Accent" },
  { name: "blue", hex: "#268bd2", usage: "Hyperlinks, neutral info indicators", type: "Accent" },
  { name: "cyan", hex: "#2aa198", usage: "Secondary elements, active filters", type: "Accent" },
  { name: "green", hex: "#859900", usage: "Success badges, published status", type: "Accent" }
];

function AnimatedCounter({ value, label }) {
  const ref = useRef(null);
  const isInViewRef = useRef(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInViewRef.current) {
          isInViewRef.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [value]);

  return (
    <div ref={ref} className="text-center group p-8 rounded-[32px] glass-panel border-primary/10 hover:border-primary/25 transition-all duration-500">
      <div className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-gradient mb-2 group-hover:scale-105 transition-transform duration-300">
        {count.toLocaleString()}+
      </div>
      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">{label}</div>
    </div>
  );
}

function GlowCard({ children, className = "" }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (window.innerWidth < 1024) return;
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => window.innerWidth >= 1024 && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-[32px] glass-panel border-primary/10 hover:border-primary/25 transition-all duration-300 p-8 cursor-default ${className}`}
    >
      {isHovered && (
        <div
          className="absolute pointer-events-none transition-opacity duration-300"
          style={{
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, rgba(108, 113, 196, 0.1) 0%, transparent 70%)",
            left: `${coords.x - 175}px`,
            top: `${coords.y - 175}px`,
            zIndex: 0,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Live markdown parsing function
function parseMarkdown(text) {
  let html = text;
  // Simple escapes
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // Markdown parser
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-2xl md:text-3xl font-black tracking-tight text-foreground mb-4">$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-xl md:text-2xl font-bold tracking-tight text-foreground mt-5 mb-2.5">$1</h2>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-foreground">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic text-muted-foreground">$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs font-bold">$1</code>');
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-secondary hover:underline font-bold">$1</a>');
  html = html.replace(/^-(.*?)$/gm, '<li class="ml-4 list-disc text-muted-foreground">$1</li>');
  html = html.replace(/^>(.*?)$/gm, '<blockquote class="border-l-4 border-primary/40 pl-4 py-1.5 italic text-muted-foreground/80 bg-primary/5 rounded-r my-2">$1</blockquote>');

  const paragraphs = html.split(/\n\n+/);
  return paragraphs
    .map(p => {
      const trimmed = p.trim();
      if (trimmed.startsWith('<h') || trimmed.startsWith('<li') || trimmed.startsWith('<blockquote') || trimmed.length === 0) return p;
      return `<p class="leading-relaxed text-muted-foreground mb-3 font-medium text-sm md:text-base">${p.replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
}

export default function Home() {
  const [markdownText, setMarkdownText] = useState(
    `# Floating Thoughts

This is our **Focus Mode Simulator**. Type text here, structure it with clean markdown syntax, and preview the compiled readability instantly!

## Core Elements:
- Write clean, fluid prose
- Check metrics on the toolbar
- Click \`Publish Draft\` to update the live feed deck below!`
  );

  const [authorName, setAuthorName] = useState("draft_writer");
  const [postTitle, setPostTitle] = useState("Exploring Solarized Light Architecture");
  const [postTags, setPostTags] = useState("Design, Productivity");
  const [posts, setPosts] = useState(INITIAL_MOCK_POSTS);
  
  // Interactive Feed state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTagFilter, setActiveTagFilter] = useState("All");
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [copyStatus, setCopyStatus] = useState({});
  const [successToast, setSuccessToast] = useState("");

  const textareaRef = useRef(null);
  const feedSectionRef = useRef(null);

  // Helper to insert markdown syntax at current cursor index
  const insertMarkdown = (syntaxBefore, syntaxAfter = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const replacement = syntaxBefore + selectedText + syntaxAfter;
    setMarkdownText(
      text.substring(0, start) + replacement + text.substring(end)
    );
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + syntaxBefore.length,
        start + syntaxBefore.length + selectedText.length
      );
    }, 0);
  };

  // Generate simulated article
  const generateIdea = () => {
    const ideas = [
      {
        title: "Clean HSL Color Styling in Glassmorphic Interfaces",
        tags: "CSS, Design, Glassmorphism",
        body: `# Beautiful Contrast Shifts\n\nGlassmorphism relies heavily on contrast and alpha levels. By using custom HSL values rather than static Hex properties, we can dynamically program contrast offsets.\n\n## Core Advantages:\n- Harmonious base saturation\n- Theme-independent transparency\n- Sleek responsive shadow layers\n\nTry adjusting this design on your own projects!`
      },
      {
        title: "Architecting Micro-Frontends with Vite & ES Modules",
        tags: "React19, Vite, Architecture",
        body: `# Modularity in Modern Web Dev\n\nMicro-frontends allow scaling interface builds across multiple teams. By utilizing Vite's native ES Module server, we federation modules with zero latency.\n\n## Advantages:\n- Micro-second hot module reload times\n- Isolated state management systems\n- Uniform theme alignment`
      },
      {
        title: "Why Developer Experience (DX) is the True Metric of Velocity",
        body: `# The Hidden Cost of Bad Tooling\n\nDeveloper friction (slow compilers, complex local databases, dense code syntax) drains cognitive resources. Creating beautiful, responsive local tools changes the output curves.\n\n- Instant feedback iterations\n- Uniform lint formatting standards\n- Transparent layout designs`,
        tags: "Productivity, WebDev"
      }
    ];
    const random = ideas[Math.floor(Math.random() * ideas.length)];
    setPostTitle(random.title);
    setPostTags(random.tags);
    setMarkdownText(random.body);
  };

  // Publish draft locally
  const handlePublishDraft = (e) => {
    e.preventDefault();
    if (!markdownText.trim()) return;

    const parsedTitle = postTitle.trim() || "Untitled Broadcast";
    const tagList = postTags
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newPost = {
      id: `local-${Date.now()}`,
      title: parsedTitle,
      excerpt: markdownText.substring(0, 150).replace(/[#*`>-]/g, "").trim() + "...",
      author: authorName.trim() || "anonymous",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
      date: "Today",
      tags: tagList.length > 0 ? tagList : ["Draft"],
      likes: 0,
      comments: 0,
      readTime: `${Math.max(1, Math.round(markdownText.split(/\s+/).length / 200))} min read`,
      isLocalDraft: true
    };

    setPosts([newPost, ...posts]);
    setSuccessToast("Signal Published to Local Feed Deck!");
    
    // Clear editor fields
    setPostTitle("");
    setPostTags("");
    setMarkdownText(`# Dynamic Signal\n\nWrite another amazing draft here...`);

    // Clear toast
    setTimeout(() => {
      setSuccessToast("");
    }, 4000);

    // Scroll to feed
    if (feedSectionRef.current) {
      feedSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Delete draft (local only)
  const handleDeletePost = (id) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  // Handle Likes toggling locally
  const toggleLike = (id) => {
    setLikedPosts(prev => {
      const active = !prev[id];
      setPosts(posts.map(p => {
        if (p.id === id) {
          return { ...p, likes: active ? p.likes + 1 : p.likes - 1 };
        }
        return p;
      }));
      return { ...prev, [id]: active };
    });
  };

  // Handle Bookmark toggling locally
  const toggleBookmark = (id) => {
    setBookmarkedPosts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Copy Color Hex
  const handleCopyHex = (hex, name) => {
    navigator.clipboard.writeText(hex);
    setCopyStatus(prev => ({ ...prev, [name]: true }));
    setTimeout(() => {
      setCopyStatus(prev => ({ ...prev, [name]: false }));
    }, 1500);
  };

  // Compute live word & read statistics
  const wordCount = markdownText.trim() ? markdownText.trim().split(/\s+/).length : 0;
  const charCount = markdownText.length;
  const estimatedTime = Math.max(1, Math.round(wordCount / 200));

  // Extract all distinct tags from mock data for filters
  const allTags = ["All", ...new Set(posts.flatMap(p => p.tags))];

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = activeTagFilter === "All" || post.tags.includes(activeTagFilter);
    return matchesSearch && matchesTag;
  });

  return (
    <MainLayout>
      <PageTransition className="w-full relative overflow-hidden">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[92vh] flex flex-col justify-center items-center px-6 py-20 overflow-hidden">
          <ParticleBackground />
          
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[15%] left-[8%] w-[45vw] h-[45vw] rounded-full bg-primary/10 blur-[130px] md:animate-pulse duration-[12s]" />
            <div className="absolute bottom-[10%] right-[8%] w-[40vw] h-[40vw] rounded-full bg-secondary/8 blur-[110px] md:animate-pulse duration-[16s]" />
          </div>

          <div className="relative z-10 text-center w-full max-w-6xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel border-primary/20 hover:border-primary/45 transition-all duration-300 shadow-xl shadow-primary/5 hover:scale-[1.03] cursor-pointer">
              <div className="p-1 rounded-full bg-primary/25 text-primary">
                <Sparkles size={12} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Solarized Engine Active</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-foreground">
              Write Clearly. <br />
              <span className="font-serif font-light text-muted-foreground/50 pr-4 italic">Broadcast</span>
              <span className="text-gradient">Fluidly.</span>
            </h1>

            <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed tracking-tight">
              An elegant, clutter-free publishing deck configured with the classic Solarized Palette to prioritize contrast ratios, typing flow, and reader ease.
            </p>

            {/* Floating Quick Action Tag Cluster */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto py-2">
              {["#MarkdownEditor", "#SolarizedTheme", "#Glassmorphism", "#NoDistractions", "#FastHMR", "#WritersFeed"].map((item, idx) => (
                <span 
                  key={idx} 
                  className="px-3.5 py-1.5 rounded-full glass-card text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-primary hover:border-primary/30 transition-all cursor-default"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-6 w-full max-w-md mx-auto sm:max-w-none px-4 sm:px-0">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-sm font-black uppercase tracking-[0.2em] rounded-[24px] shadow-2xl shadow-primary/10 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all gap-3 group bg-primary text-white border-none">
                  Initialize Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#editor-section" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-16 px-10 text-sm font-black uppercase tracking-[0.2em] rounded-[24px] border-primary/15 hover:bg-primary/5 transition-all gap-3">
                  <Play size={18} /> Test Sandbox
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 2: FOCUS WRITER WORKSPACE */}
        <section id="editor-section" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest">
              <PenTool size={12} /> Focus Writer Deck
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-foreground">
              Distraction-Free <span className="text-gradient">Publishing Hub</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto font-medium">
              Simulate the actual writer interface. Type markdown below, use the formatting toolbar, and broadcast drafts instantly to the feed.
            </p>
          </div>

          {/* Success Toast */}
          {successToast && (
            <div className="fixed bottom-8 right-8 z-[200] glass-panel border-green-500/30 bg-background/95 rounded-2xl p-4 flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
              <div className="h-8 w-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                <Check size={18} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-green-500">Success Status</p>
                <p className="text-sm font-bold text-foreground">{successToast}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Controls & Editor Block (Left/7cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              
              {/* Form Input Deck */}
              <div className="p-6 rounded-[28px] glass-panel border-primary/10 space-y-4 bg-background/10 backdrop-blur-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/70">Author Handle</label>
                    <input 
                      type="text" 
                      value={authorName} 
                      onChange={(e) => setAuthorName(e.target.value)} 
                      placeholder="e.g. writer_flow"
                      className="w-full bg-background/50 border border-primary/15 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/40 font-bold transition-all text-foreground"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/70">Draft Post Title</label>
                    <input 
                      type="text" 
                      value={postTitle} 
                      onChange={(e) => setPostTitle(e.target.value)} 
                      placeholder="e.g. Masterclass on Solarized Contrasts"
                      className="w-full bg-background/50 border border-primary/15 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/40 font-bold transition-all text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/70">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      value={postTags} 
                      onChange={(e) => setPostTags(e.target.value)} 
                      placeholder="e.g. Design, WebDev, CSS"
                      className="w-full bg-background/50 border border-primary/15 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/40 font-bold transition-all text-foreground"
                    />
                  </div>
                  <Button 
                    type="button" 
                    onClick={generateIdea} 
                    variant="ghost" 
                    className="w-full h-9 rounded-xl border border-primary/15 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-primary/5 active:scale-95 transition-all text-primary"
                  >
                    <RefreshCw size={12} /> Auto-Generate
                  </Button>
                </div>
              </div>

              {/* Main Textarea Panel */}
              <div className="rounded-[32px] glass-panel border-primary/15 overflow-hidden flex flex-col bg-background/20 backdrop-blur-md relative">
                
                {/* Editor Top Bar Toolbar */}
                <div className="px-4 py-3 bg-primary/5 border-b border-primary/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button 
                      onClick={() => insertMarkdown("**", "**")} 
                      className="p-2 rounded-lg hover:bg-primary/15 text-xs font-extrabold font-serif transition-colors text-foreground"
                      title="Bold"
                    >
                      B
                    </button>
                    <button 
                      onClick={() => insertMarkdown("*", "*")} 
                      className="p-2 rounded-lg hover:bg-primary/15 text-xs italic font-serif transition-colors text-foreground"
                      title="Italic"
                    >
                      I
                    </button>
                    <button 
                      onClick={() => insertMarkdown("### ", "")} 
                      className="p-2 rounded-lg hover:bg-primary/15 text-xs font-mono font-bold transition-colors text-foreground"
                      title="Header"
                    >
                      H3
                    </button>
                    <button 
                      onClick={() => insertMarkdown("`", "`")} 
                      className="p-2 rounded-lg hover:bg-primary/15 font-mono text-xs transition-colors text-foreground"
                      title="Code Block"
                    >
                      &lt;/&gt;
                    </button>
                    <button 
                      onClick={() => insertMarkdown("> ", "")} 
                      className="p-2 rounded-lg hover:bg-primary/15 font-serif text-xs font-bold transition-colors text-foreground"
                      title="Blockquote"
                    >
                      “ ”
                    </button>
                    <button 
                      onClick={() => insertMarkdown("[Link Text](", ")")} 
                      className="p-2 rounded-lg hover:bg-primary/15 text-xs transition-colors text-foreground"
                      title="Link"
                    >
                      Link
                    </button>
                  </div>
                  
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 font-mono">
                    workspace_draft.md
                  </span>
                </div>

                <textarea
                  ref={textareaRef}
                  value={markdownText}
                  onChange={(e) => setMarkdownText(e.target.value)}
                  placeholder="# Write something..."
                  className="w-full p-8 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed text-foreground min-h-[320px] focus:ring-0"
                />

                {/* Editor Metrics Footer */}
                <div className="px-6 py-3.5 bg-primary/[0.02] border-t border-primary/10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  <div className="flex items-center gap-4">
                    <span>Words: <span className="text-primary font-bold">{wordCount}</span></span>
                    <span>Chars: <span className="text-primary font-bold">{charCount}</span></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity size={10} className="text-primary" />
                    <span>Est. Read: <span className="text-primary font-bold">{estimatedTime}m</span></span>
                  </div>
                </div>
              </div>

              {/* Publish Action Button */}
              <button 
                onClick={handlePublishDraft}
                className="h-14 w-full bg-primary hover:bg-primary/95 text-white font-black uppercase tracking-[0.25em] text-xs rounded-2xl shadow-xl shadow-primary/10 flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5"
              >
                <Layers size={16} /> Publish Local Draft Signal
              </button>
            </div>

            {/* Compiled Preview Block (Right/5cols) */}
            <div className="lg:col-span-5 rounded-[32px] glass-panel border-primary/15 overflow-hidden flex flex-col bg-background/40 backdrop-blur-xl">
              <div className="px-6 py-4 bg-primary/5 border-b border-primary/10 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <Eye size={12} /> Live Render Output
                </span>
                <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                  <Check size={10} /> Auto-Saving
                </span>
              </div>
              
              <div className="flex-1 p-8 overflow-y-auto text-left max-h-[580px] prose prose-invert no-scrollbar">
                {/* Meta details mock */}
                <div className="border-b border-primary/10 pb-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-6 w-6 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-[9px] font-black text-primary uppercase">
                      {authorName.substring(0,2)}
                    </span>
                    <span className="text-xs font-black text-foreground">@{authorName || "anonymous"}</span>
                    <span className="text-muted-foreground/50 text-[10px] font-medium ml-auto">Draft State</span>
                  </div>
                  <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight leading-tight">
                    {postTitle || "Untitled Draft"}
                  </h1>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {postTags.split(",").map(t => t.trim()).filter(t => t.length > 0).map((tag, idx) => (
                      <span key={idx} className="text-[8px] font-black uppercase tracking-widest text-primary/70">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Body compiled markdown */}
                <div 
                  className="prose-content"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(markdownText) }}
                />
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: DECK MARQUEE */}
        <div className="py-16 border-y border-primary/5 bg-primary/[0.01] backdrop-blur-md relative overflow-hidden select-none">
          <div className="flex whitespace-nowrap animate-marquee w-max">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex shrink-0">
                {["Markdown", "SolarizedLight", "Typography", "Glassmorphism", "MicroAnimations", "FluidDesign", "SemanticContrast", "StaticGeneration"].map((word, idx) => (
                  <div key={idx} className="mx-8 text-2xl md:text-4xl font-black text-muted-foreground/10 uppercase tracking-[0.25em] hover:text-primary/20 transition-colors duration-300">
                    #{word}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: INTERACTIVE DYNAMIC FEED DECK */}
        <section ref={feedSectionRef} className="py-28 px-6 max-w-7xl mx-auto text-center relative z-10">
          <div className="space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest">
              <Globe size={12} /> Community Stream
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-foreground">
              The <span className="text-gradient">Frequency Stream</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto font-medium">
              Explore user-submitted signals and system mockups. Search, sort, filter tags, and review draft cards instantly.
            </p>
          </div>

          {/* Search, Tag filter toolbar */}
          <div className="glass-panel p-6 rounded-[28px] border-primary/10 max-w-4xl mx-auto mb-10 bg-background/20 flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search signals by keyword..."
                className="w-full pl-11 pr-4 py-3 bg-background/50 border border-primary/15 focus:border-primary/45 rounded-2xl text-xs font-bold outline-none transition-all text-foreground"
              />
            </div>

            {/* Tag Pills */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full no-scrollbar px-1 py-1 w-full md:w-auto justify-start md:justify-end">
              <Filter size={12} className="text-muted-foreground shrink-0" />
              {allTags.slice(0, 7).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTagFilter(tag)}
                  className={`px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 border shrink-0 ${
                    activeTagFilter === tag 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/15" 
                      : "bg-transparent text-muted-foreground border-primary/15 hover:border-primary/30"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredPosts.map((post) => (
              <div 
                key={post.id} 
                className="p-6 rounded-[24px] glass-panel border-primary/10 hover:border-primary/25 transition-all duration-300 bg-background/10 flex flex-col justify-between text-left group hover:-translate-y-1"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between gap-2 mb-3.5 text-[10px] text-muted-foreground font-semibold">
                    <div className="flex items-center gap-2">
                      <img src={post.avatar} alt={post.author} className="h-6 w-6 rounded-full object-cover border border-primary/10" />
                      <span className="font-extrabold text-foreground">@{post.author}</span>
                    </div>
                    <span>{post.date}</span>
                  </div>

                  {/* Title & Excerpt */}
                  <h3 className="text-base font-black tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-4 font-medium">
                    {post.excerpt}
                  </p>
                </div>

                {/* Footer Tag and Actions */}
                <div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-black uppercase tracking-wider">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-primary/10 pt-4 text-muted-foreground/60 text-xs">
                    <button 
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 hover:text-red-500 font-bold transition-colors ${likedPosts[post.id] ? "text-red-500" : ""}`}
                    >
                      <Heart size={14} fill={likedPosts[post.id] ? "currentColor" : "none"} className="transition-transform active:scale-75" />
                      <span>{post.likes}</span>
                    </button>
                    
                    <button 
                      onClick={() => toggleBookmark(post.id)}
                      className={`flex items-center gap-1.5 hover:text-primary font-bold transition-colors ${bookmarkedPosts[post.id] ? "text-primary" : ""}`}
                    >
                      <Bookmark size={14} fill={bookmarkedPosts[post.id] ? "currentColor" : "none"} className="transition-transform active:scale-75" />
                    </button>

                    {post.isLocalDraft ? (
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-500/40 hover:text-red-500 transition-colors p-1"
                        title="Remove Local Post"
                      >
                        <Trash2 size={13} />
                      </button>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">
                        {post.readTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="py-20 text-center max-w-md mx-auto">
              <div className="h-16 w-16 bg-primary/5 rounded-3xl flex items-center justify-center text-primary/40 mx-auto mb-4 border border-primary/10">
                <Search size={28} />
              </div>
              <h4 className="text-lg font-black text-foreground mb-1">No matches found</h4>
              <p className="text-xs text-muted-foreground font-medium">No posts matched your active tag filter or search keyword.</p>
            </div>
          )}
        </section>

        {/* SECTION 5: SOLARIZED DESIGN STUDIO EXPLORER */}
        <section className="py-28 px-6 border-y border-primary/5 bg-primary/[0.01] relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest">
                <Layers size={12} /> Design System Core
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                The <span className="text-gradient">Solarized Studio</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto font-medium">
                Our application color architecture is built strictly on the classic Ethan Schoonover Solarized palette. Click color cards to inspect usage details and copy Hex keys.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {SOLARIZED_COLORS.map((color) => {
                const nameKey = color.name;
                const isCopied = copyStatus[nameKey];
                
                return (
                  <div 
                    key={nameKey}
                    onClick={() => handleCopyHex(color.hex, nameKey)}
                    className="glass-card rounded-[22px] border-primary/10 overflow-hidden group cursor-pointer transition-all duration-300 flex flex-col items-stretch text-left active:scale-95"
                  >
                    {/* Color Chip Preview */}
                    <div 
                      className="h-16 w-full relative transition-transform duration-300 group-hover:scale-[1.03]"
                      style={{ backgroundColor: color.hex }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {isCopied ? (
                          <Check size={14} className="text-white font-extrabold" />
                        ) : (
                          <Copy size={14} className="text-white opacity-80" />
                        )}
                      </div>
                    </div>
                    
                    {/* Color Info Card */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-foreground truncate">{color.name}</span>
                          <span className="text-[8px] font-black uppercase tracking-widest text-primary/60 shrink-0">{color.type}</span>
                        </div>
                        <p className="text-[8px] text-muted-foreground font-medium leading-normal line-clamp-2 mb-2">
                          {color.usage}
                        </p>
                      </div>
                      <div className="text-[9px] font-mono font-bold text-muted-foreground/60 group-hover:text-primary transition-colors pt-2 border-t border-primary/5 flex items-center justify-between">
                        <span>{color.hex}</span>
                        {isCopied && <span className="text-[8px] font-black uppercase tracking-widest text-green-500">COPIED</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 6: METRICS STATS */}
        <section className="py-20 px-6 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedCounter value={5124} label="Draft Streams" />
            <AnimatedCounter value={12590} label="Active Readers" />
            <AnimatedCounter value={99} label="Latency Uptime %" />
          </div>
        </section>

        {/* SECTION 7: FEATURE HIGHLIGHTS */}
        <section className="py-24 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 mb-6">
                  <Shield size={12} /> System Framework
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-none mb-6">
                  Engineered for <br /><span className="text-gradient">Readability Scale</span>
                </h2>
                <p className="text-base text-muted-foreground font-medium mb-10 leading-relaxed">
                  We engineered this dashboard specifically to resolve contrast fatigue. By prioritizing responsive breakpoints, glassmorphism, and consistent variable layout heights, readers focus strictly on syntax ideas.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { icon: Zap, title: "Hyper-fluid UI", desc: "Responsive transitions" },
                    { icon: Shield, title: "Solarized Light", desc: "High contrast readability" },
                    { icon: Globe, title: "Direct Stream", desc: "Instant deployment nodes" },
                    { icon: Sparkles, title: "Premium Visuals", desc: "Aesthetic CSS mesh orbs" },
                  ].map((feat, idx) => (
                    <div key={idx} className="space-y-2.5 group cursor-default text-left">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <feat.icon size={18} />
                      </div>
                      <h4 className="font-black text-xs uppercase tracking-widest text-foreground">{feat.title}</h4>
                      <p className="text-xs text-muted-foreground font-medium">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parallax Feature Cards */}
              <div className="grid grid-cols-1 gap-6">
                <GlowCard>
                  <Feather className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-black tracking-tight mb-2 text-foreground">Distraction-Free Environment</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    A sleek interface removing cluttered components, sidebars, and system logs. You are left with a pristine, quiet space focusing on word flow.
                  </p>
                </GlowCard>
                <GlowCard>
                  <BookOpen className="h-10 w-10 text-secondary mb-4" />
                  <h3 className="text-lg font-black tracking-tight mb-2 text-foreground">Curated Saved Decks</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    Bookmark interesting articles. They are instantly structured into your personal offline reference deck, ready for offline syncing.
                  </p>
                </GlowCard>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FOOTER */}
        <section className="py-28 px-6">
          <div className="max-w-6xl mx-auto rounded-[48px] cta-footer-card p-8 sm:p-16 text-center relative overflow-hidden group border border-primary/20 shadow-xl shadow-primary/5 backdrop-blur-md">
            <div className="absolute inset-0 mesh-gradient opacity-10" />
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-[120px] animate-pulse duration-[10s]" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-tight">
                Start Publishing Your <br className="hidden md:inline" /> Frequencies Today
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                Reserve your custom handle, customize your profile settings, and sync your thoughts to our global markdown feed.
              </p>
              <Link to="/register" className="inline-block mt-4 w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-16 px-12 text-sm font-black uppercase tracking-[0.25em] bg-primary text-white border-none shadow-xl hover:bg-primary/95 dark:bg-white dark:text-primary dark:hover:bg-slate-50 rounded-[24px] hover:scale-105 transition-all">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </PageTransition>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </MainLayout>
  );
}

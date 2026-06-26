import { useEffect, useState } from "react";
import API from "../../../lib/secureApi.js";
import { initMockDb } from "../../../lib/mockDb.js";
import PageTransition from "@/components/layout/PageTransition.jsx";
import { FileText, PlusCircle, ArrowUpRight, Activity, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import PostCard from "@/components/blog/PostCard.jsx";
import { useAuth } from "@/context/AuthContext";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "publications"; // "publications" or "drafts"
  const [drafts, setDrafts] = useState([]);

  const fetchPosts = () => {
    API.get("/blogs/myblogs")
      .then((res) => {
        const blogData = res.data.blogs || res.data.data?.blogs || [];
        setPosts(blogData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchDrafts = () => {
    try {
      initMockDb();
      const storedDrafts = JSON.parse(localStorage.getItem("mock_db_drafts") || "[]");
      setDrafts(storedDrafts);
    } catch (err) {
      console.error("Error reading drafts:", err);
      setDrafts([]);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchDrafts();

    const handleBlogDeleted = () => {
      fetchPosts();
    };

    window.addEventListener("blog-deleted", handleBlogDeleted);
    return () => {
      window.removeEventListener("blog-deleted", handleBlogDeleted);
    };
  }, []);

  const handleDeleteDraft = (draftId) => {
    if (window.confirm("Are you sure you want to delete this draft? ⚠️")) {
      try {
        const storedDrafts = JSON.parse(localStorage.getItem("mock_db_drafts") || "[]");
        const filtered = storedDrafts.filter(d => d._id !== draftId);
        localStorage.setItem("mock_db_drafts", JSON.stringify(filtered));
        setDrafts(filtered);
      } catch (err) {
        console.error("Error deleting draft:", err);
      }
    }
  };

  return (
    <PageTransition className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                <FileText size={12} /> Resource Manager
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter">My <span className="text-gradient">Publications</span></h2>
            <p className="text-muted-foreground text-lg">Managing your digital broadcasts across the network.</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Active Signals</p>
                <p className="text-2xl font-black tracking-tighter">{posts.length}</p>
            </div>
            <Link to="/dashboard/create">
                <Button className="gap-2 h-14 px-8 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all font-bold group">
                    <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" /> New Publication
                </Button>
            </Link>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 border-b border-primary/10 pb-1 px-4">
        <button 
          onClick={() => setSearchParams({ tab: "publications" })}
          className={`flex items-center gap-2 pb-3 sm:pb-4 font-black uppercase tracking-widest text-[11px] border-b-4 transition-all cursor-pointer ${activeTab === "publications" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <FileText size={16} /> Publications ({posts.length})
        </button>
        <button 
          onClick={() => setSearchParams({ tab: "drafts" })}
          className={`flex items-center gap-2 pb-3 sm:pb-4 font-black uppercase tracking-widest text-[11px] border-b-4 transition-all cursor-pointer ${activeTab === "drafts" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <Sparkles size={16} /> Saved Drafts ({drafts.length})
        </button>
      </div>

      {activeTab === "publications" ? (
        loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-[480px] glass-panel animate-pulse rounded-[28px] border-primary/5 bg-primary/5" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[500px] glass-panel rounded-[48px] border-dashed border-primary/20 bg-primary/5 p-12 text-center mx-4"
          >
            <div className="h-24 w-24 rounded-[32px] bg-primary/10 text-primary flex items-center justify-center mb-8 shadow-xl shadow-primary/10">
              <Activity size={48} />
            </div>
            <h3 className="text-3xl font-black tracking-tighter mb-4 text-foreground">No active transmissions detected</h3>
            <p className="text-muted-foreground font-medium max-w-sm mx-auto mb-10 leading-relaxed text-lg">Your signal is currently silent. Initialize your first publication to begin broadcasting.</p>
            <Link to="/dashboard/create">
              <Button size="lg" className="h-16 px-12 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/20">
                  Initialize Frequency
              </Button>
            </Link>
          </motion.div>
        ) : (
          /* Main Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {posts.map((post, index) => (
              <PostCard key={post._id} post={post} index={index} isGrid={true} />
            ))}
          </div>
        )
      ) : (
        /* Saved Drafts View */
        drafts.length === 0 ? (
          <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[400px] glass-panel rounded-[48px] border-dashed border-primary/20 bg-primary/5 p-12 text-center mx-4"
          >
            <div className="h-20 w-20 rounded-[28px] bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/10">
              <Sparkles size={36} />
            </div>
            <h3 className="text-2xl font-black tracking-tighter mb-3 text-foreground">No saved drafts</h3>
            <p className="text-muted-foreground font-medium max-w-sm mx-auto mb-6 leading-relaxed">Your draft workspace is clear. Create a draft or resume writing later.</p>
            <Link to="/dashboard/create">
              <Button size="lg" className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/25">
                  Write Draft
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {drafts.map((draft, index) => {
              const authorName = user?.name || "Demo User";
              const date = new Date(draft.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
              
              return (
                <motion.article 
                  key={draft._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="h-[480px] w-full flex flex-col p-5 rounded-[28px] glass-card border border-primary/5 hover:border-primary/20 shadow-lg hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 group justify-between overflow-hidden relative"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3 shrink-0">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="h-10 w-10 rounded-full overflow-hidden border border-primary/10 shrink-0">
                        <img 
                          src={user?.profilePicture || user?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                          className="w-full h-full object-cover" 
                          alt={authorName}
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="font-bold text-foreground text-sm truncate leading-snug">
                          {authorName}
                        </p>
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none mt-0.5">
                          Saved {date}
                        </span>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-[8px] font-black uppercase tracking-widest shrink-0">
                      Draft
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex-1 flex flex-col justify-start overflow-hidden min-w-0">
                    <Link to={`/dashboard/create?draftId=${draft._id}`} className="block">
                      <h3 
                        className="text-[17px] font-extrabold mb-1.5 text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2"
                        title={draft.title || "Untitled Draft"}
                      >
                        {draft.title || "Untitled Draft"}
                      </h3>
                      <div className="h-[1px] w-8 bg-primary/30 mb-2.5 group-hover:w-full transition-all duration-500" />
                    </Link>

                    {/* Cover image or gradient placeholder */}
                    <Link to={`/dashboard/create?draftId=${draft._id}`} className="block relative w-full h-[140px] rounded-2xl overflow-hidden border border-border/40 bg-muted/20 shrink-0 mb-3 group-hover:shadow-md transition-all duration-300">
                      {draft.image ? (
                        <img
                          src={draft.image}
                          alt="Draft cover"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-emerald-950/40 via-teal-900/30 to-emerald-900/40 relative overflow-hidden flex items-center justify-center">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-primary/10 filter blur-xl animate-pulse" />
                          <Sparkles size={24} className="text-primary/30 animate-pulse" />
                        </div>
                      )}
                    </Link>

                    <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3 mb-3">
                      {draft.content || "No content preview available for this draft."}
                    </p>
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-primary/10 mt-auto shrink-0">
                    <button 
                      onClick={() => handleDeleteDraft(draft._id)}
                      className="text-red-500 hover:text-red-600 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 group/del cursor-pointer"
                    >
                      Delete Draft
                    </button>
                    
                    <Link to={`/dashboard/create?draftId=${draft._id}`}>
                      <button className="text-primary hover:text-primary/80 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-1 group/btn cursor-pointer">
                        Resume Draft <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )
      )}

      {/* Insights Section Footer */}
      {activeTab === "publications" && posts.length > 0 && (
          <div className="mt-10 mx-4 p-8 rounded-[40px] glass-panel border-primary/10 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Sparkles size={120} className="text-primary" />
              </div>
              <div className="flex items-center gap-4 relative z-10">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <ArrowUpRight size={24} />
                  </div>
                  <div>
                      <h4 className="font-extrabold text-xl tracking-tighter">Transmission Insights</h4>
                      <p className="text-sm text-muted-foreground font-medium max-w-md">Your digital resonance has increased by <span className="text-primary font-bold">12.4%</span> across the network this week.</p>
                  </div>
              </div>
              <Button variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/10 px-8 h-12 font-black uppercase tracking-widest text-xs relative z-10">Analyze Waveforms</Button>
          </div>
      )}
    </PageTransition>
  );
}

import { useEffect, useState } from "react";
import API from "../../../lib/secureApi.js";
import PageTransition from "@/components/layout/PageTransition.jsx";
import { FileText, PlusCircle, ArrowUpRight, Activity, Heart, MessageCircle, Bookmark, MoreVertical, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const truncateText = (text, maxLength = 200) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-[420px] glass-panel animate-pulse rounded-[32px] border-primary/5 bg-primary/5" />
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
          {posts.map((post, index) => {
            const authorName = post.userId?.name || post.author?.name || "User";
            const date = new Date(post.createdAt).toLocaleDateString();
            
            return (
              <motion.article 
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="h-[420px] flex flex-col glass-panel p-6 hover:-translate-y-2 transition-all duration-500 group border-primary/5 hover:border-primary/20 shadow-lg hover:shadow-2xl hover:shadow-primary/5"
              >
                {/* Card Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/20 p-0.5">
                    <img 
                      src={post.userId?.profilePicture || post.author?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                      className="w-full h-full rounded-full object-cover" 
                      alt={authorName}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-sm truncate uppercase tracking-tighter">
                      {authorName}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      {date}
                    </p>
                  </div>
                  <button className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-xl hover:bg-primary/10">
                    <MoreVertical size={18} />
                  </button>
                </div>

                {/* Content Section */}
                <div className="flex-1 overflow-hidden">
                  <Link to={`/post/${post._id}`}>
                    <h3 
                      className="text-xl font-extrabold mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight"
                      title={post.title}
                    >
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-muted-foreground text-sm line-clamp-4 mb-4 leading-relaxed font-medium">
                    {post.content ? truncateText(post.content, 250) : "No content preview available for this transmission."}
                  </p>

                  {/* Tags Chips */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-4">
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-primary/10 mt-auto">
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    <span className="flex items-center gap-1.5 hover:text-pink-500 transition-colors cursor-help">
                      <Heart size={14} className="group-hover:fill-pink-500/20" /> {post.likes || 0}
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors cursor-help">
                      <MessageCircle size={14} /> {post.comments || 0}
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-help">
                      <Bookmark size={14} /> {post.bookmarks || 0}
                    </span>
                  </div>
                  
                  <Link to={`/post/${post._id}`}>
                    <button className="text-primary hover:text-primary/80 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-1 group/btn">
                      Read More <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {/* Insights Section Footer */}
      {posts.length > 0 && (
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

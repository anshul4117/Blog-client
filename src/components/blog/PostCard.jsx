import { Link } from "react-router-dom";
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Sparkles } from "lucide-react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { motion } from "framer-motion";

export default function PostCard({ post, index = 0 }) {
    const authorName = String(post.userId?.name || post.author?.name || (typeof post.author === 'string' ? post.author : '') || "Anonymous");
    const authorHandle = `@${authorName.replace(/\s+/g, "").toLowerCase()}`;
    const timeAgo = new Date(post.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
    });

    const isFeatured = (index + 1) % 5 === 0;

    if (isFeatured) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index % 5) * 0.1 }}
                className="relative group mb-8 mx-4 overflow-hidden rounded-[32px] glass-panel border-primary/20 shadow-2xl h-[400px]"
            >
                {/* Featured Background Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={post.image?.url || post.coverImage || "/Woman.jpeg"} 
                        alt="Featured" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
                </div>

                {/* Featured Content */}
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-foreground text-xs font-bold uppercase tracking-widest">
                            <Sparkles size={12} /> Featured Story
                        </div>
                        <span className="text-white/60 text-sm font-medium">{timeAgo}</span>
                    </div>

                    <Link to={`/post/${post._id}`}>
                        <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight group-hover:text-primary transition-colors">
                            {post.title}
                        </h3>
                    </Link>

                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full border-2 border-white/20 overflow-hidden">
                                <img src={post.author?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} alt={authorName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-sm">{authorName}</span>
                                <span className="text-white/60 text-xs">{authorHandle}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-white/80">
                            <button className="flex items-center gap-2 hover:text-pink-500 transition-colors">
                                <Heart size={20} /> <span className="text-sm font-bold">120</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                                <MessageCircle size={20} /> <span className="text-sm font-bold">24</span>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: (index % 5) * 0.08, type: "spring" }}
            className="p-6 mb-4 mx-4 rounded-[24px] glass-card group transition-all duration-300"
        >
            <div className="flex gap-4">
                {/* Avatar Column */}
                <div className="flex-shrink-0">
                    <Link to={`/profile/${post.userId?._id || post.author?._id || ""}`}>
                        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-border/40 group-hover:border-primary/50 transition-colors">
                            <img
                                src={post.userId?.profilePicture || post.author?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                alt={authorName}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </Link>
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-[14px]">
                            <Link to={`/profile/${post.userId?._id || post.author?._id || ""}`} className="font-bold text-foreground hover:text-primary transition-colors truncate">
                                {authorName}
                            </Link>
                            <span className="text-muted-foreground/60 truncate">{authorHandle}</span>
                            <span className="text-muted-foreground/40">·</span>
                            <span className="text-muted-foreground/60 text-xs">{timeAgo}</span>
                        </div>
                        <button className="text-muted-foreground hover:text-primary p-1.5 rounded-full hover:bg-primary/10 transition-all">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>

                    {/* Post Content */}
                    <Link to={`/post/${post._id}`} className="block">
                        {post.title && (
                            <h3 className="text-xl font-extrabold mb-2 text-foreground group-hover:text-primary transition-colors leading-tight">
                                {post.title}
                            </h3>
                        )}
                        <div className="h-[1px] w-12 bg-primary/30 mb-3 group-hover:w-full transition-all duration-500" />
                        <p className="text-[15px] leading-relaxed text-muted-foreground line-clamp-3">
                            {post.content}
                        </p>
                    </Link>

                    {/* Post Image */}
                    {post.image?.url && (
                        <div className="mt-4 rounded-2xl overflow-hidden border border-border/40 bg-muted/20">
                            <OptimizedImage
                                src={post.image.url}
                                alt="Post content"
                                className="max-h-[400px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                        </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {(post.tags || []).map(tag => (
                            <span key={tag} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/20 text-muted-foreground">
                        <button className="flex items-center gap-2 group/btn hover:text-blue-500 transition-colors text-xs font-bold uppercase tracking-wider">
                            <div className="p-2 rounded-full group-hover/btn:bg-blue-500/10 group-active/btn:scale-90 transition-all">
                                <MessageCircle size={18} />
                            </div>
                            <span>24</span>
                        </button>

                        <button className="flex items-center gap-2 group/btn hover:text-green-500 transition-colors text-xs font-bold uppercase tracking-wider">
                            <div className="p-2 rounded-full group-hover/btn:bg-green-500/10 group-active/btn:scale-90 transition-all">
                                <Repeat2 size={18} />
                            </div>
                            <span>5</span>
                        </button>

                        <button className="flex items-center gap-2 group/btn hover:text-pink-500 transition-colors text-xs font-bold uppercase tracking-wider">
                            <div className="p-2 rounded-full group-hover/btn:bg-pink-500/10 group-active/btn:scale-90 transition-all">
                                <Heart size={18} />
                            </div>
                            <span>120</span>
                        </button>

                        <button className="flex items-center gap-2 group/btn hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider">
                            <div className="p-2 rounded-full group-hover/btn:bg-primary/10 group-active/btn:scale-90 transition-all">
                                <Share size={18} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

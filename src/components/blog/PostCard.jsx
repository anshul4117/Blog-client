
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Sparkles } from "lucide-react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext.jsx";

export default function PostCard({ post, index = 0 }) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likeCount || (post.likes !== undefined ? post.likes : 120));

    const [reposted, setReposted] = useState(false);
    const [repostCount, setRepostCount] = useState(post.repostCount || 5);

    const [commented, setCommented] = useState(false);
    const [commentCount, setCommentCount] = useState(post.commentCount || (post.comments !== undefined ? post.comments : 24));

    const [followed, setFollowed] = useState(false);

    const handleFollow = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setFollowed(!followed);
    };

    const currentUserId = user?._id || user?.id || user?.userId;
    const postUserId = post.userId?._id || post.userId || post.author?._id || post.author || "";
    const showFollowButton = !!user && String(currentUserId) !== String(postUserId) && postUserId !== "";

    const handleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (liked) {
            setLikeCount(prev => prev - 1);
        } else {
            setLikeCount(prev => prev + 1);
        }
        setLiked(!liked);
    };

    const handleRepost = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (reposted) {
            setRepostCount(prev => prev - 1);
        } else {
            setRepostCount(prev => prev + 1);
        }
        setReposted(!reposted);
    };

    const handleComment = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (commented) {
            setCommentCount(prev => prev - 1);
        } else {
            setCommentCount(prev => prev + 1);
        }
        setCommented(!commented);
    };

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
                className="relative group mb-6 sm:mb-8 mx-0 sm:mx-2 md:mx-4 overflow-hidden rounded-[24px] sm:rounded-[32px] glass-panel border-primary/20 shadow-2xl h-[320px] sm:h-[400px]"
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
                <div className="absolute inset-0 z-20 p-4 sm:p-8 flex flex-col justify-end">
                    <div className="flex items-center gap-3 mb-2 sm:mb-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-foreground text-xs font-bold uppercase tracking-widest">
                            <Sparkles size={12} /> Featured Story
                        </div>
                        <span className="text-white/60 text-sm font-medium">{timeAgo}</span>
                    </div>

                    <Link to={`/post/${post._id}`}>
                        <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 sm:mb-4 leading-tight group-hover:text-primary transition-colors">
                            {post.title}
                        </h3>
                    </Link>

                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full border-2 border-white/20 overflow-hidden">
                                <img src={post.author?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} alt={authorName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <span className="text-white font-bold text-sm">{authorName}</span>
                                {showFollowButton && (
                                    <button
                                        onClick={handleFollow}
                                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-300 active:scale-95 border ${followed
                                                ? "bg-white/20 text-white border-white/40 hover:bg-white/30"
                                                : "bg-white text-primary border-white hover:bg-white/95"
                                            }`}
                                    >
                                        {followed ? "Following" : "Follow"}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-white/80">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 hover:text-pink-500 transition-colors ${liked ? "text-pink-500" : ""}`}
                            >
                                <Heart size={20} fill={liked ? "currentColor" : "none"} /> <span className="text-sm font-bold">{likeCount}</span>
                            </button>
                            <button
                                onClick={handleComment}
                                className={`flex items-center gap-2 hover:text-blue-400 transition-colors ${commented ? "text-blue-400" : ""}`}
                            >
                                <MessageCircle size={20} fill={commented ? "currentColor" : "none"} /> <span className="text-sm font-bold">{commentCount}</span>
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
            className="p-4 sm:p-6 mb-4 mx-0 sm:mx-2 md:mx-4 rounded-[20px] sm:rounded-[24px] glass-card group transition-all duration-300"
        >
            <div className="flex gap-3 sm:gap-4">
                {/* Avatar Column */}
                <div className="flex-shrink-0">
                    <Link to={`/profile/${post.userId?._id || post.author?._id || ""}`}>
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border-2 border-border/40 group-hover:border-primary/50 transition-colors">
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
                        <div className="flex items-center gap-2 text-[14px] min-w-0">
                            <Link to={`/profile/${post.userId?._id || post.author?._id || ""}`} className="font-bold text-foreground hover:text-primary transition-colors truncate max-w-[120px] sm:max-w-[180px]">
                                {authorName}
                            </Link>
                            <span className="text-muted-foreground/40">·</span>
                            <span className="text-muted-foreground/60 text-xs shrink-0">{timeAgo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {showFollowButton && (
                                <button
                                    onClick={handleFollow}
                                    className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 active:scale-95 ${followed
                                            ? "bg-primary text-white border border-primary hover:bg-primary/95"
                                            : "border border-primary/30 text-primary hover:bg-primary/5"
                                        }`}
                                >
                                    {followed ? "Following" : "Follow"}
                                </button>
                            )}
                            <button className="text-muted-foreground hover:text-primary p-1.5 rounded-full hover:bg-primary/10 transition-all">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>
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
                        <button
                            onClick={handleComment}
                            className={`flex items-center gap-2 group/btn hover:text-blue-500 transition-colors text-xs font-bold uppercase tracking-wider ${commented ? "text-blue-500" : ""}`}
                        >
                            <div className="p-2 rounded-full group-hover/btn:bg-blue-500/10 group-active/btn:scale-90 transition-all">
                                <MessageCircle size={18} fill={commented ? "currentColor" : "none"} />
                            </div>
                            <span>{commentCount}</span>
                        </button>

                        <button
                            onClick={handleRepost}
                            className={`flex items-center gap-2 group/btn hover:text-green-500 transition-colors text-xs font-bold uppercase tracking-wider ${reposted ? "text-green-500" : ""}`}
                        >
                            <div className="p-2 rounded-full group-hover/btn:bg-green-500/10 group-active/btn:scale-90 transition-all">
                                <Repeat2 size={18} />
                            </div>
                            <span>{repostCount}</span>
                        </button>

                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 group/btn hover:text-pink-500 transition-colors text-xs font-bold uppercase tracking-wider ${liked ? "text-pink-500" : ""}`}
                        >
                            <div className="p-2 rounded-full group-hover/btn:bg-pink-500/10 group-active/btn:scale-90 transition-all">
                                <Heart size={18} fill={liked ? "currentColor" : "none"} />
                            </div>
                            <span>{likeCount}</span>
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

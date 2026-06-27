import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Bookmark, Share, MoreHorizontal, Sparkles, Edit, UserPlus, UserCheck, Check, ShieldAlert } from "lucide-react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext.jsx";
import API from "@/lib/secureApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function PostCard({ post, index = 0, isGrid = false }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likeCount || (post.likes !== undefined ? post.likes : 120));

    const [saved, setSaved] = useState(() => {
        try {
            const savedIds = JSON.parse(localStorage.getItem("mock_db_saved_blogs") || "[]");
            return savedIds.includes(post._id);
        } catch {
            return false;
        }
    });

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [commentsList, setCommentsList] = useState(() => {
        try {
            const allComments = JSON.parse(localStorage.getItem("mock_db_comments") || "{}");
            return allComments[post._id] || [];
        } catch {
            return [];
        }
    });

    const getCommentCount = (list) => {
        let count = 0;
        list.forEach(c => {
            count++;
            if (c.replies) count += c.replies.length;
        });
        return count;
    };

    const [commentCount, setCommentCount] = useState(() => {
        const initialCount = getCommentCount(commentsList);
        return initialCount > 0 ? initialCount : (post.commentCount || (post.comments !== undefined ? post.comments : 24));
    });

    const [showCommentsPanel, setShowCommentsPanel] = useState(false);
    const [newCommentText, setNewCommentText] = useState("");
    const [replyText, setReplyText] = useState("");
    const [activeReplyId, setActiveReplyId] = useState(null);

    const [followed, setFollowed] = useState(() => {
        try {
            const followingIds = JSON.parse(localStorage.getItem("mock_db_following") || "[]");
            return followingIds.includes(String(post.userId?._id || post.author?._id || ""));
        } catch {
            return false;
        }
    });

    const handleFollow = (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const targetId = String(post.userId?._id || post.author?._id || "");
            if (!targetId) return;
            const followingIds = JSON.parse(localStorage.getItem("mock_db_following") || "[]");
            let newFollowingIds;
            if (followed) {
                newFollowingIds = followingIds.filter(id => id !== targetId);
            } else {
                newFollowingIds = [...followingIds, targetId];
            }
            localStorage.setItem("mock_db_following", JSON.stringify(newFollowingIds));
            setFollowed(!followed);
            window.dispatchEvent(new Event("following-change"));
        } catch (err) {
            console.error("Error toggling follow:", err);
        }
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

    const handleSaveToggle = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        try {
            const savedIds = JSON.parse(localStorage.getItem("mock_db_saved_blogs") || "[]");
            let newSavedIds;
            if (saved) {
                newSavedIds = savedIds.filter(id => id !== post._id);
            } else {
                newSavedIds = [...savedIds, post._id];
            }
            localStorage.setItem("mock_db_saved_blogs", JSON.stringify(newSavedIds));
            setSaved(!saved);
            window.dispatchEvent(new Event("saved-blogs-change"));
        } catch (err) {
            console.error("Error toggling saved state:", err);
        }
    };

    const handleCommentClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowCommentsPanel(prev => !prev);
    };

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        const newComment = {
            id: "comment-" + Date.now(),
            authorName: user?.name || "Anonymous",
            authorAvatar: user?.profilePicture || user?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            content: newCommentText,
            createdAt: new Date().toISOString(),
            replies: []
        };

        const updatedList = [...commentsList, newComment];
        setCommentsList(updatedList);
        setNewCommentText("");

        try {
            const allComments = JSON.parse(localStorage.getItem("mock_db_comments") || "{}");
            allComments[post._id] = updatedList;
            localStorage.setItem("mock_db_comments", JSON.stringify(allComments));
        } catch (err) {
            console.error("Error saving comment:", err);
        }

        setCommentCount(prev => prev + 1);
    };

    const handleAddReply = (e, commentId) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        const newReply = {
            id: "reply-" + Date.now(),
            authorName: user?.name || "Anonymous",
            authorAvatar: user?.profilePicture || user?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            content: replyText,
            createdAt: new Date().toISOString()
        };

        const updatedList = commentsList.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply]
                };
            }
            return comment;
        });

        setCommentsList(updatedList);
        setReplyText("");
        setActiveReplyId(null);

        try {
            const allComments = JSON.parse(localStorage.getItem("mock_db_comments") || "{}");
            allComments[post._id] = updatedList;
            localStorage.setItem("mock_db_comments", JSON.stringify(allComments));
        } catch (err) {
            console.error("Error saving reply:", err);
        }

        setCommentCount(prev => prev + 1);
    };

    const handleCopyLink = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const postLink = `${window.location.origin}/post/${post._id}`;
        navigator.clipboard.writeText(postLink)
            .then(() => {
                toast.success("Post link copied to clipboard! 📋");
            })
            .catch((err) => {
                console.error("Failed to copy link:", err);
            });
    };

    const handleDeletePost = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await API.delete(`/blogs/del-blog/${post._id}`);
            setIsDeleteDialogOpen(false);
            toast.success("Broadcast terminated successfully. 🗑️");
            setTimeout(() => {
                window.dispatchEvent(new Event("blog-deleted"));
            }, 500);
        } catch (err) {
            console.error("Error deleting post:", err);
            setIsDeleteDialogOpen(false);
            toast.error("Failed to delete the post. ❌");
        }
    };

    const handleShare = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const postLink = `${window.location.origin}/post/${post._id}`;
        const shareData = {
            title: post.title || "Check out this post on XDrop",
            text: post.content?.substring(0, 120) || "An interesting post on XDrop",
            url: postLink
        };

        try {
            if (navigator.share && navigator.canShare?.(shareData)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(postLink);
                toast.success("Post link copied to clipboard! 📋");
            }
        } catch (err) {
            // User cancelled share or error — fallback to clipboard
            if (err.name !== "AbortError") {
                try {
                    await navigator.clipboard.writeText(postLink);
                    toast.success("Post link copied to clipboard! 📋");
                } catch {
                    console.error("Share failed:", err);
                }
            }
        }
    };

    const renderCommentsPanel = (isOverlay = false) => {
        return (
            <div className={`space-y-4 ${isOverlay ? "h-full flex flex-col" : ""}`}>
                {/* New Comment Input */}
                <form onSubmit={handleAddComment} className="flex gap-3 items-start shrink-0">
                    <img
                        src={user?.profilePicture || user?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                        alt="User avatar"
                        className="h-8 w-8 rounded-full object-cover border border-primary/20 shrink-0"
                    />
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            placeholder="Add a public comment..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            className="flex-1 bg-muted/20 border border-primary/15 rounded-xl px-4 py-2 text-sm text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!newCommentText.trim()}
                            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:bg-primary/95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Comment
                        </button>
                    </div>
                </form>

                {/* Comments List */}
                <div className={`no-scrollbar space-y-4 pr-1 ${isOverlay ? "flex-1 overflow-y-auto" : "max-h-[350px] overflow-y-auto"}`}>
                    {commentsList.length === 0 ? (
                        <p className="text-center text-xs text-muted-foreground/60 py-4 italic">No comments yet. Start the conversation!</p>
                    ) : (
                        commentsList.map((comment) => (
                            <div key={comment.id} className="space-y-2 pb-1">
                                {/* Parent Comment */}
                                <div className="flex gap-2.5 items-start">
                                    <img
                                        src={comment.authorAvatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                        alt={comment.authorName}
                                        className="h-7 w-7 rounded-full object-cover border border-primary/10 shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xs font-bold text-foreground">{comment.authorName}</span>
                                            <span className="text-[9px] text-muted-foreground/60">
                                                {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5 whitespace-pre-wrap">{comment.content}</p>
                                        
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <button
                                                onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                                                className="text-[10px] font-bold text-primary hover:underline"
                                            >
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Replies (Nested 1-level) */}
                                {comment.replies && comment.replies.length > 0 && (
                                    <div className="ml-9 pl-3 border-l-2 border-primary/10 space-y-2">
                                        {comment.replies.map((reply) => (
                                            <div key={reply.id} className="flex gap-2 items-start py-1">
                                                <img
                                                    src={reply.authorAvatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                                    alt={reply.authorName}
                                                    className="h-5 w-5 rounded-full object-cover border border-primary/10 shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-[11px] font-bold text-foreground">{reply.authorName}</span>
                                                        <span className="text-[8px] text-muted-foreground/60">
                                                            {new Date(reply.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-0.5 whitespace-pre-wrap">{reply.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Inline Reply Input */}
                                {activeReplyId === comment.id && (
                                    <form
                                        onSubmit={(e) => handleAddReply(e, comment.id)}
                                        className="ml-9 pl-3 flex gap-2 items-start mt-2"
                                    >
                                        <img
                                            src={user?.profilePicture || user?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                            alt="User avatar"
                                            className="h-6 w-6 rounded-full object-cover border border-primary/20 shrink-0"
                                        />
                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="text"
                                                placeholder={`Reply to ${comment.authorName}...`}
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                className="flex-1 bg-muted/20 border border-primary/15 rounded-lg px-3 py-1 text-xs text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all"
                                                autoFocus
                                            />
                                            <div className="flex gap-1">
                                                <button
                                                    type="submit"
                                                    disabled={!replyText.trim()}
                                                    className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider hover:bg-primary/95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Reply
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setActiveReplyId(null);
                                                        setReplyText("");
                                                    }}
                                                    className="px-2.5 py-1 rounded-lg bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider hover:bg-muted/80 transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    const authorName = String(post.userId?.name || post.author?.name || (typeof post.author === 'string' ? post.author : '') || "Anonymous");
    const authorHandle = `@${authorName.replace(/\s+/g, "").toLowerCase()}`;
    const timeAgo = new Date(post.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
    });

    const isFeatured = !isGrid && (index + 1) % 5 === 0;

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
                            <span className="text-white font-bold text-sm">{authorName}</span>
                            {showFollowButton && (
                                <button
                                    onClick={handleFollow}
                                    className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md transition-all ${
                                        followed
                                            ? "text-white bg-white/20 border border-white/30 hover:bg-red-500/30 hover:border-red-500/40"
                                            : "text-white bg-white/10 border border-white/20 hover:bg-white/20"
                                    }`}
                                >
                                    {followed ? "Following" : "Follow"}
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-6 text-white/80">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 hover:text-pink-500 transition-colors ${liked ? "text-pink-500" : ""}`}
                            >
                                <Heart size={20} fill={liked ? "currentColor" : "none"} /> <span className="text-sm font-bold">{likeCount}</span>
                            </button>
                            <button
                                onClick={handleCommentClick}
                                className={`flex items-center gap-2 hover:text-blue-400 transition-colors ${showCommentsPanel ? "text-blue-400" : ""}`}
                            >
                                <MessageCircle size={20} fill={showCommentsPanel ? "currentColor" : "none"} /> <span className="text-sm font-bold">{commentCount}</span>
                            </button>
                            <button
                                onClick={handleSaveToggle}
                                className={`flex items-center gap-2 hover:text-primary transition-colors ${saved ? "text-primary" : ""}`}
                            >
                                <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 hover:text-primary transition-colors"
                            >
                                <Share size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Featured Card Glassmorphic Comments Overlay */}
                {showCommentsPanel && (
                    <div className="absolute inset-0 z-30 bg-background/95 backdrop-blur-xl p-4 sm:p-6 flex flex-col overflow-hidden">
                        {/* Title and Close button */}
                        <div className="flex items-center justify-between border-b border-border/20 pb-3 mb-4 shrink-0">
                            <h4 className="font-bold text-sm sm:text-base uppercase tracking-wider text-primary flex items-center gap-2">
                                <MessageCircle size={16} /> Comments ({commentCount})
                            </h4>
                            <button
                                onClick={() => setShowCommentsPanel(false)}
                                className="text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-foreground px-3 py-1 rounded-lg bg-muted/40 hover:bg-muted/65 transition-all"
                            >
                                Close
                            </button>
                        </div>
                        {/* Comments content */}
                        <div className="flex-1 overflow-hidden">
                            {renderCommentsPanel(true)}
                        </div>
                    </div>
                )}
            </motion.div>
        );
    }

    if (isGrid) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (index % 5) * 0.08, type: "spring" }}
                className="h-[480px] w-full flex flex-col p-5 rounded-[28px] glass-card border border-primary/5 hover:border-primary/20 shadow-lg hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 group relative justify-between overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-3 shrink-0">
                    <div className="flex items-center gap-3.5 min-w-0">
                        <Link to={`/profile/${post.userId?._id || post.author?._id || ""}`} className="shrink-0">
                            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-border/40 group-hover:border-primary/50 transition-colors">
                                <img
                                    src={post.userId?.profilePicture || post.author?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                    alt={authorName}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </Link>
                        <div className="flex flex-col min-w-0">
                            <Link to={`/profile/${post.userId?._id || post.author?._id || ""}`} className="font-bold text-foreground text-sm truncate hover:text-primary transition-colors leading-snug">
                                {authorName}
                            </Link>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none mt-0.5">{timeAgo}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                        {showFollowButton && (
                            <button
                                onClick={handleFollow}
                                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full transition-all shrink-0 ${
                                    followed
                                        ? "text-primary bg-primary/10 border border-primary/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                                        : "text-primary hover:bg-primary/10"
                                }`}
                            >
                                {followed ? "Following" : "Follow"}
                            </button>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button 
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
                                    className="text-muted-foreground hover:text-primary p-1.5 rounded-full hover:bg-primary/10 transition-all focus:outline-none"
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 glass-panel mt-1 rounded-xl p-1 border-primary/20">
                                <DropdownMenuItem 
                                    onClick={handleCopyLink} 
                                    className="rounded-lg font-bold cursor-pointer hover:bg-primary/10 focus:bg-primary/10 text-xs py-2 px-3"
                                >
                                    Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={handleSaveToggle} 
                                    className="rounded-lg font-bold cursor-pointer hover:bg-primary/10 focus:bg-primary/10 text-xs py-2 px-3"
                                >
                                    {saved ? "Unsaved" : "Saved"}
                                </DropdownMenuItem>
                                {String(currentUserId) === String(postUserId) && (
                                    <>
                                        <DropdownMenuSeparator className="bg-primary/10 my-1" />
                                        <DropdownMenuItem 
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/dashboard/edit/${post._id}`); }} 
                                            className="rounded-lg font-bold cursor-pointer hover:bg-primary/10 focus:bg-primary/10 text-xs py-2 px-3"
                                        >
                                            Edit Post
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={handleDeletePost} 
                                            className="rounded-lg font-bold cursor-pointer text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 text-xs py-2 px-3"
                                        >
                                            Delete Post
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col justify-start overflow-hidden min-w-0">
                    <Link to={`/post/${post._id}`} className="block">
                        <h3 className="text-[17px] font-extrabold mb-1.5 text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
                            {post.title}
                        </h3>
                        <div className="h-[1px] w-8 bg-primary/30 mb-2.5 group-hover:w-full transition-all duration-500" />
                    </Link>

                    {/* Image / Placeholder */}
                    <Link to={`/post/${post._id}`} className="block relative w-full h-[140px] rounded-2xl overflow-hidden border border-border/40 bg-muted/20 shrink-0 mb-3 group-hover:shadow-md transition-all duration-300">
                        {post.image?.url || post.coverImage || (post.image && typeof post.image === 'string') ? (
                            <OptimizedImage
                                src={post.image?.url || post.coverImage || post.image}
                                alt="Post cover"
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
                        {post.content}
                    </p>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3 shrink-0">
                        {post.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-border/10 text-muted-foreground shrink-0 mt-auto">
                    <button
                        onClick={handleCommentClick}
                        className={`flex items-center gap-1.5 group/btn hover:text-blue-500 transition-colors text-[10px] font-black uppercase tracking-wider ${showCommentsPanel ? "text-blue-500" : ""}`}
                    >
                        <div className="p-1.5 rounded-full group-hover/btn:bg-blue-500/10 transition-all">
                            <MessageCircle size={15} fill={showCommentsPanel ? "currentColor" : "none"} />
                        </div>
                        <span>{commentCount}</span>
                    </button>

                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1.5 group/btn hover:text-pink-500 transition-colors text-[10px] font-black uppercase tracking-wider ${liked ? "text-pink-500" : ""}`}
                    >
                        <div className="p-1.5 rounded-full group-hover/btn:bg-pink-500/10 transition-all">
                            <Heart size={15} fill={liked ? "currentColor" : "none"} />
                        </div>
                        <span>{likeCount}</span>
                    </button>

                    <button
                        onClick={handleSaveToggle}
                        className={`flex items-center gap-1.5 group/btn hover:text-primary transition-colors ${saved ? "text-primary" : ""}`}
                    >
                        <div className="p-1.5 rounded-full group-hover/btn:bg-primary/10 transition-all">
                            <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
                        </div>
                    </button>

                    <button 
                        onClick={handleShare}
                        className="flex items-center gap-1.5 group/btn hover:text-primary transition-colors"
                    >
                        <div className="p-1.5 rounded-full group-hover/btn:bg-primary/10 transition-all">
                            <Share size={15} />
                        </div>
                    </button>
                </div>

                {/* Overlay Comments Drawer */}
                {showCommentsPanel && (
                    <div className="absolute inset-0 z-30 bg-background/95 backdrop-blur-xl p-4 flex flex-col overflow-hidden rounded-[28px]">
                        <div className="flex items-center justify-between border-b border-border/20 pb-2 mb-3 shrink-0">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
                                <MessageCircle size={14} /> Comments ({commentCount})
                            </h4>
                            <button
                                onClick={() => setShowCommentsPanel(false)}
                                className="text-[9px] font-black uppercase tracking-wider text-muted-foreground hover:text-foreground px-2.5 py-0.5 rounded-lg bg-muted/40 hover:bg-muted/65 transition-all"
                            >
                                Close
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            {renderCommentsPanel(true)}
                        </div>
                    </div>
                )}
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
                        <div className="flex items-center gap-2 text-[14px] min-w-0">
                            <Link to={`/profile/${post.userId?._id || post.author?._id || ""}`} className="font-bold text-foreground hover:text-primary transition-colors truncate">
                                {authorName}
                            </Link>
                            {showFollowButton && (
                                <>
                                    <span className="text-muted-foreground/40">·</span>
                                    <button
                                        onClick={handleFollow}
                                        className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full transition-all shrink-0 ${
                                            followed
                                                ? "text-primary bg-primary/10 border border-primary/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                                                : "text-primary hover:bg-primary/10"
                                        }`}
                                    >
                                        {followed ? "Following" : "Follow"}
                                    </button>
                                </>
                            )}
                            <span className="text-muted-foreground/40">·</span>
                            <span className="text-muted-foreground/60 text-xs">{timeAgo}</span>
                        </div>
                        
                        {/* Interactive Options Menu (Three Dots) */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button 
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
                                    className="text-muted-foreground hover:text-primary p-1.5 rounded-full hover:bg-primary/10 transition-all focus:outline-none"
                                >
                                    <MoreHorizontal size={18} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 glass-panel mt-1 rounded-xl p-1 border-primary/20">
                                <DropdownMenuItem 
                                    onClick={handleCopyLink} 
                                    className="rounded-lg font-bold cursor-pointer hover:bg-primary/10 focus:bg-primary/10 text-xs py-2 px-3"
                                >
                                    Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={handleSaveToggle} 
                                    className="rounded-lg font-bold cursor-pointer hover:bg-primary/10 focus:bg-primary/10 text-xs py-2 px-3"
                                >
                                    {saved ? "Unsaved" : "Saved"}
                                </DropdownMenuItem>
                                {String(currentUserId) === String(postUserId) && (
                                    <>
                                        <DropdownMenuSeparator className="bg-primary/10 my-1" />
                                        <DropdownMenuItem 
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/dashboard/edit/${post._id}`); }} 
                                            className="rounded-lg font-bold cursor-pointer hover:bg-primary/10 focus:bg-primary/10 text-xs py-2 px-3"
                                        >
                                            Edit Post
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={handleDeletePost} 
                                            className="rounded-lg font-bold cursor-pointer text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 text-xs py-2 px-3"
                                        >
                                            Delete Post
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Post Content */}
                    <Link to={`/post/${post._id}`} className="block">
                        {post.title && (
                            <h3 className="text-xl font-extrabold mb-2 text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
                                {post.title}
                            </h3>
                        )}
                        <div className="h-[1px] w-12 bg-primary/30 mb-3 group-hover:w-full transition-all duration-500" />
                        <p className="text-[15px] leading-relaxed text-muted-foreground line-clamp-3">
                            {post.content}
                        </p>
                    </Link>

                    {/* Post Image */}
                    {(post.image?.url || post.coverImage || (post.image && typeof post.image === 'string')) && (
                        <div className="mt-4 rounded-2xl overflow-hidden border border-border/40 bg-muted/20 aspect-[16/9] w-full max-h-[300px]">
                            <OptimizedImage
                                src={post.image?.url || post.coverImage || post.image}
                                alt="Post content"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
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
                            onClick={handleCommentClick}
                            className={`flex items-center gap-2 group/btn hover:text-blue-500 transition-colors text-xs font-bold uppercase tracking-wider ${showCommentsPanel ? "text-blue-500" : ""}`}
                        >
                            <div className="p-2 rounded-full group-hover/btn:bg-blue-500/10 group-active/btn:scale-90 transition-all">
                                <MessageCircle size={18} fill={showCommentsPanel ? "currentColor" : "none"} />
                            </div>
                            <span>{commentCount}</span>
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

                        <button
                            onClick={handleSaveToggle}
                            className={`flex items-center gap-2 group/btn hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider ${saved ? "text-primary" : ""}`}
                        >
                            <div className="p-2 rounded-full group-hover/btn:bg-primary/10 group-active/btn:scale-90 transition-all">
                                <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
                            </div>
                        </button>

                        <button 
                            onClick={handleShare}
                            className="flex items-center gap-2 group/btn hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider"
                        >
                            <div className="p-2 rounded-full group-hover/btn:bg-primary/10 group-active/btn:scale-90 transition-all">
                                <Share size={18} />
                            </div>
                        </button>
                    </div>

                    {/* Regular Card Collapsible Comments Panel */}
                    {showCommentsPanel && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t border-border/20 overflow-hidden"
                        >
                            {renderCommentsPanel(false)}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Custom Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="glass-panel border-primary/15 max-w-sm w-[90%] rounded-[32px] p-6 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="mb-4 space-y-2">
                        <DialogTitle className="text-xl font-extrabold tracking-tighter flex items-center gap-2">
                            <ShieldAlert size={18} className="text-red-500 animate-pulse" /> Delete Broadcast?
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground font-semibold text-xs leading-normal">
                            Are you sure you want to permanently terminate this broadcast? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-3 mt-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/10 hover:bg-primary/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                        >
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </motion.div>
    );
}

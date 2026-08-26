import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../../../lib/secureApi.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { Button } from "@/components/ui/button";
import { 
    Trash, Edit, ArrowLeft, Clock, Calendar, Sparkles, Heart, 
    MessageCircle, Bookmark, Share, UserPlus, UserCheck, ShieldAlert, 
    RotateCcw, Activity, Send, Check 
} from "lucide-react";
import PageTransition from "@/components/layout/PageTransition.jsx";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import toast from "react-hot-toast";

// Skeleton Loader Component
function PostDetailsSkeleton() {
    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-pulse">
            {/* Navigation & Action Skeletons */}
            <div className="flex items-center justify-between">
                <div className="h-9 w-20 bg-muted/40 rounded-xl" />
                <div className="flex gap-2">
                    <div className="h-9 w-9 bg-muted/40 rounded-xl" />
                    <div className="h-9 w-9 bg-muted/40 rounded-xl" />
                </div>
            </div>

            {/* Author Header Skeleton */}
            <div className="flex items-center gap-3.5 pt-2">
                <div className="h-12 w-12 rounded-full bg-muted/40 shrink-0" />
                <div className="space-y-2 flex-1">
                    <div className="h-4 w-40 bg-muted/40 rounded-md" />
                    <div className="h-3 w-28 bg-muted/30 rounded-md" />
                </div>
                <div className="h-8 w-24 bg-muted/30 rounded-full" />
            </div>

            {/* Title Skeleton */}
            <div className="space-y-3 pt-2">
                <div className="h-9 w-full bg-muted/40 rounded-xl" />
                <div className="h-9 w-4/5 bg-muted/40 rounded-xl" />
            </div>

            {/* Cover Image Skeleton */}
            <div className="h-[300px] sm:h-[400px] w-full bg-muted/30 rounded-3xl" />

            {/* Body Paragraph Skeletons */}
            <div className="space-y-4 pt-4">
                <div className="h-4 w-full bg-muted/30 rounded-md" />
                <div className="h-4 w-11/12 bg-muted/30 rounded-md" />
                <div className="h-4 w-4/5 bg-muted/30 rounded-md" />
                <div className="h-4 w-full bg-muted/30 rounded-md" />
                <div className="h-4 w-3/4 bg-muted/30 rounded-md" />
            </div>

            {/* Engagement Bar Skeleton */}
            <div className="h-14 w-full bg-muted/20 rounded-2xl border border-primary/10" />
        </div>
    );
}

export default function PostDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [readProgress, setReadProgress] = useState(0);

    // Social States
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLikesDialogOpen, setIsLikesDialogOpen] = useState(false);
    const [likesLoading, setLikesLoading] = useState(false);
    const [likedUsers, setLikedUsers] = useState([]);

    const [followingList, setFollowingList] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("mock_db_following") || "[]");
        } catch {
            return [];
        }
    });

    const [followed, setFollowed] = useState(false);

    const [saved, setSaved] = useState(() => {
        try {
            const savedIds = JSON.parse(localStorage.getItem("mock_db_saved_blogs") || "[]");
            return savedIds.includes(id);
        } catch {
            return false;
        }
    });

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Comments State
    const [commentsList, setCommentsList] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const [newCommentText, setNewCommentText] = useState("");
    const [replyText, setReplyText] = useState("");
    const [activeReplyId, setActiveReplyId] = useState(null);

    const scrollContainerRef = useRef(null);
    const commentsSectionRef = useRef(null);

    // Fetch Post Details
    const fetchPostDetails = useCallback(() => {
        setLoading(true);
        setIsError(false);
        API.get(`/blogs/post/${id}`)
            .then((res) => {
                const fetchedPost = res.data?.blog || res.data?.data?.blog || res.data;
                setPost(fetchedPost);

                if (fetchedPost) {
                    // Likes initialization
                    const currentUserId = user?._id || user?.id || user?.userId;
                    if (Array.isArray(fetchedPost.likes)) {
                        setLiked(fetchedPost.likes.includes(currentUserId));
                        setLikeCount(fetchedPost.likes.length);
                    } else {
                        setLikeCount(fetchedPost.likeCount || (typeof fetchedPost.likes === "number" ? fetchedPost.likes : 0));
                    }

                    // Author follow status
                    const authorId = String(fetchedPost.userId?._id || fetchedPost.userId || fetchedPost.author?._id || fetchedPost.author || "");
                    const currentFollowing = JSON.parse(localStorage.getItem("mock_db_following") || "[]");
                    setFollowed(currentFollowing.includes(authorId));

                    // Load saved state
                    const savedIds = JSON.parse(localStorage.getItem("mock_db_saved_blogs") || "[]");
                    setSaved(savedIds.includes(fetchedPost._id));

                    // Load comments
                    const allComments = JSON.parse(localStorage.getItem("mock_db_comments") || "{}");
                    const postComments = allComments[fetchedPost._id] || fetchedPost.comments || [];
                    setCommentsList(postComments);

                    let cCount = 0;
                    postComments.forEach(c => {
                        cCount++;
                        if (c.replies) cCount += c.replies.length;
                    });
                    setCommentCount(cCount > 0 ? cCount : (fetchedPost.commentCount || 0));
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching post details:", err);
                setIsError(true);
                setLoading(false);
            });
    }, [id, user]);

    useEffect(() => {
        fetchPostDetails();
    }, [fetchPostDetails]);

    // Keep follow list in sync
    useEffect(() => {
        const syncFollowing = () => {
            try {
                const ids = JSON.parse(localStorage.getItem("mock_db_following") || "[]");
                setFollowingList(ids);
                if (post) {
                    const authorId = String(post.userId?._id || post.userId || post.author?._id || post.author || "");
                    setFollowed(ids.includes(authorId));
                }
            } catch (err) {
                console.error(err);
            }
        };
        window.addEventListener("following-change", syncFollowing);
        return () => window.removeEventListener("following-change", syncFollowing);
    }, [post]);

    // Scroll Progress Bar Handler
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer || !post) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
            if (scrollHeight - clientHeight <= 0) {
                setReadProgress(100);
                return;
            }
            const progress = Math.min((scrollTop / (scrollHeight - clientHeight)) * 100, 100);
            setReadProgress(progress);
        };

        scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
        return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }, [post]);

    // Redirect after deletion
    useEffect(() => {
        if (deleted) {
            const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
            const redirect = setTimeout(() => navigate("/dashboard/posts"), 3000);
            return () => {
                clearTimeout(redirect);
                clearInterval(timer);
            };
        }
    }, [deleted, navigate]);

    // Like Toggle Handler
    const handleLike = async () => {
        try {
            const res = await API.post(`/blogs/like/${post._id}`);
            if (res.data.success) {
                setLiked(res.data.liked);
                setLikeCount(res.data.likeCount);
            }
        } catch (err) {
            console.error("Error toggling like:", err);
            setLiked(prev => !prev);
            setLikeCount(prev => (liked ? prev - 1 : prev + 1));
        }
    };

    // Open Liked By Modal
    const handleOpenLikesModal = async () => {
        setIsLikesDialogOpen(true);
        setLikesLoading(true);
        try {
            const res = await API.get(`/blogs/post/${post._id}/likes`);
            if (res.data.success) {
                setLikedUsers(res.data.likes);
            }
        } catch (err) {
            console.error("Error fetching likes list:", err);
            setLikedUsers([]);
        } finally {
            setLikesLoading(false);
        }
    };

    // Follow Toggle Handler
    const handleFollowAuthor = () => {
        try {
            const authorId = String(post.userId?._id || post.userId || post.author?._id || post.author || "");
            if (!authorId) return;

            const followingIds = JSON.parse(localStorage.getItem("mock_db_following") || "[]");
            let newFollowingIds;
            if (followed) {
                newFollowingIds = followingIds.filter(id => id !== authorId);
            } else {
                newFollowingIds = [...followingIds, authorId];
            }
            localStorage.setItem("mock_db_following", JSON.stringify(newFollowingIds));
            setFollowed(!followed);
            setFollowingList(newFollowingIds);
            window.dispatchEvent(new Event("following-change"));
        } catch (err) {
            console.error("Error toggling follow:", err);
        }
    };

    // Save/Bookmark Toggle Handler
    const handleSaveToggle = () => {
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
            toast.success(saved ? "Removed from Saved" : "Saved to Bookmarks ✨");
        } catch (err) {
            console.error("Error toggling saved state:", err);
        }
    };

    // Share Handler
    const handleShare = async () => {
        const postLink = `${window.location.origin}/post/${post._id}`;
        const shareData = {
            title: post.title || "Check out this publication on XDrop",
            text: post.content?.substring(0, 120) || "An interesting broadcast on XDrop",
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
            if (err.name !== "AbortError") {
                await navigator.clipboard.writeText(postLink);
                toast.success("Post link copied to clipboard! 📋");
            }
        }
    };

    // Delete Confirmation
    const handleConfirmDelete = async () => {
        try {
            await API.delete(`/blogs/del-blog/${id}`);
            setIsDeleteDialogOpen(false);
            setDeleted(true);
            toast.success("Broadcast terminated successfully. 🗑️");
            window.dispatchEvent(new Event("blog-deleted"));
        } catch {
            setIsDeleteDialogOpen(false);
            toast.error("Failed to delete post ❌");
        }
    };

    // Add Comment Handler
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
        toast.success("Comment posted ✨");
    };

    // Add Reply Handler
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
        toast.success("Reply posted ✨");
    };

    const scrollToComments = () => {
        commentsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Render Loading State
    if (loading) return <PostDetailsSkeleton />;

    // Render Deleted State
    if (deleted) {
        return (
            <PageTransition className="flex flex-col items-center justify-center min-h-[70vh] px-4">
                <div className="p-8 sm:p-12 text-center glass-panel rounded-[40px] border-emerald-500/20 bg-emerald-500/5 max-w-md shadow-2xl">
                    <div className="h-16 w-16 bg-emerald-500/20 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Sparkles size={36} />
                    </div>
                    <h2 className="text-2xl font-black text-foreground mb-3">Signal Terminated</h2>
                    <p className="text-xs text-muted-foreground font-medium mb-6 leading-relaxed">
                        The broadcast transmission has been successfully removed from the network.<br />
                        Redirecting in <span className="text-primary font-black">{countdown}s</span>...
                    </p>
                    <Button
                        variant="outline"
                        className="rounded-2xl h-11 px-6 font-bold text-xs uppercase tracking-wider border-primary/20 hover:bg-primary/5 cursor-pointer"
                        onClick={() => navigate("/dashboard/posts")}
                    >
                        Return to Workspace Now
                    </Button>
                </div>
            </PageTransition>
        );
    }

    // Render Error State
    if (isError || (!loading && !post)) {
        return (
            <PageTransition className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <div className="p-8 sm:p-12 text-center glass-panel rounded-[36px] border-primary/15 bg-primary/5 max-w-md w-full space-y-5 shadow-2xl">
                    <div className="h-16 w-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto border border-primary/20">
                        <Activity size={32} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black text-foreground">Signal Not Found</h3>
                        <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">
                            The requested publication could not be located or network transmission failed.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Button
                            onClick={fetchPostDetails}
                            className="h-11 px-5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider gap-2 shadow-lg shadow-primary/20 cursor-pointer"
                        >
                            <RotateCcw size={15} /> Retry Signal
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate("/feed")}
                            className="h-11 px-5 rounded-2xl font-bold text-xs uppercase tracking-wider border-primary/20 hover:bg-primary/5 cursor-pointer"
                        >
                            Back to Feed
                        </Button>
                    </div>
                </div>
            </PageTransition>
        );
    }

    // Helper calculations
    const authorName = String(post.userId?.name || post.author?.name || (typeof post.author === 'string' ? post.author : '') || "Anonymous");
    const authorHandle = `@${authorName.replace(/\s+/g, "").toLowerCase()}`;
    const authorAvatar = post.userId?.profilePicture || post.author?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    const authorBio = post.userId?.bio || post.author?.bio || "Digital story architect broadcasting frequency signals on XDrop.";
    const authorProfession = post.userId?.profession || post.author?.profession || "Content Creator";
    const authorId = String(post.userId?._id || post.userId || post.author?._id || post.author || "");

    const currentUserId = user?._id || user?.id || user?.userId;
    const isOwner = !!user && String(currentUserId) === String(authorId) && authorId !== "";
    const showFollowButton = !!user && !isOwner && authorId !== "";
    const readingTime = Math.max(1, Math.ceil((post.content?.split(' ').length || 0) / 200));
    const publishedDate = new Date(post.createdAt || Date.now()).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="relative h-full flex flex-col overflow-hidden">
            {/* Reading Progress Indicator */}
            <div className="sticky top-0 z-50 w-full h-1 bg-muted/20 shrink-0">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-r-full"
                    style={{ width: `${readProgress}%` }}
                    transition={{ duration: 0.1 }}
                />
            </div>

            {/* Scrollable Editorial Container */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar">
                <PageTransition className="max-w-3xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-8 pb-32">
                    
                    {/* Top Navigation & Action Header */}
                    <div className="flex items-center justify-between gap-4">
                        <Button 
                            variant="ghost" 
                            onClick={() => navigate(-1)} 
                            className="gap-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/10 cursor-pointer pl-2"
                        >
                            <ArrowLeft size={16} /> Back
                        </Button>

                        {isOwner && (
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => navigate(`/dashboard/edit/${id}`)} 
                                    className="h-9 px-3.5 rounded-xl border-primary/20 hover:bg-primary/10 hover:text-primary gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                                >
                                    <Edit size={15} /> Edit
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setIsDeleteDialogOpen(true)} 
                                    className="h-9 px-3.5 rounded-xl border-red-500/20 text-red-500 hover:bg-red-500/10 hover:border-red-500/30 gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                                >
                                    <Trash size={15} /> Delete
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Author Metadata Header */}
                    <div className="flex items-center justify-between gap-4 pt-2 border-b border-primary/10 pb-6">
                        <div className="flex items-center gap-3.5 min-w-0">
                            <Link to={`/profile/${authorId}`} className="shrink-0">
                                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors">
                                    <img src={authorAvatar} alt={authorName} className="h-full w-full object-cover" />
                                </div>
                            </Link>
                            <div className="flex flex-col min-w-0">
                                <Link to={`/profile/${authorId}`} className="font-extrabold text-foreground text-sm sm:text-base hover:text-primary transition-colors truncate">
                                    {authorName}
                                </Link>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground/70 font-medium truncate">
                                    <span>{authorHandle}</span>
                                    <span>·</span>
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {publishedDate}</span>
                                    <span>·</span>
                                    <span className="flex items-center gap-1"><Clock size={12} /> {readingTime} min read</span>
                                </div>
                            </div>
                        </div>

                        {showFollowButton && (
                            <Button
                                onClick={handleFollowAuthor}
                                size="sm"
                                className={`rounded-full h-8 px-4 text-xs font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                                    followed
                                        ? "bg-primary/10 text-primary border border-primary/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                                }`}
                            >
                                {followed ? (
                                    <span className="flex items-center gap-1.5"><UserCheck size={14} /> Following</span>
                                ) : (
                                    <span className="flex items-center gap-1.5"><UserPlus size={14} /> Follow</span>
                                )}
                            </Button>
                        )}
                    </div>

                    {/* Article Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.18] text-foreground">
                        {post.title}
                    </h1>

                    {/* Cover Image */}
                    {(post.image?.url || post.coverImage || (post.image && typeof post.image === 'string')) && (
                        <div className="rounded-3xl overflow-hidden border border-primary/15 bg-muted/20 shadow-xl max-h-[440px] aspect-[16/9] w-full">
                            <OptimizedImage
                                src={post.image?.url || post.coverImage || post.image}
                                alt={post.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    )}

                    {/* Editorial Article Body */}
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p className="text-base sm:text-lg leading-[1.8] text-foreground/90 font-normal font-sans space-y-6 whitespace-pre-line">
                            {post.content}
                        </p>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-6 border-t border-primary/10">
                            {post.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Floating / Sticky Interactive Engagement Bar */}
                    <div className="sticky bottom-6 z-30 glass-panel border border-primary/20 p-3 sm:p-4 rounded-3xl shadow-2xl bg-background/85 backdrop-blur-xl flex items-center justify-between max-w-xl mx-auto">
                        {/* Like Action */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleLike}
                                aria-label="Like post"
                                className={`p-2.5 rounded-2xl hover:bg-pink-500/10 transition-all ${liked ? "text-pink-500" : "text-muted-foreground hover:text-pink-500"}`}
                            >
                                <Heart size={20} fill={liked ? "currentColor" : "none"} />
                            </button>
                            <span
                                onClick={handleOpenLikesModal}
                                className="text-xs font-extrabold text-foreground hover:underline cursor-pointer px-1"
                            >
                                {likeCount} likes
                            </span>
                        </div>

                        {/* Comments Action */}
                        <button
                            onClick={scrollToComments}
                            aria-label="Scroll to comments"
                            className="flex items-center gap-2 p-2.5 rounded-2xl text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 transition-all"
                        >
                            <MessageCircle size={20} />
                            <span className="text-xs font-extrabold">{commentCount} comments</span>
                        </button>

                        {/* Bookmark Action */}
                        <button
                            onClick={handleSaveToggle}
                            aria-label="Bookmark post"
                            className={`p-2.5 rounded-2xl hover:bg-primary/10 transition-all ${saved ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                        >
                            <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
                        </button>

                        {/* Share Action */}
                        <button
                            onClick={handleShare}
                            aria-label="Share post"
                            className="p-2.5 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                        >
                            <Share size={20} />
                        </button>
                    </div>

                    {/* Post Author Profile Footer Section */}
                    <div className="glass-panel p-6 sm:p-8 rounded-[32px] border border-primary/15 bg-primary/5 space-y-4 shadow-xl">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Link to={`/profile/${authorId}`}>
                                    <img src={authorAvatar} alt={authorName} className="h-14 w-14 rounded-2xl object-cover border border-primary/20 shadow-md" />
                                </Link>
                                <div>
                                    <h3 className="font-extrabold text-foreground text-lg">{authorName}</h3>
                                    <p className="text-xs text-muted-foreground/70 font-semibold">{authorProfession}</p>
                                </div>
                            </div>
                            {showFollowButton && (
                                <Button
                                    onClick={handleFollowAuthor}
                                    size="sm"
                                    className={`rounded-full h-8 px-4 text-xs font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                                        followed
                                            ? "bg-primary/10 text-primary border border-primary/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                                            : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                                    }`}
                                >
                                    {followed ? "Following" : "Follow"}
                                </Button>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                            {authorBio}
                        </p>
                    </div>

                    {/* Comments Thread Section */}
                    <div ref={commentsSectionRef} className="pt-6 space-y-6">
                        <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                                <MessageCircle size={20} className="text-primary" /> Community Signals ({commentCount})
                            </h3>
                        </div>

                        {/* Add Comment Form */}
                        <form onSubmit={handleAddComment} className="flex gap-3 items-start">
                            <img
                                src={user?.profilePicture || user?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                alt="User avatar"
                                className="h-10 w-10 rounded-full object-cover border border-primary/20 shrink-0"
                            />
                            <div className="flex-1 space-y-2">
                                <textarea
                                    rows={2}
                                    placeholder="Add to the frequency signal discussion..."
                                    value={newCommentText}
                                    onChange={(e) => setNewCommentText(e.target.value)}
                                    className="w-full bg-muted/20 border border-primary/15 rounded-2xl p-3 text-xs text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all resize-none"
                                />
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={!newCommentText.trim()}
                                        className="h-9 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-primary/20"
                                    >
                                        Broadcast Comment
                                    </Button>
                                </div>
                            </div>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-4 pt-2">
                            {commentsList.length === 0 ? (
                                <div className="text-center py-10 glass-panel rounded-3xl border-primary/10">
                                    <p className="text-xs text-muted-foreground/70 font-medium italic">No comments broadcasted yet. Start the conversation!</p>
                                </div>
                            ) : (
                                commentsList.map((comment) => (
                                    <div key={comment.id} className="p-4 rounded-2xl glass-card border border-primary/10 space-y-3">
                                        {/* Parent Comment */}
                                        <div className="flex gap-3 items-start">
                                            <img
                                                src={comment.authorAvatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                                alt={comment.authorName}
                                                className="h-8 w-8 rounded-full object-cover border border-primary/15 shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-xs font-bold text-foreground">{comment.authorName}</span>
                                                    <span className="text-[10px] text-muted-foreground/60">
                                                        {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                                                
                                                <div className="flex items-center gap-3 mt-2">
                                                    <button
                                                        onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                                                        className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                                                    >
                                                        Reply
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Replies (Nested 1-level) */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="ml-9 pl-3 border-l-2 border-primary/15 space-y-3 pt-1">
                                                {comment.replies.map((reply) => (
                                                    <div key={reply.id} className="flex gap-2.5 items-start">
                                                        <img
                                                            src={reply.authorAvatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                                            alt={reply.authorName}
                                                            className="h-6 w-6 rounded-full object-cover border border-primary/10 shrink-0"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-baseline gap-2">
                                                                <span className="text-[11px] font-bold text-foreground">{reply.authorName}</span>
                                                                <span className="text-[9px] text-muted-foreground/60">
                                                                    {new Date(reply.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground mt-0.5 whitespace-pre-wrap leading-relaxed">{reply.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Inline Reply Input */}
                                        {activeReplyId === comment.id && (
                                            <form
                                                onSubmit={(e) => handleAddReply(e, comment.id)}
                                                className="ml-9 pl-3 flex gap-2 items-center pt-2"
                                            >
                                                <input
                                                    type="text"
                                                    placeholder={`Reply to ${comment.authorName}...`}
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    className="flex-1 bg-muted/20 border border-primary/15 rounded-xl px-3 py-1.5 text-xs text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all"
                                                    autoFocus
                                                />
                                                <Button
                                                    type="submit"
                                                    disabled={!replyText.trim()}
                                                    size="sm"
                                                    className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                                                >
                                                    Reply
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => { setActiveReplyId(null); setReplyText(""); }}
                                                    className="h-8 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                                                >
                                                    Cancel
                                                </Button>
                                            </form>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </PageTransition>
            </div>

            {/* Custom Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="glass-panel border-primary/15 max-w-sm w-[90%] rounded-[32px] p-6 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="mb-4 space-y-2">
                        <DialogTitle className="text-xl font-extrabold tracking-tighter flex items-center gap-2">
                            <ShieldAlert size={18} className="text-red-500 animate-pulse" /> Delete Publication?
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground font-semibold text-xs leading-normal">
                            Are you sure you want to permanently terminate this broadcast? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-3 mt-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/10 hover:bg-primary/5 cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 cursor-pointer"
                        >
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Custom Liked by Dialog */}
            <Dialog open={isLikesDialogOpen} onOpenChange={setIsLikesDialogOpen}>
                <DialogContent className="glass-panel border-primary/15 max-w-sm w-[90%] rounded-[32px] p-6 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-lg font-extrabold tracking-tighter flex items-center gap-2">
                            <Heart size={16} fill="currentColor" className="text-pink-500" /> Liked by
                        </DialogTitle>
                        <DialogDescription className="text-[10px] text-muted-foreground/60 font-semibold uppercase tracking-wider">
                            {likeCount} {likeCount === 1 ? "person" : "people"} appreciated this broadcast
                        </DialogDescription>
                    </DialogHeader>
                    
                    {likesLoading ? (
                        <div className="flex h-36 items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        </div>
                    ) : likedUsers.length === 0 ? (
                        <p className="text-center text-xs text-muted-foreground/60 py-8 italic">No likes recorded yet.</p>
                    ) : (
                        <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                            {likedUsers.map((likedUser) => {
                                const isMe = String(likedUser._id) === String(currentUserId);
                                const isFollowingUser = followingList.includes(String(likedUser._id));
                                
                                return (
                                    <div key={likedUser._id} className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-primary/5 transition-all">
                                        <div 
                                            onClick={() => {
                                                setIsLikesDialogOpen(false);
                                                navigate(`/profile/${likedUser._id}`);
                                            }}
                                            className="flex items-center gap-2.5 min-w-0 cursor-pointer"
                                        >
                                            <div className="h-10 w-10 rounded-full overflow-hidden border border-border/40 shrink-0">
                                                {likedUser.profilePicture ? (
                                                    <img src={likedUser.profilePicture} alt={likedUser.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold font-mono">
                                                        {likedUser.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-black text-foreground truncate">{likedUser.name}</p>
                                                <p className="text-[10px] text-muted-foreground/60 truncate">@{likedUser.username}</p>
                                            </div>
                                        </div>
                                        
                                        {!isMe && likedUser._id !== "anonymous" && (
                                            <button
                                                onClick={() => {
                                                    try {
                                                        const targetId = String(likedUser._id);
                                                        const followingIds = JSON.parse(localStorage.getItem("mock_db_following") || "[]");
                                                        let newFollowingIds;
                                                        if (followingList.includes(targetId)) {
                                                            newFollowingIds = followingIds.filter(id => id !== targetId);
                                                        } else {
                                                            newFollowingIds = [...followingIds, targetId];
                                                        }
                                                        localStorage.setItem("mock_db_following", JSON.stringify(newFollowingIds));
                                                        setFollowingList(newFollowingIds);
                                                        window.dispatchEvent(new Event("following-change"));
                                                    } catch (err) {
                                                        console.error(err);
                                                    }
                                                }}
                                                className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full transition-all shrink-0 border cursor-pointer ${
                                                    isFollowingUser
                                                        ? "bg-primary/10 text-primary border-primary/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                                                        : "bg-primary text-primary-foreground border-transparent hover:bg-primary/90"
                                                }`}
                                            >
                                                {isFollowingUser ? "Following" : "Follow"}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

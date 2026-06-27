import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../../../lib/api.js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, Edit, ArrowLeft, Clock, User, Calendar, Sparkles, Heart, MessageCircle, Bookmark, Share, UserPlus, UserCheck, ShieldAlert, Check } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition.jsx";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import toast from "react-hot-toast";

export default function PostDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleted, setDeleted] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [readProgress, setReadProgress] = useState(0);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const contentRef = useRef(null);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        API.get(`/blogs/post/${id}`)
            .then((res) => {
                setPost(res.data.blog);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [id]);

    // Reading progress bar scroll handler
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

    useEffect(() => {
        if (deleted) {
            const timer = setInterval(() => {
                setCountdown((c) => c - 1);
            }, 1000);
            const redirect = setTimeout(() => {
                navigate("/dashboard/posts");
            }, 3000);

            return () => {
                clearTimeout(redirect);
                clearInterval(timer);
            };
        }
    }, [deleted, navigate]);

    const handleConfirmDelete = async () => {
        try {
            await API.delete(`/blogs/del-blog/${id}`);
            setIsDeleteDialogOpen(false);
            setDeleted(true);
            toast.success("Broadcast terminated successfully. 🗑️");
        } catch {
            setIsDeleteDialogOpen(false);
            toast.error("Failed to delete post ❌");
        }
    };


    if (loading) return (
        <div className="flex h-[50vh] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg shadow-primary/20"></div>
        </div>
    );

    if (deleted) {
        return (
            <PageTransition className="flex flex-col items-center justify-center h-[70vh] px-4">
                <div className="p-12 text-center glass-panel rounded-[40px] border-green-500/20 bg-green-500/5 shadow-2xl">
                    <div className="h-20 w-20 bg-green-500/20 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Sparkles size={40} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-foreground mb-4">Signal Terminated</h2>
                    <p className="text-muted-foreground font-medium mb-8">
                        The transmission has been successfully removed from the network.<br />
                        Returning to frequency control in <span className="text-primary font-black">{countdown}s</span>...
                    </p>
                    <Button
                        variant="outline"
                        className="rounded-2xl h-12 px-8 font-bold border-primary/20 hover:bg-primary/5"
                        onClick={() => navigate("/dashboard/posts")}
                    >
                        Go to Workspace Now
                    </Button>
                </div>
            </PageTransition>
        );
    }

    if (!post) return (
        <div className="flex flex-col items-center justify-center h-[50vh]">
            <p className="text-muted-foreground font-bold text-xl">404: Signal Not Found ❌</p>
            <Button variant="ghost" className="mt-4 rounded-xl" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
    );

    const readingTime = Math.max(1, Math.ceil((post.content?.split(' ').length || 0) / 200));

    return (
        <div className="relative h-full flex flex-col overflow-hidden">
            {/* Reading Progress Bar — Fixed at top */}
            <div className="sticky top-0 z-50 w-full h-1 bg-muted/20 shrink-0">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-r-full"
                    style={{ width: `${readProgress}%` }}
                    transition={{ duration: 0.1 }}
                />
                {readProgress > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute right-3 -bottom-6 text-[9px] font-black uppercase tracking-widest text-primary/60 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-primary/10"
                    >
                        {Math.round(readProgress)}%
                    </motion.div>
                )}
            </div>

            {/* Scrollable Content */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar">
                <PageTransition className="max-w-4xl mx-auto pb-20 px-4">
                    <div className="mb-8 flex items-center justify-between">
                        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 rounded-xl hover:bg-primary/10">
                            <ArrowLeft size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Back</span>
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => navigate(`/dashboard/edit/${id}`)} className="h-10 w-10 rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary">
                                <Edit size={18} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => setIsDeleteDialogOpen(true)} className="h-10 w-10 rounded-xl border-red-500/20 hover:bg-red-500/10 hover:text-red-500">
                                <Trash size={18} />
                            </Button>
                        </div>
                    </div>

                    <div ref={contentRef} className="rounded-[48px] glass-panel overflow-hidden border-primary/10 shadow-2xl">
                        <div className="relative h-[400px]">
                            <img
                                src={post.image || "/Woman.jpeg"}
                                alt={post.title}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                        </div>
                        
                        <CardContent className="p-8 md:p-12 -mt-20 relative z-10">
                            <div className="glass-panel p-8 md:p-12 rounded-[40px] border-white/5 bg-background/40 backdrop-blur-3xl shadow-2xl">
                                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/10">
                                        <User size={14} /> {post.author?.name || "Anonymous"}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Clock size={14} /> {readingTime} min read
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-8 text-foreground">
                                    {post.title}
                                </h1>

                                <div className="h-1 w-20 bg-primary mb-10 rounded-full" />

                                <div className="prose prose-invert max-w-none">
                                    <p className="text-lg md:text-xl leading-relaxed text-muted-foreground font-medium">
                                        {post.content}
                                    </p>
                                </div>

                                {/* Tags */}
                                {post.tags && post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-primary/10">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-12 flex justify-center">
                                <div className="flex items-center gap-1 p-2 rounded-2xl glass-panel border-primary/10">
                                     <Button variant="ghost" className="rounded-xl gap-2 font-bold px-6">
                                        <Clock size={16} /> History
                                     </Button>
                                     <div className="h-6 w-[1px] bg-primary/20 mx-2" />
                                     <Button variant="ghost" className="rounded-xl gap-2 font-bold px-6 text-primary">
                                        <Sparkles size={16} /> Analytics
                                     </Button>
                                </div>
                            </div>
                        </CardContent>
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

        </div>
    );
}

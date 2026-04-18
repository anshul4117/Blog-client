import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../../../lib/api.js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, Edit, ArrowLeft, Clock, User, Calendar, Sparkles } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition.jsx";
import { motion } from "framer-motion";

export default function PostDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleted, setDeleted] = useState(false);
    const [countdown, setCountdown] = useState(3);

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

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            await API.delete(`/blogs/del-blog/${id}`);
            setDeleted(true);
        } catch {
            alert("Failed to delete post ❌");
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

    return (
        <PageTransition className="max-w-4xl mx-auto pb-20 px-4">
            <div className="mb-8 flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 rounded-xl hover:bg-primary/10">
                    <ArrowLeft size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Return</span>
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary">
                        <Edit size={18} />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleDelete} className="h-10 w-10 rounded-xl border-red-500/20 hover:bg-red-500/10 hover:text-red-500">
                        <Trash size={18} />
                    </Button>
                </div>
            </div>

            <div className="rounded-[48px] glass-panel overflow-hidden border-primary/10 shadow-2xl">
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
                        <div className="flex flex-wrap items-center gap-6 mb-8 text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/10">
                                <User size={14} /> {post.author?.name || "Anonymous"}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock size={14} /> 4 min read
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
    );
}

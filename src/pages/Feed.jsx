import { useEffect, useState } from "react";
// import MainLayout from "../components/layout/MainLayout.jsx"; // Removed MainLayout to use custom full-width layout
import PageTransition from "@/components/layout/PageTransition.jsx";
import PostCard from "../components/blog/PostCard.jsx";
import API from "../lib/secureApi.js";
import { Search, Loader2, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import Sidebar from "../features/Dashboard/Components/Sidebar.jsx"; // Import Sidebar

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/blogs/allblogs")
            .then((res) => {
                setPosts(res.data.blogs || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching blogs:", err);
                setLoading(false);
            });
    }, []);

    return (
        // <MainLayout> 
        // We remove MainLayout to control the full viewport with the 3 independent columns
        <PageTransition>
            <div className="min-h-screen bg-background flex justify-center">

                <div className="flex w-full max-w-7xl gap-0 lg:gap-6">

                    {/* Left Sidebar (Navigation) */}
                    <div className="hidden sm:block w-auto lg:w-64 border-r border-border min-h-screen sticky top-0 h-screen overflow-y-auto">
                        <Sidebar />
                    </div>

                    {/* Main Feed Column (Center) */}
                    <main className="flex-1 max-w-2xl border-r border-border min-h-screen pb-20">
                        {/* Sticky Header */}
                        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
                            <h1 className="text-xl font-bold">Home</h1>
                        </div>

                        {/* Create Post Input Placeholder (Twitter-style) */}
                        <div className="hidden md:block p-4 border-b border-border">
                            <div className="flex gap-3">
                                <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="bg-muted/50 rounded-full h-10 px-4 flex items-center text-muted-foreground w-full cursor-pointer hover:bg-muted transition-colors">
                                        What is happening?!
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feed List */}
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="animate-spin text-primary" size={32} />
                            </div>
                        ) : (
                            <div>
                                {posts.map(post => (
                                    <PostCard key={post._id} post={post} />
                                ))}
                                {posts.length === 0 && (
                                    <div className="p-8 text-center text-muted-foreground">
                                        No posts found.
                                    </div>
                                )}
                            </div>
                        )}
                    </main>

                    {/* Right Sidebar (Search & Trending) */}
                    <aside className="hidden lg:block w-80 py-4 space-y-4 h-fit sticky top-4">
                        {/* Search */}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search"
                                className="pl-11 rounded-full bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background h-11"
                            />
                        </div>

                        {/* Trending Card */}
                        <div className="bg-muted/30 rounded-2xl border border-border p-4">
                            <h2 className="font-bold text-xl mb-4 px-1">Trends for you</h2>
                            <div className="space-y-4">
                                <TrendItem category="Technology · Trending" topic="#React19" posts="125K posts" />
                                <TrendItem category="Design · Trending" topic="#Glassmorphism" posts="45K posts" />
                                <TrendItem category="Coding · Trending" topic="TypeScript" posts="89K posts" />
                                <TrendItem category="Business · Trending" topic="#Startups" posts="12K posts" />
                            </div>
                        </div>

                        {/* Footer-like Links */}
                        <div className="text-xs text-muted-foreground px-2 flex flex-wrap gap-x-3 gap-y-1">
                            <a href="#" className="hover:underline">Terms of Service</a>
                            <a href="#" className="hover:underline">Privacy Policy</a>
                            <a href="#" className="hover:underline">Cookie Policy</a>
                            <span>© 2025 Corp.</span>
                        </div>
                    </aside>

                </div>
            </div>
        </PageTransition>
    );
}

function TrendItem({ category, topic, posts }) {
    return (
        <div className="hover:bg-muted/50 p-2 -mx-2 rounded-lg cursor-pointer transition-colors">
            <p className="text-xs text-muted-foreground">{category}</p>
            <p className="font-bold text-sm mt-0.5">{topic}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{posts}</p>
        </div>
    );
}

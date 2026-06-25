import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FilePlus, User, Settings, Compass, Search, X, MessageSquare, Heart, ArrowRight } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileBottomBar() {
    const { pathname } = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const searchInputRef = useRef(null);

    // If unauthenticated, don't show the bottom bar (public site handles menu via Top Navbar)
    if (!user) return null;

    // Live search handler using localStorage mock database
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        try {
            const blogs = JSON.parse(localStorage.getItem("mock_db_blogs") || "[]");
            const matches = blogs.filter(b => 
                (b.title && b.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (b.content && b.content.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setSearchResults(matches);
        } catch (err) {
            console.error("Error searching mock DB", err);
        }
    }, [searchQuery]);

    // Focus input on open
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current.focus(), 150);
        }
    }, [isSearchOpen]);

    const navItems = [
        { to: "/feed", icon: Compass, label: "Discover" },
        { to: "/dashboard/create", icon: FilePlus, label: "Create" },
        { type: "search", icon: Search, label: "Search" },
        { to: "/dashboard/settings", icon: Settings, label: "Settings" },
        { to: "/profile", icon: User, label: "Profile" },
    ];

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg lg:hidden safe-area-bottom">
                <div className="flex items-center justify-around h-16 px-2">
                    {navItems.map((item, idx) => {
                        if (item.type === "search") {
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setIsSearchOpen(true)}
                                    className="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    <item.icon size={20} />
                                    <span className="text-[10px] font-medium">{item.label}</span>
                                </button>
                            );
                        }

                        const isActive = pathname === item.to;
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                                    isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <item.icon size={20} className={cn(isActive && "text-primary")} />
                                <span className="text-[10px]">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* High-Fidelity Mobile Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-2xl p-6 flex flex-col lg:hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-lg font-black tracking-tighter">Search Feed</span>
                            <button 
                                onClick={() => {
                                    setIsSearchOpen(false);
                                    setSearchQuery("");
                                }}
                                className="h-10 w-10 rounded-full border border-primary/10 hover:bg-primary/5 flex items-center justify-center transition-all text-foreground"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search publications and drafts..."
                                className="w-full h-14 bg-muted/20 border border-primary/10 focus:border-primary rounded-2xl pl-12 pr-4 text-sm font-semibold outline-none transition-all"
                            />
                        </div>

                        {/* Search Results Area */}
                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 font-sans">
                            {searchQuery.trim() === "" ? (
                                <div className="text-center py-20 text-muted-foreground space-y-2">
                                    <Search className="h-12 w-12 mx-auto text-primary/30" />
                                    <p className="font-bold text-sm text-foreground">Begin Typing...</p>
                                    <p className="text-xs max-w-xs mx-auto">Enter keywords to query mock database and view matched publication signals.</p>
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="text-center py-20 text-muted-foreground space-y-2">
                                    <X className="h-12 w-12 mx-auto text-red-500/30" />
                                    <p className="font-bold text-sm text-foreground">No Signals Matched</p>
                                    <p className="text-xs max-w-xs mx-auto">We couldn't find any publications matching "{searchQuery}". Try other tags or topics.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">{searchResults.length} matches found</p>
                                    {searchResults.map((blog) => (
                                        <div 
                                            key={blog._id} 
                                            onClick={() => {
                                                setIsSearchOpen(false);
                                                setSearchQuery("");
                                                navigate(`/post/${blog._id}`);
                                            }}
                                            className="glass-panel p-4 rounded-2xl border border-primary/5 hover:border-primary/20 bg-primary/[0.01] hover:bg-primary/[0.03] transition-all cursor-pointer flex flex-col gap-1.5"
                                        >
                                            <h4 className="font-extrabold text-sm text-foreground line-clamp-1 flex items-center justify-between gap-2">
                                                {blog.title}
                                                <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </h4>
                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                {blog.content}
                                            </p>
                                            <div className="flex items-center justify-between pt-2 border-t border-primary/5 mt-1 text-[10px] font-bold text-muted-foreground/60">
                                                <span>By {blog.author?.name || "Author"}</span>
                                                <span className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1"><Heart size={10} /> {blog.likeCount || 0}</span>
                                                    <span className="flex items-center gap-1"><MessageSquare size={10} /> {blog.commentCount || 0}</span>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

import { Link } from "react-router-dom";
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal } from "lucide-react";
import OptimizedImage from "@/components/ui/OptimizedImage";

export default function PostCard({ post }) {
    // Mock data for missing fields since we are reusing existing "blog" data structure
    const authorName = post.author?.name || post.author || "Anonymous";
    const authorHandle = `@${authorName.replace(/\s+/g, "").toLowerCase()}`;
    const timeAgo = new Date(post.createdAt).toLocaleDateString();

    return (
        <div className="p-4 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="flex gap-3">
                {/* Avatar Column */}
                <div className="flex-shrink-0">
                    <Link to={`/profile/${post.author?._id || ""}`}>
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
                            <img
                                src={post.author?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                alt={authorName}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </Link>
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                    {/* Header (Name, Handle, Time) */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[15px] leading-5">
                            <Link to={`/profile/${post.author?._id || ""}`} className="font-bold text-foreground hover:underline truncate">
                                {authorName}
                            </Link>
                            <span className="text-muted-foreground truncate">{authorHandle}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground hover:underline text-sm">{timeAgo}</span>
                        </div>
                        <button className="text-muted-foreground hover:text-primary p-1 rounded-full hover:bg-primary/10 transition-colors">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>

                    {/* Post Content */}
                    <div className="mt-1 text-[15px] leading-normal whitespace-pre-wrap text-foreground/90">
                        {post.title && <h3 className="font-bold mb-1 block">{post.title}</h3>}
                        {post.content}
                    </div>

                    {/* Post Image */}
                    <div className="mt-3 rounded-2xl overflow-hidden border border-border/60">
                        <OptimizedImage
                            src={post.image || post.coverImage || "/Woman.jpeg"}
                            alt="Post attachment"
                            className="max-h-[500px] w-full object-cover"
                        />
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between mt-3 max-w-md text-muted-foreground">
                        <button className="flex items-center gap-2 group hover:text-blue-500 transition-colors text-sm">
                            <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                                <MessageCircle size={18} />
                            </div>
                            <span>24</span>
                        </button>

                        <button className="flex items-center gap-2 group hover:text-green-500 transition-colors text-sm">
                            <div className="p-2 rounded-full group-hover:bg-green-500/10">
                                <Repeat2 size={18} />
                            </div>
                            <span>5</span>
                        </button>

                        <button className="flex items-center gap-2 group hover:text-pink-500 transition-colors text-sm">
                            <div className="p-2 rounded-full group-hover:bg-pink-500/10">
                                <Heart size={18} />
                            </div>
                            <span>120</span>
                        </button>

                        <button className="flex items-center gap-2 group hover:text-blue-500 transition-colors text-sm">
                            <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                                <Share size={18} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

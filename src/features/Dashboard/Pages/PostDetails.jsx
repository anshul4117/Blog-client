import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../../../lib/api.js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Delete, Trash } from "lucide-react";
import { Edit } from "lucide-react";

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
            .catch((err) => {
                // console.error(err);
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
    }, [deleted]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            await API.delete(`/blogs/del-blog/${id}`);
            setDeleted(true);
        } catch (err) {
            // console.error(err);
            alert("Failed to delete post ❌");
        }
    };


    if (loading) return <p className="text-center mt-10">Loading post...</p>;
    if (deleted) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <Card className="p-8 text-center shadow-lg border-green-600">
                    <h2 className="text-2xl font-bold text-green-700 mb-4">✅ Post Deleted Successfully!</h2>
                    <p className="text-muted-foreground mb-4">
                        Redirecting to <strong>My Posts</strong> in {countdown} seconds...
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => navigate("/dashboard/posts")}
                    >
                        Go to My Posts Now
                    </Button>
                </Card>
            </div>
        );
    }
    if (!post) return <p className="text-center mt-10">Post not found ❌</p>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Card className="overflow-hidden">
                <img
                    src={post.image || "/Woman.jpeg"}
                    alt={post.title}
                    className="h-64 w-full object-cover"
                />
                <CardContent className="p-6">
                        <h1 className="text-3xl font-bold">{post.title}</h1>

                    <p className="text-muted-foreground mb-6">
                        By {post.author?.name || "Anonymous"} •{" "}
                        {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-base leading-relaxed">{post.content}</p>

                    <div className="mt-8">
                        <Link to="/dashboard/posts">
                            <Button variant="outline">← Back to My Posts</Button>
                        </Link>
                        <div className="flex justify-end ">
                            <Button>
                                <Edit/>
                            </Button>
                            <Button onClick={handleDelete}>
                                <Trash color="darkred"/>
                            </Button>
                        </div>

                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

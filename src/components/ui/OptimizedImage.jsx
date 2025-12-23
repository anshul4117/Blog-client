import { useState } from "react";
import { cn } from "@/lib/utils";

export default function OptimizedImage({ src, alt, className, ...props }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div className={cn("relative overflow-hidden bg-muted", className)}>
            {!loaded && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
                    <span className="sr-only">Loading...</span>
                </div>
            )}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
                className={cn(
                    "w-full h-full object-cover transition-opacity duration-500",
                    loaded ? "opacity-100" : "opacity-0",
                    className
                )}
                {...props}
            />
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                    <span className="text-xs">Failed to load</span>
                </div>
            )}
        </div>
    );
}

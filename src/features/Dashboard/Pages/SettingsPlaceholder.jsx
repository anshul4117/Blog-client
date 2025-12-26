import { useParams } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition";
import { Hammer } from "lucide-react";

export default function SettingsPlaceholder() {
    const { category } = useParams();

    // Format category slug to Title Case (e.g., "security-privacy" -> "Security Privacy")
    const title = category
        ? category.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
        : "Settings";

    return (
        <PageTransition>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="p-6 bg-muted/30 rounded-full">
                    <Hammer size={48} className="text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-muted-foreground max-w-md">
                    This feature is currently under development. Check back soon for updates!
                </p>
            </div>
        </PageTransition>
    );
}

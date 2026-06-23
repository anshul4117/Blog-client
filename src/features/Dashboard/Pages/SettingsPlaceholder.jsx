import { useParams, useNavigate } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition";
import { Hammer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPlaceholder() {
    const { category } = useParams();
    const navigate = useNavigate();

    // Format category slug to Title Case (e.g., "security-privacy" -> "Security Privacy")
    const title = category
        ? category.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
        : "Settings";

    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
                {/* Navigation Header */}
                <div className="flex items-center justify-between mb-6">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
                        <ArrowLeft size={18} /> Back
                    </Button>
                </div>

                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                    <div className="p-6 bg-muted/30 rounded-full">
                        <Hammer size={48} className="text-muted-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <p className="text-muted-foreground max-w-md">
                        This feature is currently under development. Check back soon for updates!
                    </p>
                </div>
            </div>
        </PageTransition>
    );
}

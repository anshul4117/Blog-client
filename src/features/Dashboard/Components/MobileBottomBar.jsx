import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FilePlus, FileText, User, Settings, LogIn, UserPlus, Home, Compass, Info, Bookmark } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { cn } from "@/lib/utils";

export default function MobileBottomBar({ variant = "dashboard" }) {
    const { pathname } = useLocation();
    const { user } = useAuth();

    // Dashboard specific links (Admin/Creator mode)
    const dashboardLinks = [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dash" },
        { to: "/dashboard/saved", icon: Bookmark, label: "Saved" },
        { to: "/dashboard/create", icon: FilePlus, label: "Create" },
        { to: "/dashboard/settings", icon: Settings, label: "Settings" },
        { to: "/profile", icon: User, label: "Profile" },
    ];

    // Feed/Public links (Consumption/Navigation mode) - Measures Home Navbar
    const feedLinksLoggedOut = [
        { to: "/", icon: Home, label: "Home" },
        { to: "/about", icon: Info, label: "About" },
        { to: "/feed", icon: Compass, label: "Explore" },
        { to: "/login", icon: LogIn, label: "Login" },
    ];

    const feedLinksLoggedIn = [
        { to: "/", icon: Home, label: "Home" },
        { to: "/feed", icon: Compass, label: "Explore" },
        { to: "/dashboard/saved", icon: Bookmark, label: "Saved" },
        { to: "/dashboard/settings", icon: Settings, label: "Settings" },
        { to: "/profile", icon: User, label: "Profile" },
    ];

    let navItems = [];

    if (variant === "dashboard") {
        navItems = dashboardLinks;
    } else {
        // Feed / Home variant
        navItems = user ? feedLinksLoggedIn : feedLinksLoggedOut;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border sm:hidden safe-area-bottom">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.to;
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon size={20} className={cn(isActive && "fill-current/20")} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

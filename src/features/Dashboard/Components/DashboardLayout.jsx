import { useState } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import Sidebar from "./Sidebar";
import MobileBottomBar from "./MobileBottomBar";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const isFeedPage = location.pathname.startsWith("/feed");
  const isProfilePage = location.pathname.startsWith("/profile");
  const isPostDetailsPage = location.pathname.startsWith("/post/");

  // Dynamic Mobile Title
  const getMobileTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard/posts")) return "My Posts";
    if (path.startsWith("/dashboard/saved")) return "Saved";
    if (path.startsWith("/dashboard/create")) return "Create Post";
    if (path.startsWith("/dashboard/settings/security")) return "Security";
    if (path.startsWith("/dashboard/settings/privacy")) return "Privacy";
    if (path.startsWith("/dashboard/settings")) return "Settings";
    if (path.startsWith("/dashboard/help")) return "Help";
    if (path === "/dashboard") return "Dashboard";
    if (path.startsWith("/feed")) return "Feed";
    if (path.startsWith("/profile")) return "Profile";
    if (path.startsWith("/post/")) return "Post Details";
    return "Workspace";
  };

  return (
    <MainLayout showNavbar={false} showFooter={false}>
      <div className={cn(
        "flex w-full max-w-7xl mx-auto gap-0 lg:gap-12 px-0 lg:px-6 relative",
        isFeedPage ? "h-screen overflow-hidden" : "min-h-screen"
      )}>
        {/* Desktop Sidebar (lg+) */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-28 h-[calc(100vh-8rem)]">
            <Sidebar showDesktopBrand={true} />
          </div>
        </div>

        {/* Mobile/Tablet Sidebar Drawer */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
              />
              {/* Drawer */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 lg:hidden h-full"
              >
                <Sidebar
                  mobile={true}
                  onClose={() => setIsSidebarOpen(false)}
                // Ensure the sidebar itself handles dimensions/styling via the mobile prop
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile/Tablet Header */}
          <div className="lg:hidden sticky top-0 z-30 bg-background border-b border-border px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl h-10 w-10 flex items-center justify-center"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={20} />
              </Button>
              <span className="font-extrabold text-lg text-foreground tracking-tight">
                {getMobileTitle()}
              </span>
            </div>
          </div>

          {/* Mobile Bottom Navigation */}
          <MobileBottomBar />

          <main className={cn(
            "flex-1 bg-background pb-24 lg:pb-6 min-w-0",
            (isFeedPage || isProfilePage || isPostDetailsPage)
              ? "p-0 overflow-hidden flex flex-col h-full"
              : "p-4 sm:p-6"
          )}>
            <Outlet />
          </main>
        </div>
      </div>
    </MainLayout>
  );
}

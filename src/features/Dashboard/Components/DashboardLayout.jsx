import { useState } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import Sidebar from "./Sidebar";
import MobileBottomBar from "./MobileBottomBar";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <MainLayout>
      <div className="flex w-full max-w-7xl mx-auto gap-0 lg:gap-12 px-0 lg:px-6 min-h-screen relative">
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
            <span className="font-extrabold text-lg text-foreground tracking-tight">Dashboard</span>
          </div>

          {/* Mobile Bottom Navigation (Optional: Can keep or remove based on preference, keeping for now as it offers quick access) */}
          <MobileBottomBar variant="dashboard" />

          <main className="flex-1 bg-background p-4 sm:p-6 pb-24 sm:pb-6">
            <Outlet />
          </main>
        </div>
      </div>
    </MainLayout>
  );
}

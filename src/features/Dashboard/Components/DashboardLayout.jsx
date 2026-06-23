import MainLayout from "../../../components/layout/MainLayout";
import Sidebar from "./Sidebar";
import MobileBottomBar from "./MobileBottomBar";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
  const location = useLocation();

  const isFeedPage = location.pathname.startsWith("/feed");
  const isProfilePage = location.pathname.startsWith("/profile");
  const isPostDetailsPage = location.pathname.startsWith("/post/");

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

        <div className="flex-1 flex flex-col min-w-0">
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

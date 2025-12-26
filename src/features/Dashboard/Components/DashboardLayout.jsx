import MainLayout from "../../../components/layout/MainLayout";
import Sidebar from "./Sidebar";
import MobileBottomBar from "./MobileBottomBar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <MainLayout>
      <div className="flex min-h-screen relative">
        {/* Desktop Sidebar */}
        <Sidebar showDesktopBrand={false} />

        {/* Mobile Bottom Navigation */}
        <MobileBottomBar variant="dashboard" />

        <main className="flex-1 bg-background p-4 sm:p-6 pb-24 sm:pb-6">
          <Outlet />
        </main>
      </div>
    </MainLayout>
  );
}

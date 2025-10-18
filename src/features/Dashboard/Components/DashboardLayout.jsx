import MainLayout from "../../../components/layout/MainLayout";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <MainLayout>
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-background p-6">
        <Outlet />
      </main>
    </div>
    </MainLayout>
  );
}

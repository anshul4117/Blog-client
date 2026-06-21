import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import CustomCursor from "../ui/CustomCursor.jsx";
import BackgroundMesh from "../ui/BackgroundMesh.jsx";

import { useAuth } from "@/context/AuthContext.jsx";

export default function MainLayout({ children, showNavbar = true, showFooter = true }) {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // Render navbar/footer on public pages even if logged in, but hide them when explicitly disabled (e.g. on dashboard)
  const shouldShowNavbar = showNavbar;
  const shouldShowFooter = showFooter;

  return (
    <div className="flex flex-col w-full min-h-screen relative">
      <BackgroundMesh />
      <CustomCursor />
      {shouldShowNavbar && <Navbar />}
      <main className={`flex-1 ${shouldShowNavbar ? 'pt-24 md:pt-32' : 'pt-0'}`}>{children}</main>
      {shouldShowFooter && <Footer />}
    </div>
  );
}

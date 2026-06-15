import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import CustomCursor from "../ui/CustomCursor.jsx";
import BackgroundMesh from "../ui/BackgroundMesh.jsx";

import { useAuth } from "@/context/AuthContext.jsx";

export default function MainLayout({ children }) {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <div className="flex flex-col w-full min-h-screen relative">
      <BackgroundMesh />
      <CustomCursor />
      {!isLoggedIn && <Navbar />}
      <main className={`flex-1 ${!isLoggedIn ? 'pt-24 md:pt-32' : 'pt-0'}`}>{children}</main>
      {!isLoggedIn && <Footer />}
    </div>
  );
}

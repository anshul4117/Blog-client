import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import CustomCursor from "../ui/CustomCursor.jsx";
import BackgroundMesh from "../ui/BackgroundMesh.jsx";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col w-full min-h-screen relative">
      <BackgroundMesh />
      <CustomCursor />
      <Navbar />
      <main className="flex-1 pt-24 md:pt-32">{children}</main>
      <Footer />
    </div>
  );
}

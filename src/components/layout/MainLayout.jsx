import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col overflow-hidden w-full min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

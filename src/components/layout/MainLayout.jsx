import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col w-full min-h-scree">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

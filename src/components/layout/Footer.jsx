import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border mt-0 pb-10">
      <div className="container mx-auto px-6 py-16">
        {/* Top: Brand & Slogan */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <h1 className="text-[12vw] md:text-[8vw] leading-[0.8] font-black tracking-tighter text-primary/10 select-none">
              MY. BLOG
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter mt-2 ml-2 text-foreground">
              Digital Excellence.
            </h2>
          </div>
          <div className="flex gap-4">
            <SocialLink href="#" icon={Instagram} />
            <SocialLink href="#" icon={Facebook} />
            <SocialLink href="#" icon={Twitter} />
            <SocialLink href="#" icon={Linkedin} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-12">
          {/* Col 1: Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="text-2xl font-black tracking-tight text-primary">My.Blog</Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering voices, one story at a time. Join our community of creators and thinkers.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="flex flex-col gap-3 text-sm">
            <h3 className="font-bold text-foreground mb-1">Explore</h3>
            <Link to="/feed" className="text-muted-foreground hover:text-primary transition-colors">Read Stories</Link>
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link>
            <Link to="/dashboard/create" className="text-muted-foreground hover:text-primary transition-colors">Start Writing</Link>
          </div>

          {/* Col 3: Legal */}
          <div className="flex flex-col gap-3 text-sm">
            <h3 className="font-bold text-foreground mb-1">Legal</h3>
            <Link to="/dashboard/settings/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/dashboard/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link>
            <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors">Join Now</Link>
          </div>

          {/* Col 4: Contact */}
          <div className="flex flex-col gap-3 text-sm">
            <h3 className="font-bold text-foreground mb-1">Contact</h3>
            <p className="text-muted-foreground">hello@myblog.com</p>
            <p className="text-muted-foreground">+1 (555) 123-4567</p>
            <p className="text-muted-foreground">San Francisco, CA</p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} MyBlog Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-foreground">Privacy</Link>
            <Link to="#" className="hover:text-foreground">Terms</Link>
            <Link to="#" className="hover:text-foreground">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// eslint-disable-next-line no-unused-vars
function SocialLink({ href, icon: Icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="p-3 border border-border rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300"
    >
      <Icon size={20} />
    </a>
  )
}

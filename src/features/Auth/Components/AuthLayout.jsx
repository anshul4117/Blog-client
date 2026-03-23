import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-background px-4 py-12">
      {/* Background gradient orbs */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[30%] left-[50%] w-[300px] h-[300px] bg-purple-400/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Decorative ring accents */}
      <div className="absolute -top-20 -right-20 w-80 h-80 border border-primary/5 rounded-full pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-60 h-60 border border-primary/5 rounded-full pointer-events-none" />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-2xl font-bold mb-4">
            <span className="text-primary">My</span>Blog
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground mt-2">{subtitle}</p>
          )}
        </div>

        {/* Form card */}
        <div className="bg-background/60 backdrop-blur-xl p-8 rounded-2xl border border-border/50 shadow-2xl">
          {children}
        </div>
      </motion.div>

      {/* Footer */}
      <p className="mt-8 text-xs text-muted-foreground/50 tracking-wide relative z-10">
        © 2025 MyBlog · All rights reserved
      </p>
    </div>
  );
}

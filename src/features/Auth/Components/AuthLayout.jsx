import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ParticleBackground from "../../../components/ui/ParticleBackground";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-background">
      {/* Left Side - Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-background items-center justify-center overflow-hidden">
        {/* Mesh Gradient Background */}
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
        </div>

        {/* Particles with slightly reduced opacity to blend with theme */}
        <div className="absolute inset-0 z-10 opacity-70">
          <ParticleBackground />
        </div>

        {/* Glass overlay for better text readability if needed, or just gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/50 z-20 pointer-events-none" />

        <div className="relative z-30 p-12 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Join the revolution
            </div>

            <h1 className="text-5xl font-bold mb-6 leading-tight text-foreground">
              Turn your ideas into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                Digital Reality.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              "The best way to predict the future is to create it. Start writing your story today."
            </p>

            <div className="mt-8 flex gap-2">
              <div className="h-1 w-12 rounded-full bg-primary" />
              <div className="h-1 w-3 rounded-full bg-primary/30" />
              <div className="h-1 w-3 rounded-full bg-primary/30" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 relative bg-dot-pattern">
        {/* Mobile Background (Subtle) */}
        <div className="absolute inset-0 z-0 lg:hidden opacity-10 pointer-events-none">
          <ParticleBackground />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8 bg-background/60 backdrop-blur-xl p-8 rounded-3xl border border-border/50 shadow-2xl relative z-10"
        >
          <div className="space-y-2 text-center">
            <Link to="/" className="inline-block mb-4 text-2xl font-bold">
              <span className="text-primary">My</span>Blog
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
}

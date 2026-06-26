import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Home, Compass, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function NotFound() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 60, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 120, 0],
            y: [0, 100, -40, 0],
            scale: [1, 0.8, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", damping: 20 }}
        className="relative z-10 text-center max-w-xl mx-auto"
      >
        {/* Glitch-style 404 Number */}
        <div className="relative mb-8">
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="text-[160px] sm:text-[220px] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-primary/30 to-primary/5 select-none"
          >
            404
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="h-20 w-20 rounded-[24px] bg-primary/10 border border-primary/20 flex items-center justify-center shadow-2xl shadow-primary/10 backdrop-blur-xl">
              <Zap size={36} className="text-primary" />
            </div>
          </motion.div>
        </div>

        {/* Title & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tighter mb-4 text-foreground">
            Signal <span className="text-gradient">Lost</span>
          </h2>
          <p className="text-muted-foreground font-medium text-lg mb-2 max-w-md mx-auto leading-relaxed">
            The frequency you're searching for doesn't exist on our network, or it has been permanently decommissioned.
          </p>
          <p className="text-muted-foreground/50 text-sm font-bold uppercase tracking-widest mb-10">
            Error Code: FREQ_NOT_FOUND
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to={user ? "/feed" : "/"}>
            <Button
              size="lg"
              className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all gap-3"
            >
              {user ? <><Compass size={18} /> Go to Feed</> : <><Home size={18} /> Go Home</>}
            </Button>
          </Link>

          <Link to={user ? "/dashboard" : "/login"}>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-10 rounded-2xl font-bold border-primary/20 hover:bg-primary/5 gap-3"
            >
              <Sparkles size={18} />
              {user ? "Dashboard" : "Sign In"}
            </Button>
          </Link>
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 flex items-center justify-center gap-2 text-muted-foreground/30"
        >
          <div className="h-[1px] w-12 bg-primary/20" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">XDrop Network</span>
          <div className="h-[1px] w-12 bg-primary/20" />
        </motion.div>
      </motion.div>
    </div>
  );
}

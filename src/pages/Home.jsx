import { useEffect, useRef, useState } from "react";
import MainLayout from "../components/layout/MainLayout.jsx";
import PageTransition from "../components/layout/PageTransition.jsx";
import { Link } from "react-router-dom";
import { PenTool, Zap, Users, Shield, BookOpen, Quote, Star, Code, Feather, Globe, Sparkles, ArrowRight, Play, Activity } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

function AnimatedCounter({ value, label }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center group p-8 rounded-[40px] glass-panel border-primary/5 hover:border-primary/20 transition-all duration-500">
      <div className="text-5xl md:text-6xl font-black tracking-tighter text-gradient mb-2 group-hover:scale-110 transition-transform">
        {count.toLocaleString()}+
      </div>
      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">{label}</div>
    </div>
  );
}

const MarqueeItem = ({ text }) => (
  <div className="mx-8 text-3xl md:text-5xl font-black text-muted-foreground/10 whitespace-nowrap uppercase tracking-widest hover:text-primary/30 transition-colors cursor-default select-none">
    #{text}
  </div>
);

export default function Home() {
  const { scrollYProgress } = useScroll();

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);

  return (
    <MainLayout>
      <PageTransition className="w-full relative overflow-hidden">

        {/* SECTION 1: HERO */}
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 py-20 overflow-hidden">
          {/* Animated Ambient Elements */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px]"
            />
            <motion.div
                animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0], opacity: [0.05, 0.1, 0.05] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[160px]"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 text-center max-w-6xl mx-auto"
          >
            <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel border-primary/20 mb-10 hover:border-primary/40 transition-all cursor-pointer shadow-xl shadow-primary/5"
            >
              <div className="p-1 rounded-full bg-primary/20 text-primary">
                <Activity size={12} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">System Online v1.0.4</span>
            </motion.div>

            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-10 text-foreground">
              Initialize <br />
              <span className="italic font-serif font-light text-muted-foreground/40 pr-4">Digital</span>
              <span className="text-gradient">Narrative</span>
            </h1>

            <p className="text-xl md:text-3xl text-muted-foreground max-w-3xl mx-auto mb-14 font-medium leading-relaxed tracking-tight">
              A premium, hyper-fluid workspace for modern storytellers to broadcast their signals into the digital void.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/register">
                <Button size="lg" className="h-16 px-10 text-sm font-black uppercase tracking-[0.2em] rounded-[24px] shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all gap-3 group">
                  Start Frequency <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/feed">
                <Button variant="outline" size="lg" className="h-16 px-10 text-sm font-black uppercase tracking-[0.2em] rounded-[24px] border-primary/10 hover:bg-primary/5 transition-all gap-3">
                  <Play size={18} /> Watch Signal
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* SECTION 2: MARQUEE */}
        <div className="py-24 border-y border-primary/5 bg-primary/[0.02] backdrop-blur-md relative overflow-hidden">
            <div className="flex whitespace-nowrap animate-marquee">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex">
                        <MarqueeItem text="CRYPTO" />
                        <MarqueeItem text="DESIGN" />
                        <MarqueeItem text="FUTURE" />
                        <MarqueeItem text="CODE" />
                        <MarqueeItem text="MINIMALISM" />
                        <MarqueeItem text="STORYTELLING" />
                    </div>
                ))}
            </div>
        </div>

        {/* SECTION 3: STATS */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedCounter value={5000} label="Signals Sent" />
            <AnimatedCounter value={12000} label="Active Nodes" />
            <AnimatedCounter value={99} label="Uptime %" />
          </div>
        </section>

        {/* SECTION 4: FEATURES */}
        <section className="py-40 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 mb-6">
                        <Sparkles size={12} /> Technology Core
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-8">
                        Engineered for <br /><span className="text-gradient">Premium Velocity</span>
                    </h2>
                    <p className="text-xl text-muted-foreground font-medium mb-12 leading-relaxed">
                        We've optimized every interaction, every transition, and every pixel to ensure your writing experience is as fluid as thought itself.
                    </p>
                    <div className="grid grid-cols-2 gap-8">
                        {[
                            { icon: Zap, title: "0.1s Response", desc: "Instant feedback" },
                            { icon: Shield, title: "Encrypted", desc: "Private data" },
                            { icon: Globe, title: "Global Sync", desc: "Always available" },
                            { icon: Sparkles, title: "AI Assisted", desc: "Smart editing" },
                        ].map((feat, idx) => (
                            <div key={idx} className="space-y-3 group cursor-default">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <feat.icon size={18} />
                                </div>
                                <h4 className="font-black text-sm uppercase tracking-widest">{feat.title}</h4>
                                <p className="text-xs text-muted-foreground">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
              </div>

              {/* Feature Visual */}
              <motion.div 
                style={{ y: y1 }}
                className="relative h-[600px] rounded-[48px] glass-panel border-primary/20 overflow-hidden group shadow-2xl shadow-primary/20"
              >
                  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80" alt="Core" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  <div className="absolute bottom-10 left-10 p-10 glass-panel rounded-[32px] border-white/10 backdrop-blur-2xl max-w-xs">
                    <p className="text-2xl font-black tracking-tighter text-white mb-2">Designed for the 1%.</p>
                    <p className="text-white/60 text-xs font-medium uppercase tracking-widest">Premium Aesthetic Protocol</p>
                  </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-40 px-6">
            <div className="max-w-7xl mx-auto rounded-[64px] bg-gradient-to-br from-primary via-primary/80 to-indigo-600 p-20 text-center relative overflow-hidden group shadow-2xl shadow-primary/40">
                <div className="absolute inset-0 mesh-gradient opacity-30" />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full blur-[120px]" />
                
                <div className="relative z-10 space-y-10">
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none">
                        Ready to join the <br /> digital elite?
                    </h2>
                    <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-medium">
                        Secure your unique handle today and start broadcasting your frequency to a global audience of visionary readers.
                    </p>
                    <Link to="/register" className="inline-block mt-10">
                        <Button size="lg" className="h-20 px-16 text-lg font-black uppercase tracking-[0.3em] bg-white text-primary rounded-[32px] shadow-2xl shadow-black/20 hover:scale-105 transition-all">
                            Initialize Account
                        </Button>
                    </Link>
                </div>
            </div>
        </section>

      </PageTransition>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </MainLayout>
  );
}

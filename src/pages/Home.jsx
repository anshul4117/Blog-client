import { useEffect, useRef, useState } from "react";
import MainLayout from "../components/layout/MainLayout.jsx";
import PageTransition from "../components/layout/PageTransition.jsx";
import { Link } from "react-router-dom";
import { PenTool, Zap, Users, Shield, BookOpen, Quote, Star, Code, Feather, Globe, Sparkles } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform, useInView } from "framer-motion";
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
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-black text-primary mb-2">
        {count.toLocaleString()}+
      </div>
      <div className="text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

const MarqueeItem = ({ text }) => (
  <div className="mx-8 text-2xl md:text-4xl font-black text-muted-foreground/20 whitespace-nowrap uppercase tracking-widest hover:text-primary/50 transition-colors cursor-default">
    #{text}
  </div>
);

export default function Home() {
  const { scrollYProgress } = useScroll();

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <MainLayout>
      <PageTransition className="w-full relative overflow-hidden">

        {/* SECTION 1: HERO */}
        <section className="relative min-h-[90vh] bg-background flex flex-col justify-center items-center px-6 py-20 overflow-hidden">
          {/* Animated Gradient Blob */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"
          />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 text-center max-w-5xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-muted/50 backdrop-blur-sm mb-8 hover:bg-muted/80 transition-colors cursor-pointer">
              <Star className="text-yellow-500 fill-yellow-500 w-4 h-4" />
              <span className="text-sm font-medium">The Writer's Platform</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-8 text-foreground">
              Level Up Your <br />
              <span className="italic font-serif font-light text-muted-foreground">DIGITAL</span>
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"> JOURNEY</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              A minimalistic, distraction-free space for storytellers, thinkers, and creators to share their voice with the world.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all">
                  Start Writing
                </Button>
              </Link>
              <Link to="/feed">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-muted">
                  Read Stories
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Floating Elements Hero */}
          <motion.div style={{ y: y1, rotate: rotate1 }} className="absolute md:top-20 right-[10%] opacity-10 hidden md:block pointer-events-none">
            <PenTool size={120} className="text-primary" />
          </motion.div>
          <motion.div style={{ y: y2 }} className="absolute bottom-20 left-[10%] opacity-10 hidden md:block pointer-events-none">
            <BookOpen size={140} className="text-primary" />
          </motion.div>
          <motion.div style={{ y: y3, rotate: rotate2 }} className="absolute top-40 left-[5%] opacity-10 hidden md:block pointer-events-none">
            <Sparkles size={80} className="text-blue-500" />
          </motion.div>
        </section>

        {/* SECTION 1.5: INFINITE MARQUEE */}
        <div className="w-full bg-muted/20 py-8 overflow-hidden border-y border-border/50">
          <div className="relative flex overflow-x-hidden group">
            <motion.div
              animate={{ x: "-50%" }}
              transition={{ duration: 30, ease: "linear", repeat: Infinity }}
              className="flex items-center whitespace-nowrap"
            >
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex">
                  <MarqueeItem text="Technology" />
                  <MarqueeItem text="Design" />
                  <MarqueeItem text="Culture" />
                  <MarqueeItem text="Programming" />
                  <MarqueeItem text="Creativity" />
                  <MarqueeItem text="Future" />
                  <MarqueeItem text="Innovation" />
                  <MarqueeItem text="Storytelling" />
                </div>
              ))}
            </motion.div>
            <motion.div
              animate={{ x: "-50%" }}
              transition={{ duration: 30, ease: "linear", repeat: Infinity }}
              className="flex items-center whitespace-nowrap absolute top-0 left-full"
            >
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex">
                  <MarqueeItem text="Technology" />
                  <MarqueeItem text="Design" />
                  <MarqueeItem text="Culture" />
                  <MarqueeItem text="Programming" />
                  <MarqueeItem text="Creativity" />
                  <MarqueeItem text="Future" />
                  <MarqueeItem text="Innovation" />
                  <MarqueeItem text="Storytelling" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* SECTION 2: FEATURES */}
        <section className="relative min-h-screen bg-muted/30 flex flex-col justify-center py-24 px-6 overflow-hidden">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-2 mb-4 text-primary font-bold tracking-wider uppercase text-sm">
                  <Zap size={16} /> Powerful Tools
                </div>
                <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-foreground">
                  BUILT FOR <br />
                  <span className="text-primary">MODERN</span> <br />
                  WRITERS.
                </h2>
                <div className="space-y-6">
                  <FeatureRow icon={Code} title="Markdown Native" desc="Write naturally with full markdown support and code syntax highlighting." />
                  <FeatureRow icon={Shield} title="Secure & Private" desc="Your content is yours. We protect your intellectual property with enterprise-grade security." />
                  <FeatureRow icon={Globe} title="Global Reach" desc="Publish to a worldwide audience with SEO optimization built-in." />
                </div>
              </motion.div>

              <div className="relative">
                {/* Decorative Cards Stack */}
                <motion.div
                  whileHover={{ rotate: -1, scale: 1.02 }}
                  className="bg-card border p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative z-10"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <Feather className="text-primary/50" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Focus Mode</h3>
                  <p className="text-muted-foreground mb-8">Distractions kill creativity. Our interface fades away when you type, leaving just you and your words.</p>
                  <div className="h-40 bg-muted/50 rounded-2xl border border-border/50 flex items-center justify-center relative overflow-hidden group">
                    <span className="text-muted-foreground/50 font-mono relative z-10">Select text to format...</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </motion.div>
                {/* Abstract shape behind */}
                <div className="absolute top-10 -right-4 w-full h-full bg-primary/5 rounded-[2.5rem] -z-0 rotate-3 border border-primary/10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2.5: STATS */}
        <section className="py-20 bg-background border-y border-border/50">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <AnimatedCounter value={10000} label="Active Writers" />
              <AnimatedCounter value={500000} label="Stories Published" />
              <AnimatedCounter value={2000000} label="Monthly Readers" />
            </div>
          </div>
        </section>

        {/* SECTION 3: COMMUNITY */}
        <section className="relative min-h-screen bg-background flex flex-col justify-center py-24 px-6">
          <div className="container mx-auto text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-black mb-6 text-foreground"
            >
              LOVED BY <span className="text-primary">CREATORS</span>
            </motion.h2>
            <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto text-muted-foreground">
              Join a community of thousands sharing ideas that change the world.
            </p>
          </div>

          <div className="container mx-auto grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="The cleanest writing experience I've found. It just gets out of the way."
              author="Sarah Jenkins"
              role="Tech Blogger"
            />
            <TestimonialCard
              quote="Finally, a platform that understands Markdown first. My code looks amazing."
              author="David Chen"
              role="Full Stack Dev"
              delay={0.2}
            />
            <TestimonialCard
              quote="The community here is unmatched. I've made real connections."
              author="Elena Rodriguez"
              role="UX Designer"
              delay={0.4}
            />
          </div>
        </section>

        {/* SECTION 4: CTA */}
        <section className="relative h-[80vh] bg-muted/30 flex flex-col justify-center items-center px-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

          {/* Floating elements CTA */}
          <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 left-[20%] opacity-20">
            <Quote size={60} />
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <h2 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter text-foreground">
              START NOW
            </h2>
            <p className="text-xl md:text-3xl font-medium mb-10 max-w-xl mx-auto text-muted-foreground">
              Ready to tell your story? It's free to get started.
            </p>
            <Link to="/register">
              <Button size="lg" className="h-16 px-12 text-xl rounded-full shadow-2xl hover:scale-105 transition-all">
                Create Your Account
              </Button>
            </Link>
          </motion.div>
        </section>

      </PageTransition>
    </MainLayout>
  );
}

// eslint-disable-next-line no-unused-vars
function FeatureRow({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-start gap-5 group">
      <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-xl font-bold mb-1 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function TestimonialCard({ quote, author, role, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="bg-card border p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
    >
      <Quote className="text-primary/40 mb-6 w-8 h-8" />
      <p className="text-lg font-medium leading-relaxed mb-6 text-foreground">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-muted rounded-full overflow-hidden">
          <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${author}`} alt={author} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-foreground">{author}</h4>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{role}</p>
        </div>
      </div>
    </motion.div>
  )
}

import MainLayout from "../components/layout/MainLayout.jsx";
import PageTransition from "../components/layout/PageTransition.jsx";
import { Link } from "react-router-dom";
import { ArrowRight, PenTool, Zap, Users, Shield, BookOpen, Quote } from "lucide-react";
import { motion } from "framer-motion";
import Particles from "@/components/ui/Particles.jsx";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true }
};

export default function Home() {
  return (
    <MainLayout>
      <PageTransition className="relative w-full overflow-hidden">

        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 -z-10 bg-background">
            <Particles
              className="absolute inset-0"
              quantity={100}
              ease={80}
              color="#8b5cf6" // Purple-ish to match theme
              refresh
            />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
          </div>

          <div className="container px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/30 text-accent-foreground text-sm font-medium mb-8 border border-white/10 shadow-lg">
                <Zap size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent font-bold">New:</span>
                Dark mode is now live!
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter mb-8 leading-[1.1]">
                Craft Your <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-blue-600">
                  Digital Legacy
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                Connect with a global community of writers. Share your stories,
                tutorials, and ideas on a platform designed for <span className="text-foreground font-semibold">clarity</span> and <span className="text-foreground font-semibold">impact</span>.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-primary text-primary-foreground text-lg font-bold rounded-full shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] hover:shadow-[0_0_60px_-15px_rgba(var(--primary),0.6)] transition-all flex items-center gap-3"
                  >
                    Start Writing Now <ArrowRight size={20} />
                  </motion.button>
                </Link>
                <Link to="/feed">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-background border border-border text-lg font-medium rounded-full hover:bg-accent/50 transition-colors"
                  >
                    Read Stories
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section className="py-24 md:py-32 bg-muted/20 relative">
          <div className="container px-6">
            <motion.div
              {...fadeInUp}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for Modern Writers</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We've stripped away the clutter to focus on what matters most: your content and your audience.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              <FeatureCard
                icon={PenTool}
                title="Rich Editor"
                desc="A distraction-free writing environment that empowers you to create beautiful stories with ease."
                color="text-pink-500"
              />
              <FeatureCard
                icon={Users}
                title="Audience First"
                desc="Built-in tools to grow your following and engage with readers through comments and likes."
                color="text-blue-500"
              />
              <FeatureCard
                icon={Shield}
                title="Secure Platform"
                desc="Your content is yours. We ensure top-notch security so you can focus on creating."
                color="text-green-500"
              />
            </motion.div>
          </div>
        </section>

        {/* IMMERSIVE IMAGE SPLIT SECTION */}
        <section className="py-24 overflow-hidden">
          <div className="container px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div
                {...fadeInUp}
                className="flex-1 space-y-8"
              >
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                  Share ideas that <br />
                  <span className="text-primary">change the world.</span>
                </h2>
                <div className="space-y-6 text-lg text-muted-foreground">
                  <p>
                    Whether you're sharing code snippets, personal essays, or industry analysis, our platform adapts to your voice.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Markdown support out of the box</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>SEO optimized content delivery</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Real-time engagement analytics</span>
                    </li>
                  </ul>
                </div>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="mt-4">Learn more about us</Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex-1 relative"
              >
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-700">
                  <img
                    src="/Woman.jpeg"
                    alt="Writing workspace"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative elements behind */}
                <div className="absolute top-10 -right-10 w-full h-full border-2 border-primary/20 rounded-3xl -z-10" />
                <div className="absolute -bottom-10 -left-10 w-full h-full bg-primary/5 rounded-3xl -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 bg-card border-y border-border/40">
          <div className="container px-6 text-center">
            <h2 className="text-3xl font-bold mb-16">Loved by Developers & Writers</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <TestimonialCard
                quote="The cleanest writing experience I've found on the web. It just gets out of the way."
                author="Sarah J."
                role="Tech Blogger"
                img="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
              />
              <TestimonialCard
                quote="Finally, a platform that understands Markdown first. My code blocks look amazing."
                author="David C."
                role="Full Stack Dev"
                img="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
              />
              <TestimonialCard
                quote="The community here is unmatched. I've made real connections through my posts."
                author="Elena R."
                role="UX Designer"
                img="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop"
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/90">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>
          <div className="container px-6 relative z-10 text-center text-primary-foreground">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to tell your story?</h2>
              <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                Join thousands of writers who found their voice on our platform.
                It's free to start.
              </p>
              <Link to="/register">
                <button className="px-10 py-5 bg-white text-primary text-xl font-bold rounded-full shadow-2xl hover:scale-105 transition-transform">
                  Get Started for Free
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

      </PageTransition>
    </MainLayout>
  );
}

// Components
function Button({ children, variant = "default", size = "default", className = "", ...props }) {
  // Quick Reusable Button specific for this page if needed, or use UI component
  return <div className={className} {...props}>{children}</div>
}

function FeatureCard({ icon: Icon, title, desc, color }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="p-8 rounded-3xl bg-background border border-border/50 shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center text-center group"
    >
      <div className={`p-4 rounded-2xl bg-muted group-hover:bg-primary/10 transition-colors mb-6 ${color}`}>
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  )
}

function TestimonialCard({ quote, author, role, img }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-left p-6"
    >
      <Quote className="text-primary/20 mb-4" size={40} />
      <p className="text-lg font-medium leading-relaxed mb-6">"{quote}"</p>
      <div className="flex items-center gap-4">
        <img src={img} alt={author} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <h4 className="font-bold text-sm">{author}</h4>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </motion.div>
  )
}

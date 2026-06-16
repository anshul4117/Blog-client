// eslint-disable-next-line no-unused-vars
import { useState } from "react";
import MainLayout from "../components/layout/MainLayout.jsx";
import PageTransition from "../components/layout/PageTransition.jsx";
import { Link } from "react-router-dom";
import { Users, Globe, Zap, Target, Heart, Coffee, ArrowRight, MessageSquare, Sparkles, Activity, Award, Bookmark } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import GeometricParticleBackground from "../components/ui/GeometricParticleBackground.jsx";

export default function About() {

  return (
    <MainLayout>
      <PageTransition className="w-full relative overflow-hidden">
        <GeometricParticleBackground />

        {/* SECTION 1: HERO - THE CREATIVE UNIVERSE */}
        <section className="relative min-h-[95vh] flex flex-col justify-center items-center px-6 py-10 overflow-hidden">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:30px_30px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/80 to-background pointer-events-none" />

          {/* Animated Gradient Orbs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 15, repeat: Infinity, delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"
          />

          <div className="container mx-auto relative z-10 w-full">
            <div className="flex flex-col items-center gap-12">

              {/* Mobile stacked view (No absolute overflows or 3D overlaps) */}
              <div className="md:hidden flex flex-col gap-6 w-full max-w-sm mx-auto px-4 z-20 relative">
                {/* Mobile Card 1: Feed Card */}
                <div className="w-full p-5 sm:p-6 rounded-[2rem] bg-background/55 backdrop-blur-xl border border-white/10 shadow-lg text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80" className="h-8 w-8 rounded-full object-cover border border-primary/20" alt="avatar" />
                    <div>
                      <span className="block text-xs font-black text-foreground">@design_nomad</span>
                      <span className="block text-[8px] text-muted-foreground/60">2 hours ago · 5 min read</span>
                    </div>
                    <span className="ml-auto text-primary/80"><Bookmark size={14} /></span>
                  </div>
                  <h4 className="text-sm font-extrabold text-foreground leading-snug mb-2 line-clamp-2">
                    A Case for Glassmorphism in Modern Typography Layouts
                  </h4>
                  <p className="text-[10px] text-muted-foreground leading-normal line-clamp-3 font-medium mb-4">
                    Frosted glass styling blended with responsive HSL variable color systems creates a beautiful aesthetic hierarchy and depth in user interfaces...
                  </p>
                  <div className="flex items-center justify-between pt-3.5 border-t border-primary/5 text-[10px] font-bold text-muted-foreground/60">
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-black uppercase">#Design</span>
                    <span className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Heart size={11} className="text-red-500" fill="currentColor" /> 142</span>
                      <span className="flex items-center gap-1"><MessageSquare size={11} /> 28</span>
                    </span>
                  </div>
                </div>

                {/* Mobile Card 2: Creator Profile Card */}
                <div className="w-full rounded-[2rem] overflow-hidden bg-background/55 backdrop-blur-xl border border-white/10 shadow-lg text-left">
                  <div className="h-16 bg-gradient-to-r from-primary via-purple-600 to-indigo-600 opacity-90 relative flex items-end justify-end p-2">
                    <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[8px] font-bold text-white uppercase tracking-wider">Top Writer</span>
                  </div>
                  <div className="px-5 pb-5 -mt-8 relative z-10 flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-2xl overflow-hidden border-4 border-background bg-muted shadow-lg mb-2">
                      <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Marcus&backgroundColor=transparent" className="w-full h-full object-cover" alt="avatar" />
                    </div>
                    <h4 className="text-base font-extrabold text-foreground leading-none">Marcus Vance</h4>
                    <p className="text-[10px] font-black text-primary mb-3">@marcus_vance</p>
                    <p className="text-[10px] text-muted-foreground font-medium leading-relaxed mb-4 px-2 line-clamp-2">
                      UI/UX researcher and author of Digital Simplicity. Sharing insights on clean layouts.
                    </p>
                    <div className="grid grid-cols-3 gap-2 w-full py-3 border-y border-primary/5 text-[10px] font-black uppercase text-center mb-4">
                      <div>
                        <span className="block text-sm font-extrabold text-foreground">34</span>
                        <span className="text-[7px] text-muted-foreground/60">Posts</span>
                      </div>
                      <div>
                        <span className="block text-sm font-extrabold text-foreground">8.9k</span>
                        <span className="text-[7px] text-muted-foreground/60">Likes</span>
                      </div>
                      <div>
                        <span className="block text-sm font-extrabold text-foreground">4.1k</span>
                        <span className="text-[7px] text-muted-foreground/60">Readers</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Card 3: Stories Told Card */}
                <div className="w-full p-6 rounded-[2rem] bg-primary text-primary-foreground shadow-lg text-center">
                  <div className="text-4xl font-black mb-1">4.2M+</div>
                  <div className="text-sm opacity-80 font-medium">Stories Told</div>
                </div>

                {/* Mobile Card 4: Felix Card */}
                <div className="w-full flex items-center gap-3 p-4 pr-6 rounded-full bg-background/60 backdrop-blur-xl border border-white/10 shadow-lg text-left">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary shrink-0">
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="User" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-foreground">Felix Joined</div>
                    <div className="text-[10px] text-muted-foreground">Just now</div>
                  </div>
                </div>
              </div>

              {/* Desktop Floating 3D Elements Composition (hidden on mobile, shown on md and up) */}
              <div className="hidden md:block relative h-[550px] sm:h-[600px] md:h-[620px] w-full max-w-5xl mx-auto perspective-1000">
                {/* Floating Card 1: Feed Publication Card */}
                <FloatCard
                  className="absolute top-[2%] left-[2%] md:top-[6%] md:left-[6%] lg:left-[10%] z-20 scale-[0.65] xs:scale-[0.72] sm:scale-80 md:scale-95 lg:scale-100 transform-gpu origin-top-left"
                  delay={0}
                >
                  <div className="w-[310px] sm:w-[350px] md:w-[380px] p-5 sm:p-6 rounded-[2rem] bg-background/55 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col justify-between text-left transition-all duration-300 hover:border-primary/30">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80" className="h-8 w-8 rounded-full object-cover border border-primary/20" alt="avatar" />
                        <div>
                          <span className="block text-xs font-black text-foreground">@design_nomad</span>
                          <span className="block text-[8px] text-muted-foreground/60">2 hours ago · 5 min read</span>
                        </div>
                        <span className="ml-auto text-primary/80"><Bookmark size={14} /></span>
                      </div>

                      <h4 className="text-sm sm:text-base font-extrabold text-foreground leading-snug mb-2 line-clamp-2">
                        A Case for Glassmorphism in Modern Typography Layouts
                      </h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground leading-normal line-clamp-3 font-medium mb-4">
                        Frosted glass styling blended with responsive HSL variable color systems creates a beautiful aesthetic hierarchy and depth in user interfaces. By styling with border variable systems, layouts feel unified...
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-3.5 border-t border-primary/5 text-[10px] font-bold text-muted-foreground/60">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-black uppercase">#Design</span>
                      <span className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Heart size={11} className="text-red-500" fill="currentColor" /> 142</span>
                        <span className="flex items-center gap-1"><MessageSquare size={11} /> 28</span>
                      </span>
                    </div>
                  </div>
                </FloatCard>

                {/* Floating Card 2: Creator Profile Card */}
                <FloatCard
                  className="absolute top-[18%] right-[2%] md:top-[2%] md:right-[6%] lg:right-[10%] z-10 scale-[0.65] xs:scale-[0.72] sm:scale-80 md:scale-95 lg:scale-100 transform-gpu origin-top-right"
                  delay={1.5}
                  duration={6}
                >
                  <div className="w-[280px] sm:w-[310px] md:w-[330px] rounded-[2rem] overflow-hidden bg-background/55 backdrop-blur-xl border border-white/10 shadow-2xl text-left transition-all duration-300 hover:border-primary/30">
                    <div className="h-20 bg-gradient-to-r from-primary via-purple-600 to-indigo-600 opacity-90 relative flex items-end justify-end p-2">
                      <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[8px] font-bold text-white uppercase tracking-wider">Top Writer</span>
                    </div>
                    <div className="px-5 pb-5 -mt-10 relative z-10 flex flex-col items-center text-center">
                      <div className="h-20 w-20 rounded-2xl overflow-hidden border-4 border-background bg-muted shadow-lg mb-2">
                        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Marcus&backgroundColor=transparent" className="w-full h-full object-cover" alt="avatar" />
                      </div>
                      <h4 className="text-base font-extrabold text-foreground leading-none">Marcus Vance</h4>
                      <p className="text-[10px] font-black text-primary mb-3">@marcus_vance</p>
                      
                      <p className="text-[10px] sm:text-xs text-muted-foreground font-medium leading-relaxed mb-4 px-2">
                        UI/UX researcher and author of Digital Simplicity. Curating clean interfaces and sharing insights on clean markdown structures.
                      </p>
                      
                      <div className="grid grid-cols-3 gap-2 w-full py-3 border-y border-primary/5 text-[10px] font-black uppercase text-center mb-4">
                        <div>
                          <span className="block text-sm font-extrabold text-foreground">34</span>
                          <span className="text-[7px] text-muted-foreground/60">Posts</span>
                        </div>
                        <div>
                          <span className="block text-sm font-extrabold text-foreground">8.9k</span>
                          <span className="text-[7px] text-muted-foreground/60">Likes</span>
                        </div>
                        <div>
                          <span className="block text-sm font-extrabold text-foreground">4.1k</span>
                          <span className="text-[7px] text-muted-foreground/60">Readers</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full rounded-full text-xs font-bold py-1.5 h-8 border-primary/20 hover:bg-primary hover:text-white transition-colors">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </FloatCard>

                {/* Floating Card 3: Stats */}
                <FloatCard
                  className="absolute bottom-[20%] left-[2%] md:bottom-[15%] md:left-[20%] lg:left-[25%] z-30 scale-[0.65] xs:scale-[0.72] sm:scale-80 md:scale-95 lg:scale-100 transform-gpu origin-bottom-left"
                  delay={0.5}
                  duration={7}
                >
                  <div className="w-48 p-5 rounded-3xl bg-primary/90 backdrop-blur-md text-primary-foreground shadow-xl -rotate-3 text-left">
                    <div className="text-4xl font-black mb-1">4.2M+</div>
                    <div className="text-sm opacity-80 font-medium">Stories Told</div>
                  </div>
                </FloatCard>

                {/* Floating Card 4: User */}
                <FloatCard
                  className="absolute bottom-[2%] right-[2%] md:bottom-[10%] md:right-[20%] lg:right-[25%] z-20 scale-[0.65] xs:scale-[0.72] sm:scale-80 md:scale-95 lg:scale-100 transform-gpu origin-bottom-right"
                  delay={2}
                >
                  <div className="flex items-center gap-3 p-4 pr-8 rounded-full bg-background/60 backdrop-blur-md border border-white/20 shadow-xl text-left">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary shrink-0">
                      <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="User" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">Felix Joined</div>
                      <div className="text-xs text-muted-foreground">Just now</div>
                    </div>
                  </div>
                </FloatCard>
              </div>

              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center max-w-4xl mx-auto -mt-6 relative z-20"
              >
                {/* Minimal Tagline */}
                <div className="mb-2">
                  <span className="text-sm font-medium tracking-[0.5em] text-muted-foreground uppercase">The Story</span>
                </div>

                {/* Massive Luxury Headline */}
                <div className="relative mb-12 select-none">
                  {/* Main Text */}
                  <h1 className="text-[4.2rem] sm:text-[6rem] md:text-[9rem] font-black tracking-tighter leading-[0.85] bg-clip-text bg-gradient-to-b from-foreground via-foreground/90 to-foreground/50 filter drop-shadow-xl">
                    ABOUT
                  </h1>

                  {/* Reflection Effect */}
                  <h1 className="text-[4.2rem] sm:text-[6rem] md:text-[9rem] font-black tracking-tighter leading-[0.85] bg-clip-text bg-gradient-to-b from-foreground/20 to-transparent absolute top-[85%] left-0 right-0 scale-y-[-1] opacity-30 blur-[2px] pointer-events-none">
                    ABOUT
                  </h1>
                </div>

                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-light relative z-30">
                  We are builders, creators, and storytellers. This is the story of how we're reshaping the digital landscape, one line of code at a time.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 2: VALUES - THE MATRIX */}
        <section className="py-32 px-6 relative">
          <div className="container mx-auto relative z-10">
            <div className="mb-20 max-w-2xl text-left mr-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-6"
              >
                <div className="h-px w-12 bg-primary"></div>
                <span className="text-sm font-mono text-primary uppercase tracking-widest">The Operating System</span>
              </motion.div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-foreground text-left">
                Core <span className="text-muted-foreground/40">Values.</span>
              </h2>
              <p className="text-xl text-muted-foreground font-light leading-relaxed text-left">
                The fundamental constants that define our trajectory through the noise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">

              {/* Card 1: Simplicity (2 Columns) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-2 group relative overflow-hidden rounded-[2.5rem] bg-muted/20 border border-border/50 p-10 flex flex-col justify-between hover:bg-muted/30 transition-all duration-500"
              >
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity duration-500 group-hover:scale-110 group-hover:-rotate-12 transform">
                  <Target size={200} />
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center mb-6 text-2xl font-bold">
                    01
                  </div>
                  <h3 className="text-4xl font-black mb-4 group-hover:translate-x-2 transition-transform duration-300">Simplicity.</h3>
                  <p className="text-lg text-muted-foreground/80 max-w-md font-medium leading-relaxed">
                    Complexity is the enemy of execution. We strip away the non-essential to reveal the powerful simple truth.
                  </p>
                </div>
              </motion.div>

              {/* Card 2: Innovation (1 Column, Tall-ish) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="md:col-span-1 group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 p-10 flex flex-col justify-between hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
              >
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-all" />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                    <Zap size={28} />
                  </div>
                  <h3 className="text-3xl font-black mb-4">Innovation</h3>
                  <p className="text-muted-foreground font-medium">
                    We don't follow trends. We set the coordinates for where the world is going next.
                  </p>
                </div>
              </motion.div>

              {/* Card 3: Community (3 Columns - Full Width) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="md:col-span-3 group relative overflow-hidden rounded-[2.5rem] bg-background border border-border/50 p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center gap-10 hover:border-foreground/20 transition-colors duration-500"
              >
                <div className="flex-1 relative z-10 order-2 md:order-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-muted text-foreground flex items-center justify-center">
                      <Users size={28} />
                    </div>
                    <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Global Network</div>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black mb-6">Community Driven.</h3>
                  <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
                    We are not just building software; we are cultivating a civilization of thinkers, dreamers, and doers.
                    <span className="text-foreground font-medium block mt-2">Join a galaxy of 4.2M+ creators.</span>
                  </p>
                </div>

                {/* Visual for Community */}
                <div className="w-full md:w-1/3 h-64 md:h-full relative overflow-hidden rounded-[2rem] order-1 md:order-2 bg-muted/50">
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <Globe size={180} className="animate-spin-slow duration-[20s]" />
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-152202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                    alt="Community"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 3: STORY / TIMELINE (Simplified) */}
        <section className="py-24 bg-background px-6">
          <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl transform rotate-3 scale-105 -z-10" />
              <motion.img
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop"
                alt="XDrop UI Design Workspace"
                className="w-full h-[300px] sm:h-[380px] md:h-[450px] object-cover rounded-3xl shadow-2xl border border-border/50 grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Designed & Built Solo.</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                It started in 2023. One creator, one problem: existing blogging platforms were too cluttered and lacked focus.
                I wanted to build a place that felt like a fresh sheet of paper.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Today, XDrop is an independent platform built entirely from scratch, driven by a love for minimal typography and high-performance code.
              </p>

              <div className="flex gap-8 border-t border-border pt-8">
                <div>
                  <div className="text-3xl font-black text-primary">100%</div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Independent</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-primary">4.9/5</div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">User Satisfaction</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 4: TEAM */}
        <section className="py-24 bg-muted/30 px-6 border-t border-border/50">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-16">The Creator</h2>

            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <TeamMember name="Anshul" role="Founder, CEO & Solo Builder" color="bg-primary/20" />
              </div>
            </div>

            <div className="mt-20">
              <p className="text-2xl font-bold mb-6">Want to join our journey?</p>
              <Link to="/register">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full gap-2 group">
                  Join the Team <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </PageTransition>
    </MainLayout>
  );
}

// eslint-disable-next-line no-unused-vars
function ValueCard({ icon: Icon, title, desc, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="p-8 bg-background border border-border/50 rounded-3xl shadow-sm hover:shadow-lg hover:border-primary/20 transition-all text-left group"
    >
      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {desc}
      </p>
    </motion.div>
  )
}

function FloatCard({ children, className, delay = 0, duration = 5 }) {
  return (
    <motion.div
      animate={{
        y: [0, -20, 0],
        rotate: [0, 2, 0]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function TeamMember({ name, role, color }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="text-left group cursor-pointer"
    >
      <div className={`h-80 w-full mb-6 rounded-3xl overflow-hidden relative bg-muted`}>
        <div className={`absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity ${color}`} />
        <img
          src={`https://api.dicebear.com/7.x/notionists/svg?seed=${name}&backgroundColor=transparent`}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="text-muted-foreground font-medium text-sm">{role}</p>
    </motion.div>
  )
}


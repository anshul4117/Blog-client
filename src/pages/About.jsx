// eslint-disable-next-line no-unused-vars
import { useState } from "react";
import MainLayout from "../components/layout/MainLayout.jsx";
import PageTransition from "../components/layout/PageTransition.jsx";
import { Link } from "react-router-dom";
import { Users, Globe, Zap, Target, Heart, Coffee, ArrowRight } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function About() {

  return (
    <MainLayout>
      <PageTransition className="w-full relative overflow-hidden">

        {/* SECTION 1: HERO - THE CREATIVE UNIVERSE */}
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 py-10 overflow-hidden">
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

              {/* Floating 3D Elements Composition (Now on Top) */}
              <div className="relative h-[500px] w-full max-w-5xl mx-auto perspective-1000">
                {/* Floating Card 1: Code */}
                <FloatCard
                  className="absolute top-[10%] left-[15%] z-20"
                  delay={0}
                >
                  <div className="w-64 p-6 rounded-3xl bg-background/40 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                        <Zap size={20} />
                      </div>
                      <div>
                        <div className="h-2 w-20 bg-foreground/20 rounded-full mb-2" />
                        <div className="h-2 w-12 bg-foreground/10 rounded-full" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-foreground/10 rounded-full" />
                      <div className="h-2 w-3/4 bg-foreground/10 rounded-full" />
                    </div>
                  </div>
                </FloatCard>

                {/* Floating Card 2: Image */}
                <FloatCard
                  className="absolute top-[5%] right-[15%] z-10"
                  delay={1.5}
                  duration={6}
                >
                  <div className="w-56 h-72 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-background/50 rotate-6">
                    <img
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop"
                      alt="Abstract"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </FloatCard>

                {/* Floating Card 3: Stats */}
                <FloatCard
                  className="absolute bottom-[15%] left-[25%] z-30"
                  delay={0.5}
                  duration={7}
                >
                  <div className="w-48 p-5 rounded-3xl bg-primary/90 backdrop-blur-md text-primary-foreground shadow-xl -rotate-3">
                    <div className="text-4xl font-black mb-1">4.2M+</div>
                    <div className="text-sm opacity-80 font-medium">Stories Told</div>
                  </div>
                </FloatCard>

                {/* Floating Card 4: User */}
                <FloatCard
                  className="absolute bottom-[10%] right-[25%] z-20"
                  delay={2}
                >
                  <div className="flex items-center gap-3 p-4 pr-8 rounded-full bg-background/60 backdrop-blur-md border border-white/20 shadow-xl">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                      <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="User" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Felix Joined</div>
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
                  <h1 className="text-[5rem] md:text-[9rem] font-black tracking-tighter leading-[0.85] bg-clip-text bg-gradient-to-b from-foreground via-foreground/90 to-foreground/50 filter drop-shadow-xl">
                    ABOUT
                  </h1>

                  {/* Reflection Effect */}
                  <h1 className="text-[5rem] md:text-[9rem] font-black tracking-tighter leading-[0.85] bg-clip-text bg-gradient-to-b from-foreground/20 to-transparent absolute top-[85%] left-0 right-0 scale-y-[-1] opacity-30 blur-[2px] pointer-events-none">
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
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
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
              className="relative"
            >
              <div className="aboslute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl transform rotate-3 scale-105 -z-10" />
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                alt="Team collaboration"
                className="rounded-3xl shadow-2xl border border-border/50 grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Built by Humans.</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                It started in a coffee shop in 2023. Two friends, one problem: existing blogging platforms were too cluttered.
                We wanted a place that felt like a fresh sheet of paper.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Today, we're a distributed team across 4 continents, united by a love for typography and clean code.
              </p>

              <div className="flex gap-8 border-t border-border pt-8">
                <div>
                  <div className="text-3xl font-black text-primary">100%</div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Remote</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-primary">4.9/5</div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Culture Score</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 4: TEAM */}
        <section className="py-24 bg-muted/30 px-6 border-t border-border/50">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-16">Meet the Team</h2>

            <div className="grid md:grid-cols-4 gap-8">
              <TeamMember name="Alex Richardson" role="Founder & CEO" color="bg-blue-200" />
              <TeamMember name="Sarah Chen" role="Head of Design" color="bg-purple-200" />
              <TeamMember name="Marcus Johnson" role="Lead Engineer" color="bg-green-200" />
              <TeamMember name="Emily Davis" role="Community Lead" color="bg-yellow-200" />
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


import { useState } from "react";
import MainLayout from "../components/layout/MainLayout.jsx";
import PageTransition from "../components/layout/PageTransition.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Mail, MapPin, ChevronLeft, ChevronRight, MessageSquare, Quote, Sparkles, Star } from "lucide-react";
import BackgroundMesh from "../components/ui/BackgroundMesh.jsx";
import MagneticOrbBackground from "../components/ui/MagneticOrbBackground.jsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const TESTIMONIALS = [
  {
    text: "Swat and WhatBytes did an excellent job building our website for RagMetrics.ai. They helped refine our vision, showed great flexibility, and completed the project in just three weeks. Highly recommended!",
    author: "Alon Bochman",
    role: "Founder Ragmetrics",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
    rating: 5,
    platforms: ["Google", "Microsoft", "Karta"]
  },
  {
    text: "The speed and premium styling of XDrop's composition tools are phenomenal. Moving our developer blogs to this interface reduced content scheduling delays by almost 40%. The UI/UX is truly state of the art.",
    author: "Dez Blanchfield",
    role: "Principal Architect, CloudNodes",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
    rating: 5,
    platforms: ["Google", "AWS", "Github"]
  },
  {
    text: "Writing on XDrop feels incredibly focused. The HSL Solarized theme keeps contrast comfortable for night writing, and the built-in analytics dashboard gives our authors instant feedback on reach.",
    author: "Sarah Jenkins",
    role: "Content Director, TechChronicle",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    rating: 5,
    platforms: ["Framer", "Slack", "Netlify"]
  }
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" }
  });

  const onSubmit = async (data) => {
    // Simulate server response
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Transmitted payload:", data);
    setSubmitted(true);
    reset();
  };

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background relative overflow-hidden pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <BackgroundMesh />
        <MagneticOrbBackground />
        
        {/* Ambient background glows matching WhatBytes theme */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[15%] left-[5%] w-[45vw] h-[45vw] rounded-full bg-primary/10 blur-[130px] animate-pulse duration-[12s]" />
          <div className="absolute bottom-[20%] right-[5%] w-[35vw] h-[35vw] rounded-full bg-secondary/8 blur-[110px] animate-pulse duration-[16s]" />
        </div>

        <PageTransition className="max-w-7xl mx-auto space-y-24 relative z-10">
          
          {/* Top Form Section: Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-8 mt-4 text-left">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-none text-foreground"
              >
                Excited to hear <br />
                <span className="text-gradient">from you</span>
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="space-y-6 pt-6 font-medium"
              >
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                    <MapPin size={18} />
                  </div>
                  <div className="text-sm leading-relaxed text-muted-foreground">
                    <p className="font-extrabold text-foreground mb-0.5">Location</p>
                    <p>Meerut, India</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                    <Mail size={18} />
                  </div>
                  <div className="text-sm">
                    <p className="font-extrabold text-foreground mb-0.5">Send Frequency</p>
                    <p className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">anshul41171@gmail.com</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Form Column */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="lg:col-span-7"
            >
              <div className="glass-panel rounded-[36px] p-8 md:p-12 border-primary/10 bg-background/30 backdrop-blur-3xl !shadow-none transition-all duration-500 hover:border-primary/30 relative">
                {/* Glowing subtle ring inside form */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />

                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6 text-left"
                    >
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        
                        {/* Name */}
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Name</Label>
                          <Input
                            id="name"
                            placeholder="Enter Your name"
                            {...register("name")}
                            className="h-12 bg-muted/20 border-primary/5 focus:border-primary/40 focus:ring-primary/10 rounded-xl font-bold transition-all text-foreground"
                          />
                          {errors.name && (
                            <p className="text-red-500 text-xs font-semibold">{errors.name.message}</p>
                          )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Email Address</Label>
                          <Input
                            id="email"
                            placeholder="Your email address"
                            {...register("email")}
                            className="h-12 bg-muted/20 border-primary/5 focus:border-primary/40 focus:ring-primary/10 rounded-xl font-bold transition-all text-foreground"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-xs font-semibold">{errors.email.message}</p>
                          )}
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Any Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Write your message here"
                            rows={6}
                            {...register("message")}
                            className="bg-muted/20 border-primary/5 focus:border-primary/40 focus:ring-primary/10 rounded-xl font-medium transition-all text-foreground p-4 resize-none leading-relaxed text-sm"
                          />
                          {errors.message && (
                            <p className="text-red-500 text-xs font-semibold">{errors.message.message}</p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-auto h-12 px-8 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-primary/20 bg-primary hover:bg-primary/95 text-white border-none gap-2 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="h-4 w-4 border-2 border-background border-t-transparent animate-spin rounded-full" />
                              Transmitting...
                            </>
                          ) : (
                            <>
                              Let's collaborate
                            </>
                          )}
                        </Button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center py-10 flex flex-col items-center space-y-6"
                    >
                      <div className="h-16 w-16 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full flex items-center justify-center shadow-lg shadow-green-500/5">
                        <CheckCircle2 size={36} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-extrabold tracking-tight">Signal Received</h3>
                        <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-sm">
                          Thank you! Your collaboration message has successfully bridged the network and was logged to the sandbox database.
                        </p>
                      </div>
                      <Button
                        onClick={() => setSubmitted(false)}
                        className="rounded-full px-8 h-12 text-xs font-black uppercase tracking-widest"
                      >
                        Send New Signal
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Testimonial Section in Middle */}
          <div className="space-y-10 pt-12 border-t border-primary/5 text-left">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight max-w-xl text-foreground">
                You could be the next to add your testimonial. But for now, let's see what others have to say about us!
              </h2>
              
              {/* Carousel controls */}
              <div className="flex gap-2">
                <button 
                  onClick={handlePrevTestimonial}
                  className="h-10 w-10 rounded-full border border-primary/20 hover:border-primary text-muted-foreground hover:text-primary flex items-center justify-center transition-all bg-background/40 active:scale-90"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={handleNextTestimonial}
                  className="h-10 w-10 rounded-full border border-primary/20 hover:border-primary text-muted-foreground hover:text-primary flex items-center justify-center transition-all bg-background/40 active:scale-90"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Testimonials cards carousel display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((testimonial, idx) => {
                const isActive = idx === activeTestimonial;
                
                return (
                  <motion.div
                    key={idx}
                    animate={{
                      opacity: isActive ? 1 : 0.45,
                      scale: isActive ? 1 : 0.98,
                    }}
                    transition={{ duration: 0.4 }}
                    className={`glass-panel p-6 rounded-[28px] flex flex-col justify-between min-h-[220px] transition-all duration-300 ${
                      isActive ? "border-primary/20 bg-primary/[0.03] shadow-lg block" : "border-primary/5 bg-transparent hidden md:flex"
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Quote Mark */}
                      <Quote className="h-6 w-6 text-primary/30" />
                      <p className="text-muted-foreground text-xs leading-relaxed font-semibold">
                        "{testimonial.text}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-6 border-t border-primary/5 mt-6">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.author} 
                        className="h-9 w-9 rounded-full object-cover border border-primary/10"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-foreground truncate">{testimonial.author}</p>
                        <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60 truncate">{testimonial.role}</p>
                      </div>
                      
                      {/* Star and platform badges */}
                      <div className="flex items-center gap-1 bg-primary/10 border border-primary/10 px-2 py-0.5 rounded text-[8px] font-black text-primary uppercase">
                        <Star size={8} fill="currentColor" /> {testimonial.platforms[0]}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer Callout: Do you have an idea? Let's Talk! */}
          <div className="glass-panel rounded-[40px] p-12 md:p-16 border-primary/10 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-8 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Sparkles size={200} className="text-primary" />
            </div>
            
            <div className="space-y-4 relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-foreground">
                Do you have an idea? <br />
                Let's Talk!
              </h2>
              <p className="text-muted-foreground text-sm font-semibold max-w-sm">
                Integrate custom modules, build custom components, and deploy with our developer core.
              </p>
            </div>
            
            <Button 
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="rounded-full px-8 h-12 text-xs font-black uppercase tracking-[0.2em] relative z-10 shrink-0 shadow-lg hover:shadow-primary/20"
            >
              Collaborate Now
            </Button>
          </div>

        </PageTransition>
      </div>
    </MainLayout>
  );
}

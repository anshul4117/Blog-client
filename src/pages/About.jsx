import MainLayout from "../components/layout/MainLayout.jsx";
import PageTransition from "../components/layout/PageTransition.jsx";
import { Code, Users, Globe, Zap } from "lucide-react";

export default function About() {
  return (
    <MainLayout>
      <PageTransition className="min-h-screen py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-16">

          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              About Our Platform
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              We're building the future of digital storytelling. A place where ideas flow freely
              and connections are made through the power of words.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <Feature
              icon={Code}
              title="Modern Stack"
              desc="Built with React 19, Vite, and Tailwind CSS v4 for peak performance."
            />
            <Feature
              icon={Users}
              title="Community First"
              desc="Designed for engagement. Connect with readers via likes and comments."
            />
            <Feature
              icon={Globe}
              title="Global Reach"
              desc="Share your stories with the world on a platform optimized for all devices."
            />
            <Feature
              icon={Zap}
              title="Lightning Fast"
              desc="Experience near-instant page loads with our optimized architecture."
            />
          </div>

        </div>
      </PageTransition>
    </MainLayout>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="p-6 rounded-2xl bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors">
      <div className="h-12 w-12 rounded-xl bg-background shadow-sm flex items-center justify-center text-primary mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}

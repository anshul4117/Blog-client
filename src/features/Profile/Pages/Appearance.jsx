import React from "react";
import { ArrowLeft, Sun, Moon, Monitor, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PageTransition from "@/components/layout/PageTransition";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import toast from "react-hot-toast";

export default function Appearance() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    {
      id: "light",
      name: "Light Mode",
      description: "Force light appearance interface",
      icon: Sun,
      message: "Light theme applied. ☀️",
    },
    {
      id: "dark",
      name: "Dark Mode",
      description: "Force dark appearance interface",
      icon: Moon,
      message: "Dark theme applied. 🌙",
    },
    {
      id: "system",
      name: "System Default",
      description: "Match system settings automatically",
      icon: Monitor,
      message: "Using system theme. 💻",
    },
  ];

  const handleThemeChange = (option) => {
    setTheme(option.id);
    toast.success(option.message);
  };

  return (
    <PageTransition>
      <div className="container max-w-4xl mx-auto py-6 px-4 space-y-8">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="gap-2 pl-0 hover:bg-transparent hover:text-primary rounded-xl"
          >
            <ArrowLeft size={18} /> Back
          </Button>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Appearance</h1>
          <p className="text-muted-foreground">
            Manage how XDrop looks on your device.
          </p>
        </div>

        {/* Theme Cards selection */}
        <Card className="rounded-[32px] glass-panel border-primary/10 overflow-hidden shadow-2xl">
          <CardHeader className="bg-primary/5 border-b border-primary/5">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-primary font-mono">Theme Preferences</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Select your interface display settings. System theme dynamically updates with OS preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 font-sans space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const isActive = theme === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleThemeChange(opt)}
                    className={`relative p-5 rounded-2xl border text-left transition-all cursor-pointer group flex flex-col justify-between h-36 ${
                      isActive
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/5"
                        : "border-primary/10 bg-muted/10 hover:bg-muted/20 hover:border-primary/20"
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className={`p-2.5 rounded-xl ${isActive ? "bg-primary/10 text-primary" : "bg-muted/30 text-muted-foreground group-hover:text-foreground"} transition-colors`}>
                        <Icon size={18} />
                      </div>
                      {isActive && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/25 text-primary text-[9px] font-black uppercase tracking-wider border border-primary/35">
                          <Check size={10} className="stroke-[3]" /> Active
                        </span>
                      )}
                    </div>

                    <div className="space-y-0.5 mt-4">
                      <p className={`text-sm font-bold ${isActive ? "text-primary" : "text-foreground"}`}>{opt.name}</p>
                      <p className="text-[11px] text-muted-foreground leading-normal">{opt.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}

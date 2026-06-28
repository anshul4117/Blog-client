import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import PageTransition from "@/components/layout/PageTransition";
import { Compass, ArrowLeft, UserCog, Lock, Ban, HelpCircle, Shield, Fingerprint, LayoutGrid, Bookmark, LogOut, ChevronRight, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <PageTransition className="max-w-4xl mx-auto py-8 px-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="gap-2 pl-0 hover:bg-transparent hover:text-primary"
        >
          <ArrowLeft size={18} /> Back
        </Button>
        <Link to="/feed">
          <Button variant="outline" className="gap-2">
            <Compass size={18} /> Explore
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      {/* Directory Hub */}
      <Card className="rounded-[32px] glass-panel border-primary/10 overflow-hidden shadow-2xl mb-8">
        <CardHeader className="bg-primary/5 border-b border-primary/5">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-primary font-mono">Account & Settings Directory</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-2 font-sans">
          <Link 
            to="/dashboard/settings/profile"
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-primary/5 transition-all group font-bold text-left"
          >
            <span className="flex items-center gap-3 text-sm text-foreground">
              <UserCog size={18} className="text-primary" /> Update Profile
            </span>
            <ChevronRight size={16} className="text-muted-foreground/60 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link to="/dashboard/settings/security" className="flex items-center justify-between p-3 rounded-2xl hover:bg-primary/5 transition-all group font-bold">
            <span className="flex items-center gap-3 text-sm text-foreground"><Lock size={18} className="text-primary" /> Password & Security</span>
            <ChevronRight size={16} className="text-muted-foreground/60 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link to="/dashboard/settings/blocked" className="flex items-center justify-between p-3 rounded-2xl hover:bg-primary/5 transition-all group font-bold">
            <span className="flex items-center gap-3 text-sm text-foreground"><Ban size={18} className="text-primary" /> Blocked Users</span>
            <ChevronRight size={16} className="text-muted-foreground/60 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link to="/dashboard/settings/help" className="flex items-center justify-between p-3 rounded-2xl hover:bg-primary/5 transition-all group font-bold">
            <span className="flex items-center gap-3 text-sm text-foreground"><HelpCircle size={18} className="text-primary" /> Help Center</span>
            <ChevronRight size={16} className="text-muted-foreground/60 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link to="/dashboard/settings/privacy" className="flex items-center justify-between p-3 rounded-2xl hover:bg-primary/5 transition-all group font-bold">
            <span className="flex items-center gap-3 text-sm text-foreground"><Shield size={18} className="text-primary" /> Privacy Hub</span>
            <ChevronRight size={16} className="text-muted-foreground/60 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link to="/dashboard/settings/account-center" className="flex items-center justify-between p-3 rounded-2xl hover:bg-primary/5 transition-all group font-bold">
            <span className="flex items-center gap-3 text-sm text-foreground"><Fingerprint size={18} className="text-primary" /> Account Center</span>
            <ChevronRight size={16} className="text-muted-foreground/60 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/dashboard/settings/appearance" className="flex items-center justify-between p-3 rounded-2xl hover:bg-primary/5 transition-all group font-bold">
            <span className="flex items-center gap-3 text-sm text-foreground"><Sun size={18} className="text-primary" /> Appearance</span>
            <ChevronRight size={16} className="text-muted-foreground/60 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="h-px bg-primary/10 my-4" />

          <Link to="/dashboard" className="flex items-center justify-between p-3 rounded-2xl hover:bg-primary/5 transition-all group font-bold">
            <span className="flex items-center gap-3 text-sm text-foreground"><LayoutGrid size={18} className="text-primary" /> Creator Dashboard</span>
            <ChevronRight size={16} className="text-muted-foreground/60 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/dashboard/saved" className="flex items-center justify-between p-3 rounded-2xl hover:bg-primary/5 transition-all group font-bold">
            <span className="flex items-center gap-3 text-sm text-foreground"><Bookmark size={18} className="text-primary" /> Saved Publications</span>
            <ChevronRight size={16} className="text-muted-foreground/60 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button onClick={logout} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-red-500/5 transition-all group font-bold text-left">
            <span className="flex items-center gap-3 text-sm text-red-500"><LogOut size={18} /> Terminate Session</span>
            <ChevronRight size={16} className="text-red-500/60 group-hover:translate-x-1 transition-transform" />
          </button>
        </CardContent>
      </Card>
    </PageTransition>
  );
}

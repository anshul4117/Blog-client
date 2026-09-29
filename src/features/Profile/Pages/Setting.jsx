import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import PageTransition from "@/components/layout/PageTransition";
import { 
  Compass, ArrowLeft, UserCog, Lock, Ban, HelpCircle, Shield, 
  Fingerprint, LayoutGrid, Bookmark, LogOut, ChevronRight, Sun, 
  Settings as SettingsIcon 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmLogout = () => {
    logout();
    toast.success("Logged out successfully. See you soon! 👋");
    navigate("/login");
  };

  return (
    <PageTransition className="max-w-4xl mx-auto py-8 px-4 pb-28 sm:pb-32 font-sans">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="gap-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/10 text-foreground hover:text-primary transition-all cursor-pointer border border-primary/10"
        >
          <ArrowLeft size={16} /> Back
        </Button>
        <Link to="/feed">
          <Button variant="outline" className="gap-2 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/20 text-foreground hover:bg-primary/10 cursor-pointer">
            <Compass size={16} /> Explore Feed
          </Button>
        </Link>
      </div>

      <div className="mb-6 space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">Settings & Hub</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-mono font-bold uppercase border border-primary/20">
            Control Center
          </span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Manage your account preferences, security, privacy controls, and content bookmarks.
        </p>
      </div>

      {/* Directory Hub */}
      <Card className="rounded-[32px] glass-panel border-primary/15 overflow-hidden shadow-2xl mb-8">
        <CardHeader className="bg-primary/5 border-b border-primary/10 p-5">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-primary font-mono flex items-center gap-2">
            <SettingsIcon size={16} /> Account & Settings Directory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-2 font-sans">
          
          <Link 
            to="/dashboard/settings/profile"
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-muted/10 border border-primary/10 hover:border-primary/25 hover:bg-primary/5 transition-all group font-bold text-left"
          >
            <span className="flex items-center gap-3 text-xs sm:text-sm text-foreground">
              <UserCog size={18} className="text-primary group-hover:scale-110 transition-transform" /> Update Profile Information
            </span>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
          
          <Link 
            to="/dashboard/settings/security" 
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-muted/10 border border-primary/10 hover:border-primary/25 hover:bg-primary/5 transition-all group font-bold text-left"
          >
            <span className="flex items-center gap-3 text-xs sm:text-sm text-foreground">
              <Lock size={18} className="text-primary group-hover:scale-110 transition-transform" /> Password & Security
            </span>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
          
          <Link 
            to="/dashboard/settings/blocked" 
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-muted/10 border border-primary/10 hover:border-primary/25 hover:bg-primary/5 transition-all group font-bold text-left"
          >
            <span className="flex items-center gap-3 text-xs sm:text-sm text-foreground">
              <Ban size={18} className="text-primary group-hover:scale-110 transition-transform" /> Blocked Accounts
            </span>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
          
          <Link 
            to="/dashboard/settings/help" 
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-muted/10 border border-primary/10 hover:border-primary/25 hover:bg-primary/5 transition-all group font-bold text-left"
          >
            <span className="flex items-center gap-3 text-xs sm:text-sm text-foreground">
              <HelpCircle size={18} className="text-primary group-hover:scale-110 transition-transform" /> Help & Support Center
            </span>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
          
          <Link 
            to="/dashboard/settings/privacy" 
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-muted/10 border border-primary/10 hover:border-primary/25 hover:bg-primary/5 transition-all group font-bold text-left"
          >
            <span className="flex items-center gap-3 text-xs sm:text-sm text-foreground">
              <Shield size={18} className="text-primary group-hover:scale-110 transition-transform" /> Privacy & Data Controls
            </span>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
          
          <Link 
            to="/dashboard/settings/account-center" 
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-muted/10 border border-primary/10 hover:border-primary/25 hover:bg-primary/5 transition-all group font-bold text-left"
          >
            <span className="flex items-center gap-3 text-xs sm:text-sm text-foreground">
              <Fingerprint size={18} className="text-primary group-hover:scale-110 transition-transform" /> Account Center Hub
            </span>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>

          <Link 
            to="/dashboard/settings/appearance" 
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-muted/10 border border-primary/10 hover:border-primary/25 hover:bg-primary/5 transition-all group font-bold text-left"
          >
            <span className="flex items-center gap-3 text-xs sm:text-sm text-foreground">
              <Sun size={18} className="text-primary group-hover:scale-110 transition-transform" /> Appearance & Theme Mode
            </span>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>

          <div className="h-px bg-primary/10 my-4" />

          <Link 
            to="/dashboard" 
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-muted/10 border border-primary/10 hover:border-primary/25 hover:bg-primary/5 transition-all group font-bold text-left"
          >
            <span className="flex items-center gap-3 text-xs sm:text-sm text-foreground">
              <LayoutGrid size={18} className="text-primary group-hover:scale-110 transition-transform" /> Creator Studio & Analytics
            </span>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>

          <Link 
            to="/dashboard/saved" 
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-muted/10 border border-primary/10 hover:border-primary/25 hover:bg-primary/5 transition-all group font-bold text-left"
          >
            <span className="flex items-center gap-3 text-xs sm:text-sm text-foreground">
              <Bookmark size={18} className="text-primary group-hover:scale-110 transition-transform" /> Saved Publications
            </span>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>

          <button 
            type="button"
            onClick={() => setShowLogoutModal(true)} 
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all group font-extrabold text-left cursor-pointer mt-2"
          >
            <span className="flex items-center gap-3 text-xs sm:text-sm text-red-600 dark:text-red-400">
              <LogOut size={18} /> Log Out / Terminate Session
            </span>
            <ChevronRight size={16} className="text-red-500/60 group-hover:translate-x-1 transition-all" />
          </button>
        </CardContent>
      </Card>

      {/* Logout Confirmation Dialog Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-sm rounded-[32px] glass-panel border border-red-500/25 bg-background/95 p-6 shadow-2xl z-10 space-y-4 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20">
                <LogOut size={26} />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-foreground">Log out of your account?</h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  You will need to re-authenticate with your credentials or demo login to access your creator dashboard.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 rounded-xl h-10 text-xs font-bold border-primary/20 text-foreground hover:bg-primary/10 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmLogout}
                  className="flex-1 rounded-xl h-10 text-xs font-black uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 cursor-pointer"
                >
                  Confirm Logout
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

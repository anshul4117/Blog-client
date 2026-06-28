import React, { useState, useMemo } from "react";
import { Bell, BellOff, CheckCheck, Trash2, ShieldAlert, Compass, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/context/NotificationContext";
import NotificationCard from "@/components/notifications/NotificationCard";
import PageTransition from "@/components/layout/PageTransition";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function NotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAllAsRead, 
    clearAll 
  } = useNotifications();

  const [activeTab, setActiveTab] = useState("all"); // "all" | "unread"
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false);

  // Filtered Notifications List
  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") {
      return notifications.filter(n => !n.isRead);
    }
    return notifications;
  }, [notifications, activeTab]);

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    toast.success("All notifications marked as read. 📝");
  };

  const handleConfirmClearAll = async () => {
    await clearAll();
    setIsClearAllDialogOpen(false);
    toast.success("All notifications cleared. 🗑️");
  };

  return (
    <PageTransition className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
            <Bell size={12} /> Inbox Hub
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter">Network <span className="text-gradient">Signals</span></h2>
          <p className="text-muted-foreground text-lg">Manage your interactions, mentions, and system broadcasts.</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Unread Count</p>
          <p className="text-2xl font-black tracking-tighter">{unreadCount}</p>
        </div>
      </div>

      {/* Filter Tabs & Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-3xl glass-panel border-primary/15 bg-primary/[0.01]">
        <div className="flex gap-2">
          {["all", "unread"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-primary/20 text-primary border border-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/15"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {notifications.length > 0 && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleMarkAllRead}
              className="h-11 px-5 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/15 hover:bg-primary/5 cursor-pointer gap-2"
            >
              <CheckCheck size={16} /> Mark all read
            </Button>
            <Button
              onClick={() => setIsClearAllDialogOpen(true)}
              className="h-11 px-5 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 cursor-pointer gap-2 animate-pulse"
            >
              <Trash2 size={16} /> Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Notifications List Content */}
      <div className="max-w-4xl mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-muted-foreground gap-4">
            <Loader2 size={32} className="animate-spin text-primary" />
            <p className="text-xs font-black uppercase tracking-widest">Syncing signals...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[400px] glass-panel rounded-[48px] border-dashed border-primary/20 bg-primary/5 p-12 text-center"
          >
            <div className="h-24 w-24 rounded-[32px] bg-primary/10 text-primary flex items-center justify-center mb-8 shadow-xl shadow-primary/10">
              <BellOff size={48} />
            </div>
            <h3 className="text-3xl font-black tracking-tighter mb-4 text-foreground">Inbox is empty</h3>
            <p className="text-muted-foreground font-medium max-w-sm mx-auto mb-10 leading-relaxed text-lg">
              {activeTab === "unread" 
                ? "You have caught up with all incoming signals." 
                : "We'll let you know when someone interacts with your broadcasts."}
            </p>
            <Link to="/feed">
              <Button size="lg" className="h-16 px-12 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/20 gap-3 group">
                <Compass size={20} className="group-hover:rotate-45 transition-transform" /> Explore Feed
              </Button>
            </Link>
          </motion.div>
        ) : (
          /* List rendering */
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredNotifications.map((notif) => (
                <NotificationCard
                  key={notif._id}
                  notification={notif}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Knowledge Protocol Footer */}
      <div className="p-8 rounded-[40px] glass-panel border-primary/10 bg-primary/5 flex items-center justify-center text-center">
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Sparkles size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Knowledge Protocol</span>
          </div>
          <p className="text-sm text-muted-foreground font-medium italic">"Preserving wisdom in the digital age."</p>
        </div>
      </div>

      {/* Confirmation Dialog for Clear All */}
      <Dialog open={isClearAllDialogOpen} onOpenChange={setIsClearAllDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-red-500/20 glass-panel shadow-2xl p-6 font-sans">
          <DialogHeader className="space-y-3">
            <div className="mx-auto h-12 w-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 border border-red-500/20 shadow-md">
              <ShieldAlert size={22} className="stroke-[2.5]" />
            </div>
            <div className="space-y-1 text-center">
              <DialogTitle className="text-lg font-black tracking-tight text-foreground">Clear All Notifications?</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                This action is irreversible. All of your cached notifications will be permanently deleted from the database.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsClearAllDialogOpen(false)}
              className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider border-primary/15 hover:bg-primary/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmClearAll}
              className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
            >
              Clear All
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}

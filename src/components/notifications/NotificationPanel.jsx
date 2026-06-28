import React, { useState, useMemo } from "react";
import { BellOff, CheckCheck, Trash2, ShieldAlert, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/context/NotificationContext";
import NotificationCard from "./NotificationCard";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function NotificationPanel({ className = "", isMobile = false, onClosePanel }) {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAllAsRead, 
    clearAll 
  } = useNotifications();

  const [activeTab, setActiveTab] = useState("all"); // "all" | "unread" | "mentions"
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false);

  // Filtered Notifications List
  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") {
      return notifications.filter(n => !n.isRead);
    }
    if (activeTab === "mentions") {
      return notifications.filter(n => n.type === "mention");
    }
    return notifications;
  }, [notifications, activeTab]);

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    toast.success("All notifications marked as read. 📝");
  };

  const handleClearAllClick = (e) => {
    e.preventDefault();
    if (notifications.length === 0) return;
    setIsClearAllDialogOpen(true);
  };

  const handleConfirmClearAll = async () => {
    await clearAll();
    setIsClearAllDialogOpen(false);
    toast.success("All notifications cleared. 🗑️");
  };

  return (
    <div className={cn("flex flex-col h-full bg-background font-sans", className)}>
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary/10 bg-primary/[0.02]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black uppercase tracking-widest text-foreground">Inbox Notifications</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-primary/25 text-primary text-[10px] font-black tracking-wider border border-primary/35 animate-pulse">
              {unreadCount} new
            </span>
          )}
        </div>
        
        {/* Quick Toolbar */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMarkAllRead}
              title="Mark all as read"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <CheckCheck size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearAllClick}
              title="Clear all notifications"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-primary/5 p-2 bg-primary/[0.01] shrink-0">
        {["all", "unread", "mentions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer",
              activeTab === tab
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/15"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
            <Loader2 size={24} className="animate-spin text-primary" />
            <p className="text-xs font-bold uppercase tracking-wider">Syncing signals...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-primary/5 flex items-center justify-center text-primary/40 border border-primary/10 shadow-inner">
              <BellOff size={28} className="animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black text-foreground">No notifications yet</p>
              <p className="text-[11px] text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                {activeTab === "unread" 
                  ? "You have caught up with all incoming signals." 
                  : activeTab === "mentions" 
                  ? "Mentions from other broadcast nodes will appear here." 
                  : "We'll let you know when someone interacts with your posts."}
              </p>
            </div>
            <Button
              onClick={() => {
                if (onClosePanel) onClosePanel();
              }}
              variant="outline"
              className="mx-auto rounded-xl h-10 px-5 text-xs font-bold uppercase tracking-wider gap-1.5 border-primary/15 hover:bg-primary/5 cursor-pointer mt-2"
            >
              Go to Feed <ArrowRight size={12} />
            </Button>
          </div>
        ) : (
          /* List rendering */
          <div className="space-y-2.5">
            <AnimatePresence mode="popLayout">
              {filteredNotifications.map((notif) => (
                <NotificationCard
                  key={notif._id}
                  notification={notif}
                  onClickCard={onClosePanel}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Radix Confirmation Dialog for Clear All */}
      <Dialog open={isClearAllDialogOpen} onOpenChange={setIsClearAllDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-red-500/20 glass-panel shadow-2xl p-6 font-sans">
          <DialogHeader className="space-y-3">
            <div className="mx-auto h-12 w-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 border border-red-500/20 shadow-md">
              <ShieldAlert size={22} className="stroke-[2.5]" />
            </div>
            <div className="space-y-1 text-center">
              <DialogTitle className="text-lg font-black tracking-tight text-foreground">Clear All Notifications?</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                This action is irreversible. All of your cached notifications will be permanently deleted from mock database.
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
    </div>
  );
}

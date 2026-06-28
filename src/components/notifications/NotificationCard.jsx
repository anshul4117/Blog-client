import React from "react";
import { Heart, MessageCircle, UserPlus, FileText, Sparkles, Trash2, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNotifications } from "@/context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const TYPE_CONFIG = {
  like: {
    icon: Heart,
    colorClass: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    actionLabel: "liked your post"
  },
  comment: {
    icon: MessageCircle,
    colorClass: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    actionLabel: "commented on your post"
  },
  follow: {
    icon: UserPlus,
    colorClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    actionLabel: "started following you"
  },
  draft: {
    icon: FileText,
    colorClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    actionLabel: "draft reminder"
  },
  welcome: {
    icon: Sparkles,
    colorClass: "bg-primary/10 text-primary border-primary/20",
    actionLabel: "welcome message"
  },
  system: {
    icon: Sparkles,
    colorClass: "bg-primary/10 text-primary border-primary/20",
    actionLabel: "system update"
  }
};

export default function NotificationCard({ notification, onClickCard }) {
  const navigate = useNavigate();
  const { markAsRead, deleteNotification } = useNotifications();
  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.system;
  const IconComponent = config.icon;

  const handleCardClick = async () => {
    // Mark as read immediately
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    
    // Close panel/drawer if callback exists
    if (onClickCard) onClickCard();

    // Navigate to related target
    if (notification.type === "like" || notification.type === "comment") {
      navigate(`/post/${notification.targetId}`);
    } else if (notification.type === "follow") {
      navigate(`/profile?userId=${notification.actorId}`);
    } else if (notification.type === "draft") {
      navigate(`/dashboard/create`);
    } else if (notification.type === "welcome" || notification.type === "system") {
      navigate(`/dashboard/settings`);
    }
  };

  const handleMarkRead = (e) => {
    e.stopPropagation();
    markAsRead(notification._id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteNotification(notification._id);
  };

  // Human readable relative time format
  const formatRelativeTime = (dateStr) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return "";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      onClick={handleCardClick}
      className={cn(
        "relative p-4 rounded-2xl border transition-all cursor-pointer group flex gap-3 text-left overflow-hidden",
        notification.isRead 
          ? "border-primary/5 bg-muted/5 hover:bg-muted/10 hover:border-primary/10" 
          : "border-primary/20 bg-primary/[0.02] hover:bg-primary/[0.04] shadow-sm shadow-primary/5"
      )}
    >
      {/* Unread Left Border Glow */}
      {!notification.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md" />
      )}

      {/* Actor Avatar / Icon */}
      <div className="relative shrink-0">
        {notification.actor?.profilePicture ? (
          <img
            src={notification.actor.profilePicture}
            alt={notification.actor.name}
            className="w-10 h-10 rounded-full object-cover border border-primary/10"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            X
          </div>
        )}
        <div className={cn("absolute -bottom-1 -right-1 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 shadow-md", config.colorClass)}>
          <IconComponent size={10} className="stroke-[2.5]" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-8">
        <div className="flex items-center gap-1.5 flex-wrap">
          {notification.actor?.name && (
            <span className="text-xs font-black text-foreground truncate max-w-[120px]">
              {notification.actor.name}
            </span>
          )}
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {config.actionLabel}
          </span>
        </div>
        <p className={cn("text-xs mt-0.5 line-clamp-2 leading-relaxed", notification.isRead ? "text-muted-foreground/80" : "text-foreground font-semibold")}>
          {notification.message}
        </p>
        <span className="text-[9px] font-bold text-muted-foreground/60 block mt-1.5 font-mono">
          {formatRelativeTime(notification.createdAt)}
        </span>
      </div>

      {/* Interactive Actions Overlay */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.isRead && (
          <Button
            size="icon"
            variant="ghost"
            onClick={handleMarkRead}
            title="Mark as read"
            className="h-8 w-8 rounded-lg hover:bg-primary/10 text-primary border border-transparent hover:border-primary/10"
          >
            <CheckCircle2 size={14} />
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          onClick={handleDelete}
          title="Delete notification"
          className="h-8 w-8 rounded-lg hover:bg-red-500/10 text-red-500 border border-transparent hover:border-red-500/10"
        >
          <Trash2 size={14} />
        </Button>
      </div>

      {/* Unread indicator dot (when hover actions are not visible) */}
      {!notification.isRead && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary animate-pulse group-hover:opacity-0 transition-opacity shrink-0" />
      )}
    </motion.div>
  );
}

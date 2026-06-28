import React, { createContext, useContext, useState, useEffect } from "react";
import secureAPI from "@/lib/secureApi";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await secureAPI.get("/notifications");
      if (res.data?.success) {
        const list = res.data.notifications || [];
        setNotifications(list);
        setUnreadCount(list.filter(n => !n.isRead).length);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleUpdate = () => {
      fetchNotifications();
    };

    window.addEventListener("notifications-update", handleUpdate);
    return () => {
      window.removeEventListener("notifications-update", handleUpdate);
    };
  }, []);

  const markAsRead = async (id) => {
    try {
      const res = await secureAPI.patch(`/notifications/read/${id}`);
      if (res.data?.success) {
        setNotifications(prev => 
          prev.map(n => n._id === id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await secureAPI.patch("/notifications/read-all");
      if (res.data?.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const res = await secureAPI.delete(`/notifications/delete/${id}`);
      if (res.data?.success) {
        setNotifications(prev => prev.filter(n => n._id !== id));
        setUnreadCount(prev => {
          const matched = notifications.find(n => n._id === id);
          if (matched && !matched.isRead) {
            return Math.max(0, prev - 1);
          }
          return prev;
        });
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const clearAll = async () => {
    try {
      const res = await secureAPI.delete("/notifications/clear-all");
      if (res.data?.success) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error clearing all notifications:", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}

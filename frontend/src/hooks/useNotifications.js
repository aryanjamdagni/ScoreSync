import { useCallback, useEffect, useState } from "react";
import { NotificationService } from "../api/services";

export function useNotifications() {
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const list = await NotificationService.list();

      setItems(Array.isArray(list) ? list : []);
      setUnreadCount(
        Array.isArray(list)
          ? list.filter((n) => !n.read).length
          : 0
      );
    } catch (e) {
      console.error("Failed to load notifications", e);
      setError(e);
      setItems([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      await NotificationService.markRead(id);
      setItems((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (e) {
      console.error("Failed to mark notification read", e);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await NotificationService.markAllRead();
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error("Failed to mark all notifications read", e);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    items,
    unreadCount,
    loading,
    error,
    refresh: fetchNotifications,
    markAsRead,
    markAllRead,
  };
}

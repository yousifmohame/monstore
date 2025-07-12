import { useState, useCallback, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export interface Notification {
  id: string;
  type: 'NEW_ORDER' | 'NEW_MESSAGE' | 'LOW_STOCK';
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const notificationsRef = collection(db, 'notifications');
    const q = query(notificationsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Notification));
      
      setNotifications(fetchedNotifications);
      const unread = fetchedNotifications.filter(n => !n.isRead).length;
      setUnreadCount(unread);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken(true);
      if (!idToken) throw new Error("Authentication required");
      
      await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${idToken}` },
      });
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  }, []);

  return { notifications, unreadCount, loading, markAllAsRead };
};

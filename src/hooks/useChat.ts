import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuth } from './useAuth';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: any;
}

export const useChat = (conversationId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      setMessages(msgs);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [conversationId]);

  const sendMessage = useCallback(async (text: string, convId: string, senderId: string) => {
    if (!text.trim()) return;
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: senderId,
          message: text,
          conversationId: convId,
        }),
      });
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  return { messages, loading, error, sendMessage };
};

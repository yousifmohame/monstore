import { useState, useCallback } from 'react';
import { auth } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Conversation {
    id: string;
    userName: string;
    userEmail: string;
    lastMessage: string;
    lastMessageAt: string;
    isReadByAdmin: boolean;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: any;
  isFromAdmin?: boolean;
}

export const useAdminChat = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchConversations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const idToken = await auth.currentUser?.getIdToken(true);
            if (!idToken) throw new Error("Authentication required");
            const response = await fetch('/api/admin/messages', {
                headers: { 'Authorization': `Bearer ${idToken}` },
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Failed to fetch conversations');
            const data = await response.json();
            setConversations(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const listenForMessages = useCallback((conversationId: string) => {
        const messagesRef = collection(db, 'conversations', conversationId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
            setMessages(msgs);
        });
        
        return unsubscribe;
    }, []);

    const sendAdminMessage = useCallback(async (conversationId: string, message: string) => {
        try {
            const idToken = await auth.currentUser?.getIdToken(true);
            if (!idToken) throw new Error("Authentication required");
            const response = await fetch(`/api/admin/messages/${conversationId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
                body: JSON.stringify({ message }),
            });
            if (!response.ok) throw new Error('Failed to send message');
        } catch (err: any) {
            console.error("Send admin message error:", err);
            throw err;
        }
    }, []);

    return { conversations, messages, loading, error, fetchConversations, listenForMessages, sendAdminMessage };
};

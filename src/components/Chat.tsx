'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useChat, Message } from '@/hooks/useChat';

export default function Chat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  // استخدام localStorage لتخزين معرف المحادثة للزوار
  const [conversationId, setConversationId] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('conversationId') : null
  );
  const { messages, sendMessage } = useChat(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const senderId = user?.id || localStorage.getItem('guestId') || `guest_${Date.now()}`;
    if (!localStorage.getItem('guestId') && !user) {
      localStorage.setItem('guestId', senderId);
    }

    // إذا لم تكن هناك محادثة، سيقوم الـ API بإنشاء واحدة
    const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: senderId,
          message: newMessage,
          conversationId: conversationId,
        }),
      });
    
    if (response.ok) {
        const data = await response.json();
        if (data.conversationId && !conversationId) {
            setConversationId(data.conversationId);
            localStorage.setItem('conversationId', data.conversationId);
        }
    }
    setNewMessage('');
  };

  const senderId = user?.id || (typeof window !== 'undefined' ? localStorage.getItem('guestId') : null);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-primary-600 text-white rounded-full p-4 shadow-lg z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="h-8 w-8" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <header className="bg-primary-600 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">تواصل معنا</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full"><X className="h-5 w-5" /></button>
            </header>

            <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.senderId === senderId ? 'justify-end' : 'justify-start'}`}>
                    {msg.senderId !== senderId && <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center"><Shield size={18} /></div>}
                    <div className={`max-w-xs p-3 rounded-2xl ${msg.senderId === senderId ? 'bg-primary-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                      <p>{msg.text}</p>
                    </div>
                    {msg.senderId === senderId && <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center"><User size={18} /></div>}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </main>

            <footer className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  className="input-field flex-1"
                />
                <button type="submit" className="btn-primary p-3"><Send className="h-5 w-5" /></button>
              </form>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

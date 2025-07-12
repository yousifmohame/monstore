'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Inbox, Search, User, Shield, Send } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useAdminChat, Conversation, Message } from '@/hooks/useAdminChat';
import Image from 'next/image';

export default function AdminMessagesPage() {
  const { user, profile } = useAuth();
  const { conversations, messages, loading, error, fetchConversations, listenForMessages, sendAdminMessage } = useAdminChat();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && profile?.isAdmin) {
      fetchConversations();
    }
  }, [user, profile, fetchConversations]);

  useEffect(() => {
    if (selectedConversation) {
      const unsubscribe = listenForMessages(selectedConversation.id);
      return () => unsubscribe();
    }
  }, [selectedConversation, listenForMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      await sendAdminMessage(selectedConversation.id, newMessage);
      setNewMessage('');
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (!user || !profile?.isAdmin) {
    return <div>غير مصرح لك بالدخول.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">الرسائل والمحادثات</h1>
        <div className="bg-white rounded-2xl shadow-lg h-[70vh] flex">
          {/* Conversations List */}
          <aside className="w-1/3 border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b"><div className="relative"><Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="text" placeholder="بحث..." className="w-full pr-10 pl-4 py-2 border rounded-lg" /></div></div>
            <div className="flex-1 overflow-y-auto">
              {loading ? <div className="p-4 text-center">جاري التحميل...</div> :
                conversations.map(convo => (
                  <div key={convo.id} onClick={() => setSelectedConversation(convo)} className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedConversation?.id === convo.id ? 'bg-primary-50' : ''}`}>
                    <div className="flex justify-between items-center"><h3 className="font-semibold">{convo.userName}</h3><span className="text-xs text-gray-500">{new Date(convo.lastMessageAt).toLocaleTimeString('ar-SA')}</span></div>
                    <p className={`text-sm line-clamp-1 ${!convo.isReadByAdmin ? 'text-gray-800 font-bold' : 'text-gray-500'}`}>{convo.lastMessage}</p>
                  </div>
                ))
              }
            </div>
          </aside>

          {/* Chat Window */}
          <main className="w-2/3 flex flex-col">
            {selectedConversation ? (
              <>
                <header className="p-4 border-b flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"><User /></div>
                  <div><h2 className="font-bold">{selectedConversation.userName}</h2><p className="text-sm text-gray-500">{selectedConversation.userEmail}</p></div>
                </header>
                <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                  <div className="space-y-4">
                    {messages.map(msg => (
                      <div key={msg.id} className={`flex gap-3 ${msg.isFromAdmin ? 'justify-end' : 'justify-start'}`}>
                        {msg.isFromAdmin && <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0"><Shield size={18} /></div>}
                        <div className={`max-w-md p-3 rounded-2xl ${msg.isFromAdmin ? 'bg-primary-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}><p>{msg.text}</p></div>
                        {!msg.isFromAdmin && <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center flex-shrink-0"><User size={18} /></div>}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                <footer className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="اكتب ردك هنا..." className="input-field flex-1" />
                    <button type="submit" className="btn-primary p-3"><Send className="h-5 w-5" /></button>
                  </form>
                </footer>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
                <Inbox size={64} className="mb-4" />
                <h2 className="text-xl font-bold">اختر محادثة</h2>
                <p>اختر محادثة من القائمة لبدء الدردشة.</p>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

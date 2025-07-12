'use client';

import React, { useState } from 'react';
import { Bell, MessageCircle, ShoppingCart, Star, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAdminNotifications, Notification } from '@/hooks/useAdminNotifications';
import TimeAgo from 'react-timeago';
// @ts-ignore
import arStrings from 'react-timeago/lib/language-strings/ar';
// @ts-ignore
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

const formatter = buildFormatter(arStrings);

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
    switch (type) {
        case 'NEW_ORDER': return <ShoppingCart className="h-5 w-5 text-green-500" />;
        case 'NEW_MESSAGE': return <MessageCircle className="h-5 w-5 text-blue-500" />;
        case 'LOW_STOCK': return <Package className="h-5 w-5 text-orange-500" />;
        default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
};

export default function AdminNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead } = useAdminNotifications();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleToggle}
        className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
        whileHover={{ scale: 1.1 }}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <motion.span 
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border z-50"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">الإشعارات</h3>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-sm text-primary-600 hover:underline">
                  تعيين الكل كمقروء
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 py-8">لا توجد إشعارات جديدة</p>
              ) : (
                notifications.map(notification => (
                  <Link key={notification.id} href={notification.link} onClick={() => setIsOpen(false)}>
                    <div className={`p-4 border-b hover:bg-gray-50 flex gap-3 ${!notification.isRead ? 'bg-blue-50' : ''}`}>
                      <div className="flex-shrink-0"><NotificationIcon type={notification.type} /></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          <TimeAgo date={notification.createdAt} formatter={formatter} />
                        </p>
                      </div>
                      {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full self-center"></div>}
                    </div>
                  </Link>
                ))
              )}
            </div>
            <div className="p-2 text-center bg-gray-50">
                <Link href="/admin/notifications" onClick={() => setIsOpen(false)} className="text-sm font-semibold text-primary-600 hover:underline">
                    عرض كل الإشعارات
                </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

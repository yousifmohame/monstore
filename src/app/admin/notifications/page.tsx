'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, MessageCircle, Package, Star, ShoppingBag, Filter, Search, Trash2, CheckCircle, ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';

interface Notification {
  id: string;
  type: 'message' | 'order' | 'review' | 'stock';
  title: string;
  content: string;
  time: string;
  read: boolean;
  link: string;
}

export default function AdminNotificationsPage() {
  const { user, profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'message' | 'order' | 'review' | 'stock'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Check if user is admin
  if (!user || !profile?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">غير مصرح</h1>
            <p className="text-gray-600 mb-8">ليس لديك صلاحية للوصول لهذه الصفحة</p>
            <a href="/" className="btn-primary">
              العودة للرئيسية
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mock function to fetch notifications
  const fetchNotifications = () => {
    // In a real app, this would be an API call
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'message',
        title: 'رسالة جديدة',
        content: 'أحمد محمد أرسل رسالة: "أريد الاستفسار عن طلبي الأخير"',
        time: '2024-01-20T10:30:00',
        read: false,
        link: '/admin/messages/1'
      },
      {
        id: '2',
        type: 'order',
        title: 'طلب جديد',
        content: 'تم استلام طلب جديد #ORD-1234567 بقيمة 350 ريال',
        time: '2024-01-20T09:45:00',
        read: false,
        link: '/admin/orders/2'
      },
      {
        id: '3',
        type: 'review',
        title: 'تقييم جديد',
        content: 'فاطمة أحمد قامت بتقييم منتج "تيشيرت ناروتو الأصلي" بـ 5 نجوم',
        time: '2024-01-19T18:20:00',
        read: true,
        link: '/admin/reviews/3'
      },
      {
        id: '4',
        type: 'stock',
        title: 'تنبيه المخزون',
        content: 'المنتج "حقيبة ظهر أتاك أون تايتان" وصل للحد الأدنى (5 قطع متبقية)',
        time: '2024-01-19T14:10:00',
        read: true,
        link: '/admin/products/edit/2'
      },
      {
        id: '5',
        type: 'order',
        title: 'تحديث حالة طلب',
        content: 'تم شحن الطلب #ORD-1234560 بنجاح',
        time: '2024-01-19T11:30:00',
        read: true,
        link: '/admin/orders/5'
      },
      {
        id: '6',
        type: 'message',
        title: 'رسالة جديدة',
        content: 'محمد علي أرسل رسالة: "متى سيتم توفير المنتج مرة أخرى؟"',
        time: '2024-01-18T16:45:00',
        read: true,
        link: '/admin/messages/6'
      },
      {
        id: '7',
        type: 'review',
        title: 'تقييم جديد',
        content: 'خالد عبدالله قام بتقييم منتج "غطاء هاتف ديمون سلاير" بـ 4 نجوم',
        time: '2024-01-18T13:20:00',
        read: true,
        link: '/admin/reviews/7'
      },
      {
        id: '8',
        type: 'stock',
        title: 'نفاد المخزون',
        content: 'المنتج "تمثال غوكو الذهبي" نفد من المخزون',
        time: '2024-01-17T09:15:00',
        read: true,
        link: '/admin/products/edit/4'
      },
      {
        id: '9',
        type: 'order',
        title: 'طلب جديد',
        content: 'تم استلام طلب جديد #ORD-1234555 بقيمة 420 ريال',
        time: '2024-01-16T14:30:00',
        read: true,
        link: '/admin/orders/9'
      },
      {
        id: '10',
        type: 'message',
        title: 'رسالة جديدة',
        content: 'نورة سعيد أرسلت رسالة: "هل يمكنني تغيير عنوان التوصيل؟"',
        time: '2024-01-15T11:10:00',
        read: true,
        link: '/admin/messages/10'
      }
    ];
    
    setNotifications(mockNotifications);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    setSelectedNotifications(prev => prev.filter(notificationId => notificationId !== id));
  };

  const deleteSelectedNotifications = () => {
    setNotifications(prev => prev.filter(notification => !selectedNotifications.includes(notification.id)));
    setSelectedNotifications([]);
    setSelectAll(false);
  };

  const toggleSelectNotification = (id: string) => {
    setSelectedNotifications(prev => {
      if (prev.includes(id)) {
        return prev.filter(notificationId => notificationId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(getFilteredNotifications().map(n => n.id));
    }
    setSelectAll(!selectAll);
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    // Apply type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(notification => notification.type === activeFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(notification => 
        notification.title.toLowerCase().includes(query) || 
        notification.content.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'order':
        return <Package className="h-5 w-5 text-green-500" />;
      case 'review':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'stock':
        return <ShoppingBag className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">الإشعارات</h1>
            <p className="text-gray-600">إدارة جميع الإشعارات والتنبيهات</p>
          </div>
          
          <Link href="/admin">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              العودة للوحة التحكم
            </button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="anime-card p-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">إجمالي الإشعارات</h3>
            <p className="text-3xl font-bold text-gray-800">{notifications.length}</p>
          </div>
          <div className="anime-card p-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">غير مقروءة</h3>
            <p className="text-3xl font-bold text-red-600">{unreadCount}</p>
          </div>
          <div className="anime-card p-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">رسائل جديدة</h3>
            <p className="text-3xl font-bold text-blue-600">{notifications.filter(n => n.type === 'message' && !n.read).length}</p>
          </div>
          <div className="anime-card p-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">طلبات جديدة</h3>
            <p className="text-3xl font-bold text-green-600">{notifications.filter(n => n.type === 'order' && !n.read).length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في الإشعارات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                />
              </div>
              
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">جميع الإشعارات</option>
                <option value="message">الرسائل</option>
                <option value="order">الطلبات</option>
                <option value="review">التقييمات</option>
                <option value="stock">المخزون</option>
              </select>
            </div>
            
            <div className="flex gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <CheckCircle className="h-4 w-4" />
                  تعيين الكل كمقروء
                </button>
              )}
              
              {selectedNotifications.length > 0 && (
                <button
                  onClick={deleteSelectedNotifications}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  حذف المحدد ({selectedNotifications.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          {filteredNotifications.length === 0 ? (
            <div className="p-16 text-center">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد إشعارات</h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? 'لا توجد نتائج مطابقة لبحثك' 
                  : activeFilter !== 'all' 
                    ? `لا توجد إشعارات من نوع ${
                        activeFilter === 'message' ? 'الرسائل' : 
                        activeFilter === 'order' ? 'الطلبات' : 
                        activeFilter === 'review' ? 'التقييمات' : 'المخزون'
                      }`
                    : 'لا توجد إشعارات حالياً'
                }
              </p>
            </div>
          ) : (
            <div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-right">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">النوع</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">العنوان</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">المحتوى</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">التاريخ</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotifications.map((notification) => (
                    <tr 
                      key={notification.id} 
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-4 py-4">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedNotifications.includes(notification.id)}
                            onChange={() => toggleSelectNotification(notification.id)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </label>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {getNotificationIcon(notification.type)}
                          <span className="text-sm">
                            {notification.type === 'message' ? 'رسالة' : 
                             notification.type === 'order' ? 'طلب' : 
                             notification.type === 'review' ? 'تقييم' : 'مخزون'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-medium">
                        {notification.title}
                        {!notification.read && (
                          <span className="mr-2 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs">
                            جديد
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-gray-600 max-w-xs truncate">
                        {notification.content}
                      </td>
                      <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                        {getFormattedDate(notification.time)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={notification.link}>
                            <button 
                              className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded hover:bg-blue-50"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </Link>
                          
                          <button 
                            className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
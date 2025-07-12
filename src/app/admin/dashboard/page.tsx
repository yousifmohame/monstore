'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Users, ShoppingCart, TrendingUp, Bell, MessageCircle, Star, ShoppingBag, ArrowUp, ArrowDown, Eye, Calendar } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { mockOrders, mockProducts, mockUsers } from '@/lib/mockData';

export default function AdminDashboardPage() {
  const { user, profile } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSales: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
    unreadMessages: 0
  });

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

  // Fetch data on component mount
  useEffect(() => {
    fetchStats();
    fetchNotifications();
  }, []);

  // Mock function to fetch stats
  const fetchStats = () => {
    // Calculate stats from mock data
    const totalOrders = mockOrders.length;
    const pendingOrders = mockOrders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING').length;
    const totalSales = mockOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalCustomers = mockUsers.length;
    const lowStockProducts = mockProducts.filter(p => p.stock < 10).length;
    const unreadMessages = 3; // Mock value

    setStats({
      totalOrders,
      pendingOrders,
      totalSales,
      totalCustomers,
      lowStockProducts,
      unreadMessages
    });
  };

  // Mock function to fetch notifications
  const fetchNotifications = () => {
    // In a real app, this would be an API call
    const mockNotifications = [
      {
        id: '1',
        type: 'message',
        title: 'رسالة جديدة',
        content: 'أحمد محمد أرسل رسالة: "أريد الاستفسار عن طلبي الأخير"',
        time: '2024-01-20T10:30:00',
        read: false,
        link: '/admin/messages'
      },
      {
        id: '2',
        type: 'order',
        title: 'طلب جديد',
        content: 'تم استلام طلب جديد #ORD-1234567 بقيمة 350 ريال',
        time: '2024-01-20T09:45:00',
        read: false,
        link: '/admin/orders'
      },
      {
        id: '3',
        type: 'review',
        title: 'تقييم جديد',
        content: 'فاطمة أحمد قامت بتقييم منتج "تيشيرت ناروتو الأصلي" بـ 5 نجوم',
        time: '2024-01-19T18:20:00',
        read: true,
        link: '/admin/reviews'
      },
      {
        id: '4',
        type: 'stock',
        title: 'تنبيه المخزون',
        content: 'المنتج "حقيبة ظهر أتاك أون تايتان" وصل للحد الأدنى (5 قطع متبقية)',
        time: '2024-01-19T14:10:00',
        read: true,
        link: '/admin/products'
      }
    ];

    setNotifications(mockNotifications);
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

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'الآن';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">لوحة التحكم</h1>
            <p className="text-gray-600">مرحباً بك في لوحة إدارة متجر كيوتاكو</p>
          </div>

          <div className="flex gap-3">
            <Link href="/admin/products/add">
              <motion.button
                className="btn-primary flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Package className="h-5 w-5" />
                إضافة منتج
              </motion.button>
            </Link>

            <Link href="/admin/notifications">
              <motion.button
                className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors bg-white rounded-lg shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="anime-card p-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-5"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <span className="text-green-600 text-xs font-semibold">+12%</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{stats.totalOrders}</h3>
              <p className="text-xs text-gray-600">إجمالي الطلبات</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="anime-card p-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-5"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                  <ShoppingCart className="h-4 w-4 text-white" />
                </div>
                <span className="text-green-600 text-xs font-semibold">+8%</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{stats.pendingOrders}</h3>
              <p className="text-xs text-gray-600">طلبات قيد المعالجة</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="anime-card p-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 opacity-5"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <span className="text-green-600 text-xs font-semibold">+15%</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{stats.totalCustomers}</h3>
              <p className="text-xs text-gray-600">العملاء النشطين</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="anime-card p-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-5"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span className="text-green-600 text-xs font-semibold">+23%</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{stats.totalSales.toFixed(0)} ريال</h3>
              <p className="text-xs text-gray-600">المبيعات الشهرية</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="anime-card p-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-5"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600">
                  <ShoppingBag className="h-4 w-4 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{stats.lowStockProducts}</h3>
              <p className="text-xs text-gray-600">منتجات قليلة المخزون</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="anime-card p-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-5"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{stats.unreadMessages}</h3>
              <p className="text-xs text-gray-600">رسائل غير مقروءة</p>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Notifications */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="anime-card p-6 h-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary-600" />
                  آخر الإشعارات
                </h2>
                <Link href="/admin/notifications" className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
                  عرض الكل
                </Link>
              </div>

              <div className="space-y-4">
                {notifications.slice(0, 5).map((notification) => (
                  <Link
                    key={notification.id}
                    href={notification.link}
                    className={`block p-3 rounded-lg transition-colors ${!notification.read ? 'bg-blue-50 hover:bg-blue-100' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          <span className="text-xs text-gray-500 whitespace-nowrap mr-2">
                            {getTimeAgo(notification.time)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {notification.content}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="anime-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary-600" />
                  آخر الطلبات
                </h2>
                <Link href="/admin/orders" className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
                  عرض الكل
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">رقم الطلب</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">العميل</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">المبلغ</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">الحالة</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">التاريخ</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium">
                          {order.orderNumber}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {order.shippingAddress.fullName}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-primary-600">
                          {order.totalAmount.toFixed(2)} ريال
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                            }`}>
                            {order.status === 'PENDING' ? 'قيد الانتظار' :
                              order.status === 'PROCESSING' ? 'قيد المعالجة' :
                                order.status === 'SHIPPED' ? 'تم الشحن' :
                                  order.status === 'DELIVERED' ? 'تم التسليم' :
                                    'ملغي'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Link href={`/admin/orders/${order.id}`}>
                            <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                              عرض
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Sales Chart and Calendar */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="anime-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary-600" />
                  إحصائيات المبيعات
                </h2>
                <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                  <option value="week">آخر أسبوع</option>
                  <option value="month">آخر شهر</option>
                  <option value="year">آخر سنة</option>
                </select>
              </div>

              {/* Placeholder for chart */}
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">رسم بياني للمبيعات</p>
                </div>
              </div>

              {/* Stats below chart */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">إجمالي المبيعات</p>
                  <p className="text-xl font-bold text-primary-600">{stats.totalSales.toFixed(0)} ريال</p>
                  <p className="text-xs text-green-600">
                    <ArrowUp className="h-3 w-3 inline" /> 12.5%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">متوسط الطلب</p>
                  <p className="text-xl font-bold text-gray-800">
                    {stats.totalOrders > 0 ? (stats.totalSales / stats.totalOrders).toFixed(0) : 0} ريال
                  </p>
                  <p className="text-xs text-green-600">
                    <ArrowUp className="h-3 w-3 inline" /> 5.2%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">معدل التحويل</p>
                  <p className="text-xl font-bold text-gray-800">3.2%</p>
                  <p className="text-xs text-red-600">
                    <ArrowDown className="h-3 w-3 inline" /> 1.5%
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Calendar / Upcoming */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="anime-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary-600" />
                  المهام القادمة
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800">تحديث المخزون</h3>
                    <span className="text-xs text-gray-500">اليوم</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    5 منتجات بحاجة لتحديث المخزون
                  </p>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800">الرد على الرسائل</h3>
                    <span className="text-xs text-gray-500">اليوم</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    3 رسائل بحاجة للرد
                  </p>
                </div>

                <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800">شحن الطلبات</h3>
                    <span className="text-xs text-gray-500">غداً</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    7 طلبات جاهزة للشحن
                  </p>
                </div>

                <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800">إضافة منتجات جديدة</h3>
                    <span className="text-xs text-gray-500">بعد غد</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    إضافة مجموعة المنتجات الجديدة
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
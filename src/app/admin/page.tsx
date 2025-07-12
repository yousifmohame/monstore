'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Users, ShoppingCart, TrendingUp, Plus, Eye, Edit, Trash2, Star, Settings, Bell, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Chat from '@/components/Chat';
import { useAuth } from '@/hooks/useAuth';
// 1. استيراد الـ Hook الخاص ببيانات لوحة التحكم
import { useAdminDashboard } from '@/hooks/useAdminDashboard';

export default function AdminDashboardPage() {
  const { user, profile } = useAuth();
  // 2. استخدام الـ Hook لجلب البيانات وحالات التحميل والخطأ
  const { stats, loading, error, fetchDashboardData } = useAdminDashboard();

  // 3. جلب البيانات عند تحميل المكون أو عند تغير المستخدم
  useEffect(() => {
    if (user && profile?.isAdmin) {
      fetchDashboardData();
    }
  }, [user, profile, fetchDashboardData]);

  // 4. بناء بطاقات الإحصائيات من البيانات الحقيقية
  const statCards = stats ? [
    { title: 'إجمالي المنتجات', value: stats.totalProducts, icon: Package, color: 'from-blue-500 to-blue-600' },
    { title: 'إجمالي الطلبات', value: stats.totalSales, icon: ShoppingCart, color: 'from-green-500 to-green-600' },
    { title: 'العملاء النشطين', value: stats.totalUsers, icon: Users, color: 'from-purple-500 to-purple-600' },
    { title: 'إجمالي الإيرادات', value: `${stats.totalRevenue.toFixed(2)} ريال`, icon: TrendingUp, color: 'from-orange-500 to-orange-600' }
  ] : [];

  // 5. التحقق من صلاحيات المدير
  if (!user || !profile?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">غير مصرح</h1>
          <p className="text-gray-600 mb-8">ليس لديك صلاحية للوصول لهذه الصفحة</p>
          <a href="/" className="btn-primary">العودة للرئيسية</a>
        </div>
        <Footer />
      </div>
    );
  }

  // 6. عرض حالة التحميل
  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50"><Header /><div className="container-custom py-20 text-center"><div className="loading-dots mb-4"><div></div><div></div><div></div><div></div></div><p>جاري تحميل لوحة التحكم...</p></div><Footer /></div>
    );
  }

  // 7. عرض حالة الخطأ
  if (error) {
      return (
          <div className="min-h-screen bg-gray-50"><Header /><div className="container-custom py-20 text-center"><h1 className="text-3xl font-bold text-red-600">حدث خطأ</h1><p>{error}</p></div><Footer /></div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">لوحة التحكم - كيوتاكو</h1>
            <p className="text-gray-600">مرحباً بك في لوحة إدارة متجر كيوتاكو</p>
          </div>
          <Link href="/admin/products/add"><motion.button className="btn-primary flex items-center gap-2" whileHover={{ scale: 1.05 }}><Plus /> إضافة منتج</motion.button></Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats && stats.unreadMessages > 0 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between"><div className="flex items-center gap-3"><div className="bg-blue-100 p-2 rounded-lg"><MessageCircle className="h-5 w-5 text-blue-600" /></div><div><h3 className="font-semibold text-blue-800">رسائل جديدة</h3><p className="text-sm text-blue-600">{stats.unreadMessages} رسائل بحاجة للرد</p></div></div><Link href="/admin/messages"><button className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm">عرض</button></Link></motion.div>}
          {stats && stats.pendingOrders > 0 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between"><div className="flex items-center gap-3"><div className="bg-green-100 p-2 rounded-lg"><Package className="h-5 w-5 text-green-600" /></div><div><h3 className="font-semibold text-green-800">طلبات جديدة</h3><p className="text-sm text-green-600">{stats.pendingOrders} طلبات بحاجة للمعالجة</p></div></div><Link href="/admin/orders"><button className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm">عرض</button></Link></motion.div>}
          {stats && stats.newReviews > 0 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between"><div className="flex items-center gap-3"><div className="bg-yellow-100 p-2 rounded-lg"><Star className="h-5 w-5 text-yellow-600" /></div><div><h3 className="font-semibold text-yellow-800">تقييمات جديدة</h3><p className="text-sm text-yellow-600">{stats.newReviews} تقييمات جديدة</p></div></div><Link href="/admin/reviews"><button className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg text-sm">عرض</button></Link></motion.div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="anime-card p-6 relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5`}></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4"><div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}><stat.icon className="h-6 w-6 text-white" /></div></div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                <p className="text-gray-600">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="anime-card p-6">
              <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-gray-800">المنتجات الحديثة</h2><Link href="/admin/products" className="text-primary-600 hover:text-primary-700 font-semibold">عرض الكل</Link></div>
              <div className="space-y-4">
                {/* **الإصلاح الرئيسي: التأكد من وجود البيانات قبل استخدام .map** */}
                {stats?.recentProducts?.map((product: any) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Image src={product.images[0]?.imageUrl || '/placeholder.jpg'} alt={product.nameAr} width={64} height={64} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{product.nameAr}</h3>
                      <div className="flex items-center gap-2 mt-1"><p className="text-primary-600 font-bold">{product.salePrice || product.price} ريال</p>{product.salePrice && <p className="text-gray-400 text-sm line-through">{product.price} ريال</p>}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/products/${product.slug}`}><button className="p-2 text-gray-600 hover:text-blue-600"><Eye className="h-4 w-4" /></button></Link>
                      <Link href={`/admin/products/edit/${product.id}`}><button className="p-2 text-gray-600 hover:text-green-600"><Edit className="h-4 w-4" /></button></Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="anime-card p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">إجراءات سريعة</h3>
              <div className="space-y-3">
                <Link href="/admin/products" className="block"><button className="w-full text-right p-3 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-lg">إذارة المنتجات</button></Link>
                <Link href="/admin/orders" className="block"><button className="w-full text-right p-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg">إدارة الطلبات</button></Link>
                <Link href="/admin/categories" className="block"><button className="w-full text-right p-3 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg">إدارة الفئات</button></Link>
                <Link href="/admin/settings" className="block"><button className="w-full text-right p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center gap-2"><Settings className="h-4 w-4" />إعدادات المتجر</button></Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="anime-card p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">إحصائيات سريعة</h3>
              <div className="space-y-4">
                <div className="flex justify-between"><span className="text-gray-600">منتجات نفدت</span><span className="font-semibold text-red-600">{stats?.outOfStockProducts || 0}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">طلبات جديدة</span><span className="font-semibold text-green-600">{stats?.pendingOrders || 0}</span></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
      <Chat />
    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, Eye, Download } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import { useAuth } from '@/hooks/useAuth';
import { useOrders, Order } from '@/hooks/useOrders';
import Link from 'next/link';

const getStatusInfo = (status: Order['status']) => {
  switch (status) {
    case 'PENDING': return { text: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
    case 'PROCESSING': return { text: 'قيد المعالجة', color: 'bg-blue-100 text-blue-800', icon: Package };
    case 'SHIPPED': return { text: 'تم الشحن', color: 'bg-purple-100 text-purple-800', icon: Truck };
    case 'DELIVERED': return { text: 'تم التسليم', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    case 'CANCELLED': return { text: 'ملغي', color: 'bg-red-100 text-red-800', icon: CheckCircle };
    default: return { text: status, color: 'bg-gray-100 text-gray-800', icon: Package };
  }
};

export default function OrdersPage() {
  const { user } = useAuth();
  const { orders, loading, error, fetchOrders } = useOrders();
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const statusOptions = useMemo(() => {
    const counts = {
      all: orders.length,
      PENDING: orders.filter(o => o.status === 'PENDING').length,
      PROCESSING: orders.filter(o => o.status === 'PROCESSING').length,
      SHIPPED: orders.filter(o => o.status === 'SHIPPED').length,
      DELIVERED: orders.filter(o => o.status === 'DELIVERED').length,
      CANCELLED: orders.filter(o => o.status === 'CANCELLED').length,
    };
    return [
      { value: 'all', label: 'جميع الطلبات', count: counts.all },
      { value: 'PENDING', label: 'قيد الانتظار', count: counts.PENDING },
      { value: 'PROCESSING', label: 'قيد المعالجة', count: counts.PROCESSING },
      { value: 'SHIPPED', label: 'تم الشحن', count: counts.SHIPPED },
      { value: 'DELIVERED', label: 'تم التسليم', count: counts.DELIVERED },
      { value: 'CANCELLED', label: 'ملغي', count: counts.CANCELLED }
    ];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') {
      return orders;
    }
    return orders.filter(order => order.status === statusFilter);
  }, [orders, statusFilter]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20 text-center">
          <Package className="h-20 w-20 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">يجب تسجيل الدخول أولاً</h1>
          <p className="text-gray-600 mb-8">للوصول إلى طلباتك، يرجى تسجيل الدخول</p>
          <Link href="/auth/login" className="btn-primary">تسجيل الدخول</Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20 text-center">
          <div className="loading-dots mb-4"><div></div><div></div><div></div><div></div></div>
          <p className="text-xl text-gray-600 font-medium">جاري تحميل طلباتك...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold text-red-600">حدث خطأ</h1>
          <p className="text-gray-600 mt-4">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <section className="relative anime-gradient text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="container-custom relative text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">طلباتي 📦</h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">تتبع جميع طلباتك ومعرفة حالة التوصيل</p>
          </motion.div>
        </div>
      </section>
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4 justify-center">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  statusFilter === option.value
                    ? 'anime-gradient text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  statusFilter === option.value ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {option.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container-custom">
          {filteredOrders.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
              <Package className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">لا توجد طلبات</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {statusFilter === 'all' 
                  ? 'لم تقم بأي طلبات حتى الآن. ابدأ التسوق واكتشف منتجاتنا الرائعة!'
                  : `لا توجد طلبات بحالة "${getStatusInfo(statusFilter as Order['status']).text}"`
                }
              </p>
              <Link href="/products" className="btn-primary text-lg px-8 py-4">ابدأ التسوق</Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order, index) => {
                const { text, color, icon: StatusIcon } = getStatusInfo(order.status);
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="anime-card p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <h3 className="text-xl font-bold text-gray-800">طلب #{order.orderNumber}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${color}`}>
                            <StatusIcon className="h-4 w-4" />
                            {text}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div><span className="text-gray-500">تاريخ الطلب:</span><p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('ar-SA')}</p></div>
                          <div><span className="text-gray-500">المبلغ الإجمالي:</span><p className="font-semibold text-primary-600">{order.totalAmount.toFixed(2)} ريال</p></div>
                          <div><span className="text-gray-500">عدد المنتجات:</span><p className="font-semibold">{order.items.length} منتج</p></div>
                          {order.trackingNumber && <div><span className="text-gray-500">رقم التتبع:</span><p className="font-semibold text-blue-600">{order.trackingNumber}</p></div>}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Link href={`/invoice/${order.orderNumber}`}>
                          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Eye className="h-4 w-4" /> عرض التفاصيل
                          </button>
                        </Link>
                        {order.trackingUrl && <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"><Truck className="h-4 w-4" /> تتبع الشحنة</a>}
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"><Download className="h-4 w-4" /> الفاتورة</button>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-3 min-w-[300px] bg-gray-50 p-3 rounded-lg">
                            <img src={item.productImage} alt={item.productNameAr} className="w-12 h-12 object-cover rounded" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.productNameAr}</h4>
                              <p className="text-gray-600 text-xs">الكمية: {item.quantity} × {item.unitPrice.toFixed(2)} ريال</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
      <Cart />
    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, Eye } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
// 1. استيراد الـ Hook الصحيح
import { useAdminOrders } from '@/hooks/useAdminOrders';
import type { Order } from '@/hooks/useOrders';

const getStatusInfo = (status: Order['status']) => {
  switch (status) {
    case 'PENDING': return { text: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
    case 'PROCESSING': return { text: 'قيد التجهيز', color: 'bg-blue-100 text-blue-800', icon: Package };
    case 'SHIPPED': return { text: 'تم الشحن', color: 'bg-purple-100 text-purple-800', icon: Truck };
    case 'DELIVERED': return { text: 'تم التوصيل', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    case 'CANCELLED': return { text: 'ملغي', color: 'bg-red-100 text-red-800', icon: CheckCircle };
    default: return { text: 'غير معروف', color: 'bg-gray-100 text-gray-800', icon: Package };
  }
};

export default function AdminOrdersPage() {
  const { user, profile } = useAuth();
  // 2. **الإصلاح الرئيسي: استخدام اسم الدالة الصحيح `updateOrder`**
  const { orders, loading, error, fetchOrders, updateOrder } = useAdminOrders();
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user && profile?.isAdmin) {
      fetchOrders(statusFilter);
    }
  }, [user, profile, statusFilter, fetchOrders]);

  const statusOptions = useMemo(() => {
    // حساب عدد الطلبات لكل حالة
    const counts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return [
      { value: 'all', label: 'جميع الطلبات', count: orders.length },
      { value: 'PENDING', label: 'قيد الانتظار', count: counts['PENDING'] || 0 },
      { value: 'PROCESSING', label: 'قيد المعالجة', count: counts['PROCESSING'] || 0 },
      { value: 'SHIPPED', label: 'تم الشحن', count: counts['SHIPPED'] || 0 },
      { value: 'DELIVERED', label: 'تم التسليم', count: counts['DELIVERED'] || 0 },
      { value: 'CANCELLED', label: 'ملغي', count: counts['CANCELLED'] || 0 }
    ];
  }, [orders]);

  if (!user || !profile?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20 text-center"><h1 className="text-3xl font-bold">غير مصرح لك بالدخول</h1></div>
        <Footer />
      </div>
    );
  }

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20 text-center"><div className="loading-dots mb-4"><div></div><div></div><div></div><div></div></div><p>جاري تحميل الطلبات...</p></div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة الطلبات</h1><p className="text-gray-600">عرض وتحديث حالة جميع الطلبات</p></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {statusOptions.map((option) => (
              <button key={option.value} onClick={() => setStatusFilter(option.value)} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${statusFilter === option.value ? 'anime-gradient text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {option.label}
                <span className={`px-2 py-1 rounded-full text-xs ${statusFilter === option.value ? 'bg-white/20' : 'bg-gray-200'}`}>{option.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 font-semibold text-gray-500">رقم الطلب</th>
                  <th className="p-4 font-semibold text-gray-500">العميل</th>
                  <th className="p-4 font-semibold text-gray-500">التاريخ</th>
                  <th className="p-4 font-semibold text-gray-500">الإجمالي</th>
                  <th className="p-4 font-semibold text-gray-500">الحالة</th>
                  <th className="p-4 font-semibold text-gray-500">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const { text, color, icon: StatusIcon } = getStatusInfo(order.status);
                  return (
                    <tr key={order.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-medium text-primary-600"><Link href={`/admin/orders/${order.id}`}>{order.orderNumber}</Link></td>
                      <td className="p-4 text-gray-800">{order.shippingAddress.fullName}</td>
                      <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString('ar-SA')}</td>
                      <td className="p-4 text-gray-800">{order.totalAmount.toFixed(2)} ريال</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${color}`}>
                          <StatusIcon className="h-4 w-4" />{text}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Link href={`/admin/orders/${order.id}`}><button className="p-2 text-gray-600 hover:text-blue-600"><Eye className="h-4 w-4" /></button></Link>
                          {/* **الإصلاح الرئيسي: استدعاء updateOrder** */}
                          <select
                            value={order.status}
                            onChange={(e) => updateOrder(order.id, { status: e.target.value as Order['status'] })}
                            className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="PENDING">قيد المراجعة</option>
                            <option value="PROCESSING">قيد التجهيز</option>
                            <option value="SHIPPED">تم الشحن</option>
                            <option value="DELIVERED">تم التوصيل</option>
                            <option value="CANCELLED">ملغي</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

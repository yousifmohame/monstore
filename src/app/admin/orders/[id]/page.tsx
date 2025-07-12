'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, Download, Mail, Edit, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Chat from '@/components/Chat';
import { useAuth } from '@/hooks/useAuth';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import Image from 'next/image';

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'PENDING': return { text: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
    case 'PROCESSING': return { text: 'قيد التجهيز', color: 'bg-blue-100 text-blue-800', icon: Package };
    case 'SHIPPED': return { text: 'تم الشحن', color: 'bg-purple-100 text-purple-800', icon: Truck };
    case 'DELIVERED': return { text: 'تم التوصيل', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    case 'CANCELLED': return { text: 'ملغي', color: 'bg-red-100 text-red-800', icon: CheckCircle };
    default: return { text: 'غير معروف', color: 'bg-gray-100 text-gray-800', icon: Package };
  }
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { order, loading, error, fetchOrderById, updateOrder } = useAdminOrders();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<any>(null);

  useEffect(() => {
    if (user && profile?.isAdmin) {
      fetchOrderById(params.id);
    }
  }, [user, profile, params.id, fetchOrderById]);

  useEffect(() => {
    if (order) {
      setEditedOrder(order);
    }
  }, [order]);

  const handleSaveChanges = async () => {
    if (!editedOrder) return;
    try {
      await updateOrder(editedOrder.id, {
        status: editedOrder.status,
        trackingNumber: editedOrder.trackingNumber || '',
        trackingUrl: editedOrder.trackingUrl || '',
      });
      setIsEditing(false);
    } catch (err) {
      alert('فشل في تحديث الطلب');
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setEditedOrder({ ...editedOrder, [e.target.name]: e.target.value });
  };
  
  if (!user || !profile?.isAdmin) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container-custom py-20 text-center"><h1 className="text-3xl font-bold">غير مصرح لك بالدخول.</h1></div>
            <Footer />
        </div>
    );
  }

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container-custom py-20 text-center"><div className="loading-dots mb-4"><div></div><div></div><div></div><div></div></div><p>جاري تحميل تفاصيل الطلب...</p></div>
            <Footer />
        </div>
    );
  }

  if (error || !order) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container-custom py-20 text-center"><h1 className="text-3xl font-bold text-red-600">خطأ</h1><p className="mt-4">{error || "لم يتم العثور على الطلب."}</p></div>
            <Footer />
        </div>
    );
  }

  const { text: statusText, color: statusColor, icon: StatusIcon } = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft /></button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">تفاصيل الطلب #{order.orderNumber}</h1>
              <p className="text-gray-600">تاريخ الطلب: {new Date(order.createdAt).toLocaleDateString('ar-SA')}</p>
            </div>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button onClick={handleSaveChanges} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"><Save /> حفظ</button>
                <button onClick={() => { setIsEditing(false); setEditedOrder(order); }} className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"><X /> إلغاء</button>
              </>
            ) : (
              <>
                <Link href={`/invoice/${order.id}`}><button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"><Download /> الفاتورة</button></Link>
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"><Edit /> تعديل</button>
              </>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="anime-card p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">حالة الطلب</h2>
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-full ${statusColor}`}><StatusIcon className="h-6 w-6" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800">{statusText}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{order.paymentStatus === 'PAID' ? 'مدفوع' : 'غير مدفوع'}</span>
                  </div>
                </div>
                {isEditing && (
                  <select name="status" value={editedOrder.status} onChange={handleChange} className="px-4 py-2 border rounded-lg">
                    <option value="PENDING">قيد المراجعة</option>
                    <option value="PROCESSING">قيد التجهيز</option>
                    <option value="SHIPPED">تم الشحن</option>
                    <option value="DELIVERED">تم التوصيل</option>
                    <option value="CANCELLED">ملغي</option>
                  </select>
                )}
              </div>
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold mb-1">رقم التتبع</h4>
                    {isEditing ? <input type="text" name="trackingNumber" value={editedOrder.trackingNumber || ''} onChange={handleChange} className="input-field" /> : <p className="text-primary-600 font-semibold">{order.trackingNumber || 'لم يضف بعد'}</p>}
                  </div>
                  {isEditing ? <div><h4 className="font-semibold mb-1">رابط التتبع</h4><input type="text" name="trackingUrl" value={editedOrder.trackingUrl || ''} onChange={handleChange} className="input-field" /></div> : !isEditing && order.trackingUrl && <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">تتبع الشحنة</a>}
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="anime-card p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">المنتجات</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    {/* **الإصلاح هنا: استخدام item.productImage** */}
                    <Image src={item.productImage} alt={item.productNameAr} width={64} height={64} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.productNameAr}</h3>
                      <p className="text-gray-600 text-sm">{item.quantity} × {item.unitPrice.toFixed(2)} ريال</p>
                    </div>
                    <p className="font-bold text-primary-600">{item.totalPrice.toFixed(2)} ريال</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t">
                <div className="space-y-3">
                  <div className="flex justify-between"><span>المجموع الفرعي:</span><span className="font-semibold">{order.subtotal.toFixed(2)} ريال</span></div>
                  <div className="flex justify-between"><span>الشحن:</span><span className="font-semibold">{order.shippingAmount.toFixed(2)} ريال</span></div>
                  <div className="flex justify-between"><span>الضريبة:</span><span className="font-semibold">{order.taxAmount.toFixed(2)} ريال</span></div>
                  <div className="flex justify-between pt-3 border-t text-xl font-bold"><span>المجموع:</span><span className="text-primary-600">{order.totalAmount.toFixed(2)} ريال</span></div>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="anime-card p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">معلومات العميل</h2>
              <div className="space-y-4">
                <div><label className="block text-gray-500 text-sm mb-1">الاسم الكامل</label><p className="font-semibold text-gray-800">{order.shippingAddress.fullName}</p></div>
                <div><label className="block text-gray-500 text-sm mb-1">البريد الإلكتروني</label><p className="font-semibold text-gray-800">{order.customer?.email}</p></div>
                <div><label className="block text-gray-500 text-sm mb-1">رقم الهاتف</label><p className="font-semibold text-gray-800">{order.shippingAddress.phone}</p></div>
                <div><label className="block text-gray-500 text-sm mb-1">العنوان</label><p className="font-semibold text-gray-800">{order.shippingAddress.address}, {order.shippingAddress.city}</p></div>
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

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer as Print, Mail, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { useOrders } from '@/hooks/useOrders';

export default function InvoicePage({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const { fetchOrderById, fetchOrderByOrderNumber, loading, error } = useOrders();
  const [order, setOrder] = useState<any>(null);

  // In your page component
useEffect(() => {
  const loadOrder = async () => {
    try {
      if (!user) {
        console.log('Waiting for authentication...');
        return;
      }

      console.log('Fetching order with user:', user.id);
      
      // First try by ID
      let order = await fetchOrderById(params.orderId);
      
      // If not found, try by order number
      if (!order) {
        order = await fetchOrderByOrderNumber(params.orderId);
      }

      if (order) {
        setOrder(order);
      } else {
        setError('Order not found');
      }
    } catch (error) {
      console.error('Order load failed:', error);
      setError('Failed to load order');
    }
  };

  loadOrder();
}, [user, params.orderId]); // Add user to dependencies

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('سيتم إنشاء وتحميل الفاتورة قريبًا');
  };

  const handleEmailInvoice = () => {
    alert('تم إرسال الفاتورة إلى بريدك الإلكتروني');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold">يجب تسجيل الدخول أولاً</h1>
          <p className="text-gray-600 mt-4">لعرض الفاتورة، يرجى تسجيل الدخول.</p>
          <a href="/auth/login" className="btn-primary mt-4">
            تسجيل الدخول
          </a>
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
          <div className="loading-dots mb-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-xl text-gray-600 font-medium">جاري تحميل الفاتورة...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold text-red-600">فاتورة غير موجودة</h1>
          <p className="text-gray-600 mt-4">{error || 'لم يتم العثور على الفاتورة'}</p>
          <button onClick={() => router.back()} className="btn-primary mt-4">
            العودة
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-custom py-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            العودة
          </button>
          <div className="flex gap-3">
            <motion.button
              onClick={handleEmailInvoice}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="h-4 w-4" />
              إرسال بالبريد
            </motion.button>
            <motion.button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-4 w-4" />
              تحميل PDF
            </motion.button>
            <motion.button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Print className="h-4 w-4" />
              طباعة
            </motion.button>
          </div>
        </div>

        {/* Invoice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto print:shadow-none print:rounded-none"
        >
          {/* Invoice Header */}
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
            <div>
              <h1 className="text-4xl font-bold anime-gradient bg-clip-text text-transparent mb-2">
                كيوتاكو 🎌
              </h1>
              <p className="text-gray-600">متجر الأنمي والمانجا الأول</p>
              <p className="text-gray-600">الرياض، المملكة العربية السعودية</p>
              <p className="text-gray-600">+966 50 123 4567</p>
              <p className="text-gray-600">support@kyotaku.sa</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">فاتورة</h2>
              <div className="space-y-2">
                <p><span className="font-semibold">رقم الفاتورة:</span> {order.orderNumber}</p>
                <p><span className="font-semibold">تاريخ الإصدار:</span>{' '}
                  {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                </p>
                <p><span className="font-semibold">حالة الدفع:</span> 
                  <span className={`mr-2 px-2 py-1 rounded text-sm ${
                    order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {order.paymentStatus === 'PAID' ? 'مدفوع' : 'غير مدفوع'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">معلومات العميل</h3>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-semibold">الاسم:</span> {order.shippingAddress.fullName}</p>
                <p><span className="font-semibold">الهاتف:</span> {order.shippingAddress.phone}</p>
                <p><span className="font-semibold">المدينة:</span> {order.shippingAddress.city}</p>
                <p><span className="font-semibold">الرمز البريدي:</span> {order.shippingAddress.postalCode}</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">عنوان التوصيل</h3>
              <div className="space-y-2 text-gray-600">
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">تفاصيل الطلب</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 p-3 text-right font-semibold">المنتج</th>
                    <th className="border border-gray-200 p-3 text-center font-semibold">الكمية</th>
                    <th className="border border-gray-200 p-3 text-center font-semibold">السعر</th>
                    <th className="border border-gray-200 p-3 text-center font-semibold">المجموع</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-200 p-3">
                        <div className="flex items-center gap-3">
                          {/* **الإصلاح هنا: استخدام مكون Image** */}
                          <Image
                            src={item.productImage || '/placeholder.jpg'}
                            alt={item.productNameAr}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-semibold">{item.productNameAr}</p>
                            <p className="text-sm text-gray-600">{item.productName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-200 p-3 text-center">{item.quantity}</td>
                      <td className="border border-gray-200 p-3 text-center">{item.unitPrice.toFixed(2)} ريال</td>
                      <td className="border border-gray-200 p-3 text-center font-semibold">{item.totalPrice.toFixed(2)} ريال</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="flex justify-end">
            <div className="w-full max-w-md">
              <div className="space-y-3 p-6 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span>{order.subtotal.toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span>الشحن:</span>
                  <span>{order.shippingAmount.toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span>ضريبة القيمة المضافة (15%):</span>
                  <span>{order.taxAmount.toFixed(2)} ريال</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>الخصم:</span>
                    <span>-{order.discountAmount.toFixed(2)} ريال</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>المجموع الإجمالي:</span>
                    <span className="text-primary-600">{order.totalAmount.toFixed(2)} ريال</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">معلومات الدفع</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p><span className="font-semibold">طريقة الدفع:</span>{' '}
                  {order.paymentMethod === 'credit_card' ? 'بطاقة ائتمانية' : 
                   order.paymentMethod === 'cash_on_delivery' ? 'الدفع عند الاستلام' : 
                   order.paymentMethod}
                </p>
                <p><span className="font-semibold">حالة الدفع:</span> 
                  <span className={`mr-2 ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-red-600'}`}>
                    {order.paymentStatus === 'PAID' ? 'مدفوع' : 'غير مدفوع'}
                  </span>
                </p>
              </div>
              {order.trackingNumber && (
                <div>
                  <p><span className="font-semibold">رقم التتبع:</span> {order.trackingNumber}</p>
                  <p><span className="font-semibold">حالة الطلب:</span> 
                    <span className="mr-2 text-green-600">
                      {order.status === 'DELIVERED' ? 'تم التسليم' : 
                       order.status === 'SHIPPED' ? 'تم الشحن' : 
                       order.status === 'PROCESSING' ? 'قيد المعالجة' : 
                       'قيد الانتظار'}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p className="mb-2">شكراً لك على تسوقك مع كيوتاكو!</p>
            <p className="text-sm">لأي استفسارات، يرجى التواصل معنا على support@kyotaku.sa أو +966 50 123 4567</p>
            <p className="text-sm mt-2">© 2024 كيوتاكو. جميع الحقوق محفوظة.</p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
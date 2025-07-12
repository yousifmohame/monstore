'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  CreditCard,
  Truck,
  User,
  Phone,
  MapPin,
  ArrowLeft,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, profile, getIdToken } = useAuth();
  const { cart, getTotalPrice, clearCart } = useStore();

  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cash_on_delivery',
    notes: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        postalCode: profile.postalCode || '',
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (cart.length === 0 && !isOrderComplete) {
      router.push('/products');
    }
  }, [cart.length, isOrderComplete, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      if (!user) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      const idToken = await getIdToken(true);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
          },
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في إنشاء الطلب.');
      }

      const orderData = await response.json();
      await clearCart();
      setIsOrderComplete(true);
      setOrderNumber(orderData.orderNumber);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold">يجب تسجيل الدخول أولاً</h1>
          <Link href="/auth/login" className="btn-primary mt-4">
            تسجيل الدخول
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (isOrderComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">تم إنشاء الطلب بنجاح!</h1>
            <p className="text-xl text-gray-600 mb-6">رقم الطلب الخاص بك هو:</p>
            <div className="bg-gray-100 py-4 px-6 rounded-lg mb-8">
              <p className="text-2xl font-bold text-primary-600">{orderNumber}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/orders">
                <button className="btn-primary">عرض طلباتي</button>
              </Link>
              <Link href="/products">
                <button className="btn-outline">متابعة التسوق</button>
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">إتمام الطلب</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="anime-card p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="h-6 w-6 text-primary-600" /> معلومات الشحن
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">الاسم الكامل *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="input-field text-right"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <Phone className="inline h-4 w-4 ml-2" /> رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field text-right"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">
                    <MapPin className="inline h-4 w-4 ml-2" /> العنوان *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field text-right"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">المدينة *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="input-field text-right"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">الرمز البريدي</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="input-field text-right"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="anime-card p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-primary-600" /> طريقة الدفع
              </h2>
              <div className="space-y-4">
                <label className="block border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary-300 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === 'cash_on_delivery'}
                      onChange={handleChange}
                      className="h-5 w-5 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">الدفع عند الاستلام</p>
                      <p className="text-sm text-gray-600">ادفع نقداً عند استلام الطلب</p>
                    </div>
                  </div>
                </label>
                <label className="block border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary-300 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={handleChange}
                      className="h-5 w-5 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">بطاقة ائتمانية (محاكاة)</p>
                      <p className="text-sm text-gray-600">سيتم إنشاء الطلب مباشرة</p>
                    </div>
                  </div>
                </label>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={isProcessing}
              className="w-full btn-primary text-lg py-4 flex items-center justify-center"
            >
              {isProcessing ? (
                <div className="loading-spinner"></div>
              ) : (
                'تأكيد الطلب الآن'
              )}
            </motion.button>

            {errorMessage && (
              <div className="mt-4 text-red-600 text-center">
                <AlertCircle className="h-5 w-5 inline-block mr-2" />
                {errorMessage}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="anime-card p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">ملخص الطلب</h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × {item.price} ريال
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-semibold">{getTotalPrice().toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span>الشحن:</span>
                  <span className="font-semibold">25.00 ريال</span>
                </div>
                <div className="flex justify-between">
                  <span>الضريبة (15%):</span>
                  <span className="font-semibold">
                    {(getTotalPrice() * 0.15).toFixed(2)} ريال
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-bold">المجموع:</span>
                  <span className="font-bold text-primary-600">
                    {(getTotalPrice() + 25 + getTotalPrice() * 0.15).toFixed(2)} ريال
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setIsLoading(false);
      return;
    }

    if (!formData.phone) {
      setError('رقم الهاتف مطلوب');
      setIsLoading(false);
      return;
    }

    if (!formData.address) {
      setError('العنوان مطلوب');
      setIsLoading(false);
      return;
    }
    
    try {
      await register(
        formData.email, 
        formData.password, 
        formData.fullName, 
        formData.phone, 
        formData.address, 
        formData.city, 
        formData.postalCode
      );
      router.push('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="anime-card p-8"
            >
              <div className="text-center mb-8">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  🎌
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">إنشاء حساب جديد</h1>
                <p className="text-gray-600">انضم إلى مجتمع محبي الأنمي</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <User className="inline h-4 w-4 ml-2" />
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="input-field text-right"
                    placeholder="أدخل اسمك الكامل"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <Mail className="inline h-4 w-4 ml-2" />
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field text-right"
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <Phone className="inline h-4 w-4 ml-2" />
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field text-left"
                    placeholder="أدخل رقم هاتفك"
                    required
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <MapPin className="inline h-4 w-4 ml-2" />
                    العنوان
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field text-right"
                    placeholder="أدخل عنوانك"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      المدينة
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="input-field text-right"
                      placeholder="المدينة"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      الرمز البريدي
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="input-field text-right"
                      placeholder="الرمز البريدي"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <Lock className="inline h-4 w-4 ml-2" />
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field text-right pr-12"
                      placeholder="أدخل كلمة المرور"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <Lock className="inline h-4 w-4 ml-2" />
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input-field text-right pr-12"
                      placeholder="أعد إدخال كلمة المرور"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" required />
                  <span className="mr-2 text-sm text-gray-600">
                    أوافق على{' '}
                    <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                      شروط الخدمة
                    </Link>
                    {' '}و{' '}
                    <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                      سياسة الخصوصية
                    </Link>
                  </span>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <>
                      إنشاء الحساب
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  لديك حساب بالفعل؟{' '}
                  <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                    تسجيل الدخول
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
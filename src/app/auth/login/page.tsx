'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(formData.email, formData.password);
      router.push('/');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'حدث خطأ أثناء تسجيل الدخول');
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

  // Test accounts for quick login
  const handleTestLogin = async (type: 'admin' | 'user') => {
    const testAccounts = {
      admin: { email: 'admin@kyotaku.sa', password: 'admin123456' },
      user: { email: 'user@kyotaku.sa', password: 'user123456' }
    };

    setFormData(testAccounts[type]);
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
                <h1 className="text-3xl font-bold text-gray-800 mb-2">تسجيل الدخول</h1>
                <p className="text-gray-600">مرحباً بك مرة أخرى في كيوتاكو</p>
              </div>

              {/* Test Accounts */}
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">دخول سريع:</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleTestLogin('admin')}
                    className="w-full text-right px-3 py-2 bg-green-100 hover:bg-green-200 rounded text-green-800 text-sm transition-colors flex items-center justify-between"
                  >
                    <span>👨‍💼 مدير</span>
                    <span className="text-xs">admin@kyotaku.sa</span>
                  </button>
                  <button
                    onClick={() => handleTestLogin('user')}
                    className="w-full text-right px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded text-blue-800 text-sm transition-colors flex items-center justify-between"
                  >
                    <span>👤 مستخدم</span>
                    <span className="text-xs">user@kyotaku.sa</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">خطأ في تسجيل الدخول</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="mr-2 text-sm text-gray-600">تذكرني</span>
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                    نسيت كلمة المرور؟
                  </Link>
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
                      تسجيل الدخول
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  ليس لديك حساب؟{' '}
                  <Link href="/auth/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                    إنشاء حساب جديد
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
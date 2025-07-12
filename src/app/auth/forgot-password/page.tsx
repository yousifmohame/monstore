'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would call your API to send a reset password email
      console.log('Reset password email sent to:', email);
      
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error sending reset password email:', error);
      setError(error.message || 'حدث خطأ أثناء إرسال بريد إعادة تعيين كلمة المرور');
    } finally {
      setIsSubmitting(false);
    }
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
                  🔑
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">نسيت كلمة المرور</h1>
                <p className="text-gray-600">أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">حدث خطأ</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      <Mail className="inline h-4 w-4 ml-2" />
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field text-right"
                      placeholder="أدخل بريدك الإلكتروني"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      <>
                        إرسال رابط إعادة التعيين
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">تم إرسال الرابط</h2>
                  <p className="text-gray-600 mb-6">
                    تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من بريدك الوارد.
                  </p>
                  <Link href="/auth/login">
                    <button className="btn-primary">
                      العودة لتسجيل الدخول
                    </button>
                  </Link>
                </motion.div>
              )}

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  تذكرت كلمة المرور؟{' '}
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
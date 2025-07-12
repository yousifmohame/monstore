'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle, ShoppingCart, Truck, CreditCard, RotateCcw, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const categories = [
    { id: 'all', name: 'جميع الأسئلة', icon: HelpCircle },
    { id: 'orders', name: 'الطلبات', icon: ShoppingCart },
    { id: 'shipping', name: 'الشحن', icon: Truck },
    { id: 'payment', name: 'الدفع', icon: CreditCard },
    { id: 'returns', name: 'الإرجاع', icon: RotateCcw },
    { id: 'account', name: 'الحساب', icon: Shield }
  ];

  const faqs = [
    {
      id: 1,
      category: 'orders',
      question: 'كيف يمكنني تتبع طلبي؟',
      answer: 'يمكنك تتبع طلبك من خلال الدخول إلى حسابك والنقر على "طلباتي". ستجد رقم التتبع ورابط مباشر لتتبع الشحنة. كما سنرسل لك رسائل تحديث عبر البريد الإلكتروني والرسائل النصية.'
    },
    {
      id: 2,
      category: 'orders',
      question: 'هل يمكنني تعديل أو إلغاء طلبي؟',
      answer: 'يمكنك تعديل أو إلغاء طلبك خلال ساعة واحدة من إجراء الطلب. بعد ذلك، إذا كان الطلب قيد التحضير، يرجى التواصل معنا فوراً وسنحاول مساعدتك حسب حالة الطلب.'
    },
    {
      id: 3,
      category: 'shipping',
      question: 'كم تستغرق عملية التوصيل؟',
      answer: 'التوصيل داخل الرياض وجدة: 1-2 يوم عمل. المدن الأخرى: 2-4 أيام عمل. المناطق النائية: 3-7 أيام عمل. نعمل مع أفضل شركات الشحن لضمان وصول طلبك في أسرع وقت ممكن.'
    },
    {
      id: 4,
      category: 'shipping',
      question: 'كم تكلفة الشحن؟',
      answer: 'تكلفة الشحن 25 ريال لجميع المناطق في المملكة. الشحن مجاني للطلبات التي تزيد عن 200 ريال. نقدم أيضاً خدمة التوصيل السريع (خلال 24 ساعة) مقابل 50 ريال في المدن الرئيسية.'
    },
    {
      id: 5,
      category: 'payment',
      question: 'ما هي طرق الدفع المتاحة؟',
      answer: 'نقبل جميع البطاقات الائتمانية (فيزا، ماستركارد)، مدى، STC Pay، وخدمة الدفع عند الاستلام. جميع المعاملات آمنة ومشفرة باستخدام أحدث تقنيات الأمان.'
    },
    {
      id: 6,
      category: 'payment',
      question: 'هل معلومات الدفع آمنة؟',
      answer: 'نعم، نستخدم تشفير SSL 256-bit ونعمل مع معالجات دفع معتمدة دولياً. لا نحتفظ بمعلومات بطاقتك الائتمانية على خوادمنا. جميع المعاملات تتم وفقاً لأعلى معايير الأمان العالمية.'
    },
    {
      id: 7,
      category: 'returns',
      question: 'ما هي سياسة الإرجاع؟',
      answer: 'يمكنك إرجاع المنتجات خلال 30 يوماً من تاريخ الاستلام. المنتج يجب أن يكون في حالته الأصلية مع العبوة والملصقات. نتحمل تكلفة الإرجاع في حالة وجود عيب في المنتج.'
    },
    {
      id: 8,
      category: 'returns',
      question: 'كيف أقوم بإرجاع منتج؟',
      answer: 'ادخل إلى حسابك واختر "إرجاع منتج" من قائمة طلباتك. املأ نموذج الإرجاع واختر سبب الإرجاع. سنرسل لك ملصق الشحن المجاني وتعليمات التعبئة عبر البريد الإلكتروني.'
    },
    {
      id: 9,
      category: 'account',
      question: 'كيف أنشئ حساباً جديداً؟',
      answer: 'انقر على "إنشاء حساب" في أعلى الصفحة. املأ المعلومات المطلوبة (الاسم، البريد الإلكتروني، كلمة المرور). ستصلك رسالة تأكيد عبر البريد الإلكتروني لتفعيل حسابك.'
    },
    {
      id: 10,
      category: 'account',
      question: 'نسيت كلمة المرور، ماذا أفعل؟',
      answer: 'انقر على "نسيت كلمة المرور" في صفحة تسجيل الدخول. أدخل بريدك الإلكتروني وستصلك رسالة تحتوي على رابط لإعادة تعيين كلمة المرور. الرابط صالح لمدة 24 ساعة.'
    },
    {
      id: 11,
      category: 'orders',
      question: 'هل تتوفر منتجات حصرية؟',
      answer: 'نعم، نقدم منتجات حصرية ومحدودة الإصدار من أشهر سلاسل الأنمي. اشترك في نشرتنا الإخبارية لتكون أول من يعلم عن المنتجات الجديدة والحصرية.'
    },
    {
      id: 12,
      category: 'shipping',
      question: 'هل تشحنون خارج السعودية؟',
      answer: 'حالياً نشحن داخل المملكة العربية السعودية فقط. نعمل على توسيع خدماتنا لتشمل دول الخليج قريباً. تابع موقعنا للحصول على آخر التحديثات.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative anime-gradient text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              الأسئلة الشائعة ❓
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              ابحث عن إجابات للأسئلة الأكثر شيوعاً حول متجر الأنمي وخدماتنا
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="ابحث في الأسئلة الشائعة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pr-12 rounded-2xl text-gray-800 focus:ring-2 focus:ring-white focus:outline-none text-lg text-right"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white border-b">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'anime-gradient text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <category.icon className="h-5 w-5" />
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-16"
              >
                <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">لا توجد نتائج</h3>
                <p className="text-gray-600">جرب البحث بكلمات مختلفة أو اختر فئة أخرى</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.6 }}
                    className="anime-card overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-6 py-6 text-right flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <ChevronDown 
                        className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                          openFAQ === faq.id ? 'rotate-180' : ''
                        }`} 
                      />
                      <h3 className="text-lg font-semibold text-gray-800 flex-1 mr-4">
                        {faq.question}
                      </h3>
                    </button>
                    
                    <AnimatePresence>
                      {openFAQ === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="anime-card p-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                لم تجد إجابة <span className="gradient-text">لسؤالك</span>؟
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                فريق الدعم الفني جاهز لمساعدتك على مدار الساعة
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">الدردشة المباشرة</h4>
                  <p className="text-gray-600 text-sm">متاح 24/7</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">البريد الإلكتروني</h4>
                  <p className="text-gray-600 text-sm">support@animestore.sa</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">الهاتف</h4>
                  <p className="text-gray-600 text-sm">+966 50 123 4567</p>
                </div>
              </div>
              
              <button className="btn-primary text-lg px-8 py-4">
                تواصل مع الدعم الفني
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <Cart />
    </div>
  );
}
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, Grid, Percent, Info, Phone, FileText, Shield, HelpCircle, User, Heart, Package } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';

export default function SitemapPage() {
  const siteStructure = [
    {
      title: 'الصفحات الرئيسية',
      icon: Home,
      pages: [
        { name: 'الصفحة الرئيسية', url: '/', description: 'الصفحة الرئيسية للموقع' },
        { name: 'المنتجات', url: '/products', description: 'جميع منتجات الأنمي' },
        { name: 'الفئات', url: '/categories', description: 'فئات المنتجات المختلفة' },
        { name: 'العروض والخصومات', url: '/deals', description: 'أفضل العروض والخصومات' }
      ]
    },
    {
      title: 'معلومات الشركة',
      icon: Info,
      pages: [
        { name: 'من نحن', url: '/about', description: 'تعرف على قصتنا ورؤيتنا' },
        { name: 'اتصل بنا', url: '/contact', description: 'طرق التواصل معنا' },
        { name: 'معلومات الشحن', url: '/shipping', description: 'سياسات وأسعار الشحن' }
      ]
    },
    {
      title: 'الحساب والمستخدم',
      icon: User,
      pages: [
        { name: 'تسجيل الدخول', url: '/auth/login', description: 'تسجيل الدخول لحسابك' },
        { name: 'إنشاء حساب', url: '/auth/register', description: 'إنشاء حساب جديد' },
        { name: 'الملف الشخصي', url: '/profile', description: 'إدارة معلوماتك الشخصية' },
        { name: 'طلباتي', url: '/orders', description: 'تتبع طلباتك' },
        { name: 'قائمة الأمنيات', url: '/wishlist', description: 'منتجاتك المفضلة' }
      ]
    },
    {
      title: 'الدعم والمساعدة',
      icon: HelpCircle,
      pages: [
        { name: 'الأسئلة الشائعة', url: '/faq', description: 'إجابات للأسئلة الشائعة' },
        { name: 'سياسة الخصوصية', url: '/privacy', description: 'كيف نحمي بياناتك' },
        { name: 'شروط الخدمة', url: '/terms', description: 'شروط وأحكام الاستخدام' }
      ]
    }
  ];

  const categories = [
    { name: 'الملابس', url: '/categories/clothes' },
    { name: 'الحقائب', url: '/categories/backpacks' },
    { name: 'أغطية الهواتف', url: '/categories/phone-cases' },
    { name: 'التماثيل', url: '/categories/figurines' },
    { name: 'الألعاب', url: '/categories/toys' },
    { name: 'الإكسسوارات', url: '/categories/accessories' }
  ];

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
              خريطة الموقع 🗺️
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              دليل شامل لجميع صفحات وأقسام متجر الأنمي
            </p>
          </motion.div>
        </div>
      </section>

      {/* Site Structure */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              هيكل <span className="gradient-text">الموقع</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              تصفح جميع أقسام الموقع بسهولة
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {siteStructure.map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1, duration: 0.6 }}
                className="anime-card p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <section.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{section.title}</h3>
                </div>
                
                <div className="space-y-4">
                  {section.pages.map((page, pageIndex) => (
                    <Link
                      key={pageIndex}
                      href={page.url}
                      className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                            {page.name}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">{page.description}</p>
                        </div>
                        <div className="text-gray-400 group-hover:text-primary-600 transition-colors">
                          ←
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              فئات <span className="gradient-text">المنتجات</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              تصفح منتجاتنا حسب الفئة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Link
                  href={category.url}
                  className="block anime-card p-6 text-center group hover:shadow-lg transition-all duration-300"
                >
                  <Grid className="h-8 w-8 text-primary-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              روابط <span className="gradient-text">سريعة</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              الوصول السريع للصفحات الأكثر استخداماً
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'تسوق الآن', url: '/products', icon: ShoppingBag, color: 'from-primary-500 to-secondary-500' },
              { name: 'العروض', url: '/deals', icon: Percent, color: 'from-red-500 to-pink-500' },
              { name: 'تواصل معنا', url: '/contact', icon: Phone, color: 'from-green-500 to-emerald-500' },
              { name: 'الأسئلة الشائعة', url: '/faq', icon: HelpCircle, color: 'from-blue-500 to-cyan-500' }
            ].map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Link
                  href={link.url}
                  className="block anime-card p-6 text-center group hover:shadow-lg transition-all duration-300"
                >
                  <div className={`bg-gradient-to-r ${link.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <link.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                    {link.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Tips */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="anime-card p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                نصائح <span className="gradient-text">للبحث</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 text-right">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">البحث في المنتجات</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• استخدم اسم الأنمي للبحث عن منتجات محددة</li>
                    <li>• ابحث بنوع المنتج (تيشيرت، حقيبة، إلخ)</li>
                    <li>• استخدم الفلاتر لتضييق نتائج البحث</li>
                    <li>• جرب البحث بالكلمات العربية والإنجليزية</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">التنقل في الموقع</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• استخدم القائمة الرئيسية للتنقل السريع</li>
                    <li>• تصفح الفئات لاستكشاف المنتجات</li>
                    <li>• تحقق من صفحة العروض للخصومات</li>
                    <li>• استخدم قائمة الأمنيات لحفظ المنتجات</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <Cart />
    </div>
  );
}
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, MapPin, Package, Shield, CreditCard } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';

export default function ShippingPage() {
  const shippingOptions = [
    {
      icon: Truck,
      title: 'الشحن العادي',
      price: '25 ريال',
      duration: 'حسب المنطقة',
      description: 'خدمة الشحن لجميع مناطق المملكة',
      features: ['تتبع الشحنة', 'تأمين كامل', 'خدمة عملاء']
    },
    {
      icon: Package,
      title: 'الشحن السريع',
      price: '25 ريال',
      duration: 'حسب المنطقة',
      description: 'نفس الخدمة بأولوية في المعالجة',
      features: ['أولوية في المعالجة', 'تتبع مباشر', 'ضمان التوقيت']
    },
    {
      icon: Shield,
      title: 'شحن آمن',
      price: '25 ريال',
      duration: 'حسب المنطقة',
      description: 'شحن آمن مع تأمين شامل',
      features: ['تأمين شامل', 'تتبع كامل', 'حماية إضافية']
    }
  ];

  const deliveryZones = [
    {
      zone: 'المنطقة الوسطى',
      cities: ['الرياض', 'القصيم', 'حائل'],
      duration: '1-2 يوم عمل',
      color: 'bg-green-100 text-green-800'
    },
    {
      zone: 'المنطقة الغربية',
      cities: ['جدة', 'مكة', 'المدينة', 'الطائف'],
      duration: '1-2 يوم عمل',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      zone: 'المنطقة الشرقية',
      cities: ['الدمام', 'الخبر', 'الأحساء'],
      duration: '2-3 أيام عمل',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      zone: 'المناطق الأخرى',
      cities: ['تبوك', 'أبها', 'جازان', 'نجران'],
      duration: '3-5 أيام عمل',
      color: 'bg-orange-100 text-orange-800'
    }
  ];

  const trackingSteps = [
    { step: 1, title: 'تأكيد الطلب', description: 'تم استلام طلبك وبدء المعالجة' },
    { step: 2, title: 'التحضير', description: 'جاري تحضير وتعبئة منتجاتك' },
    { step: 3, title: 'الشحن', description: 'تم تسليم الطلب لشركة الشحن' },
    { step: 4, title: 'في الطريق', description: 'الطلب في طريقه إليك' },
    { step: 5, title: 'التسليم', description: 'تم تسليم الطلب بنجاح' }
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
              معلومات الشحن 🚚
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              كل ما تحتاج معرفته عن خدمات الشحن والتوصيل لدينا
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              خيارات <span className="gradient-text">الشحن</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              تكلفة الشحن موحدة 25 ريال لجميع مناطق المملكة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {shippingOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="anime-card p-8 text-center group"
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <option.icon className="h-10 w-10 text-primary-600" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{option.title}</h3>
                <div className="text-3xl font-bold text-primary-600 mb-2">{option.price}</div>
                <div className="text-lg text-gray-600 mb-4">{option.duration}</div>
                <p className="text-gray-600 mb-6">{option.description}</p>
                
                <ul className="space-y-2">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center justify-center gap-2 text-gray-600">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Zones */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              مناطق <span className="gradient-text">التوصيل</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نغطي جميع مناطق المملكة العربية السعودية بتكلفة موحدة 25 ريال
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryZones.map((zone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="anime-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-6 w-6 text-primary-600" />
                  <h3 className="text-xl font-bold text-gray-800">{zone.zone}</h3>
                </div>
                
                <div className="space-y-2 mb-4">
                  {zone.cities.map((city, idx) => (
                    <span key={idx} className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                      {city}
                    </span>
                  ))}
                </div>
                
                <div className={`${zone.color} px-3 py-2 rounded-lg text-center font-semibold mb-3`}>
                  {zone.duration}
                </div>
                
                <div className="text-center">
                  <span className="text-2xl font-bold text-primary-600">25 ريال</span>
                  <p className="text-sm text-gray-500">تكلفة الشحن</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracking Process */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              تتبع <span className="gradient-text">الطلب</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              تابع رحلة طلبك من لحظة الطلب حتى التسليم
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-8 right-8 left-8 h-1 bg-gray-200 rounded-full">
                <div className="h-full bg-primary-500 rounded-full w-3/4"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {trackingSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="text-center relative"
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 ${
                      index < 4 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      <span className="font-bold text-lg">{step.step}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Policy */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                سياسة <span className="gradient-text">الشحن</span>
              </h2>
              
              <div className="space-y-6">
                <div className="anime-card p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">أوقات المعالجة</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• الطلبات العادية: 1-2 يوم عمل</li>
                    <li>• الطلبات المخصصة: 3-5 أيام عمل</li>
                    <li>• الطلبات الكبيرة: 2-4 أيام عمل</li>
                  </ul>
                </div>
                
                <div className="anime-card p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">التعبئة والتغليف</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• تعبئة آمنة ومحمية</li>
                    <li>• مواد تغليف صديقة للبيئة</li>
                    <li>• حماية خاصة للمنتجات الهشة</li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="space-y-6">
                <div className="anime-card p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">شروط الشحن</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• التوصيل للعنوان المحدد فقط</li>
                    <li>• يجب وجود شخص لاستلام الطلب</li>
                    <li>• التحقق من الهوية عند الاستلام</li>
                    <li>• فحص الطلب قبل التوقيع</li>
                  </ul>
                </div>
                
                <div className="anime-card p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">حالات خاصة</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• تأخير في الأعياد والمناسبات</li>
                    <li>• ظروف جوية استثنائية</li>
                    <li>• مناطق يصعب الوصول إليها</li>
                    <li>• طلبات تتطلب موافقات خاصة</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              أسئلة شائعة حول <span className="gradient-text">الشحن</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="anime-card p-6">
                <h3 className="font-bold text-gray-800 mb-3">هل يمكنني تغيير عنوان التوصيل؟</h3>
                <p className="text-gray-600">يمكن تغيير العنوان قبل شحن الطلب. تواصل معنا فوراً لتعديل العنوان.</p>
              </div>
              
              <div className="anime-card p-6">
                <h3 className="font-bold text-gray-800 mb-3">ماذا لو لم أكن متواجداً عند التوصيل؟</h3>
                <p className="text-gray-600">سيحاول المندوب التواصل معك. في حالة عدم الرد، سيتم إعادة جدولة التوصيل.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="anime-card p-6">
                <h3 className="font-bold text-gray-800 mb-3">هل الشحن مؤمن؟</h3>
                <p className="text-gray-600">نعم، جميع الشحنات مؤمنة ضد الفقدان والتلف أثناء النقل.</p>
              </div>
              
              <div className="anime-card p-6">
                <h3 className="font-bold text-gray-800 mb-3">كيف أتتبع طلبي؟</h3>
                <p className="text-gray-600">ستحصل على رقم تتبع عبر الرسائل النصية والبريد الإلكتروني فور الشحن.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Cart />
    </div>
  );
}
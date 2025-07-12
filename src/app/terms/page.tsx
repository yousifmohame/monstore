'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShoppingCart, CreditCard, Truck, RotateCcw, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';

export default function TermsPage() {
  const sections = [
    {
      icon: FileText,
      title: 'قبول الشروط',
      content: [
        'باستخدام موقع متجر الأنمي، فإنك توافق على الالتزام بهذه الشروط والأحكام',
        'إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام موقعنا',
        'نحتفظ بالحق في تعديل هذه الشروط في أي وقت دون إشعار مسبق',
        'استمرار استخدامك للموقع يعني موافقتك على الشروط المحدثة',
        'يجب أن تكون بعمر 18 سنة أو أكثر لاستخدام خدماتنا'
      ]
    },
    {
      icon: ShoppingCart,
      title: 'الطلبات والمشتريات',
      content: [
        'جميع الطلبات خاضعة للتوفر وتأكيد السعر',
        'نحتفظ بالحق في رفض أو إلغاء أي طلب لأي سبب',
        'الأسعار قابلة للتغيير دون إشعار مسبق',
        'يجب تقديم معلومات دقيقة وكاملة عند إجراء الطلب',
        'أنت مسؤول عن جميع الرسوم والضرائب المطبقة'
      ]
    },
    {
      icon: CreditCard,
      title: 'الدفع والفوترة',
      content: [
        'نقبل طرق الدفع المختلفة كما هو موضح في صفحة الدفع',
        'جميع المدفوعات يجب أن تتم بالعملة المحددة (ريال سعودي)',
        'في حالة فشل الدفع، سيتم إلغاء الطلب تلقائياً',
        'نستخدم معالجات دفع آمنة ومشفرة لحماية معلوماتك',
        'الفواتير سترسل إلى بريدك الإلكتروني المسجل'
      ]
    },
    {
      icon: Truck,
      title: 'الشحن والتوصيل',
      content: [
        'نشحن إلى جميع مناطق المملكة العربية السعودية',
        'أوقات التوصيل تقديرية وقد تختلف حسب الموقع',
        'رسوم الشحن محددة حسب الوزن والموقع',
        'العميل مسؤول عن تقديم عنوان صحيح ومفصل',
        'في حالة عدم وجود المستلم، سيتم إعادة المحاولة أو إرجاع الطلب'
      ]
    },
    {
      icon: RotateCcw,
      title: 'الإرجاع والاستبدال',
      content: [
        'يمكن إرجاع المنتجات خلال 30 يوماً من تاريخ الاستلام',
        'المنتجات يجب أن تكون في حالتها الأصلية وغير مستخدمة',
        'العميل يتحمل تكلفة الإرجاع ما لم يكن المنتج معيباً',
        'المبلغ سيُرد خلال 7-14 يوم عمل بعد استلام المنتج المرجع',
        'بعض المنتجات قد تكون غير قابلة للإرجاع (منتجات شخصية، مخصصة)'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'المسؤولية والضمانات',
      content: [
        'نحن غير مسؤولين عن أي أضرار غير مباشرة أو تبعية',
        'مسؤوليتنا محدودة بقيمة المنتج المشترى',
        'لا نضمن أن الموقع سيكون متاحاً دون انقطاع',
        'المنتجات مضمونة حسب ضمان الشركة المصنعة',
        'نحتفظ بالحق في تعديل أو إيقاف الخدمة في أي وقت'
      ]
    }
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
              شروط الخدمة 📋
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              الشروط والأحكام التي تحكم استخدام موقع متجر الأنمي وخدماتنا
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="anime-card p-8 mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">مرحباً بك في متجر الأنمي</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  هذه الشروط والأحكام تحكم استخدامك لموقع متجر الأنمي والخدمات المقدمة من خلاله. 
                  يرجى قراءة هذه الشروط بعناية قبل استخدام موقعنا أو إجراء أي عملية شراء.
                </p>
                <p>
                  باستخدام موقعنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، 
                  فلا يجوز لك استخدام موقعنا أو خدماتنا.
                </p>
                <p>
                  نحتفظ بالحق في تحديث أو تعديل هذه الشروط في أي وقت دون إشعار مسبق. 
                  التغييرات ستصبح سارية فور نشرها على الموقع.
                </p>
              </div>
            </div>

            <div className="text-center mb-12">
              <p className="text-gray-600">
                <strong>تاريخ آخر تحديث:</strong> 1 يناير 2024
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="anime-card p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <section.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                </div>
                
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3 text-gray-600">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Terms */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="anime-card p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">شروط إضافية مهمة</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">الملكية الفكرية</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• جميع المحتويات محمية بحقوق الطبع والنشر</li>
                    <li>• لا يجوز نسخ أو توزيع المحتوى دون إذن</li>
                    <li>• العلامات التجارية مملوكة لأصحابها</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">سلوك المستخدم</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• يُمنع استخدام الموقع لأغراض غير قانونية</li>
                    <li>• عدم محاولة اختراق أو إتلاف النظام</li>
                    <li>• احترام المستخدمين الآخرين</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">القانون المطبق</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• تخضع هذه الشروط لقوانين المملكة العربية السعودية</li>
                    <li>• أي نزاع يُحل في المحاكم السعودية</li>
                    <li>• اللغة العربية هي المرجع في التفسير</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">إنهاء الخدمة</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• يمكننا إنهاء حسابك في حالة انتهاك الشروط</li>
                    <li>• يمكنك إلغاء حسابك في أي وقت</li>
                    <li>• بعض الأحكام تبقى سارية بعد الإنهاء</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
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
                أسئلة حول <span className="gradient-text">الشروط</span>؟
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                إذا كان لديك أي أسئلة حول شروط الخدمة أو تحتاج إلى توضيحات إضافية، 
                لا تتردد في التواصل معنا. فريقنا جاهز لمساعدتك.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 mb-2">البريد الإلكتروني</h4>
                  <p className="text-primary-600">legal@animestore.sa</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 mb-2">الهاتف</h4>
                  <p className="text-primary-600">+966 50 123 4567</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 mb-2">ساعات العمل</h4>
                  <p className="text-primary-600">السبت - الخميس: 9:00 - 18:00</p>
                </div>
              </div>
              
              <button className="btn-primary">
                تواصل معنا
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
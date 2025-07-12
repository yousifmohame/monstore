'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, UserCheck, Database, Globe } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';

export default function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: 'جمع المعلومات',
      content: [
        'نجمع المعلومات التي تقدمها لنا مباشرة عند إنشاء حساب أو إجراء عملية شراء',
        'معلومات الاتصال مثل الاسم والبريد الإلكتروني ورقم الهاتف',
        'معلومات الدفع والفوترة (مشفرة وآمنة)',
        'تفضيلات التسوق وسجل الطلبات',
        'معلومات تقنية مثل عنوان IP ونوع المتصفح'
      ]
    },
    {
      icon: Eye,
      title: 'استخدام المعلومات',
      content: [
        'معالجة وتنفيذ طلباتك وتوفير خدمة العملاء',
        'إرسال تحديثات الطلبات والإشعارات المهمة',
        'تحسين تجربة التسوق وتخصيص المحتوى',
        'إجراء تحليلات لتطوير خدماتنا',
        'الامتثال للمتطلبات القانونية والتنظيمية'
      ]
    },
    {
      icon: Shield,
      title: 'حماية المعلومات',
      content: [
        'نستخدم تشفير SSL لحماية جميع البيانات المنقولة',
        'خوادم آمنة ومحمية بأحدث تقنيات الأمان',
        'وصول محدود للموظفين المخولين فقط',
        'مراجعات أمنية دورية وتحديثات النظام',
        'نسخ احتياطية آمنة ومشفرة للبيانات'
      ]
    },
    {
      icon: UserCheck,
      title: 'حقوقك',
      content: [
        'الحق في الوصول إلى معلوماتك الشخصية',
        'طلب تصحيح أو تحديث البيانات غير الصحيحة',
        'حذف حسابك ومعلوماتك الشخصية',
        'إلغاء الاشتراك في الرسائل التسويقية',
        'تقديم شكوى إلى السلطات المختصة'
      ]
    },
    {
      icon: Globe,
      title: 'مشاركة المعلومات',
      content: [
        'لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة',
        'قد نشارك المعلومات مع شركاء الشحن لتوصيل طلباتك',
        'مشاركة محدودة مع معالجي الدفع لتنفيذ المعاملات',
        'الكشف عند الضرورة القانونية أو لحماية حقوقنا',
        'في حالة اندماج أو استحواذ تجاري'
      ]
    },
    {
      icon: Lock,
      title: 'ملفات تعريف الارتباط',
      content: [
        'نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح',
        'تذكر تفضيلاتك وإعدادات الحساب',
        'تحليل استخدام الموقع وتحسين الأداء',
        'عرض إعلانات مخصصة ومناسبة لاهتماماتك',
        'يمكنك إدارة إعدادات ملفات تعريف الارتباط في متصفحك'
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
              سياسة الخصوصية 🔒
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              نحن ملتزمون بحماية خصوصيتك وأمان معلوماتك الشخصية
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
              <h2 className="text-3xl font-bold text-gray-800 mb-6">مقدمة</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  في متجر الأنمي، نحن نقدر ثقتكم ونلتزم بحماية خصوصيتكم. تشرح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتكم الشخصية عند استخدام موقعنا الإلكتروني وخدماتنا.
                </p>
                <p>
                  تطبق هذه السياسة على جميع المعلومات التي نجمعها من خلال موقعنا الإلكتروني، التطبيقات المحمولة، البريد الإلكتروني، والاتصالات الأخرى معكم.
                </p>
                <p>
                  باستخدام خدماتنا، فإنكم توافقون على جمع واستخدام المعلومات وفقاً لهذه السياسة. إذا كان لديكم أي أسئلة أو مخاوف، يرجى التواصل معنا.
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

      {/* Privacy Sections */}
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

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="anime-card p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                هل لديك أسئلة حول <span className="gradient-text">الخصوصية</span>؟
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو ممارساتنا في التعامل مع معلوماتك الشخصية، 
                أو إذا كنت تريد ممارسة أي من حقوقك، يرجى التواصل معنا.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 mb-2">البريد الإلكتروني</h4>
                  <p className="text-primary-600">privacy@animestore.sa</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 mb-2">الهاتف</h4>
                  <p className="text-primary-600">+966 50 123 4567</p>
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
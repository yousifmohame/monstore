'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, DollarSign, Clock, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';

export default function RefundPolicyPage() {
  const sections = [
    {
      icon: RotateCcw,
      title: 'سياسة الاسترداد',
      content: [
        'نحن نضمن لك رضاك التام عن مشترياتك من كيوتاكو',
        'إذا لم تكن راضياً عن المنتج لأي سبب، يمكنك إرجاعه واسترداد كامل المبلغ',
        'يجب أن يكون المنتج في حالته الأصلية مع جميع الملصقات والتغليف',
        'نقبل الإرجاع خلال 30 يوماً من تاريخ الاستلام',
        'نتحمل تكاليف الشحن للإرجاع في حالة وجود عيب في المنتج'
      ]
    },
    {
      icon: DollarSign,
      title: 'طرق الاسترداد',
      content: [
        'استرداد كامل للمبلغ إلى نفس وسيلة الدفع الأصلية',
        'رصيد في المتجر يمكن استخدامه في مشتريات مستقبلية',
        'استبدال المنتج بمنتج آخر من نفس القيمة أو أعلى (مع دفع الفرق)',
        'يتم معالجة الاسترداد خلال 7-14 يوم عمل من تاريخ استلام المنتج المرجع',
        'سيتم إشعارك عبر البريد الإلكتروني بحالة طلب الاسترداد'
      ]
    },
    {
      icon: Clock,
      title: 'فترة الاسترداد',
      content: [
        'يمكنك طلب الاسترداد خلال 30 يوماً من تاريخ استلام المنتج',
        'بعد انتهاء فترة 30 يوماً، لا يمكن قبول طلبات الاسترداد',
        'في حالة وجود عيب مصنعي، يمكن تمديد فترة الاسترداد حسب ضمان المنتج',
        'المنتجات المخصصة أو المصنوعة حسب الطلب غير قابلة للاسترداد',
        'يجب الإبلاغ عن أي عيوب أو مشاكل في المنتج خلال 48 ساعة من الاستلام'
      ]
    },
    {
      icon: CheckCircle,
      title: 'شروط الاسترداد',
      content: [
        'يجب أن يكون المنتج في حالته الأصلية دون استخدام',
        'يجب الاحتفاظ بجميع الملصقات والتغليف الأصلي',
        'يجب تقديم إثبات الشراء (رقم الطلب أو الفاتورة)',
        'لا نقبل إرجاع المنتجات التي تم فتحها أو استخدامها إلا في حالة وجود عيب',
        'المنتجات المخفضة قد تخضع لشروط استرداد خاصة'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'استثناءات الاسترداد',
      content: [
        'المنتجات المخصصة أو المصنوعة حسب الطلب',
        'المنتجات المستخدمة أو التالفة بسبب سوء الاستخدام',
        'المنتجات التي تم شراؤها من خلال عروض خاصة أو تخفيضات كبيرة',
        'المنتجات التي تم فتح عبواتها (مثل الأقراص المدمجة أو الألعاب)',
        'الهدايا المجانية أو المنتجات الترويجية'
      ]
    },
    {
      icon: HelpCircle,
      title: 'كيفية طلب الاسترداد',
      content: [
        'تسجيل الدخول إلى حسابك والانتقال إلى صفحة "طلباتي"',
        'اختيار الطلب المراد إرجاعه والنقر على "طلب استرداد"',
        'تعبئة نموذج الاسترداد وتحديد سبب الإرجاع',
        'اتباع تعليمات الشحن لإرجاع المنتج',
        'يمكنك أيضاً التواصل مع خدمة العملاء للمساعدة في عملية الاسترداد'
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
              سياسة الاسترداد 🔄
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              نضمن لك رضاك التام عن مشترياتك من كيوتاكو
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
              <h2 className="text-3xl font-bold text-gray-800 mb-6">ضمان الرضا التام</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  في كيوتاكو، رضا العملاء هو أولويتنا الأولى. نحن نؤمن بأن كل عميل يجب أن يكون سعيداً تماماً بمشترياته، ولهذا نقدم سياسة استرداد مرنة وعادلة.
                </p>
                <p>
                  إذا لم تكن راضياً عن منتج اشتريته من متجرنا لأي سبب، يمكنك إرجاعه واسترداد كامل المبلغ. نحن نضمن لك تجربة تسوق خالية من المخاطر.
                </p>
                <p>
                  تنطبق سياسة الاسترداد هذه على جميع المنتجات باستثناء ما هو مذكور في قسم الاستثناءات. يرجى قراءة التفاصيل أدناه للتعرف على الشروط والإجراءات.
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

      {/* Policy Sections */}
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

      {/* Satisfaction Guarantee */}
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
                ضمان <span className="gradient-text">الرضا التام</span>
              </h2>
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-primary-600" />
              </div>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                نحن واثقون من جودة منتجاتنا ونريدك أن تكون واثقاً من شرائك. إذا لم تكن راضياً تماماً عن مشترياتك لأي سبب، 
                فنحن نضمن لك استرداد كامل المبلغ خلال 30 يوماً من تاريخ الاستلام.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 mb-2">استرداد سهل</h4>
                  <p className="text-gray-600 text-sm">عملية استرداد بسيطة وسريعة</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 mb-2">100% من المبلغ</h4>
                  <p className="text-gray-600 text-sm">استرداد كامل للمبلغ المدفوع</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 mb-2">دعم مباشر</h4>
                  <p className="text-gray-600 text-sm">فريق دعم جاهز لمساعدتك</p>
                </div>
              </div>
              
              <button className="btn-primary">
                تواصل مع خدمة العملاء
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
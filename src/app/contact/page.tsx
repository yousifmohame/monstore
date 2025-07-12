'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HeadphonesIcon, Globe } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      details: 'support@kyotaku.com',
      description: 'راسلنا في أي وقت وسنرد عليك خلال 24 ساعة'
    },
    {
      icon: Phone,
      title: 'الهاتف',
      details: '+966 557869384',
      description: 'متاح من السبت إلى الخميس، 9 صباحاً - 6 مساءً',
      dir: 'ltr'
    },
    {
      icon: MapPin,
      title: 'العنوان',
      details: 'الرياض، المملكة العربية السعودية',
      description: 'مقرنا الرئيسي في قلب العاصمة'
    },
    {
      icon: Clock,
      title: 'ساعات العمل',
      details: 'السبت - الخميس: 9:00 - 18:00',
      description: 'الجمعة: مغلق'
    }
  ];

  const supportChannels = [
    {
      icon: MessageCircle,
      title: 'الدردشة المباشرة',
      description: 'تحدث معنا مباشرة للحصول على مساعدة فورية',
      action: 'ابدأ المحادثة',
      color: 'bg-green-500'
    },
    {
      icon: HeadphonesIcon,
      title: 'الدعم الفني',
      description: 'للمساعدة في المشاكل التقنية والطلبات',
      action: 'اتصل بنا',
      color: 'bg-blue-500'
    },
    {
      icon: Globe,
      title: 'الأسئلة الشائعة',
      description: 'ابحث عن إجابات للأسئلة الأكثر شيوعاً',
      action: 'تصفح الأسئلة',
      color: 'bg-purple-500'
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
              تواصل معنا 📞
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              نحن هنا لمساعدتك! تواصل معنا بأي طريقة تناسبك وسنكون سعداء للرد على استفساراتك
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              طرق <span className="gradient-text">التواصل</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              اختر الطريقة الأنسب لك للتواصل معنا
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="anime-card p-6 text-center group"
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <info.icon className="h-8 w-8 text-primary-600" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{info.title}</h3>
                <p className="text-primary-600 font-semibold mb-2" dir={info.dir}>{info.details}</p>
                <p className="text-gray-600 text-sm">{info.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Support Channels */}
          <div className="grid md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="anime-card p-6 group"
                whileHover={{ y: -5 }}
              >
                <div className={`${channel.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <channel.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{channel.title}</h3>
                <p className="text-gray-600 mb-4">{channel.description}</p>
                <button className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                  {channel.action} ←
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                أرسل لنا <span className="gradient-text">رسالة</span>
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                هل لديك سؤال أو اقتراح؟ نحن نحب أن نسمع منك! املأ النموذج وسنتواصل معك في أقرب وقت ممكن.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">رد سريع</h4>
                    <p className="text-gray-600 text-sm">نرد على جميع الرسائل خلال 24 ساعة</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <HeadphonesIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">دعم متخصص</h4>
                    <p className="text-gray-600 text-sm">فريق دعم متخصص في منتجات الأنمي</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">تواصل ودود</h4>
                    <p className="text-gray-600 text-sm">نتعامل مع كل عميل كصديق عزيز</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="anime-card p-8"
            >
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-8"
                >
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">تم إرسال الرسالة!</h3>
                  <p className="text-gray-600 mb-6">
                    شكراً لك على تواصلك معنا. سنرد على رسالتك في أقرب وقت ممكن.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="btn-primary"
                  >
                    إرسال رسالة أخرى
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        الاسم الكامل
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field text-right"
                        placeholder="أدخل اسمك الكامل"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
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
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      موضوع الرسالة
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input-field text-right"
                      required
                    >
                      <option value="">اختر موضوع الرسالة</option>
                      <option value="order">استفسار عن طلب</option>
                      <option value="product">سؤال عن منتج</option>
                      <option value="shipping">الشحن والتوصيل</option>
                      <option value="return">الإرجاع والاستبدال</option>
                      <option value="suggestion">اقتراح أو شكوى</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      الرسالة
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="input-field text-right resize-none"
                      placeholder="اكتب رسالتك هنا..."
                      required
                    ></textarea>
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
                        إرسال الرسالة
                        <Send className="h-5 w-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              موقعنا على <span className="gradient-text">الخريطة</span>
            </h2>
            <p className="text-xl text-gray-600">
              زورنا في مقرنا الرئيسي في الرياض
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-200 h-96 rounded-2xl flex items-center justify-center"
          >
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">خريطة تفاعلية</p>
              <p className="text-gray-500">الرياض، المملكة العربية السعودية</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <Cart />
    </div>
  );
}
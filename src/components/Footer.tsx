'use client'

import React from 'react'
import Link from 'next/link'
import { Instagram, Facebook, Mail, Phone, MapPin, CreditCard, Truck, Shield, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Features Section */}
      <div className="border-b border-gray-800">
        <div className="container-custom py-16">
          <motion.div 
            className="grid md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="text-center" variants={itemVariants}>
              <motion.div 
                className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                <Truck className="h-8 w-8" />
              </motion.div>
              <h3 className="font-bold text-lg mb-2">توصيل سريع</h3>
              <p className="text-gray-400">توصيل لجميع مناطق المملكة</p>
            </motion.div>

            <motion.div className="text-center" variants={itemVariants}>
              <motion.div 
                className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                <Shield className="h-8 w-8" />
              </motion.div>
              <h3 className="font-bold text-lg mb-2">دفع آمن</h3>
              <p className="text-gray-400">مدفوعات آمنة ومشفرة 100%</p>
            </motion.div>

            <motion.div className="text-center" variants={itemVariants}>
              <motion.div 
                className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                <Clock className="h-8 w-8" />
              </motion.div>
              <h3 className="font-bold text-lg mb-2">دعم 24/7</h3>
              <p className="text-gray-400">خدمة عملاء على مدار الساعة</p>
            </motion.div>

            <motion.div className="text-center" variants={itemVariants}>
              <motion.div 
                className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                <CreditCard className="h-8 w-8" />
              </motion.div>
              <h3 className="font-bold text-lg mb-2">إرجاع سهل</h3>
              <p className="text-gray-400">سياسة إرجاع مريحة لمدة 30 يوماً</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16">
        <motion.div 
          className="grid md:grid-cols-4 gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Company Info */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <motion.h3 
              className="text-3xl font-bold anime-gradient bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              كيوتاكو 🎌
            </motion.h3>
            <p className="text-gray-300 leading-relaxed">
              وجهتك الأولى لمنتجات الأنمي والمانجا عالية الجودة بأسعار لا تقاوم. نحن ملتزمون بتوفير تجارب تسوق استثنائية مع توصيل سريع وخدمة عملاء متميزة.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              {[
                { 
                  icon: () => (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 448 512">
                      <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
                    </svg>
                  ), 
                  href: 'https://www.tiktok.com/@kyotaku', 
                  color: 'hover:text-pink-400',
                  name: 'TikTok'
                },
                { 
                  icon: Instagram, 
                  href: 'https://instagram.com/kyotaku', 
                  color: 'hover:text-pink-400',
                  name: 'Instagram'
                },
                { 
                  icon: Facebook, 
                  href: 'https://facebook.com/kyotaku', 
                  color: 'hover:text-blue-400',
                  name: 'Facebook'
                },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${social.color} transition-colors p-2 rounded-full hover:bg-gray-800`}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  title={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <h4 className="text-xl font-bold">روابط سريعة</h4>
            <ul className="space-y-3">
              {[
                { label: 'من نحن', href: '/about' },
                { label: 'اتصل بنا', href: '/contact' },
                { label: 'سياسة الخصوصية', href: '/privacy' },
                { label: 'شروط الخدمة', href: '/terms' },
                { label: 'الأسئلة الشائعة', href: '/faq' },
                { label: 'معلومات الشحن', href: '/shipping' },
              ].map((link, index) => (
                <motion.li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-colors hover:underline"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <h4 className="text-xl font-bold">الفئات</h4>
            <ul className="space-y-3">
              {[
                { label: 'الملابس', href: '/categories/clothes' },
                { label: 'الحقائب', href: '/categories/backpacks' },
                { label: 'أغطية الهواتف', href: '/categories/phone-cases' },
                { label: 'التماثيل', href: '/categories/figurines' },
                { label: 'الألعاب', href: '/categories/toys' },
                { label: 'الإكسسوارات', href: '/categories/accessories' },
              ].map((category, index) => (
                <motion.li key={index}>
                  <Link 
                    href={category.href} 
                    className="text-gray-300 hover:text-white transition-colors hover:underline"
                  >
                    {category.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <h4 className="text-xl font-bold">تواصل معنا</h4>
            <div className="space-y-4">
              {[
                { icon: Mail, text: 'support@kyotaku.sa', href: 'mailto:support@kyotaku.sa' },
                { icon: Phone, text: '+966 557869384', href: 'tel:+966557869384', dir: 'ltr' },
                { icon: MapPin, text: 'الرياض، المملكة العربية السعودية', href: '#' },
              ].map((contact, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-3"
                  whileHover={{ x: 5 }}
                >
                  <contact.icon className="h-5 w-5 text-primary-400 flex-shrink-0" />
                  <a 
                    href={contact.href}
                    className="text-gray-300 hover:text-white transition-colors"
                    dir={contact.dir}
                  >
                    {contact.text}
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="pt-4">
              <h5 className="font-semibold mb-3">طرق الدفع المقبولة</h5>
              <div className="grid grid-cols-3 gap-2">
                {/* Visa */}
                <motion.div
                  className="bg-gray-800 p-1 rounded border border-gray-700 flex items-center justify-center h-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-white font-bold text-xs tracking-wider">VISA</div>
                </motion.div>
                
                {/* Mastercard */}
                <motion.div
                  className="bg-gray-800 p-1 rounded border border-gray-700 flex items-center justify-center h-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center gap-0.5">
                    <div className="w-1 h-1 bg-red-500 rounded-full opacity-80"></div>
                    <div className="w-1 h-1 bg-yellow-500 rounded-full opacity-80 -ml-1"></div>
                  </div>
                </motion.div>
                
                {/* Mada */}
                <motion.div
                  className="bg-gray-800 p-1 rounded border border-gray-700 flex items-center justify-center h-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-white font-bold text-xs">مدى</div>
                </motion.div>
                
                {/* PayPal */}
                <motion.div
                  className="bg-gray-800 p-1 rounded border border-gray-700 flex items-center justify-center h-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-blue-400 font-bold text-xs">PayPal</div>
                </motion.div>
                
                {/* STC Pay */}
                <motion.div
                  className="bg-gray-800 p-1 rounded border border-gray-700 flex items-center justify-center h-4 col-span-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-purple-400 font-bold text-xs">STC Pay</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-gray-800 mt-12 pt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">
              © 2024 كيوتاكو. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                سياسة الخصوصية
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                شروط الخدمة
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">
                خريطة الموقع
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
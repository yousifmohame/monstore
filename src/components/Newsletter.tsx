'use client'

import React, { useState } from 'react'
import { Mail, CheckCircle, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true)
      setIsLoading(false)
      setEmail('')
    }, 1500)
  }

  return (
    <section className="py-20 anime-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Anime Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-10 right-10 text-4xl opacity-30"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🎌
        </motion.div>
        <motion.div 
          className="absolute bottom-10 left-10 text-3xl opacity-30"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, -10, 10, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          ⚡
        </motion.div>
        <motion.div 
          className="absolute top-20 left-1/4 text-2xl opacity-30"
          animate={{ 
            y: [0, -10, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          🌸
        </motion.div>
      </div>

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <motion.div
            className="mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
              <MessageCircle className="h-10 w-10" />
            </div>
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            تواصل معنا مباشرة
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            لديك سؤال أو استفسار؟ تواصل معنا مباشرة عبر الدردشة الفورية أو أرسل لنا بريداً إلكترونياً وسنرد عليك في أقرب وقت ممكن.
          </p>

          {!isSubmitted ? (
            <motion.form 
              onSubmit={handleSubmit}
              className="max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل عنوان بريدك الإلكتروني"
                  className="flex-1 px-6 py-4 rounded-xl text-gray-800 focus:ring-2 focus:ring-white focus:outline-none placeholder-gray-500 text-lg text-right"
                  required
                />
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <>
                      تواصل معنا
                      <Mail className="h-5 w-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <CheckCircle className="h-20 w-20 mx-auto mb-6 text-green-400" />
              <h3 className="text-3xl font-bold mb-4">شكراً لك!</h3>
              <p className="text-white/90 text-lg">سنتواصل معك قريباً. تحقق من بريدك الإلكتروني للرد.</p>
            </motion.div>
          )}

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h4 className="font-semibold text-lg mb-2">دردشة فورية</h4>
              <p className="text-white/80">تواصل مباشرة مع فريق خدمة العملاء</p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h4 className="font-semibold text-lg mb-2">البريد الإلكتروني</h4>
              <p className="text-white/80">support@kyotaku.com</p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h4 className="font-semibold text-lg mb-2">استرداد كامل</h4>
              <p className="text-white/80">نضمن لك استرداد كامل إذا لم تكن راضياً</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Newsletter
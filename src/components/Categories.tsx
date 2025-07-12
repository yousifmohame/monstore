'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
// استيراد الـ Hook الخاص بالفئات
import { Category, useCategories } from '@/hooks/useCategories'

const Categories = () => {
  // استخدام الـ Hook لجلب البيانات
  const { categories, loading: categoriesLoading, fetchCategories } = useCategories()

  useEffect(() => {
    // جلب الفئات عند تحميل المكون
    fetchCategories()
  }, []) // المصفوفة الفارغة تضمن تشغيل هذا مرة واحدة فقط

  const getEmoji = (slug: string) => {
    switch (slug) {
      case 'clothes': return '👕'
      case 'backpacks': return '🎒'
      case 'phone-cases': return '📱'
      case 'figurines': return '🎎'
      case 'toys': return '🧸'
      default: return '✨'
    }
  }

  const getColor = (index: number) => {
    const colors = [
      'from-anime-pink to-primary-500',
      'from-anime-purple to-secondary-500',
      'from-anime-blue to-primary-600',
      'from-anime-orange to-accent-500',
      'from-anime-green to-green-500',
      'from-purple-500 to-pink-500'
    ]
    return colors[index % colors.length]
  }

  if (categoriesLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center">
            <div className="loading-dots mb-4">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p className="text-xl text-gray-600 font-medium">جاري تحميل الفئات...</p>
          </div>
        </div>
      </section>
    )
  }

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
    <section className="py-20 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            تسوق حسب <span className="gradient-text">الفئة</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اكتشف مجموعتنا الواسعة من منتجات الأنمي عبر فئات مختلفة
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category: any, index: number) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link href={`/categories/${category.slug}`}>
                <motion.div
                  className="relative p-8 rounded-2xl text-center transition-all duration-300 cursor-pointer overflow-hidden group anime-card"
                  whileHover={{
                    scale: 1.05,
                    y: -5
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${getColor(index)} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative z-10 text-white">
                    <motion.div
                      className="mb-4 flex justify-center text-4xl"
                      whileHover={{
                        scale: 1.2,
                        rotate: [0, -10, 10, 0]
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {getEmoji(category.slug)}
                    </motion.div>
                    <h3 className="font-bold text-lg mb-2">{category.nameAr}</h3>
                    <p className="text-sm opacity-90">{category._count?.products || 0} منتج</p>
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                  <motion.div
                    className="absolute top-2 right-2 text-white/50"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    ✨
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Categories
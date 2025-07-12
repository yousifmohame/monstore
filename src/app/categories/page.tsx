'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import { useCategories, Category } from '@/hooks/useCategories';
import {
  Shirt,
  Backpack,
  Smartphone,
  Users,
  Gamepad2,
  Sparkles,
  Filter,
  Grid,
  List,
} from 'lucide-react';

// Define the type for our static categories
interface StaticCategory {
  id: string;
  nameAr: string;
  descriptionAr: string;
  imageUrl: string;
  slug: string;
  count: number;
  emoji: string;
  color: string;
  subcategories: string[];
}

// Static fallback data with proper typing
const staticCategories: StaticCategory[] = [
  {
    id: 'clothes',
    nameAr: 'الملابس',
    descriptionAr: 'تيشيرتات وهوديز وملابس بتصاميم الأنمي المفضل لديك',
    imageUrl: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg',
    slug: 'clothes',
    count: 500,
    emoji: '👕',
    color: 'from-pink-500 to-purple-500', // Changed to standard Tailwind colors
    subcategories: ['تيشيرتات', 'هوديز', 'قمصان', 'بناطيل'],
  },
  {
    id: 'backpacks',
    nameAr: 'الحقائب',
    descriptionAr: 'حقائب ظهر وحقائب مدرسية بتصاميم شخصيات الأنمي',
    imageUrl: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg',
    slug: 'backpacks',
    count: 200,
    emoji: '🎒',
    color: 'from-purple-500 to-blue-500',
    subcategories: ['حقائب ظهر', 'حقائب مدرسية', 'حقائب يد', 'محافظ'],
  },
  {
    id: 'phone-cases',
    nameAr: 'أغطية الهواتف',
    descriptionAr: 'أغطية حماية للهواتف الذكية بتصاميم أنمي مذهلة',
    imageUrl: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
    slug: 'phone-cases',
    count: 300,
    emoji: '📱',
    color: 'from-blue-500 to-green-500',
    subcategories: ['آيفون', 'سامسونج', 'هواوي', 'شاومي'],
  },
];

export default function CategoriesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const { categories, loading, error, fetchCategories } = useCategories();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]); // Added fetchCategories to dependency array

  // Combine API categories with static ones if API returns empty
  const displayedCategories = categories.length > 0 ? categories : staticCategories;

  const sortedCategories = [...displayedCategories].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.nameAr.localeCompare(b.nameAr);
      case 'count':
        return (b.count || 0) - (a.count || 0); // Added null checks
      case 'popular':
        return (b.count || 0) - (a.count || 0);
      default:
        return 0;
    }
  });

  if (loading && categories.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20 text-center">
          <div className="loading-dots mb-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-xl text-gray-600 font-medium">جاري تحميل الفئات...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold text-red-600">حدث خطأ</h1>
          <p className="text-gray-600 mt-4">{error.message || 'فشل في تحميل البيانات'}</p>
          <button 
            onClick={() => fetchCategories()} 
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            حاول مرة أخرى
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-blue-500 text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div
            className="absolute bottom-20 left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl animate-float"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">فئات المنتجات 🛍️</h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              اكتشف مجموعتنا الواسعة من منتجات الأنمي المنظمة في فئات مختلفة
            </p>
          </motion.div>
        </div>
      </section>

      {/* Controls */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">
                {displayedCategories.length} فئة متاحة
              </span>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="name">ترتيب حسب الاسم</option>
                <option value="count">ترتيب حسب عدد المنتجات</option>
                <option value="popular">ترتيب حسب الشعبية</option>
              </select>
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${
                    viewMode === 'grid'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  } transition-colors`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  } transition-colors`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            className={`grid gap-8 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}
            layout
          >
            {sortedCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`bg-white rounded-lg shadow-md overflow-hidden group ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
                whileHover={{ y: -5 }}
              >
                <Link 
                  href={`/categories/${category.slug}`} 
                  className={`block ${viewMode === 'list' ? 'flex w-full' : ''}`}
                  passHref
                >
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'
                    }`}
                  >
                    <Image
                      src={category.imageUrl || '/placeholder.jpg'}
                      alt={category.nameAr}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      priority={index < 3} // Prioritize loading first 3 images
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-80 group-hover:opacity-90 transition-opacity`}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-4xl mb-2">{category.emoji}</div>
                        <h3 className="text-xl font-bold">{category.nameAr}</h3>
                        <p className="text-sm opacity-90">{category.count} منتج</p>
                      </div>
                    </div>
                  </div>
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                        {category.nameAr}
                      </h3>
                      <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-semibold">
                        {category.count}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {category.descriptionAr}
                    </p>
                    {'subcategories' in category && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-800 mb-3">الفئات الفرعية:</h4>
                        <div className="flex flex-wrap gap-2">
                          {category.subcategories?.map((sub, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-primary-100 hover:text-primary-600 transition-colors"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <motion.div
                      className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700"
                      whileHover={{ x: -5 }}
                    >
                      <span>تصفح المنتجات</span>
                      <svg
                        className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              الفئات <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">الأكثر شعبية</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              الفئات التي يحبها عملاؤنا أكثر من غيرها
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {sortedCategories
              .sort((a, b) => (b.count || 0) - (a.count || 0))
              .slice(0, 3)
              .map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <Link href={`/categories/${category.slug}`} passHref>
                    <motion.div
                      className={`bg-gradient-to-r ${category.color} w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl text-white shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      {category.emoji}
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{category.nameAr}</h3>
                    <p className="text-gray-600 mb-4">{category.count} منتج متاح</p>
                    <span className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                      تصفح الآن ←
                    </span>
                  </Link>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      <Footer />
      <Cart />
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent, Clock, Star, ShoppingCart, Heart, Eye, Filter, Grid, List } from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import { useStore } from '@/store/useStore';
import { mockProducts } from '@/lib/mockData';

export default function DealsPage() {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('discount');

  // Filter products that are on sale
  const dealsProducts = mockProducts.filter(product => product.salePrice);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.nameAr,
      price: product.salePrice || product.price,
      image: product.images?.[0]?.imageUrl || '/placeholder.jpg',
      quantity: 1
    });
  };

  const handleToggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const calculateDiscount = (originalPrice: number, salePrice: number) => {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  const deals = [
    {
      title: 'عروض نهاية الأسبوع',
      description: 'خصومات تصل إلى 50% على مجموعة مختارة',
      discount: '50%',
      color: 'from-red-500 to-pink-500',
      icon: '🔥'
    },
    {
      title: 'عروض المنتجات الجديدة',
      description: 'خصم 30% على جميع المنتجات الجديدة',
      discount: '30%',
      color: 'from-green-500 to-emerald-500',
      icon: '🆕'
    },
    {
      title: 'عروض الكمية',
      description: 'اشتري 2 واحصل على الثالث مجاناً',
      discount: '33%',
      color: 'from-blue-500 to-cyan-500',
      icon: '🎁'
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
              العروض والخصومات 🔥
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              اكتشف أفضل العروض والخصومات على منتجات الأنمي المفضلة لديك
            </p>
          </motion.div>
        </div>
      </section>

      {/* Special Deals */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              عروض <span className="gradient-text">خاصة</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              عروض محدودة الوقت لا تفوتها!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {deals.map((deal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${deal.color} text-white p-8 group`}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="absolute top-4 right-4 text-4xl opacity-20">
                  {deal.icon}
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">{deal.title}</h3>
                  <p className="mb-4 opacity-90">{deal.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{deal.discount}</span>
                    <button className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                      تسوق الآن
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-8 text-center"
          >
            <h3 className="text-3xl font-bold mb-4">عرض محدود الوقت!</h3>
            <p className="text-xl mb-6">خصم 40% على جميع المنتجات - ينتهي قريباً</p>
            <div className="flex justify-center gap-4 mb-6">
              {['23', '14', '35', '42'].map((time, index) => (
                <div key={index} className="bg-white/20 rounded-lg p-4 min-w-[80px]">
                  <div className="text-2xl font-bold">{time}</div>
                  <div className="text-sm opacity-80">
                    {['ساعة', 'دقيقة', 'ثانية', 'ثانية'][index]}
                  </div>
                </div>
              ))}
            </div>
            <button className="bg-white text-orange-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
              تسوق الآن قبل انتهاء العرض
            </button>
          </motion.div>
        </div>
      </section>

      {/* Products on Sale */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                منتجات <span className="gradient-text">مخفضة</span>
              </h2>
              <p className="text-gray-600">
                {dealsProducts.length} منتج بخصومات مذهلة
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="discount">ترتيب حسب الخصم</option>
                <option value="price">ترتيب حسب السعر</option>
                <option value="rating">ترتيب حسب التقييم</option>
              </select>
              
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <motion.div 
            className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}
            layout
          >
            {dealsProducts.map((product: any, index: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`anime-card group relative overflow-hidden ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
                whileHover={{ y: -5 }}
              >
                <div className={`relative overflow-hidden ${
                  viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-64'
                }`}>
                  <Image
                    src={product.images?.[0]?.imageUrl || '/placeholder.jpg'}
                    alt={product.nameAr}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover product-image"
                  />
                  
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <Percent className="h-3 w-3" />
                      {calculateDiscount(product.price, product.salePrice)}%
                    </div>
                  </div>
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <motion.button
                      className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye className="h-5 w-5 text-gray-700" />
                    </motion.button>
                    
                    <motion.button
                      onClick={() => handleToggleWishlist(product.id)}
                      className={`p-3 rounded-full shadow-lg transition-colors ${
                        isInWishlist(product.id) 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </motion.button>
                  </div>
                </div>
                
                <div className={`p-6 space-y-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium">{product.category?.nameAr}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 font-medium">{product.rating}</span>
                    </div>
                  </div>
                  
                  {/* Product Name */}
                  <h3 className="font-bold text-gray-800 text-lg group-hover:text-primary-600 transition-colors line-clamp-2">
                    {product.nameAr}
                  </h3>
                  
                  {/* Price & Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-primary-600">
                          {product.salePrice} ريال
                        </p>
                        <p className="text-sm text-gray-400 line-through">
                          {product.price} ريال
                        </p>
                      </div>
                      <p className="text-xs text-green-600 font-medium">
                        وفر {(product.price - product.salePrice).toFixed(2)} ريال
                      </p>
                    </div>
                    
                    <motion.button
                      onClick={() => handleAddToCart(product)}
                      className="btn-primary flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      أضف للسلة
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="anime-gradient rounded-3xl p-12 text-white text-center"
          >
            <h2 className="text-4xl font-bold mb-4">لا تفوت العروض القادمة!</h2>
            <p className="text-xl mb-8 opacity-90">
              اشترك في نشرتنا الإخبارية واحصل على إشعارات فورية بأحدث العروض والخصومات
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-4 py-3 rounded-xl text-gray-800 focus:ring-2 focus:ring-white focus:outline-none"
              />
              <button className="bg-white text-primary-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                اشتراك
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
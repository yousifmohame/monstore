'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, X, Star, Share2 } from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import { mockProducts } from '@/lib/mockData';

export default function WishlistPage() {
  const { user } = useAuth();
  const { wishlist, removeFromWishlist, addToCart } = useStore();
  
  // Mock wishlist products (in a real app, this would come from the API)
  const wishlistProducts = mockProducts.filter(product => 
    wishlist.includes(product.id)
  );

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.nameAr,
      price: product.salePrice || product.price,
      image: product.images?.[0]?.imageUrl || '/placeholder.jpg',
      quantity: 1
    });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'قائمة أمنياتي - متجر الأنمي',
          text: 'شاهد قائمة أمنياتي في متجر الأنمي',
          url: window.location.href,
        });
      } catch (error) {
        // If sharing fails (permission denied, user cancellation, etc.), fall back to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('تم نسخ الرابط!');
        } catch (clipboardError) {
          // Final fallback if clipboard also fails
          console.error('Failed to copy to clipboard:', clipboardError);
          alert('حدث خطأ في المشاركة');
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('تم نسخ الرابط!');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        alert('حدث خطأ في نسخ الرابط');
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20">
          <div className="text-center">
            <Heart className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">يجب تسجيل الدخول أولاً</h1>
            <p className="text-gray-600 mb-8">للوصول إلى قائمة أمنياتك، يرجى تسجيل الدخول</p>
            <a href="/auth/login" className="btn-primary">
              تسجيل الدخول
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
              قائمة الأمنيات 💖
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              منتجاتك المفضلة في مكان واحد
            </p>
            
            {wishlistProducts.length > 0 && (
              <div className="flex justify-center gap-4">
                <span className="bg-white/20 px-4 py-2 rounded-full">
                  {wishlistProducts.length} منتج
                </span>
                <button
                  onClick={handleShare}
                  className="bg-white/20 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/30 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  مشاركة
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="py-20">
        <div className="container-custom">
          {wishlistProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <Heart className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">قائمة الأمنيات فارغة</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                لم تقم بإضافة أي منتجات إلى قائمة أمنياتك بعد. ابدأ بتصفح منتجاتنا الرائعة!
              </p>
              <a href="/products" className="btn-primary text-lg px-8 py-4">
                تصفح المنتجات
              </a>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">قائمة أمنياتي</h2>
                  <p className="text-gray-600">
                    {wishlistProducts.length} منتج في قائمة أمنياتك
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      wishlistProducts.forEach(product => handleAddToCart(product));
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    أضف الكل للسلة
                  </button>
                  
                  <button
                    onClick={() => {
                      wishlistProducts.forEach(product => handleRemoveFromWishlist(product.id));
                    }}
                    className="btn-outline flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    مسح الكل
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                layout
              >
                {wishlistProducts.map((product: any, index: number) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="anime-card group relative overflow-hidden"
                    whileHover={{ y: -5 }}
                    layout
                  >
                    <div className="relative overflow-hidden h-64">
                      <Image
                        src={product.images?.[0]?.imageUrl || '/placeholder.jpg'}
                        alt={product.nameAr}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover product-image"
                      />
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4 text-gray-700" />
                      </button>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.featured && (
                          <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            مميز
                          </span>
                        )}
                        {product.newArrival && (
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            جديد
                          </span>
                        )}
                        {product.salePrice && (
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            تخفيض
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
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
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-bold text-primary-600">
                            {product.salePrice || product.price} ريال
                          </p>
                          {product.salePrice && (
                            <p className="text-sm text-gray-400 line-through">
                              {product.price} ريال
                            </p>
                          )}
                        </div>
                        
                        <motion.button
                          onClick={() => handleAddToCart(product)}
                          className="w-full btn-primary flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          أضف للسلة
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-20"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                  منتجات قد تعجبك أيضاً
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {mockProducts
                    .filter(product => !wishlist.includes(product.id))
                    .slice(0, 4)
                    .map((product: any, index: number) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="anime-card group overflow-hidden"
                        whileHover={{ y: -5 }}
                      >
                        <div className="relative overflow-hidden h-48">
                          <Image
                            src={product.images?.[0]?.imageUrl || '/placeholder.jpg'}
                            alt={product.nameAr}
                            width={300}
                            height={200}
                            className="w-full h-full object-cover product-image"
                          />
                        </div>
                        
                        <div className="p-4">
                          <h4 className="font-bold text-gray-800 mb-2 line-clamp-2">
                            {product.nameAr}
                          </h4>
                          <p className="text-primary-600 font-bold">
                            {product.salePrice || product.price} ريال
                          </p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </section>

      <Footer />
      <Cart />
    </div>
  );
}
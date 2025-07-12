'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, TrendingUp, Zap, ShoppingBag, ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/hooks/useProducts';

const DEFAULT_SHIPPING_COST = 25;

const Hero = React.memo(() => {
  const { 
    addToCart, 
    addToWishlist, 
    removeFromWishlist, 
    isInWishlist 
  } = useStore();
  
  const { 
    products: fetchedProducts = [], 
    loading: productsLoading, 
    error: productsError, 
    fetchProducts 
  } = useProducts();
  
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch products only once on initial load
  useEffect(() => {
    if (isInitialLoad) {
      const loadProducts = async () => {
        try {
          await fetchProducts({ featured: true }, 1);
        } catch (err) {
          console.error('Error loading products:', err);
        } finally {
          setIsInitialLoad(false);
        }
      };
      loadProducts();
    }
  }, [isInitialLoad, fetchProducts]);

  // Set featured product when data loads
  useEffect(() => {
    if (fetchedProducts.length > 0 && !featuredProduct) {
      const featured = fetchedProducts.find(p => p.featured) || fetchedProducts[0];
      setFeaturedProduct(featured);
    }
  }, [fetchedProducts, featuredProduct]);

  // Memoized product actions
  const handleAddToCart = useCallback(() => {
    if (!featuredProduct) return;
    addToCart({
      id: featuredProduct.id,
      name: featuredProduct.nameAr || featuredProduct.name,
      price: featuredProduct.salePrice || featuredProduct.price,
      image: featuredProduct.images?.[0]?.imageUrl || '/placeholder.jpg',
      quantity: 1
    });
  }, [featuredProduct, addToCart]);

  const handleToggleWishlist = useCallback(() => {
    if (!featuredProduct) return;
    isInWishlist(featuredProduct.id) 
      ? removeFromWishlist(featuredProduct.id) 
      : addToWishlist(featuredProduct.id);
  }, [featuredProduct, isInWishlist, addToWishlist, removeFromWishlist]);

  // Memoized product data
  const productData = useMemo(() => {
    if (!featuredProduct) return null;
    
    return {
      ...featuredProduct,
      discountPercentage: featuredProduct.salePrice 
        ? Math.round(((featuredProduct.price - featuredProduct.salePrice) / featuredProduct.price) * 100)
        : 0
    };
  }, [featuredProduct]);

  // Animation variants
  const containerVariants = useMemo(() => ({ 
    hidden: { opacity: 0 }, 
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2 } 
    } 
  }), []);

  const itemVariants = useMemo(() => ({ 
    hidden: { opacity: 0, y: 30 }, 
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      } 
    } 
  }), []);

  // Loading state
  if (isInitialLoad || productsLoading) {
    return (
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-dots flex justify-center space-x-2 mb-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" />
            ))}
          </div>
          <p className="text-xl text-gray-600 font-medium">
            جاري تحميل المحتوى المميز...
          </p>
        </div>
      </section>
    );
  }

  // Error state
  if (productsError) {
    return (
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500 p-4 max-w-md mx-auto">
          <p className="text-lg font-medium">حدث خطأ أثناء تحميل البيانات</p>
          <p className="text-sm mt-2">{productsError.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition"
          >
            إعادة المحاولة
          </button>
        </div>
      </section>
    );
  }

  // No products state
  if (!productData) {
    return (
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 min-h-screen flex items-center justify-center">
        <div className="text-center text-yellow-600 p-4 max-w-md mx-auto">
          <p className="text-lg font-medium">لا يوجد منتجات متاحة حالياً</p>
          <Link href="/products">
            <button className="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition">
              تصفح جميع المنتجات
            </button>
          </Link>
        </div>
      </section>
    );
  }

  // Main hero content
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div 
            className="space-y-8 text-right" 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                <span className="block">مرحباً بك في</span>
                <motion.span 
                  className="block text-primary-600 mt-2"
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  كيوتاكو
                </motion.span>
              </h1>
            </motion.div>
            
            <motion.p className="text-lg text-gray-600 max-w-lg" variants={itemVariants}>
              وجهتك الأولى لكل ما يخص الأنمي والمانجا. من الملابس والإكسسوارات إلى التماثيل والألعاب، اكتشف عالماً مليئاً بالإبداع والجودة.
            </motion.p>
            
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-end" variants={itemVariants}>
              <Link href="/products" passHref legacyBehavior>
                <motion.a
                  className="bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2 text-lg px-8 py-4 rounded-lg transition-colors duration-300 cursor-pointer" 
                  whileHover={{ scale: 1.05 }}
                >
                  <ShoppingBag className="h-5 w-5" />
                  تسوق الآن
                  <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                </motion.a>
              </Link>
              <Link href="/categories" passHref legacyBehavior>
                <motion.a
                  className="border-2 border-primary-500 text-primary-500 hover:bg-primary-50 text-lg px-8 py-4 rounded-lg transition-colors duration-300 cursor-pointer" 
                  whileHover={{ scale: 1.05 }}
                >
                  تصفح الفئات
                </motion.a>
              </Link>
            </motion.div>
            
            <motion.div className="flex items-center gap-8 pt-4 justify-end" variants={itemVariants}>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-5 w-5 text-yellow-400 fill-current" 
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">تقييم 4.9/5</span>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm font-semibold text-gray-700">أكثر من 5000 منتج</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary-500" />
                <span className="text-sm font-semibold text-gray-700">
                  شحن {DEFAULT_SHIPPING_COST} ريال
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Product Card */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              <motion.div 
                className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-xl transition-shadow duration-300" 
                whileHover={{ scale: 1.02 }}
              >
                <Link href={`/products/${productData.slug}`} passHref legacyBehavior>
                  <motion.a>
                    <Image 
                      src={productData.images[0]?.imageUrl || "/placeholder.jpg"} 
                      alt={productData.nameAr || productData.name || "Featured Product"} 
                      width={600} 
                      height={500} 
                      className="w-full h-[500px] object-cover" 
                      priority 
                    />
                  </motion.a>
                </Link>
                
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {productData.nameAr || productData.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < Math.floor(productData.rating || 0) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({productData.reviewsCount || 0})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-primary-600">
                          {productData.salePrice || productData.price} ريال
                        </span>
                        {productData.salePrice && (
                          <span className="text-lg text-gray-400 line-through">
                            {productData.price} ريال
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <motion.button 
                        onClick={handleToggleWishlist} 
                        className={`p-3 rounded-full ${
                          isInWishlist(productData.id) 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-gray-100 text-gray-700'
                        } transition-colors duration-200`} 
                        whileHover={{ scale: 1.1 }}
                      >
                        <Heart className={`h-5 w-5 ${
                          isInWishlist(productData.id) ? 'fill-current' : ''
                        }`} />
                      </motion.button>
                      
                      <motion.button 
                        onClick={handleAddToCart} 
                        className="bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full transition-colors duration-200" 
                        whileHover={{ scale: 1.1 }}
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <Link href={`/products/${productData.slug}`} passHref legacyBehavior>
                    <motion.a
                      className="block w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg transition-colors duration-300 text-center" 
                      whileHover={{ scale: 1.02 }}
                    >
                      عرض التفاصيل
                    </motion.a>
                  </Link>
                </div>
              </motion.div>
              
              {productData.discountPercentage > 0 && (
                <motion.div 
                  className="absolute -top-6 -right-6 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-primary-100"
                  initial={{ opacity: 0, y: -20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.8 }}
                >
                  <p className="text-red-600 font-bold text-2xl text-center">
                    خصم {productData.discountPercentage}%
                  </p>
                  <p className="text-gray-600 text-sm text-center">عرض خاص</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;

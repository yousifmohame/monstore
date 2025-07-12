'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List, Search, Star, ShoppingCart, Heart, Eye, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import { useStore } from '@/store/useStore';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  
  // Use hooks for fetching data
  const { products, loading: productsLoading, fetchProducts } = useProducts();
  const { fetchCategoryBySlug } = useCategories();

  const [category, setCategory] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    // Only run this effect when the slug changes, not on every render
    if (params.slug && !initialLoadComplete) {
      const loadData = async () => {
        try {
          setLoading(true);
          const foundCategory = await fetchCategoryBySlug(params.slug);
          setCategory(foundCategory);
          
          if (foundCategory) {
            await fetchProducts({ category: foundCategory.id });
          }
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
          setInitialLoadComplete(true);
        }
      };

      loadData();
    }
  }, [params.slug, initialLoadComplete, fetchProducts, fetchCategoryBySlug]);

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

  // Filter and sort products
  const sortedProducts = useMemo(() => {
    const filtered = products.filter(product =>
      product.nameAr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (sortBy) {
      case 'price-low':
        return [...filtered].sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      case 'price-high':
        return [...filtered].sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      case 'rating':
        return [...filtered].sort((a, b) => b.rating - a.rating);
      case 'name':
        return [...filtered].sort((a, b) => a.nameAr.localeCompare(b.nameAr));
      default:
        return filtered;
    }
  }, [products, sortBy, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20">
          <div className="text-center">
            <div className="loading-dots mb-4">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p className="text-xl text-gray-600 font-medium">جاري التحميل...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">الفئة غير موجودة</h1>
            <p className="text-gray-600 mb-8">عذراً، لم نتمكن من العثور على الفئة المطلوبة</p>
            <Link href="/categories" className="btn-primary">
              العودة للفئات
            </Link>
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
              {category.nameAr} 🛍️
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              {category.descriptionAr}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="py-4 bg-white border-b">
        <div className="container-custom">
          <nav className="flex items-center space-x-2 space-x-reverse text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary-600">الرئيسية</Link>
            <span className="text-gray-400">/</span>
            <Link href="/categories" className="text-gray-500 hover:text-primary-600">الفئات</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">{category.nameAr}</span>
          </nav>
        </div>
      </section>

      {/* Controls */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">
                {sortedProducts.length} منتج متاح
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في المنتجات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="newest">الأحدث</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
                <option value="rating">الأعلى تقييماً</option>
                <option value="name">الاسم</option>
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
        </div>
      </section>

      {/* Products */}
      <section className="py-20">
        <div className="container-custom">
          {productsLoading ? (
            <div className="text-center py-16">
              <div className="loading-dots">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">لا توجد منتجات في هذه الفئة</p>
            </div>
          ) : (
            <motion.div 
              className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}
              layout
            >
              {sortedProducts.map((product: any, index: number) => (
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
                    <Link href={`/products/${product.slug}`}>
                      <Image
                        src={product.images?.[0]?.imageUrl || '/placeholder.jpg'}
                        alt={product.nameAr}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover product-image cursor-pointer"
                      />
                    </Link>
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <Link href={`/products/${product.slug}`}>
                        <motion.button
                          className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Eye className="h-5 w-5 text-gray-700" />
                        </motion.button>
                      </Link>
                      
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

                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
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
                  
                  <div className={`p-6 space-y-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 font-medium">{category.nameAr}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 font-medium">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviewsCount})</span>
                      </div>
                    </div>
                    
                    {/* Product Name */}
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-bold text-gray-800 text-lg group-hover:text-primary-600 transition-colors line-clamp-2 cursor-pointer">
                        {product.nameAr}
                      </h3>
                    </Link>
                    
                    {/* Price & Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="space-y-1">
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
                        {product.stock < 10 && product.stock > 0 && (
                          <p className="text-xs text-orange-500 font-medium">
                            متبقي {product.stock} قطع فقط
                          </p>
                        )}
                      </div>
                      
                      <motion.button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          product.stock === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'btn-primary'
                        }`}
                        whileHover={product.stock > 0 ? { scale: 1.05 } : {}}
                        whileTap={product.stock > 0 ? { scale: 0.95 } : {}}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {product.stock === 0 ? 'نفد المخزون' : 'أضف للسلة'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
      <Cart />
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import {
  Filter,
  Grid,
  List,
  Search,
  Star,
  ShoppingCart,
  Heart,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import Chat from '@/components/Chat';
import { useStore } from '@/store/useStore';
import { useProducts } from '@/hooks/useProducts'; // Using hook instead of mock
import { useCategories } from '@/hooks/useCategories';

export default function ProductsPage() {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, searchQuery, setSearchQuery } = useStore();
  const { products, loading: productsLoading, fetchProducts } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');

  // Load categories and products on mount
  useEffect(() => {
    fetchProducts({
      category: selectedCategory || undefined,
      search: searchQuery || undefined,
    });
  }, [selectedCategory, sortBy, searchQuery]);

  // Update local search query when global search query changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Sort products on frontend
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.salePrice || a.price) - (b.salePrice || b.price);
      case 'price-high':
        return (b.salePrice || b.price) - (a.salePrice || a.price);
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
      default:
        return 0; // Sorted by newest in backend
    }
  });

  // Apply price range filter
  const filteredByPrice = sortedProducts.filter(product => {
    const price = product.salePrice || product.price;
    return price >= priceRange[0] && price <= priceRange[1];
  });

  // Apply stock filter
  const filteredProducts =
    stockFilter === 'in-stock'
      ? filteredByPrice.filter(p => p.stock > 0)
      : stockFilter === 'out-of-stock'
      ? filteredByPrice.filter(p => p.stock === 0)
      : filteredByPrice;

  // Find min and max prices for slider
  const minPrice = Math.min(...products.map(p => p.salePrice || p.price), 0);
  const maxPrice = Math.max(...products.map(p => p.salePrice || p.price), 500);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.nameAr,
      price: product.salePrice || product.price,
      image: product.images?.find((img: { isPrimary: any; }) => img.isPrimary)?.imageUrl || '/placeholder.jpg',
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearchQuery);
  };

  if (productsLoading || categoriesLoading) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-custom py-16">
        {/* Header and Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">جميع المنتجات</h1>
            <p className="text-gray-600">{filteredProducts.length} منتج متاح</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-500"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">جميع الفئات</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.nameAr}
                </option>
              ))}
            </select>

            {/* Stock Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">جميع المنتجات</option>
              <option value="in-stock">متوفر في المخزون</option>
              <option value="out-of-stock">نفد من المخزون</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="newest">الأحدث</option>
              <option value="price-low">السعر: من الأقل للأعلى</option>
              <option value="price-high">السعر: من الأعلى للأقل</option>
              <option value="rating">الأعلى تقييماً</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid' 
                    ? 'bg-primary-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list' 
                    ? 'bg-primary-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="bg-white rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">نطاق السعر</h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value)])
              }
              className="w-full"
            />
            <div className="flex items-center gap-2">
              <span className="text-gray-600">{priceRange[0]}</span>
              <span>-</span>
              <span className="text-gray-600">{priceRange[1]}</span>
              <span className="text-gray-600">ريال</span>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <motion.div
          className={`grid gap-8 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}
          layout
        >
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-xl text-gray-500">لا توجد منتجات متطابقة مع البحث</p>
            </div>
          ) : (
            filteredProducts.map((product: any, index: number) => (
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
                <div
                  className={`relative overflow-hidden ${
                    viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-64'
                  }`}
                >
                  <Link href={`/products/${product.slug}`}>
                    <Image
                      src={
                        product.images.find((img: { isPrimary: any; }) => img.isPrimary)?.imageUrl ||
                        '/placeholder.jpg'
                      }
                      alt={product.nameAr}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover product-image cursor-pointer"
                    />
                  </Link>
                  {/* Hover Actions */}
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
                      <Heart
                        className={`h-5 w-5 ${
                          isInWishlist(product.id) ? 'fill-current' : ''
                        }`}
                      />
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

                {/* Product Info */}
                <div className={`p-6 space-y-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium">
                      {product.category?.nameAr || 'غير مصنف'}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 font-medium">
                        {product.rating}
                      </span>
                      <span className="text-xs text-gray-400">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-bold text-gray-800 text-lg group-hover:text-primary-600 transition-colors line-clamp-2 cursor-pointer">
                      {product.nameAr}
                    </h3>
                  </Link>

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
                      {product.stock === 0 && (
                        <p className="text-xs text-red-500 font-medium">
                          نفد من المخزون
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
            ))
          )}
        </motion.div>
      </div>
      <Footer />
      <Cart />
      <Chat />
    </div>
  );
}
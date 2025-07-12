'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Save, Eye, Edit, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { mockProducts } from '@/lib/mockData';

export default function AdminFeaturedPage() {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState(mockProducts);
  const [featuredProduct, setFeaturedProduct] = useState(mockProducts[0]);
  const [isEditing, setIsEditing] = useState(false);

  // Check if user is admin
  if (!user || !profile?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">غير مصرح</h1>
            <p className="text-gray-600 mb-8">ليس لديك صلاحية للوصول لهذه الصفحة</p>
            <a href="/" className="btn-primary">
              العودة للرئيسية
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSetFeatured = (product: any) => {
    setFeaturedProduct(product);
    // In a real app, this would save to the backend
    console.log('Setting featured product:', product);
  };

  const handleToggleBestSeller = (productId: string) => {
    setProducts(products.map(product =>
      product.id === productId
        ? { ...product, bestSeller: !product.bestSeller }
        : product
    ));
  };

  const handleToggleOnSale = (productId: string) => {
    setProducts(products.map(product =>
      product.id === productId
        ? { ...product, onSale: !product.onSale }
        : product
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة المنتجات المميزة</h1>
            <p className="text-gray-600">تحكم في المنتج المعروض في البانر والعروض الخاصة</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Product Preview */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="anime-card p-6 sticky top-8"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                المنتج المميز الحالي
              </h2>

              <div className="relative mb-4">
                <Image
                  src={featuredProduct.images[0]?.imageUrl || '/placeholder.jpg'}
                  alt={featuredProduct.nameAr}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {featuredProduct.salePrice && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    خصم {Math.round(((featuredProduct.price - featuredProduct.salePrice) / featuredProduct.price) * 100)}%
                  </div>
                )}
              </div>

              <h3 className="font-bold text-gray-800 mb-2">{featuredProduct.nameAr}</h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(featuredProduct.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({featuredProduct.reviewsCount})</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl font-bold text-primary-600">
                  {featuredProduct.salePrice || featuredProduct.price} ريال
                </span>
                {featuredProduct.salePrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {featuredProduct.price} ريال
                  </span>
                )}
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">هذا المنتج يظهر في البانر الرئيسي</p>
              </div>
            </motion.div>
          </div>

          {/* Products Management */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="anime-card p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">إدارة المنتجات</h2>

              <div className="space-y-4">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`p-4 border-2 rounded-lg transition-all ${featuredProduct.id === product.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={product.images[0]?.imageUrl || '/placeholder.jpg'}
                        alt={product.nameAr}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-1">{product.nameAr}</h3>
                        <p className="text-gray-600 text-sm mb-2">{product.category.nameAr}</p>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary-600">
                              {product.salePrice || product.price} ريال
                            </span>
                            {product.salePrice && (
                              <span className="text-sm text-gray-400 line-through">
                                {product.price} ريال
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{product.rating}</span>
                          </div>
                        </div>

                        {/* Product Controls */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={product.bestSeller}
                              onChange={() => handleToggleBestSeller(product.id)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span>الأكثر مبيعاً</span>
                          </label>

                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={product.onSale}
                              onChange={() => handleToggleOnSale(product.id)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span>في التخفيضات</span>
                          </label>
                        </div>

                        {/* Sale Price Input */}
                        <div className="flex items-center gap-2 mb-3">
                          <label className="text-sm font-medium text-gray-700">سعر التخفيض:</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max={product.price}
                            value={product.salePrice || ''}
                            onChange={(e) => {
                              const value = e.target.value ? parseFloat(e.target.value) : null;
                            }}
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                            placeholder="0.00"
                          />
                          <span className="text-sm text-gray-500">ريال</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleSetFeatured(product)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${featuredProduct.id === product.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {featuredProduct.id === product.id ? 'مميز حالياً' : 'جعل مميز'}
                        </button>

                        <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>

                        <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Save Changes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <button className="btn-primary flex items-center gap-2 mx-auto px-8 py-3">
            <Save className="h-5 w-5" />
            حفظ التغييرات
          </button>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
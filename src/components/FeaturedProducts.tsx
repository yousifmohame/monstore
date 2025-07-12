'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingCart, Heart, Eye, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useStore } from '@/store/useStore'
// 1. استيراد الـ Hook الفعلي وحذف البيانات الوهمية
import { Product, useProducts } from '@/hooks/useProducts'
import ProductModal from './ProductModal'

const FeaturedProducts = () => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore()
  // 2. استخدام الـ Hook لجلب المنتجات وحالة التحميل
  const { products, loading, fetchProducts } = useProducts()
  const [activeTab, setActiveTab] = useState<'featured' | 'new' | 'bestseller'>('featured')
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 3. استخدام useEffect لجلب المنتجات عند تغيير التبويب
  useEffect(() => {
    const filter = {
      featured: activeTab === 'featured',
      newArrival: activeTab === 'new',
      bestSeller: activeTab === 'bestseller'
    };
    // استدعاء الدالة لجلب أول 6 منتجات تطابق الفلتر
    fetchProducts(filter, 6);
  }, [activeTab]); // سيتم إعادة تنفيذ هذا التأثير عند تغيير activeTab

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.nameAr,
      price: product.salePrice || product.price,
      image: product.images?.[0]?.imageUrl || '/placeholder.jpg',
      quantity: 1
    })
  }

  const handleToggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId)
    } else {
      addToWishlist(productId)
    }
  }

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }
  
  const tabs = [
    { id: 'featured', label: 'المميزة' },
    { id: 'new', label: 'الجديدة' },
    { id: 'bestseller', label: 'الأكثر مبيعاً' },
  ];
  
  // 4. عرض حالة التحميل للمستخدم
  if (loading && products.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center">
            <div className="loading-dots mb-4">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p className="text-xl text-gray-600 font-medium">جاري تحميل المنتجات...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          {/* ... (واجهة المستخدم JSX تبقى كما هي بدون تغيير كبير) ... */}
           {/* Header */}
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              منتجات <span className="gradient-text">مميزة</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              اكتشف مجموعتنا المختارة بعناية من أفضل منتجات الأنمي
            </p>

            {/* Tabs */}
            <div className="flex justify-center mb-12">
              <div className="bg-white rounded-2xl p-2 inline-flex shadow-lg">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 relative ${activeTab === tab.id
                      ? 'anime-gradient text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

           {/* Products Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            {products.map((product: any, index: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="anime-card group relative overflow-hidden"
                whileHover={{ y: -5 }}
              >
                <div className="relative overflow-hidden">
                  <Link href={`/products/${product.slug}`}>
                    <Image
                      src={product.images?.[0]?.imageUrl || '/placeholder.jpg'}
                      alt={product.nameAr}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover product-image cursor-pointer"
                    />
                  </Link>

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <motion.button
                      onClick={() => handleViewProduct(product)}
                      className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye className="h-5 w-5 text-gray-700" />
                    </motion.button>

                    <motion.button
                      onClick={() => handleToggleWishlist(product.id)}
                      className={`p-3 rounded-full shadow-lg transition-colors ${isInWishlist(product.id)
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

                <div className="p-6 space-y-4">
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium">{product.category?.nameAr}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 font-medium">{product.rating}</span>
                      <span className="text-xs text-gray-400">({product.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Product Name */}
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-bold text-gray-800 text-lg group-hover:text-primary-600 transition-colors">
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

                      {/* Stock indicator */}
                      {product.stock <= 10 && (
                        <p className={`text-xs font-medium ${product.stock === 0 ? 'text-red-600' : 'text-orange-500'
                          }`}>
                          {product.stock === 0 ? 'نفد من المخزون' : `متبقي ${product.stock} قطع فقط`}
                        </p>
                      )}
                    </div>

                    <motion.button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`btn-primary flex items-center gap-2 ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      whileHover={product.stock > 0 ? { scale: 1.05 } : {}}
                      whileTap={product.stock > 0 ? { scale: 0.95 } : {}}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {product.stock === 0 ? 'نفد' : 'أضف للسلة'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default FeaturedProducts
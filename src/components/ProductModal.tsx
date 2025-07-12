'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, Heart, Plus, Minus, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/store/useStore';

interface ProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  // Mock media data (images and videos)
  const mediaItems = [
    ...product.images.map((img: any, index: number) => ({
      id: `img-${index}`,
      type: 'image',
      url: img.imageUrl,
      alt: img.altText || product.nameAr
    })),
    // Mock video
    {
      id: 'video-1',
      type: 'video',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      alt: `فيديو ${product.nameAr}`
    }
  ];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.nameAr,
      price: product.salePrice || product.price,
      image: product.images[0]?.imageUrl || '/placeholder.jpg',
      quantity
    });
    onClose();
  };

  const handleToggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">تفاصيل المنتج</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 p-6">
              {/* Media Section */}
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
                  {mediaItems[selectedMedia]?.type === 'image' ? (
                    <Image
                      src={mediaItems[selectedMedia]?.url || '/placeholder.jpg'}
                      alt={mediaItems[selectedMedia]?.alt || product.nameAr}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <video
                        src={mediaItems[selectedMedia]?.url}
                        className="w-full h-full object-cover"
                        controls
                        autoPlay
                        muted
                        loop
                      />
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {product.featured && (
                      <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        مميز
                      </span>
                    )}
                    {product.newArrival && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        جديد
                      </span>
                    )}
                    {product.salePrice && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        خصم {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnail Media */}
                {mediaItems.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {mediaItems.map((media: any, index: number) => (
                      <button
                        key={media.id}
                        onClick={() => setSelectedMedia(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors relative ${
                          selectedMedia === index ? 'border-primary-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {media.type === 'image' ? (
                          <Image
                            src={media.url}
                            alt={media.alt}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="relative w-full h-full">
                            <video
                              src={media.url}
                              className="w-full h-full object-cover"
                              muted
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Play className="h-3 w-3 text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary-600 font-medium">{product.category.nameAr}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">SKU: {product.sku}</span>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.nameAr}</h1>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-gray-600">({product.reviewsCount} تقييم)</span>
                    {product.bestSeller && (
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                        الأكثر مبيعاً
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-3xl font-bold text-primary-600">
                      {product.salePrice || product.price} ريال
                    </div>
                    {product.salePrice && (
                      <div className="text-xl text-gray-400 line-through">
                        {product.price} ريال
                      </div>
                    )}
                    {product.salePrice && (
                      <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                        وفر {(product.price - product.salePrice).toFixed(2)} ريال
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {product.descriptionAr}
                  </p>

                  {/* Stock Status */}
                  <div className="mb-6">
                    {product.stock > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 font-medium">متوفر في المخزون</span>
                        {product.stock < 10 && (
                          <span className="text-orange-500 text-sm">
                            (متبقي {product.stock} قطع فقط)
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-red-600 font-medium">نفد من المخزون</span>
                      </div>
                    )}
                  </div>

                  {/* Quantity and Actions */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <label className="font-semibold text-gray-700">الكمية:</label>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 font-semibold">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={quantity >= product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <motion.button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                          product.stock === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'btn-primary'
                        }`}
                        whileHover={product.stock > 0 ? { scale: 1.02 } : {}}
                        whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        {product.stock === 0 ? 'نفد المخزون' : 'أضف للسلة'}
                      </motion.button>

                      <motion.button
                        onClick={handleToggleWishlist}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          isInWishlist(product.id)
                            ? 'border-primary-500 bg-primary-50 text-primary-600'
                            : 'border-gray-300 hover:border-primary-300 text-gray-600'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Heart className={`h-6 w-6 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </motion.button>
                    </div>
                    
                    {/* View Full Details Button */}
                    <Link href={`/products/${product.slug}`}>
                      <motion.button
                        className="w-full btn-outline py-3"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        عرض التفاصيل الكاملة
                      </motion.button>
                    </Link>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-primary-600 text-2xl mb-2">🚚</div>
                      <p className="text-sm font-medium text-gray-800">شحن سريع</p>
                      <p className="text-xs text-gray-500">25 ريال</p>
                    </div>
                    <div className="text-center">
                      <div className="text-primary-600 text-2xl mb-2">🛡️</div>
                      <p className="text-sm font-medium text-gray-800">ضمان الجودة</p>
                      <p className="text-xs text-gray-500">منتج أصلي</p>
                    </div>
                    <div className="text-center">
                      <div className="text-primary-600 text-2xl mb-2">🔄</div>
                      <p className="text-sm font-medium text-gray-800">إرجاع مجاني</p>
                      <p className="text-xs text-gray-500">30 يوم</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
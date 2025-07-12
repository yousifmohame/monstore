'use client';

import React, { useState, useEffect } from 'react';
import {
  motion
} from 'framer-motion';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
  Eye,
  Play,
  X,
  Palette,
  Ruler
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import Chat from '@/components/Chat';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts'; // استيراد الـ Hook لجلب المنتجات

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
  helpful: number;
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { user } = useAuth();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const { fetchProductBySlug } = useProducts(); // استخدام الدالة من الـ Hook

  const [product, setProduct] = useState<any>(null);
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [variantError, setVariantError] = useState('');
  const [loading, setLoading] = useState(true);

  // تحميل المنتج عند تغيير السلق
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const fetchedProduct = await fetchProductBySlug(params.slug); // جلب البيانات عبر API
        if (fetchedProduct) {
          setProduct(fetchedProduct);

          // تعيين اللون والحجم الافتراضي إذا كان هناك متغيرات
          if (fetchedProduct.hasVariants) {
            if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
              setSelectedColorId(fetchedProduct.colors[0]);
            }
            if (fetchedProduct.sizes && fetchedProduct.sizes.length > 0) {
              setSelectedSizeId(fetchedProduct.sizes[0]);
            }
          }

          // محاكاة التقييمات
          setReviews([
            {
              id: '1',
              userId: 'user1',
              userName: 'أحمد محمد',
              rating: 5,
              title: 'منتج رائع!',
              comment:
                'جودة ممتازة وتصميم جميل. أنصح بشرائه بشدة. وصل في الوقت المحدد والتعبئة كانت ممتازة.',
              verifiedPurchase: true,
              createdAt: '2024-01-15',
              helpful: 12,
            },
            {
              id: '2',
              userId: 'user2',
              userName: 'فاطمة أحمد',
              rating: 4,
              title: 'جيد جداً',
              comment: 'المنتج جيد ولكن التوصيل كان متأخر قليلاً. الجودة كما هو متوقع.',
              verifiedPurchase: true,
              createdAt: '2024-01-10',
              helpful: 8,
            },
          ]);
        }
      } catch (error) {
        console.error('فشل في تحميل المنتج:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      loadProduct();
    }
  }, [params.slug]);

  // تحديث المتغير المحدد عند تغيير اللون أو الحجم
  useEffect(() => {
    if (product?.hasVariants && product.variants) {
      const variant = product.variants.find(
        (v: any) =>
          (v.colorId === selectedColorId || !v.colorId) &&
          (v.sizeId === selectedSizeId || !v.sizeId)
      );
      setSelectedVariant(variant);
      setVariantError('');
    }
  }, [selectedColorId, selectedSizeId, product]);

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

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">المنتج غير موجود</h1>
            <p className="text-gray-600 mb-8">عذراً، لم نتمكن من العثور على المنتج المطلوب</p>
            <Link href="/products" className="btn-primary">
              العودة للمنتجات
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Mock media items
  const mediaItems = [
    ...product.images.map((img: any, index: number) => ({
      id: `img-${index}`,
      type: 'image',
      url: img.imageUrl,
      alt: img.altText || product.nameAr,
    })),
    {
      id: 'video-1',
      type: 'video',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4 ',
      alt: `فيديو ${product.nameAr}`,
    },
  ];

  const handleAddToCart = () => {
    if (product.hasVariants) {
      if (!selectedVariant) {
        setVariantError('الرجاء اختيار المتغيرات المطلوبة');
        return;
      }
      if (selectedVariant.stock <= 0) {
        setVariantError('هذا المتغير غير متوفر حالياً');
        return;
      }
    } else if (product.stock <= 0) {
      return;
    }

    const colorName = selectedColorId ? product.colorsOptions?.find((c: any) => c.id === selectedColorId)?.nameAr : null;
    const sizeName = selectedSizeId ? product.sizesOptions?.find((s: any) => s.id === selectedSizeId)?.nameAr : null;

    addToCart({
      id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
      name: product.nameAr,
      price: product.salePrice || product.price,
      image: product.images[0]?.imageUrl || '/placeholder.jpg',
      quantity,
      colorId: selectedColorId,
      colorName,
      sizeId: selectedSizeId,
      sizeName,
      variantId: selectedVariant?.id,
    });

    setVariantError('');
  };

  const handleToggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط!');
    } catch (error) {
      console.error('فشل في نسخ الرابط:', error);
      alert('حدث خطأ في نسخ الرابط. يرجى نسخ الرابط يدوياً.');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('يجب تسجيل الدخول لكتابة تقييم');
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.fullName || 'مستخدم',
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      verifiedPurchase: true,
      createdAt: new Date().toISOString(),
      helpful: 0,
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, title: '', comment: '' });
    setShowReviewForm(false);
  };

  const renderStars = (rating: number, size = 'h-5 w-5') => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`${size} ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        ))}
      </div>
    );
  };

  const tabs = [
    { id: 'description', label: 'الوصف' },
    { id: 'specifications', label: 'المواصفات' },
    { id: 'reviews', label: `التقييمات (${reviews.length})` },
    { id: 'shipping', label: 'الشحن والإرجاع' },
  ];

  const getCurrentStock = () => {
    if (product.hasVariants) {
      return selectedVariant?.stock || 0;
    }
    return product.stock;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 space-x-reverse text-sm">
            <li><Link href="/" className="text-gray-500 hover:text-primary-600">الرئيسية</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/products" className="text-gray-500 hover:text-primary-600">المنتجات</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href={`/categories/${product.category.slug}`} className="text-gray-500 hover:text-primary-600">{product.category.nameAr}</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-800 font-medium">{product.nameAr}</li>
          </ol>
        </nav>

        {/* Product Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Media */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square overflow-hidden rounded-2xl bg-white cursor-pointer"
              onClick={() => setShowMediaModal(true)}
            >
              {mediaItems[selectedMedia]?.type === 'image' ? (
                <Image
                  src={mediaItems[selectedMedia]?.url || '/placeholder.jpg'}
                  alt={mediaItems[selectedMedia]?.alt || product.nameAr}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full">
                  <video
                    src={mediaItems[selectedMedia]?.url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    autoPlay
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="h-16 w-16 text-white opacity-80" />
                  </div>
                </div>
              )}
              {/* View Full Screen Icon */}
              <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                <Eye className="h-5 w-5" />
              </div>
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
            </motion.div>
            {/* Thumbnail Media */}
            {mediaItems.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {mediaItems.map((media: any, index: number) => (
                  <button
                    key={media.id}
                    onClick={() => setSelectedMedia(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors relative ${
                      selectedMedia === index ? 'border-primary-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {media.type === 'image' ? (
                      <Image
                        src={media.url}
                        alt={media.alt}
                        width={80}
                        height={80}
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
                          <Play className="h-4 w-4 text-white" />
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary-600 font-medium">{product.category.nameAr}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500">SKU: {selectedVariant ? selectedVariant.sku : product.sku}</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.nameAr}</h1>
              <div className="flex items-center gap-4 mb-6">
                {renderStars(product.rating)}
                <span className="text-gray-600">({product.reviewsCount} تقييم)</span>
                {product.bestSeller && (
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                    الأكثر مبيعاً
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-bold text-primary-600">
                  {product.salePrice || product.price} ريال
                </div>
                {product.salePrice && (
                  <div className="text-2xl text-gray-400 line-through">
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

              {/* Color Selection */}
              {product.hasVariants && product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary-600" />
                    اللون:
                    {selectedColorId && (
                      <span className="font-normal text-gray-600">
                        {product.colorsOptions.find((c: any) => c.id === selectedColorId)?.nameAr}
                      </span>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((colorId: string) => {
                      const color = product.colorsOptions.find((c: any) => c.id === colorId);
                      if (!color) return null;
                      return (
                        <button
                          key={colorId}
                          onClick={() => setSelectedColorId(colorId)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            selectedColorId === colorId 
                              ? 'ring-2 ring-primary-500 ring-offset-2' 
                              : 'ring-1 ring-gray-300 hover:ring-gray-400'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.nameAr}
                        >
                          {selectedColorId === colorId && (
                            <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                              <div className="w-4 h-4 rounded-full bg-white"></div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.hasVariants && product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-primary-600" />
                    الحجم:
                    {selectedSizeId && (
                      <span className="font-normal text-gray-600">
                        {product.sizesOptions.find((s: any) => s.id === selectedSizeId)?.nameAr}
                      </span>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((sizeId: string) => {
                      const size = product.sizesOptions.find((s: any) => s.id === sizeId);
                      if (!size) return null;
                      const isAvailable = !selectedColorId || product.variants.some((v: any) => 
                        v.sizeId === sizeId && 
                        v.colorId === selectedColorId && 
                        v.stock > 0
                      );
                      return (
                        <button
                          key={sizeId}
                          onClick={() => setSelectedSizeId(sizeId)}
                          disabled={!isAvailable}
                          className={`px-4 py-2 rounded-lg border transition-all ${
                            selectedSizeId === sizeId 
                              ? 'border-primary-500 bg-primary-50 text-primary-600' 
                              : isAvailable
                                ? 'border-gray-300 hover:border-gray-400 text-gray-700'
                                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {size.nameAr}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-6">
                {product.hasVariants ? (
                  selectedVariant && selectedVariant.stock > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 font-medium">متوفر في المخزون</span>
                      {selectedVariant.stock < 10 && (
                        <span className="text-orange-500 text-sm">
                          (متبقي {selectedVariant.stock} قطع فقط)
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-600 font-medium">
                        {!selectedVariant ? 'الرجاء اختيار المتغيرات' : 'نفد من المخزون'}
                      </span>
                    </div>
                  )
                ) : product.stock > 0 ? (
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

              {/* Variant Error */}
              {variantError && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {variantError}
                </div>
              )}

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
                      onClick={() => setQuantity(Math.min(getCurrentStock(), quantity + 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity >= getCurrentStock()}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={product.hasVariants ? !selectedVariant || selectedVariant.stock === 0 : product.stock === 0}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                      (product.hasVariants ? !selectedVariant || selectedVariant.stock === 0 : product.stock === 0)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'btn-primary'
                    }`}
                    whileHover={(product.hasVariants ? selectedVariant && selectedVariant.stock > 0 : product.stock > 0) ? { scale: 1.02 } : {}}
                    whileTap={(product.hasVariants ? selectedVariant && selectedVariant.stock > 0 : product.stock > 0) ? { scale: 0.98 } : {}}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {(product.hasVariants ? !selectedVariant || selectedVariant.stock === 0 : product.stock === 0) ? 'نفد المخزون' : 'أضف للسلة'}
                  </motion.button>
                  <motion.button
                    onClick={handleToggleWishlist}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      isInWishlist(product.id)
                        ? 'border-primary-500 bg-primary-50 text-primary-600'
                        : 'border-gray-300 hover:border-primary-300 text-gray-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className={`h-6 w-6 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </motion.button>
                  <motion.button
                    onClick={handleShare}
                    className="p-4 rounded-xl border-2 border-gray-300 hover:border-primary-300 text-gray-600 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 className="h-6 w-6" />
                  </motion.button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <Truck className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800">شحن سريع</p>
                  <p className="text-xs text-gray-500">25 ريال</p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800">ضمان الجودة</p>
                  <p className="text-xs text-gray-500">منتج أصلي</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800">إرجاع مجاني</p>
                  <p className="text-xs text-gray-500">30 يوم</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-semibold transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose prose-lg max-w-none text-right">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">وصف المنتج</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {product.detailedDescriptionAr || product.descriptionAr}
                </p>
                {product.tags && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">العلامات:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tagsAr?.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">المواصفات</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-800">الفئة:</span>
                      <span className="text-gray-600">{product.category.nameAr}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-800">رقم المنتج:</span>
                      <span className="text-gray-600">{product.sku}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-800">التقييم:</span>
                      <span className="text-gray-600">{product.rating}/5</span>
                    </div>
                    {product.hasVariants && (
                      <>
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-medium text-gray-800">الألوان المتاحة:</span>
                          <span className="text-gray-600">
                            {product.colors?.length > 0 
                              ? product.colors.map((colorId: string) => 
                                  product.colorsOptions.find((c: any) => c.id === colorId)?.nameAr
                                ).join('، ')
                              : 'لا يوجد'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-medium text-gray-800">الأحجام المتاحة:</span>
                          <span className="text-gray-600">
                            {product.sizes?.length > 0 
                              ? product.sizes.map((sizeId: string) => 
                                  product.sizesOptions.find((s: any) => s.id === sizeId)?.nameAr
                                ).join('، ')
                              : 'لا يوجد'
                            }
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-800">المخزون:</span>
                      <span className="text-gray-600">{product.stock} قطعة</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-800">الوزن:</span>
                      <span className="text-gray-600">{product.weight || 'غير محدد'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-800">التقييمات والمراجعات</h3>
                  {user && (
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="btn-primary flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      اكتب تقييم
                    </button>
                  )}
                </div>
                {/* Review Form */}
                {showReviewForm && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 rounded-lg p-6 mb-8"
                  >
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">اكتب تقييمك</h4>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">التقييم:</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className="text-2xl transition-colors"
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  star <= newReview.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">عنوان التقييم:</label>
                        <input
                          type="text"
                          value={newReview.title}
                          onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                          className="input-field text-right"
                          placeholder="اكتب عنوان للتقييم"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">التعليق:</label>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          rows={4}
                          className="input-field text-right resize-none"
                          placeholder="شاركنا رأيك في المنتج..."
                          required
                        />
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" className="btn-primary">
                          نشر التقييم
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="btn-outline"
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="font-semibold text-gray-800">{review.userName}</h5>
                            {review.verifiedPurchase && (
                              <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-medium">
                                مشتري موثق
                              </span>
                            )}
                          </div>
                          {renderStars(review.rating, 'h-4 w-4')}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                      <h6 className="font-semibold text-gray-800 mb-2">{review.title}</h6>
                      <p className="text-gray-600 leading-relaxed mb-3">{review.comment}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <button className="text-gray-500 hover:text-primary-600 transition-colors">
                          مفيد ({review.helpful})
                        </button>
                        <button className="text-gray-500 hover:text-primary-600 transition-colors">
                          رد
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {!user && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-4">يجب تسجيل الدخول لكتابة تقييم</p>
                    <Link href="/auth/login" className="btn-primary">
                      تسجيل الدخول
                    </Link>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'shipping' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">الشحن والإرجاع</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">معلومات الشحن</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• تكلفة الشحن: 25 ريال لجميع مناطق المملكة</li>
                      <li>• التوصيل حسب المنطقة (1-5 أيام عمل)</li>
                      <li>• التوصيل لجميع مناطق المملكة</li>
                      <li>• تتبع مجاني للشحنة</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">سياسة الإرجاع</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• إرجاع مجاني خلال 30 يوم</li>
                      <li>• المنتج يجب أن يكون في حالته الأصلية</li>
                      <li>• نتحمل تكلفة الإرجاع في حالة العيب</li>
                      <li>• استرداد المبلغ خلال 7-14 يوم عمل</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setShowMediaModal(false)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            <button
              onClick={() => setShowMediaModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>
            {mediaItems[selectedMedia]?.type === 'image' ? (
              <Image
                src={mediaItems[selectedMedia]?.url || '/placeholder.jpg'}
                alt={mediaItems[selectedMedia]?.alt || product.nameAr}
                width={800}
                height={800}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <video
                src={mediaItems[selectedMedia]?.url}
                className="max-w-full max-h-full object-contain"
                controls
                autoPlay
                onClick={(e) => e.stopPropagation()}
              />
            )}
            {/* Navigation */}
            {mediaItems.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {mediaItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMedia(index);
                    }}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      selectedMedia === index ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
      <Cart />
      <Chat />
    </div>
  );
}
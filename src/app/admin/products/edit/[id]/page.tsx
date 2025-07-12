'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MediaUpload, { MediaItem } from '@/components/MediaUpload';
import { useAuth } from '@/hooks/useAuth';
import { useAdminProducts } from '@/hooks/useAdminProducts'; 
import { useCategories } from '@/hooks/useCategories';

const generateSlug = (text: string) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .trim();
};

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { product, fetchProductById, updateProduct, loading: isSubmitting, error: apiError } = useAdminProducts();
  const { categories, fetchCategories, loading: categoriesLoading } = useCategories();

  const initialFormData = useMemo(() => ({
    nameAr: '',
    name: '',
    slug: '',
    descriptionAr: '',
    price: '',
    salePrice: '',
    sku: '',
    stock: '',
    categoryId: '',
    featured: false,
  }), []);

  const [formData, setFormData] = useState(initialFormData);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadTimeout, setLoadTimeout] = useState(false);

  const loadData = useCallback(async () => {
    if (!user || !profile?.isAdmin) return;
    try {
      await Promise.all([
        fetchCategories(),
        fetchProductById(params.id)
      ]);
    } catch (err) {
      setError('Failed to load product data');
      console.error('Error loading product:', err);
    }
  }, [user, profile?.isAdmin, params.id, fetchCategories, fetchProductById]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadTimeout(true);
    }, 10000); // 10 second timeout

    loadData();

    return () => clearTimeout(timer);
  }, [loadData]);

  useEffect(() => {
    if (product) {
      setFormData({
        nameAr: product.nameAr || '',
        name: product.name || '',
        slug: product.slug || '',
        descriptionAr: product.descriptionAr || '',
        price: product.price?.toString() || '',
        salePrice: product.salePrice?.toString() || '',
        sku: product.sku || '',
        stock: product.stock?.toString() || '',
        categoryId: product.categoryId || '',
        featured: product.featured || false,
      });

      const mediaItems: MediaItem[] = product.images?.map((img: any) => ({
        id: img.imageUrl,
        url: img.imageUrl,
        type: img.imageUrl.match(/\.(jpeg|jpg|gif|png)$/) ? 'image' : 'file',
        name: img.imageUrl.split('/').pop() || 'Existing Image',
        file: new File([], '')
      })) || [];
      
      setMedia(mediaItems);
    }
  }, [product]);

  const validateForm = useCallback(() => {
    if (!formData.nameAr.trim() || !formData.name.trim()) {
      setError('يجب إدخال اسم المنتج باللغتين');
      return false;
    }
    if (!formData.categoryId) {
      setError('يجب اختيار فئة للمنتج');
      return false;
    }
    if (isNaN(parseFloat(formData.price))) {
      setError('السعر يجب أن يكون رقمًا');
      return false;
    }
    if (formData.salePrice && isNaN(parseFloat(formData.salePrice))) {
      setError('سعر التخفيض يجب أن يكون رقمًا');
      return false;
    }
    setError(null);
    return true;
  }, [formData]);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'name') updated.slug = generateSlug(value);
      return updated;
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !validateForm()) return;

    try {
      const updatedData = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stock: parseInt(formData.stock) || 0,
        images: media.map(item => ({ imageUrl: item.url })),
      };

      await updateProduct(product.id, updatedData);
      alert('✅ تم تحديث المنتج بنجاح!');
      router.push('/admin/products');
    } catch (err) {
      console.error('Update failed:', err);
      setError(`❌ فشل في تحديث المنتج: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [formData, product, updateProduct, router, media, validateForm]);

  const isAdmin = useMemo(() => user && profile?.isAdmin, [user, profile]);
  const isLoading = useMemo(() => 
    isSubmitting || !product || categoriesLoading, 
    [isSubmitting, product, categoriesLoading]
  );

  if (!isAdmin) {
    return (
      <div className="p-10 text-center text-red-600 font-semibold">
        غير مصرح لك بالدخول.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>جاري تحميل المنتج...</p>
        <div className="mt-4 w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        {loadTimeout && (
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            إعادة المحاولة
          </button>
        )}
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-600 font-semibold text-center">
          خطأ في تحميل المنتج: {apiError}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const categoryOptions = useMemo(() => (
    categories.map((cat) => (
      <option key={cat.id} value={cat.id}>
        {cat.nameAr}
      </option>
    ))
  ), [categories]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">تعديل المنتج: {formData.nameAr}</h1>
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <ArrowLeft /> العودة
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-white rounded-lg shadow p-8"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Package /> المعلومات الأساسية
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2">اسم المنتج (عربي) *</label>
                    <input 
                      type="text" 
                      name="nameAr" 
                      value={formData.nameAr} 
                      onChange={handleChange} 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block mb-2">اسم المنتج (إنجليزي) *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      required 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-2">الوصف (عربي)</label>
                    <textarea
                      name="descriptionAr"
                      value={formData.descriptionAr}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-2">الرابط (slug)</label>
                    <input 
                      type="text" 
                      name="slug" 
                      value={formData.slug} 
                      className="w-full p-3 border rounded-lg bg-gray-100" 
                      readOnly 
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }} 
                className="bg-white rounded-lg shadow p-8"
              >
                <h2 className="text-2xl font-bold mb-6">الوسائط</h2>
                <MediaUpload 
                  media={media} 
                  setMedia={setMedia} 
                  maxFiles={5}
                />
              </motion.div>
            </div>

            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }} 
                className="bg-white rounded-lg shadow p-6"
              >
                <h3 className="text-xl font-bold mb-4">التسعير والمخزون</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">السعر *</label>
                    <input 
                      type="number" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleChange} 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">سعر التخفيض</label>
                    <input 
                      type="number" 
                      name="salePrice" 
                      value={formData.salePrice} 
                      onChange={handleChange} 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">رقم SKU</label>
                    <input 
                      type="text" 
                      name="sku" 
                      value={formData.sku} 
                      onChange={handleChange} 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block mb-2">الكمية في المخزون</label>
                    <input 
                      type="number" 
                      name="stock" 
                      value={formData.stock} 
                      onChange={handleChange} 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      min="0"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }} 
                className="bg-white rounded-lg shadow p-6"
              >
                <h3 className="text-xl font-bold mb-4">الفئة والحالة</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">الفئة *</label>
                    <select 
                      name="categoryId" 
                      value={formData.categoryId} 
                      onChange={handleChange} 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      required
                    >
                      <option value="">اختر الفئة</option>
                      {categoryOptions}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      id="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="featured" className="mr-2 block">
                      منتج مميز
                    </label>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }} 
                className="bg-white rounded-lg shadow p-6"
              >
                <h3 className="text-xl font-bold mb-4">الإجراءات</h3>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Save size={18} /> حفظ التغييرات
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
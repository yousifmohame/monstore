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
  return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').trim();
};

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { product, fetchProductById, updateProduct, loading: isSubmitting, error: apiError } = useAdminProducts();
  const { categories, fetchCategories, loading: categoriesLoading } = useCategories();

  const initialFormData = useMemo(() => ({
    nameAr: '', name: '', slug: '', descriptionAr: '',
    price: '', salePrice: '', sku: '', stock: '', categoryId: '', featured: false
  }), []);

  const [formData, setFormData] = useState(initialFormData);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadTimeout, setLoadTimeout] = useState(false);

  const loadData = useCallback(async () => {
    if (!user || !profile?.isAdmin) return;
    try {
      await Promise.all([fetchCategories(), fetchProductById(params.id)]);
    } catch (err) {
      setError('Failed to load product data');
      console.error('Error loading product:', err);
    }
  }, [user, profile?.isAdmin, params.id, fetchCategories, fetchProductById]);

  useEffect(() => {
    const timer = setTimeout(() => setLoadTimeout(true), 10000);
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

      const mediaItems: MediaItem[] = product.images?.map((img, index) => ({
        id: `${img.imageUrl}-${index}`,
        url: img.imageUrl,
        type: img.imageUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? 'image' : 'video',
        name: img.altText || `صورة ${index + 1}`,
        file: new File([], img.imageUrl) // placeholder, not for upload again
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

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        nameAr: formData.nameAr,
        name: formData.name,
        slug: formData.slug,
        descriptionAr: formData.descriptionAr,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        sku: formData.sku,
        stock: parseInt(formData.stock) || 0,
        categoryId: formData.categoryId,
        featured: formData.featured,
        images: media.map((item, index) => ({
          imageUrl: item.url,
          altText: item.name || 'صورة منتج',
          sortOrder: index,
          isPrimary: index === 0
        }))
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
  const isLoading = useMemo(() => isSubmitting || !product || categoriesLoading, [isSubmitting, product, categoriesLoading]);

  if (!isAdmin) return <div className="p-10 text-center text-red-600 font-semibold">غير مصرح لك بالدخول.</div>;
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  if (apiError) return <div className="p-6 text-red-600">خطأ في التحميل: {apiError}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">تعديل المنتج: {formData.nameAr}</h1>
          <button onClick={() => router.back()} className="text-blue-600 hover:underline flex items-center gap-2">
            <ArrowLeft /> العودة
          </button>
        </div>
        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-4"><Package /> المعلومات الأساسية</h2>
              <input name="nameAr" value={formData.nameAr} onChange={handleChange} placeholder="اسم المنتج (عربي)" className="input-field" required />
              <input name="name" value={formData.name} onChange={handleChange} placeholder="اسم المنتج (إنجليزي)" className="input-field" required />
              <textarea name="descriptionAr" value={formData.descriptionAr} onChange={handleChange} placeholder="الوصف (عربي)" className="input-field" />
              <input name="slug" value={formData.slug} readOnly className="input-field bg-gray-100" />
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-4">الوسائط</h2>
              <MediaUpload media={media} onMediaChange={setMedia} />
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow">
              <label>السعر *</label>
              <input name="price" type="number" value={formData.price} onChange={handleChange} className="input-field" required />
              <label>سعر التخفيض</label>
              <input name="salePrice" type="number" value={formData.salePrice} onChange={handleChange} className="input-field" />
              <label>الكمية</label>
              <input name="stock" type="number" value={formData.stock} onChange={handleChange} className="input-field" />
              <label>SKU</label>
              <input name="sku" value={formData.sku} onChange={handleChange} className="input-field" />
            </div>
            <div className="bg-white p-6 rounded shadow">
              <label>الفئة *</label>
              <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="input-field" required>
                <option value="">اختر فئة</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nameAr}</option>)}
              </select>
              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                <label>منتج مميز</label>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full flex justify-center items-center gap-2" disabled={isSubmitting}>
              {isSubmitting ? '...جاري الحفظ' : <><Save size={18} /> حفظ التغييرات</>}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

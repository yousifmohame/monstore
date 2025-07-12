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

  const [formData, setFormData] = useState({
    nameAr: '', name: '', slug: '', descriptionAr: '', price: '', salePrice: '', sku: '', stock: '', categoryId: '', featured: false
  });
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user || !profile?.isAdmin) return;
    try {
      await Promise.all([fetchCategories(), fetchProductById(params.id)]);
    } catch (err) {
      setError('Failed to load product data');
    }
  }, [user, profile, fetchCategories, fetchProductById, params.id]);

  useEffect(() => { loadData(); }, [loadData]);

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

      const mediaItems: MediaItem[] = (product.images || []).map((img: any) => ({
        id: img.imageUrl,
        url: img.imageUrl,
        type: img.imageUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? 'image' : 'video',
        name: img.imageUrl.split('/').pop() || 'صورة موجودة'
      }));
      setMedia(mediaItems);
    }
  }, [product]);

  const validateForm = () => {
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'name') updated.slug = generateSlug(value);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        images: media.map(item => ({ imageUrl: item.url })),
      };

      await updateProduct(product.id, updatedData);
      alert('✅ تم تحديث المنتج بنجاح!');
      router.push('/admin/products');
    } catch (err) {
      setError(`❌ فشل في تحديث المنتج`);
    }
  };

  if (!user || !profile?.isAdmin) return <div className="p-10 text-center text-red-600 font-semibold">غير مصرح لك بالدخول.</div>;
  if (!product || categoriesLoading) return <div className="p-10 text-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">تعديل المنتج: {formData.nameAr}</h1>
          <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 hover:underline">
            <ArrowLeft /> العودة
          </button>
        </div>

        {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Package /> المعلومات الأساسية
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" name="nameAr" value={formData.nameAr} onChange={handleChange} placeholder="اسم المنتج (عربي)" required className="input-field" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="اسم المنتج (إنجليزي)" required className="input-field" />
                  <textarea name="descriptionAr" value={formData.descriptionAr} onChange={handleChange} rows={3} placeholder="الوصف (عربي)" className="input-field md:col-span-2" />
                  <input type="text" name="slug" value={formData.slug} className="input-field md:col-span-2 bg-gray-100" readOnly />
                </div>
              </motion.div>
              <motion.div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-6">الوسائط</h2>
                <MediaUpload media={media} onMediaChange={setMedia} maxItems={5} />
              </motion.div>
            </div>
            <div className="space-y-8">
              <motion.div className="bg-white rounded-lg shadow p-6">
                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="السعر" required className="input-field" />
                <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} placeholder="سعر التخفيض" className="input-field" />
                <input type="text" name="sku" value={formData.sku} onChange={handleChange} placeholder="SKU" className="input-field" />
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="المخزون" className="input-field" />
              </motion.div>
              <motion.div className="bg-white rounded-lg shadow p-6">
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} required className="input-field">
                  <option value="">اختر الفئة</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.nameAr}</option>)}
                </select>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                  منتج مميز
                </label>
              </motion.div>
              <motion.div className="bg-white rounded-lg shadow p-6">
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
                  {isSubmitting ? <span className="loading-spinner-sm"></span> : <><Save size={18} /> حفظ التغييرات</>}
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

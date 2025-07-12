'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Package, DollarSign, Tag, FileText, Palette, Ruler } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MediaUpload, { MediaItem } from '@/components/MediaUpload';
import { useAuth } from '@/hooks/useAuth';
import { useAdminProducts } from '@/hooks/useAdminProducts';
import { useCategories, Category } from '@/hooks/useCategories';
import { colorOptions, sizeOptions } from '@/lib/mockData';
// 1. استيراد واجهات الأنواع من مكان واحد فقط
import { Product, ProductImage } from '@/hooks/useProducts';

interface Variant {
  colorId: string | null;
  sizeId: string | null;
  stock: number;
  sku: string;
}

const generateSlug = (text: string) => {
  return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

export default function AddProductPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { addProduct, loading: isSubmitting } = useAdminProducts();
  const { categories, fetchCategories } = useCategories();

  const [formData, setFormData] = useState({
    nameAr: '', name: '', slug: '', descriptionAr: '',
    description: '', detailedDescriptionAr: '', detailedDescription: '',
    price: '', salePrice: '', sku: '', stock: '', categoryId: '',
    tags: '', tagsAr: '', featured: false, newArrival: false,
    bestSeller: false, onSale: false, weight: '', hasVariants: false,
  });
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  
  useEffect(() => {
    if (user && profile?.isAdmin) {
      fetchCategories();
    }
  }, [user, profile, fetchCategories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => {
      const newState = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'name') newState.slug = generateSlug(value);
      return newState;
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (media.length === 0) {
      alert('يجب إضافة صورة واحدة على الأقل للمنتج.');
      return;
    }
    if (!formData.categoryId) {
      alert('يجب اختيار فئة للمنتج.');
      return;
    }

    try {
      // 2. **الإصلاح الرئيسي: إضافة الحقول المطلوبة وتصحيح الأنواع**
      const productData: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
        nameAr: formData.nameAr,
        name: formData.name,
        slug: formData.slug,
        descriptionAr: formData.descriptionAr,
        description: formData.description,
        detailedDescriptionAr: formData.detailedDescriptionAr,
        detailedDescription: formData.detailedDescription,
        price: parseFloat(formData.price) || 0,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        sku: formData.sku,
        stock: variants.reduce((total, v) => total + v.stock, parseInt(formData.stock) || 0),
        categoryId: formData.categoryId,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        tagsAr: formData.tagsAr.split(',').map(tag => tag.trim()).filter(Boolean),
        featured: formData.featured,
        newArrival: formData.newArrival,
        bestSeller: formData.bestSeller,
        onSale: formData.onSale,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        colors: selectedColors,
        sizes: selectedSizes,
        variants: formData.hasVariants ? variants : [],
        images: [] as ProductImage[], // سيتم ملؤها بواسطة دالة الـ backend
        hasVariants: formData.hasVariants,
        // إضافة القيم الافتراضية للحقول الإلزامية
        rating: 0,
        reviewsCount: 0,
        isActive: true,
      };

      // 3. **الإصلاح الرئيسي: تصفية القيم غير المعرفة من مصفوفة الملفات**
      const filesToUpload = media
        .map(item => item.file)
        .filter((file): file is File => Boolean(file) && file.size > 0);

      await addProduct(productData, filesToUpload);

      alert('تم إضافة المنتج بنجاح!');
      router.push('/admin/products');
    } catch (error) {
      console.error("Failed to add product:", error);
      alert('حدث خطأ أثناء إضافة المنتج.');
    }
  };

  const getTotalStock = () => variants.reduce((total, variant) => total + variant.stock, parseInt(formData.stock) || 0);
  const handleColorToggle = (colorId: string) => setSelectedColors(p => p.includes(colorId) ? p.filter(id => id !== colorId) : [...p, colorId]);
  const handleSizeToggle = (sizeId: string) => setSelectedSizes(p => p.includes(sizeId) ? p.filter(id => id !== sizeId) : [...p, sizeId]);
  
  if (!user || !profile?.isAdmin) {
    return <div>غير مصرح لك بالدخول.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-3xl font-bold text-gray-800">إضافة منتج جديد</h1></div>
          <button onClick={() => router.back()} className="flex items-center gap-2"><ArrowLeft /> العودة</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="anime-card p-8"><h2 className="text-2xl font-bold mb-6"><Package /> المعلومات الأساسية</h2><div className="grid md:grid-cols-2 gap-6"><div><label className="block mb-2">اسم المنتج (عربي) *</label><input type="text" name="nameAr" value={formData.nameAr} onChange={handleChange} className="input-field" required /></div><div><label className="block mb-2">اسم المنتج (إنجليزي) *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" required /></div><div className="md:col-span-2"><label className="block mb-2">الرابط (slug)</label><input type="text" name="slug" value={formData.slug} className="input-field bg-gray-100" readOnly /></div></div></div>
              <div className="anime-card p-8"><h2 className="text-2xl font-bold mb-6"><FileText /> صور المنتج</h2><MediaUpload media={media} onMediaChange={setMedia} /></div>
            </div>
            <div className="space-y-8">
              <div className="anime-card p-6"><h3 className="text-xl font-bold mb-4">الفئة والحالة</h3><div><label className="block mb-2">الفئة *</label><select name="categoryId" value={formData.categoryId} onChange={handleChange} className="input-field" required><option value="">اختر الفئة</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.nameAr}</option>)}</select></div></div>
              <div className="anime-card p-6"><h3 className="text-xl font-bold mb-4">الإجراءات</h3><button type="submit" disabled={isSubmitting} className="w-full btn-primary flex items-center justify-center gap-2 py-3">{isSubmitting ? <div className="loading-spinner-sm"></div> : <><Save />حفظ المنتج</>}</button></div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

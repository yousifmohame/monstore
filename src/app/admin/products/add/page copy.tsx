'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Package, DollarSign, Tag, FileText, Palette, Ruler } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// 1. استيراد المكونات والأدوات اللازمة
import MediaUpload, { MediaItem } from '@/components/MediaUpload';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts'; // <-- استيراد مهم
import { mockCategories, colorOptions, sizeOptions } from '@/lib/mockData';

interface Variant {
  colorId: string | null;
  sizeId: string | null;
  stock: number;
  sku: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  // 2. استخدام الـ Hook الخاص بالمنتجات
  const { addProduct, loading: isSubmitting } = useProducts();
  
  const [formData, setFormData] = useState({
    nameAr: '',
    name: '',
    descriptionAr: '',
    description: '',
    detailedDescriptionAr: '',
    detailedDescription: '',
    price: '',
    salePrice: '',
    sku: '',
    stock: '',
    categoryId: '',
    tags: '',
    tagsAr: '',
    featured: false,
    newArrival: false,
    bestSeller: false,
    onSale: false,
    weight: '',
    hasVariants: false,
  });
  // 3. تحديث حالة الوسائط لتتوافق مع الواجهة الجديدة
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [showVariantsTable, setShowVariantsTable] = useState(false);

  if (!user || !profile?.isAdmin) {
    // ... (الكود الخاص بالتحقق من صلاحيات المدير يبقى كما هو)
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

  // 4. تحديث دالة الحفظ لاستدعاء الـ Backend الفعلي
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (media.length === 0) {
      alert('يجب إضافة صورة واحدة على الأقل للمنتج.');
      return;
    }

    try {
      // لا نحتاج لـ setIsSubmitting(true) لأنها تدار بواسطة useProducts hook
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stock: getTotalStock(),
        weight: formData.weight ? parseFloat(formData.weight) : null,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        tagsAr: formData.tagsAr.split(',').map(tag => tag.trim()).filter(Boolean),
        images: [], // سيتم ملؤها بواسطة دالة الـ backend
        colors: selectedColors,
        sizes: selectedSizes,
        variants: formData.hasVariants ? variants : [],
        // Add default values for non-form fields
        rating: 0,
        reviewsCount: 0,
        isActive: true,
      };

      // استخراج كائنات الملفات الفعلية للرفع
      const filesToUpload = media.map(item => item.file);

      // استدعاء دالة الـ Hook لإضافة المنتج
      await addProduct(productData as any, filesToUpload);

      alert('تم إضافة المنتج بنجاح!');
      router.push('/admin/products');
    } catch (error) {
      console.error("Failed to add product:", error);
      alert('حدث خطأ أثناء إضافة المنتج. يرجى مراجعة الكونسول.');
    }
  };

  // ... (بقية الدوال المساعدة مثل handleChange و generateVariants تبقى كما هي) ...

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      
      if (name === 'hasVariants') {
        setFormData(prev => ({ ...prev, [name]: checked }));
        // Reset variants if hasVariants is unchecked
        if (!checked) {
          setSelectedColors([]);
          setSelectedSizes([]);
          setVariants([]);
          setShowVariantsTable(false);
        }
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleColorToggle = (colorId: string) => {
    setSelectedColors(prev => {
      if (prev.includes(colorId)) {
        return prev.filter(id => id !== colorId);
      } else {
        return [...prev, colorId];
      }
    });
  };

  const handleSizeToggle = (sizeId: string) => {
    setSelectedSizes(prev => {
      if (prev.includes(sizeId)) {
        return prev.filter(id => id !== sizeId);
      } else {
        return [...prev, sizeId];
      }
    });
  };

  const generateVariants = () => {
    if (!formData.hasVariants) return;

    const newVariants: Variant[] = [];
    const baseSkuCode = formData.sku || 'PROD';

    // If no colors or sizes selected, create a default variant
    if (selectedColors.length === 0 && selectedSizes.length === 0) {
      newVariants.push({
        colorId: null,
        sizeId: null,
        stock: parseInt(formData.stock) || 0,
        sku: baseSkuCode
      });
    }
    // If only colors selected
    else if (selectedColors.length > 0 && selectedSizes.length === 0) {
      selectedColors.forEach(colorId => {
        const color = colorOptions.find(c => c.id === colorId);
        const colorCode = color?.name.substring(0, 3).toUpperCase() || 'XXX';
        
        newVariants.push({
          colorId,
          sizeId: null,
          stock: 0,
          sku: `${baseSkuCode}-${colorCode}`
        });
      });
    }
    // If only sizes selected
    else if (selectedColors.length === 0 && selectedSizes.length > 0) {
      selectedSizes.forEach(sizeId => {
        const size = sizeOptions.find(s => s.id === sizeId);
        
        newVariants.push({
          colorId: null,
          sizeId,
          stock: 0,
          sku: `${baseSkuCode}-${size?.value}`
        });
      });
    }
    // If both colors and sizes selected
    else {
      selectedColors.forEach(colorId => {
        const color = colorOptions.find(c => c.id === colorId);
        const colorCode = color?.name.substring(0, 3).toUpperCase() || 'XXX';
        
        selectedSizes.forEach(sizeId => {
          const size = sizeOptions.find(s => s.id === sizeId);
          
          newVariants.push({
            colorId,
            sizeId,
            stock: 0,
            sku: `${baseSkuCode}-${colorCode}-${size?.value}`
          });
        });
      });
    }

    setVariants(newVariants);
    setShowVariantsTable(true);
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: field === 'stock' ? parseInt(value) || 0 : value
    };
    setVariants(updatedVariants);
  };

  const getTotalStock = () => {
    if (!formData.hasVariants || variants.length === 0) {
      return parseInt(formData.stock) || 0;
    }
    return variants.reduce((total, variant) => total + variant.stock, 0);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container-custom py-8">
        {/* ... (واجهة المستخدم JSX تبقى كما هي بدون تغيير) ... */}
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">إضافة منتج جديد</h1>
            <p className="text-gray-600">أضف منتج جديد إلى متجر كيوتاكو</p>
          </div>
          
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            العودة
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="anime-card p-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Package className="h-6 w-6 text-primary-600" />
                  المعلومات الأساسية
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      اسم المنتج (عربي) *
                    </label>
                    <input
                      type="text"
                      name="nameAr"
                      value={formData.nameAr}
                      onChange={handleChange}
                      className="input-field text-right"
                      placeholder="أدخل اسم المنتج بالعربية"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      اسم المنتج (إنجليزي) *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field text-left"
                      placeholder="Enter product name in English"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">
                      وصف مختصر (عربي) *
                    </label>
                    <textarea
                      name="descriptionAr"
                      value={formData.descriptionAr}
                      onChange={handleChange}
                      rows={3}
                      className="input-field text-right resize-none"
                      placeholder="وصف مختصر للمنتج بالعربية"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">
                      وصف مختصر (إنجليزي) *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="input-field text-left resize-none"
                      placeholder="Short description in English"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">
                      وصف تفصيلي (عربي)
                    </label>
                    <textarea
                      name="detailedDescriptionAr"
                      value={formData.detailedDescriptionAr}
                      onChange={handleChange}
                      rows={5}
                      className="input-field text-right resize-none"
                      placeholder="وصف تفصيلي للمنتج بالعربية"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">
                      وصف تفصيلي (إنجليزي)
                    </label>
                    <textarea
                      name="detailedDescription"
                      value={formData.detailedDescription}
                      onChange={handleChange}
                      rows={5}
                      className="input-field text-left resize-none"
                      placeholder="Detailed description in English"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Pricing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="anime-card p-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-primary-600" />
                  التسعير والمخزون
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      السعر الأساسي (ريال) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="input-field text-right"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      سعر التخفيض (ريال)
                    </label>
                    <input
                      type="number"
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="input-field text-right"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      رقم المنتج (SKU) *
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className="input-field text-left"
                      placeholder="PRD-001"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      الكمية في المخزون {formData.hasVariants && '(الإجمالي)'}
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.hasVariants ? getTotalStock() : formData.stock}
                      onChange={handleChange}
                      min="0"
                      className={`input-field text-right ${formData.hasVariants ? 'bg-gray-100' : ''}`}
                      placeholder="0"
                      required
                      disabled={formData.hasVariants}
                    />
                    {formData.hasVariants && (
                      <p className="text-xs text-gray-500 mt-1">
                        * سيتم حساب المخزون تلقائياً من مجموع المتغيرات
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      الوزن (كيلوغرام)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="input-field text-right"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Product Variants */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="anime-card p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Palette className="h-6 w-6 text-primary-600" />
                    متغيرات المنتج
                  </h2>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="hasVariants"
                      checked={formData.hasVariants}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">المنتج له متغيرات (ألوان/أحجام)</span>
                  </label>
                </div>
                
                {formData.hasVariants && (
                  <div className="space-y-6">
                    {/* Colors Selection */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Palette className="h-5 w-5 text-primary-600" />
                        الألوان المتاحة
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {colorOptions.map(color => (
                          <div 
                            key={color.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              selectedColors.includes(color.id) 
                                ? 'border-primary-500 bg-primary-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleColorToggle(color.id)}
                          >
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-6 h-6 rounded-full border border-gray-300" 
                                style={{ backgroundColor: color.value }}
                              ></div>
                              <span className="font-medium text-gray-800">{color.nameAr}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Sizes Selection */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Ruler className="h-5 w-5 text-primary-600" />
                        الأحجام المتاحة
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                        {sizeOptions.map(size => (
                          <div 
                            key={size.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              selectedSizes.includes(size.id) 
                                ? 'border-primary-500 bg-primary-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleSizeToggle(size.id)}
                          >
                            <div className="flex items-center justify-center">
                              <span className="font-medium text-gray-800">{size.nameAr}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Generate Variants Button */}
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={generateVariants}
                        className="btn-primary"
                      >
                        إنشاء المتغيرات
                      </button>
                    </div>
                    
                    {/* Variants Table */}
                    {showVariantsTable && variants.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          متغيرات المنتج ({variants.length})
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">اللون</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">الحجم</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">SKU</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">المخزون</th>
                              </tr>
                            </thead>
                            <tbody>
                              {variants.map((variant, index) => {
                                const color = colorOptions.find(c => c.id === variant.colorId);
                                const size = sizeOptions.find(s => s.id === variant.sizeId);
                                
                                return (
                                  <tr key={index} className="border-b border-gray-200">
                                    <td className="px-4 py-3">
                                      {variant.colorId ? (
                                        <div className="flex items-center gap-2">
                                          <div 
                                            className="w-5 h-5 rounded-full border border-gray-300" 
                                            style={{ backgroundColor: color?.value }}
                                          ></div>
                                          <span>{color?.nameAr}</span>
                                        </div>
                                      ) : (
                                        <span className="text-gray-500">-</span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3">
                                      {variant.sizeId ? size?.nameAr : <span className="text-gray-500">-</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                      <input
                                        type="text"
                                        value={variant.sku}
                                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                                        className="input-field text-left py-1 px-2 text-sm"
                                      />
                                    </td>
                                    <td className="px-4 py-3">
                                      <input
                                        type="number"
                                        value={variant.stock}
                                        onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                        min="0"
                                        className="input-field text-right py-1 px-2 text-sm w-24"
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot className="bg-gray-50">
                              <tr>
                                <td colSpan={3} className="px-4 py-3 text-right font-semibold">
                                  إجمالي المخزون:
                                </td>
                                <td className="px-4 py-3 font-bold text-primary-600">
                                  {getTotalStock()}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="anime-card p-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Tag className="h-6 w-6 text-primary-600" />
                  العلامات والكلمات المفتاحية
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      العلامات (عربي)
                    </label>
                    <input
                      type="text"
                      name="tagsAr"
                      value={formData.tagsAr}
                      onChange={handleChange}
                      className="input-field text-right"
                      placeholder="ناروتو، أنمي، تيشيرت (افصل بفاصلة)"
                    />
                    <p className="text-sm text-gray-500 mt-1">افصل العلامات بفاصلة</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      العلامات (إنجليزي)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="input-field text-left"
                      placeholder="naruto, anime, tshirt (separate with comma)"
                    />
                    <p className="text-sm text-gray-500 mt-1">Separate tags with comma</p>
                  </div>
                </div>
              </motion.div>

              {/* Media Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="anime-card p-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary-600" />
                  صور وفيديوهات المنتج
                </h2>
                
                <MediaUpload
                  media={media}
                  onMediaChange={setMedia}
                  maxItems={10}
                  acceptVideo={true}
                />
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Category and Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="anime-card p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">الفئة والحالة</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      الفئة *
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="input-field text-right"
                      required
                    >
                      <option value="">اختر الفئة</option>
                      {mockCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.nameAr}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-700">منتج مميز</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="newArrival"
                        checked={formData.newArrival}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-700">وصل حديثاً</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="bestSeller"
                        checked={formData.bestSeller}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-700">الأكثر مبيعاً</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="onSale"
                        checked={formData.onSale}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-700">في التخفيضات</span>
                    </label>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="anime-card p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">الإجراءات</h3>
                
                <div className="space-y-3">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        حفظ المنتج
                      </>
                    )}
                  </motion.button>
                  
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full btn-outline py-3"
                  >
                    إلغاء
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
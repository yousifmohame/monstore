'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Eye, Edit, Trash2, Search, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
// 1. استيراد الـ Hooks الحقيقية
import { useAdminProducts } from '@/hooks/useAdminProducts';
import { useCategories, Category } from '@/hooks/useCategories';
import type { Product } from '@/hooks/useProducts';

export default function AdminProductsPage() {
  const { user, profile } = useAuth();
  // 2. استخدام Hooks لجلب البيانات والدوال
  const { products, loading: productsLoading, fetchProducts: fetchAdminProducts, deleteProduct, updateProduct } = useAdminProducts();
  const { categories, loading: categoriesLoading, fetchCategories } = useCategories();

  // States لإدارة الفلاتر والبحث
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'price-low' | 'price-high' | 'stock-low'>('newest');

  // 3. جلب البيانات عند تحميل المكون
  useEffect(() => {
    if (user && profile?.isAdmin) {
      fetchAdminProducts();
      fetchCategories();
    }
  }, [user, profile, fetchAdminProducts, fetchCategories]);

  // 4. تطبيق الفلاتر والفرز على البيانات الحقيقية
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
      
      let matchesStock = true;
      if (stockFilter === 'in-stock') matchesStock = product.stock > 10;
      else if (stockFilter === 'low-stock') matchesStock = product.stock > 0 && product.stock <= 10;
      else if (stockFilter === 'out-of-stock') matchesStock = product.stock === 0;
      
      return matchesSearch && matchesCategory && matchesStock;
    });

    switch (sortBy) {
      case 'name': return [...filtered].sort((a, b) => a.nameAr.localeCompare(b.nameAr));
      case 'price-low': return [...filtered].sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      case 'price-high': return [...filtered].sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      case 'stock-low': return [...filtered].sort((a, b) => a.stock - b.stock);
      default: return filtered; // الأحدث هو الترتيب الافتراضي من الـ backend
    }
  }, [products, searchQuery, selectedCategory, stockFilter, sortBy]);

  // 5. ربط دوال الحذف والتحديث بالـ API
  const handleDeleteProduct = async () => {
    if (showDeleteModal) {
      try {
        await deleteProduct(showDeleteModal);
        setShowDeleteModal(null);
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("فشل في حذف المنتج.");
      }
    }
  };

  const handleToggleFeatured = (product: Product) => {
    updateProduct(product.id, { featured: !product.featured });
  };

  const handleToggleBestSeller = (product: Product) => {
    updateProduct(product.id, { bestSeller: !product.bestSeller });
  };

  const isLoading = productsLoading || categoriesLoading;

  if (!user || !profile?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">غير مصرح</h1>
          <p className="text-gray-600 mb-8">ليس لديك صلاحية للوصول لهذه الصفحة</p>
          <a href="/" className="btn-primary">العودة للرئيسية</a>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20 text-center">
            <div className="loading-dots mb-4"><div></div><div></div><div></div><div></div></div>
            <p className="text-xl text-gray-600 font-medium">جاري تحميل المنتجات...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة المنتجات</h1>
            <p className="text-gray-600">إدارة وتحرير منتجات كيوتاكو</p>
          </div>
          <Link href="/admin/products/add">
            <motion.button className="btn-primary flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Plus className="h-5 w-5" /> إضافة منتج جديد
            </motion.button>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="text" placeholder="البحث في المنتجات..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-right" />
              </div>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                <option value="">جميع الفئات</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.nameAr}</option>)}
              </select>
              <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value as any)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                <option value="all">جميع المخزون</option>
                <option value="in-stock">متوفر (أكثر من 10)</option>
                <option value="low-stock">مخزون منخفض (1-10)</option>
                <option value="out-of-stock">نفد من المخزون (0)</option>
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                <option value="newest">الأحدث</option>
                <option value="name">الاسم</option>
                <option value="price-low">السعر: من الأقل</option>
                <option value="price-high">السعر: من الأعلى</option>
                <option value="stock-low">المخزون: من الأقل</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-4 font-semibold text-gray-500">المنتج</th>
                        <th className="p-4 font-semibold text-gray-500">SKU</th>
                        <th className="p-4 font-semibold text-gray-500">السعر</th>
                        <th className="p-4 font-semibold text-gray-500">المخزون</th>
                        <th className="p-4 font-semibold text-gray-500">الحالة</th>
                        <th className="p-4 font-semibold text-gray-500">إجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAndSortedProducts.map((product) => (
                        <tr key={product.id} className="border-t hover:bg-gray-50">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <Image src={product.images?.[0]?.imageUrl || '/placeholder.jpg'} alt={product.nameAr} width={60} height={60} className="w-16 h-16 object-cover rounded-lg" />
                                    <div>
                                        <p className="font-semibold text-gray-800">{product.nameAr}</p>
                                        <p className="text-sm text-gray-500">{categories.find(c => c.id === product.categoryId)?.nameAr || 'غير مصنف'}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4 text-gray-500">{product.sku}</td>
                            <td className="p-4 text-gray-800 font-medium">{product.salePrice || product.price} ريال</td>
                            <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${product.stock > 10 ? 'bg-green-100 text-green-600' : product.stock > 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>{product.stock}</span></td>
                            <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>{product.isActive ? 'نشط' : 'غير نشط'}</span></td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    <Link href={`/products/${product.slug}`}><button className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50"><Eye className="h-4 w-4" /></button></Link>
                                    <Link href={`/admin/products/edit/${product.id}`}><button className="p-2 text-gray-600 hover:text-green-600 rounded-full hover:bg-green-50"><Edit className="h-4 w-4" /></button></Link>
                                    <button onClick={() => setShowDeleteModal(product.id)} className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">تأكيد الحذف</h3>
              <p className="text-gray-600 mb-6">هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowDeleteModal(null)} className="btn-outline">إلغاء</button>
                <button onClick={handleDeleteProduct} className="btn-danger">حذف</button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

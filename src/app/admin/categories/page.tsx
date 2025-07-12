'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Edit, Trash2, Image as ImageIcon, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useAdminCategories } from '@/hooks/useAdminCategories';
import Image from 'next/image';

const generateSlug = (text: string) => text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

const CategoryModal = ({ category, onClose, onSave }: any) => {
  const [formData, setFormData] = useState({
    nameAr: category?.nameAr || '',
    name: category?.name || '',
    slug: category?.slug || '',
    descriptionAr: category?.descriptionAr || '',
    imageUrl: category?.imageUrl || '',
    sortOrder: category?.sortOrder || 0,
    isActive: category?.isActive !== undefined ? category.isActive : true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => {
      const newState = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'name') newState.slug = generateSlug(value);
      return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-8 max-w-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{category ? 'تعديل الفئة' : 'إضافة فئة جديدة'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="nameAr" value={formData.nameAr} onChange={handleChange} placeholder="الاسم بالعربية" className="input-field" required />
          <input name="name" value={formData.name} onChange={handleChange} placeholder="الاسم بالإنجليزية" className="input-field" required />
          <input name="slug" value={formData.slug} onChange={handleChange} placeholder="الرابط (slug)" className="input-field bg-gray-100" readOnly />
          <textarea name="descriptionAr" value={formData.descriptionAr} onChange={handleChange} placeholder="الوصف" className="input-field" />
          <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="رابط الصورة" className="input-field" />
          <input name="sortOrder" type="number" value={formData.sortOrder} onChange={handleChange} placeholder="ترتيب الفرز" className="input-field" />
          <label className="flex items-center gap-2"><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />فعالة</label>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-outline">إلغاء</button>
            <button type="submit" className="btn-primary">حفظ</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default function AdminCategoriesPage() {
  const { user, profile } = useAuth();
  const { categories, loading, fetchCategories, addCategory, updateCategory, deleteCategory } = useAdminCategories();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    if (user && profile?.isAdmin) {
      fetchCategories();
    }
  }, [user, profile, fetchCategories]);

  const handleSaveCategory = async (data: any) => {
    try {
      if (editingCategory) {
        await updateCategory((editingCategory as any).id, data);
      } else {
        await addCategory(data);
      }
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Failed to save category:", error);
      alert("فشل في حفظ الفئة");
    }
  };
  
  const openModal = (category: any = null) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  if (!user || !profile?.isAdmin) {
    return <div>غير مصرح لك بالدخول.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-3xl font-bold">إدارة الفئات</h1></div>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2"><Plus /> إضافة فئة</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 font-semibold">الصورة</th>
                <th className="p-4 font-semibold">الاسم</th>
                <th className="p-4 font-semibold">الرابط (Slug)</th>
                <th className="p-4 font-semibold">الحالة</th>
                <th className="p-4 font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center p-8"><div className="loading-dots"><div></div><div></div><div></div><div></div></div></td></tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="border-t">
                    <td className="p-4"><Image src={category.imageUrl || '/placeholder.jpg'} alt={category.nameAr} width={60} height={60} className="w-16 h-16 object-cover rounded-lg" /></td>
                    <td className="p-4 font-medium">{category.nameAr}</td>
                    <td className="p-4 text-gray-500">{category.slug}</td>
                    <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${category.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{category.isActive ? 'فعالة' : 'غير فعالة'}</span></td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => openModal(category)} className="p-2 hover:bg-green-50 rounded-full"><Edit className="h-4 w-4 text-green-600" /></button>
                        <button onClick={() => deleteCategory(category.id)} className="p-2 hover:bg-red-50 rounded-full"><Trash2 className="h-4 w-4 text-red-600" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {isModalOpen && <CategoryModal category={editingCategory} onClose={() => setIsModalOpen(false)} onSave={handleSaveCategory} />}
      </div>
      <Footer />
    </div>
  );
}

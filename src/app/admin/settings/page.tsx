'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, DollarSign, Percent, Globe, Image as ImageIcon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useAdminSettings, SiteSettings } from '@/hooks/useAdminSettings';

export default function AdminSettingsPage() {
  const { user, profile } = useAuth();
  const { settings, loading, error, fetchSettings, updateSettings } = useAdminSettings();
  
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user && profile?.isAdmin) {
      fetchSettings();
    }
  }, [user, profile, fetchSettings]);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData);
      alert('تم حفظ الإعدادات بنجاح!');
    } catch (err) {
      alert('فشل في حفظ الإعدادات.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user || !profile?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20 text-center"><h1 className="text-3xl font-bold">غير مصرح لك بالدخول.</h1></div>
        <Footer />
      </div>
    );
  }

  if (loading && !settings) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20 text-center"><div className="loading-dots mb-4"><div></div><div></div><div></div><div></div></div><p>جاري تحميل الإعدادات...</p></div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-3xl font-bold text-gray-800 mb-2">إعدادات المتجر</h1><p className="text-gray-600">إدارة الإعدادات العامة لمتجر كيوتاكو</p></div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="anime-card p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><DollarSign />الإعدادات المالية</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div><label className="block text-gray-700 font-semibold mb-2">تكلفة الشحن (ريال)</label><input type="number" name="shippingCost" value={formData.shippingCost || ''} onChange={handleChange} className="input-field" step="0.01" /></div>
                <div><label className="block text-gray-700 font-semibold mb-2">معدل الضريبة (%)</label><input type="number" name="taxRate" value={formData.taxRate || ''} onChange={handleChange} className="input-field" step="0.01" placeholder="e.g., 0.15 for 15%" /></div>
                <div><label className="block text-gray-700 font-semibold mb-2">العملة</label><input type="text" name="currency" value={formData.currency || ''} onChange={handleChange} className="input-field" placeholder="e.g., SAR" /></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="anime-card p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><ImageIcon />إعدادات البانر الرئيسي</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div><label className="block text-gray-700 font-semibold mb-2">العنوان (عربي)</label><input type="text" name="featuredBannerTitleAr" value={formData.featuredBannerTitleAr || ''} onChange={handleChange} className="input-field text-right" /></div>
                <div><label className="block text-gray-700 font-semibold mb-2">العنوان (إنجليزي)</label><input type="text" name="featuredBannerTitle" value={formData.featuredBannerTitle || ''} onChange={handleChange} className="input-field text-left" /></div>
                <div className="md:col-span-2"><label className="block text-gray-700 font-semibold mb-2">العنوان الفرعي (عربي)</label><textarea name="featuredBannerSubtitleAr" value={formData.featuredBannerSubtitleAr || ''} onChange={handleChange} className="input-field text-right" rows={2} /></div>
                <div className="md:col-span-2"><label className="block text-gray-700 font-semibold mb-2">العنوان الفرعي (إنجليزي)</label><textarea name="featuredBannerSubtitle" value={formData.featuredBannerSubtitle || ''} onChange={handleChange} className="input-field text-left" rows={2} /></div>
                <div><label className="block text-gray-700 font-semibold mb-2">نص الزر (عربي)</label><input type="text" name="featuredBannerButtonTextAr" value={formData.featuredBannerButtonTextAr || ''} onChange={handleChange} className="input-field text-right" /></div>
                <div><label className="block text-gray-700 font-semibold mb-2">نص الزر (إنجليزي)</label><input type="text" name="featuredBannerButtonText" value={formData.featuredBannerButtonText || ''} onChange={handleChange} className="input-field text-left" /></div>
                <div className="md:col-span-2"><label className="block text-gray-700 font-semibold mb-2">رابط الزر</label><input type="text" name="featuredBannerLink" value={formData.featuredBannerLink || ''} onChange={handleChange} className="input-field text-left" placeholder="/products" /></div>
              </div>
            </motion.div>
            
            <div className="flex justify-end pt-4">
              <motion.button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                {isSaving ? <div className="loading-spinner-sm"></div> : <Save className="h-5 w-5" />}
                {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
              </motion.button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

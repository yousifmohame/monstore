import { useState, useCallback } from 'react';
import { auth } from '@/lib/firebase';

export interface SiteSettings {
  shippingCost: number;
  taxRate: number;
  currency: string;
  featuredBannerTitle: string;
  featuredBannerTitleAr: string;
  featuredBannerSubtitle: string;
  featuredBannerSubtitleAr: string;
  featuredBannerButtonText: string;
  featuredBannerButtonTextAr: string;
  featuredBannerLink: string;
}

export const useAdminSettings = () => {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/settings');
            if (!response.ok) throw new Error('Failed to fetch settings');
            const data = await response.json();
            setSettings(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
        setLoading(true);
        setError(null);
        try {
            const idToken = await auth.currentUser?.getIdToken(true);
            if (!idToken) throw new Error("Authentication required");

            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify(newSettings),
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Failed to update settings');
            
            // تحديث الحالة المحلية فورًا لتحسين تجربة المستخدم
            setSettings(prev => prev ? { ...prev, ...newSettings } : newSettings as SiteSettings);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { settings, loading, error, fetchSettings, updateSettings };
};

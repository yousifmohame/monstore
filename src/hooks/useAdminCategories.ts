import { useState, useCallback } from 'react';
import { auth } from '@/lib/firebase';
import type { Category } from './useCategories';

export const useAdminCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const idToken = await auth.currentUser?.getIdToken(true);
            if (!idToken) throw new Error("Authentication required");
            const response = await fetch('/api/admin/categories', {
                headers: { 'Authorization': `Bearer ${idToken}` },
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);
    
    const addCategory = useCallback(async (categoryData: Omit<Category, 'id'>) => {
        const idToken = await auth.currentUser?.getIdToken(true);
        if (!idToken) throw new Error("Authentication required");
        const response = await fetch('/api/admin/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
            body: JSON.stringify(categoryData),
        });
        if (!response.ok) throw new Error((await response.json()).error || 'Failed to add category');
        await fetchCategories(); // إعادة جلب البيانات لتحديث القائمة
    }, [fetchCategories]);

    const updateCategory = useCallback(async (categoryId: string, updateData: Partial<Category>) => {
        const idToken = await auth.currentUser?.getIdToken(true);
        if (!idToken) throw new Error("Authentication required");
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
            body: JSON.stringify(updateData),
        });
        if (!response.ok) throw new Error((await response.json()).error || 'Failed to update category');
        await fetchCategories();
    }, [fetchCategories]);

    const deleteCategory = useCallback(async (categoryId: string) => {
        const idToken = await auth.currentUser?.getIdToken(true);
        if (!idToken) throw new Error("Authentication required");
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${idToken}` },
        });
        if (!response.ok) throw new Error((await response.json()).error || 'Failed to delete category');
        await fetchCategories();
    }, [fetchCategories]);

    return { categories, loading, error, fetchCategories, addCategory, updateCategory, deleteCategory };
};

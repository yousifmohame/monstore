import { useState, useCallback } from 'react';
import { auth } from '@/lib/firebase';
import type { Product, ProductImage } from './useProducts';

export const useAdminProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const idToken = await auth.currentUser?.getIdToken(true);
            if (!idToken) throw new Error("Authentication required");
            const response = await fetch('/api/admin/products', {
                headers: { 'Authorization': `Bearer ${idToken}` },
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Failed to fetch products');
            const data = await response.json();
            setProducts(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchProductById = useCallback(async (productId: string) => {
        setLoading(true);
        setError(null);
        try {
            const idToken = await auth.currentUser?.getIdToken(true);
            if (!idToken) throw new Error("Authentication required");
            const response = await fetch(`/api/admin/products/${productId}`, {
                headers: { 'Authorization': `Bearer ${idToken}` },
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Failed to fetch product');
            const data = await response.json();
            setProduct(data);
            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // **الإضافة الجديدة: دالة إضافة منتج**
    const addProduct = useCallback(async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">, imageFiles: File[]) => {
        setLoading(true);
        try {
            const idToken = await auth.currentUser?.getIdToken(true);
            if (!idToken) throw new Error("Authentication required");

            // في تطبيق حقيقي، يجب رفع الصور أولاً ثم إرسال الروابط
            // هنا، سنرسل البيانات مباشرة إلى API الإضافة
            const response = await fetch('/api/admin/products/add', { // نفترض وجود هذا الـ API
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({ productData, imagesCount: imageFiles.length }), // مثال
            });
            if (!response.ok) throw new Error('Failed to add product');
            await fetchProducts();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchProducts]);

    const updateProduct = useCallback(async (productId: string, updateData: Partial<Product>) => {
        const idToken = await auth.currentUser?.getIdToken(true);
        if (!idToken) throw new Error("Authentication required");
        const response = await fetch(`/api/admin/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
            body: JSON.stringify(updateData),
        });
        if (!response.ok) throw new Error('Failed to update product');
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updateData } : p));
    }, []);

    const deleteProduct = useCallback(async (productId: string) => {
        const idToken = await auth.currentUser?.getIdToken(true);
        if (!idToken) throw new Error("Authentication required");
        const response = await fetch(`/api/admin/products/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${idToken}` },
        });
        if (!response.ok) throw new Error('Failed to delete product');
        setProducts(prev => prev.filter(p => p.id !== productId));
    }, []);

    return { products, product, loading, error, fetchProducts, fetchProductById, addProduct, updateProduct, deleteProduct };
};

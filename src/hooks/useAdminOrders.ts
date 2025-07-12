import { useState, useCallback } from 'react';
import { auth } from '@/lib/firebase';
import type { Order } from './useOrders';

export interface AdminOrder extends Order {
    customer?: {
        fullName: string;
        email: string;
    }
}

export const useAdminOrders = () => {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [order, setOrder] = useState<AdminOrder | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async (statusFilter: string = 'all') => {
        setLoading(true);
        setError(null);
        try {
            const idToken = await auth.currentUser?.getIdToken(true);
            if (!idToken) throw new Error("Authentication required");
            
            const url = statusFilter === 'all' 
                ? '/api/admin/orders' 
                : `/api/admin/orders?status=${statusFilter}`;
                
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${idToken}` } });
            if (!response.ok) throw new Error((await response.json()).error || 'Failed to fetch orders');
            const data = await response.json();
            setOrders(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOrderById = useCallback(async (orderId: string) => {
        setLoading(true);
        setError(null);
        try {
            const idToken = await auth.currentUser?.getIdToken(true);
            if (!idToken) throw new Error("Authentication required");
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                headers: { 'Authorization': `Bearer ${idToken}` },
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Failed to fetch order');
            const data = await response.json();
            setOrder(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateOrder = useCallback(async (orderId: string, updateData: Partial<AdminOrder>) => {
        try {
            const idToken = await auth.currentUser?.getIdToken(true);
            if (!idToken) throw new Error("Authentication required");

            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
                body: JSON.stringify(updateData),
            });
            if (!response.ok) throw new Error('Failed to update order');
            
            // تحديث الحالة المحلية فورًا
            setOrder(prev => prev ? { ...prev, ...updateData } : null);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updateData } : o));
        } catch (err: any) {
            setError(err.message);
            throw err; // إعادة رمي الخطأ للتعامل معه في المكون
        }
    }, []);

    return { orders, order, loading, error, fetchOrders, fetchOrderById, updateOrder };
};

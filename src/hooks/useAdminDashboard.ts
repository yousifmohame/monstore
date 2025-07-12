import { useState, useCallback } from 'react';
import { auth } from '@/lib/firebase';

export interface DashboardStats {
  totalRevenue: number;
  totalSales: number;
  totalUsers: number;
  totalProducts: number;
  pendingOrders: number;
  outOfStockProducts: number;
  recentProducts: any[];
  unreadMessages: number;
  newReviews: number;
}

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("Admin not authenticated.");
      }
      const idToken = await currentUser.getIdToken(true);

      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch dashboard data.');
      }

      const data: DashboardStats = await response.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, loading, error, fetchDashboardData };
};

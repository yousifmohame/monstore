// pages/api/admin/dashboard.ts
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch collections
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    const usersSnapshot = await getDocs(collection(db, 'users'));

    // Process data
    const products = productsSnapshot.docs.map(doc => doc.data());
    const orders = ordersSnapshot.docs.map(doc => doc.data());
    const users = usersSnapshot.docs.map(doc => doc.data());

    // Calculate stats
    const totalProducts = products.length;
    const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalUsers = users.length;
    const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
    const outOfStockProducts = products.filter(p => p.stock <= 0).length;
    const unreadMessages = 2;
    const newReviews = 3;
    const recentProducts = products.slice(0, 5);

    res.status(200).json({
      totalRevenue: totalSales,
      totalSales,
      totalUsers,
      totalProducts,
      pendingOrders,
      outOfStockProducts,
      unreadMessages,
      newReviews,
      recentProducts,
    });
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
import { NextRequest, NextResponse } from 'next/server';
// لا حاجة لاستيراد دوال مثل query, collection هنا
import { adminAuth, adminDb } from "@/lib/firebase-admin";

async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error("Unauthorized");
  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await adminAuth.verifyIdToken(token);
  const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
  if (!userDoc.exists || !userDoc.data()?.isAdmin) throw new Error("Forbidden: Not an admin");
  return decodedToken.uid;
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request);

    // جلب البيانات من مجموعات مختلفة بالتوازي لتحسين الأداء
    const ordersPromise = adminDb.collection('orders').get();
    const usersPromise = adminDb.collection('users').get();
    const productsPromise = adminDb.collection('products').get();
    
    const [ordersSnapshot, usersSnapshot, productsSnapshot] = await Promise.all([
      ordersPromise,
      usersPromise,
      productsPromise,
    ]);

    // حساب الإحصائيات
    const totalRevenue = ordersSnapshot.docs.reduce((sum, doc) => sum + (doc.data().totalAmount || 0), 0);
    const totalSales = ordersSnapshot.size;
    const totalUsers = usersSnapshot.size;
    const totalProducts = productsSnapshot.size;
    const pendingOrders = ordersSnapshot.docs.filter(doc => ['PENDING', 'PROCESSING'].includes(doc.data().status)).length;
    const outOfStockProducts = productsSnapshot.docs.filter(doc => doc.data().stock === 0).length;

    // **الإصلاح الرئيسي: استخدام الصيغة الصحيحة لـ Admin SDK**
    const recentOrdersSnapshot = await adminDb.collection('orders')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();
      
    const recentOrders = recentOrdersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        orderNumber: data.orderNumber,
        customerName: data.shippingAddress.fullName,
        totalAmount: data.totalAmount,
        status: data.status,
        createdAt: data.createdAt.toDate().toISOString(),
      };
    });

    return NextResponse.json({
      totalRevenue,
      totalSales,
      totalUsers,
      totalProducts,
      pendingOrders,
      outOfStockProducts,
      recentOrders,
      // بيانات وهمية مؤقتًا
      unreadMessages: 3, 
      newReviews: 2,
    });

  } catch (error: any) {
    console.error("Dashboard API Error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes("Unauthorized") || error.message.includes("Forbidden") ? 401 : 500 }
    );
  }
}

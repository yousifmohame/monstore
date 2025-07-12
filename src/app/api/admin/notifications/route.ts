import { NextRequest, NextResponse } from 'next/server';
// **الإصلاح: لا حاجة لاستيراد دوال العميل هنا**
import { adminAuth, adminDb } from "@/lib/firebase-admin";

// دالة مساعدة للتحقق من أن المستخدم هو مدير
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error("Unauthorized");
  }
  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await adminAuth.verifyIdToken(token);
  const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
  if (!userDoc.exists || !userDoc.data()?.isAdmin) {
    throw new Error("Forbidden: Not an admin");
  }
}

// GET: جلب الإشعارات
export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request);
    
    // **الإصلاح: استخدام الصيغة الصحيحة لـ Admin SDK**
    const notificationsRef = adminDb.collection('notifications');
    const querySnapshot = await notificationsRef.orderBy('createdAt', 'desc').get();
    
    const notifications = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString(),
    }));
    
    return NextResponse.json(notifications);
  } catch (error: any) {
    console.error("Admin Get Notifications API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: تعيين كل الإشعارات كمقروءة
export async function POST(request: NextRequest) {
    try {
        await verifyAdmin(request);
        const notificationsRef = adminDb.collection('notifications');
        // **الإصلاح: استخدام الصيغة الصحيحة لـ Admin SDK**
        const unreadSnapshot = await notificationsRef.where('isRead', '==', false).get();

        if (unreadSnapshot.empty) {
            return NextResponse.json({ success: true, message: "No new notifications to mark as read." });
        }

        const batch = adminDb.batch();
        unreadSnapshot.docs.forEach(doc => {
            batch.update(doc.ref, { isRead: true });
        });
        await batch.commit();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Admin Mark Read API Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

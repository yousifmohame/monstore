import { NextRequest, NextResponse } from 'next/server';
// **الإصلاح الرئيسي: استيراد FieldValue من ملف الإعداد الخاص بنا**
import { adminAuth, adminDb, FieldValue } from "@/lib/firebase-admin";

// دالة مساعدة للتحقق من أن المستخدم هو مدير
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error("Unauthorized");
  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await adminAuth.verifyIdToken(token);
  const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
  if (!userDoc.exists || !userDoc.data()?.isAdmin) throw new Error("Forbidden: Not an admin");
}

// GET: جلب تفاصيل طلب واحد
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAdmin(request);
    const orderId = params.id;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // **الإصلاح: استخدام الصيغة الصحيحة لـ Admin SDK**
    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    
    const orderData = orderDoc.data()!;
    const customerDocRef = adminDb.collection('users').doc(orderData.userId);
    const customerDoc = await customerDocRef.get();
    
    return NextResponse.json({
      id: orderDoc.id,
      ...orderData,
      customer: customerDoc.exists ? customerDoc.data() : { fullName: 'مستخدم محذوف', email: '' },
      createdAt: orderData.createdAt.toDate().toISOString(),
      updatedAt: orderData.updatedAt.toDate().toISOString(),
    });

  } catch (error: any) {
    console.error("Get Single Order API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: تحديث حالة الطلب أو معلومات التتبع
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAdmin(request);
    const orderId = params.id;
    const updateData = await request.json();

    if (!orderId || !updateData) {
      return NextResponse.json({ error: "Order ID and update data are required" }, { status: 400 });
    }

    // **الإصلاح: استخدام الصيغة الصحيحة لـ Admin SDK**
    const orderRef = adminDb.collection('orders').doc(orderId);
    await orderRef.update({
        ...updateData,
        updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, message: `Order updated successfully` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

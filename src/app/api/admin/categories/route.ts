import { NextRequest, NextResponse } from 'next/server';
// **الإصلاح: استيراد FieldValue للتعامل مع serverTimestamp**
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

// دالة مساعدة للتحقق من أن المستخدم هو مدير
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error("Unauthorized");
  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await adminAuth.verifyIdToken(token);
  const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
  if (!userDoc.exists || !userDoc.data()?.isAdmin) throw new Error("Forbidden: Not an admin");
}

// GET: جلب جميع الفئات
export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request);
    
    // **الإصلاح: استخدام الصيغة الصحيحة لـ Admin SDK**
    const categoriesRef = adminDb.collection('categories');
    const querySnapshot = await categoriesRef.orderBy('sortOrder', 'asc').get();
    
    const categories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("Admin Get Categories API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: إضافة فئة جديدة
export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request);
    const categoryData = await request.json();
    const categoriesRef = adminDb.collection('categories');
    
    const newCategory = {
      ...categoryData,
      productsCount: 0,
      // **الإصلاح: استخدام FieldValue.serverTimestamp()**
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    
    // **الإصلاح: استخدام .add() بدلاً من addDoc()**
    const docRef = await categoriesRef.add(newCategory);
    
    return NextResponse.json({ id: docRef.id, ...newCategory });
  } catch (error: any) {
    console.error("Admin Add Category API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

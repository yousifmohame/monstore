import { NextRequest, NextResponse } from 'next/server';
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

// GET: جلب جميع المنتجات مع إمكانية الترشيح
export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request);
    
    const productsRef = adminDb.collection('products');
    const querySnapshot = await productsRef.orderBy('createdAt', 'desc').get();
    
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Admin Get Products API Error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes("Unauthorized") || error.message.includes("Forbidden") ? 401 : 500 }
    );
  }
}

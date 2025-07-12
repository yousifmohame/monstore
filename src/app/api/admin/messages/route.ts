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

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request);
    const conversationsRef = adminDb.collection('conversations');
    const querySnapshot = await conversationsRef.orderBy('lastMessageAt', 'desc').get();
    
    const conversations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastMessageAt: doc.data().lastMessageAt.toDate().toISOString(),
    }));
    return NextResponse.json(conversations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

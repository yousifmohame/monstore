import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from "firebase-admin/firestore";
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

export async function POST(request: NextRequest, { params }: { params: { conversationId: string } }) {
  try {
    const adminId = await verifyAdmin(request);
    const { message } = await request.json();
    const conversationId = params.conversationId;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const messageRef = adminDb.collection('conversations').doc(conversationId).collection('messages');
    await messageRef.add({
      senderId: adminId, // Admin's ID
      text: message,
      timestamp: FieldValue.serverTimestamp(),
      isFromAdmin: true,
    });

    await adminDb.collection('conversations').doc(conversationId).update({
      lastMessage: message,
      lastMessageAt: FieldValue.serverTimestamp(),
      isReadByUser: false, // Mark as unread for the user
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

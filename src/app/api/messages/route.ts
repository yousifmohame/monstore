import { NextRequest, NextResponse } from 'next/server';
// **الإصلاح الرئيسي: استيراد FieldValue من ملف الإعداد الخاص بنا**
import { adminDb, FieldValue } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { userId, message, conversationId } = await request.json();

    if (!userId || !message) {
      return NextResponse.json({ error: "User ID and message are required" }, { status: 400 });
    }

    let currentConversationId = conversationId;

    // إذا لم تكن هناك محادثة، أنشئ واحدة جديدة
    if (!currentConversationId) {
      const userRef = adminDb.collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      const conversationData = {
        userId: userId,
        userName: userDoc.exists ? userDoc.data()?.fullName : 'زائر',
        userEmail: userDoc.exists ? userDoc.data()?.email : 'غير مسجل',
        lastMessage: message,
        lastMessageAt: FieldValue.serverTimestamp(),
        isReadByAdmin: false,
      };
      // **الإصلاح: استخدام .add() لإنشاء مستند جديد**
      const conversationRef = await adminDb.collection('conversations').add(conversationData);
      currentConversationId = conversationRef.id;
    }

    // إضافة الرسالة إلى المحادثة
    const messageRef = adminDb.collection('conversations').doc(currentConversationId).collection('messages');
    await messageRef.add({
      senderId: userId,
      text: message,
      timestamp: FieldValue.serverTimestamp(),
    });

    // تحديث آخر رسالة في المحادثة
    await adminDb.collection('conversations').doc(currentConversationId).update({
      lastMessage: message,
      lastMessageAt: FieldValue.serverTimestamp(),
      isReadByAdmin: false,
    });

    return NextResponse.json({ success: true, conversationId: currentConversationId });

  } catch (error: any) {
    console.error("Send Message API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

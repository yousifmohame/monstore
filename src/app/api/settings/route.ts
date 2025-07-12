import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

// GET general settings
export async function GET() {
  try {
    // **الإصلاح الرئيسي: استخدام الصيغة الصحيحة لـ Admin SDK**
    const settingsRef = adminDb.collection("settings").doc("general");
    const docSnap = await settingsRef.get();

    // **الإصلاح الرئيسي: استخدام .exists كخاصية وليس كدالة**
    if (docSnap.exists) {
      const data = docSnap.data();
      // التأكد من أن data ليس undefined قبل الوصول إلى خصائصه
      const responseData = {
        ...data,
        updatedAt: data?.updatedAt?.toDate().toISOString(),
      };
      return NextResponse.json(responseData);
    } else {
      // إرجاع إعدادات افتراضية إذا لم يتم العثور عليها
      return NextResponse.json({
        shippingCost: 25,
        taxRate: 0.15,
        currency: "SAR",
        featuredBannerTitleAr: "مرحباً بك في كيوتاكو",
      });
    }
  } catch (error: any) {
    console.error("Error fetching settings:", error.message);
    return NextResponse.json({ error: "Failed to fetch settings", details: error.message }, { status: 500 });
  }
}

// POST (update) general settings - requires admin privileges
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];

    const decodedToken = await adminAuth.verifyIdToken(token);
    const userDocRef = adminDb.collection('users').doc(decodedToken.uid);
    const userDoc = await userDocRef.get();
    
    if (!userDoc.exists || !userDoc.data()?.isAdmin) {
         return NextResponse.json({ error: "Forbidden: Not an admin" }, { status: 403 });
    }

    const settingsData = await request.json();
    const settingsRef = adminDb.collection("settings").doc("general");

    await settingsRef.set(
      {
        ...settingsData,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true, message: "Settings updated" });
  } catch (error: any) {
    console.error("Error updating settings:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

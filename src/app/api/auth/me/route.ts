/** @format */

import { NextRequest, NextResponse } from "next/server";
import { auth as adminAuth } from "firebase-admin";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // Verify the token with Firebase Admin
    const decodedToken = await adminAuth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // Get user profile from Firestore
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    const userProfile = userDoc.data();

    // Create user object to return
    const user = {
      id: uid,
      email: decodedToken.email,
      fullName: decodedToken.name || userProfile.fullName,
      isAdmin: userProfile.isAdmin || false,
    };

    return NextResponse.json({
      user,
      profile: {
        id: uid,
        ...userProfile,
      },
    });
  } catch (error: any) {
    console.error("Auth verification error:", error);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  const { uid, email, ...data } = await req.json();

  // Reference to the user document
  const userDocRef = doc(db, "users", uid);

  // Check if the user exists
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
  }

  // Update user document
  await updateDoc(userDocRef, {
    ...data,
    email,
    updatedAt: serverTimestamp(),
  });
  if (email) {
    try {
      const adminAuth = getAdminAuth();
      await adminAuth.updateUser(uid, { email: email });
    } catch (error: any) {
      return NextResponse.json(
        { error: `خطأ في تحديث البريد الإلكتروني: ${error.message}` },
        { status: 400 }
      );
    }
  }
  return NextResponse.json({
    message: "User updated successfully",
  });
}

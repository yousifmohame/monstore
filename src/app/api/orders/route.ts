/** @format */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb as db } from "@/lib/firebase-admin";

// Unified helper function to extract UID from token
async function getUserIdFromToken(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split("Bearer ")[1];
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      return { uid: decodedToken.uid, isAdmin: decodedToken.admin === true };
    } catch (error: any) {
      console.error("Firebase ID Token Verification Error:", error.message);
      throw new Error(`Invalid or expired token: ${error.message}`);
    }
  }

  const token = request.cookies.get("auth-token")?.value;
  if (!token) {
    throw new Error("Unauthorized: No token found.");
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return { uid: decodedToken.uid, isAdmin: decodedToken.admin === true };
  } catch (error: any) {
    console.error("Firebase ID Token Verification Error:", error.message);
    throw new Error(`Invalid or expired token: ${error.message}`);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { uid, isAdmin } = await getUserIdFromToken(request);
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const limitParam = searchParams.get("limit");
    const lastDocId = searchParams.get("lastDocId");

    let queryRef = db.collection("orders");
    let queryBuilder: FirebaseFirestore.Query = queryRef;

    if (!isAdmin) {
      queryBuilder = queryBuilder.where("userId", "==", uid);
    }

    if (status && status !== "all") {
      queryBuilder = queryBuilder.where("status", "==", status);
    }

    queryBuilder = queryBuilder.orderBy("createdAt", "desc");

    const limitValue = limitParam ? parseInt(limitParam) : 10;
    queryBuilder = queryBuilder.limit(limitValue);

    if (lastDocId) {
      const lastDocRef = db.collection("orders").doc(lastDocId);
      const lastDocSnap = await lastDocRef.get();

      if (lastDocSnap.exists) {
        queryBuilder = queryBuilder.startAfter(lastDocSnap);
      }
    }

    const snapshot = await queryBuilder.get();

    const orders: any[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
        deliveredAt: data.deliveredAt?.toDate?.()?.toISOString() || null,
        shippedAt: data.shippedAt?.toDate?.()?.toISOString() || null,
      });
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Orders API Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { uid } = await getUserIdFromToken(request);
    const orderData = await request.json();

    if (!orderData.items || !orderData.items.length) {
      return NextResponse.json(
        { error: "لا توجد منتجات في الطلب" },
        { status: 400 }
      );
    }

    if (!orderData.shippingAddress) {
      return NextResponse.json(
        { error: "عنوان الشحن مطلوب" },
        { status: 400 }
      );
    }

    const orderNumber = `ORD-${Date.now()}`;

    const ordersRef = db.collection("orders");
    const newOrderRef = ordersRef.doc();
    const orderId = newOrderRef.id;

    const timestamp = {
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: 0,
    };

    await newOrderRef.set({
      ...orderData,
      userId: uid,
      orderNumber,
      status: "PENDING",
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    // Clear user's cart
    const cartRef = db.collection("users").doc(uid).collection("cart");
    const cartSnapshot = await cartRef.get();

    const batch = db.batch();
    cartSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
    });
  } catch (error: any) {
    console.error("Orders API Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

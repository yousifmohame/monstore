/** @format */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { adminAuth, adminDb as db } from "@/lib/firebase-admin";

// Unified helper function to extract UID from token using either:
// - Bearer Token in Authorization header
// - auth-token cookie
async function getUserIdFromToken(request: NextRequest) {
  // Try Authorization header first
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

  // Fallback to auth-token cookie
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

    // Parse query parameters
    const status = searchParams.get("status");
    const limitParam = searchParams.get("limit");
    const lastDocId = searchParams.get("lastDocId");

    // Build query
    let ordersQuery = collection(db, "orders");
    let constraints: any[] = [];

    // Regular users can only see their own orders
    if (!isAdmin) {
      constraints.push(where("userId", "==", uid));
    }

    // Filter by status if provided
    if (status && status !== "all") {
      constraints.push(where("status", "==", status));
    }

    // Add ordering
    constraints.push(orderBy("createdAt", "desc"));

    // Add pagination
    const limitValue = limitParam ? parseInt(limitParam) : 10;
    constraints.push(limit(limitValue));

    // Add startAfter if lastDocId is provided
    if (lastDocId) {
      const lastDocRef = doc(db, "orders", lastDocId);
      const lastDocSnap = await getDoc(lastDocRef);

      if (lastDocSnap.exists()) {
        constraints.push(startAfter(lastDocSnap));
      }
    }

    // Execute query
    const q = query(ordersQuery, ...constraints);
    const querySnapshot = await getDocs(q);

    // Process results
    const orders: any[] = [];

    querySnapshot.forEach((doc) => {
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

    // Validate order data
    if (!orderData.items || !orderData.items.length) {
      return NextResponse.json(
        { error: "لا توجد منتجات في الطلب" },
        { status: 400 }
      );
    }

    if (!orderData.shippingAddress) {
      return NextResponse.json({ error: "عنوان الشحن مطلوب" }, { status: 400 });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // Create a new order document with a generated ID
    const ordersRef = collection(db, "orders");
    const newOrderRef = doc(ordersRef);
    const orderId = newOrderRef.id;

    // Add timestamps, order number, and user ID
    const timestamp = {
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: 0,
    };

    // Create the order document
    await setDoc(newOrderRef, {
      ...orderData,
      userId: uid,
      orderNumber,
      status: "PENDING",
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    // Clear the user's cart
    const batch = db.batch();
    const cartRef = collection(db, "users", uid, "cart");
    const cartSnapshot = await getDocs(cartRef);

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
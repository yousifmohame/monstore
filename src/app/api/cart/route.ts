/** @format */

import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth as adminAuth } from "firebase-admin";
import { db } from "@/lib/firebase";

// Helper function to get user ID from token
async function getUserIdFromToken(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const decodedToken = await adminAuth().verifyIdToken(token);
  return decodedToken.uid;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);

    // Get cart items
    const cartRef = collection(db, "users", userId, "cart");
    const cartSnapshot = await getDocs(cartRef);

    const cartItems: any[] = [];

    for (const doc of cartSnapshot.docs) {
      const cartItem = doc.data();

      cartItems.push(cartItem);
    }
    return NextResponse.json(cartItems);
  } catch (error: any) {
    console.error("Cart API Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    const { productId, quantity, colorId, sizeId, variantId } =
      await request.json();

    if (!productId) {
      return NextResponse.json({ error: "معرف المنتج مطلوب" }, { status: 400 });
    }

    // Fetch product to get current data
    const productRef = doc(db, "products", productId);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    const productData = productDoc.data();

    // Check if product is active
    if (!productData.isActive) {
      return NextResponse.json(
        { error: "المنتج غير متاح حالياً" },
        { status: 400 }
      );
    }

    // Check stock availability
    let availableStock = 0;

    if (productData.hasVariants && variantId) {
      // Find the specific variant
      const variant = productData.variants?.find(
        (v: any) => v.id === variantId
      );
      if (variant) {
        availableStock = variant.stock;
      }
    } else {
      availableStock = productData.stock;
    }

    if (availableStock < quantity) {
      return NextResponse.json(
        { error: "الكمية المطلوبة غير متوفرة في المخزون" },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const cartItemId = variantId ? `${productId}-${variantId}` : productId;
    const cartItemRef = doc(db, "users", userId, "cart", cartItemId);
    const cartItemDoc = await getDoc(cartItemRef);

    if (cartItemDoc.exists()) {
      // Update existing cart item
      const currentQuantity = cartItemDoc.data().quantity;
      const newQuantity = currentQuantity + quantity;

      // Check if new quantity exceeds available stock
      if (newQuantity > availableStock) {
        return NextResponse.json(
          { error: "الكمية المطلوبة تتجاوز المخزون المتاح" },
          { status: 400 }
        );
      }

      await updateDoc(cartItemRef, {
        quantity: newQuantity,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Add new cart item
      const price = productData.salePrice || productData.price;

      // Get color and size names if applicable
      let colorName = null;
      let sizeName = null;

      if (colorId && productData.hasVariants) {
        // This is a simplified approach. In a real app, you'd fetch color data from a colors collection
        const colorVariant = productData.variants?.find(
          (v: any) => v.colorId === colorId
        );
        if (colorVariant) {
          colorName = colorVariant.colorName;
        }
      }

      if (sizeId && productData.hasVariants) {
        // This is a simplified approach. In a real app, you'd fetch size data from a sizes collection
        const sizeVariant = productData.variants?.find(
          (v: any) => v.sizeId === sizeId
        );
        if (sizeVariant) {
          sizeName = sizeVariant.sizeName;
        }
      }

      await setDoc(cartItemRef, {
        productId,
        name: productData.nameAr,
        price,
        image: productData.images?.[0]?.imageUrl || "/placeholder.jpg",
        quantity,
        colorId,
        colorName,
        sizeId,
        sizeName,
        variantId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // Update product stock
    if (productData.hasVariants && variantId) {
      // Update variant stock
      const variants = productData.variants || [];
      const updatedVariants = variants.map((v: any) =>
        v.id === variantId ? { ...v, stock: v.stock - quantity } : v
      );

      await updateDoc(productRef, {
        variants: updatedVariants,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Update main product stock
      await updateDoc(productRef, {
        stock: productData.stock - quantity,
        updatedAt: serverTimestamp(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Cart API Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    const { cartItemId, quantity } = await request.json();

    if (!cartItemId) {
      return NextResponse.json(
        { error: "معرف عنصر السلة مطلوب" },
        { status: 400 }
      );
    }

    // Get cart item
    const cartItemRef = doc(db, "users", userId, "cart", cartItemId);
    const cartItemDoc = await getDoc(cartItemRef);

    if (!cartItemDoc.exists()) {
      return NextResponse.json(
        { error: "عنصر السلة غير موجود" },
        { status: 404 }
      );
    }

    const cartItem = cartItemDoc.data();

    // If quantity is 0 or less, remove the item
    if (quantity <= 0) {
      await deleteDoc(cartItemRef);
      return NextResponse.json({ success: true });
    }

    // Fetch product to check stock
    const productRef = doc(db, "products", cartItem.productId);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    const productData = productDoc.data();

    // Check stock availability
    let availableStock = 0;

    if (productData.hasVariants && cartItem.variantId) {
      // Find the specific variant
      const variant = productData.variants?.find(
        (v: any) => v.id === cartItem.variantId
      );
      if (variant) {
        availableStock = variant.stock + cartItem.quantity; // Add current quantity back to available stock
      }
    } else {
      availableStock = productData.stock + cartItem.quantity; // Add current quantity back to available stock
    }

    if (availableStock < quantity) {
      return NextResponse.json(
        { error: "الكمية المطلوبة غير متوفرة في المخزون" },
        { status: 400 }
      );
    }

    // Calculate quantity difference
    const quantityDiff = quantity - cartItem.quantity;

    // Update cart item
    await updateDoc(cartItemRef, {
      quantity,
      updatedAt: serverTimestamp(),
    });

    // Update product stock
    if (productData.hasVariants && cartItem.variantId) {
      // Update variant stock
      const variants = productData.variants || [];
      const updatedVariants = variants.map((v: any) =>
        v.id === cartItem.variantId
          ? { ...v, stock: v.stock - quantityDiff }
          : v
      );

      await updateDoc(productRef, {
        variants: updatedVariants,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Update main product stock
      await updateDoc(productRef, {
        stock: productData.stock - quantityDiff,
        updatedAt: serverTimestamp(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Cart API Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    const { cartItemId } = await request.json();

    if (!cartItemId) {
      return NextResponse.json(
        { error: "معرف عنصر السلة مطلوب" },
        { status: 400 }
      );
    }

    // Get cart item to restore stock
    const cartItemRef = doc(db, "users", userId, "cart", cartItemId);
    const cartItemDoc = await getDoc(cartItemRef);

    if (cartItemDoc.exists()) {
      const cartItem = cartItemDoc.data();

      // Restore product stock
      const productRef = doc(db, "products", cartItem.productId);
      const productDoc = await getDoc(productRef);

      if (productDoc.exists()) {
        const productData = productDoc.data();

        if (productData.hasVariants && cartItem.variantId) {
          // Restore variant stock
          const variants = productData.variants || [];
          const updatedVariants = variants.map((v: any) =>
            v.id === cartItem.variantId
              ? { ...v, stock: v.stock + cartItem.quantity }
              : v
          );

          await updateDoc(productRef, {
            variants: updatedVariants,
            updatedAt: serverTimestamp(),
          });
        } else {
          // Restore main product stock
          await updateDoc(productRef, {
            stock: productData.stock + cartItem.quantity,
            updatedAt: serverTimestamp(),
          });
        }
      }

      // Delete cart item
      await deleteDoc(cartItemRef);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Cart API Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

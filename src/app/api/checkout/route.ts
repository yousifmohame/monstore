import { NextRequest, NextResponse } from 'next/server';
import { collection, doc, getDoc } from 'firebase-admin/firestore';
import { adminDb, adminAuth, FieldValue } from '@/lib/firebase-admin';

interface OrderItem {
  productId: string;
  name: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variantId?: string;
  color?: string;
  size?: string;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface CheckoutRequest {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  notes?: string;
}

const cleanOrderItem = (item: Partial<OrderItem>): OrderItem => {
  return {
    productId: item.productId || '',
    name: item.name || '',
    productImage: item.productImage || '/placeholder.jpg',
    quantity: item.quantity || 0,
    unitPrice: item.unitPrice || 0,
    totalPrice: item.totalPrice || 0,
    ...(item.variantId && { variantId: item.variantId }),
    ...(item.color && { color: item.color }),
    ...(item.size && { size: item.size }),
  };
};

const validateShippingAddress = (address: ShippingAddress): boolean => {
  return (
    !!address.fullName &&
    !!address.phone &&
    !!address.address &&
    !!address.city
  );
};

export async function POST(request: NextRequest) {
  try {
    // 1. Verify authentication
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // 2. Parse and validate request body
    const body: CheckoutRequest = await request.json();
    const { shippingAddress, paymentMethod, notes } = body;

    if (!validateShippingAddress(shippingAddress)) {
      return NextResponse.json(
        { error: "Invalid shipping address" },
        { status: 400 }
      );
    }

    if (!["cash_on_delivery", "credit_card"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    // 3. Fetch user cart
    const cartRef = adminDb.collection("users").doc(userId).collection("cart");
    const cartSnapshot = await cartRef.get();

    if (cartSnapshot.empty) {
      return NextResponse.json(
        { error: "Your cart is empty" },
        { status: 400 }
      );
    }

    // 4. Get settings with fallback defaults
    const settingsDoc = await adminDb.collection("settings").doc("general").get();
    const settings = settingsDoc.exists ? settingsDoc.data() : { 
      shippingCost: 25, 
      taxRate: 0.15, 
      currency: "SAR" 
    };

    // 5. Process order in transaction
    const result = await adminDb.runTransaction(async (transaction) => {
      const orderItems: OrderItem[] = [];
      let subtotal = 0;

      // Process each cart item
      for (const docSnapshot of cartSnapshot.docs) {
        const cartItem = docSnapshot.data();
        const productRef = adminDb.collection("products").doc(cartItem.productId);
        const productDoc = await transaction.get(productRef);

        if (!productDoc.exists) {
          throw new Error(`Product ${cartItem.productId} not found`);
        }

        const productData = productDoc.data();

        // Validate product
        if (!productData?.isActive) {
          throw new Error(`Product ${cartItem.productId} is not available`);
        }

        // Check stock
        let availableStock = productData.stock || 0;
        if (productData.hasVariants && cartItem.variantId) {
          const variant = productData.variants?.find(
            (v: any) => v.id === cartItem.variantId
          );
          availableStock = variant?.stock || 0;
        }

        if (availableStock < cartItem.quantity) {
          throw new Error(`Insufficient stock for product ${cartItem.productId}`);
        }

        // Calculate price
        const price = productData.salePrice || productData.price || 0;
        const totalPrice = price * cartItem.quantity;

        // Add to order items
        orderItems.push(cleanOrderItem({
          productId: cartItem.productId,
          name: productData.name,
          productImage: productData.images?.[0]?.imageUrl,
          quantity: cartItem.quantity,
          unitPrice: price,
          totalPrice,
          variantId: cartItem.variantId,
          color: cartItem.colorName,
          size: cartItem.sizeName,
        }));

        subtotal += totalPrice;

        // Update stock
        if (productData.hasVariants && cartItem.variantId) {
          const updatedVariants = productData.variants?.map((v: any) =>
            v.id === cartItem.variantId
              ? { ...v, stock: v.stock - cartItem.quantity }
              : v
          );
          transaction.update(productRef, {
            variants: updatedVariants,
            updatedAt: FieldValue.serverTimestamp(),
          });
        } else {
          transaction.update(productRef, {
            stock: FieldValue.increment(-cartItem.quantity),
            updatedAt: FieldValue.serverTimestamp(),
          });
        }

        // Remove from cart
        transaction.delete(docSnapshot.ref);
      }

      // Calculate totals
      const shippingAmount = settings.shippingCost ?? 25;
      const taxRate = settings.taxRate ?? 0.15;
      const taxAmount = subtotal * taxRate;
      const totalAmount = subtotal + shippingAmount + taxAmount;

      // Create order
      const newOrderRef = adminDb.collection("orders").doc();
      const orderData = {
        userId,
        orderNumber: `ORD-${Date.now()}`,
        status: "pending",
        paymentStatus: paymentMethod === "cash_on_delivery" ? "pending" : "paid",
        paymentMethod,
        subtotal,
        taxAmount,
        shippingAmount,
        totalAmount,
        currency: settings.currency || "SAR",
        shippingAddress: {
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode || '',
        },
        notes: notes || "",
        items: orderItems,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      transaction.set(newOrderRef, orderData);
      const notificationRef = adminDb.collection("notifications").doc();
      transaction.set(notificationRef, {
        type: 'NEW_ORDER',
        message: `تم استلام طلب جديد #${orderData.orderNumber} بقيمة ${totalAmount.toFixed(2)} ريال`,
        link: `/admin/orders/${newOrderRef.id}`,
        isRead: false,
        createdAt: FieldValue.serverTimestamp(),
      });


      return {
        orderId: newOrderRef.id,
        orderNumber: orderData.orderNumber,
        totalAmount,
      };
    });

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error: any) {
    console.error("Checkout error:", error);
    const status = error.message.includes("Unauthorized") ? 401 : 
                  error.message.includes("Invalid") ? 400 : 500;
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status }
    );
  }
}
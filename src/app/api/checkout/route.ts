import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb, FieldValue } from "@/lib/firebase-admin";

async function getUserIdFromToken(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error("Unauthorized");
  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await adminAuth.verifyIdToken(token);
  return decodedToken.uid;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    const { shippingAddress, paymentMethod, notes } = await request.json();

    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json({ error: "عنوان الشحن وطريقة الدفع مطلوبان" }, { status: 400 });
    }

    const cartRef = adminDb.collection("users").doc(userId).collection("cart");
    const cartSnapshot = await cartRef.get();

    if (cartSnapshot.empty) {
      return NextResponse.json({ error: "سلة التسوق فارغة" }, { status: 400 });
    }

    const result = await adminDb.runTransaction(async (transaction) => {
        const newOrderRef = adminDb.collection("orders").doc();
        let subtotal = 0;
        const orderItems: any[] = [];
        const customerDoc = await transaction.get(adminDb.collection('users').doc(userId));
        const customerName = customerDoc.exists ? customerDoc.data()?.fullName : 'زائر';

        for (const doc of cartSnapshot.docs) {
            const cartItem = doc.data();
            const productRef = adminDb.collection("products").doc(cartItem.productId);
            const productDoc = await transaction.get(productRef);

            if (!productDoc.exists) throw new Error(`Product with ID ${cartItem.productId} not found.`);
            const productData = productDoc.data()!;
            if (productData.stock < cartItem.quantity) throw new Error(`Not enough stock for ${productData.nameAr}`);
            
            const price = productData.salePrice || productData.price;
            subtotal += price * cartItem.quantity;
            orderItems.push({
                productId: cartItem.productId,
                productName: productData.name,
                productNameAr: productData.nameAr,
                productImage: productData.images?.[0]?.imageUrl || "/placeholder.jpg",
                quantity: cartItem.quantity,
                unitPrice: price,
                totalPrice: price * cartItem.quantity,
            });

            transaction.update(productRef, { stock: FieldValue.increment(-cartItem.quantity) });
            transaction.delete(doc.ref);
        }
        
        const totalAmount = subtotal; // قم بإضافة الشحن والضرائب هنا
        const orderNumber = `ORD-${Date.now()}`;

        transaction.set(newOrderRef, {
            userId, orderNumber, totalAmount, shippingAddress, 
            paymentMethod, notes, items: orderItems, 
            status: 'PENDING', createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp()
        });

        // **الإضافة الجديدة: إنشاء إشعار بالطلب الجديد**
        const notificationRef = adminDb.collection("notifications").doc();
        transaction.set(notificationRef, {
            type: 'NEW_ORDER',
            message: `طلب جديد #${orderNumber} من ${customerName}`,
            link: `/admin/orders/${newOrderRef.id}`,
            isRead: false,
            createdAt: FieldValue.serverTimestamp(),
        });

        return { orderId: newOrderRef.id, orderNumber };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error("Checkout API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

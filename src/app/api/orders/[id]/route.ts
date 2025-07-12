import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth as adminAuth } from 'firebase-admin';
import { db } from '@/lib/firebase';

// Helper function to get user ID from token
async function getUserIdFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    throw new Error('Unauthorized');
  }
  
  const decodedToken = await adminAuth().verifyIdToken(token);
  return { uid: decodedToken.uid, isAdmin: decodedToken.admin === true };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { uid, isAdmin } = await getUserIdFromToken(request);
    const orderId = params.id;
    
    // Get order
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (!orderDoc.exists()) {
      return NextResponse.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }
    
    const orderData = orderDoc.data();
    
    // Check if user is authorized to view this order
    if (orderData.userId !== uid && !isAdmin) {
      return NextResponse.json(
        { error: 'غير مصرح لك بعرض هذا الطلب' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({
      id: orderDoc.id,
      ...orderData
    });
  } catch (error: any) {
    console.error('Order API Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { uid, isAdmin } = await getUserIdFromToken(request);
    const orderId = params.id;
    const updateData = await request.json();
    
    // Get order
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (!orderDoc.exists()) {
      return NextResponse.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }
    
    const orderData = orderDoc.data();
    
    // Check if user is authorized to update this order
    if (!isAdmin && orderData.userId !== uid) {
      return NextResponse.json(
        { error: 'غير مصرح لك بتحديث هذا الطلب' },
        { status: 403 }
      );
    }
    
    // Regular users can only cancel their orders
    if (!isAdmin && updateData.status && updateData.status !== 'CANCELLED') {
      return NextResponse.json(
        { error: 'غير مصرح لك بتغيير حالة الطلب' },
        { status: 403 }
      );
    }
    
    // Regular users can't cancel orders that are already shipped or delivered
    if (!isAdmin && 
        updateData.status === 'CANCELLED' && 
        (orderData.status === 'SHIPPED' || orderData.status === 'DELIVERED')) {
      return NextResponse.json(
        { error: 'لا يمكن إلغاء طلب تم شحنه أو تسليمه' },
        { status: 400 }
      );
    }
    
    // Prepare update data
    const update: any = {
      ...updateData,
      updatedAt: serverTimestamp()
    };
    
    // Add shipped/delivered dates based on status
    if (update.status === 'SHIPPED' && orderData.status !== 'SHIPPED') {
      update.shippedAt = serverTimestamp();
    } else if (update.status === 'DELIVERED' && orderData.status !== 'DELIVERED') {
      update.deliveredAt = serverTimestamp();
    }
    
    // Update order
    await updateDoc(orderRef, update);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Order API Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
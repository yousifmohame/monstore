import { NextRequest, NextResponse } from 'next/server';
import { serverTimestamp } from 'firebase/firestore';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// Helper to verify admin
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: No token provided');
  }
  
  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists || !userDoc.data()?.isAdmin) {
      throw new Error('Forbidden: Not an admin');
    }
    
    return decodedToken.uid;
  } catch (error) {
    console.error('Admin verification error:', error);
    throw new Error('Unauthorized: Invalid token');
  }
}

// GET /api/admin/products/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAdmin(request);
    const productId = params.id;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' }, 
        { status: 400 }
      );
    }

    const productRef = adminDb.collection('products').doc(productId);
    const docSnap = await productRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: 'Product not found' }, 
        { status: 404 }
      );
    }

    const productData = docSnap.data();
    return NextResponse.json({ 
      id: docSnap.id, 
      ...productData,
      // Convert Firestore Timestamps to ISO strings
      createdAt: productData?.createdAt?.toDate().toISOString(),
      updatedAt: productData?.updatedAt?.toDate().toISOString()
    });
  } catch (error: any) {
    console.error('Admin Get Product API Error:', error.message);
    return NextResponse.json(
      { error: error.message }, 
      { status: error.message.includes('Unauthorized') ? 401 : 
        error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}

// PUT /api/admin/products/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await verifyAdmin(request);
    const productId = params.id;
    const updateData = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' }, 
        { status: 400 }
      );
    }

    // Validate required fields
    if (!updateData.name || !updateData.nameAr || !updateData.categoryId) {
      return NextResponse.json(
        { error: 'Name (Arabic and English) and category are required' }, 
        { status: 400 }
      );
    }

    const productRef = adminDb.collection('products').doc(productId);
    
    // First check if product exists
    const docSnap = await productRef.get();
    if (!docSnap.exists) {
      return NextResponse.json(
        { error: 'Product not found' }, 
        { status: 404 }
      );
    }

    // Prepare update data
    const dataToUpdate = {
      ...updateData,
      updatedAt: serverTimestamp(),
      updatedBy: userId
    };

    // Remove fields that shouldn't be updated
    delete dataToUpdate.id;
    delete dataToUpdate.createdAt;
    delete dataToUpdate.createdBy;

    await productRef.update(dataToUpdate);

    // Get updated document to return
    const updatedDoc = await productRef.get();
    const updatedData = updatedDoc.data();

    return NextResponse.json({ 
      success: true, 
      message: 'Product updated successfully',
      product: {
        id: updatedDoc.id,
        ...updatedData,
        createdAt: updatedData?.createdAt?.toDate().toISOString(),
        updatedAt: updatedData?.updatedAt?.toDate().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Update Product Error:', error.message);
    return NextResponse.json(
      { error: error.message }, 
      { status: error.message.includes('Unauthorized') ? 401 : 
        error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await verifyAdmin(request);
    const productId = params.id;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' }, 
        { status: 400 }
      );
    }

    const productRef = adminDb.collection('products').doc(productId);
    
    // First check if product exists
    const docSnap = await productRef.get();
    if (!docSnap.exists) {
      return NextResponse.json(
        { error: 'Product not found' }, 
        { status: 404 }
      );
    }

    // Optional: Delete associated images from storage here
    // You would need to implement this based on your storage solution

    await productRef.delete();

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully',
      deletedBy: userId,
      deletedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Delete Product Error:', error.message);
    return NextResponse.json(
      { error: error.message }, 
      { status: error.message.includes('Unauthorized') ? 401 : 
        error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { collection, doc, setDoc, deleteDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { auth as adminAuth } from 'firebase-admin';
import { db } from '@/lib/firebase';

// Helper function to get user ID from token
async function getUserIdFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    throw new Error('Unauthorized');
  }
  
  const decodedToken = await adminAuth().verifyIdToken(token);
  return decodedToken.uid;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    
    // Get wishlist items
    const wishlistRef = collection(db, 'users', userId, 'wishlist');
    const wishlistSnapshot = await getDocs(wishlistRef);
    
    const wishlistItems: any[] = [];
    
    wishlistSnapshot.forEach((doc) => {
      wishlistItems.push({
        id: doc.id,
        userId,
        productId: doc.id,
        ...doc.data()
      });
    });
    
    return NextResponse.json(wishlistItems);
  } catch (error: any) {
    console.error('Wishlist API Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { error: 'معرف المنتج مطلوب' },
        { status: 400 }
      );
    }
    
    // Add to wishlist
    const wishlistRef = doc(db, 'users', userId, 'wishlist', productId);
    await setDoc(wishlistRef, {
      productId,
      createdAt: serverTimestamp()
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Wishlist API Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { error: 'معرف المنتج مطلوب' },
        { status: 400 }
      );
    }
    
    // Remove from wishlist
    const wishlistRef = doc(db, 'users', userId, 'wishlist', productId);
    await deleteDoc(wishlistRef);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Wishlist API Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
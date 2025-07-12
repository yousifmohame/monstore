import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    // Query categories ordered by sortOrder
    const categoriesRef = collection(db, 'products');
    const q = query(categoriesRef, orderBy('sortOrder', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const categories: any[] = [];
    
    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Categories API Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
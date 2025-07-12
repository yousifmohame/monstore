import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Get user profile from Firestore
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }
    
    const userProfile = userDoc.data();
    
    // Create user object to return
    const user = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      fullName: firebaseUser.displayName || userProfile.fullName,
      isAdmin: userProfile.isAdmin || false
    };

    // Create session cookie
    const idToken = await firebaseUser.getIdToken();
    
    // Set cookie with Firebase ID token
    const response = NextResponse.json({
      success: true,
      user,
    });

    // Set HTTP-only cookie with the token
    response.cookies.set('auth-token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login API Error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'حدث خطأ أثناء تسجيل الدخول',
      },
      { status: 401 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
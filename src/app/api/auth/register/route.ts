import { NextRequest, NextResponse } from 'next/server';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, phone, address, city, postalCode } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Update profile with display name
    await updateProfile(firebaseUser, {
      displayName: fullName
    });
    
    // Create user document in Firestore
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    await setDoc(userDocRef, {
      email,
      fullName,
      phone: phone || '',
      address: address || '',
      city: city || '',
      postalCode: postalCode || '',
      isAdmin: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Create user object to return
    const user = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      fullName: firebaseUser.displayName,
      isAdmin: false
    };

    // Get ID token for session
    const idToken = await firebaseUser.getIdToken();
    
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
    console.error('Registration error:', error);
    
    // Firebase auth error codes
    let errorMessage = error.message;
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'كلمة المرور ضعيفة جداً';
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
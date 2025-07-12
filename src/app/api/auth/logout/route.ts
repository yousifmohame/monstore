import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';

export async function POST() {
  try {
    // Sign out from Firebase
    await auth.signOut();
    
    const response = NextResponse.json({ success: true });
    
    // Clear the auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
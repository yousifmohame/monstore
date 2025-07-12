import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  writeBatch,
  serverTimestamp, // Added missing import
  FieldValue // Added missing import
} from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

// Helper function to verify admin status
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error("Unauthorized - No token provided");
  }
  
  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await adminAuth.verifyIdToken(token);
  const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
  
  if (!userDoc.exists || !userDoc.data()?.isAdmin) {
    throw new Error("Forbidden - Admin privileges required");
  }
  
  return decodedToken.uid; // Return the user ID for potential future use
}

// GET: Fetch all notifications (sorted by newest first)
export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request);
    const notificationsRef = adminDb.collection('notifications');
    const q = query(notificationsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const notifications = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Safely handle timestamp conversion
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || null,
        // Add formatted date if needed
        formattedDate: data.createdAt?.toDate?.()?.toLocaleDateString?.() || null
      };
    });

    return NextResponse.json(notifications);
  } catch (error: any) {
    const status = error.message.includes("Unauthorized") ? 401 : 
                  error.message.includes("Forbidden") ? 403 : 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch notifications" },
      { status }
    );
  }
}

// POST: Mark all notifications as read
export async function POST(request: NextRequest) {
  try {
    const adminId = await verifyAdmin(request);
    const notificationsRef = adminDb.collection('notifications');
    const q = query(notificationsRef, where('isRead', '==', false));
    const unreadSnapshot = await getDocs(q);

    if (unreadSnapshot.empty) {
      return NextResponse.json(
        { success: true, message: "No unread notifications found" },
        { status: 200 }
      );
    }

    const batch = writeBatch(adminDb);
    const now = FieldValue.serverTimestamp(); // Using FieldValue for timestamp
    
    unreadSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { 
        isRead: true,
        readAt: now, // Track when notifications were marked as read
        readBy: adminId // Track which admin marked them as read
      });
    });

    await batch.commit();

    return NextResponse.json(
      { 
        success: true, 
        message: `Marked ${unreadSnapshot.size} notifications as read`,
        count: unreadSnapshot.size
      },
      { status: 200 }
    );
  } catch (error: any) {
    const status = error.message.includes("Unauthorized") ? 401 : 
                  error.message.includes("Forbidden") ? 403 : 500;
    return NextResponse.json(
      { error: error.message || "Failed to update notifications" },
      { status }
    );
  }
}
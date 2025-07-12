import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // التعامل مع طلبات OPTIONS (Preflight) التي يرسلها المتصفح
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    response.headers.set('Access-Control-Allow-Origin', '*'); // كن أكثر تحديدًا في الإنتاج
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }

  // التعامل مع الطلبات الفعلية
  const response = NextResponse.next();
  
  response.headers.set('Access-Control-Allow-Origin', '*'); // كن أكثر تحديدًا في الإنتاج
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // **الإصلاح الرئيسي: السماح بإرسال بيانات الاعتماد (الكوكيز)**
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  
  return response;
}

// التأكد من أن الوسيط يعمل فقط على مسارات API
export const config = {
  matcher: '/api/:path*',
};

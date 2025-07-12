import React from 'react';
import Link from 'next/link';
import { Home, Search, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-500 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">الصفحة غير موجودة</h2>
          <p className="text-gray-600">عذراً، الصفحة التي تبحث عنها غير متوفرة</p>
        </div>
        
        <div className="space-y-4">
          <Link href="/">
            <button className="w-full flex items-center justify-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors">
              <Home className="h-5 w-5" />
              العودة للرئيسية
            </button>
          </Link>
          
          <Link href="/products">
            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Search className="h-5 w-5" />
              تصفح المنتجات
            </button>
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>أو يمكنك استخدام شريط البحث للعثور على ما تبحث عنه</p>
        </div>
      </div>
    </div>
  );
}
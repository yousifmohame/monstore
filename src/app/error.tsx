'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">خطأ في التطبيق</h1>
          <p className="text-gray-600">حدث خطأ غير متوقع</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-red-800 mb-2">تفاصيل الخطأ:</h3>
          <pre className="text-sm text-red-700 whitespace-pre-wrap break-words">
            {error.message}
          </pre>
          {error.digest && (
            <p className="text-xs text-red-600 mt-2">
              Digest: {error.digest}
            </p>
          )}
        </div>
        
        <button
          onClick={reset}
          className="flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors mx-auto"
        >
          <RefreshCw className="h-4 w-4" />
          إعادة المحاولة
        </button>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>إذا استمر الخطأ، يرجى تحديث الصفحة أو الاتصال بالدعم الفني</p>
        </div>
      </div>
    </div>
  );
}
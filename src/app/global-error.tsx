'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Global Application Error:', error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 font-arabic">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <AlertTriangle className="h-20 w-20 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">خطأ عام في النظام</h1>
              <p className="text-gray-600">حدث خطأ خطير في التطبيق</p>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-red-800 mb-2">معلومات الخطأ:</h3>
              <div className="space-y-2">
                <div>
                  <strong>الرسالة:</strong>
                  <pre className="text-sm text-red-700 whitespace-pre-wrap break-words mt-1">
                    {error.message}
                  </pre>
                </div>
                {error.stack && (
                  <div>
                    <strong>Stack Trace:</strong>
                    <pre className="text-xs text-red-600 whitespace-pre-wrap break-words mt-1 max-h-32 overflow-y-auto">
                      {error.stack}
                    </pre>
                  </div>
                )}
                {error.digest && (
                  <div>
                    <strong>Digest:</strong>
                    <span className="text-xs text-red-600 ml-2">{error.digest}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={reset}
                className="flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                إعادة المحاولة
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Home className="h-4 w-4" />
                العودة للرئيسية
              </button>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>يرجى نسخ معلومات الخطأ أعلاه وإرسالها للدعم الفني</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
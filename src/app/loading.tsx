import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="loading-dots mb-4">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p className="text-xl text-gray-600 font-medium">جاري التحميل...</p>
        <p className="text-sm text-gray-500 mt-2">يرجى الانتظار</p>
      </div>
    </div>
  );
}
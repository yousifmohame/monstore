import './globals.css'
import type { Metadata } from 'next'
import AuthProvider from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'كيوتاكو - متجر الأنمي والمانجا الأول',
  description: 'اكتشف أفضل منتجات الأنمي والمانجا من ملابس وحقائب وأغطية هواتف وتماثيل ولعب وإكسسوارات. توصيل سريع ودفع آمن وخدمة عملاء ممتازة.',
  keywords: 'أنمي, مانجا, منتجات أنمي, ملابس أنمي, تماثيل أنمي, حقائب أنمي, أغطية هواتف أنمي, لعب أنمي, متجر عربي, كيوتاكو',
  authors: [{ name: 'فريق كيوتاكو' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#f43f5e" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-arabic">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
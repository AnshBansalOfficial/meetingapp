import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Geist, Geist_Mono } from 'next/font/google'
import { ToastProvider } from '@/lib/toast-context'
import { ToastContainer } from '@/components/toast-container'

const _geistSans = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fireflies',
  description: 'AI Assistant for Meetings',
  generator: 'v0.app',
  icons: {
    icon: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#1e1e2e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-slate-950">
      <body className="antialiased bg-slate-950 text-slate-100">
        <ToastProvider>
          {children}
          <ToastContainer />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ToastProvider>
      </body>
    </html>
  )
}

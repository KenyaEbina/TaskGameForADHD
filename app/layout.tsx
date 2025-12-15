import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Time Attack Task Manager',
  description: 'ADHD向けタイムアタック・タスク管理ツール',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <main>{children}</main>
        <Navigation />
      </body>
    </html>
  )
}

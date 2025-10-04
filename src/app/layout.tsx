import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppKitProvider } from '@/lib/wagmi'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GeoQuest - Blockchain Geography Quiz',
  description: 'A geography quiz application on the blockchain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppKitProvider>
          {children}
        </AppKitProvider>
      </body>
    </html>
  )
}
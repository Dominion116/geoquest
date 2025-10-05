import type { Metadata } from 'next'
import './globals.css'
import { AppKitProvider } from '../lib/wagmi'

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
      <body className="font-sans">
        <AppKitProvider>
          {children}
        </AppKitProvider>
      </body>
    </html>
  )
}
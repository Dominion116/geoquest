'use client'

import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { base } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import React from 'react'

// 1. Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'YOUR_PROJECT_ID'

// 2. Create metadata
const metadata = {
  name: 'GeoQuest',
  description: 'A geography quiz application on the blockchain',
  url: 'https://geoquest.app',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Set the networks
const networks = [base]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [base],
  projectId,
  metadata,
  features: {
    analytics: true,
    email: false, // Disable email login if not needed
    socials: [], // Add social logins if needed: ['google', 'github', etc.]
  },
  themeMode: 'dark', // Match your app theme
  themeVariables: {
    '--w3m-accent': '#8b5cf6', // Purple accent to match your gradient
    '--w3m-border-radius-master': '12px',
  }
})

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }))

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
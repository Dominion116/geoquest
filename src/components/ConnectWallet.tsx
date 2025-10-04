'use client'

import { Compass } from 'lucide-react'

export default function ConnectWallet() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 max-w-md">
          <Compass className="w-20 h-20 text-white mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">GeoQuest</h1>
          <p className="text-white/70 mb-8">Connect your wallet to start the geography quiz on the blockchain</p>
          <appkit-button />
        </div>
      </div>
    </div>
  )
}
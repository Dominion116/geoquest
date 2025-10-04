'use client'

import { useState } from 'react'
import { Shield, Loader2 } from 'lucide-react'

interface OwnerPanelProps {
  onUpdateCID: (newCID: string) => Promise<void>
  isUpdating: boolean
}

export default function OwnerPanel({ onUpdateCID, isUpdating }: OwnerPanelProps) {
  const [newCID, setNewCID] = useState('')

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCID.trim()) return
    onUpdateCID(newCID)
    setNewCID('')
  }

  return (
    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-2xl p-6 border border-yellow-500/40">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">Owner Panel</h2>
      </div>
      <div className="space-y-3">
        <input
          type="text"
          value={newCID}
          onChange={(e) => setNewCID(e.target.value)}
          placeholder="Enter new IPFS CID..."
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition-colors"
        />
        <button
          onClick={handleUpdate}
          disabled={isUpdating || !newCID.trim()}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Updating...
            </>
          ) : (
            'Update CID'
          )}
        </button>
      </div>
    </div>
  )
}
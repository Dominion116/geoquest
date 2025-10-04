'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Compass, History } from 'lucide-react'
import QuestionCard from '@/components/QuestionCard'
import OwnerPanel from '@/components/OwnerPanel'
import Toast from '@/components/Toast'
import ConnectWallet from '@/components/ConnectWallet'
import { useGeoQuestContract, useContractData } from '@/hooks/useContract'
import { QUESTIONS } from '@/lib/contract'

interface ToastState {
  message: string
  type: 'success' | 'error' | 'loading'
}

export default function Home() {
  const { address, isConnected } = useAccount()
  const [toast, setToast] = useState<ToastState | null>(null)
  const { cid, owner } = useContractData()
  const { submitAnswer, updateCID, isPending, isConfirming, isConfirmed } = useGeoQuestContract()

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase()

  const handleSubmitAnswer = async (questionId: number, answer: string) => {
    try {
      setToast({ message: 'Submitting answer...', type: 'loading' })
      await submitAnswer(questionId, answer)
    } catch (error) {
      setToast({ message: 'Failed to submit answer', type: 'error' })
    }
  }

  const handleUpdateCID = async (newCID: string) => {
    try {
      setToast({ message: 'Updating CID...', type: 'loading' })
      await updateCID(newCID)
    } catch (error) {
      setToast({ message: 'Failed to update CID', type: 'error' })
    }
  }

  useEffect(() => {
    if (isConfirmed) {
      setToast({ message: 'Transaction confirmed!', type: 'success' })
    }
  }, [isConfirmed])

  if (!isConnected) {
    return <ConnectWallet />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 md:p-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Compass className="w-10 h-10 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">GeoQuest</h1>
                <p className="text-white/60 text-sm">Blockchain Geography Quiz</p>
              </div>
            </div>
            <appkit-button />
          </div>
        </header>

        {cid && (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/10">
            <p className="text-white/60 text-sm">
              Current IPFS CID: <span className="text-white font-mono text-xs">{String(cid)}</span>
            </p>
          </div>
        )}

        {isOwner && (
          <div className="mb-6">
            <OwnerPanel onUpdateCID={handleUpdateCID} isUpdating={isPending || isConfirming} />
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <History className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Quiz Questions</h2>
          </div>
          
          {QUESTIONS.map((q) => (
            <QuestionCard
              key={q.id}
              question={q.text}
              questionId={q.id}
              onSubmit={handleSubmitAnswer}
              userAddress={address}
              isSubmitting={isPending || isConfirming}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Compass, History, Loader2 } from 'lucide-react'
import QuestionCard from '@/components/QuestionCard'
import OwnerPanel from '@/components/OwnerPanel'
import Toast from '@/components/Toast'
import ConnectWallet from '@/components/ConnectWallet'
import { useGeoQuestContract, useContractData } from '@/hooks/useContract'

interface Question {
  question: string
  answer: string
}

interface ToastState {
  message: string
  type: 'success' | 'error' | 'loading'
}

export default function Home() {
  const { address, isConnected } = useAccount()
  const [toast, setToast] = useState<ToastState | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)
  const { cid, owner } = useContractData()
  const { submitAnswer, updateCID, isPending, isConfirming, isConfirmed } = useGeoQuestContract()

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase()

  // Fetch questions from IPFS when CID changes
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!cid) return

      setIsLoadingQuestions(true)
      try {
        // Try multiple IPFS gateways for reliability
        const gateways = [
          `https://ipfs.io/ipfs/${cid}`,
          `https://gateway.pinata.cloud/ipfs/${cid}`,
          `https://cloudflare-ipfs.com/ipfs/${cid}`,
        ]

        let data = null
        let lastError = null

        for (const gateway of gateways) {
          try {
            const response = await fetch(gateway)
            if (response.ok) {
              data = await response.json()
              break
            }
          } catch (err) {
            lastError = err
            continue
          }
        }

        if (!data) {
          throw lastError || new Error('Failed to fetch from all gateways')
        }

        // Handle the data structure from your IPFS
        // Your data is an array of {question, answer} objects
        if (Array.isArray(data)) {
          setQuestions(data)
        } else {
          throw new Error('Invalid data format')
        }
      } catch (error) {
        console.error('Error fetching questions:', error)
        setToast({ 
          message: 'Failed to load questions from IPFS', 
          type: 'error' 
        })
        // Keep existing questions or show empty state
      } finally {
        setIsLoadingQuestions(false)
      }
    }

    fetchQuestions()
  }, [cid])

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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex items-center justify-between flex-wrap gap-4">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-white/60 text-sm">
                IPFS CID: <span className="text-white font-mono text-xs break-all">{String(cid)}</span>
              </p>
              <a 
                href={`https://ipfs.io/ipfs/${cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
              >
                View on IPFS →
              </a>
            </div>
          </div>
        )}

        {isOwner && (
          <div className="mb-6">
            <OwnerPanel onUpdateCID={handleUpdateCID} isUpdating={isPending || isConfirming} />
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <History className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">Quiz Questions</h2>
            </div>
            {questions.length > 0 && (
              <div className="bg-white/10 px-4 py-2 rounded-full">
                <span className="text-white font-medium">{questions.length} Questions</span>
              </div>
            )}
          </div>
          
          {isLoadingQuestions ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
              <span className="ml-3 text-white">Loading questions from IPFS...</span>
            </div>
          ) : questions.length > 0 ? (
            questions.map((q, index) => (
              <QuestionCard
                key={index}
                question={q.question}
                questionId={index + 1} // Using index + 1 as question ID
                onSubmit={handleSubmitAnswer}
                userAddress={address}
                isSubmitting={isPending || isConfirming}
              />
            ))
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20 text-center">
              <Compass className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Questions Available</h3>
              <p className="text-white/60">
                {cid ? 'Unable to load questions from IPFS. Please check the CID.' : 'No IPFS CID set. Owner needs to update the CID.'}
              </p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        {questions.length > 0 && (
          <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Quiz Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{questions.length}</div>
                <div className="text-white/60 text-sm mt-1">Total Questions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">
                  {questions.filter((_, i) => {
                    // This would need actual submission check
                    return false
                  }).length}
                </div>
                <div className="text-white/60 text-sm mt-1">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {questions.length - questions.filter((_, i) => {
                    return false
                  }).length}
                </div>
                <div className="text-white/60 text-sm mt-1">Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">0%</div>
                <div className="text-white/60 text-sm mt-1">Progress</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
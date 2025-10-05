'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Compass, History, Shield, Loader2, CheckCircle, XCircle, Award, TrendingUp, Globe, MapPin, Send } from 'lucide-react'
import { useGeoQuestContract, useContractData } from '../hooks/useContract'
import { useSubmission } from '../hooks/useContract'

interface Question {
  question: string
  answer: string
}

interface ToastState {
  message: string
  type: 'success' | 'error' | 'loading'
}

// Toast Component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'loading'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const config = {
    success: { icon: CheckCircle, bg: 'bg-emerald-500', text: 'Success!' },
    error: { icon: XCircle, bg: 'bg-red-500', text: 'Error!' },
    loading: { icon: Loader2, bg: 'bg-blue-500', text: 'Processing...' }
  }

  const { icon: Icon, bg } = config[type]

  return (
    <div className={`fixed top-4 right-4 left-4 sm:left-auto sm:min-w-[300px] sm:max-w-[400px] ${bg} text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl flex items-center gap-3 z-50 backdrop-blur-xl border border-white/20 animate-slide-in`}>
      <Icon className={`w-5 h-5 flex-shrink-0 ${type === 'loading' ? 'animate-spin' : ''}`} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{config[type].text}</p>
        <p className="text-xs text-white/80 truncate">{message}</p>
      </div>
    </div>
  )
}

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: number | string; color: string }) => (
  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-white/40 transition-all group hover:scale-105">
    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
    </div>
    <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{value}</div>
    <div className="text-xs sm:text-sm text-white/60">{label}</div>
  </div>
)

// Question Card Component
const QuestionCard = ({ question, questionId, onSubmit, userAddress, isSubmitting }: {
  question: string
  questionId: number
  onSubmit: (id: number, ans: string) => Promise<void>
  userAddress: string | undefined
  isSubmitting: boolean
}) => {
  const [answer, setAnswer] = useState('')
  const { answer: previousAnswer, timestamp, exists } = useSubmission(userAddress, questionId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer.trim()) return
    onSubmit(questionId, answer)
    setAnswer('')
  }

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl sm:rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 hover:border-white/40 transition-all">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl blur-md opacity-50" />
            <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-2xl">{questionId}</span>
            </div>
          </div>
          
          <div className="flex-1 w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">{question}</h3>
              {exists && (
                <div className="flex-shrink-0">
                  <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-xs sm:text-sm font-medium">Completed</span>
                  </div>
                </div>
              )}
            </div>
            
            {exists ? (
              <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 sm:gap-3 mb-3">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 flex-shrink-0" />
                  <span className="text-emerald-400 font-semibold text-base sm:text-lg">Your Answer</span>
                </div>
                <p className="text-white text-base sm:text-lg font-medium mb-3 break-words">{previousAnswer}</p>
                <div className="flex items-center gap-2 text-white/50 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="truncate">{timestamp && new Date(Number(timestamp) * 1000).toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-white/5 border-2 border-white/10 rounded-xl sm:rounded-2xl text-white text-base sm:text-lg placeholder-white/30 focus:outline-none focus:border-purple-500 transition-all focus:bg-white/10"
                  />
                  <MapPin className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/20" />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !answer.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:from-purple-600 hover:via-purple-700 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 transition-all shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Submit Answer</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Owner Panel Component
const OwnerPanel = ({ onUpdateCID, isUpdating }: { onUpdateCID: (cid: string) => Promise<void>; isUpdating: boolean }) => {
  const [newCID, setNewCID] = useState('')

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCID.trim()) return
    onUpdateCID(newCID)
    setNewCID('')
  }

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl sm:rounded-3xl blur-xl" />
      <div className="relative bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-yellow-500/40">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl sm:rounded-2xl p-2 sm:p-3 w-fit">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Owner Panel</h2>
            <p className="text-white/60 text-xs sm:text-sm">Update quiz questions via IPFS CID</p>
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <input
            type="text"
            value={newCID}
            onChange={(e) => setNewCID(e.target.value)}
            placeholder="Enter new IPFS CID..."
            className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-white/5 border-2 border-white/10 rounded-xl sm:rounded-2xl text-white text-base sm:text-lg placeholder-white/30 focus:outline-none focus:border-yellow-500 transition-all"
          />
          <button
            onClick={handleUpdate}
            disabled={isUpdating || !newCID.trim()}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 transition-all shadow-lg hover:shadow-yellow-500/50 hover:scale-[1.02]"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Update CID</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Connect Wallet Component
const ConnectWallet = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
    <div className="text-center">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-white/20 max-w-md">
        <Compass className="w-16 h-16 sm:w-20 sm:h-20 text-white mx-auto mb-6" />
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">GeoQuest</h1>
        <p className="text-white/70 mb-8 text-sm sm:text-base">Connect your wallet to start the geography quiz on the blockchain</p>
        <appkit-button />
      </div>
    </div>
  </div>
)

// Main Component
export default function Home() {
  const { address, isConnected } = useAccount()
  const [toast, setToast] = useState<ToastState | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)
  const { cid, owner } = useContractData()
  const { submitAnswer, updateCID, isPending, isConfirming, isConfirmed } = useGeoQuestContract()

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase()

  // Fetch questions from IPFS
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!cid) return

      setIsLoadingQuestions(true)
      try {
        const gateways = [
          `https://ipfs.io/ipfs/${cid}`,
          `https://gateway.pinata.cloud/ipfs/${cid}`,
          `https://cloudflare-ipfs.com/ipfs/${cid}`,
        ]

        let data = null
        for (const gateway of gateways) {
          try {
            const response = await fetch(gateway)
            if (response.ok) {
              data = await response.json()
              break
            }
          } catch {
            continue
          }
        }

        if (data && Array.isArray(data)) {
          setQuestions(data)
        }
      } catch (error) {
        console.error('Error fetching questions:', error)
        setToast({ message: 'Failed to load questions from IPFS', type: 'error' })
      } finally {
        setIsLoadingQuestions(false)
      }
    }

    fetchQuestions()
  }, [cid])

  const handleSubmitAnswer = async (questionId: number, answer: string) => {
    try {
      setToast({ message: 'Submitting answer to blockchain...', type: 'loading' })
      await submitAnswer(questionId, answer)
    } catch (error) {
      setToast({ message: 'Failed to submit answer', type: 'error' })
    }
  }

  const handleUpdateCID = async (newCID: string) => {
    try {
      setToast({ message: 'Updating CID on blockchain...', type: 'loading' })
      await updateCID(newCID)
    } catch (error) {
      setToast({ message: 'Failed to update CID', type: 'error' })
    }
  }

  useEffect(() => {
    if (isConfirmed) {
      setToast({ message: 'Transaction confirmed successfully!', type: 'success' })
    }
  }, [isConfirmed])

  if (!isConnected) {
    return <ConnectWallet />
  }

  const totalQuestions = questions.length
  const progress = totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6 sm:mb-8 lg:mb-12">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl lg:rounded-3xl blur-md sm:blur-xl opacity-50" />
                  <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl lg:rounded-3xl p-2 sm:p-3 lg:p-4">
                    <Compass className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-0 sm:mb-2">GeoQuest</h1>
                  <p className="text-white/60 text-xs sm:text-sm lg:text-lg hidden sm:block">Blockchain Geography Quiz</p>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
                  <div className="text-white/60 text-xs mb-1">Connected Wallet</div>
                  <div className="text-white font-mono font-semibold">{address?.slice(0, 6)}...{address?.slice(-4)}</div>
                </div>
                <appkit-button />
              </div>
              
              <div className="lg:hidden flex-shrink-0">
                <appkit-button />
              </div>
            </div>
            
            <div className="lg:hidden mt-4 pt-4 border-t border-white/10">
              <div className="text-white/60 text-xs mb-1">Connected Wallet</div>
              <div className="text-white font-mono text-sm truncate">{address}</div>
            </div>
          </div>
        </header>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-12">
          <StatsCard icon={Globe} label="Total Questions" value={totalQuestions} color="from-blue-500 to-cyan-500" />
          <StatsCard icon={CheckCircle} label="Completed" value={completedCount} color="from-emerald-500 to-green-500" />
          <StatsCard icon={TrendingUp} label="Remaining" value={totalQuestions - completedCount} color="from-purple-500 to-pink-500" />
          <StatsCard icon={Award} label="Progress" value={`${progress}%`} color="from-yellow-500 to-orange-500" />
        </div>

        {/* IPFS CID Info */}
        {cid && (
          <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="bg-purple-500/20 rounded-lg sm:rounded-xl p-2 sm:p-3 flex-shrink-0">
                  <History className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-white/60 text-xs sm:text-sm mb-1">Current IPFS CID</div>
                  <div className="text-white font-mono text-xs sm:text-sm lg:text-base break-all">{String(cid)}</div>
                </div>
              </div>
              <a 
                href={`https://ipfs.io/ipfs/${cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2 w-full sm:w-auto flex-shrink-0"
              >
                <span>View on IPFS</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* Owner Panel */}
        {isOwner && (
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <OwnerPanel onUpdateCID={handleUpdateCID} isUpdating={isPending || isConfirming} />
          </div>
        )}

        {/* Questions Section */}
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="flex items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl p-2 sm:p-3">
                <History className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Quiz Questions</h2>
            </div>
            {questions.length > 0 && (
              <div className="bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                <span className="text-white font-medium text-sm sm:text-base">{questions.length}</span>
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
                questionId={index + 1}
                onSubmit={handleSubmitAnswer}
                userAddress={address}
                isSubmitting={isPending || isConfirming}
              />
            ))
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 sm:p-12 border border-white/20 text-center">
              <Compass className="w-12 h-12 sm:w-16 sm:h-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Questions Available</h3>
              <p className="text-white/60 text-sm sm:text-base">
                {cid ? 'Unable to load questions from IPFS. Please check the CID.' : 'No IPFS CID set. Owner needs to update the CID.'}
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
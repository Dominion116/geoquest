'use client'

import { useState } from 'react'
import { Send, CheckCircle, Loader2 } from 'lucide-react'
import { useSubmission } from '../hooks/useContract'

interface QuestionCardProps {
  question: string
  questionId: number
  onSubmit: (questionId: number, answer: string) => Promise<void>
  userAddress: string | undefined
  isSubmitting: boolean
}

export default function QuestionCard({ 
  question, 
  questionId, 
  onSubmit, 
  userAddress,
  isSubmitting 
}: QuestionCardProps) {
  const [answer, setAnswer] = useState('')
  const { answer: previousAnswer, timestamp, exists } = useSubmission(userAddress, questionId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer.trim()) return
    onSubmit(questionId, answer)
    setAnswer('')
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all">
      <div className="flex items-start gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">{questionId}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-3">{question}</h3>
          
          {exists ? (
            <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">Answer Submitted</span>
              </div>
              <p className="text-white/80 text-sm">Your answer: <span className="font-medium">{previousAnswer}</span></p>
              <p className="text-white/60 text-xs mt-1">
                {timestamp && new Date(Number(timestamp) * 1000).toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer..."
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !answer.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Answer
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
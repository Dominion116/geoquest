'use client'

import { useEffect } from 'react'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'loading'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    loading: <Loader2 className="w-5 h-5 animate-spin" />
  }

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    loading: 'bg-blue-500'
  }

  return (
    <div className={`fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-in`}>
      {icons[type]}
      <span>{message}</span>
    </div>
  )
}
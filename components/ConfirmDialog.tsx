'use client'

import { Card } from './UI'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <div className="flex items-center gap-3 mb-4">
          {isDangerous && (
            <AlertTriangle className="w-5 h-5 text-[#c95a5a]" />
          )}
          <h2 className="text-lg font-semibold text-[#f5f0e8]">{title}</h2>
        </div>
        <p className="text-sm text-[#b8ada0] mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded text-sm font-medium border border-[#3a2020] text-[#b8ada0] hover:text-[#f5f0e8] hover:border-[#5a3030] disabled:opacity-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded text-sm font-medium disabled:opacity-50 transition-colors ${
              isDangerous
                ? 'bg-[#c95a5a] text-[#fff0f0] hover:bg-[#d96a6a]'
                : 'bg-[#c9a227] text-[#1a0808] hover:bg-[#dbb237]'
            }`}
          >
            {isLoading ? 'Loading...' : confirmText}
          </button>
        </div>
      </Card>
    </div>
  )
}

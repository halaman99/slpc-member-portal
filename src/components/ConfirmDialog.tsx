'use client'

import { useState } from 'react'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
  onConfirm: () => Promise<void> | void
  onCancel?: () => void
}

export function ConfirmDialog({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    onCancel?.()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={handleCancel}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-md transition"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition disabled:opacity-50 ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Loading...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export function useConfirmDialog() {
  const [dialogProps, setDialogProps] = useState<
    ConfirmDialogProps & { isOpen: boolean }
  >({
    title: '',
    message: '',
    onConfirm: async () => {},
    isOpen: false,
  })

  const confirm = (props: Omit<ConfirmDialogProps, 'isOpen'>) => {
    setDialogProps({
      ...props,
      isOpen: true,
    })
  }

  const Dialog = () =>
    dialogProps.isOpen ? (
      <ConfirmDialog
        {...dialogProps}
        onCancel={() =>
          setDialogProps((p) => ({ ...p, isOpen: false }))
        }
      />
    ) : null

  return { confirm, Dialog }
}

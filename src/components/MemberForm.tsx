'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { MemberFormData } from '@/lib/types'

interface MemberFormProps {
  initialData?: MemberFormData
  onSubmit: (data: MemberFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const ROLES = ['Member', 'Server', 'Cantor', 'Sacristan']
const COLORS = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-yellow-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-cyan-500',
]

export function MemberForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: MemberFormProps) {
  const [formData, setFormData] = useState<MemberFormData>(
    initialData || {
      full_name: '',
      email: '',
      phone: '',
      role: 'Member',
      avatar_color: COLORS[0],
    }
  )
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.full_name.trim()) {
      setError('Full name is required')
      return
    }

    if (!formData.email.trim()) {
      setError('Email is required')
      return
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {initialData ? 'Edit Member' : 'Add Member'}
          </h2>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      avatar_color: color,
                    }))
                  }
                  className={`h-8 w-8 rounded-full ${color} ${
                    formData.avatar_color === color
                      ? 'ring-2 ring-offset-2 ring-blue-500'
                      : ''
                  }`}
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md transition"
            >
              {isLoading
                ? 'Saving...'
                : initialData
                  ? 'Update'
                  : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

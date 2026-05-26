'use client'

import { useState } from 'react'
import { Card } from './UI'
import { MemberFormData } from '@/lib/types'
import { isValidEmail } from '@/lib/admin-api'
import { X } from 'lucide-react'

interface MemberFormProps {
  onSubmit: (data: MemberFormData) => Promise<void>
  onCancel: () => void
  initialData?: MemberFormData
  isLoading?: boolean
  roles?: string[]
}

export function MemberForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  roles = ['Server', 'Senior Server', 'Head Server', 'Mentor'],
}: MemberFormProps) {
  const [formData, setFormData] = useState<MemberFormData>(
    initialData || {
      full_name: '',
      email: '',
      phone: '',
      role: 'Server',
    }
  )

  const [errors, setErrors] = useState<Partial<Record<keyof MemberFormData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await onSubmit(formData)
    } catch (err) {
      console.error('Form submission error:', err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#f5f0e8]">
            {initialData ? 'Edit Member' : 'New Member'}
          </h2>
          <button
            onClick={onCancel}
            className="text-[#8a6070] hover:text-[#f5f0e8]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#c8b8a0] mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              placeholder="Enter full name"
              className={`w-full px-3 py-2 bg-[#3a2020] border rounded text-sm text-[#f5f0e8] placeholder-[#8a6070] focus:outline-none ${
                errors.full_name
                  ? 'border-[#c95a5a]'
                  : 'border-[#5a3030] focus:border-[#c9a227]'
              }`}
              autoFocus
            />
            {errors.full_name && (
              <p className="text-xs text-[#c95a5a] mt-1">{errors.full_name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c8b8a0] mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter email"
              className={`w-full px-3 py-2 bg-[#3a2020] border rounded text-sm text-[#f5f0e8] placeholder-[#8a6070] focus:outline-none ${
                errors.email
                  ? 'border-[#c95a5a]'
                  : 'border-[#5a3030] focus:border-[#c9a227]'
              }`}
            />
            {errors.email && (
              <p className="text-xs text-[#c95a5a] mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c8b8a0] mb-1">
              Phone (Optional)
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Enter phone number"
              className="w-full px-3 py-2 bg-[#3a2020] border border-[#5a3030] rounded text-sm text-[#f5f0e8] placeholder-[#8a6070] focus:outline-none focus:border-[#c9a227]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c8b8a0] mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className={`w-full px-3 py-2 bg-[#3a2020] border rounded text-sm text-[#f5f0e8] focus:outline-none ${
                errors.role
                  ? 'border-[#c95a5a]'
                  : 'border-[#5a3030] focus:border-[#c9a227]'
              }`}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-xs text-[#c95a5a] mt-1">{errors.role}</p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 rounded text-sm font-medium border border-[#3a2020] text-[#b8ada0] hover:text-[#f5f0e8] hover:border-[#5a3030] disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded text-sm font-medium bg-[#c9a227] text-[#1a0808] hover:bg-[#dbb237] disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}

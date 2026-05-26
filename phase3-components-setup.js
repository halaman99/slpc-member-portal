#!/usr/bin/env node
/**
 * Phase 3 Components Setup Script
 * Creates all form components needed for Phase 3
 */

const fs = require('fs');
const path = require('path');

let count = 0;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
  console.log(`✓ ${++count}. ${path.relative(process.cwd(), filePath)}`);
}

const appDir = path.join(__dirname, 'app', 'src');

console.log('Phase 3 Components Setup - Creating form components...\n');

// ============================================================================
// DUTY FORM COMPONENT
// ============================================================================
writeFile(
  path.join(appDir, 'components', 'DutyForm.tsx'),
  `'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { DutyFormData, Member } from '@/lib/types'

interface DutyFormProps {
  members: Member[]
  initialData?: DutyFormData
  onSubmit: (data: DutyFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function DutyForm({
  members,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: DutyFormProps) {
  const [formData, setFormData] = useState<DutyFormData>(
    initialData || {
      member_id: '',
      date: '',
      time: '',
      mass_type: 'Sunday Mass',
      role: 'Server',
      status: 'scheduled',
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

    if (!formData.member_id) {
      setError('Please select a member')
      return
    }
    if (!formData.date) {
      setError('Date is required')
      return
    }
    if (!formData.time) {
      setError('Time is required')
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
            {initialData ? 'Edit Duty' : 'Schedule Duty'}
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
              Member *
            </label>
            <select
              name="member_id"
              value={formData.member_id}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time *
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mass Type
            </label>
            <input
              type="text"
              name="mass_type"
              value={formData.mass_type}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="e.g., Sunday Mass"
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
              <option>Server</option>
              <option>Cantor</option>
              <option>Sacristan</option>
              <option>Lector</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status || 'scheduled'}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="scheduled">Scheduled</option>
              <option value="served">Served</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="standby">Standby</option>
            </select>
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
              {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
`
);

// ============================================================================
// EVENT FORM COMPONENT
// ============================================================================
writeFile(
  path.join(appDir, 'components', 'EventForm.tsx'),
  `'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { EventFormData } from '@/lib/types'

interface EventFormProps {
  initialData?: EventFormData
  onSubmit: (data: EventFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function EventForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>(
    initialData || {
      title: '',
      date: '',
      description: '',
      location: '',
      event_type: 'feast',
    }
  )
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }
    if (!formData.date) {
      setError('Date is required')
      return
    }
    if (!formData.location.trim()) {
      setError('Location is required')
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
            {initialData ? 'Edit Event' : 'Create Event'}
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
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Event title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="feast">Feast</option>
              <option value="training">Training</option>
              <option value="recollection">Recollection</option>
              <option value="outreach">Outreach</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Event location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Event description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
              {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
`
);

// ============================================================================
// INVITE ADMIN FORM COMPONENT
// ============================================================================
writeFile(
  path.join(appDir, 'components', 'InviteAdminForm.tsx'),
  `'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface InviteAdminFormProps {
  onSubmit: (email: string) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function InviteAdminForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: InviteAdminFormProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    try {
      await onSubmit(email)
      setEmail('')
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
      <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Send Admin Invitation</h2>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          Send an invitation to promote a member to admin status
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="member@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
              {isLoading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
`
);

console.log(`\n✓ Created ${count} component files!\n`);
console.log('Phase 3 Form Components Created:');
console.log('  ✓ src/components/DutyForm.tsx');
console.log('  ✓ src/components/EventForm.tsx');
console.log('  ✓ src/components/InviteAdminForm.tsx');
console.log('\nNext: Create API routes');
console.log('Run: node phase3-api-setup.js');

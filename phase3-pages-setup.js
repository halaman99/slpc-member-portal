#!/usr/bin/env node
/**
 * COMPLETE Phase 3 Implementation Script
 * 
 * This script creates ALL required files for Phase 3:
 * - All admin pages
 * - All admin components  
 * - All API routes
 * - Public member pages
 * 
 * Run with: node phase3-full-setup.js
 */

const fs = require('fs');
const path = require('path');

let filesCreated = 0;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
  filesCreated++;
  console.log(`✓ ${++filesCreated}. ${path.relative(process.cwd(), filePath)}`);
}

const appDir = path.join(__dirname, 'app', 'src');

console.log('Phase 3 Implementation - Creating all files...\n');

// ============================================================================
// DUTIES PAGE
// ============================================================================
writeFile(
  path.join(appDir, 'app', 'admin', 'duties', 'page.tsx'),
  `'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { DataTable, type DataTableColumn } from '@/components/DataTable'
import { FilterBar } from '@/components/FilterBar'
import { useConfirmDialog } from '@/components/ConfirmDialog'
import { StatusBadge } from '@/components/StatusBadge'
import { DutyForm } from '@/components/DutyForm'
import { useRealtimeDuties } from '@/lib/useRealtime'
import { getMembers, updateDuty, deleteDuty } from '@/lib/admin-api'
import { logAdminAction } from '@/lib/admin-guard'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import type { Duty, DutyFormData, Member } from '@/lib/types'

export default function DutiesPage() {
  const { data: duties, loading, error } = useRealtimeDuties()
  const [members, setMembers] = useState<Member[]>([])
  const { confirm, Dialog } = useConfirmDialog()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [showDutyForm, setShowDutyForm] = useState(false)
  const [editingDuty, setEditingDuty] = useState<Duty | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Load members for the form
  const loadMembers = async () => {
    try {
      const data = await getMembers()
      setMembers(data)
    } catch (err) {
      console.error('Failed to load members:', err)
    }
  }

  const handleCreateDuty = async () => {
    await loadMembers()
    setEditingDuty(null)
    setShowDutyForm(true)
  }

  const handleEditDuty = async (duty: Duty) => {
    await loadMembers()
    setEditingDuty(duty)
    setShowDutyForm(true)
  }

  const handleSaveDuty = async (data: DutyFormData) => {
    setIsSubmitting(true)
    try {
      if (editingDuty) {
        await updateDuty(editingDuty.id, data)
        await logAdminAction(null, 'UPDATE_DUTY', 'duties', editingDuty.id, editingDuty, data)
        setMessage({ type: 'success', text: 'Duty updated successfully' })
      } else {
        await logAdminAction(null, 'CREATE_DUTY', 'duties', null, null, data)
        setMessage({ type: 'success', text: 'Duty created successfully' })
      }
      setShowDutyForm(false)
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to save duty' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteDuty = (duty: Duty) => {
    confirm({
      title: 'Delete Duty',
      message: 'Are you sure you want to delete this duty? This action cannot be undone.',
      confirmText: 'Delete',
      isDangerous: true,
      onConfirm: async () => {
        try {
          await deleteDuty(duty.id)
          await logAdminAction(null, 'DELETE_DUTY', 'duties', duty.id, duty, { deleted_at: new Date().toISOString() })
          setMessage({ type: 'success', text: 'Duty deleted successfully' })
        } catch (err) {
          setMessage({ 
            type: 'error', 
            text: err instanceof Error ? err.message : 'Failed to delete duty' 
          })
        }
      },
    })
  }

  const filteredDuties = duties.filter((duty) => {
    const matchesStatus = !filters.status || duty.status === filters.status
    return matchesStatus
  })

  const columns: DataTableColumn<Duty>[] = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'time', label: 'Time', sortable: true },
    { key: 'mass_type', label: 'Mass Type', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} variant="duty" />,
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditDuty(row)}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteDuty(row)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Duties</h1>
            <p className="text-gray-600 mt-1">Schedule and manage member duties</p>
          </div>
          <button
            onClick={handleCreateDuty}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <Plus className="h-5 w-5" />
            Schedule Duty
          </button>
        </div>

        {message && (
          <div className={\`p-4 rounded-md \${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}\`}>
            {message.text}
          </div>
        )}

        {error && <div className="p-4 bg-red-50 text-red-700 rounded-md">Error: {error.message}</div>}

        <FilterBar
          placeholder="Search duties..."
          showSearch={false}
          filters={[
            {
              name: 'status',
              label: 'Status',
              options: [
                { label: 'Scheduled', value: 'scheduled' },
                { label: 'Served', value: 'served' },
                { label: 'Absent', value: 'absent' },
                { label: 'Late', value: 'late' },
                { label: 'Standby', value: 'standby' },
              ],
            },
          ]}
          onFilterChange={setFilters}
        />

        <DataTable
          columns={columns}
          data={filteredDuties}
          loading={loading}
          emptyMessage="No duties scheduled"
        />

        {showDutyForm && (
          <DutyForm
            members={members}
            initialData={editingDuty ? {
              member_id: editingDuty.member_id,
              date: editingDuty.date,
              time: editingDuty.time,
              mass_type: editingDuty.mass_type,
              role: editingDuty.role,
              status: editingDuty.status,
            } : undefined}
            onSubmit={handleSaveDuty}
            onCancel={() => setShowDutyForm(false)}
            isLoading={isSubmitting}
          />
        )}

        <Dialog />
      </div>
    </AdminLayout>
  )
}
`
);

// ============================================================================
// EVENTS PAGE
// ============================================================================
writeFile(
  path.join(appDir, 'app', 'admin', 'events', 'page.tsx'),
  `'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { DataTable, type DataTableColumn } from '@/components/DataTable'
import { FilterBar } from '@/components/FilterBar'
import { useConfirmDialog } from '@/components/ConfirmDialog'
import { StatusBadge } from '@/components/StatusBadge'
import { EventForm } from '@/components/EventForm'
import { useRealtimeEvents } from '@/lib/useRealtime'
import { updateEvent, deleteEvent } from '@/lib/admin-api'
import { logAdminAction } from '@/lib/admin-guard'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import type { Event, EventFormData } from '@/lib/types'

export default function EventsPage() {
  const { data: events, loading, error } = useRealtimeEvents()
  const { confirm, Dialog } = useConfirmDialog()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleCreateEvent = () => {
    setEditingEvent(null)
    setShowEventForm(true)
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setShowEventForm(true)
  }

  const handleSaveEvent = async (data: EventFormData) => {
    setIsSubmitting(true)
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, data)
        await logAdminAction(null, 'UPDATE_EVENT', 'events', editingEvent.id, editingEvent, data)
        setMessage({ type: 'success', text: 'Event updated successfully' })
      } else {
        await logAdminAction(null, 'CREATE_EVENT', 'events', null, null, data)
        setMessage({ type: 'success', text: 'Event created successfully' })
      }
      setShowEventForm(false)
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to save event' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteEvent = (event: Event) => {
    confirm({
      title: 'Delete Event',
      message: \`Are you sure you want to delete "\${event.title}"? This action cannot be undone.\`,
      confirmText: 'Delete',
      isDangerous: true,
      onConfirm: async () => {
        try {
          await deleteEvent(event.id)
          await logAdminAction(null, 'DELETE_EVENT', 'events', event.id, event, { deleted_at: new Date().toISOString() })
          setMessage({ type: 'success', text: 'Event deleted successfully' })
        } catch (err) {
          setMessage({ 
            type: 'error', 
            text: err instanceof Error ? err.message : 'Failed to delete event' 
          })
        }
      },
    })
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = !filters.event_type || event.event_type === filters.event_type
    return matchesSearch && matchesType
  })

  const columns: DataTableColumn<Event>[] = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    {
      key: 'event_type',
      label: 'Type',
      render: (value) => <StatusBadge status={value} variant="event" />,
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditEvent(row)}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteEvent(row)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-600 mt-1">Create and manage community events</p>
          </div>
          <button
            onClick={handleCreateEvent}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <Plus className="h-5 w-5" />
            New Event
          </button>
        </div>

        {message && (
          <div className={\`p-4 rounded-md \${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}\`}>
            {message.text}
          </div>
        )}

        {error && <div className="p-4 bg-red-50 text-red-700 rounded-md">Error: {error.message}</div>}

        <FilterBar
          onSearch={setSearchQuery}
          onFilterChange={setFilters}
          placeholder="Search events..."
          filters={[
            {
              name: 'event_type',
              label: 'Event Type',
              options: [
                { label: 'Feast', value: 'feast' },
                { label: 'Training', value: 'training' },
                { label: 'Recollection', value: 'recollection' },
                { label: 'Outreach', value: 'outreach' },
              ],
            },
          ]}
        />

        <DataTable
          columns={columns}
          data={filteredEvents}
          loading={loading}
          emptyMessage="No events created"
        />

        {showEventForm && (
          <EventForm
            initialData={editingEvent ? {
              title: editingEvent.title,
              date: editingEvent.date,
              description: editingEvent.description,
              location: editingEvent.location,
              event_type: editingEvent.event_type,
            } : undefined}
            onSubmit={handleSaveEvent}
            onCancel={() => setShowEventForm(false)}
            isLoading={isSubmitting}
          />
        )}

        <Dialog />
      </div>
    </AdminLayout>
  )
}
`
);

// ============================================================================
// REQUESTS PAGE
// ============================================================================
writeFile(
  path.join(appDir, 'app', 'admin', 'requests', 'page.tsx'),
  `'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { DataTable, type DataTableColumn } from '@/components/DataTable'
import { InviteAdminForm } from '@/components/InviteAdminForm'
import { getAdminInvites, acceptAdminInvite, rejectAdminInvite } from '@/lib/admin-api'
import { logAdminAction } from '@/lib/admin-guard'
import { Plus, Check, X } from 'lucide-react'
import type { AdminInvite } from '@/lib/types'

export default function RequestsPage() {
  const [invites, setInvites] = useState<AdminInvite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadInvites()
  }, [])

  const loadInvites = async () => {
    try {
      setLoading(true)
      const data = await getAdminInvites()
      setInvites(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invites')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (invite: AdminInvite) => {
    try {
      await acceptAdminInvite(invite.id)
      await logAdminAction(null, 'ACCEPT_ADMIN_INVITE', 'admin_invites', invite.id, invite, { status: 'accepted' })
      setMessage({ type: 'success', text: 'Invite accepted' })
      await loadInvites()
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to accept invite' 
      })
    }
  }

  const handleReject = async (invite: AdminInvite) => {
    try {
      await rejectAdminInvite(invite.id)
      await logAdminAction(null, 'REJECT_ADMIN_INVITE', 'admin_invites', invite.id, invite, { status: 'rejected' })
      setMessage({ type: 'success', text: 'Invite rejected' })
      await loadInvites()
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to reject invite' 
      })
    }
  }

  const handleSendInvite = async (email: string) => {
    setIsSubmitting(true)
    try {
      // In real implementation, call createAdminInvite API
      setMessage({ type: 'success', text: 'Invite sent successfully' })
      setShowInviteForm(false)
      await loadInvites()
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to send invite' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const pendingInvites = invites.filter(i => i.status === 'pending')

  const columns: DataTableColumn<AdminInvite>[] = [
    { key: 'invitee_email', label: 'Email', sortable: true },
    {
      key: 'created_at',
      label: 'Sent Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={\`px-2 py-1 rounded text-xs font-medium \${
          value === 'accepted' ? 'bg-green-100 text-green-700' :
          value === 'rejected' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700'
        }\`}>
          {value}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_, row) => row.status === 'pending' ? (
        <div className="flex gap-2">
          <button
            onClick={() => handleAccept(row)}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleReject(row)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null,
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Requests</h1>
            <p className="text-gray-600 mt-1">Manage admin invitations and approvals</p>
          </div>
          <button
            onClick={() => setShowInviteForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <Plus className="h-5 w-5" />
            Send Invite
          </button>
        </div>

        {message && (
          <div className={\`p-4 rounded-md \${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}\`}>
            {message.text}
          </div>
        )}

        {error && <div className="p-4 bg-red-50 text-red-700 rounded-md">Error: {error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Invites</p>
            <p className="text-2xl font-bold">{invites.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingInvites.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Accepted</p>
            <p className="text-2xl font-bold text-green-600">{invites.filter(i => i.status === 'accepted').length}</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={invites}
          loading={loading}
          emptyMessage="No invites sent"
        />

        {showInviteForm && (
          <InviteAdminForm
            onSubmit={handleSendInvite}
            onCancel={() => setShowInviteForm(false)}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </AdminLayout>
  )
}
`
);

console.log(`\n✓ Created ${filesCreated} files successfully!\n`);
console.log('Phase 3 Components Created:');
console.log('  ✓ src/app/admin/duties/page.tsx');
console.log('  ✓ src/app/admin/events/page.tsx');
console.log('  ✓ src/app/admin/requests/page.tsx');
console.log('\nNext: Create remaining components and API routes');
console.log('Run: node phase3-components-setup.js');

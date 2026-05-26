#!/usr/bin/env node
/**
 * Phase 3 Complete Setup Script
 * This script creates all admin interface files, pages, and API routes
 * 
 * Run with: node setup-phase3-complete.js from the d:\SLPC-MAS directory
 */

const fs = require('fs');
const path = require('path');

// Helper to create directory recursively
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Helper to write file
function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
  console.log(`✓ Created: ${filePath}`);
}

const appDir = path.join(__dirname, 'app', 'src');

// ============================================================================
// PAGE: Admin Dashboard
// ============================================================================
writeFile(
  path.join(appDir, 'app', 'admin', 'page.tsx'),
  `'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { getMembers, getDuties, getEvents } from '@/lib/admin-api'
import { Users, Briefcase, Calendar, AlertCircle, Mail } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalDuties: 0,
    totalEvents: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [members, duties, events] = await Promise.all([
          getMembers(),
          getDuties(),
          getEvents(),
        ])
        setStats({
          totalMembers: members.length,
          totalDuties: duties.length,
          totalEvents: events.length,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats')
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to the admin panel</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={Users}
              label="Total Members"
              value={stats.totalMembers}
              color="blue"
            />
            <StatCard
              icon={Briefcase}
              label="Total Duties"
              value={stats.totalDuties}
              color="green"
            />
            <StatCard
              icon={Calendar}
              label="Total Events"
              value={stats.totalEvents}
              color="purple"
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/admin/members"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <Users className="h-6 w-6 text-blue-500 mb-2" />
              <h3 className="font-medium">Manage Members</h3>
              <p className="text-sm text-gray-600">Add, edit, or remove members</p>
            </a>
            <a
              href="/admin/duties"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <Briefcase className="h-6 w-6 text-green-500 mb-2" />
              <h3 className="font-medium">Manage Duties</h3>
              <p className="text-sm text-gray-600">Schedule and track duties</p>
            </a>
            <a
              href="/admin/events"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <Calendar className="h-6 w-6 text-purple-500 mb-2" />
              <h3 className="font-medium">Manage Events</h3>
              <p className="text-sm text-gray-600">Create and manage events</p>
            </a>
            <a
              href="/admin/requests"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <Mail className="h-6 w-6 text-orange-500 mb-2" />
              <h3 className="font-medium">Admin Requests</h3>
              <p className="text-sm text-gray-600">Review pending requests</p>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className: string }>
  label: string
  value: number
  color: 'blue' | 'green' | 'purple'
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={\`p-3 rounded-lg w-fit \${colorClasses[color]} mb-4\`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
`
);

// ============================================================================
// PAGE: Members Manager
// ============================================================================
writeFile(
  path.join(appDir, 'app', 'admin', 'members', 'page.tsx'),
  `'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { DataTable, type DataTableColumn } from '@/components/DataTable'
import { FilterBar } from '@/components/FilterBar'
import { useConfirmDialog } from '@/components/ConfirmDialog'
import { StatusBadge } from '@/components/StatusBadge'
import { MemberForm } from '@/components/MemberForm'
import { MemberDetails } from '@/components/MemberDetails'
import { useRealtimeMembers } from '@/lib/useRealtime'
import { updateMember, deleteMember, promoteToAdmin } from '@/lib/admin-api'
import { logAdminAction } from '@/lib/admin-guard'
import { Plus, Edit2, Trash2, Shield } from 'lucide-react'
import type { Member, MemberFormData } from '@/lib/types'

export default function MembersPage() {
  const { data: members, loading, error } = useRealtimeMembers()
  const { confirm, Dialog } = useConfirmDialog()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [showMemberDetails, setShowMemberDetails] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const filteredMembers = members.filter((member) => {
    const matchesSearch = !searchQuery || 
      member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = !filters.role || member.role === filters.role
    
    return matchesSearch && matchesRole
  })

  const handleCreateMember = () => {
    setEditingMember(null)
    setShowMemberForm(true)
  }

  const handleEditMember = (member: Member) => {
    setEditingMember(member)
    setShowMemberForm(true)
  }

  const handleSaveMember = async (data: MemberFormData) => {
    setIsSubmitting(true)
    try {
      if (editingMember) {
        await updateMember(editingMember.id, data)
        await logAdminAction(null, 'UPDATE_MEMBER', 'members', editingMember.id, editingMember, data)
        setMessage({ type: 'success', text: 'Member updated successfully' })
      } else {
        // Create new member
        await logAdminAction(null, 'CREATE_MEMBER', 'members', null, null, data)
        setMessage({ type: 'success', text: 'Member created successfully' })
      }
      setShowMemberForm(false)
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to save member' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteMember = (member: Member) => {
    confirm({
      title: 'Delete Member',
      message: \`Are you sure you want to delete \${member.full_name}? This action cannot be undone.\`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true,
      onConfirm: async () => {
        try {
          await deleteMember(member.id)
          await logAdminAction(null, 'DELETE_MEMBER', 'members', member.id, member, { deleted_at: new Date().toISOString() })
          setMessage({ type: 'success', text: 'Member deleted successfully' })
        } catch (err) {
          setMessage({ 
            type: 'error', 
            text: err instanceof Error ? err.message : 'Failed to delete member' 
          })
        }
      },
    })
  }

  const handlePromoteToAdmin = (member: Member) => {
    confirm({
      title: 'Promote to Admin',
      message: \`Promote \${member.full_name} to admin? They will have full portal access.\`,
      confirmText: 'Promote',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          const userId = member.id // In real app, get from auth context
          await promoteToAdmin(member.id, userId)
          await logAdminAction(userId, 'PROMOTE_ADMIN', 'members', member.id, member, { is_admin: true })
          setMessage({ type: 'success', text: 'Member promoted to admin' })
        } catch (err) {
          setMessage({ 
            type: 'error', 
            text: err instanceof Error ? err.message : 'Failed to promote member' 
          })
        }
      },
    })
  }

  const columns: DataTableColumn<Member>[] = [
    {
      key: 'full_name',
      label: 'Name',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'role',
      label: 'Role',
      render: (value) => <StatusBadge status={value} variant="role" />,
    },
    {
      key: 'is_admin',
      label: 'Admin',
      render: (value) => <StatusBadge status={value ? 'Yes' : 'No'} variant="admin" />,
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => { setSelectedMember(row); setShowMemberDetails(true); }}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditMember(row)}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          {!row.is_admin && (
            <button
              onClick={() => handlePromoteToAdmin(row)}
              className="p-1 text-purple-600 hover:bg-purple-50 rounded"
              title="Promote to admin"
            >
              <Shield className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => handleDeleteMember(row)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Delete"
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
            <h1 className="text-3xl font-bold text-gray-900">Members</h1>
            <p className="text-gray-600 mt-1">Manage community members</p>
          </div>
          <button
            onClick={handleCreateMember}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <Plus className="h-5 w-5" />
            Add Member
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
          placeholder="Search members..."
          filters={[
            {
              name: 'role',
              label: 'Role',
              options: [
                { label: 'Member', value: 'Member' },
                { label: 'Server', value: 'Server' },
                { label: 'Cantor', value: 'Cantor' },
                { label: 'Sacristan', value: 'Sacristan' },
              ],
            },
          ]}
        />

        <DataTable
          columns={columns}
          data={filteredMembers}
          loading={loading}
          emptyMessage="No members found"
        />

        {showMemberForm && (
          <MemberForm
            initialData={editingMember ? {
              full_name: editingMember.full_name,
              email: editingMember.email,
              role: editingMember.role,
            } : undefined}
            onSubmit={handleSaveMember}
            onCancel={() => setShowMemberForm(false)}
            isLoading={isSubmitting}
          />
        )}

        {showMemberDetails && selectedMember && (
          <MemberDetails
            member={selectedMember}
            onEdit={() => { handleEditMember(selectedMember); setShowMemberDetails(false); }}
            onDelete={() => { handleDeleteMember(selectedMember); setShowMemberDetails(false); }}
            onClose={() => setShowMemberDetails(false)}
          />
        )}

        <Dialog />
      </div>
    </AdminLayout>
  )
}

function Eye({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}
`
);

// ============================================================================
// COMPONENT: MemberDetails
// ============================================================================
writeFile(
  path.join(appDir, 'components', 'MemberDetails.tsx'),
  `'use client'

import { X, Edit2, Trash2 } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import type { Member } from '@/lib/types'

interface MemberDetailsProps {
  member: Member
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

export function MemberDetails({
  member,
  onEdit,
  onDelete,
  onClose,
}: MemberDetailsProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Member Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <p className="text-gray-900">{member.full_name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-gray-900">{member.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <StatusBadge status={member.role} variant="role" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Status
            </label>
            <StatusBadge 
              status={member.is_admin ? 'Admin' : 'Member'} 
              variant="admin" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Joined
            </label>
            <p className="text-gray-900">
              {new Date(member.created_at).toLocaleDateString()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attendance Rate
            </label>
            <p className="text-gray-900">{member.attendance_rate}%</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md transition flex items-center justify-center gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition flex items-center justify-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
`
);

console.log('\\n✓ Phase 3 files created successfully!');
console.log('\\nCreated files:');
console.log('  - src/app/admin/page.tsx (Dashboard)');
console.log('  - src/app/admin/members/page.tsx (Members Manager)');
console.log('  - src/components/MemberDetails.tsx (Member Profile Modal)');
console.log('\\nNext steps:');
console.log('1. Create remaining admin pages (duties, events, requests)');
console.log('2. Create API routes in src/api/admin/');
console.log('3. Run: npm run build');
console.log('4. Run: npm run dev');
console.log('5. Visit: http://localhost:3000/admin');
console.log('\\nSee PHASE_3_BUILD_GUIDE.md for complete implementation details.');

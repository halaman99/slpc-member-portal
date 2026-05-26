'use client'

import { Card } from './UI'
import { Member } from '@/lib/types'
import { X, Edit2, Trash2, Shield } from 'lucide-react'
import { Badge } from './UI'

interface MemberDetailsProps {
  member: Member
  onEdit: () => void
  onDelete: () => void
  onPromoteAdmin?: () => void
  onClose: () => void
}

export function MemberDetails({
  member,
  onEdit,
  onDelete,
  onPromoteAdmin,
  onClose,
}: MemberDetailsProps) {
  const joinedDate = new Date(member.created_at).toLocaleDateString()
  const initials = member.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#f5f0e8]">Member Details</h2>
          <button
            onClick={onClose}
            className="text-[#8a6070] hover:text-[#f5f0e8]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[#c9a227] text-[#1a0808] font-semibold flex items-center justify-center text-xl">
              {initials}
            </div>
          </div>

          {/* Name and Role */}
          <div className="text-center border-b border-[#3a2020] pb-4">
            <h3 className="text-lg font-semibold text-[#f5f0e8] mb-1">
              {member.full_name}
            </h3>
            <div className="flex justify-center gap-2 flex-wrap">
              <Badge text={member.role} color="blue" />
              {member.is_admin && <Badge text="Admin" color="purple" />}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <div>
              <p className="text-xs text-[#8a6070] mb-1">Email</p>
              <p className="text-sm text-[#d0c0b0]">{member.email}</p>
            </div>
            {member.phone && (
              <div>
                <p className="text-xs text-[#8a6070] mb-1">Phone</p>
                <p className="text-sm text-[#d0c0b0]">{member.phone}</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="border-t border-[#3a2020] pt-4 grid grid-cols-2 gap-3">
            <div className="bg-[#3a2020] rounded p-3">
              <p className="text-xs text-[#8a6070] mb-1">Attendance Rate</p>
              <p className="text-lg font-semibold text-[#c9a227]">
                {member.attendance_rate}%
              </p>
            </div>
            <div className="bg-[#3a2020] rounded p-3">
              <p className="text-xs text-[#8a6070] mb-1">Badges Earned</p>
              <p className="text-lg font-semibold text-[#c9a227]">
                {member.badges_earned}
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="border-t border-[#3a2020] pt-4 space-y-2">
            <div>
              <p className="text-xs text-[#8a6070] mb-1">Joined</p>
              <p className="text-sm text-[#d0c0b0]">{joinedDate}</p>
            </div>
            {member.is_admin && member.admin_requested_at && (
              <div>
                <p className="text-xs text-[#8a6070] mb-1">Promoted to Admin</p>
                <p className="text-sm text-[#d0c0b0]">
                  {new Date(member.admin_requested_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-[#3a2020] pt-4 flex gap-2">
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#3a2020] border border-[#5a3030] rounded text-sm font-medium text-[#f5f0e8] hover:border-[#c9a227] transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>

            {!member.is_admin && onPromoteAdmin && (
              <button
                onClick={onPromoteAdmin}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#3a2020] border border-[#5a3030] rounded text-sm font-medium text-[#f5f0e8] hover:border-[#c9a227] transition-colors"
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            )}

            <button
              onClick={onDelete}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#3a2020] border border-[#5a3030] rounded text-sm font-medium text-[#c95a5a] hover:border-[#c95a5a] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

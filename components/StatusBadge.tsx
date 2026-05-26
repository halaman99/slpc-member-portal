'use client'

import { Badge } from './UI'

interface StatusBadgeProps {
  isAdmin?: boolean
  status?: 'active' | 'inactive' | 'pending'
  role?: string
}

export function StatusBadge({ isAdmin, status, role }: StatusBadgeProps) {
  if (isAdmin) {
    return <Badge text="Admin" color="purple" />
  }

  if (status === 'active') {
    return <Badge text="Active" color="green" />
  }

  if (status === 'inactive') {
    return <Badge text="Inactive" color="red" />
  }

  if (status === 'pending') {
    return <Badge text="Pending" color="amber" />
  }

  if (role) {
    return <Badge text={role} color="blue" />
  }

  return <Badge text="Member" color="teal" />
}

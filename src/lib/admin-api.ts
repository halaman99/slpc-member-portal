import { supabase } from './supabase'
import type { Member, Duty, Event, AdminInvite } from './types'

// ============================================================================
// MEMBERS API
// ============================================================================

export async function getMembers(filters?: {
  search?: string
  role?: string
  isAdmin?: boolean
}) {
  let query = supabase
    .from('members')
    .select('*')
    .eq('is_deleted', false)
    .order('full_name', { ascending: true })

  if (filters?.search) {
    query = query.or(
      `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
    )
  }

  if (filters?.role) {
    query = query.eq('role', filters.role)
  }

  if (filters?.isAdmin !== undefined) {
    query = query.eq('is_admin', filters.isAdmin)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Member[]
}

export async function getMember(id: string) {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .eq('is_deleted', false)
    .single()

  if (error) throw error
  return data as Member
}

export async function createMember(memberData: {
  full_name: string
  email: string
  role: string
  avatar_color?: string
}) {
  const { data, error } = await supabase
    .from('members')
    .insert([memberData])
    .select()
    .single()

  if (error) throw error
  return data as Member
}

export async function updateMember(
  id: string,
  updates: Partial<Member>
) {
  const { data, error } = await supabase
    .from('members')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Member
}

export async function deleteMember(id: string) {
  const { data, error } = await supabase
    .from('members')
    .update({
      is_deleted: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Member
}

export async function promoteToAdmin(
  memberId: string,
  approverUserId: string
) {
  const { data, error } = await supabase
    .from('members')
    .update({
      is_admin: true,
      admin_approved_by: approverUserId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', memberId)
    .select()
    .single()

  if (error) throw error
  return data as Member
}

// ============================================================================
// DUTIES API
// ============================================================================

export async function getDuties(filters?: {
  memberId?: string
  date?: string
  status?: string
}) {
  let query = supabase
    .from('duties')
    .select('*')
    .eq('is_deleted', false)
    .order('date', { ascending: false })

  if (filters?.memberId) {
    query = query.eq('member_id', filters.memberId)
  }

  if (filters?.date) {
    query = query.eq('date', filters.date)
  }

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Duty[]
}

export async function getDuty(id: string) {
  const { data, error } = await supabase
    .from('duties')
    .select('*')
    .eq('id', id)
    .eq('is_deleted', false)
    .single()

  if (error) throw error
  return data as Duty
}

export async function createDuty(dutyData: {
  member_id: string
  date: string
  time: string
  mass_type: string
  role: string
  status?: string
}) {
  const { data, error } = await supabase
    .from('duties')
    .insert([dutyData])
    .select()
    .single()

  if (error) throw error
  return data as Duty
}

export async function updateDuty(
  id: string,
  updates: Partial<Duty>
) {
  const { data, error } = await supabase
    .from('duties')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Duty
}

export async function deleteDuty(id: string) {
  const { data, error } = await supabase
    .from('duties')
    .update({
      is_deleted: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Duty
}

// ============================================================================
// EVENTS API
// ============================================================================

export async function getEvents(filters?: {
  eventType?: string
  startDate?: string
  endDate?: string
}) {
  let query = supabase
    .from('events')
    .select('*')
    .eq('is_deleted', false)
    .order('date', { ascending: false })

  if (filters?.eventType) {
    query = query.eq('event_type', filters.eventType)
  }

  if (filters?.startDate) {
    query = query.gte('date', filters.startDate)
  }

  if (filters?.endDate) {
    query = query.lte('date', filters.endDate)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Event[]
}

export async function getEvent(id: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('is_deleted', false)
    .single()

  if (error) throw error
  return data as Event
}

export async function createEvent(eventData: {
  title: string
  date: string
  description: string
  location: string
  event_type: string
}) {
  const { data, error } = await supabase
    .from('events')
    .insert([eventData])
    .select()
    .single()

  if (error) throw error
  return data as Event
}

export async function updateEvent(
  id: string,
  updates: Partial<Event>
) {
  const { data, error } = await supabase
    .from('events')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Event
}

export async function deleteEvent(id: string) {
  const { data, error } = await supabase
    .from('events')
    .update({
      is_deleted: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Event
}

// ============================================================================
// ADMIN INVITES API
// ============================================================================

export async function getAdminInvites(status?: string) {
  let query = supabase
    .from('admin_invites')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) throw error
  return data as AdminInvite[]
}

export async function createAdminInvite(
  inviterId: string,
  inviteeEmail: string
) {
  const { data, error } = await supabase
    .from('admin_invites')
    .insert([
      {
        inviter_id: inviterId,
        invitee_email: inviteeEmail,
        status: 'pending',
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data as AdminInvite
}

export async function acceptAdminInvite(inviteId: string) {
  const { data, error } = await supabase
    .from('admin_invites')
    .update({
      status: 'accepted',
      responded_at: new Date().toISOString(),
    })
    .eq('id', inviteId)
    .select()
    .single()

  if (error) throw error
  return data as AdminInvite
}

export async function rejectAdminInvite(inviteId: string) {
  const { data, error } = await supabase
    .from('admin_invites')
    .update({
      status: 'rejected',
      responded_at: new Date().toISOString(),
    })
    .eq('id', inviteId)
    .select()
    .single()

  if (error) throw error
  return data as AdminInvite
}

import { supabase } from './supabase'
import { Member, Duty, Event, Formation, Announcement, AttendanceRecord } from './types'

// Members
export async function getMembers() {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('full_name')

  if (error) throw error
  return data as Member[]
}

export async function getMember(id: string) {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Member
}

export async function getMemberByEmail(email: string) {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('email', email)
    .single()

  if (error) throw error
  return data as Member
}

// Duties
export async function getDutiesForMember(memberId: string, month?: string) {
  let query = supabase
    .from('duties')
    .select('*')
    .eq('member_id', memberId)

  if (month) {
    query = query.gte('date', `${month}-01`).lt('date', `${month}-32`)
  }

  const { data, error } = await query.order('date', { ascending: true })

  if (error) throw error
  return data as Duty[]
}

export async function getUpcomingDuties(memberId: string) {
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('duties')
    .select('*')
    .eq('member_id', memberId)
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(10)

  if (error) throw error
  return data as Duty[]
}

// Events
export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })

  if (error) throw error
  return data as Event[]
}

export async function getEventsByType(type: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('event_type', type)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })

  if (error) throw error
  return data as Event[]
}

// Formations
export async function getFormations() {
  const { data, error } = await supabase
    .from('formations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Formation[]
}

export async function getMemberFormationProgress(memberId: string) {
  const { data, error } = await supabase
    .from('member_formations')
    .select('formation_id, completed_at')
    .eq('member_id', memberId)

  if (error) throw error
  return data
}

// Announcements
export async function getAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return data as Announcement[]
}

// Attendance
export async function getAttendanceStats(memberId: string, month?: string) {
  let query = supabase
    .from('attendance')
    .select('status')
    .eq('member_id', memberId)

  if (month) {
    query = query.gte('date', `${month}-01`).lt('date', `${month}-32`)
  }

  const { data, error } = await query

  if (error) throw error

  const stats = {
    present: data.filter(a => a.status === 'present').length,
    absent: data.filter(a => a.status === 'absent').length,
    late: data.filter(a => a.status === 'late').length,
    excused: data.filter(a => a.status === 'excused').length,
  }

  const total = data.length
  const rate = total > 0 ? Math.round((stats.present / total) * 100) : 0

  return {
    ...stats,
    rate,
    total,
  }
}

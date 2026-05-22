import { supabase } from './supabase'

// ============================================================================
// MEMBERS QUERIES
// ============================================================================

export async function getMembers() {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('full_name')

  if (error) {
    console.error('Error fetching members:', error)
    return []
  }
  return data || []
}

export async function getMember(id: string) {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching member:', error)
    return null
  }
  return data
}

export async function getMemberByEmail(email: string) {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('email', email)
    .single()

  if (error) {
    console.error('Error fetching member by email:', error)
    return null
  }
  return data
}

// ============================================================================
// DUTIES QUERIES
// ============================================================================

export async function getDutiesForMember(memberId: string) {
  const { data, error } = await supabase
    .from('duties')
    .select('*')
    .eq('member_id', memberId)
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching duties:', error)
    return []
  }
  return data || []
}

export async function getUpcomingDuties(memberId: string, daysAhead: number = 30) {
  const today = new Date().toISOString().split('T')[0]
  const futureDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  const { data, error } = await supabase
    .from('duties')
    .select('*')
    .eq('member_id', memberId)
    .gte('date', today)
    .lte('date', futureDate)
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching upcoming duties:', error)
    return []
  }
  return data || []
}

// ============================================================================
// ATTENDANCE QUERIES
// ============================================================================

export async function getAttendanceRecords(memberId: string) {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('member_id', memberId)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching attendance:', error)
    return []
  }
  return data || []
}

export async function getAttendanceStats(memberId: string) {
  const records = await getAttendanceRecords(memberId)
  
  const total = records.length
  const present = records.filter(r => r.status === 'present').length
  const absent = records.filter(r => r.status === 'absent').length
  const late = records.filter(r => r.status === 'late').length
  const excused = records.filter(r => r.status === 'excused').length

  return {
    total,
    present,
    absent,
    late,
    excused,
    rate: total > 0 ? Math.round((present / total) * 100) : 0,
  }
}

// ============================================================================
// EVENTS QUERIES
// ============================================================================

export async function getEvents(limit?: number) {
  let query = supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }
  return data || []
}

export async function getUpcomingEvents(daysAhead: number = 90) {
  const today = new Date().toISOString().split('T')[0]
  const futureDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('date', today)
    .lte('date', futureDate)
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching upcoming events:', error)
    return []
  }
  return data || []
}

// ============================================================================
// FORMATIONS QUERIES
// ============================================================================

export async function getFormations() {
  const { data, error } = await supabase
    .from('formations')
    .select('*')
    .order('title')

  if (error) {
    console.error('Error fetching formations:', error)
    return []
  }
  return data || []
}

export async function getMemberFormations(memberId: string) {
  const { data, error } = await supabase
    .from('member_formations')
    .select('*, formations(*)')
    .eq('member_id', memberId)

  if (error) {
    console.error('Error fetching member formations:', error)
    return []
  }
  return data || []
}

// ============================================================================
// ANNOUNCEMENTS QUERIES
// ============================================================================

export async function getAnnouncements(limit: number = 10) {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching announcements:', error)
    return []
  }
  return data || []
}

export async function getAnnouncementsByCategory(category: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching announcements by category:', error)
    return []
  }
  return data || []
}

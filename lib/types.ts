export type Member = {
  id: string
  email: string
  full_name: string
  role: string
  phone?: string
  avatar_initials: string
  avatar_color: string
  attendance_rate: number
  badges_earned: number
  is_admin?: boolean
  is_deleted?: boolean
  admin_approved_by?: string | null
  admin_requested_at?: string | null
  created_at: string
  updated_at: string
}

// Admin-specific types
export interface MemberFilters {
  search?: string
  role?: string
  isAdmin?: boolean
  joinedAfter?: Date
}

export interface MemberFormData {
  full_name: string
  email: string
  phone?: string
  role: string
}

export interface DutyFormData {
  title: string
  description?: string
  assigned_to: string[]
  due_date: string
  status: 'not_started' | 'in_progress' | 'completed'
}

export type Duty = {
  id: string
  member_id: string
  date: string
  time: string
  mass_type: string
  role: string
  status: 'scheduled' | 'served' | 'absent' | 'late' | 'standby'
  created_at: string
}

export type AttendanceRecord = {
  id: string
  member_id: string
  date: string
  duty_id: string | null
  status: 'present' | 'absent' | 'late' | 'excused'
  notes: string | null
  created_at: string
}

export type Event = {
  id: string
  title: string
  date: string
  description: string
  location: string
  event_type: 'feast' | 'training' | 'recollection' | 'outreach'
  created_at: string
  updated_at: string
}

export type Formation = {
  id: string
  title: string
  description: string
  file_type: 'pdf' | 'video' | 'doc'
  file_url: string
  duration: string | null
  created_at: string
}

export type MemberFormation = {
  id: string
  member_id: string
  formation_id: string
  completed_at: string | null
  created_at: string
}

export type Announcement = {
  id: string
  title: string
  message: string
  category: 'urgent' | 'event' | 'info' | 'request'
  created_at: string
  created_by: string
}

export type AttendanceStats = {
  masses_served: number
  formations_attended: number
  events_joined: number
  unexcused_absences: number
  monthly_attendance_rate: number
}

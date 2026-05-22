import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      members: {
        Row: {
          id: string
          email: string
          full_name: string
          role: string
          avatar_initials: string
          avatar_color: string
          attendance_rate: number
          badges_earned: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['members']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['members']['Insert']>
      }
      duties: {
        Row: {
          id: string
          member_id: string
          date: string
          time: string
          mass_type: string
          role: string
          status: 'scheduled' | 'served' | 'absent' | 'late' | 'standby'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['duties']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['duties']['Insert']>
      }
      attendance: {
        Row: {
          id: string
          member_id: string
          date: string
          duty_id: string | null
          status: 'present' | 'absent' | 'late' | 'excused'
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['attendance']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['attendance']['Insert']>
      }
      events: {
        Row: {
          id: string
          title: string
          date: string
          description: string
          location: string
          event_type: 'feast' | 'training' | 'recollection' | 'outreach'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['events']['Insert']>
      }
      formations: {
        Row: {
          id: string
          title: string
          description: string
          file_type: 'pdf' | 'video' | 'doc'
          file_url: string
          duration: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['formations']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['formations']['Insert']>
      }
      member_formations: {
        Row: {
          id: string
          member_id: string
          formation_id: string
          completed_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['member_formations']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['member_formations']['Insert']>
      }
      announcements: {
        Row: {
          id: string
          title: string
          message: string
          category: 'urgent' | 'event' | 'info' | 'request'
          created_at: string
          created_by: string
        }
        Insert: Omit<Database['public']['Tables']['announcements']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['announcements']['Insert']>
      }
    }
  }
}

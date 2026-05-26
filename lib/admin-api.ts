import { MemberFormData, DutyFormData } from './types'
import { supabase } from './supabase'

// ============================================================================
// MEMBER MANAGEMENT
// ============================================================================

/**
 * Create a new member
 */
export async function createMember(data: MemberFormData) {
  try {
    const { data: newMember, error } = await supabase
      .from('members')
      .insert([
        {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          is_deleted: false,
          avatar_initials: data.full_name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase(),
          avatar_color: generateAvatarColor(),
          attendance_rate: 0,
          badges_earned: 0,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return { success: true, data: newMember, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create member'
    console.error('Create member error:', err)
    return { success: false, data: null, error: message }
  }
}

/**
 * Update a member
 */
export async function updateMember(id: string, data: Partial<MemberFormData>) {
  try {
    const { data: updated, error } = await supabase
      .from('members')
      .update({
        ...(data.full_name && { full_name: data.full_name }),
        ...(data.email && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.role && { role: data.role }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { success: true, data: updated, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update member'
    console.error('Update member error:', err)
    return { success: false, data: null, error: message }
  }
}

/**
 * Delete (soft-delete) a member
 */
export async function deleteMember(id: string) {
  try {
    const { data: deleted, error } = await supabase
      .from('members')
      .update({
        is_deleted: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { success: true, data: deleted, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete member'
    console.error('Delete member error:', err)
    return { success: false, data: null, error: message }
  }
}

/**
 * Promote member to admin
 */
export async function promoteToAdmin(id: string, currentAdminId: string) {
  try {
    // Count active admins
    const { count, error: countError } = await supabase
      .from('members')
      .select('*', { count: 'exact' })
      .eq('is_admin', true)
      .eq('is_deleted', false)

    if (countError) throw countError
    if (count && count >= 5) {
      throw new Error('Maximum number of admins (5) has been reached')
    }

    const { data: promoted, error } = await supabase
      .from('members')
      .update({
        is_admin: true,
        admin_approved_by: currentAdminId,
        admin_requested_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { success: true, data: promoted, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to promote member'
    console.error('Promote member error:', err)
    return { success: false, data: null, error: message }
  }
}

/**
 * Get members with filters
 */
export async function getMembersFiltered(
  search?: string,
  role?: string,
  isAdmin?: boolean
) {
  try {
    let query = supabase
      .from('members')
      .select('*')
      .eq('is_deleted', false)
      .order('full_name', { ascending: true })

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      )
    }

    if (role) {
      query = query.eq('role', role)
    }

    if (isAdmin !== undefined) {
      query = query.eq('is_admin', isAdmin)
    }

    const { data, error } = await query

    if (error) throw error
    return { success: true, data: data || [], error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch members'
    console.error('Fetch members error:', err)
    return { success: false, data: [], error: message }
  }
}

// ============================================================================
// DUTY MANAGEMENT
// ============================================================================

/**
 * Create a new duty assignment
 */
export async function createDuty(data: DutyFormData) {
  try {
    const duties = data.assigned_to.map((memberId) => ({
      title: data.title,
      description: data.description,
      member_id: memberId,
      due_date: data.due_date,
      status: data.status,
      is_deleted: false,
    }))

    const { data: newDuties, error } = await supabase
      .from('duties')
      .insert(duties)
      .select()

    if (error) throw error
    return { success: true, data: newDuties, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create duty'
    console.error('Create duty error:', err)
    return { success: false, data: null, error: message }
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateAvatarColor(): string {
  const colors = [
    '#c9a227',
    '#4a9a5a',
    '#5a8ac9',
    '#c95a5a',
    '#9a5ac9',
    '#4a9a6a',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * Format member display name
 */
export function formatMemberName(full_name: string): string {
  return full_name.trim()
}

/**
 * Check if email is valid
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Build toast message for error
 */
export function getErrorMessage(error: string | null): string {
  if (!error) return 'An error occurred'
  if (error.includes('duplicate')) return 'This email already exists'
  if (error.includes('permission')) return 'You do not have permission to perform this action'
  if (error.includes('not found')) return 'Member not found'
  return error
}

import { supabase } from './supabase'

// ============================================================================
// ADMIN GUARD FUNCTIONS
// ============================================================================

/**
 * Verify user is admin, throw error if not
 */
export async function requireAdmin(userId: string) {
  if (!userId) {
    throw new Error('User ID is required')
  }

  try {
    const { data: member, error } = await supabase
      .from('members')
      .select('id, is_admin, is_deleted')
      .eq('id', userId)
      .single()

    if (error || !member) {
      throw new Error('Member record not found')
    }

    if (member.is_deleted) {
      throw new Error('User account is deleted')
    }

    if (!member.is_admin) {
      throw new Error('User does not have admin privileges')
    }

    return true
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : 'Failed to verify admin status'
    )
  }
}

/**
 * Get admin record with details
 */
export async function getCurrentAdmin(userId: string) {
  if (!userId) {
    throw new Error('User ID is required')
  }

  try {
    const { data: admin, error } = await supabase
      .from('members')
      .select(
        'id, email, full_name, is_admin, is_deleted, admin_approved_by, admin_requested_at, created_at, updated_at'
      )
      .eq('id', userId)
      .single()

    if (error || !admin) {
      throw new Error('Admin record not found')
    }

    if (!admin.is_admin) {
      throw new Error('User is not an admin')
    }

    return {
      id: admin.id,
      email: admin.email,
      full_name: admin.full_name,
      is_admin: admin.is_admin,
      is_deleted: admin.is_deleted,
      admin_approved_by: admin.admin_approved_by,
      admin_requested_at: admin.admin_requested_at,
      created_at: admin.created_at,
      updated_at: admin.updated_at,
    }
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : 'Failed to get admin details'
    )
  }
}

/**
 * Check if admin can manage a member
 */
export async function canManageMember(adminId: string, memberId: string) {
  if (!adminId || !memberId) {
    throw new Error('Admin ID and Member ID are required')
  }

  try {
    // Verify admin status
    await requireAdmin(adminId)

    // Check if member exists and is not deleted
    const { data: member, error } = await supabase
      .from('members')
      .select('id, is_deleted')
      .eq('id', memberId)
      .single()

    if (error || !member) {
      throw new Error('Member not found')
    }

    if (member.is_deleted) {
      throw new Error('Cannot manage deleted member')
    }

    return true
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : 'Permission check failed'
    )
  }
}

/**
 * Log admin action to audit trail
 */
export async function logAdminAction(
  action: string,
  userId: string,
  details: any
) {
  if (!action || !userId) {
    throw new Error('Action and User ID are required')
  }

  try {
    // Verify admin status
    await requireAdmin(userId)

    // Insert audit log entry
    const { error } = await supabase.from('audit_log').insert([
      {
        admin_id: userId,
        action: action,
        details: details || {},
        timestamp: new Date().toISOString(),
      },
    ])

    if (error) {
      throw error
    }

    return true
  } catch (err) {
    console.error('Failed to log admin action:', err)
    // Don't throw - logging failures shouldn't break the main action
    return false
  }
}

/**
 * Enforce admin limit - max 5 admins
 */
export async function enforceAdminLimit(count: number) {
  const MAX_ADMINS = 5

  if (count >= MAX_ADMINS) {
    throw new Error(
      `Maximum number of admins (${MAX_ADMINS}) has been reached`
    )
  }

  return true
}

/**
 * Get count of active admins
 */
export async function getActiveAdminCount() {
  try {
    const { count, error } = await supabase
      .from('members')
      .select('*', { count: 'exact' })
      .eq('is_admin', true)
      .eq('is_deleted', false)

    if (error) {
      throw error
    }

    return count || 0
  } catch (err) {
    console.error('Error counting admins:', err)
    return 0
  }
}

/**
 * Get all active admins
 */
export async function getActiveAdmins() {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('id, email, full_name, is_admin, admin_requested_at, created_at')
      .eq('is_admin', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  } catch (err) {
    console.error('Error fetching admins:', err)
    return []
  }
}

/**
 * Get pending admin requests (if applicable)
 */
export async function getPendingAdminRequests() {
  try {
    const { data, error } = await supabase
      .from('admin_invites')
      .select(
        'id, inviter_id, invitee_email, status, created_at, responded_at, inviter:members(full_name)'
      )
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  } catch (err) {
    console.error('Error fetching pending requests:', err)
    return []
  }
}

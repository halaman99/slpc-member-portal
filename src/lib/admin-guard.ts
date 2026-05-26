import { supabase } from './supabase'

/**
 * Check if user is admin
 */
export async function requireAdmin(userId: string | null): Promise<boolean> {
  if (!userId) return false

  try {
    const { data, error } = await supabase
      .from('members')
      .select('is_admin, is_deleted')
      .eq('id', userId)
      .single()

    if (error || !data) return false
    return data.is_admin === true && data.is_deleted === false
  } catch {
    return false
  }
}

/**
 * Log admin action to audit_log table
 */
export async function logAdminAction(
  userId: string | null,
  action: string,
  tableName: string,
  recordId: string | null = null,
  oldValues: Record<string, any> | null = null,
  newValues: Record<string, any> | null = null,
  ipAddress: string | null = null
) {
  try {
    await supabase.from('audit_log').insert({
      user_id: userId,
      action,
      table_name: tableName,
      record_id: recordId,
      old_values: oldValues,
      new_values: newValues,
      ip_address: ipAddress,
    })
  } catch (error) {
    console.error('Failed to log admin action:', error)
  }
}

/**
 * Soft delete a record (set is_deleted = true)
 */
export async function softDelete(
  table: string,
  recordId: string
) {
  return supabase
    .from(table)
    .update({ is_deleted: true, updated_at: new Date().toISOString() })
    .eq('id', recordId)
}

/**
 * Get admin user details
 */
export async function getAdminUser(userId: string) {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', userId)
    .eq('is_admin', true)
    .eq('is_deleted', false)
    .single()

  if (error) throw error
  return data
}

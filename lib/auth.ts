import { supabase } from './supabase'

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      console.error('Sign up error:', {
        message: error.message,
        code: error.code,
        status: error.status,
        name: error.name
      })
      return { data: null, error }
    }

    if (data.user) {
      // Also create a member record in the public members table
      const { error: memberError } = await supabase
        .from('members')
        .insert([
          { 
            id: data.user.id,
            email: email, 
            full_name: fullName,
            avatar_initials: fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
          }
        ])
      
      if (memberError) {
        console.error('Error creating member record:', memberError)
      }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error during sign up:', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error during sign up'
    return { 
      data: null, 
      error: {
        message: errorMessage,
        code: 'UNKNOWN_ERROR',
        status: 500,
        name: 'UnexpectedError'
      } as any
    }
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Sign in error:', {
        message: error.message,
        code: error.code,
        status: error.status,
        name: error.name
      })
      return { data: null, error }
    }

    // If sign in successful, ensure member record exists
    if (data.user) {
      const { data: existingMember, error: fetchError } = await supabase
        .from('members')
        .select('id')
        .eq('id', data.user.id)
        .single()

      // If member record doesn't exist, create it
      if (fetchError || !existingMember) {
        const initials = email.split('@')[0].toUpperCase().slice(0, 2)
        const { error: insertError } = await supabase
          .from('members')
          .insert([
            {
              id: data.user.id,
              email: email,
              full_name: email.split('@')[0],
              avatar_initials: initials,
              attendance_rate: 0,
              badges_earned: 0,
            }
          ])
        
        if (insertError) {
          console.error('Failed to create member record:', insertError)
        }
      }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error during sign in:', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error during sign in'
    return { 
      data: null, 
      error: {
        message: errorMessage,
        code: 'UNKNOWN_ERROR',
        status: 500,
        name: 'UnexpectedError'
      } as any
    }
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })
  return { data, error }
}

export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  return { data, error }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.error('Get user error:', error.message)
    }
    return { user, error }
  } catch (err) {
    console.error('Unexpected error getting current user:', err)
    return { user: null, error: err }
  }
}

export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Get session error:', error.message)
    }
    return { session, error }
  } catch (err) {
    console.error('Unexpected error getting session:', err)
    return { session: null, error: err }
  }
}

export async function onAuthStateChange(callback: (user: any) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(session?.user || null)
    }
  )
  return subscription
}

// ============================================================================
// ADMIN FUNCTIONS
// ============================================================================

/**
 * Get current user's member record with admin status
 */
export async function getCurrentMember() {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { member: null, error: userError }
    }

    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('*')
      .eq('id', user.id)
      .single()

    if (memberError) {
      return { member: null, error: memberError }
    }

    return { member, error: null }
  } catch (err) {
    console.error('Error getting current member:', err)
    return { member: null, error: err }
  }
}

/**
 * Check if user is admin
 */
export async function isUserAdmin() {
  try {
    const { member, error } = await getCurrentMember()
    
    if (error || !member) {
      return false
    }

    return member.is_admin && !member.is_deleted
  } catch (err) {
    console.error('Error checking admin status:', err)
    return false
  }
}

/**
 * Get count of current admins
 */
export async function getAdminCount() {
  try {
    const { count, error } = await supabase
      .from('members')
      .select('*', { count: 'exact' })
      .eq('is_admin', true)
      .eq('is_deleted', false)

    if (error) {
      console.error('Error counting admins:', error)
      return 0
    }

    return count || 0
  } catch (err) {
    console.error('Error getting admin count:', err)
    return 0
  }
}

/**
 * Invite a user to become admin (admin only)
 */
export async function inviteAdmin(inviteeEmail: string) {
  try {
    const isAdmin = await isUserAdmin()
    if (!isAdmin) {
      return { 
        error: { 
          message: 'Only admins can invite other admins' 
        } 
      }
    }

    // Check admin count doesn't exceed 5
    const adminCount = await getAdminCount()
    if (adminCount >= 5) {
      return { 
        error: { 
          message: 'Maximum of 5 admins allowed' 
        } 
      }
    }

    const { member: inviter, error: inviterError } = await getCurrentMember()
    
    if (inviterError || !inviter) {
      return { error: inviterError }
    }

    // Check if invite already pending
    const { data: existingInvite } = await supabase
      .from('admin_invites')
      .select('id')
      .eq('invitee_email', inviteeEmail)
      .eq('status', 'pending')
      .single()

    if (existingInvite) {
      return {
        error: {
          message: 'Invite already pending for this email'
        }
      }
    }

    // Create invite
    const { data, error } = await supabase
      .from('admin_invites')
      .insert([
        {
          inviter_id: inviter.id,
          invitee_email: inviteeEmail,
          status: 'pending'
        }
      ])
      .select()

    if (error) {
      return { error }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Error inviting admin:', err)
    return { error: err }
  }
}

/**
 * Accept admin invitation
 */
export async function acceptAdminInvite(inviteId: string) {
  try {
    const { member: currentMember, error: memberError } = await getCurrentMember()
    
    if (memberError || !currentMember) {
      return { error: memberError }
    }

    // Check admin limit not exceeded
    const adminCount = await getAdminCount()
    if (adminCount >= 5) {
      return {
        error: {
          message: 'Maximum of 5 admins allowed'
        }
      }
    }

    // Update invite status
    const { error: updateError } = await supabase
      .from('admin_invites')
      .update({
        status: 'accepted',
        responded_at: new Date().toISOString()
      })
      .eq('id', inviteId)

    if (updateError) {
      return { error: updateError }
    }

    // Set user as admin
    const { error: adminError } = await supabase
      .from('members')
      .update({
        is_admin: true,
        admin_approved_by: currentMember.id,
        admin_requested_at: new Date().toISOString()
      })
      .eq('id', currentMember.id)

    if (adminError) {
      return { error: adminError }
    }

    return { error: null }
  } catch (err) {
    console.error('Error accepting admin invite:', err)
    return { error: err }
  }
}

/**
 * Reject admin invitation
 */
export async function rejectAdminInvite(inviteId: string) {
  try {
    const { error } = await supabase
      .from('admin_invites')
      .update({
        status: 'rejected',
        responded_at: new Date().toISOString()
      })
      .eq('id', inviteId)

    if (error) {
      return { error }
    }

    return { error: null }
  } catch (err) {
    console.error('Error rejecting admin invite:', err)
    return { error: err }
  }
}

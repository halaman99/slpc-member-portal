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

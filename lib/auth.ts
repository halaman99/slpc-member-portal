import { supabase } from './supabase'

export async function signUpWithEmail(email: string, password: string, fullName: string) {
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

  if (!error && data.user) {
    // Also create a member record in the public members table
    const { error: memberError } = await supabase
      .from('members')
      .insert([
        { 
          id: data.user.id, // Use the same ID as the auth user
          email: email, 
          full_name: fullName,
          avatar_initials: fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        }
      ])
    
    if (memberError) {
      console.error('Error creating member record:', memberError)
    }
  }

  return { data, error }
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // If sign in successful, ensure member record exists
  if (!error && data.user) {
    const { data: existingMember, error: fetchError } = await supabase
      .from('members')
      .select('id')
      .eq('id', data.user.id)
      .single()

    // If member record doesn't exist, create it
    if (fetchError || !existingMember) {
      const initials = email.split('@')[0].toUpperCase().slice(0, 2)
      await supabase
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
        .select()
    }
  }

  return { data, error }
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
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

export async function onAuthStateChange(callback: (user: any) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(session?.user || null)
    }
  )
  return subscription
}

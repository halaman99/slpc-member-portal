import { useEffect, useState, useCallback } from 'react'
import { supabase } from './supabase'

/**
 * Hook to subscribe to realtime member updates
 */
export function useRealtimeMembers() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let subscription: any

    const fetchAndSubscribe = async () => {
      try {
        // Initial fetch - only active members
        const { data, error: fetchError } = await supabase
          .from('members')
          .select('*')
          .eq('is_deleted', false)
          .order('full_name', { ascending: true })

        if (fetchError) throw fetchError

        setMembers(data || [])
        setError(null)
        setLoading(false)

        // Subscribe to realtime changes
        subscription = supabase
          .channel('members:realtime')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'members',
              filter: 'is_deleted=eq.false',
            },
            (payload: any) => {
              if (payload.eventType === 'INSERT') {
                setMembers((prev) => [...prev, payload.new])
              } else if (payload.eventType === 'UPDATE') {
                // Update member or remove if soft-deleted
                if (payload.new.is_deleted) {
                  setMembers((prev) => prev.filter((m) => m.id !== payload.new.id))
                } else {
                  setMembers((prev) =>
                    prev.map((m) => (m.id === payload.new.id ? payload.new : m))
                  )
                }
              } else if (payload.eventType === 'DELETE') {
                setMembers((prev) => prev.filter((m) => m.id !== payload.old.id))
              }
            }
          )
          .subscribe()
      } catch (err) {
        console.error('Error fetching members:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    fetchAndSubscribe()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  return { members, loading, error }
}

/**
 * Hook to subscribe to realtime duties updates
 */
export function useRealtimeDuties(memberId?: string) {
  const [duties, setDuties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let subscription: any

    const fetchAndSubscribe = async () => {
      try {
        let query = supabase
          .from('duties')
          .select('*')
          .eq('is_deleted', false)
          .order('date', { ascending: true })

        if (memberId) {
          query = query.eq('member_id', memberId)
        }

        const { data, error: fetchError } = await query

        if (fetchError) throw fetchError

        setDuties(data || [])
        setError(null)
        setLoading(false)

        // Subscribe to realtime changes
        const channel = supabase.channel('duties:realtime')
        
        if (memberId) {
          channel.on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'duties',
              filter: `member_id=eq.${memberId}`,
            },
            handleDutyChange
          )
        } else {
          channel.on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'duties',
              filter: 'is_deleted=eq.false',
            },
            handleDutyChange
          )
        }

        subscription = channel.subscribe()

        function handleDutyChange(payload: any) {
          if (payload.eventType === 'INSERT') {
            setDuties((prev) => [...prev, payload.new])
          } else if (payload.eventType === 'UPDATE') {
            if (payload.new.is_deleted) {
              setDuties((prev) => prev.filter((d) => d.id !== payload.new.id))
            } else {
              setDuties((prev) =>
                prev.map((d) => (d.id === payload.new.id ? payload.new : d))
              )
            }
          } else if (payload.eventType === 'DELETE') {
            setDuties((prev) => prev.filter((d) => d.id !== payload.old.id))
          }
        }
      } catch (err) {
        console.error('Error fetching duties:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    fetchAndSubscribe()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [memberId])

  return { duties, loading, error }
}

/**
 * Hook to subscribe to realtime events updates
 */
export function useRealtimeEvents() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let subscription: any

    const fetchAndSubscribe = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('events')
          .select('*')
          .eq('is_deleted', false)
          .order('date', { ascending: true })

        if (fetchError) throw fetchError

        setEvents(data || [])
        setError(null)
        setLoading(false)

        subscription = supabase
          .channel('events:realtime')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'events',
              filter: 'is_deleted=eq.false',
            },
            (payload: any) => {
              if (payload.eventType === 'INSERT') {
                setEvents((prev) => [...prev, payload.new])
              } else if (payload.eventType === 'UPDATE') {
                if (payload.new.is_deleted) {
                  setEvents((prev) => prev.filter((e) => e.id !== payload.new.id))
                } else {
                  setEvents((prev) =>
                    prev.map((e) => (e.id === payload.new.id ? payload.new : e))
                  )
                }
              } else if (payload.eventType === 'DELETE') {
                setEvents((prev) => prev.filter((e) => e.id !== payload.old.id))
              }
            }
          )
          .subscribe()
      } catch (err) {
        console.error('Error fetching events:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    fetchAndSubscribe()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  return { events, loading, error }
}

/**
 * Hook to subscribe to realtime announcements updates
 */
export function useRealtimeAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let subscription: any

    const fetchAndSubscribe = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('announcements')
          .select('*')
          .eq('is_deleted', false)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        setAnnouncements(data || [])
        setError(null)
        setLoading(false)

        subscription = supabase
          .channel('announcements:realtime')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'announcements',
              filter: 'is_deleted=eq.false',
            },
            (payload: any) => {
              if (payload.eventType === 'INSERT') {
                setAnnouncements((prev) => [payload.new, ...prev])
              } else if (payload.eventType === 'UPDATE') {
                if (payload.new.is_deleted) {
                  setAnnouncements((prev) =>
                    prev.filter((a) => a.id !== payload.new.id)
                  )
                } else {
                  setAnnouncements((prev) =>
                    prev.map((a) => (a.id === payload.new.id ? payload.new : a))
                  )
                }
              } else if (payload.eventType === 'DELETE') {
                setAnnouncements((prev) =>
                  prev.filter((a) => a.id !== payload.old.id)
                )
              }
            }
          )
          .subscribe()
      } catch (err) {
        console.error('Error fetching announcements:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    fetchAndSubscribe()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  return { announcements, loading, error }
}

/**
 * Hook to check if current user is admin
 */
export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        if (!sessionData.session?.user) {
          setIsAdmin(false)
          setLoading(false)
          return
        }

        const { data: member, error } = await supabase
          .from('members')
          .select('is_admin')
          .eq('id', sessionData.session.user.id)
          .single()

        if (error) throw error

        setIsAdmin(member?.is_admin || false)
      } catch (err) {
        console.error('Error checking admin status:', err)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [])

  return { isAdmin, loading }
}

/**
 * Hook to get current user's admin invites
 */
export function useAdminInvites() {
  const [invites, setInvites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let subscription: any

    const fetchAndSubscribe = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        if (!sessionData.session?.user?.email) {
          setLoading(false)
          return
        }

        // Fetch invites for this user's email
        const { data, error: fetchError } = await supabase
          .from('admin_invites')
          .select('*')
          .eq('invitee_email', sessionData.session.user.email)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        setInvites(data || [])
        setError(null)
        setLoading(false)

        // Subscribe to changes
        subscription = supabase
          .channel(`admin_invites:${sessionData.session.user.email}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'admin_invites',
              filter: `invitee_email=eq.${sessionData.session.user.email}`,
            },
            (payload: any) => {
              if (payload.eventType === 'INSERT') {
                setInvites((prev) => [payload.new, ...prev])
              } else if (payload.eventType === 'UPDATE') {
                setInvites((prev) =>
                  prev.map((i) => (i.id === payload.new.id ? payload.new : i))
                )
              }
            }
          )
          .subscribe()
      } catch (err) {
        console.error('Error fetching admin invites:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    fetchAndSubscribe()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  return { invites, loading, error }
}

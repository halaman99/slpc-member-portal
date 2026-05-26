import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Member, Duty, Event } from './types'

// ============================================================================
// REALTIME HOOKS
// ============================================================================

export function useRealtimeMembers(onUpdate?: (data: Member[]) => void) {
  const [data, setData] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data: members, error: err } = await supabase
          .from('members')
          .select('*')
          .eq('is_deleted', false)
          .order('full_name')

        if (err) throw err
        setData(members || [])
        onUpdate?.(members || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()

    const subscription = supabase
      .channel('members')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members',
        },
        (payload) => {
          if (payload.new.is_deleted === false) {
            setData((prev) => {
              const exists = prev.find((m) => m.id === payload.new.id)
              if (exists) {
                return prev.map((m) =>
                  m.id === payload.new.id ? payload.new : m
                )
              }
              return [...prev, payload.new]
            })
          } else {
            setData((prev) => prev.filter((m) => m.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [onUpdate])

  return { data, loading, error }
}

export function useRealtimeDuties(onUpdate?: (data: Duty[]) => void) {
  const [data, setData] = useState<Duty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchDuties = async () => {
      try {
        const { data: duties, error: err } = await supabase
          .from('duties')
          .select('*')
          .eq('is_deleted', false)
          .order('date', { ascending: false })

        if (err) throw err
        setData(duties || [])
        onUpdate?.(duties || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchDuties()

    const subscription = supabase
      .channel('duties')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'duties',
        },
        (payload) => {
          if (payload.new.is_deleted === false) {
            setData((prev) => {
              const exists = prev.find((d) => d.id === payload.new.id)
              if (exists) {
                return prev.map((d) =>
                  d.id === payload.new.id ? payload.new : d
                )
              }
              return [...prev, payload.new]
            })
          } else {
            setData((prev) => prev.filter((d) => d.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [onUpdate])

  return { data, loading, error }
}

export function useRealtimeEvents(onUpdate?: (data: Event[]) => void) {
  const [data, setData] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data: events, error: err } = await supabase
          .from('events')
          .select('*')
          .eq('is_deleted', false)
          .order('date', { ascending: false })

        if (err) throw err
        setData(events || [])
        onUpdate?.(events || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()

    const subscription = supabase
      .channel('events')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
        },
        (payload) => {
          if (payload.new.is_deleted === false) {
            setData((prev) => {
              const exists = prev.find((e) => e.id === payload.new.id)
              if (exists) {
                return prev.map((e) =>
                  e.id === payload.new.id ? payload.new : e
                )
              }
              return [...prev, payload.new]
            })
          } else {
            setData((prev) => prev.filter((e) => e.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [onUpdate])

  return { data, loading, error }
}

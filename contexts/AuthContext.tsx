'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { onAuthStateChange, getSession } from '@/lib/auth'

interface AuthUser {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  error: null,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let subscription: any = null

    const setupAuth = async () => {
      try {
        // Check initial session
        const { session, error: sessionError } = await getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setError(sessionError.message)
        }

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name,
            avatar_url: session.user.user_metadata?.avatar_url,
          })
          setError(null)
        }

        // Subscribe to auth changes
        const { data } = await (await import('@/lib/auth')).supabase.auth.onAuthStateChange(
          (event: string, session: any) => {
            if (session?.user) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name,
                avatar_url: session.user.user_metadata?.avatar_url,
              })
              setError(null)
            } else {
              setUser(null)
            }
          }
        )
        subscription = data?.subscription
      } catch (err) {
        console.error('Auth setup error:', err)
        setError(err instanceof Error ? err.message : 'Auth initialization failed')
      } finally {
        setLoading(false)
      }
    }

    setupAuth()

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

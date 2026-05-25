'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function GuardedComponent(props: P) {
    const { user, loading, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push('/auth/login')
      }
    }, [loading, isAuthenticated, router])

    if (loading) {
      return (
        <div className="min-h-screen bg-[#1a0808] flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#c9a227] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#8a6070]">Loading...</p>
          </div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null
    }

    return <Component {...props} />
  }
}

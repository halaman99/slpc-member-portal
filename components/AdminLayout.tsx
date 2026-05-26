'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useIsAdmin } from '@/lib/useRealtime'
import { Bell, LogOut, Menu, X, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface AdminLayoutProps {
  children: React.ReactNode
  user?: any
}

export function AdminLayout({ children, user }: AdminLayoutProps) {
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuth()
  const { isAdmin, loading: adminLoading } = useIsAdmin()
  const [member, setMember] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch member details on auth user change
  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (!authUser?.id) return

      try {
        const { data, error: fetchError } = await supabase
          .from('members')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (fetchError) throw fetchError
        setMember(data)
      } catch (err) {
        console.error('Error fetching member details:', err)
        setError('Failed to load member details')
      }
    }

    fetchMemberDetails()
  }, [authUser?.id])

  // Redirect non-admins
  useEffect(() => {
    if (!authLoading && !adminLoading && !isAdmin) {
      setError('You do not have admin access')
      // Redirect after a short delay to show message
      const timer = setTimeout(() => {
        router.push('/app/dashboard?message=admin_access_denied')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [authLoading, adminLoading, isAdmin, router])

  // Loading state
  if (authLoading || adminLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1a0808]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#c9a227] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#8a6070]">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Access denied
  if (error && !isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1a0808]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#c95a5a] bg-opacity-20 flex items-center justify-center mx-auto mb-4">
            <span className="text-[#c95a5a] text-xl">⚠️</span>
          </div>
          <p className="text-[#c95a5a] font-medium mb-2">{error}</p>
          <p className="text-[#8a6070] text-sm">Redirecting...</p>
        </div>
      </div>
    )
  }

  const displayUser = member || user || { full_name: 'Admin', avatar_initials: 'AD', role: 'Administrator' }

  return (
    <div className="min-h-screen bg-[#1a0808]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#1a0808] border-b border-[rgba(201,162,39,0.15)] z-40">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[#8a6070] hover:text-[#c9b8a8] transition-colors md:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-semibold text-[#f5f0e8]">Admin Portal</h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button className="text-[#8a6070] hover:text-[#c9b8a8] transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#c95a5a] rounded-full"></span>
            </button>

            {/* Admin Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2a1010] border border-[#c9a227]">
              <div className="w-2 h-2 rounded-full bg-[#4aaa4a]"></div>
              <span className="text-xs font-medium text-[#c9a227]">ADMIN</span>
            </div>

            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#5c1a1a] border border-[#c9a227] flex items-center justify-center text-xs font-medium text-[#c9a227]">
              {displayUser.avatar_initials || 'AD'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-[#1a0808] border-r border-[rgba(201,162,39,0.15)] transition-transform duration-200 md:translate-x-0 z-30 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Content */}
          <div className="p-4 space-y-2 overflow-y-auto h-full">
            {/* Welcome Section */}
            <div className="mb-6 px-3 py-4 rounded-lg bg-[#2a1010] border border-[rgba(201,162,39,0.1)]">
              <p className="text-xs text-[#8a6070] mb-1">Logged in as</p>
              <p className="text-sm font-medium text-[#f5f0e8] truncate">
                {displayUser.full_name}
              </p>
              <p className="text-[10px] text-[#6a5060]">Administrator</p>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {[
                { href: '/app/admin', label: 'Dashboard', icon: '📊' },
                { href: '/app/admin/members', label: 'Members', icon: '👥' },
                { href: '/app/admin/duties', label: 'Duties', icon: '📅' },
                { href: '/app/admin/events', label: 'Events', icon: '📌' },
                { href: '/app/admin/requests', label: 'Requests', icon: '📋' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-[#c8b8a0] hover:bg-[#2a1010] hover:text-[#c9a227] transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </nav>

            {/* Divider */}
            <div className="my-4 border-t border-[rgba(201,162,39,0.1)]"></div>

            {/* Admin Actions */}
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold text-[#6a5060] uppercase tracking-wider">
                Actions
              </p>
              <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#c9a227] bg-[#2a1010] hover:bg-[#3a1a1a] transition-colors border border-[rgba(201,162,39,0.2)]">
                <span>➕</span>
                <span>Invite Admin</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-200 ${sidebarOpen ? 'md:ml-64' : ''}`}>
          {/* Breadcrumb */}
          <div className="border-b border-[rgba(201,162,39,0.15)] px-6 py-3 hidden md:block">
            <div className="flex items-center gap-2 text-sm text-[#8a6070]">
              <a href="/app/admin" className="hover:text-[#c9a227] transition-colors">
                Admin
              </a>
              <span>/</span>
              <span className="text-[#c9b8a0]">Dashboard</span>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">{children}</div>
        </main>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </div>
    </div>
  )
}

'use client'

import { Sidebar } from './Sidebar'
import { Bell } from 'lucide-react'

export function MainLayout({ children, user }: { children: React.ReactNode; user?: any }) {
  return (
    <div className="min-h-screen bg-[#1a0808]">
      <Sidebar />
      <main className="ml-[200px] min-h-screen">
        {/* Top Bar */}
        <div className="bg-[#1a0808] border-b border-[rgba(201,162,39,0.15)] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-[#8a6070] mb-0.5">Good morning,</div>
              <h1 className="text-lg font-medium text-[#f5f0e8]">
                {user?.full_name} <span className="text-[#c9a227] text-sm font-normal">· {user?.role}</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-[#8a6070] hover:text-[#c9b8a8] transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full bg-[#5c1a1a] border border-[#c9a227] flex items-center justify-center text-xs font-medium text-[#c9a227]">
                {user?.avatar_initials || 'JR'}
              </div>
              <span className="text-sm text-[#c8b8a0]">{user?.full_name?.split(' ')[0] || 'User'}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}

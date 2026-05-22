'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  BookOpen,
  CalendarEvent,
  Users,
  Bell,
  Settings,
  LogOut,
  Cross,
} from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/schedule', label: 'My Schedule', icon: Calendar },
    { href: '/attendance', label: 'Attendance', icon: BarChart3 },
    { href: '/formation', label: 'Formation', icon: BookOpen },
    { href: '/events', label: 'Events', icon: CalendarEvent },
    { href: '/members', label: 'Members', icon: Users },
    { href: '/announcements', label: 'Announcements', icon: Bell },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[200px] bg-[#2a1010] p-0 flex flex-col border-r border-[rgba(201,162,39,0.2)]">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-[rgba(201,162,39,0.2)]">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-3.5 h-3.5 bg-[#c9a227] rounded-sm relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0.5 h-3.5 bg-[#c9a227]" />
              <div className="absolute w-3.5 h-0.5 bg-[#c9a227]" />
            </div>
          </div>
          <span className="text-[#f5f0e8] text-sm font-medium">Member Portal</span>
        </div>
        <div className="text-[#8a6070] text-xs">St. Lodovico Pavoni</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pt-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm border-l-[3px] transition-colors ${
                active
                  ? 'bg-[rgba(201,162,39,0.1)] border-l-[#c9a227] text-[#f5f0e8]'
                  : 'text-[#8a6a7a] border-l-transparent hover:text-[#c9b8a8]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Settings & Logout */}
      <div className="border-t border-[rgba(201,162,39,0.2)] p-4">
        <Link
          href="/settings"
          className={`flex items-center gap-2.5 px-0 py-2 text-sm transition-colors ${
            isActive('/settings')
              ? 'text-[#f5f0e8]'
              : 'text-[#8a6070] hover:text-[#c9b8a8]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>
        <button className="flex items-center gap-2.5 px-0 py-2 text-sm text-[#8a6070] hover:text-[#c9b8a8] transition-colors w-full">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

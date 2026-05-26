'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Users,
  Calendar,
  Briefcase,
  Mail,
  BarChart3,
  LogOut,
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const MENU_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/members', label: 'Members', icon: Users },
  { href: '/admin/duties', label: 'Duties', icon: Briefcase },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/requests', label: 'Admin Requests', icon: Mail },
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        </div>

        <nav className="space-y-1 px-4">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 w-64">
          <Link
            href="/api/auth/logout"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md transition"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

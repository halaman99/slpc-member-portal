'use client'

import { Search, Filter } from 'lucide-react'

interface FilterBarProps {
  onSearchChange: (search: string) => void
  onRoleChange?: (role: string) => void
  onAdminFilterChange?: (isAdmin: boolean | null) => void
  roles?: string[]
  searchPlaceholder?: string
}

export function FilterBar({
  onSearchChange,
  onRoleChange,
  onAdminFilterChange,
  roles = [],
  searchPlaceholder = 'Search by name, email...',
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a6070]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-[#3a2020] border border-[#5a3030] rounded text-sm text-[#f5f0e8] placeholder-[#8a6070] focus:outline-none focus:border-[#c9a227]"
          />
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Filter className="w-4 h-4 text-[#8a6070] mt-2" />

        {roles.length > 0 && onRoleChange && (
          <select
            onChange={(e) => onRoleChange(e.target.value)}
            className="px-3 py-2 bg-[#3a2020] border border-[#5a3030] rounded text-xs text-[#f5f0e8] focus:outline-none focus:border-[#c9a227]"
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        )}

        {onAdminFilterChange && (
          <select
            onChange={(e) => {
              const val = e.target.value
              onAdminFilterChange(val === '' ? null : val === 'admin')
            }}
            className="px-3 py-2 bg-[#3a2020] border border-[#5a3030] rounded text-xs text-[#f5f0e8] focus:outline-none focus:border-[#c9a227]"
          >
            <option value="">All Members</option>
            <option value="admin">Admin Only</option>
            <option value="member">Members Only</option>
          </select>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

interface FilterBarProps {
  onSearch?: (query: string) => void
  onFilterChange?: (filters: Record<string, string>) => void
  filters?: {
    name: string
    label: string
    options: { label: string; value: string }[]
  }[]
  placeholder?: string
  showSearch?: boolean
}

export function FilterBar({
  onSearch,
  onFilterChange,
  filters = [],
  placeholder = 'Search...',
  showSearch = true,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >({})

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleFilterChange = (
    filterName: string,
    value: string
  ) => {
    const newFilters = {
      ...selectedFilters,
      [filterName]: value === '' ? undefined : value,
    }
    setSelectedFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  return (
    <div className="space-y-4 mb-6">
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {filters.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {filters.map((filter) => (
            <div key={filter.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {filter.label}
              </label>
              <select
                value={selectedFilters[filter.name] || ''}
                onChange={(e) =>
                  handleFilterChange(filter.name, e.target.value)
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyField: keyof T
  onRowClick?: (item: T) => void
  isLoading?: boolean
  emptyMessage?: string
  pageSize?: number
}

export function DataTable<T extends object>({
  columns,
  data,
  keyField,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No data available',
  pageSize = 20,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  // Handle sort
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
    setCurrentPage(1)
  }

  // Sort data
  let sortedData = [...data]
  if (sortKey) {
    sortedData.sort((a, b) => {
      const aVal = (a as any)[sortKey]
      const bVal = (b as any)[sortKey]

      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      if (typeof aVal === 'string') {
        return sortAsc
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      return sortAsc ? (aVal > bVal ? 1 : -1) : (aVal > bVal ? -1 : 1)
    })
  }

  // Paginate
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const startIdx = (currentPage - 1) * pageSize
  const paginatedData = sortedData.slice(startIdx, startIdx + pageSize)

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-center py-8 text-[#b8ada0]">Loading...</div>
      ) : sortedData.length === 0 ? (
        <div className="text-center py-8 text-[#b8ada0]">{emptyMessage}</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#3a2020]">
                  {columns.map((col) => (
                    <th
                      key={String(col.key)}
                      className={`px-4 py-3 text-left text-xs font-semibold text-[#c8b8a0] ${
                        col.sortable ? 'cursor-pointer hover:text-[#f5f0e8]' : ''
                      }`}
                      onClick={() => col.sortable && handleSort(String(col.key))}
                      style={{ width: col.width }}
                    >
                      <div className="flex items-center gap-2">
                        {col.label}
                        {col.sortable && sortKey === String(col.key) && (
                          sortAsc ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr
                    key={String(item[keyField])}
                    className="border-b border-[#3a2020] hover:bg-[#3a2020]/50 transition-colors"
                    onClick={() => onRowClick && onRowClick(item)}
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className="px-4 py-3 text-sm text-[#d0c0b0]"
                        style={{ width: col.width }}
                      >
                        {col.render
                          ? col.render((item as any)[String(col.key)], item)
                          : (item as any)[String(col.key)]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8a6070]">
                Showing {startIdx + 1}-{Math.min(startIdx + pageSize, sortedData.length)} of{' '}
                {sortedData.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-[#3a2020] rounded text-xs disabled:opacity-50 hover:border-[#c9a227] transition-colors"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-xs text-[#8a6070]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-[#3a2020] rounded text-xs disabled:opacity-50 hover:border-[#c9a227] transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

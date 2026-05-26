'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

export interface DataTableColumn<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
  width?: string
}

interface DataTableProps<T extends Record<string, any>> {
  columns: DataTableColumn<T>[]
  data: T[]
  loading?: boolean
  onRowClick?: (row: T) => void
  emptyMessage?: string
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  onRowClick,
  emptyMessage = 'No data found',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string | (keyof T), sortable?: boolean) => {
    if (!sortable) return

    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(String(key))
      setSortOrder('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0

    const aVal = a[sortKey]
    const bVal = b[sortKey]

    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1

    if (typeof aVal === 'string') {
      return sortOrder === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }

    if (typeof aVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    }

    return 0
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                onClick={() => handleSort(col.key, col.sortable)}
                className={`px-6 py-3 text-left text-sm font-semibold text-gray-900 ${
                  col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
                style={{ width: col.width }}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <>
                      {sortOrder === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedData.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick?.(row)}
              className={`${
                onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
              } transition`}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="px-6 py-4 text-sm text-gray-900"
                  style={{ width: col.width }}
                >
                  {col.render
                    ? col.render(row[String(col.key)], row)
                    : row[String(col.key)]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

'use client'

interface StatusBadgeProps {
  status: string
  variant?: 'role' | 'admin' | 'duty' | 'event'
}

export function StatusBadge({ status, variant = 'role' }: StatusBadgeProps) {
  const getStyles = () => {
    switch (variant) {
      case 'admin':
        return status === 'true' || status === true
          ? 'bg-purple-100 text-purple-800'
          : 'bg-gray-100 text-gray-800'
      case 'duty':
        switch (status) {
          case 'served':
            return 'bg-green-100 text-green-800'
          case 'absent':
            return 'bg-red-100 text-red-800'
          case 'late':
            return 'bg-yellow-100 text-yellow-800'
          case 'scheduled':
            return 'bg-blue-100 text-blue-800'
          case 'standby':
            return 'bg-orange-100 text-orange-800'
          default:
            return 'bg-gray-100 text-gray-800'
        }
      case 'event':
        switch (status) {
          case 'feast':
            return 'bg-pink-100 text-pink-800'
          case 'training':
            return 'bg-blue-100 text-blue-800'
          case 'recollection':
            return 'bg-purple-100 text-purple-800'
          case 'outreach':
            return 'bg-green-100 text-green-800'
          default:
            return 'bg-gray-100 text-gray-800'
        }
      case 'role':
      default:
        switch (status) {
          case 'Cantor':
            return 'bg-blue-100 text-blue-800'
          case 'Server':
            return 'bg-green-100 text-green-800'
          case 'Sacristan':
            return 'bg-purple-100 text-purple-800'
          case 'Member':
            return 'bg-gray-100 text-gray-800'
          default:
            return 'bg-gray-100 text-gray-800'
        }
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStyles()}`}
    >
      {status}
    </span>
  )
}

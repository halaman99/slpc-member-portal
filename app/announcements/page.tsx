'use client'
import { MainLayout } from '@/components/MainLayout'
import { Card, CardHeader, StatCard, Badge } from '@/components/UI'
import { Bell, Pin, AlertCircle, CheckCircle, MessageCircle } from 'lucide-react'

const mockUser = { full_name: 'Jose Reyes', role: 'Head Server', avatar_initials: 'JR' }

const announcements = [
  {
    id: '1',
    title: 'Summer Schedule Now Available',
    category: 'schedule' as const,
    date: 'May 20, 2026',
    author: 'Father Thomas',
    content: 'The summer mass schedule for June through August has been posted. Please review your assignments and confirm your availability.',
    priority: 'high' as const,
    pinned: true,
    unread: false,
  },
  {
    id: '2',
    title: 'Pentecost Celebration - Volunteers Needed',
    category: 'event' as const,
    date: 'May 19, 2026',
    author: 'Maria Garcia',
    content: 'We are looking for volunteers to help with the Pentecost celebration on June 8th. This includes servers, hospitality, and setup assistance.',
    priority: 'high' as const,
    pinned: true,
    unread: true,
  },
  {
    id: '3',
    title: 'New Formation Materials Available',
    category: 'formation' as const,
    date: 'May 18, 2026',
    author: 'Father Thomas',
    content: 'Advanced liturgical techniques course is now available in the Formation section. This is recommended for all senior servers.',
    priority: 'normal' as const,
    pinned: false,
    unread: false,
  },
  {
    id: '4',
    title: 'Maintenance Work on Church Roof',
    category: 'maintenance' as const,
    date: 'May 17, 2026',
    author: 'Parish Administrator',
    content: 'Please note that roof maintenance will occur June 1-3. Some areas of the church will be off-limits during this time.',
    priority: 'normal' as const,
    pinned: false,
    unread: false,
  },
  {
    id: '5',
    title: 'Updated Dress Code for Summer Masses',
    category: 'policy' as const,
    date: 'May 15, 2026',
    author: 'Father Thomas',
    content: 'Due to summer heat, lighter vestments are permitted for weekday masses. Details have been posted in the Formation section.',
    priority: 'normal' as const,
    pinned: false,
    unread: false,
  },
  {
    id: '6',
    title: 'Confessions Schedule Change',
    category: 'schedule' as const,
    date: 'May 14, 2026',
    author: 'Father Thomas',
    content: 'Confession times have been adjusted for the summer. Saturday: 3-5 PM, Wednesday: 5-6 PM.',
    priority: 'normal' as const,
    pinned: false,
    unread: false,
  },
]

const categories = [
  { name: 'schedule', label: 'Schedule', count: 2 },
  { name: 'event', label: 'Events', count: 1 },
  { name: 'formation', label: 'Formation', count: 1 },
  { name: 'maintenance', label: 'Maintenance', count: 1 },
  { name: 'policy', label: 'Policy', count: 1 },
]

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'schedule': return 'blue'
    case 'event': return 'purple'
    case 'formation': return 'teal'
    case 'maintenance': return 'amber'
    case 'policy': return 'green'
    default: return 'red'
  }
}

export default function Announcements() {
  const pinnedCount = announcements.filter(a => a.pinned).length
  const unreadCount = announcements.filter(a => a.unread).length

  return (
    <MainLayout user={mockUser}>
      <div className="space-y-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Total Announcements" value={announcements.length} sub="this month" badge={{ text: 'This month', color: 'green' as const }} />
          <StatCard label="Pinned" value={pinnedCount} sub="important" badge={{ text: 'Important', color: 'red' as const }} />
          <StatCard label="Unread" value={unreadCount} sub="new" badge={{ text: 'New', color: 'amber' as const }} />
          <StatCard label="High Priority" value={announcements.filter(a => a.priority === 'high').length} sub="requires attention" badge={{ text: 'Attention', color: 'red' as const }} />
        </div>

        {/* Category Filter */}
        <Card>
          <CardHeader
            title="Announcements by Category"
            link={{ label: 'All categories' }}
            icon={<MessageCircle className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <div className="grid grid-cols-5 gap-3">
            {categories.map((cat) => (
              <button key={cat.name} className="p-3 border border-[#3a2020] rounded hover:border-[#c9a227] transition-colors text-center hover:bg-[#2a1010]">
                <p className="text-2xl font-bold text-[#c9a227] mb-1">{cat.count}</p>
                <p className="text-sm font-semibold text-[#f5f0e8]">{cat.label}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Announcements Feed */}
        <Card>
          <CardHeader
            title="Announcement Feed"
            link={{ label: 'Mark all as read' }}
            icon={<Bell className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <div className="space-y-2">
            {announcements.map((announcement) => (
              <div key={announcement.id} className={`p-3 border rounded transition-colors ${
                announcement.unread
                  ? 'border-[#c9a227] bg-[#2a1010]'
                  : 'border-[#3a2020] hover:border-[#c9a227]/50'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2 flex-1">
                    {announcement.pinned && (
                      <Pin className="w-4 h-4 text-[#c9a227] mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h4 className={`font-semibold ${announcement.unread ? 'text-[#c9a227]' : 'text-[#f5f0e8]'}`}>
                        {announcement.title}
                      </h4>
                      <p className="text-xs text-[#b8ada0]">{announcement.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {announcement.unread && (
                      <div className="w-2 h-2 rounded-full bg-[#c9a227]" />
                    )}
                    <Badge
                      text={announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                      color={getCategoryColor(announcement.category)}
                    />
                  </div>
                </div>

                <p className="text-sm text-[#b8ada0] mb-2">{announcement.content}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8a7a70]">{announcement.date}</span>
                  <div className="flex gap-2">
                    <button className="text-xs text-[#c9a227] hover:text-[#f5f0e8] transition-colors">
                      {announcement.unread ? 'Mark as read' : 'View'}
                    </button>
                    <button className="text-xs text-[#b8ada0] hover:text-[#f5f0e8] transition-colors">
                      More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}

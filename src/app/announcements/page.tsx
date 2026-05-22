'use client'

import { MainLayout } from '@/components/MainLayout'
import { Card, CardHeader, Badge } from '@/components/UI'
import { Bell, Clock, AlertCircle } from 'lucide-react'

const mockUser = { id: '1', full_name: 'Jose Reyes', role: 'Head Server', avatar_initials: 'JR', email: 'jose.reyes@example.com' }

const announcements = [
  { id: 1, title: 'Pentecost Mass — report by 7:30 AM', message: 'Full vestments. Be early for preparation.', category: 'urgent', time: 'Today', postedBy: 'Admin' },
  { id: 2, title: 'June recollection confirmed', message: 'Monthly recollection has been confirmed for June 1 at 9:00 AM in the Formation room.', category: 'event', time: '2 days ago', postedBy: 'Coordinator' },
  { id: 3, title: 'Schedule swap request — Angelo L.', message: 'Angelo is requesting to trade his June 7 Mass slot. Please review and respond.', category: 'request', time: '3 days ago', postedBy: 'Angelo Lim' },
  { id: 4, title: 'New formation video uploaded', message: 'Check out Part 2 of "Rite of Mass" in the Formation section.', category: 'info', time: '5 days ago', postedBy: 'Formation Lead' },
  { id: 5, title: 'Holy Week preparation begins', message: 'Holy Week duties assignments will be made next week. Ensure you\'re available to serve.', category: 'event', time: '1 week ago', postedBy: 'Admin' },
  { id: 6, title: 'New member orientation', message: 'Welcome to our three new members! Orientation session scheduled for May 30.', category: 'info', time: '1 week ago', postedBy: 'Coordinator' },
]

const categoryStyles = {
  urgent: { color: 'red' as const, label: 'Urgent', icon: AlertCircle },
  event: { color: 'amber' as const, label: 'Event' },
  info: { color: 'blue' as const, label: 'Info' },
  request: { color: 'purple' as const, label: 'Request' },
}

export default function Announcements() {
  return (
    <MainLayout user={mockUser}>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#f5f0e8] mb-2">Announcements</h2>
          <p className="text-sm text-[#8a6070]">Stay updated with the latest news and information</p>
        </div>

        <Card>
          <CardHeader title="All Announcements" icon={<Bell className="w-4 h-4 text-[#c9a227]" />} />
          <div className="space-y-3">
            {announcements.map((announcement) => {
              const style = categoryStyles[announcement.category as keyof typeof categoryStyles]
              return (
                <div key={announcement.id} className="p-4 bg-[#1a0808] rounded-lg border border-[rgba(201,162,39,0.1)] hover:border-[rgba(201,162,39,0.3)] transition-colors">
                  <div className="flex items-start gap-3">
                    {announcement.category === 'urgent' && (
                      <AlertCircle className="w-5 h-5 text-[#c95a5a] flex-shrink-0 mt-0.5" />
                    )}
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{
                      backgroundColor: {
                        urgent: '#c95a5a',
                        event: '#c9a227',
                        info: '#5a8ac9',
                        request: '#9a5ac9',
                      }[announcement.category]
                    }}></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-[#e8dcc8] mb-1">{announcement.title}</h3>
                      <p className="text-xs text-[#8a6070] mb-3">{announcement.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-[#6a5060] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{announcement.time}</span>
                        </div>
                        <Badge text={style.label} color={style.color} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}

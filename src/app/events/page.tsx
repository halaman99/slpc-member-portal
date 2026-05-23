'use client'

import { MainLayout } from '@/components/MainLayout'
import { Card, CardHeader, Badge } from '@/components/UI'
import { Calendar, MapPin, Clock } from 'lucide-react'

const mockUser = { id: '1', full_name: 'Jose Reyes', role: 'Head Server', avatar_initials: 'JR', email: 'jose.reyes@example.com' }

const events = [
  { id: 1, date: 'May 25', month: 'Sun', title: 'Pentecost Sunday — Solemn Mass', time: '6:00 AM & 8:00 AM', location: 'Main altar', type: 'feast', joined: true },
  { id: 2, date: 'Jun 1', month: 'Sun', title: 'Monthly recollection', time: '9:00 AM – 12:00 NN', location: 'Formation room', type: 'recollection', joined: false },
  { id: 3, date: 'Jun 7', month: 'Fri', title: 'Server training session', time: '2:00 PM', location: 'Sanctuary — new members', type: 'training', joined: false },
  { id: 4, date: 'Jun 13', month: 'Thu', title: 'Feast of St. Anthony — procession', time: '6:00 PM', location: 'Parish grounds', type: 'feast', joined: false },
  { id: 5, date: 'Jun 21', month: 'Fri', title: 'Community outreach — Pavoni Day', time: '7:00 AM – 4:00 PM', location: 'Parish grounds', type: 'outreach', joined: true },
]

const typeColors = {
  feast: { color: 'amber' as const, label: 'Feast day' },
  training: { color: 'blue' as const, label: 'Training' },
  recollection: { color: 'purple' as const, label: 'Recollection' },
  outreach: { color: 'teal' as const, label: 'Outreach' },
}

export default function Events() {
  return (
    <MainLayout user={mockUser}>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#f5f0e8] mb-2">Events Calendar</h2>
          <p className="text-sm text-[#8a6070]">Important events and meetings for the community</p>
        </div>

        <Card>
          <CardHeader title="Upcoming Events" icon={<Calendar className="w-4 h-4 text-[#c9a227]" />} />
          <div className="space-y-3">
            {events.map((event) => {
              const typeInfo = typeColors[event.type as keyof typeof typeColors]
              return (
                <div key={event.id} className="flex gap-4 p-4 bg-[#1a0808] rounded-lg border border-[rgba(201,162,39,0.1)] hover:border-[rgba(201,162,39,0.3)] transition-colors">
                  <div className="text-center min-w-[50px]">
                    <div className="text-lg font-bold text-[#c9a227]">{event.date.split(' ')[0]}</div>
                    <div className="text-xs text-[#8a6070] uppercase mt-0.5">{event.month}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[#e8dcc8] mb-2">{event.title}</h3>
                    <div className="flex flex-col gap-1 text-xs text-[#8a6070]">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge text={typeInfo.label} color={typeInfo.color} />
                    <button className="px-3 py-1.5 bg-[#c9a227] text-[#1a0808] rounded-lg text-xs font-medium hover:bg-[#dbb237] transition-colors">
                      {event.joined ? 'Joined' : 'Join'}
                    </button>
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

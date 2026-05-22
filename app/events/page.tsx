'use client'
import { MainLayout } from '@/components/MainLayout'
import { Card, CardHeader, StatCard, Badge } from '@/components/UI'
import { Calendar, Users, MapPin, Clock, Ticket } from 'lucide-react'

const mockUser = { full_name: 'Jose Reyes', role: 'Head Server', avatar_initials: 'JR' }

const upcomingEvents = [
  {
    id: '1',
    title: 'Pentecost Celebration',
    date: 'June 8, 2026',
    time: '10:00 AM - 2:00 PM',
    location: 'Main Church & Parish Hall',
    attendees: 285,
    registered: true,
    role: 'Server',
    description: 'Major feast day celebration with special liturgy and fellowship',
  },
  {
    id: '2',
    title: 'Summer Retreat',
    date: 'July 15-17, 2026',
    time: 'Full day event',
    location: 'St. Catherine Retreat Center',
    attendees: 45,
    registered: true,
    role: 'Participant',
    description: 'Three-day spiritual retreat with workshops and meditation',
  },
  {
    id: '3',
    title: 'Corpus Christi Procession',
    date: 'June 18, 2026',
    time: '6:00 PM',
    location: 'Downtown to Church',
    attendees: 150,
    registered: false,
    role: 'Server',
    description: 'Annual outdoor procession through city streets',
  },
  {
    id: '4',
    title: 'Servers Training Workshop',
    date: 'May 31, 2026',
    time: '3:00 PM - 5:00 PM',
    location: 'Church Sacristy',
    attendees: 32,
    registered: true,
    role: 'Attendee',
    description: 'Advanced techniques for liturgical service',
  },
]

const pastEvents = [
  { title: 'Easter Vigil', date: 'April 19, 2026', role: 'Primary Server' },
  { title: 'Palm Sunday Procession', date: 'April 5, 2026', role: 'Participant' },
  { title: 'Lenten Reflection Series', date: 'March 10-17, 2026', role: 'Attendee' },
]

export default function Events() {
  const registeredCount = upcomingEvents.filter(e => e.registered).length

  return (
    <MainLayout user={mockUser}>
      <div className="space-y-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Upcoming Events" value={upcomingEvents.length} subText="next 90 days" badge="blue" />
          <StatCard label="Registered" value={registeredCount} subText="confirmed" badge="green" />
          <StatCard label="Total Attendees" value={upcomingEvents.reduce((sum, e) => sum + e.attendees, 0)} subText="across events" badge="teal" />
          <StatCard label="Served Events" value="12" subText="past 6 months" badge="purple" />
        </div>

        {/* Upcoming Events */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#f5f0e8] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#c9a227]" />
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <Card key={event.id}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-[#f5f0e8]">{event.title}</h4>
                    <p className="text-sm text-[#b8ada0]">{event.description}</p>
                  </div>
                  <Badge
                    label={event.registered ? 'Registered' : 'Not Registered'}
                    color={event.registered ? 'green' : 'amber'}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-[#2a1010]">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#b8ada0]">
                      <Calendar className="w-4 h-4 text-[#c9a227]" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#b8ada0]">
                      <Clock className="w-4 h-4 text-[#c9a227]" />
                      {event.time}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#b8ada0]">
                      <MapPin className="w-4 h-4 text-[#c9a227]" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#b8ada0]">
                      <Users className="w-4 h-4 text-[#c9a227]" />
                      {event.attendees} attending
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge label={`Your Role: ${event.role}`} color="blue" />
                  <button className={`px-4 py-1.5 rounded text-sm font-semibold transition-colors ${
                    event.registered
                      ? 'bg-[#2a1010] text-[#b8ada0] hover:bg-[#3a2020]'
                      : 'bg-[#c9a227] text-[#1a0808] hover:bg-[#b89a1f]'
                  }`}>
                    {event.registered ? 'Registered' : 'Register'}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Past Events */}
        <Card>
          <CardHeader
            title="Past Events"
            link={{ label: 'Full history' }}
            icon={<Ticket className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <div className="space-y-2">
            {pastEvents.map((event, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 border-b border-[#2a1010] last:border-b-0">
                <div>
                  <p className="font-semibold text-[#f5f0e8]">{event.title}</p>
                  <p className="text-xs text-[#b8ada0]">{event.date}</p>
                </div>
                <Badge label={event.role} color="teal" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}

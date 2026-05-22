'use client'
import { MainLayout } from '@/components/MainLayout'
import { Card, CardHeader, StatCard, Badge } from '@/components/UI'
import { Calendar, Clock, MapPin, Users, AlertCircle } from 'lucide-react'

const mockUser = { full_name: 'Jose Reyes', role: 'Head Server', avatar_initials: 'JR' }

const mockDuties = [
  {
    id: '1',
    name: 'Dawn Mass Server',
    mass: 'Sunday 6:00 AM',
    location: 'Main Church',
    date: 'May 25, 2026',
    role: 'Primary Server',
    status: 'confirmed' as const,
    vestments: 'Red cassock & surplice',
  },
  {
    id: '2',
    name: 'Solemn High Mass',
    mass: 'Sunday 8:00 AM',
    location: 'Main Church',
    date: 'May 25, 2026',
    role: 'Assistant Server',
    status: 'confirmed' as const,
    vestments: 'White cassock & surplice',
  },
  {
    id: '3',
    name: 'Weekday Mass',
    mass: 'Wednesday 6:00 PM',
    location: 'Chapel',
    date: 'May 28, 2026',
    role: 'Primary Server',
    status: 'pending' as const,
    vestments: 'Black cassock & surplice',
  },
  {
    id: '4',
    name: 'Votive Mass',
    mass: 'Friday 6:30 PM',
    location: 'Main Church',
    date: 'May 30, 2026',
    role: 'Assistant Server',
    status: 'available' as const,
    vestments: 'Red cassock & surplice',
  },
]

const upcomingSwaps = [
  { id: '1', duty: 'Sunday 6:00 AM Mass', from: 'Michael Santos', reason: 'Family event', status: 'pending' as const },
  { id: '2', duty: 'Wednesday Evening Mass', from: 'David Lopez', reason: 'Medical appointment', status: 'approved' as const },
]

export default function Schedule() {
  const confirmedCount = mockDuties.filter(d => d.status === 'confirmed').length
  const pendingCount = mockDuties.filter(d => d.status === 'pending').length
  const availableCount = mockDuties.filter(d => d.status === 'available').length

  return (
    <MainLayout user={mockUser}>
      <div className="space-y-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Confirmed Duties" value={confirmedCount} subText={`${confirmedCount} scheduled`} badge="green" />
          <StatCard label="Pending Approval" value={pendingCount} subText={`${pendingCount} awaiting`} badge="amber" />
          <StatCard label="Available Slots" value={availableCount} subText={`${availableCount} open`} badge="blue" />
          <StatCard label="Next Duty" value="2 days" subText="Sunday 6:00 AM" badge="teal" />
        </div>

        {/* Main Schedule Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Upcoming Duties */}
          <Card>
            <CardHeader
              title="Upcoming Duties"
              link={{ label: 'View all' }}
              icon={<Calendar className="w-3.5 h-3.5 text-[#c9a227]" />}
            />
            <div className="space-y-3">
              {mockDuties.slice(0, 3).map((duty) => (
                <div key={duty.id} className="border border-[#3a2020] rounded p-3 hover:border-[#c9a227]/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-[#f5f0e8]">{duty.name}</h4>
                      <p className="text-xs text-[#b8ada0]">{duty.role}</p>
                    </div>
                    <Badge
                      label={duty.status === 'confirmed' ? 'Confirmed' : duty.status === 'pending' ? 'Pending' : 'Available'}
                      color={duty.status === 'confirmed' ? 'green' : duty.status === 'pending' ? 'amber' : 'blue'}
                    />
                  </div>
                  <div className="space-y-1 text-xs text-[#b8ada0]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {duty.mass}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {duty.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {duty.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Duty Swap Requests */}
          <Card>
            <CardHeader
              title="Swap Requests"
              link={{ label: 'Manage' }}
              icon={<Users className="w-3.5 h-3.5 text-[#c9a227]" />}
            />
            <div className="space-y-3">
              {upcomingSwaps.map((swap) => (
                <div key={swap.id} className="border border-[#3a2020] rounded p-3 hover:border-[#c9a227]/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-[#f5f0e8]">{swap.duty}</h4>
                      <p className="text-xs text-[#b8ada0]">from {swap.from}</p>
                    </div>
                    <Badge
                      label={swap.status === 'pending' ? 'Pending' : 'Approved'}
                      color={swap.status === 'pending' ? 'amber' : 'green'}
                    />
                  </div>
                  <p className="text-xs text-[#b8ada0] mb-2">{swap.reason}</p>
                  {swap.status === 'pending' && (
                    <div className="flex gap-2">
                      <button className="flex-1 px-2 py-1 bg-[#3a9a4a] hover:bg-[#2d7a3a] text-xs rounded text-[#f5f0e8] transition-colors">
                        Accept
                      </button>
                      <button className="flex-1 px-2 py-1 bg-[#c95a5a] hover:bg-[#a94848] text-xs rounded text-[#f5f0e8] transition-colors">
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Vestment Guide */}
        <Card>
          <CardHeader
            title="Vestment Requirements"
            link={{ label: 'See details' }}
            icon={<AlertCircle className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <div className="grid grid-cols-4 gap-3">
            {mockDuties.map((duty) => (
              <div key={duty.id} className="border border-[#3a2020] rounded p-3 text-center hover:border-[#c9a227]/50 transition-colors">
                <p className="text-xs text-[#b8ada0] mb-2">{duty.name}</p>
                <p className="text-sm font-semibold text-[#f5f0e8]">{duty.vestments}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}

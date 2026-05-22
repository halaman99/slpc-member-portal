'use client'

import { MainLayout } from '@/components/MainLayout'
import { Card, CardHeader, StatCard, ProgressBar, Badge } from '@/components/UI'
import { Calendar, Star, Award, CalendarDays, PieChart, BookOpen, Bell, Calendar as CalendarIcon, Users } from 'lucide-react'

export default function Dashboard() {
  // Mock data for display
  const mockUser = {
    id: '1',
    full_name: 'Jose Reyes',
    role: 'Head Server',
    avatar_initials: 'JR',
    email: 'jose.reyes@example.com',
    attendance_rate: 98,
    badges_earned: 3,
  }

  const mockDuties = [
    { id: '1', date: '2026-05-25', time: '6:00 AM', mass_type: 'Dawn Mass', role: 'Torchbearer' },
    { id: '2', date: '2026-05-25', time: '8:00 AM', mass_type: 'Solemn Parish Mass', role: 'Head Server' },
    { id: '3', date: '2026-05-28', time: '6:00 PM', mass_type: 'Weekday Mass', role: 'Acolyte' },
    { id: '4', date: '2026-05-30', time: '6:00 PM', mass_type: 'Votive Mass', role: 'On standby' },
  ]

  const mockEvents = [
    { id: '1', title: 'Pentecost Sunday — Solemn Mass', date: '25 May', detail: '6:00 AM & 8:00 AM · Main altar', tag: { text: 'Feast day', color: 'green' as const } },
    { id: '2', title: 'Monthly recollection', date: '1 Jun', detail: '9:00 AM – 12:00 NN · Formation room', tag: { text: 'Recollection', color: 'purple' as const } },
    { id: '3', title: 'Server training session', date: '7 Jun', detail: '2:00 PM · Sanctuary — new members', tag: { text: 'Training', color: 'blue' as const } },
    { id: '4', title: 'Feast of St. Anthony — procession', date: '13 Jun', detail: '6:00 PM Mass + Procession', tag: { text: 'Feast day', color: 'green' as const } },
    { id: '5', title: 'Community outreach — Pavoni Day', date: '21 Jun', detail: '7:00 AM – 4:00 PM · Parish grounds', tag: { text: 'Outreach', color: 'teal' as const } },
  ]

  const mockFormations = [
    { id: '1', name: 'Vestment guide', type: 'PDF · 2.4 MB', icon: '📄' },
    { id: '2', name: 'Mass of the Roman Rite — intro', type: 'Video · 18 min', icon: '▶️' },
    { id: '3', name: 'Server prayers booklet', type: 'PDF · 1.1 MB', icon: '📄' },
    { id: '4', name: 'Holy Week procedures', type: 'PDF · 3.8 MB', icon: '📄' },
  ]

  const mockAnnouncements = [
    { id: '1', title: 'Pentecost Mass — report by 7:30 AM', detail: 'Full vestments. Be early.', color: 'amber' as const, time: 'Today' },
    { id: '2', title: 'June recollection confirmed', detail: 'June 1 · 9 AM · Formation room', color: 'teal' as const, time: '2d ago' },
    { id: '3', title: 'Schedule swap request — Angelo L.', detail: 'Requesting trade for June 7 Mass', color: 'red' as const, time: '3d ago' },
    { id: '4', title: 'New formation video uploaded', detail: 'Rite of Mass — Part 2', color: 'purple' as const, time: '5d ago' },
  ]

  const mockMembers = [
    { id: '1', full_name: 'Jose Reyes', role: 'Head Server', avatar_initials: 'JR', email: 'jose@example.com' },
    { id: '2', full_name: 'Maria Cruz', role: 'Thurifer', avatar_initials: 'MC', email: 'maria@example.com' },
    { id: '3', full_name: 'Angelo Lim', role: 'Acolyte', avatar_initials: 'AL', email: 'angelo@example.com' },
    { id: '4', full_name: 'Rosa Dela Cruz', role: 'Cross Bearer', avatar_initials: 'RD', email: 'rosa@example.com' },
    { id: '5', full_name: 'Ben Pascual', role: 'Torchbearer', avatar_initials: 'BP', email: 'ben@example.com' },
  ]

  return (
    <MainLayout user={mockUser}>
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard
          icon={<Calendar className="w-3.5 h-3.5 text-[#c9a227]" />}
          label="Attendance rate"
          value={`${mockUser.attendance_rate}%`}
          sub={`${Math.round(mockUser.attendance_rate * 0.5)} of 50 duties served`}
          badge={{ text: 'Good', color: 'green' }}
        />
        <StatCard
          icon={<Calendar className="w-3.5 h-3.5 text-[#c9a227]" />}
          label="Next duty"
          value="Sun"
          sub="8:00 AM · Solemn Mass"
        />
        <StatCard
          icon={<Star className="w-3.5 h-3.5 text-[#c9a227]" />}
          label="Formation progress"
          value="3/5"
          sub="Modules completed"
          badge={{ text: 'In progress', color: 'amber' }}
        />
        <StatCard
          icon={<Award className="w-3.5 h-3.5 text-[#c9a227]" />}
          label="Badges earned"
          value={`${mockUser.badges_earned}`}
          sub="Achievement badges"
        />
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* This Week's Duties */}
        <Card>
          <CardHeader
            title="This week's duties"
            link={{ label: 'View all' }}
            icon={<CalendarDays className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <div className="space-y-2">
            {mockDuties.map((duty, i) => (
              <div key={i} className="flex items-center gap-2.5 py-2 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c9a227] flex-shrink-0" />
                <span className="text-xs text-[#c9a227] font-medium min-w-[60px]">{duty.time}</span>
                <span className="text-sm text-[#e8dcc8] flex-1">{duty.mass_type}</span>
                <span className="text-xs text-[#6a5060] bg-[#1a0808] px-2 py-1 rounded-lg">{duty.role}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Attendance Overview */}
        <Card>
          <CardHeader
            title="Attendance overview"
            link={{ label: 'May 2026' }}
            icon={<PieChart className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <ProgressBar label="Masses served" value={92} color="gold" />
          <ProgressBar label="Formations attended" value={80} color="green" />
          <ProgressBar label="Events joined" value={67} color="gold" />
          <ProgressBar label="Unexcused absences" value={12} color="red" />
        </Card>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Formation Materials */}
        <Card>
          <CardHeader
            title="Formation materials"
            link={{ label: 'View library' }}
            icon={<BookOpen className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <div className="space-y-2">
            {mockFormations.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 py-2 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                <div className="text-lg">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#e8dcc8] font-medium">{item.name}</div>
                  <div className="text-xs text-[#6a5060]">{item.type}</div>
                </div>
                <button className="text-[#c9a227] hover:text-[#dbb237] flex-shrink-0">⬇️</button>
              </div>
            ))}
          </div>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader
            title="Announcements"
            link={{ label: 'All' }}
            icon={<Bell className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <div className="space-y-2">
            {mockAnnouncements.map((item, i) => (
              <div key={i} className="flex gap-2.5 py-2 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{
                  backgroundColor: {
                    amber: '#c9a227',
                    teal: '#4a9a6a',
                    red: '#c95a5a',
                    purple: '#9a5ac9',
                  }[item.color] || '#c9a227'
                }}>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#e8dcc8] font-medium">{item.title}</div>
                  <div className="text-xs text-[#6a5060]">{item.detail}</div>
                </div>
                <div className="text-xs text-[#5a4050] whitespace-nowrap flex-shrink-0">{item.time}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Upcoming Events */}
        <div className="col-span-2">
          <Card>
            <CardHeader
              title="Upcoming events"
              link={{ label: 'View calendar' }}
              icon={<CalendarIcon className="w-3.5 h-3.5 text-[#c9a227]" />}
            />
            <div className="space-y-3">
              {mockEvents.map((event, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                  <div className="text-center min-w-[36px]">
                    <div className="text-lg font-medium text-[#c9a227]">{event.date.split(' ')[0]}</div>
                    <div className="text-xs text-[#8a6070] uppercase">{event.date.split(' ')[1]}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#e8dcc8] font-medium">{event.title}</div>
                    <div className="text-xs text-[#6a5070]">{event.detail}</div>
                  </div>
                  <Badge text={event.tag.text} color={event.tag.color} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Team Roster */}
        <Card>
          <CardHeader
            title="Team roster"
            link={{ label: 'All members' }}
            icon={<Users className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <div className="space-y-1.5">
            {mockMembers.map((member, i) => (
              <div key={i} className="flex items-center gap-2.5 py-1.5 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3a1a10] to-[#1a0808] flex items-center justify-center text-xs font-medium text-[#c9a227]">
                  {member.avatar_initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[#e8dcc8] font-medium">{member.full_name}</div>
                  <div className="text-xs text-[#6a5060]">{member.role}</div>
                </div>
                <Badge text="Active" color="green" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}


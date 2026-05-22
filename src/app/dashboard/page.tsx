'use client'

import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/MainLayout'
import { Card, CardHeader, StatCard, ProgressBar, Badge } from '@/components/UI'
import { Calendar, BarChart3, Star, Award, CalendarWeek, ChartPie, BookOpen, Bell, CalendarEvent, Users } from 'lucide-react'

const mockUser = {
  id: '1',
  full_name: 'Jose Reyes',
  role: 'Head Server',
  avatar_initials: 'JR',
  email: 'jose.reyes@example.com',
}

const mockDuties = [
  { time: 'Sun 6:00 AM', mass: 'Dawn Mass', role: 'Torchbearer' },
  { time: 'Sun 8:00 AM', mass: 'Solemn Parish Mass', role: 'Head Server' },
  { time: 'Wed 6:00 PM', mass: 'Weekday Mass', role: 'Acolyte' },
  { time: 'Fri 6:00 PM', mass: 'Votive Mass', role: 'On standby' },
]

const mockEvents = [
  { date: '25 May', title: 'Pentecost Sunday — Solemn Mass', detail: '6:00 AM & 8:00 AM · Main altar', tag: { text: 'Feast day', color: 'amber' as const } },
  { date: '1 Jun', title: 'Monthly recollection', detail: '9:00 AM – 12:00 NN · Formation room', tag: { text: 'Recollection', color: 'purple' as const } },
  { date: '7 Jun', title: 'Server training session', detail: '2:00 PM · Sanctuary — new members', tag: { text: 'Training', color: 'blue' as const } },
  { date: '13 Jun', title: 'Feast of St. Anthony — procession', detail: '6:00 PM Mass + Procession', tag: { text: 'Feast day', color: 'amber' as const } },
]

const mockFormations = [
  { name: 'Vestment guide', type: 'PDF · 2.4 MB', icon: '📄' },
  { name: 'Mass of the Roman Rite — intro', type: 'Video · 18 min', icon: '🎥' },
  { name: 'Server prayers booklet', type: 'PDF · 1.1 MB', icon: '📄' },
  { name: 'Holy Week procedures', type: 'PDF · 3.8 MB', icon: '📄' },
]

const mockAnnouncements = [
  { title: 'Pentecost Mass — report by 7:30 AM', detail: 'Full vestments. Be early.', time: 'Today', color: 'amber' as const },
  { title: 'June recollection confirmed', detail: 'June 1 · 9 AM · Formation room', time: '2d ago', color: 'teal' as const },
  { title: 'Schedule swap request — Angelo L.', detail: 'Requesting trade for June 7 Mass', time: '3d ago', color: 'red' as const },
  { title: 'New formation video uploaded', detail: 'Rite of Mass — Part 2', time: '5d ago', color: 'purple' as const },
]

const mockTeam = [
  { initials: 'JR', name: 'Jose Reyes', role: 'Head Server', status: 'Present' },
  { initials: 'MC', name: 'Maria Cruz', role: 'Thurifer', status: 'Present' },
  { initials: 'AL', name: 'Angelo Lim', role: 'Acolyte', status: 'Late' },
  { initials: 'RD', name: 'Rosa Dela Cruz', role: 'Cross Bearer', status: 'Absent' },
  { initials: 'BP', name: 'Ben Pascual', role: 'Torchbearer', status: 'Present' },
]

export default function Dashboard() {
  return (
    <MainLayout user={mockUser}>
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard
          icon={<Calendar className="w-3.5 h-3.5 text-[#c9a227]" />}
          label="Attendance rate"
          value="92%"
          sub="46 of 50 duties served"
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
          value="7"
          sub="2 new this month"
        />
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* This Week's Duties */}
        <Card>
          <CardHeader
            title="This week's duties"
            link={{ label: 'View all' }}
            icon={<CalendarWeek className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <div className="space-y-2">
            {mockDuties.map((duty, i) => (
              <div key={i} className="flex items-center gap-2.5 py-2 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c9a227] flex-shrink-0" />
                <span className="text-xs text-[#c9a227] font-medium min-w-[60px]">{duty.time}</span>
                <span className="text-sm text-[#e8dcc8] flex-1">{duty.mass}</span>
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
            icon={<ChartPie className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <ProgressBar label="Masses served" value={92} color="gold" />
          <ProgressBar label="Formations attended" value={80} color="green" />
          <ProgressBar label="Events joined" value={67} color="gold" />
          <ProgressBar label="Unexcused absences" value={12} color="red" />
        </Card>
      </div>

      {/* Another Two Column Section */}
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
                  }[item.color as keyof typeof colorMap] || '#c9a227'
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
              icon={<CalendarEvent className="w-3.5 h-3.5 text-[#c9a227]" />}
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
            {mockTeam.map((member, i) => (
              <div key={i} className="flex items-center gap-2.5 py-1.5 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3a1a10] to-[#1a0808] flex items-center justify-center text-xs font-medium text-[#c9a227]">
                  {member.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[#e8dcc8] font-medium">{member.name}</div>
                  <div className="text-xs text-[#6a5060]">{member.role}</div>
                </div>
                <Badge text={member.status} color={member.status === 'Present' ? 'green' : member.status === 'Late' ? 'amber' : 'red'} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}

const colorMap = {
  amber: '#c9a227',
  teal: '#4a9a6a',
  red: '#c95a5a',
  purple: '#9a5ac9',
}

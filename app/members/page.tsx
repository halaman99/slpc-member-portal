'use client'
import { MainLayout } from '@/components/MainLayout'
import { Card, CardHeader, StatCard, Badge } from '@/components/UI'
import { Users, UserCheck, UserClock, Award } from 'lucide-react'

const mockUser = { full_name: 'Jose Reyes', role: 'Head Server', avatar_initials: 'JR' }

const members = [
  {
    id: '1',
    name: 'Jose Reyes',
    role: 'Head Server',
    initials: 'JR',
    status: 'active' as const,
    joinDate: '2022-06-15',
    duties: 47,
    attendance: 98,
  },
  {
    id: '2',
    name: 'Michael Santos',
    role: 'Senior Server',
    initials: 'MS',
    status: 'active' as const,
    joinDate: '2021-03-22',
    duties: 56,
    attendance: 95,
  },
  {
    id: '3',
    name: 'David Lopez',
    role: 'Senior Server',
    initials: 'DL',
    status: 'active' as const,
    joinDate: '2021-08-10',
    duties: 52,
    attendance: 92,
  },
  {
    id: '4',
    name: 'Carlos Rivera',
    role: 'Server',
    initials: 'CR',
    status: 'active' as const,
    joinDate: '2023-01-30',
    duties: 28,
    attendance: 89,
  },
  {
    id: '5',
    name: 'Pablo Martinez',
    role: 'Server in Training',
    initials: 'PM',
    status: 'active' as const,
    joinDate: '2025-02-14',
    duties: 8,
    attendance: 100,
  },
  {
    id: '6',
    name: 'Father Thomas',
    role: 'Mentor',
    initials: 'FT',
    status: 'active' as const,
    joinDate: '2015-05-20',
    duties: 200,
    attendance: 99,
  },
]

const roles = [
  { title: 'Head Server', count: 1, description: 'Oversees all operations' },
  { title: 'Senior Server', count: 2, description: 'Advanced liturgical service' },
  { title: 'Server', count: 2, description: 'Regular liturgical service' },
  { title: 'Server in Training', count: 1, description: 'Learning fundamentals' },
]

export default function Members() {
  const activeCount = members.filter(m => m.status === 'active').length
  const avgAttendance = Math.round(members.reduce((sum, m) => sum + m.attendance, 0) / members.length)

  return (
    <MainLayout user={mockUser}>
      <div className="space-y-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Total Members" value={activeCount} subText="active" badge="blue" />
          <StatCard label="Average Attendance" value={`${avgAttendance}%`} subText="community-wide" badge="green" />
          <StatCard label="New Members" value="1" subText="this year" badge="amber" />
          <StatCard label="Mentors" value="1" subText="active" badge="purple" />
        </div>

        {/* Member Roles */}
        <Card>
          <CardHeader
            title="Member Roles"
            link={{ label: 'Details' }}
            icon={<Award className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <div className="grid grid-cols-4 gap-3">
            {roles.map((role, idx) => (
              <div key={idx} className="border border-[#3a2020] rounded p-3 text-center hover:border-[#c9a227]/50 transition-colors">
                <p className="text-2xl font-bold text-[#c9a227] mb-1">{role.count}</p>
                <p className="font-semibold text-[#f5f0e8] text-sm mb-1">{role.title}</p>
                <p className="text-xs text-[#b8ada0]">{role.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Member Directory */}
        <Card>
          <CardHeader
            title="Member Directory"
            link={{ label: 'Export' }}
            icon={<Users className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border border-[#3a2020] rounded hover:border-[#c9a227]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#c9a227] text-[#1a0808] font-semibold flex items-center justify-center">
                    {member.initials}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#f5f0e8]">{member.name}</h4>
                    <p className="text-xs text-[#b8ada0]">{member.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#f5f0e8]">{member.duties}</p>
                    <p className="text-xs text-[#b8ada0]">duties</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#f5f0e8]">{member.attendance}%</p>
                    <p className="text-xs text-[#b8ada0]">attendance</p>
                  </div>
                  <Badge
                    label={member.status === 'active' ? 'Active' : 'Inactive'}
                    color={member.status === 'active' ? 'green' : 'gray'}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Member Milestones */}
        <Card>
          <CardHeader
            title="Recent Milestones"
            link={{ label: 'View all' }}
            icon={<UserCheck className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 border-b border-[#2a1010]">
              <div className="w-10 h-10 rounded bg-[#3a9a4a]/20 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-[#3a9a4a]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#f5f0e8]">Pablo Martinez joined</p>
                <p className="text-xs text-[#b8ada0]">3 months ago - Server in Training</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 border-b border-[#2a1010]">
              <div className="w-10 h-10 rounded bg-[#c9a227]/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-[#c9a227]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#f5f0e8]">Michael Santos promoted</p>
                <p className="text-xs text-[#b8ada0]">1 year ago - Senior Server</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}

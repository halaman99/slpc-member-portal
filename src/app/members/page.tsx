'use client'

import { MainLayout } from '@/components/MainLayout'
import { Card, CardHeader, Badge } from '@/components/UI'
import { Users, Mail, Award } from 'lucide-react'

const mockUser = { id: '1', full_name: 'Jose Reyes', role: 'Head Server', avatar_initials: 'JR', email: 'jose.reyes@example.com' }

const members = [
  { id: 1, initials: 'JR', name: 'Jose Reyes', role: 'Head Server', email: 'jose.reyes@example.com', status: 'Present', attendance: 92 },
  { id: 2, initials: 'MC', name: 'Maria Cruz', role: 'Thurifer', email: 'maria.cruz@example.com', status: 'Present', attendance: 88 },
  { id: 3, initials: 'AL', name: 'Angelo Lim', role: 'Acolyte', email: 'angelo.lim@example.com', status: 'Late', attendance: 85 },
  { id: 4, initials: 'RD', name: 'Rosa Dela Cruz', role: 'Cross Bearer', email: 'rosa.cruz@example.com', status: 'Absent', attendance: 78 },
  { id: 5, initials: 'BP', name: 'Ben Pascual', role: 'Torchbearer', email: 'ben.pascual@example.com', status: 'Present', attendance: 90 },
  { id: 6, initials: 'LC', name: 'Luis Carreon', role: 'Acolyte', email: 'luis.carreon@example.com', status: 'Present', attendance: 94 },
]

export default function Members() {
  return (
    <MainLayout user={mockUser}>
      <div className="max-w-5xl">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#f5f0e8] mb-2">Team Members</h2>
          <p className="text-sm text-[#8a6070]">View all members and their information</p>
        </div>

        <Card>
          <CardHeader title="Active Members" icon={<Users className="w-4 h-4 text-[#c9a227]" />} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {members.map((member) => (
              <div key={member.id} className="p-4 bg-[#1a0808] rounded-lg border border-[rgba(201,162,39,0.1)] hover:border-[rgba(201,162,39,0.3)] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3a1a10] to-[#1a0808] flex items-center justify-center text-xs font-medium text-[#c9a227]">
                      {member.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-[#e8dcc8]">{member.name}</h3>
                      <p className="text-xs text-[#6a5060]">{member.role}</p>
                    </div>
                  </div>
                  <Badge
                    text={member.status}
                    color={member.status === 'Present' ? 'green' : member.status === 'Late' ? 'amber' : 'red'}
                  />
                </div>
                <div className="space-y-2 border-t border-[rgba(201,162,39,0.1)] pt-3">
                  <div className="flex items-center gap-2 text-xs text-[#8a6070]">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#8a6070]">
                      <Award className="w-3.5 h-3.5" />
                      <span>Attendance</span>
                    </div>
                    <span className="text-sm font-medium text-[#c9a227]">{member.attendance}%</span>
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

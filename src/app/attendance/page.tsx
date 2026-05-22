'use client'

import { MainLayout } from '@/components/MainLayout'
import { Card, CardHeader, ProgressBar, Badge } from '@/components/UI'
import { BarChart3, Calendar } from 'lucide-react'

const mockUser = { id: '1', full_name: 'Jose Reyes', role: 'Head Server', avatar_initials: 'JR', email: 'jose.reyes@example.com' }

const attendanceData = [
  { month: 'May 2026', present: 46, absent: 2, late: 1, excused: 1, rate: 92 },
  { month: 'April 2026', present: 42, absent: 3, late: 2, excused: 1, rate: 88 },
  { month: 'March 2026', present: 48, absent: 1, late: 0, excused: 0, rate: 96 },
]

export default function Attendance() {
  return (
    <MainLayout user={mockUser}>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#f5f0e8] mb-2">Attendance Tracking</h2>
          <p className="text-sm text-[#8a6070]">View your attendance history and statistics</p>
        </div>

        {/* Monthly Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="text-xs text-[#8a6070] mb-2">Masses Served This Month</div>
            <div className="text-3xl font-bold text-[#f5f0e8] mb-1">46/50</div>
            <Badge text="92% Rate" color="green" />
          </Card>
          <Card>
            <div className="text-xs text-[#8a6070] mb-2">Total Duties Assigned</div>
            <div className="text-3xl font-bold text-[#f5f0e8] mb-1">50</div>
            <div className="text-xs text-[#6a5060]">Since joining</div>
          </Card>
          <Card>
            <div className="text-xs text-[#8a6070] mb-2">Unexcused Absences</div>
            <div className="text-3xl font-bold text-[#c95a5a] mb-1">2</div>
            <div className="text-xs text-[#6a5060]">This year</div>
          </Card>
        </div>

        {/* Attendance History */}
        {attendanceData.map((month) => (
          <Card key={month.month} className="mb-4">
            <CardHeader title={month.month} icon={<Calendar className="w-4 h-4 text-[#c9a227]" />} />
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#c8b8a0]">Attendance Rate</span>
                  <span className="text-sm font-bold text-[#c9a227]">{month.rate}%</span>
                </div>
                <div className="h-2 bg-[#3a1a1a] rounded-full overflow-hidden">
                  <div className="h-full bg-[#c9a227] rounded-full transition-all" style={{ width: `${month.rate}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-[#8a6070] mb-1">Present</div>
                  <div className="text-xl font-bold text-[#4a9a4a]">{month.present}</div>
                </div>
                <div>
                  <div className="text-[#8a6070] mb-1">Absent</div>
                  <div className="text-xl font-bold text-[#c95a5a]">{month.absent}</div>
                </div>
                <div>
                  <div className="text-[#8a6070] mb-1">Late</div>
                  <div className="text-xl font-bold text-[#c9a227]">{month.late}</div>
                </div>
                <div>
                  <div className="text-[#8a6070] mb-1">Excused</div>
                  <div className="text-xl font-bold text-[#8a9ac9]">{month.excused}</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </MainLayout>
  )
}

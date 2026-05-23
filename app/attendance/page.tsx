'use client'
import { MainLayout } from '@/components/MainLayout'
import { Card, CardHeader, StatCard, Badge, ProgressBar } from '@/components/UI'
import { BarChart3, Calendar, TrendingUp, Clock } from 'lucide-react'

const mockUser = { full_name: 'Jose Reyes', role: 'Head Server', avatar_initials: 'JR' }

const attendanceStats = {
  totalMasses: 24,
  attended: 22,
  absent: 1,
  excused: 1,
  onTime: 21,
  late: 1,
}

const monthlyAttendance = [
  { month: 'January', attended: 4, total: 4, percentage: 100 },
  { month: 'February', attended: 3, total: 4, percentage: 75 },
  { month: 'March', attended: 4, total: 4, percentage: 100 },
  { month: 'April', attended: 4, total: 4, percentage: 100 },
  { month: 'May', attended: 7, total: 8, percentage: 87 },
]

const recentAttendance = [
  { id: '1', date: 'May 18, 2026', mass: 'Sunday 6:00 AM', status: 'present' as const, time: 'On time' },
  { id: '2', date: 'May 18, 2026', mass: 'Sunday 8:00 AM', status: 'present' as const, time: 'On time' },
  { id: '3', date: 'May 15, 2026', mass: 'Thursday 6:00 PM', status: 'excused' as const, time: 'Medical appointment' },
  { id: '4', date: 'May 11, 2026', mass: 'Sunday 8:00 AM', status: 'late' as const, time: '5 minutes late' },
  { id: '5', date: 'May 11, 2026', mass: 'Sunday 6:00 AM', status: 'present' as const, time: 'On time' },
]

const streaks = [
  { label: 'Current On-Time Streak', value: '12', subText: 'masses in a row' },
  { label: 'Longest Streak', value: '24', subText: 'in Q1 2026' },
  { label: 'Months at 100%', value: '4', subText: 'of 5 months' },
]

export default function Attendance() {
  const attendanceRate = Math.round((attendanceStats.attended / attendanceStats.totalMasses) * 100)

  return (
    <MainLayout user={mockUser}>
      <div className="space-y-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Attendance Rate" value={`${attendanceRate}%`} sub={`${attendanceStats.attended}/${attendanceStats.totalMasses} masses`} badge={{ text: 'Good', color: 'green' as const }} />
          <StatCard label="On-Time Rate" value={`${Math.round((attendanceStats.onTime / attendanceStats.attended) * 100)}%`} sub={`${attendanceStats.onTime} on time`} badge={{ text: 'On track', color: 'green' as const }} />
          <StatCard label="Excused Absences" value={attendanceStats.excused} sub="authorized" badge={{ text: 'Approved', color: 'amber' as const }} />
          <StatCard label="Current Streak" value="12" sub="masses in a row" badge={{ text: 'Excellent', color: 'green' as const }} />
        </div>

        {/* Overall Performance and Monthly Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          {/* Overall Attendance */}
          <Card>
            <CardHeader
              title="Overall Performance"
              link={{ label: 'Details' }}
              icon={<TrendingUp className="w-3.5 h-3.5 text-[#c9a227]" />}
            />
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#b8ada0]">Attendance Rate</span>
                  <span className="text-lg font-semibold text-[#f5f0e8]">{attendanceRate}%</span>
                </div>
                <ProgressBar label="Overall attendance" value={attendanceRate} color="green" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#b8ada0]">On-Time Performance</span>
                  <span className="text-lg font-semibold text-[#f5f0e8]">87%</span>
                </div>
                <ProgressBar label="On-time rate" value={87} color="green" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#b8ada0]">Participation Score</span>
                  <span className="text-lg font-semibold text-[#f5f0e8]">94%</span>
                </div>
                <ProgressBar label="Participation" value={94} color="green" />
              </div>
            </div>
          </Card>

          {/* Monthly Breakdown */}
          <Card>
            <CardHeader
              title="Monthly Attendance"
              link={{ label: 'Year view' }}
              icon={<Calendar className="w-3.5 h-3.5 text-[#c9a227]" />}
            />
            <div className="space-y-2">
              {monthlyAttendance.map((month) => (
                <div key={month.month} className="flex items-center gap-3">
                  <span className="text-xs text-[#b8ada0] w-16">{month.month}</span>
                  <div className="flex-1">
                  <ProgressBar label={`${month.month} attendance`} value={month.percentage} color={month.percentage === 100 ? 'green' : 'gold'} />
                  </div>
                  <span className="text-xs text-[#b8ada0] w-12 text-right">
                    {month.attended}/{month.total}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Attendance Streaks */}
        <Card>
          <CardHeader
            title="Attendance Streaks"
            link={{ label: 'History' }}
            icon={<TrendingUp className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <div className="grid grid-cols-3 gap-3">
            {streaks.map((streak, idx) => (
              <div key={idx} className="border border-[#3a2020] rounded p-3 text-center hover:border-[#c9a227]/50 transition-colors">
                <p className="text-xs text-[#b8ada0] mb-1">{streak.label}</p>
                <p className="text-3xl font-bold text-[#c9a227] mb-1">{streak.value}</p>
                <p className="text-xs text-[#b8ada0]">{streak.subText}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Attendance */}
        <Card>
          <CardHeader
            title="Recent Attendance History"
            link={{ label: 'View all' }}
            icon={<Clock className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <div className="space-y-2">
            {recentAttendance.map((record) => (
              <div key={record.id} className="flex items-center justify-between border-b border-[#2a1010] pb-2">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#f5f0e8]">{record.mass}</p>
                  <p className="text-xs text-[#b8ada0]">{record.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#b8ada0]">{record.time}</span>
                  <Badge
                    label={record.status === 'present' ? 'Present' : record.status === 'late' ? 'Late' : 'Excused'}
                    color={record.status === 'present' ? 'green' : record.status === 'late' ? 'amber' : 'blue'}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}

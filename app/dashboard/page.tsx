'use client'

import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/MainLayout'
import { Card, CardHeader, StatCard, ProgressBar, Badge } from '@/components/UI'
import { Calendar, Star, Award, CalendarDays, PieChart, BookOpen, Bell, Calendar as CalendarIcon, Users } from 'lucide-react'
import { getMembers, getUpcomingDuties, getEvents, getFormations, getAnnouncements } from '@/lib/db'
import { useAuth } from '@/contexts/AuthContext'

// Fallback user data if member record is not found
const defaultUser = {
  id: '',
  full_name: 'Guest User',
  role: 'Member',
  avatar_initials: 'GU',
  attendance_rate: 0,
  badges_earned: 0,
}

export default function Dashboard() {
  const { user: authUser } = useAuth()
  const [member, setMember] = useState<any>(null)
  const [duties, setDuties] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [formations, setFormations] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch global data in parallel
        const [membersData, eventsData, formationsData, announcementsData] = await Promise.all([
          getMembers(),
          getEvents(5),
          getFormations(),
          getAnnouncements(4),
        ])

        setMembers(membersData)
        setEvents(eventsData)
        setFormations(formationsData)
        setAnnouncements(announcementsData)

        // Find member record for current authenticated user
        if (authUser?.email) {
          const currentMember = membersData.find(m => m.email === authUser.email)
          
          if (currentMember) {
            setMember(currentMember)
            
            // Fetch duties for this specific member
            const dutiesData = await getUpcomingDuties(currentMember.id, 30)
            setDuties(dutiesData)
          } else if (membersData.length > 0) {
            // Fallback to first member for demo purposes if no match found
            setMember(membersData[0])
            const dutiesData = await getUpcomingDuties(membersData[0].id, 30)
            setDuties(dutiesData)
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (authUser) {
      loadDashboardData()
    }
  }, [authUser])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1a0808]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#c9a227] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#8a6070]">Loading portal data...</p>
        </div>
      </div>
    )
  }

  const displayUser = member || defaultUser

  return (
    <MainLayout user={displayUser}>
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Calendar className="w-3.5 h-3.5 text-[#c9a227]" />}
          label="Attendance rate"
          value={`${displayUser.attendance_rate || 0}%`}
          sub="Based on recent duties"
          badge={{ text: (displayUser.attendance_rate || 0) > 90 ? 'Excellent' : 'Good', color: 'green' }}
        />
        <StatCard
          icon={<CalendarIcon className="w-3.5 h-3.5 text-[#c9a227]" />}
          label="Next duty"
          value={duties.length > 0 ? new Date(duties[0].date).toLocaleDateString('en-US', { weekday: 'short' }) : 'None'}
          sub={duties.length > 0 ? `${duties[0].time} · ${duties[0].mass_type}` : 'No upcoming duties'}
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
          value={displayUser.badges_earned || 0}
          sub="Achievement badges"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Upcoming Duties */}
        <Card>
          <CardHeader
            title="My Upcoming Duties"
            link={{ label: 'View Schedule', href: '/schedule' }}
            icon={<CalendarDays className="w-4 h-4 text-[#c9a227]" />}
          />
          <div className="space-y-3">
            {duties.length > 0 ? (
              duties.map((duty, i) => (
                <div key={duty.id || i} className="flex items-center gap-3 py-2 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                  <div className="w-2 h-2 rounded-full bg-[#c9a227]" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#e8dcc8] font-medium">{duty.mass_type}</div>
                    <div className="text-xs text-[#8a6070]">{new Date(duty.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {duty.time}</div>
                  </div>
                  <Badge text={duty.role} color="amber" />
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-[#6a5060] text-sm italic">
                No duties scheduled for the next 30 days.
              </div>
            )}
          </div>
        </Card>

        {/* Attendance Overview */}
        <Card>
          <CardHeader
            title="Attendance Overview"
            link={{ label: 'History', href: '/attendance' }}
            icon={<PieChart className="w-4 h-4 text-[#c9a227]" />}
          />
          <div className="space-y-4 pt-2">
            <ProgressBar label="Masses served" value={displayUser.attendance_rate || 90} color="gold" />
            <ProgressBar label="Formations attended" value={80} color="green" />
            <ProgressBar label="Special events" value={65} color="gold" />
          </div>
        </Card>
      </div>

      {/* Second Row Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Announcements */}
        <Card>
          <CardHeader
            title="Recent Announcements"
            link={{ label: 'View All', href: '/announcements' }}
            icon={<Bell className="w-4 h-4 text-[#c9a227]" />}
          />
          <div className="space-y-3">
            {announcements.map((item, i) => (
              <div key={item.id || i} className="flex gap-3 py-2 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  item.category === 'urgent' ? 'bg-[#c95a5a]' : 
                  item.category === 'event' ? 'bg-[#4a9a6a]' : 'bg-[#c9a227]'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#e8dcc8] font-medium">{item.title}</div>
                  <p className="text-xs text-[#6a5060] line-clamp-1">{item.message}</p>
                </div>
                <div className="text-[10px] text-[#5a4050] whitespace-nowrap pt-1">
                  {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Formation Progress */}
        <Card>
          <CardHeader
            title="Formation Resources"
            link={{ label: 'Library', href: '/formation' }}
            icon={<BookOpen className="w-4 h-4 text-[#c9a227]" />}
          />
          <div className="space-y-3">
            {formations.slice(0, 4).map((item, i) => (
              <div key={item.id || i} className="flex items-center gap-3 py-2 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                <div className="w-8 h-8 rounded bg-[#1a0808] flex items-center justify-center text-lg">
                  {item.file_type === 'video' ? '▶️' : '📄'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#e8dcc8] font-medium truncate">{item.title}</div>
                  <div className="text-[10px] text-[#6a5060]">{item.duration} · {item.file_type.toUpperCase()}</div>
                </div>
                <button className="text-[#c9a227] hover:text-[#dbb237] text-xs font-medium">View</button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader
              title="Upcoming Events"
              link={{ label: 'Calendar', href: '/events' }}
              icon={<CalendarIcon className="w-4 h-4 text-[#c9a227]" />}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((event, i) => (
                <div key={event.id || i} className="flex items-start gap-3 p-3 bg-[#1a0808] rounded-lg border border-[rgba(201,162,39,0.05)]">
                  <div className="text-center min-w-[40px] py-1 px-1 bg-[#2a1010] rounded border border-[rgba(201,162,39,0.1)]">
                    <div className="text-lg font-bold text-[#c9a227]">{new Date(event.date).getDate()}</div>
                    <div className="text-[10px] text-[#8a6070] uppercase font-bold">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#e8dcc8] font-medium truncate">{event.title}</div>
                    <div className="text-[10px] text-[#6a5070] mt-0.5">{event.location}</div>
                    <div className="mt-2">
                      <Badge text={event.event_type} color={
                        event.event_type === 'feast' ? 'amber' : 
                        event.event_type === 'training' ? 'blue' : 
                        event.event_type === 'recollection' ? 'purple' : 'teal'
                      } />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Team Roster Snippet */}
        <Card>
          <CardHeader
            title="Team Roster"
            link={{ label: 'Full Team', href: '/members' }}
            icon={<Users className="w-4 h-4 text-[#c9a227]" />}
          />
          <div className="space-y-3">
            {members.slice(0, 5).map((m, i) => (
              <div key={m.id || i} className="flex items-center gap-3 py-1.5 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3a1a10] to-[#1a0808] border border-[rgba(201,162,39,0.2)] flex items-center justify-center text-xs font-bold text-[#c9a227]">
                  {m.avatar_initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[#e8dcc8] font-medium">{m.full_name}</div>
                  <div className="text-[10px] text-[#6a5060]">{m.role}</div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#4a9a4a]" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}

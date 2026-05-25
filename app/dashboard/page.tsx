'use client'

import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/MainLayout'
import { Card, CardHeader, StatCard, ProgressBar, Badge } from '@/components/UI'
import { Calendar, Star, Award, CalendarDays, PieChart, BookOpen, Bell, Calendar as CalendarIcon, Users } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  useRealtimeMembers, 
  useRealtimeDuties, 
  useRealtimeEvents, 
  useRealtimeAnnouncements 
} from '@/lib/useRealtime'
import { getFormations } from '@/lib/db'

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
  const [formations, setFormations] = useState<any[]>([])
  const [loadingFormations, setLoadingFormations] = useState(true)

  // Fetch realtime data using hooks
  const { members, loading: loadingMembers } = useRealtimeMembers()
  const { duties, loading: loadingDuties } = useRealtimeDuties(member?.id)
  const { events, loading: loadingEvents } = useRealtimeEvents()
  const { announcements, loading: loadingAnnouncements } = useRealtimeAnnouncements()

  // Load formations separately (not realtime yet)
  useEffect(() => {
    const loadFormations = async () => {
      try {
        setLoadingFormations(true)
        const data = await getFormations()
        setFormations(data)
      } catch (error) {
        console.error('Error loading formations:', error)
      } finally {
        setLoadingFormations(false)
      }
    }
    loadFormations()
  }, [])

  // Find current user's member record
  useEffect(() => {
    if (authUser?.email && members.length > 0) {
      const currentMember = members.find(m => m.email === authUser.email)
      if (currentMember) {
        setMember(currentMember)
      } else if (members.length > 0) {
        // Fallback to first member if no match
        setMember(members[0])
      }
    }
  }, [authUser?.email, members])

  // Overall loading state
  const isLoading = loadingMembers || loadingDuties || loadingEvents || loadingAnnouncements || loadingFormations

  if (isLoading) {
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
  const upcomingDuties = duties.slice(0, 5) // Limit display to 5

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
          value={upcomingDuties.length > 0 ? new Date(upcomingDuties[0].date).toLocaleDateString('en-US', { weekday: 'short' }) : 'None'}
          sub={upcomingDuties.length > 0 ? `${upcomingDuties[0].time} · ${upcomingDuties[0].mass_type}` : 'No upcoming duties'}
        />
        <StatCard
          icon={<Star className="w-3.5 h-3.5 text-[#c9a227]" />}
          label="Formation progress"
          value={`${formations.length}/10`}
          sub="Modules available"
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
        {/* Upcoming Duties - REALTIME */}
        <Card>
          <CardHeader
            title="My Upcoming Duties"
            link={{ label: 'View Schedule', href: '/schedule' }}
            icon={<CalendarDays className="w-4 h-4 text-[#c9a227]" />}
          />
          <div className="space-y-3">
            {upcomingDuties.length > 0 ? (
              upcomingDuties.map((duty, i) => (
                <div key={duty.id || i} className="flex items-center gap-3 py-2 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                  <div className="w-2 h-2 rounded-full bg-[#c9a227]" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#e8dcc8] font-medium">{duty.mass_type}</div>
                    <div className="text-xs text-[#8a6070]">{new Date(duty.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {duty.time}</div>
                  </div>
                  <Badge text={duty.role || 'Server'} color="amber" />
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-[#6a5060] text-sm italic">
                No duties scheduled. Check back soon!
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
        {/* Announcements - REALTIME */}
        <Card>
          <CardHeader
            title="Recent Announcements"
            link={{ label: 'View All', href: '/announcements' }}
            icon={<Bell className="w-4 h-4 text-[#c9a227]" />}
          />
          <div className="space-y-3">
            {announcements.length > 0 ? (
              announcements.slice(0, 4).map((item, i) => (
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
              ))
            ) : (
              <div className="py-8 text-center text-[#6a5060] text-sm italic">
                No announcements yet.
              </div>
            )}
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
            {formations.length > 0 ? (
              formations.slice(0, 4).map((item, i) => (
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
              ))
            ) : (
              <div className="py-8 text-center text-[#6a5060] text-sm italic">
                No formations available.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Upcoming Events - REALTIME */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader
              title="Upcoming Events"
              link={{ label: 'Calendar', href: '/events' }}
              icon={<CalendarIcon className="w-4 h-4 text-[#c9a227]" />}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.length > 0 ? (
                events.slice(0, 4).map((event, i) => (
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
                ))
              ) : (
                <div className="col-span-2 py-8 text-center text-[#6a5060] text-sm italic">
                  No upcoming events.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Team Roster Snippet - REALTIME */}
        <Card>
          <CardHeader
            title="Team Roster"
            link={{ label: 'Full Team', href: '/members' }}
            icon={<Users className="w-4 h-4 text-[#c9a227]" />}
          />
          <div className="space-y-3">
            {members.length > 0 ? (
              members.slice(0, 5).map((m, i) => (
                <div key={m.id || i} className="flex items-center gap-3 py-1.5 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3a1a10] to-[#1a0808] border border-[rgba(201,162,39,0.2)] flex items-center justify-center text-xs font-bold text-[#c9a227]">
                    {m.avatar_initials || m.full_name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#e8dcc8] font-medium">{m.full_name}</div>
                    <div className="text-[10px] text-[#6a5060]">{m.role || 'Member'}</div>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${m.is_admin ? 'bg-[#c9a227]' : 'bg-[#4a9a4a]'}`} />
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-[#6a5060] text-sm italic">
                No members available.
              </div>
            )}
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}

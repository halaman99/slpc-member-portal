'use client'

import { MainLayout } from '@/components/MainLayout'
import { Card, CardHeader, Badge } from '@/components/UI'
import { Calendar } from 'lucide-react'

const mockUser = { id: '1', full_name: 'Jose Reyes', role: 'Head Server', avatar_initials: 'JR', email: 'jose.reyes@example.com' }

const mockSchedule = [
  { date: 'May 25, 2026', day: 'Sunday', time: '6:00 AM', mass: 'Dawn Mass', role: 'Torchbearer', status: 'upcoming' },
  { date: 'May 25, 2026', day: 'Sunday', time: '8:00 AM', mass: 'Solemn Parish Mass', role: 'Head Server', status: 'upcoming' },
  { date: 'May 28, 2026', day: 'Wednesday', time: '6:00 PM', mass: 'Weekday Mass', role: 'Acolyte', status: 'upcoming' },
  { date: 'May 30, 2026', day: 'Friday', time: '6:00 PM', mass: 'Votive Mass', role: 'On standby', status: 'upcoming' },
  { date: 'June 1, 2026', day: 'Sunday', time: '6:00 AM', mass: 'Dawn Mass', role: 'Torchbearer', status: 'upcoming' },
  { date: 'June 1, 2026', day: 'Sunday', time: '8:00 AM', mass: 'Solemn Parish Mass', role: 'Head Server', status: 'upcoming' },
]

export default function Schedule() {
  return (
    <MainLayout user={mockUser}>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#f5f0e8] mb-2">My Schedule</h2>
          <p className="text-sm text-[#8a6070]">View and manage your duty assignments</p>
        </div>

        <Card className="mb-4">
          <CardHeader title="Assigned Duties" icon={<Calendar className="w-4 h-4 text-[#c9a227]" />} />
          <div className="space-y-3">
            {mockSchedule.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#1a0808] rounded-lg border border-[rgba(201,162,39,0.1)] hover:border-[rgba(201,162,39,0.3)] transition-colors">
                <div>
                  <div className="text-sm font-medium text-[#e8dcc8]">{item.mass}</div>
                  <div className="text-xs text-[#8a6070] mt-1">{item.date} · {item.time}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge text={item.role} color="blue" />
                  <Badge text="Scheduled" color="green" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Request a Schedule Change" />
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#c8b8a0] mb-2">Select duty to modify</label>
              <select className="w-full bg-[#1a0808] border border-[rgba(201,162,39,0.2)] rounded-lg px-3 py-2 text-sm text-[#e8dcc8] focus:border-[#c9a227] outline-none">
                <option>May 25 - 6:00 AM - Dawn Mass</option>
                <option>May 25 - 8:00 AM - Solemn Mass</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#c8b8a0] mb-2">Request type</label>
              <select className="w-full bg-[#1a0808] border border-[rgba(201,162,39,0.2)] rounded-lg px-3 py-2 text-sm text-[#e8dcc8] focus:border-[#c9a227] outline-none">
                <option>Request swap with another member</option>
                <option>Request exemption</option>
                <option>Propose new time</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#c8b8a0] mb-2">Message</label>
              <textarea className="w-full bg-[#1a0808] border border-[rgba(201,162,39,0.2)] rounded-lg px-3 py-2 text-sm text-[#e8dcc8] focus:border-[#c9a227] outline-none resize-none" rows={3} placeholder="Explain your request..."></textarea>
            </div>
            <button className="w-full bg-[#c9a227] text-[#1a0808] py-2 rounded-lg font-medium hover:bg-[#dbb237] transition-colors">Submit Request</button>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}

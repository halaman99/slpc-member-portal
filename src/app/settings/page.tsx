'use client'

import { MainLayout } from '@/components/MainLayout'
import { Card, CardHeader } from '@/components/UI'
import { Settings, Bell, Lock, User } from 'lucide-react'

const mockUser = { id: '1', full_name: 'Jose Reyes', role: 'Head Server', avatar_initials: 'JR', email: 'jose.reyes@example.com' }

export default function SettingsPage() {
  return (
    <MainLayout user={mockUser}>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#f5f0e8] mb-2">Settings</h2>
          <p className="text-sm text-[#8a6070]">Manage your account and preferences</p>
        </div>

        {/* Account Settings */}
        <Card className="mb-4">
          <CardHeader title="Account Information" icon={<User className="w-4 h-4 text-[#c9a227]" />} />
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#c8b8a0] mb-2">Full Name</label>
              <input type="text" value="Jose Reyes" className="w-full bg-[#1a0808] border border-[rgba(201,162,39,0.2)] rounded-lg px-3 py-2 text-sm text-[#e8dcc8] focus:border-[#c9a227] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#c8b8a0] mb-2">Email Address</label>
              <input type="email" value="jose.reyes@example.com" className="w-full bg-[#1a0808] border border-[rgba(201,162,39,0.2)] rounded-lg px-3 py-2 text-sm text-[#e8dcc8] focus:border-[#c9a227] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#c8b8a0] mb-2">Role</label>
              <input type="text" value="Head Server" disabled className="w-full bg-[#1a0808] border border-[rgba(201,162,39,0.2)] rounded-lg px-3 py-2 text-sm text-[#8a6070] outline-none" />
            </div>
            <button className="w-full bg-[#c9a227] text-[#1a0808] py-2 rounded-lg font-medium hover:bg-[#dbb237] transition-colors">Save Changes</button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="mb-4">
          <CardHeader title="Notifications" icon={<Bell className="w-4 h-4 text-[#c9a227]" />} />
          <div className="space-y-3">
            {[
              { label: 'Schedule updates', desc: 'Get notified when your schedule changes' },
              { label: 'Announcements', desc: 'Receive important announcements' },
              { label: 'Event reminders', desc: 'Reminders before upcoming events' },
              { label: 'Formation updates', desc: 'New formation materials available' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[rgba(201,162,39,0.1)] last:border-0">
                <div>
                  <div className="text-sm text-[#e8dcc8]">{item.label}</div>
                  <div className="text-xs text-[#8a6070]">{item.desc}</div>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            ))}
          </div>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader title="Security" icon={<Lock className="w-4 h-4 text-[#c9a227]" />} />
          <div className="space-y-3">
            <button className="w-full p-3 text-left bg-[#1a0808] rounded-lg border border-[rgba(201,162,39,0.1)] hover:border-[rgba(201,162,39,0.3)] transition-colors">
              <div className="text-sm text-[#e8dcc8] font-medium">Change Password</div>
              <div className="text-xs text-[#8a6070] mt-1">Update your password regularly to stay secure</div>
            </button>
            <button className="w-full p-3 text-left bg-[#1a0808] rounded-lg border border-[rgba(201,162,39,0.1)] hover:border-[rgba(201,162,39,0.3)] transition-colors">
              <div className="text-sm text-[#e8dcc8] font-medium">Two-Factor Authentication</div>
              <div className="text-xs text-[#8a6070] mt-1">Enable 2FA for additional security</div>
            </button>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}

'use client'
import { MainLayout } from '@/components/MainLayout'
import { Card, CardHeader, Badge } from '@/components/UI'
import { Settings, User, Lock, Bell, Eye, LogOut } from 'lucide-react'

const mockUser = { full_name: 'Jose Reyes', role: 'Head Server', avatar_initials: 'JR' }

export default function SettingsPage() {
  return (
    <MainLayout user={mockUser}>
      <div className="space-y-5">
        {/* Profile Settings */}
        <Card>
          <CardHeader
            title="Profile Settings"
            link={{ label: 'Edit' }}
            icon={<User className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border border-[#3a2020] rounded">
              <div className="w-16 h-16 rounded-full bg-[#c9a227] text-[#1a0808] font-bold flex items-center justify-center text-2xl">
                JR
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-[#f5f0e8]">Jose Reyes</h4>
                <p className="text-sm text-[#b8ada0] mb-1">Head Server</p>
                <Badge label="Member since 2022" color="blue" />
              </div>
              <button className="px-4 py-2 bg-[#c9a227] text-[#1a0808] rounded font-semibold hover:bg-[#b89a1f] transition-colors">
                Upload Photo
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border border-[#3a2020] rounded">
                <p className="text-xs text-[#b8ada0] mb-1">Email Address</p>
                <p className="font-semibold text-[#f5f0e8]">jose.reyes@example.com</p>
              </div>
              <div className="p-3 border border-[#3a2020] rounded">
                <p className="text-xs text-[#b8ada0] mb-1">Phone Number</p>
                <p className="font-semibold text-[#f5f0e8]">(555) 123-4567</p>
              </div>
              <div className="p-3 border border-[#3a2020] rounded">
                <p className="text-xs text-[#b8ada0] mb-1">Member ID</p>
                <p className="font-semibold text-[#f5f0e8]">MEM-2022-0847</p>
              </div>
              <div className="p-3 border border-[#3a2020] rounded">
                <p className="text-xs text-[#b8ada0] mb-1">Role</p>
                <div className="flex items-center gap-2">
                  <Badge label="Head Server" color="green" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader
            title="Notification Preferences"
            link={{ label: 'Customize' }}
            icon={<Bell className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <div className="space-y-3">
            {[
              { label: 'Duty Assignments', description: 'Notify when new duties are assigned', enabled: true },
              { label: 'Event Reminders', description: 'Remind 24 hours before events', enabled: true },
              { label: 'Schedule Changes', description: 'Alert when schedule changes occur', enabled: true },
              { label: 'Announcements', description: 'All portal announcements', enabled: true },
              { label: 'Community Messages', description: 'Messages from other members', enabled: false },
              { label: 'Email Notifications', description: 'Send important updates via email', enabled: true },
            ].map((notif, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-[#3a2020] rounded hover:border-[#c9a227]/50 transition-colors">
                <div>
                  <p className="font-semibold text-[#f5f0e8]">{notif.label}</p>
                  <p className="text-xs text-[#b8ada0]">{notif.description}</p>
                </div>
                <button className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                  notif.enabled
                    ? 'bg-[#3a9a4a] text-[#f5f0e8]'
                    : 'bg-[#2a1010] text-[#b8ada0]'
                }`}>
                  {notif.enabled ? 'ON' : 'OFF'}
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader
            title="Privacy & Security"
            link={{ label: 'Manage' }}
            icon={<Lock className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <div className="space-y-3">
            <div className="p-3 border border-[#3a2020] rounded hover:border-[#c9a227]/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-[#f5f0e8]">Password</p>
                  <p className="text-xs text-[#b8ada0]">Last changed 6 months ago</p>
                </div>
                <button className="px-4 py-1.5 bg-[#c9a227] text-[#1a0808] rounded font-semibold hover:bg-[#b89a1f] transition-colors text-sm">
                  Change
                </button>
              </div>
            </div>

            <div className="p-3 border border-[#3a2020] rounded hover:border-[#c9a227]/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-[#f5f0e8]">Two-Factor Authentication</p>
                  <p className="text-xs text-[#b8ada0]">Not enabled</p>
                </div>
                <button className="px-4 py-1.5 bg-[#2a1010] text-[#c9a227] rounded font-semibold hover:bg-[#3a2020] transition-colors text-sm">
                  Enable
                </button>
              </div>
            </div>

            <div className="p-3 border border-[#3a2020] rounded hover:border-[#c9a227]/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-[#f5f0e8]">Active Sessions</p>
                  <p className="text-xs text-[#b8ada0]">1 session (this device)</p>
                </div>
                <button className="px-4 py-1.5 bg-[#2a1010] text-[#b8ada0] rounded font-semibold hover:bg-[#3a2020] transition-colors text-sm">
                  Manage
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Accessibility */}
        <Card>
          <CardHeader
            title="Accessibility"
            link={{ label: 'More' }}
            icon={<Eye className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <div className="space-y-3">
            {[
              { label: 'Dark Mode', description: 'Use dark theme (current)', enabled: true },
              { label: 'Large Text', description: 'Increase font size', enabled: false },
              { label: 'High Contrast', description: 'Enhanced color contrast', enabled: false },
              { label: 'Reduce Motion', description: 'Minimize animations', enabled: false },
            ].map((access, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-[#3a2020] rounded hover:border-[#c9a227]/50 transition-colors">
                <div>
                  <p className="font-semibold text-[#f5f0e8]">{access.label}</p>
                  <p className="text-xs text-[#b8ada0]">{access.description}</p>
                </div>
                <button className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                  access.enabled
                    ? 'bg-[#3a9a4a] text-[#f5f0e8]'
                    : 'bg-[#2a1010] text-[#b8ada0]'
                }`}>
                  {access.enabled ? 'ON' : 'OFF'}
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Account Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardHeader
              title="Danger Zone"
              icon={<LogOut className="w-3.5 h-3.5 text-[#c95a5a]" />}
            />
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-[#2a1010] border border-[#c95a5a] text-[#c95a5a] rounded font-semibold hover:bg-[#3a2020] transition-colors text-sm">
                Logout
              </button>
              <button className="w-full px-4 py-2 bg-[#2a1010] border border-[#c95a5a]/50 text-[#c95a5a]/70 rounded font-semibold hover:bg-[#3a2020] transition-colors text-sm">
                Delete Account
              </button>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="About"
              icon={<Settings className="w-3.5 h-3.5 text-[#c9a227]" />}
            />
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-xs text-[#b8ada0]">Portal Version</p>
                <p className="font-semibold text-[#f5f0e8]">2.0.0</p>
              </div>
              <button className="text-[#c9a227] hover:text-[#f5f0e8] font-semibold transition-colors">
                Check for Updates
              </button>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

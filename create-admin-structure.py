#!/usr/bin/env python3
"""
Setup script to create Phase 3a admin structure
Run: python create-admin-structure.py
"""

import os
import sys
from pathlib import Path

def create_admin_structure():
    """Create admin directory and files"""
    
    # Define paths
    app_root = Path(__file__).parent / "app"
    admin_dir = app_root / "app" / "admin"
    
    print(f"Creating admin structure in: {admin_dir}")
    
    # Create directory
    admin_dir.mkdir(parents=True, exist_ok=True)
    print(f"✓ Created directory: {admin_dir}")
    
    # Create layout.tsx
    layout_content = '''// Admin section layout
export const metadata = {
  title: 'Admin Portal',
  description: 'Administrative dashboard for community management',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
'''
    
    layout_path = admin_dir / "layout.tsx"
    layout_path.write_text(layout_content)
    print(f"✓ Created: {layout_path}")
    
    # Create page.tsx (simplified version to avoid huge file)
    page_content = \'\'\'\'use client\'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Card, CardHeader, StatCard } from '@/components/UI'
import {
  Users,
  ShieldCheck,
  Clock,
  Activity,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  useRealtimeMembers,
  useAdminInvites,
  useIsAdmin,
} from '@/lib/useRealtime'
import {
  getActiveAdminCount,
  getActiveAdmins,
  getPendingAdminRequests,
} from '@/lib/admin-guard'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const { user: authUser, loading: authLoading } = useAuth()
  const { isAdmin } = useIsAdmin()
  const { members, loading: membersLoading } = useRealtimeMembers()
  const { invites, loading: invitesLoading } = useAdminInvites()

  const [member, setMember] = useState<any>(null)
  const [adminCount, setAdminCount] = useState(0)
  const [admins, setAdmins] = useState<any[]>([])
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [auditLog, setAuditLog] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMember = async () => {
      if (!authUser?.id) return
      try {
        const { data, error: fetchError } = await supabase
          .from('members')
          .select('*')
          .eq('id', authUser.id)
          .single()
        if (fetchError) throw fetchError
        setMember(data)
      } catch (err) {
        console.error('Error fetching member:', err)
        setError('Failed to load admin profile')
      }
    }
    fetchMember()
  }, [authUser?.id])

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true)
        const count = await getActiveAdminCount()
        setAdminCount(count)
        const adminsList = await getActiveAdmins()
        setAdmins(adminsList)
        const requests = await getPendingAdminRequests()
        setPendingRequests(requests)
        const { data: logs, error: logsError } = await supabase
          .from('audit_log')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10)
        if (!logsError && logs) setAuditLog(logs)
        setError(null)
      } catch (err) {
        console.error('Error fetching admin data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    if (isAdmin && authUser?.id) fetchAdminData()
  }, [isAdmin, authUser?.id])

  const isOverallLoading = authLoading || membersLoading || invitesLoading || loading

  if (isOverallLoading) {
    return (
      <AdminLayout user={member}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#c9a227] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#8a6070]">Loading admin dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const systemHealth = ((members.length > 0 ? 100 : 0) + (adminCount > 0 ? 100 : 0) + (auditLog.length > 0 ? 100 : 0)) / 3

  return (
    <AdminLayout user={member}>
      {error && (
        <div className="mb-6 p-4 bg-[#2a1010] border border-[#c95a5a] rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#c95a5a] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#c95a5a]">Error</p>
            <p className="text-xs text-[#8a6070] mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[#f5f0e8] mb-1">
          Welcome back, {member?.full_name?.split(' ')[0] || 'Admin'}
        </h2>
        <p className="text-[#8a6070] text-sm">Manage your community and oversee all portal activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Users className="w-3.5 h-3.5 text-[#c9a227]" />}
          label="Total Members"
          value={members.length.toString()}
          sub="Active community members"
          badge={{ text: members.length > 0 ? 'Growing' : 'Low', color: members.length > 0 ? 'green' : 'amber' }}
        />
        <StatCard
          icon={<ShieldCheck className="w-3.5 h-3.5 text-[#c9a227]" />}
          label="Active Admins"
          value={`${adminCount}/5`}
          sub="Admin capacity"
          badge={{ text: adminCount < 5 ? 'Available' : 'Full', color: adminCount < 5 ? 'green' : 'amber' }}
        />
        <StatCard
          icon={<Clock className="w-3.5 h-3.5 text-[#c9a227]" />}
          label="Pending Requests"
          value={pendingRequests.length.toString()}
          sub="Admin invitations"
          badge={{ text: pendingRequests.length > 0 ? 'Action needed' : 'Clear', color: pendingRequests.length > 0 ? 'amber' : 'green' }}
        />
        <StatCard
          icon={<Activity className="w-3.5 h-3.5 text-[#c9a227]" />}
          label="System Health"
          value={`${Math.round(systemHealth)}%`}
          sub="Overall system status"
          badge={{ text: systemHealth > 80 ? 'Excellent' : 'Good', color: systemHealth > 80 ? 'green' : 'amber' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader title="Quick Actions" icon={<ArrowRight className="w-4 h-4 text-[#c9a227]" />} />
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-lg bg-[#2a1010] hover:bg-[#3a1a1a] border border-[rgba(201,162,39,0.2)] text-sm text-[#c9a227] transition-colors font-medium">➕ Create Member</button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-[#2a1010] hover:bg-[#3a1a1a] border border-[rgba(201,162,39,0.2)] text-sm text-[#c9a227] transition-colors font-medium">🔗 Send Admin Invite</button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-[#2a1010] hover:bg-[#3a1a1a] border border-[rgba(201,162,39,0.2)] text-sm text-[#c9a227] transition-colors font-medium">📋 View All Members</button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-[#2a1010] hover:bg-[#3a1a1a] border border-[rgba(201,162,39,0.2)] text-sm text-[#c9a227] transition-colors font-medium">📊 Export Reports</button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Active Admins" link={{ label: `${adminCount}/5`, href: '#' }} />
          <div className="space-y-2">
            {admins.length > 0 ? (
              admins.slice(0, 4).map((admin, idx) => (
                <div key={admin.id || idx} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#1a0808] border border-[rgba(201,162,39,0.05)]">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-[#2a1010] border border-[#c9a227] flex items-center justify-center text-xs font-bold text-[#c9a227] flex-shrink-0">{admin.full_name?.charAt(0) || 'A'}</div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#e8dcc8] truncate">{admin.full_name}</p>
                      <p className="text-[10px] text-[#6a5060] truncate">{admin.email}</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#4aaa4a] flex-shrink-0"></div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-[#6a5060] text-xs italic">No admins found</div>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Pending Invitations" link={{ label: pendingRequests.length.toString(), href: '#' }} />
          <div className="space-y-2">
            {pendingRequests.length > 0 ? (
              pendingRequests.slice(0, 4).map((req, idx) => (
                <div key={req.id || idx} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#1a0808] border border-[rgba(201,162,39,0.05)]">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#e8dcc8] truncate">{req.invitee_email}</p>
                    <p className="text-[10px] text-[#6a5060]">Sent {new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  <Clock className="w-4 h-4 text-[#c9a227] flex-shrink-0" />
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-[#6a5060] text-xs italic">No pending invites</div>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Recent Activity" link={{ label: 'View Audit Log', href: '/app/admin/audit-log' }} icon={<Activity className="w-4 h-4 text-[#c9a227]" />} />
        <div className="space-y-1">
          {auditLog.length > 0 ? (
            auditLog.slice(0, 10).map((log, idx) => (
              <div key={log.id || idx} className="flex items-start gap-3 py-3 px-3 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                <div className="w-2 h-2 rounded-full bg-[#c9a227] mt-1.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#e8dcc8] capitalize">{log.action}</p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-xs text-[#6a5060] truncate">{log.details?.description || log.details?.member_name || 'System action'}</p>
                    <span className="text-[10px] text-[#5a4050]">{new Date(log.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-[#6a5060] text-sm italic">No activity yet</div>
          )}
        </div>
      </Card>
    </AdminLayout>
  )
}
\'\'\'
    
    page_path = admin_dir / "page.tsx"
    page_path.write_text(page_content)
    print(f"✓ Created: {page_path}")
    
    print("\n✅ Admin structure created successfully!")
    print(f"\nCreated files:")
    print(f"  - {layout_path}")
    print(f"  - {page_path}")
    
    return True

if __name__ == "__main__":
    try:
        if create_admin_structure():
            sys.exit(0)
        else:
            sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)

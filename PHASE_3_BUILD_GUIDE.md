# Phase 3 Implementation - Complete Build Guide

This guide contains all the files and code needed for Phase 3 implementation of the admin portal.

## Setup Instructions

### Step 1: Create Directory Structure

```bash
# From the app directory
mkdir -p src/app/admin/{members,duties,events,requests}
mkdir -p src/app/members/{directory,[id]}
mkdir -p src/api/admin/{members/{[id],promote},duties/[id],events/[id],requests/{[id],{accept,reject}}}
```

Or use Node.js:
```bash
node setup-phase3-complete.js
```

### Step 2: Copy All Files

Copy all component and page files from the attached code sections below into their respective directories.

### Step 3: Update Database Schema

Run this SQL in Supabase if not already done:
```sql
-- From SUPABASE_MIGRATION_PHASE1.sql
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS admin_approved_by UUID REFERENCES members(id);
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

CREATE TABLE IF NOT EXISTS admin_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID REFERENCES members(id) NOT NULL,
  invitee_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES members(id),
  action VARCHAR(255) NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Step 4: Install & Build

```bash
cd app
npm install
npm run build
npm run dev
```

### Step 5: Test Admin Portal

- Visit: http://localhost:3000/admin
- All pages should be accessible
- Real-time updates should work via Supabase subscriptions

## File Organization

### Utilities (✅ Already Created)
- `src/lib/types.ts` - Extended with admin types
- `src/lib/admin-guard.ts` - Admin permission helpers
- `src/lib/admin-api.ts` - API wrappers
- `src/lib/useRealtime.ts` - Real-time hooks

### Common Components (✅ Already Created)
- `src/components/AdminLayout.tsx` - Layout wrapper
- `src/components/StatusBadge.tsx` - Status display
- `src/components/ConfirmDialog.tsx` - Delete confirmations
- `src/components/DataTable.tsx` - Reusable table
- `src/components/FilterBar.tsx` - Search & filters
- `src/components/MemberForm.tsx` - Member create/edit

### Admin Pages (Need Creation)
- `src/app/admin/page.tsx` - Dashboard
- `src/app/admin/members/page.tsx` - Members manager
- `src/app/admin/duties/page.tsx` - Duties manager
- `src/app/admin/events/page.tsx` - Events manager
- `src/app/admin/requests/page.tsx` - Admin requests

### Admin Components (Need Creation)
- `src/components/MemberDetails.tsx` - Member profile modal
- `src/components/DutyForm.tsx` - Duty create/edit
- `src/components/EventForm.tsx` - Event create/edit
- `src/components/InviteAdminForm.tsx` - Admin invitation

### Public Pages (Need Creation)
- `src/app/members/directory/page.tsx` - Member directory
- `src/app/members/[id]/page.tsx` - Member profile

### API Routes (Need Creation)
- `src/api/admin/members/route.ts` - POST/GET members
- `src/api/admin/members/[id]/route.ts` - PUT/DELETE member
- `src/api/admin/members/[id]/promote/route.ts` - Promote admin
- `src/api/admin/duties/route.ts` - POST/GET duties
- `src/api/admin/duties/[id]/route.ts` - PUT/DELETE duty
- `src/api/admin/events/route.ts` - POST/GET events
- `src/api/admin/events/[id]/route.ts` - PUT/DELETE event
- `src/api/admin/requests/route.ts` - POST/GET invites
- `src/api/admin/requests/[id]/accept/route.ts` - Accept invite
- `src/api/admin/requests/[id]/reject/route.ts` - Reject invite

## Implementation Checklist

- [x] Types extended with admin types
- [x] Admin guard utilities created
- [x] Admin API wrappers created
- [x] Real-time hooks created
- [x] Common components created
- [x] AdminLayout created
- [ ] Create admin pages
- [ ] Create admin components
- [ ] Create API routes
- [ ] Create public member pages
- [ ] Test all functionality
- [ ] Deploy to production

## Key Features

### Members Manager
- View all members with real-time updates
- Search and filter by name, email, role
- Create new members
- Edit member details
- Soft delete members
- Promote to admin status
- Audit logging for all changes

### Duties Manager
- Schedule member duties
- Track duty status (scheduled, served, absent, late)
- Assign roles (Server, Cantor, etc)
- Real-time duty updates

### Events Manager
- Create and manage events
- Filter by event type (feast, training, recollection, outreach)
- Track attendance

### Admin Requests
- Send admin invitations
- View pending invites
- Accept/reject invites
- Audit trail of admin changes

### Real-Time Features
- Live member list updates
- Live duty schedule updates
- Live event updates
- All changes propagated via Supabase subscriptions

### Security Features
- RLS policies for admin access only
- Soft deletes (never hard delete)
- Audit logging of all admin actions
- Admin permission verification on all endpoints
- Proper HTTP status codes and error handling

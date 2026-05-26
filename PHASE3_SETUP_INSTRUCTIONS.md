# Phase 3 Implementation - Complete Setup Guide

This document contains all instructions needed to complete Phase 3 implementation of the SLPC-MAS admin portal.

## Status Overview

✅ **Already Completed:**
- Type definitions extended (`lib/types.ts`)
- Admin guard utilities (`lib/admin-guard.ts`)
- Admin API wrappers (`lib/admin-api.ts`)
- Real-time hooks (`lib/useRealtime.ts`)
- Common UI components (StatusBadge, ConfirmDialog, DataTable, FilterBar)
- AdminLayout component
- MemberForm component
- MemberDetails component

## Setup Instructions

### Step 1: Create Directory Structure

The following directories need to exist:
```
app/src/
├── app/
│   ├── admin/
│   │   ├── members/
│   │   ├── duties/
│   │   ├── events/
│   │   └── requests/
│   └── members/
│       ├── directory/
│       └── [id]/
├── components/
└── api/
    └── admin/
        ├── members/
        │   └── [id]/
        ├── duties/
        │   └── [id]/
        ├── events/
        │   └── [id]/
        └── requests/
            ├── [id]/
            ├── [id]/accept/
            └── [id]/reject/
```

You can create these manually or use Windows Explorer.

### Step 2: Run Setup Scripts

Execute the Node.js setup scripts from the `d:\SLPC-MAS` directory:

```bash
# Step 1: Create main admin pages
node setup-phase3-complete.js

# Step 2: Create remaining admin pages
node phase3-pages-setup.js

# Step 3: Create form components
node phase3-components-setup.js
```

After each script, verify files were created successfully.

### Step 3: Manual File Placement

Copy the following files that have already been created:

**From components (already created):**
- `app/src/components/AdminLayout.tsx` ✓
- `app/src/components/StatusBadge.tsx` ✓
- `app/src/components/ConfirmDialog.tsx` ✓
- `app/src/components/DataTable.tsx` ✓
- `app/src/components/FilterBar.tsx` ✓
- `app/src/components/MemberForm.tsx` ✓
- `app/src/components/MemberDetails.tsx` ✓

**From lib (already created):**
- `app/src/lib/types.ts` ✓ (extended)
- `app/src/lib/admin-guard.ts` ✓
- `app/src/lib/admin-api.ts` ✓
- `app/src/lib/useRealtime.ts` ✓

### Step 4: Database Setup

Run this SQL in Supabase SQL Editor to set up admin tables:

```sql
-- Extended columns for members table
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS admin_approved_by UUID REFERENCES members(id);
ALTER TABLE members ADD COLUMN IF NOT EXISTS admin_requested_at TIMESTAMP;
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Admin invites table
CREATE TABLE IF NOT EXISTS admin_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID REFERENCES members(id) NOT NULL,
  invitee_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_invites_pending_email 
ON admin_invites(invitee_email, status) 
WHERE status = 'pending';

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES members(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add soft-delete columns to existing tables
ALTER TABLE duties ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE duties ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

ALTER TABLE events ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
```

### Step 5: Create API Routes (Manual)

These still need to be created manually. See `API_ROUTES.md` for complete examples.

### Step 6: Build & Deploy

```bash
cd app
npm install
npm run build
npm run dev
```

Visit: `http://localhost:3000/admin`

## File Structure After Setup

```
app/src/
├── app/
│   ├── admin/
│   │   ├── page.tsx ✓ (Dashboard)
│   │   ├── members/
│   │   │   └── page.tsx ✓ (Members Manager)
│   │   ├── duties/
│   │   │   └── page.tsx ✓ (Duties Manager)
│   │   ├── events/
│   │   │   └── page.tsx ✓ (Events Manager)
│   │   └── requests/
│   │       └── page.tsx ✓ (Admin Requests)
│   └── members/
│       ├── directory/
│       │   └── page.tsx (TODO)
│       └── [id]/
│           └── page.tsx (TODO)
│
├── api/
│   └── admin/
│       ├── members/
│       │   ├── route.ts (TODO)
│       │   └── [id]/
│       │       ├── route.ts (TODO)
│       │       └── promote/
│       │           └── route.ts (TODO)
│       ├── duties/
│       │   ├── route.ts (TODO)
│       │   └── [id]/
│       │       └── route.ts (TODO)
│       ├── events/
│       │   ├── route.ts (TODO)
│       │   └── [id]/
│       │       └── route.ts (TODO)
│       └── requests/
│           ├── route.ts (TODO)
│           ├── [id]/
│           │   ├── accept/
│           │   │   └── route.ts (TODO)
│           │   └── reject/
│           │       └── route.ts (TODO)
│
├── components/
│   ├── AdminLayout.tsx ✓
│   ├── ConfirmDialog.tsx ✓
│   ├── DataTable.tsx ✓
│   ├── FilterBar.tsx ✓
│   ├── StatusBadge.tsx ✓
│   ├── MemberForm.tsx ✓
│   ├── MemberDetails.tsx ✓
│   ├── DutyForm.tsx ✓
│   ├── EventForm.tsx ✓
│   ├── InviteAdminForm.tsx ✓
│   └── MemberCard.tsx (TODO)
│
└── lib/
    ├── types.ts ✓ (extended)
    ├── admin-guard.ts ✓
    ├── admin-api.ts ✓
    └── useRealtime.ts ✓
```

## Features Implemented

### ✅ Core Utilities
- Type definitions with Zod validation
- Admin permission checking
- Audit logging
- Real-time subscriptions
- Soft delete support

### ✅ UI Components
- Responsive layouts
- Data tables with sorting
- Filter bars
- Confirm dialogs
- Status badges
- Form components

### ✅ Admin Pages
- Dashboard with stats
- Members manager (view, create, edit, delete, promote)
- Duties manager (schedule, track, manage)
- Events manager (create, manage, list)
- Admin requests (invite, accept, reject)

### ✅ Member Features
- Real-time member list
- Member search and filtering
- Member profiles
- Admin status management

### TODO API Routes
- POST/GET /api/admin/members
- PUT/DELETE /api/admin/members/[id]
- POST /api/admin/members/[id]/promote
- POST/GET /api/admin/duties
- PUT/DELETE /api/admin/duties/[id]
- POST/GET /api/admin/events
- PUT/DELETE /api/admin/events/[id]
- POST/GET /api/admin/requests
- POST /api/admin/requests/[id]/accept
- POST /api/admin/requests/[id]/reject

### TODO Public Pages
- /app/members/directory
- /app/members/[id]

## Key Technologies

- **Framework:** Next.js 16.2
- **Database:** Supabase
- **Auth:** Supabase Auth
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Validation:** Zod
- **Real-time:** Supabase Real-time

## Testing Checklist

- [ ] Admin dashboard loads
- [ ] Members list displays
- [ ] Can create new member
- [ ] Can edit member
- [ ] Can delete member (soft delete)
- [ ] Can promote member to admin
- [ ] Duties manager works
- [ ] Events manager works
- [ ] Admin requests work
- [ ] Real-time updates work
- [ ] Audit logging records actions
- [ ] Search and filter work

## Troubleshooting

### Directory Creation Issues

If directories fail to create, manually create them:
```
mkdir app\src\app\admin
mkdir app\src\app\admin\members
mkdir app\src\app\admin\duties
mkdir app\src\app\admin\events
mkdir app\src\app\admin\requests
```

### Build Errors

```bash
# Clear cache and rebuild
rm -r app/.next
npm run build
```

### Import Errors

Ensure all paths use `@/` alias correctly and files exist in `src/` directory.

## Next Phase

After completing Phase 3:
1. Create API routes
2. Create public member pages
3. Test end-to-end functionality
4. Deploy to production

## Support

Refer to `PHASE_3_BUILD_GUIDE.md` for detailed implementation notes.

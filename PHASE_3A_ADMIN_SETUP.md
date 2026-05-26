# Phase 3a: Admin Layout & Dashboard Foundation - Setup Guide

## ✅ Completed Files

### 1. `/lib/admin-guard.ts` ✓
**Status**: Created successfully
**Location**: `d:\SLPC-MAS\app\lib\admin-guard.ts`

**Functions Implemented**:
- `requireAdmin(userId)` - Verifies admin status
- `getCurrentAdmin(userId)` - Gets admin record with full details
- `canManageMember(adminId, memberId)` - Permission check for member management
- `logAdminAction(action, userId, details)` - Logs to audit_log table
- `enforceAdminLimit(count)` - Ensures max 5 admins (throws if violated)
- `getActiveAdminCount()` - Count active admins
- `getActiveAdmins()` - Get list of all active admins
- `getPendingAdminRequests()` - Fetch pending admin invites

### 2. `/components/AdminLayout.tsx` ✓
**Status**: Created successfully
**Location**: `d:\SLPC-MAS\app\components\AdminLayout.tsx`

**Features**:
- Admin wrapper layout extending MainLayout patterns
- Sidebar with navigation links (Dashboard, Members, Duties, Events, Requests)
- Admin badge in header showing green status indicator
- Breadcrumb navigation system
- Role check with redirect to /app/dashboard for non-admins
- Responsive design (mobile + desktop)
- Sidebar toggle on mobile
- Loading states during admin verification
- Error handling with user-friendly messages

### 3. `/app/admin/page.tsx` - NEEDS MANUAL SETUP
**Status**: Content ready - directory needs creation
**Content Path**: `d:\SLPC-MAS\create-admin-structure.js`

**To Complete This Step**:
1. Create directory: `d:\SLPC-MAS\app\app\admin\`
2. Create two files in that directory:
   - `page.tsx` - Admin dashboard page
   - `layout.tsx` - Admin section layout

## 🔧 Manual Setup Instructions

### Option 1: Using PowerShell (Recommended)
```powershell
# Navigate to project
cd d:\SLPC-MAS

# Run Node script to create structure
node create-admin-structure.js
```

### Option 2: Manual File Creation
1. **Create directory** `d:\SLPC-MAS\app\app\admin\`
2. **Create** `d:\SLPC-MAS\app\app\admin\layout.tsx`:
```typescript
// Admin section layout
export const metadata = {
  title: 'Admin Portal',
  description: 'Administrative dashboard for community management',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
```

3. **Create** `d:\SLPC-MAS\app\app\admin\page.tsx`:
   - Copy the full content from the script file
   - Or use the content included in ADMIN_PAGE_CONTENT.tsx

### Option 3: Using Command Line
```cmd
mkdir d:\SLPC-MAS\app\app\admin
cd d:\SLPC-MAS
node create-admin-structure.js
```

## 📋 Admin Dashboard Features

### Stats Cards
- **Total Members**: Active community members count
- **Active Admins**: Current admins vs max (5) capacity
- **Pending Requests**: Admin invitation status
- **System Health**: Overall system status percentage

### Quick Actions Panel
- Create Member
- Send Admin Invite
- View All Members
- Export Reports

### Active Admins Card
- Lists current admin team (max 4 visible)
- Shows admin email and status indicator
- Displays "+N more" if team exceeds 4

### Pending Invitations Card
- Shows pending admin invite emails
- Displays when invite was sent
- Clock icon for pending status

### Recent Activity Section
- Last 10 audit log entries
- Shows action type and timestamp
- Hover effects for better UX

## 🔌 Integration Points

### Dependencies Used
- `AdminLayout` component
- `useAuth()` hook for user context
- `useIsAdmin()` hook for admin status
- `useRealtimeMembers()` for member data
- `useAdminInvites()` for pending invites
- Admin guard functions for data fetching
- Supabase queries for audit_log table

### Tables Required in Supabase
- `members` (already exists - needs `is_admin` field)
- `admin_invites` (already exists)
- `audit_log` (needs to be created if not present)

## 🚀 Next Steps

1. **Create the admin directory structure** (see instructions above)
2. **Database Setup**:
   - Verify `audit_log` table exists in Supabase
   - Check `admin_invites` table structure
   - Ensure `members.is_admin` field exists

3. **Test Admin Access**:
   - Mark a test user as admin in the database
   - Navigate to `/app/admin`
   - Verify dashboard loads correctly

4. **Features to Build** (Phase 3b):
   - Members management page
   - Duties management page
   - Events management page
   - Admin requests page
   - Audit log viewer
   - System settings page

## 📝 Database Schema Validation

### Required Fields in `members` Table:
```sql
- id (UUID)
- is_admin (BOOLEAN)
- admin_approved_by (UUID, nullable)
- admin_requested_at (TIMESTAMP, nullable)
```

### Required `audit_log` Table:
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES members(id) NOT NULL,
  action VARCHAR(255) NOT NULL,
  details JSONB,
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Required `admin_invites` Table:
```sql
CREATE TABLE admin_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID REFERENCES members(id) NOT NULL,
  invitee_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## ✨ TypeScript Strict Mode

All files are using TypeScript strict mode:
- Proper type annotations throughout
- No implicit `any` types
- Error handling with try/catch blocks
- Type-safe component props

## 🎨 Design Consistency

- Uses existing color scheme (#c9a227 for gold, #1a0808 for dark)
- Follows MainLayout patterns
- Responsive Tailwind CSS classes
- Lucide icons for consistency
- Proper loading and error states

## 📞 Support

If you encounter issues:
1. Check that Node.js is installed: `node --version`
2. Verify directory structure matches: `app/app/admin/`
3. Ensure Supabase tables are properly configured
4. Check browser console for any client-side errors

## 🔍 File Verification Checklist

- [x] `d:\SLPC-MAS\app\lib\admin-guard.ts` created
- [x] `d:\SLPC-MAS\app\components\AdminLayout.tsx` created
- [ ] `d:\SLPC-MAS\app\app\admin\` directory created
- [ ] `d:\SLPC-MAS\app\app\admin\page.tsx` created
- [ ] `d:\SLPC-MAS\app\app\admin\layout.tsx` created

---

**Last Updated**: Phase 3a
**Status**: Ready for manual directory creation

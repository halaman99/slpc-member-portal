# 📋 PHASE 1 & 2 DEPLOYMENT CHECKLIST

## Pre-Deployment Verification ✅

- [ ] Read `PHASE1_COMPLETE_SUMMARY.md` for overview
- [ ] Read `WORKFLOW_DIAGRAMS.md` for understanding data flow
- [ ] Read `PHASE1_IMPLEMENTATION.md` for step-by-step guide
- [ ] Backup current Supabase database (optional but recommended)
- [ ] Git branch created: `git checkout -b phase1-admin-system`

---

## STEP 1: Database Migration (RUN IN SUPABASE FIRST)

### Location:
Supabase Dashboard → SQL Editor

### What to do:
1. Create new SQL query
2. Open file: `d:\SLPC-MAS\SUPABASE_MIGRATION_PHASE1.sql`
3. Copy **ALL** content
4. Paste into Supabase SQL Editor
5. Click **Run**

### Expected Result:
```
✓ Creating admin_invites table...
✓ Creating audit_log table...
✓ Adding columns to members...
✓ Adding columns to duties...
✓ Adding columns to events...
✓ Creating update_updated_at_column trigger...
✓ Creating indexes...

Query completed successfully
```

### Verification:
```sql
-- Run each in SQL Editor to verify

-- Check members columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'members' AND column_name IN 
('is_admin', 'admin_approved_by', 'is_deleted', 'updated_at');

-- Should return 4 rows ✓

-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('admin_invites', 'audit_log');

-- Should return 2 rows ✓

-- Check first admin (optional now)
SELECT COUNT(*) FROM members WHERE is_admin = TRUE;
-- Should return 0 (until next step) ✓
```

---

## STEP 2: Enable Realtime on Tables

### Location:
Supabase Dashboard → Replication tab

### What to do:
1. Click **"Replication"** section
2. Find these tables and toggle ON:
   - `members`
   - `duties`
   - `events`
   - `announcements`
   - `admin_invites`

### Expected Result:
```
✓ members - REPLICATED
✓ duties - REPLICATED
✓ events - REPLICATED
✓ announcements - REPLICATED
✓ admin_invites - REPLICATED
```

---

## STEP 3: Set First Admin

### Location:
Supabase SQL Editor

### What to do:
```sql
-- Replace EMAIL with your email
UPDATE members 
SET is_admin = TRUE, admin_approved_by = id 
WHERE email = 'smigoal.lul@gmail.com';
```

### Verify:
```sql
SELECT id, email, is_admin FROM members WHERE is_admin = TRUE;

-- Should show 1 row with your email ✓
```

---

## STEP 4: Remove All Sample Data

### Location:
Supabase SQL Editor

### What to do - CAREFULLY:
```sql
-- Delete sample records (but keep real members)
DELETE FROM announcements;
DELETE FROM member_formations;
DELETE FROM formations;

-- Delete dummy duties (keep if member has real auth.user)
DELETE FROM duties 
WHERE member_id NOT IN (SELECT id FROM members WHERE email IN (SELECT email FROM auth.users));

-- Delete events/attendance if only sample
DELETE FROM events WHERE title LIKE '%Sample%' OR title LIKE '%Test%';
DELETE FROM attendance WHERE id NOT IN (SELECT id FROM attendance LIMIT 1000);
```

### Safer approach - review first:
```sql
-- Just see what you'll delete
SELECT COUNT(*) FROM announcements;
SELECT COUNT(*) FROM formations;
SELECT COUNT(*) FROM events;
SELECT COUNT(*) FROM duties;
SELECT COUNT(*) FROM members WHERE email NOT IN (SELECT email FROM auth.users);
```

### Verify:
```sql
-- After deletion
SELECT COUNT(*) FROM announcements;  -- Should be 0
SELECT COUNT(*) FROM formations;     -- Should be 0
SELECT COUNT(*) FROM members WHERE email IN (SELECT email FROM auth.users);  -- Should show only real members
```

---

## STEP 5: Commit Code Changes

### Location:
`d:\SLPC-MAS\app`

### What to do:
```bash
# Navigate to app directory
cd d:\SLPC-MAS\app

# Check what changed
git status

# You should see:
# modified: lib/auth.ts
# new file: lib/useRealtime.ts

# Stage changes
git add lib/auth.ts lib/useRealtime.ts

# Commit with message
git commit -m "Phase 1: Add admin system, realtime subscriptions, and audit logging

- Add admin role columns (is_admin, admin_approved_by, admin_requested_at)
- Create admin_invites table for approval workflow
- Create audit_log table for tracking changes
- Add soft-delete support (is_deleted, updated_at columns)
- Implement auto-update triggers on all major tables
- Add Supabase realtime hooks for live data subscriptions
- Add admin management functions (invite, accept, reject)
- Implement 5-admin limit enforcement
- Add RLS policies for admin access control

Features:
- useRealtimeMembers() hook for live member list
- useRealtimeDuties() hook for duty updates
- useRealtimeEvents() hook for event updates
- useRealtimeAnnouncements() hook for announcement updates
- useIsAdmin() hook to check admin status
- useAdminInvites() hook to watch invite notifications
- getCurrentMember() to fetch current user's profile
- inviteAdmin(email) to invite new admins
- acceptAdminInvite(inviteId) to accept invitations
- rejectAdminInvite(inviteId) to reject invitations

Database updates:
- Members table: added is_admin, admin_approved_by, admin_requested_at, is_deleted, updated_at
- New tables: admin_invites, audit_log
- All tables: soft delete support with is_deleted and updated_at columns
- Triggers: auto-update timestamps on all table updates
- Indexes: for performance on updated_at, created_at fields

Security:
- RLS policies for admin-only operations
- Audit trail for all changes
- Soft deletes for data recovery
- Max 5 admins enforcement

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

# Verify commit
git log --oneline -1

# Push to GitHub
git push origin phase1-admin-system
```

### Expected Output:
```
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 8 threads
Compressing objects: 100% (2/2), done.
Writing objects: 100% (3/3), 1.23 KiB | 615 bytes/s, done.
Total 3 (delta 2), reused 0 (delta 0), pack-reused 0
remote: Create a pull request for 'phase1-admin-system' on GitHub by visiting:
remote: https://github.com/halaman99/slpc-member-portal/pull/new/phase1-admin-system

To https://github.com/halaman99/slpc-member-portal.git
 * [new branch]      phase1-admin-system -> phase1-admin-system
```

---

## STEP 6: Create Pull Request (Optional)

### Location:
GitHub

### What to do:
1. Go to: https://github.com/halaman99/slpc-member-portal
2. Click **"Compare & pull request"** button
3. Review changes in PR
4. Click **"Create pull request"**
5. Wait for checks to pass
6. Click **"Merge pull request"**

### Or merge directly:
```bash
# Switch to main branch
git checkout main

# Pull latest from remote
git pull origin main

# Merge feature branch
git merge phase1-admin-system

# Push to remote
git push origin main
```

---

## STEP 7: Deploy to Vercel

### Automatic (Recommended):
- GitHub webhook triggers Vercel automatically
- Wait 2-5 minutes for deployment
- Check https://slpc-member-portal.vercel.app

### Manual:
1. Go to Vercel Dashboard
2. Find "slpc-member-portal" project
3. Click "Deploy"
4. Select branch "main"
5. Wait for build to complete

### Verify Deployment:
```bash
# Test in browser console:
// This should work without errors
fetch('https://slpc-member-portal.vercel.app/api/health')
  .then(r => r.json())
  .then(console.log)
```

---

## STEP 8: Test Everything

### Test in Production:

#### Test 1: Login still works
- [ ] Go to https://slpc-member-portal.vercel.app/auth/login
- [ ] Login with test account
- [ ] Should redirect to dashboard

#### Test 2: Realtime works
- [ ] Open dashboard in 2 browser tabs
- [ ] In Supabase, update a member record
- [ ] Both tabs should update within 1-2 seconds
- [ ] No page refresh needed

#### Test 3: Admin status
- [ ] In browser console, run:
  ```javascript
  import { isUserAdmin } from '@/lib/auth'
  const admin = await isUserAdmin()
  console.log('Is Admin:', admin)  // Should be true
  ```

#### Test 4: Invite another admin
- [ ] Add another test user to auth.users
- [ ] Invite them to be admin
- [ ] Check admin_invites table
- [ ] Accept invite from their account
- [ ] Verify they're now admin

#### Test 5: Audit log
- [ ] Update any member
- [ ] Check audit_log table in Supabase
- [ ] Should see your action logged

---

## TROUBLESHOOTING

### Issue: Realtime not working
**Solution:**
1. Check Supabase dashboard → Replication
2. Ensure tables are enabled
3. Check browser DevTools → Network for WebSocket connections
4. Clear browser cache and reload

### Issue: Admin functions fail
**Solution:**
1. Check console errors (F12)
2. Verify auth.ts was committed correctly
3. Check Supabase API key is correct in .env.local
4. Test: `const { user } = await getCurrentUser()`

### Issue: Vercel deployment fails
**Solution:**
1. Check build logs in Vercel dashboard
2. Run locally: `npm run build`
3. Check for TypeScript errors: `npx tsc --noEmit`
4. Commit fixes and push again

### Issue: Database migration failed
**Solution:**
1. Go to Supabase SQL Editor
2. Run: `SELECT * FROM information_schema.tables WHERE table_name = 'admin_invites';`
3. If empty, run migration again
4. Check for error messages in Supabase console

---

## POST-DEPLOYMENT

### Next: Update Dashboard Components
- [ ] Replace hardcoded sample data with realtime hooks
- [ ] Add useRealtimeMembers() to dashboard
- [ ] Add useRealtimeDuties() to dashboard
- [ ] Test all components update in realtime

### Files to update:
- `app/app/dashboard/page.tsx` - Use realtime members
- `app/app/members/page.tsx` - Use realtime members list
- `app/app/schedule/page.tsx` - Use realtime duties
- `app/app/events/page.tsx` - Use realtime events

---

## ROLLBACK (If needed)

```bash
# Undo Vercel deployment
git revert HEAD
git push origin main
# Vercel will deploy previous version

# Undo database migration
# Contact Supabase support to restore backup
# Or manually:
DROP TABLE IF EXISTS admin_invites CASCADE;
DROP TABLE IF EXISTS audit_log CASCADE;
ALTER TABLE members DROP COLUMN IF EXISTS is_admin;
-- etc...
```

---

## ✅ CHECKLIST COMPLETE?

- [ ] Migration run in Supabase
- [ ] Realtime enabled on 5 tables
- [ ] First admin set
- [ ] Sample data removed
- [ ] Code committed to Git
- [ ] PR merged or pushed to main
- [ ] Vercel deployment complete
- [ ] All tests passing
- [ ] Dashboard updated with realtime hooks

**If all ✓, Phase 1 & 2 is DONE! 🎉**

Next: Phase 3 - Admin Dashboard UI


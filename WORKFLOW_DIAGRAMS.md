# ADMIN WORKFLOW & DATA FLOW DIAGRAMS

## Admin Invitation & Approval Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN PROMOTION WORKFLOW                      │
└─────────────────────────────────────────────────────────────────┘

CURRENT ADMIN                          NEW USER
    │                                    │
    │─── 1. Invite User ───────────────→│
    │   (inviteAdmin('user@email.com'))  │
    │                                    │
    │  ✓ Check: Count < 5 admins?       │
    │  ✓ Create admin_invites record    │
    │                                    │
    │   2. Realtime notification ───────→│ 
    │   (useAdminInvites hook fires)     │
    │                                    │
    │                      3. Accept ───→│ (acceptAdminInvite())
    │                                    │
    │                      ✓ Check: Count < 5?
    │                      ✓ Update: is_admin = TRUE
    │                      ✓ Update: admin_approved_by = inviter_id
    │                      ✓ Log audit event
    │                                    │
    │  ←────── 4. Realtime Update ──────│
    │   (useRealtimeMembers shows new admin)
    │
    ✅ NEW ADMIN NOW HAS FULL ACCESS
```

---

## Realtime Data Subscription Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                  FRONTEND (React Component)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  export function Dashboard() {                                   │
│    const { members, loading } = useRealtimeMembers()  ◄──────┐  │
│    const { duties } = useRealtimeDuties()             ◄──────┼──┤
│                                                                │  │
│    return <MemberList members={members} />                    │  │
│  }                                                            │  │
│                                                                │  │
└────────────────────────────────────────────────────────────────┼──┘
                                                                 │
                        SUPABASE CLIENT SDK
                                                                 │
┌────────────────────────────────────────────────────────────────┼──┐
│                   SUPABASE REALTIME ENGINE                      │  │
├────────────────────────────────────────────────────────────────┼──┤
│                                                                 │  │
│  supabase                                                      │  │
│    .channel('members:realtime')      ◄────────────────────────┘  │
│    .on('postgres_changes', ...)                                  │
│    .subscribe()                                                  │
│                                                                  │
│  Listens for: INSERT, UPDATE, DELETE on members table           │
│                                                                  │
└──────────────────────────────────────────────┬───────────────────┘
                                               │
                         PostgreSQL Triggers
                                               │
┌──────────────────────────────────────────────▼───────────────────┐
│                    SUPABASE DATABASE                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Table: members                                                  │
│  ┌────────────────┬──────────┬──────────────┬─────────────┐     │
│  │ id             │ name     │ is_admin     │ updated_at  │     │
│  ├────────────────┼──────────┼──────────────┼─────────────┤     │
│  │ uuid-xxx       │ John     │ true         │ 2026-05-... │     │
│  │ uuid-yyy       │ Jane     │ false        │ 2026-05-... │     │
│  │ uuid-zzz       │ Bob      │ false        │ 2026-05-... │     │
│  └────────────────┴──────────┴──────────────┴─────────────┘     │
│                            ↑                                      │
│                     Trigger fires                                 │
│                     update_updated_at                             │
│                     Sets updated_at = NOW()                       │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

When you UPDATE a member:
  1. Column changes in DB
  2. Trigger sets updated_at = NOW()
  3. PostgreSQL notifies realtime listeners
  4. Supabase broadcasts to subscribed clients
  5. useRealtimeMembers hook receives update
  6. React component re-renders with new data
  7. UI updates instantly (no page refresh!)

⏱️ Latency: ~50-200ms (varies by network)
```

---

## Admin System - 5-Admin Limit Enforcement

```
┌──────────────────────────────────────────────────────────────────┐
│               ADMIN INVITATION VALIDATION FLOW                    │
└──────────────────────────────────────────────────────────────────┘

User clicks "Invite Admin"
           │
           ▼
   ┌───────────────────┐
   │ Is user admin?    │
   └─────┬─────────────┘
         │
         NO → Error: "Only admins can invite"
         │
         YES ▼
   ┌─────────────────────────┐
   │ Count current admins:    │
   │ SELECT COUNT(*) FROM ... │
   │ WHERE is_admin = TRUE    │
   │ AND is_deleted = FALSE   │
   └────────────┬────────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
   COUNT >= 5       COUNT < 5
        │                │
        │                YES ▼
        │            ┌──────────────────┐
        │            │ Create invite in  │
        │            │ admin_invites     │
        │            │ table             │
        │            └──────────────────┘
        │
        NO → Error: "Max 5 admins reached"

Result: Never more than 5 admins at any time ✓
```

---

## Database Change Audit Trail

```
┌──────────────────────────────────────────────────────────────────┐
│                    AUDIT LOG TRACKING                            │
└──────────────────────────────────────────────────────────────────┘

When Admin updates a member:

Step 1: Admin changes member.role from "Member" to "Secretary"
        │
        ▼
Step 2: SQL UPDATE fires on members table
        │
        ▼
Step 3: Trigger detects change
        │
        ▼
Step 4: Application logs to audit_log table:
        {
          id: UUID,
          user_id: admin-uuid,
          action: 'UPDATE',
          table_name: 'members',
          record_id: member-uuid,
          old_values: { role: 'Member' },
          new_values: { role: 'Secretary' },
          ip_address: '192.168.1.1',
          created_at: NOW()
        }
        │
        ▼
Step 5: Admin can later view audit log for compliance
        - Who made the change? ✓
        - When? ✓
        - What was changed? ✓
        - From what to what? ✓

Compliance & Transparency ✓
Easy Recovery ✓
```

---

## Soft Delete Strategy

```
┌──────────────────────────────────────────────────────────────────┐
│                    SOFT DELETE WORKFLOW                          │
└──────────────────────────────────────────────────────────────────┘

HARD DELETE (Bad - no recovery):        SOFT DELETE (Good - recoverable):
┌──────────────────────┐                ┌──────────────────────┐
│ DELETE FROM members  │                │ UPDATE members       │
│ WHERE id = 'uuid'    │                │ SET is_deleted=TRUE  │
└──────────────────────┘                │ WHERE id = 'uuid'    │
         │                              └──────────────────────┘
         │                                      │
         ▼ Data GONE forever                    ▼ Data preserved
    No recovery possible                 is_deleted column set to TRUE

All queries filter:                     Admin can see deleted members
  WHERE is_deleted = FALSE              and restore if needed
  
Active users: visible ✓                Both protection & recovery ✓
Deleted users: hidden ✓ (but recoverable)

Examples:
  SELECT * FROM members 
  WHERE is_deleted = FALSE;  -- Only active members
  
  SELECT * FROM members
  WHERE is_deleted = TRUE;   -- Show deleted members to admins
  
  UPDATE members 
  SET is_deleted = FALSE
  WHERE id = 'uuid';  -- Restore deleted member
```

---

## Tech Stack Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                  COMPLETE TECH STACK FLOW                        │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────────┐
│  Browser Tab 1         │
│  Dashboard Component   │
│  useRealtimeMembers()  │
└────────────┬───────────┘
             │
             │ HTTP/WebSocket
             │ (realtime connection)
             │
             ▼
┌────────────────────────────────────────┐
│  Supabase Realtime Engine              │
│  - Listens to DB changes               │
│  - Broadcasts to all clients           │
└────────────┬─────────────────────────┬─┘
             │                         │
             │ HTTP/WebSocket          │ HTTP/WebSocket
             │                         │
    ┌────────▼──────┐         ┌───────▼────────┐
    │ Browser Tab 2 │         │ Admin Panel    │
    │ Different     │         │ Different user │
    │ component     │         │ Component      │
    └───────────────┘         └────────────────┘
    
ALL THREE UPDATE INSTANTLY when database changes
No manual refresh needed
No polling required
```

---

## Complete Request → Response Cycle

```
┌────────────────────────────────────────────────────────────────┐
│  USER ACTION: Admin clicks "Accept Admin Invite"               │
└────────────────────────────────────────────────────────────────┘

1️⃣  Frontend: User clicks button
    └─→ acceptAdminInvite(inviteId) called
    
2️⃣  API Call: Send invite ID to auth.ts
    └─→ Auth layer validates user
    
3️⃣  Database Check: Verify admin count < 5
    └─→ COUNT(admins) query to DB
    
4️⃣  Update admin_invites: Set status='accepted'
    └─→ UPDATE admin_invites WHERE id=...
    
5️⃣  Update members: Set is_admin=TRUE
    └─→ UPDATE members SET is_admin=TRUE
    └─→ Log audit_log entry
    
6️⃣  Realtime Broadcast: DB change triggers
    └─→ PostgreSQL notifies Supabase Realtime
    └─→ Supabase broadcasts to all subscribed clients
    
7️⃣  Frontend Update: Hook receives change
    └─→ useRealtimeMembers detects update
    └─→ useAdminInvites detects invite accepted
    
8️⃣  UI Re-renders: New data displayed
    └─→ Admin badge appears
    └─→ Invite marked "Accepted"
    └─→ Admin access buttons appear
    
⏱️  Total time: ~200-500ms end-to-end

User sees instant confirmation ✓
All other tabs/devices see update ✓
Audit trail recorded ✓
```

---

## Admin Permission Matrix

```
┌─────────────────────────────────────────────────────────────┐
│              ROLE-BASED ACCESS CONTROL                       │
└─────────────────────────────────────────────────────────────┘

Action                    | Regular Member | Admin
─────────────────────────┼────────────────┼──────
View own profile          │      ✓         │  ✓
Edit own profile          │      ✓         │  ✓
View all members          │      ✗         │  ✓
Edit any member           │      ✗         │  ✓
Delete members (soft)     │      ✗         │  ✓
Invite new admin          │      ✗         │  ✓
View audit log            │      ✗         │  ✓
Create events             │      ✗         │  ✓
Create duties             │      ✗         │  ✓
Upload formations         │      ✗         │  ✓
Manage announcements      │      ✗         │  ✓
Accept admin invite       │      ✓         │  ✓
View own duties           │      ✓         │  ✓

Implemented via:
  - RLS policies in Supabase
  - Frontend permission checks (useIsAdmin hook)
  - Backend validation in auth functions
```

---


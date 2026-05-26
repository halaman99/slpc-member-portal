# 🔧 SQL Migration Fix - Partial Unique Index

## Issue Found & Fixed

### ❌ **Original Error**
```
ERROR:  42601: syntax error at or near "WHERE"
LINE 34:   CONSTRAINT unique_pending_invite UNIQUE (invitee_email, status) WHERE status = 'pending'
```

### ✅ **Root Cause**
PostgreSQL **does NOT** support `WHERE` clauses in table-level `UNIQUE` constraints.
- ❌ `CONSTRAINT ... UNIQUE (...) WHERE ...` → Invalid
- ✅ `CREATE UNIQUE INDEX ... WHERE ...` → Valid

### ✅ **Solution Applied**
Replaced invalid constraint with **partial unique index**:

**Before (Broken):**
```sql
CREATE TABLE IF NOT EXISTS admin_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID REFERENCES members(id) ON DELETE CASCADE NOT NULL,
  invitee_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,
  
  CONSTRAINT unique_pending_invite UNIQUE (invitee_email, status) WHERE status = 'pending'
);
```

**After (Fixed):**
```sql
CREATE TABLE IF NOT EXISTS admin_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID REFERENCES members(id) ON DELETE CASCADE NOT NULL,
  invitee_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP
);

-- Partial unique index (PostgreSQL supports WHERE in indexes)
CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_invites_pending_email 
ON admin_invites(invitee_email, status) 
WHERE status = 'pending';
```

---

## What This Does

| Behavior | Constraint | Partial Index |
|----------|-----------|---|
| Enforces uniqueness on `(invitee_email, status)` | ❌ Not possible | ✅ Yes |
| Only for `status = 'pending'` | ❌ Not possible | ✅ Yes |
| Allows duplicate emails with different status | ✅ Yes | ✅ Yes |
| PostgreSQL support | ❌ No | ✅ Yes |

---

## Result

✅ **File Updated:** `SUPABASE_MIGRATION_PHASE1.sql` (line 25-41)

✅ **Status:** Ready to run in Supabase SQL Editor

---

## Next Steps

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Create **new query**
3. Copy all content from: **SUPABASE_MIGRATION_PHASE1.sql**
4. Paste into SQL editor
5. Click **Run**

The migration should now execute successfully! ✅


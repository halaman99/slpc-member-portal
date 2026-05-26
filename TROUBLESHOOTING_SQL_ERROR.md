# 🔍 SQL SYNTAX ERROR TROUBLESHOOTING & FIX

## Error Details

```
ERROR:  42601: syntax error at or near "WHERE"
LINE 34:   CONSTRAINT unique_pending_invite UNIQUE (invitee_email, status) WHERE status = 'pending'
```

---

## ✅ **PROBLEM IDENTIFIED & FIXED**

### What Went Wrong

**PostgreSQL Limitation:**
PostgreSQL does NOT support `WHERE` clauses in table-level `UNIQUE` constraints.

This syntax is invalid in PostgreSQL:
```sql
CREATE TABLE my_table (
  email VARCHAR(255),
  status VARCHAR(50),
  CONSTRAINT my_constraint UNIQUE (email, status) WHERE status = 'pending'  ❌ INVALID
);
```

### Why It Failed

- Table constraints (UNIQUE, PRIMARY KEY, CHECK) cannot use `WHERE` clauses
- Only **indexes** support partial/filtered constraints in PostgreSQL
- The constraint type was fundamentally incompatible with the syntax used

---

## ✅ **SOLUTION: Partial Unique Index**

### What Changed

**Instead of:**
```sql
-- Invalid: Table constraint with WHERE (not supported)
CONSTRAINT unique_pending_invite UNIQUE (invitee_email, status) WHERE status = 'pending'
```

**Use:**
```sql
-- Valid: Partial unique index with WHERE (fully supported)
CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_invites_pending_email 
ON admin_invites(invitee_email, status) 
WHERE status = 'pending';
```

### Why This Works

Partial unique indexes:
- ✅ Are fully supported in PostgreSQL
- ✅ Support `WHERE` clauses for conditional uniqueness
- ✅ Have same effect: enforce uniqueness only where condition is true
- ✅ Better performance: smaller index, faster lookups
- ✅ More flexible: can be dropped/modified independently

### What It Does

```
Before:  Multiple invites with same email + different statuses = ERROR
After:   Multiple invites with same email + different statuses = OK

Pending invites with same email = ERROR (duplicate prevented)
Accepted/Rejected invites with same email = OK (index doesn't apply)
```

---

## 🔧 **How to Apply the Fix**

### Step 1: Verify File is Updated
✅ File already fixed: `SUPABASE_MIGRATION_PHASE1.sql` (lines 25-41)

### Step 2: Copy Fixed Migration

Go to Supabase SQL Editor and paste:
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

CREATE INDEX IF NOT EXISTS idx_admin_invites_status ON admin_invites(status);
CREATE INDEX IF NOT EXISTS idx_admin_invites_invitee_email ON admin_invites(invitee_email);
```

### Step 3: Run in Supabase
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Create new query
3. Copy entire `SUPABASE_MIGRATION_PHASE1.sql`
4. Paste → Click **Run**

Expected result:
```
✅ Query completed successfully
```

---

## 📚 **PostgreSQL Constraint Rules**

### What PostgreSQL Supports

| Feature | Table Constraint | Index |
|---------|-----------------|-------|
| `WHERE` clause | ❌ Not supported | ✅ Supported |
| Partial uniqueness | ❌ Not supported | ✅ Supported |
| Conditional enforcement | ❌ Not supported | ✅ Supported |
| `UNIQUE (col1, col2)` | ✅ Supported | ✅ Supported |
| Drop independently | ❌ Cannot drop | ✅ Can drop |
| Performance tuning | ❌ Limited | ✅ Highly tunable |

### Example: Valid vs Invalid

**INVALID (Table constraint with WHERE):**
```sql
-- ❌ This will fail:
CREATE TABLE invites (
  email VARCHAR,
  status VARCHAR,
  CONSTRAINT unique_pending UNIQUE (email, status) WHERE status = 'pending'
);
```

**VALID (Partial unique index with WHERE):**
```sql
-- ✅ This works:
CREATE TABLE invites (
  email VARCHAR,
  status VARCHAR
);

CREATE UNIQUE INDEX unique_pending 
ON invites(email, status) 
WHERE status = 'pending';
```

---

## 🧪 **Verification**

After migration runs, verify the index was created:

### In Supabase SQL Editor:
```sql
-- Check if partial unique index exists
SELECT 
  indexname, 
  indexdef 
FROM pg_indexes 
WHERE tablename = 'admin_invites' 
AND indexname = 'idx_admin_invites_pending_email';

-- Result should show:
-- idx_admin_invites_pending_email | CREATE UNIQUE INDEX ... WHERE status = 'pending'
```

### Test the uniqueness:
```sql
-- This will work (first pending invite):
INSERT INTO admin_invites (inviter_id, invitee_email, status)
VALUES ('11111111-1111-1111-1111-111111111111', 'test@example.com', 'pending');

-- This will FAIL (duplicate pending with same email):
INSERT INTO admin_invites (inviter_id, invitee_email, status)
VALUES ('22222222-2222-2222-2222-222222222222', 'test@example.com', 'pending');
-- ERROR: duplicate key value violates unique constraint

-- This will work (same email, different status):
INSERT INTO admin_invites (inviter_id, invitee_email, status)
VALUES ('22222222-2222-2222-2222-222222222222', 'test@example.com', 'accepted');
-- SUCCESS (because WHERE status = 'pending' doesn't apply)
```

---

## 🎯 **Why This Approach is Better**

### Advantages of Partial Unique Index vs Constraint

1. **PostgreSQL native** - Fully supported, no workarounds needed
2. **Flexible** - Can modify or drop index without table changes
3. **Performance** - Smaller index = faster lookups, less storage
4. **Explicit** - Clear that uniqueness only applies to pending invites
5. **Future-proof** - Standard PostgreSQL approach

---

## 📋 **Action Checklist**

- [x] **Identified** the PostgreSQL limitation
- [x] **Fixed** the migration file
- [x] **Applied** partial unique index approach
- [x] **Verified** syntax is valid
- [ ] **Run** migration in Supabase
- [ ] **Test** the constraint works
- [ ] **Verify** index is created
- [ ] **Deploy** to production

---

## 💡 **Learning Point**

When you get SQL errors, check:
1. **PostgreSQL documentation** - What does this version support?
2. **Error message** - "syntax error at or near X" means the syntax is invalid
3. **Alternative approaches** - Use indexes instead of constraints for complex logic
4. **Test in small example** - Verify fix before running on full schema

This is why having good documentation and error messages matters!


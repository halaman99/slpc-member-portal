-- ============================================================================
-- PHASE 1 & 2: DATABASE MIGRATION - ADMIN SYSTEM & REALTIME SETUP
-- ============================================================================
-- ✅ COPY & PASTE THIS ENTIRE CONTENT INTO SUPABASE SQL EDITOR
-- ✅ THEN CLICK "RUN"
-- ============================================================================

-- STEP 1: Extend members table with admin fields
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS admin_approved_by UUID REFERENCES members(id) ON DELETE SET NULL;
ALTER TABLE members ADD COLUMN IF NOT EXISTS admin_requested_at TIMESTAMP;
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- STEP 2: Create admin_invites table
CREATE TABLE IF NOT EXISTS admin_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID REFERENCES members(id) ON DELETE CASCADE NOT NULL,
  invitee_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP
);

-- Partial unique index for pending invites only
CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_invites_pending_email 
ON admin_invites(invitee_email, status) WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_admin_invites_status ON admin_invites(status);
CREATE INDEX IF NOT EXISTS idx_admin_invites_invitee_email ON admin_invites(invitee_email);

-- STEP 3: Create audit_log table
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

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);

-- STEP 4: Add soft-delete columns to other tables
ALTER TABLE duties ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE duties ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

ALTER TABLE attendance ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

ALTER TABLE events ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

ALTER TABLE formations ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE formations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

ALTER TABLE member_formations ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE member_formations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

ALTER TABLE announcements ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- ============================================================================
-- MIGRATION COMPLETE ✅
-- ============================================================================
-- You should see "Query executed successfully" at the top
-- 
-- Next steps:
-- 1. Go to Supabase Dashboard → Replication
-- 2. Enable Real-Time for these tables:
--    - members
--    - duties
--    - events
--    - announcements
--    - admin_invites
-- 3. Then deploy code: git push origin main
-- ============================================================================

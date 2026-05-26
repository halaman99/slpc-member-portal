-- ============================================================================
-- PHASE 1 & 2: DATABASE MIGRATION - ADMIN SYSTEM & REALTIME SETUP
-- ============================================================================
-- RUN THIS IN SUPABASE SQL EDITOR TO:
-- 1. Add admin role columns to members
-- 2. Create admin_invites table
-- 3. Create audit_log table
-- 4. Add soft-delete flags to tables
-- 5. Add updated_at timestamps
-- ============================================================================

-- STEP 1: Extend members table with admin fields
-- ============================================================================
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS admin_approved_by UUID REFERENCES members(id) ON DELETE SET NULL;
ALTER TABLE members ADD COLUMN IF NOT EXISTS admin_requested_at TIMESTAMP;
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

-- Add updated_at if not exists (for tracking changes)
ALTER TABLE members ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- ============================================================================
-- STEP 2: Create admin_invites table (for admin promotion workflow)
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID REFERENCES members(id) ON DELETE CASCADE NOT NULL,
  invitee_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, rejected
  created_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP
);

-- Partial unique index: Only enforce uniqueness on pending invites
-- (PostgreSQL supports WHERE in indexes, not in table constraints)
CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_invites_pending_email 
ON admin_invites(invitee_email, status) 
WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_admin_invites_status ON admin_invites(status);
CREATE INDEX IF NOT EXISTS idx_admin_invites_invitee_email ON admin_invites(invitee_email);

-- ============================================================================
-- STEP 3: Create audit_log table (track all data changes)
-- ============================================================================
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

-- ============================================================================
-- STEP 4: Add soft-delete columns to other tables
-- ============================================================================
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
-- STEP 5: Update RLS policies to include admin checks
-- ============================================================================

-- Allow admins to view all members
CREATE POLICY "Admins can view all members"
  ON members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid() AND members.is_admin = TRUE AND members.is_deleted = FALSE
    )
  );

-- Allow admins to update any member
CREATE POLICY "Admins can update any member"
  ON members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid() AND members.is_admin = TRUE AND members.is_deleted = FALSE
    )
  );

-- Allow admins to delete members (soft delete)
CREATE POLICY "Admins can soft-delete members"
  ON members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid() AND members.is_admin = TRUE AND members.is_deleted = FALSE
    )
  )
  WITH CHECK (is_deleted = TRUE);

-- ============================================================================
-- STEP 6: Create trigger to auto-update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_duties_updated_at BEFORE UPDATE ON duties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_formations_updated_at BEFORE UPDATE ON formations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 7: Enable Realtime on critical tables
-- ============================================================================
-- Run this command in Supabase Dashboard > Realtime > Update RLS policies
-- Or use: ALTER PUBLICATION supabase_realtime ADD TABLE members, duties, events, announcements;

-- For now, just ensure these tables exist with proper indexes for realtime
CREATE INDEX IF NOT EXISTS idx_members_updated_at ON members(updated_at);
CREATE INDEX IF NOT EXISTS idx_duties_updated_at ON duties(updated_at);
CREATE INDEX IF NOT EXISTS idx_events_updated_at ON events(updated_at);

-- ============================================================================
-- ⚠️ IMPORTANT: MANUAL STEPS AFTER RUNNING THIS MIGRATION
-- ============================================================================
-- 1. Go to Supabase Dashboard > Realtime tab
-- 2. Find "Replication" section and enable it for:
--    - members
--    - duties
--    - events
--    - announcements
--    - admin_invites
--
-- 3. Set first admin (replace YOUR_USER_ID with actual ID):
--    UPDATE members 
--    SET is_admin = TRUE, admin_approved_by = id 
--    WHERE email = 'smigoal.lul@gmail.com';
--
-- 4. Delete all sample data:
--    DELETE FROM announcements;
--    DELETE FROM member_formations;
--    DELETE FROM formations;
--    DELETE FROM events;
--    DELETE FROM duties;
--
-- 5. Keep only real members:
--    DELETE FROM members WHERE email NOT IN (
--      SELECT email FROM auth.users
--    );
-- ============================================================================

-- ============================================================================
-- VERIFICATION QUERIES (run after migration to confirm)
-- ============================================================================
-- Check new columns exist:
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'members' ORDER BY column_name;
--
-- Check admin_invites table:
-- SELECT * FROM admin_invites LIMIT 5;
--
-- Check audit_log table:
-- SELECT * FROM audit_log LIMIT 5;
--
-- Count members:
-- SELECT COUNT(*) FROM members WHERE is_deleted = FALSE;
--
-- Count admins:
-- SELECT COUNT(*) FROM members WHERE is_admin = TRUE AND is_deleted = FALSE;
-- ============================================================================

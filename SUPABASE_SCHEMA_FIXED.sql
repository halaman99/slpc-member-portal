-- ============================================================================
-- ST. LODOVICO PAVONI MEMBER PORTAL - COMPLETE FIXED SCHEMA
-- ============================================================================

-- Drop existing tables with CASCADE to clear all dependencies
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS member_formations CASCADE;
DROP TABLE IF EXISTS formations CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS duties CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS members CASCADE;

-- ============================================================================
-- Create members table (with RLS for security)
-- ============================================================================
CREATE TABLE members (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(100) DEFAULT 'Member',
  avatar_initials VARCHAR(3),
  avatar_color VARCHAR(50),
  attendance_rate INTEGER DEFAULT 0,
  badges_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security on members table
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own member profile
CREATE POLICY "Users can view own member profile"
  ON members FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update own profile
CREATE POLICY "Users can update own member profile"
  ON members FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- Create duties table
-- ============================================================================
CREATE TABLE duties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(50),
  mass_type VARCHAR(100),
  role VARCHAR(100),
  status VARCHAR(50) DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_duties_member_id ON duties(member_id);
CREATE INDEX idx_duties_date ON duties(date);

-- ============================================================================
-- Create attendance table
-- ============================================================================
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'absent',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_attendance_member_id ON attendance(member_id);

-- ============================================================================
-- Create events table
-- ============================================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  location VARCHAR(255),
  event_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_date ON events(date);

-- ============================================================================
-- Create formations table
-- ============================================================================
CREATE TABLE formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_type VARCHAR(50),
  file_url VARCHAR(500),
  duration VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- Create member_formations table
-- ============================================================================
CREATE TABLE member_formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE NOT NULL,
  formation_id UUID REFERENCES formations(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- Create announcements table
-- ============================================================================
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  category VARCHAR(50),
  created_by UUID REFERENCES members(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_announcements_created_at ON announcements(created_at);

-- ============================================================================
-- Insert sample data - FORMATIONS
-- ============================================================================
INSERT INTO formations (title, description, file_type, duration) VALUES
  ('Vestment Guide', 'Comprehensive guide to proper ecclesiastical vestments', 'pdf', '3 hours'),
  ('Roman Rite Basics', 'Introduction to the Traditional Latin Mass', 'video', '8 hours'),
  ('Sacred Movements', 'Proper posture and movement during liturgy', 'doc', '2 hours'),
  ('Prayers & Responses', 'Essential liturgical prayers and responses', 'pdf', '5 hours'),
  ('Holy Week Procedures', 'Special protocols for Holy Week services', 'pdf', '3.5 hours'),
  ('Sacramental Principles', 'Theological foundations of sacraments', 'doc', '6 hours');

-- ============================================================================
-- Insert sample data - EVENTS
-- ============================================================================
INSERT INTO events (title, date, description, location, event_type) VALUES
  ('Pentecost Celebration', '2026-06-08', 'Major feast day celebration', 'Main Church', 'feast'),
  ('Summer Retreat', '2026-07-15', 'Three-day spiritual retreat', 'St. Catherine Retreat Center', 'recollection'),
  ('Corpus Christi Procession', '2026-06-18', 'Annual outdoor procession', 'Downtown to Church', 'feast'),
  ('Servers Training Workshop', '2026-05-31', 'Advanced techniques for liturgical service', 'Church Sacristy', 'training');

-- ============================================================================
-- Insert sample data - ANNOUNCEMENTS
-- ============================================================================
INSERT INTO announcements (title, message, category) VALUES
  ('Summer Schedule Now Available', 'The summer mass schedule has been posted.', 'info'),
  ('Pentecost Volunteers Needed', 'We are looking for volunteers to help with the Pentecost celebration.', 'event'),
  ('New Formation Materials', 'Advanced liturgical techniques course is now available.', 'info');

-- ============================================================================
-- IMPORTANT: Create member records for test accounts
-- ============================================================================
-- Run this SQL AFTER you create accounts in Supabase
-- Replace UUIDs with actual user IDs from auth.users table

-- First, check your users:
-- SELECT id, email FROM auth.users;

-- Then insert members (example - update with YOUR actual user IDs):
-- INSERT INTO members (id, email, full_name, role, avatar_initials, attendance_rate, badges_earned) VALUES
--   ('UUID_FROM_AUTH_USERS', 'your@email.com', 'Your Name', 'Member', 'YN', 0, 0);

-- ============================================================================
-- FINISH: Create sample duties if you have member IDs
-- ============================================================================
-- After creating member records, add sample duties
-- SELECT id FROM members LIMIT 1; -- Get a member ID first
-- Then:
-- INSERT INTO duties (member_id, date, time, mass_type, role, status) VALUES
--   ('MEMBER_ID_HERE', '2026-05-25', '8:00 AM', 'Solemn Parish Mass', 'Head Server', 'scheduled');

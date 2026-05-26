-- St. Lodovico Pavoni Member Portal - Complete SQL Schema
-- Copy and paste this entire file into Supabase SQL Editor

-- ============================================================================
-- 1. MEMBERS TABLE - Core member information
-- ============================================================================
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  avatar_initials VARCHAR(3),
  avatar_color VARCHAR(50),
  attendance_rate INTEGER DEFAULT 0,
  badges_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 2. DUTIES TABLE - Mass assignments and duties
-- ============================================================================
CREATE TABLE duties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time VARCHAR(50),
  mass_type VARCHAR(100),
  role VARCHAR(100),
  status VARCHAR(50) CHECK (status IN ('scheduled', 'served', 'absent', 'late', 'standby')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 3. ATTENDANCE TABLE - Attendance tracking
-- ============================================================================
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  duty_id UUID REFERENCES duties(id) ON DELETE CASCADE,
  status VARCHAR(50) CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 4. EVENTS TABLE - Church events and celebrations
-- ============================================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  location VARCHAR(255),
  event_type VARCHAR(50) CHECK (event_type IN ('feast', 'training', 'recollection', 'outreach')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 5. FORMATIONS TABLE - Training materials and resources
-- ============================================================================
CREATE TABLE formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_type VARCHAR(50) CHECK (file_type IN ('pdf', 'video', 'doc')),
  file_url VARCHAR(500),
  duration VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 6. MEMBER FORMATIONS TABLE - Tracks member progress on formations
-- ============================================================================
CREATE TABLE member_formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  formation_id UUID REFERENCES formations(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 7. ANNOUNCEMENTS TABLE - Portal announcements and updates
-- ============================================================================
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  category VARCHAR(50) CHECK (category IN ('urgent', 'event', 'info', 'request')),
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES members(id) ON DELETE SET NULL
);

-- ============================================================================
-- INDEXES - Performance optimization
-- ============================================================================
CREATE INDEX idx_duties_member_id ON duties(member_id);
CREATE INDEX idx_duties_date ON duties(date);
CREATE INDEX idx_attendance_member_id ON attendance(member_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_announcements_created_at ON announcements(created_at);
CREATE INDEX idx_member_formations_member_id ON member_formations(member_id);

-- ============================================================================
-- SAMPLE DATA - Insert test data
-- ============================================================================

-- Insert sample members
INSERT INTO members (email, full_name, role, avatar_initials, attendance_rate, badges_earned)
VALUES
  ('jose.reyes@example.com', 'Jose Reyes', 'Head Server', 'JR', 98, 3),
  ('michael.santos@example.com', 'Michael Santos', 'Senior Server', 'MS', 95, 2),
  ('david.lopez@example.com', 'David Lopez', 'Senior Server', 'DL', 92, 2),
  ('carlos.rivera@example.com', 'Carlos Rivera', 'Server', 'CR', 89, 1),
  ('pablo.martinez@example.com', 'Pablo Martinez', 'Server in Training', 'PM', 100, 0);

-- Insert sample formations
INSERT INTO formations (title, description, file_type, duration)
VALUES
  ('Vestment Guide', 'Comprehensive guide to proper ecclesiastical vestments', 'pdf', '3 hours'),
  ('Roman Rite Basics', 'Introduction to the Traditional Latin Mass', 'video', '8 hours'),
  ('Sacred Movements', 'Proper posture and movement during liturgy', 'doc', '2 hours'),
  ('Prayers & Responses', 'Essential liturgical prayers and responses', 'pdf', '5 hours'),
  ('Holy Week Procedures', 'Special protocols for Holy Week services', 'pdf', '3.5 hours'),
  ('Sacramental Principles', 'Theological foundations of sacraments', 'doc', '6 hours');

-- Insert sample events
INSERT INTO events (title, date, description, location, event_type)
VALUES
  ('Pentecost Celebration', '2026-06-08', 'Major feast day celebration with special liturgy and fellowship', 'Main Church & Parish Hall', 'feast'),
  ('Summer Retreat', '2026-07-15', 'Three-day spiritual retreat with workshops and meditation', 'St. Catherine Retreat Center', 'recollection'),
  ('Corpus Christi Procession', '2026-06-18', 'Annual outdoor procession through city streets', 'Downtown to Church', 'feast'),
  ('Servers Training Workshop', '2026-05-31', 'Advanced techniques for liturgical service', 'Church Sacristy', 'training');

-- Insert sample announcements
INSERT INTO announcements (title, message, category)
VALUES
  ('Summer Schedule Now Available', 'The summer mass schedule has been posted. Please review your assignments.', 'info'),
  ('Pentecost Volunteers Needed', 'We are looking for volunteers to help with the Pentecost celebration.', 'event'),
  ('New Formation Materials', 'Advanced liturgical techniques course is now available.', 'info');

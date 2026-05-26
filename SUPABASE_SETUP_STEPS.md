# Supabase Setup Guide - St. Lodovico Pavoni Portal

## Step 1: Create Supabase Account & Project

1. Go to **https://supabase.com**
2. Click **"Start your project for free"**
3. Sign up with Google, GitHub, or email
4. Create a new project:
   - **Project Name**: `slpc-member-portal`
   - **Database Password**: Save this securely!
   - **Region**: Choose closest to your location (e.g., us-east-1)
5. Wait for project initialization (2-3 minutes)

## Step 2: Get Your API Credentials

After project is created, go to **Settings → API**:
- Copy **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon public key** → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Example:
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## Step 3: Create Database Tables

1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy and paste the SQL below (complete schema)
4. Click **Run** to create all tables

### Complete SQL Schema

```sql
-- Members Table
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

-- Duties Table
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

-- Attendance Table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  duty_id UUID REFERENCES duties(id) ON DELETE CASCADE,
  status VARCHAR(50) CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events Table
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

-- Formations Table
CREATE TABLE formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_type VARCHAR(50) CHECK (file_type IN ('pdf', 'video', 'doc')),
  file_url VARCHAR(500),
  duration VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Member Formations (many-to-many)
CREATE TABLE member_formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  formation_id UUID REFERENCES formations(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Announcements Table
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  category VARCHAR(50) CHECK (category IN ('urgent', 'event', 'info', 'request')),
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES members(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_duties_member_id ON duties(member_id);
CREATE INDEX idx_duties_date ON duties(date);
CREATE INDEX idx_attendance_member_id ON attendance(member_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_announcements_created_at ON announcements(created_at);
```

## Step 4: Populate Sample Data

Run this in a new SQL Query to add sample data:

```sql
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

-- Insert sample duties
INSERT INTO duties (member_id, date, time, mass_type, role, status)
SELECT id, '2026-05-25', '06:00 AM', 'Sunday Dawn Mass', 'Primary Server', 'scheduled'
FROM members WHERE email = 'jose.reyes@example.com'
UNION ALL
SELECT id, '2026-05-25', '08:00 AM', 'Sunday Solemn Mass', 'Assistant Server', 'scheduled'
FROM members WHERE email = 'jose.reyes@example.com'
UNION ALL
SELECT id, '2026-05-28', '06:00 PM', 'Weekday Mass', 'Primary Server', 'scheduled'
FROM members WHERE email = 'jose.reyes@example.com'
UNION ALL
SELECT id, '2026-05-30', '06:30 PM', 'Votive Mass', 'Assistant Server', 'scheduled'
FROM members WHERE email = 'jose.reyes@example.com';

-- Insert sample announcements
INSERT INTO announcements (title, message, category, created_by)
SELECT
  'Summer Schedule Now Available',
  'The summer mass schedule for June through August has been posted. Please review your assignments and confirm your availability.',
  'info',
  id
FROM members WHERE email = 'jose.reyes@example.com'
UNION ALL
SELECT
  'Pentecost Celebration - Volunteers Needed',
  'We are looking for volunteers to help with the Pentecost celebration on June 8th.',
  'event',
  id
FROM members WHERE email = 'jose.reyes@example.com'
UNION ALL
SELECT
  'New Formation Materials Available',
  'Advanced liturgical techniques course is now available in the Formation section.',
  'info',
  id
FROM members WHERE email = 'jose.reyes@example.com';
```

## Step 5: Update Environment Variables

Update `d:\SLPC-MAS\app\.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with values from Step 2.

## Step 6: Test Connection

1. Keep your dev server running (or restart it)
2. Open http://localhost:3000/dashboard
3. Check browser console (F12) for any errors
4. If you see no errors, connection is successful!

## Step 7: Enable Row Level Security (RLS) - Optional but Recommended

For production, enable RLS:

1. Go to **Authentication → Policies** in Supabase
2. For each table, create RLS policies
3. This controls who can access what data

## ✅ You're Done with Supabase Setup!

Your database is now connected. The next step is to **connect real data** by replacing mock data with actual database queries.

## 📝 Next Steps

Once confirmed working:
1. Update pages to fetch real data from Supabase
2. Add authentication (login/signup)
3. Deploy to Vercel

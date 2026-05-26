# 🚀 VERCEL DEPLOYMENT - LOGIN FIX CHECKLIST

## ⚠️ YOUR SETUP

- ✅ Website: Production on Vercel
- ✅ Database: Supabase (live)
- ✅ Login: Broken (not redirecting to dashboard)

---

## 🔧 STEP 1: Update Code on GitHub

You need to push the **fixed login code** to your GitHub repo.

### Option A: Using Git Terminal
```bash
cd d:\SLPC-MAS\app

# Check what changed
git status

# Stage all changes
git add .

# Commit with message
git commit -m "Fix login logic and database schema for member authentication"

# Push to GitHub
git push origin main
```

### Option B: Using GitHub Web
1. Go to: https://github.com/your-repo
2. Upload new files manually
3. Or use GitHub Desktop app

---

## 🔧 STEP 2: Verify Vercel Deployment

After pushing to GitHub:

1. Go to: https://vercel.com/dashboard
2. Find your project
3. Look for **Deployments** tab
4. Should see new deployment starting
5. Wait for **READY** status (green checkmark)

**Typical:** Takes 2-5 minutes

---

## 🔧 STEP 3: Verify Environment Variables in Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Click: **Settings** tab
4. Click: **Environment Variables**
5. Verify these exist:
```
NEXT_PUBLIC_SUPABASE_URL = https://lgktylgxcfpfshkixdur.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
NEXT_PUBLIC_SITE_NAME = St. Lodovico Pavoni Member Portal
NEXT_PUBLIC_SITE_URL = https://your-vercel-domain.vercel.app
```

If **missing**, add them:
- Click: **Add New**
- Name: (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
- Value: (e.g., `https://lgktylgxcfpfshkixdur.supabase.co`)
- Click: **Save**

After adding ANY env var → **Redeploy** (see Step 2)

---

## 🔧 STEP 4: Update Supabase Schema (CRITICAL)

Your **Supabase database must be updated** with the new schema.

Go to: https://supabase.com/dashboard

Select your project → **SQL Editor** → **New Query**

Paste the COMPLETE FIXED SCHEMA:

```sql
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
```

Click **RUN**

---

## 🔧 STEP 5: Confirm Existing Users

For each user that tried to sign up on production:

Go to Supabase → **Auth** → **Users**

Find your test user, get their **UUID (id)**

Then go to **SQL Editor** and run:

```sql
-- Confirm their email
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'their@email.com';

-- Create member record
INSERT INTO members (id, email, full_name, role, avatar_initials, attendance_rate, badges_earned) 
VALUES (
  'THEIR_UUID_HERE',
  'their@email.com',
  'Their Name',
  'Member',
  'TN',
  0,
  0
);
```

---

## ✅ STEP 6: Test on Vercel

Go to your **Vercel URL** (e.g., https://slpc-member-portal.vercel.app)

1. Try to **sign in** with your test account
2. Should redirect to **DASHBOARD** ✅
3. Should show **your name** ✅

---

## 🎯 QUICK CHECKLIST

- [ ] Code pushed to GitHub
- [ ] Vercel shows **READY** deployment
- [ ] Environment variables verified in Vercel
- [ ] Supabase schema updated (new members table)
- [ ] User email confirmed in Supabase
- [ ] Member record created in Supabase
- [ ] Test login on Vercel URL
- [ ] Dashboard shows real data

---

## 🆘 IF STILL NOT WORKING

### Check 1: Is deployment actually updated?
Go to: https://vercel.com/dashboard
- Click project
- Click **Deployments**
- Is it **READY**? (Green checkmark)
- If not: Wait or click **Redeploy**

### Check 2: Are environment variables correct?
Go to: https://vercel.com/dashboard
- Click project
- Click **Settings** → **Environment Variables**
- Do you see your Supabase URL?
- Do you see your API key?
- If not: Add them

### Check 3: Is member record created?
Go to: https://supabase.com/dashboard
- Click your project
- Click **Table Editor**
- Click **members** table
- Do you see a row with your email?
- If not: Create it with SQL

### Check 4: Is email confirmed?
Go to: https://supabase.com/dashboard
- Click **Auth** → **Users**
- Find your user
- Does it show a ✅ or date in "Email Confirmed At" column?
- If not: Run UPDATE SQL to confirm

---

## 📞 FINAL STEPS

1. **Tell me:**
   - Your Vercel project URL
   - Your test email address
   - What error you see (if any)

2. **I'll:**
   - Help debug the specific issue
   - Give you exact SQL to run
   - Verify everything works

---

**Let me know the status and I'll help you finish! 🚀**

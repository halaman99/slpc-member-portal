# ✅ Supabase Setup Checklist

Follow these steps in order to get your portal connected to Supabase.

## 🔴 STEP 1: Create Supabase Account (5 minutes)
- [ ] Go to https://supabase.com
- [ ] Click "Start your project for free"
- [ ] Sign up with Google, GitHub, or email
- [ ] Create new project:
  - Name: `slpc-member-portal`
  - Save the database password securely!
  - Region: Choose closest to you
- [ ] Wait for initialization (2-3 minutes)

---

## 🟠 STEP 2: Get API Credentials (2 minutes)
After project is created:
- [ ] Go to **Settings → API** (left sidebar)
- [ ] Find **Project URL** 
  - Looks like: `https://abcdefgh.supabase.co`
  - Copy this entire URL
- [ ] Find **anon public key** 
  - Looks like: `eyJhbGc...` (long string)
  - Copy this entire key
- [ ] Save both values somewhere safe (notepad)

---

## 🟡 STEP 3: Create Database Tables (5 minutes)
- [ ] In Supabase dashboard, go to **SQL Editor** (left sidebar)
- [ ] Click **New Query**
- [ ] Open file: `d:\SLPC-MAS\SUPABASE_SCHEMA.sql`
- [ ] Copy the ENTIRE SQL content
- [ ] Paste into Supabase SQL Editor
- [ ] Click **Run** button (blue button, top-right)
- [ ] Wait for "Success" message
  - If you see errors about tables already existing, that's OK - just means you ran it twice
- [ ] Refresh the page to see new tables

---

## 🟢 STEP 4: Verify Tables Created (2 minutes)
- [ ] In Supabase, go to **Table Editor** (left sidebar)
- [ ] You should see these tables:
  - [ ] members
  - [ ] duties
  - [ ] attendance
  - [ ] events
  - [ ] formations
  - [ ] member_formations
  - [ ] announcements
- [ ] Click each table to see sample data populated

---

## 🔵 STEP 5: Update Environment Variables (3 minutes)
- [ ] Open file: `d:\SLPC-MAS\app\.env.local`
- [ ] Replace `NEXT_PUBLIC_SUPABASE_URL` with your Project URL from Step 2
- [ ] Replace `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your anon key from Step 2
- [ ] Example (yours will be different):
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
  ```
- [ ] Save the file

---

## 🟣 STEP 6: Restart Development Server (2 minutes)
- [ ] Stop the dev server (Ctrl+C in terminal)
- [ ] Restart it:
  ```
  cd d:\SLPC-MAS\app
  npm run dev
  ```
- [ ] Wait for "Ready in XXX ms" message
- [ ] Open http://localhost:3000 in browser

---

## ⚫ STEP 7: Test Connection (2 minutes)
- [ ] Open browser: http://localhost:3000/dashboard
- [ ] Press F12 to open Developer Console
- [ ] Look for any red errors
- [ ] If no errors → **SUCCESS! ✅**
- [ ] If errors → Check:
  - Did you update .env.local correctly?
  - Did you restart the dev server?
  - Are your credentials correct?

---

## 🎉 All Done!

**Total time: ~20-30 minutes**

Your portal is now:
- ✅ Running on localhost:3000
- ✅ Connected to Supabase
- ✅ Has all database tables
- ✅ Has sample data
- ✅ Ready for real data connection

**What's next?**
The next phase is to update the pages to use **real database data** instead of mock data. This will make the portal fully functional.

---

## 📞 Troubleshooting

### Issue: "Cannot find module @supabase/supabase-js"
**Solution:** The module is already installed from npm, but restart dev server

### Issue: "Invalid API key"
**Solution:** Check that you copied the `anon public key`, not the `service_role` key

### Issue: "Connection refused"
**Solution:** Make sure Supabase project fully initialized (wait longer if needed)

### Issue: "Tables already exist"
**Solution:** This is OK! Just means SQL ran successfully before. Don't worry.

---

## ✨ Files You'll Need

1. `d:\SLPC-MAS\SUPABASE_SCHEMA.sql` - SQL to create tables
2. `d:\SLPC-MAS\app\.env.local` - Credentials file to update
3. `d:\SLPC-MAS\SUPABASE_SETUP_STEPS.md` - Detailed guide (this file)

Done! Come back when you have your credentials and I'll help verify everything works. 🚀

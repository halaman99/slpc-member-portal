# ⚡ Quick Start: 5 Minutes to Login

## Step 1: Start Server (2 min)
```bash
cd d:\SLPC-MAS\app
npm run dev
```

Wait for: `▲ Ready in XXX ms`

## Step 2: Open Browser (1 min)
Go to: **http://localhost:3000**

Should see login page.

## Step 3: Create Account (1 min)
1. Click "Create account"
2. Fill in:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `TestPassword123`
3. Click "Create account"

## Step 4: Confirm Email (1 min)

### Quick Way (Development)
Open **new browser tab** and paste:
```
https://lgktylgxcfpfshkixdur.supabase.co/auth/v1/admin
```

Actually, easier: Use **Supabase Dashboard**:
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click "Auth" → "Users" 
4. Find your test user
5. Click the "..." menu
6. Click "Confirm user"

### Or: Use SQL
Go to Supabase → SQL Editor, paste:
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'test@example.com';
```

## Step 5: Login (0 min)
1. Go back to login page
2. Enter: `test@example.com` / `TestPassword123`
3. Click "Sign in"

**✅ You're in the dashboard!**

---

## 🎉 What You'll See

- Your test user name at the top
- Member profile data (duties, events, etc.)
- "Sign out" button in sidebar

---

## ❌ If It Doesn't Work

### Error: "Invalid credentials"
- Did you confirm your email? (Check step 4)

### Error: "Member profile not found"
- Need to add your user to members table:

Go to Supabase → SQL Editor:
```sql
-- First, get your user ID from Auth → Users, copy the UUID
INSERT INTO members (id, email, full_name, role) 
VALUES (
  'PASTE_YOUR_UUID_HERE',
  'test@example.com',
  'Test User',
  'Member'
);
```

### Says "Loading..." forever
- Check browser console: `F12 → Console tab`
- Look for red errors
- Likely: `.env.local` credentials wrong

### "Cannot connect to Supabase"
```bash
# Test it:
node test-auth.js

# Check if this fails - if so, .env.local is wrong
```

---

## 🧪 Test the Full Flow

```
✅ Login works
✅ Dashboard shows your name
✅ Click "Sign out" in sidebar
✅ Get redirected to login
✅ Can't access /dashboard without logging in
```

All passing? **System works!** 🎉

---

## 📚 Full Docs

If you need more details:
- **`TROUBLESHOOTING.md`** - Detailed troubleshooting
- **`LOGIN_SETUP_COMPLETE.md`** - Complete feature list
- **`PORTAL_SETUP_GUIDE.md`** - Architecture overview

---

## 🚀 Ready for Production?

1. Test a few more accounts to be sure
2. Populate real member data in Supabase
3. Deploy to Vercel (just push to GitHub)
4. Update environment variables in Vercel dashboard
5. Set up email confirmations (optional but recommended)

That's it! Your portal has a **production-ready login system**. 🎊

# 🔧 Login Troubleshooting Guide

## Quick Diagnosis

### Step 1: Verify Supabase Connection
```bash
cd d:\SLPC-MAS\app
node test-auth.js
```

**Expected Output:**
```
✅ Connected to Supabase
✅ members: OK
✅ Found X member(s)
```

**If it fails:**
- Check `.env.local` has correct credentials
- Verify Supabase project is active
- Restart dev server after fixing .env.local

---

### Step 2: Start Dev Server
```bash
npm run dev
```

**Look for errors in terminal** - copy-paste them below

---

### Step 3: Test in Browser (http://localhost:3000)

#### 🟢 Scenario A: Redirects to login ✅ GOOD
- Fresh browser → should go to login
- This means middleware is working

#### 🔴 Scenario B: Shows "Loading..." then disconnects
- Check browser DevTools Console (F12)
- Look for red errors
- Common: "Invalid API key" → fix .env.local

#### 🔴 Scenario C: Login form appears but stuck after submit
- DevTools → Network tab
- Look for `POST /auth/v1/token` request
- Response should show error or success
- Common errors:
  - `invalid_credentials` → check if user exists
  - `email_not_confirmed` → confirm email first
  - `401 Unauthorized` → check API key

---

## Common Issues & Fixes

### ❌ "Invalid API key"
**Cause:** Wrong credentials in .env.local
**Fix:**
```bash
# In .env.local, ensure:
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY

# NOT the service_role key!
```
Then: `npm run dev` (restart server)

---

### ❌ "Email not confirmed"
**Cause:** User signed up but didn't confirm email
**Fix:**
1. Check spam folder for confirmation email
2. In Supabase Dashboard → SQL Editor, run:
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'your@email.com';
```
3. Try logging in again

---

### ❌ "Member profile not found"
**Cause:** User exists in auth but not in members table
**Fix:**
1. When user signs up, manually add to members table
2. Or, update signup to auto-create member record (todo)

```sql
-- Manually insert member for testing
INSERT INTO members (id, email, full_name, role) 
VALUES (
  'USER_UUID_FROM_AUTH_TABLE',
  'user@email.com',
  'Full Name',
  'Member'
);
```

---

### ❌ "Stuck on loading after login"
**Cause:** Dashboard data query failed
**Fix:**
1. Check browser console for errors
2. Go to Supabase Dashboard → SQL Editor
3. Verify all tables have sample data:
```sql
SELECT COUNT(*) FROM members;
SELECT COUNT(*) FROM duties;
SELECT COUNT(*) FROM events;
SELECT COUNT(*) FROM formations;
```

---

### ❌ "Logout doesn't work"
**Status:** Fixed ✅
- Logout button now properly calls signOut()
- Clears session and redirects to login

---

### ❌ "Can't access dashboard even when logged in"
**Cause:** Middleware cookie not detected
**Fix:**
1. Check DevTools → Application → Cookies
2. Look for `sb-lgktylgxcfpfshkixdur-auth-token`
3. If missing: likely auth failed silently
4. Check browser console for errors

---

## Full Auth Flow Test

1. **Fresh browser session**
   ```
   - Open http://localhost:3000
   - Should redirect to http://localhost:3000/auth/login
   ```

2. **Create new account**
   ```
   - Click "Create account"
   - Fill: Full name, email, password
   - Should show "Check your email" message
   ```

3. **Confirm email** (development)
   - Check Supabase Dashboard → Auth → Users
   - Find your test user
   - Click the verification email link OR
   - Use SQL: UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'test@example.com'

4. **Login**
   ```
   - Go to login page
   - Enter credentials
   - Should redirect to /dashboard
   - Should show your name and real data
   ```

5. **Dashboard should show:**
   - ✅ Your name (from auth.user_metadata.full_name)
   - ✅ Your duties (from members → duties join)
   - ✅ Events, formations, announcements
   - ✅ Logout button in sidebar

6. **Logout**
   ```
   - Click "Sign out" in sidebar
   - Should redirect to login
   - Accessing /dashboard should redirect to /auth/login
   ```

---

## Debug Endpoints

### Check Auth Status
```javascript
// Browser Console (F12)
const { data } = await (await fetch('/api/auth/session')).json()
console.log(data)
```

### Test Database Connection
```javascript
// Browser Console
fetch('http://localhost:3000/api/test-db')
  .then(r => r.json())
  .then(console.log)
```

---

## Files Modified

- ✅ `components/Sidebar.tsx` - Added logout button
- ✅ `contexts/AuthContext.tsx` - Better error handling
- ✅ `lib/auth-guard.tsx` - New route protection wrapper
- ✅ `test-auth.js` - Supabase connection test
- ✅ `middleware.ts` - Already working ✅

---

## Next: If Still Broken

If you're still having issues:

1. **Share browser console errors** (F12 → Console tab, red errors)
2. **Share network response** (F12 → Network → find auth request → Response tab)
3. **Check Supabase logs** (Dashboard → Logs)
4. **Verify tables exist** (Dashboard → Table Editor)

---

## Production Deployment

Before deploying to production:

```bash
npm run build
npm start
```

Test in production mode, then deploy to Vercel:
- Push to GitHub
- Vercel auto-deploys
- Update environment variables in Vercel dashboard

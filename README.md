# St. Lodovico Pavoni - Member Portal

A modern, production-ready member portal built with Next.js, TypeScript, Supabase, and Tailwind CSS.

## Features

### ✅ Completed
- **8 Feature Pages**: Dashboard, Schedule, Attendance, Formation, Events, Members, Announcements, Settings
- **Authentication**: Full sign-up, login, forgot password flow with Supabase
- **Authorization**: Route protection middleware - unauthenticated users redirected to login
- **Real-time Data**: Supabase PostgreSQL with 7 tables and sample data
- **Dark Theme**: Custom color scheme with gold accents
- **Responsive Design**: Mobile-optimized with Tailwind CSS
- **TypeScript**: Full type safety with generated Supabase types

## Quick Start - Local Development

```bash
# Install dependencies
npm install

# Set up environment variables (.env.local):
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_NAME=St. Lodovico Pavoni
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Start development server
npm run dev

# Visit http://localhost:3000
```

## Deploy to Vercel (3 Steps)

**Step 1: Create GitHub Repository**
- Go to github.com/new
- Create `slpc-member-portal` repo (public)

**Step 2: Push Code**
```bash
git remote add origin https://github.com/YOUR-USERNAME/slpc-member-portal.git
git branch -M main
git push -u origin main
```

**Step 3: Deploy on Vercel**
1. Visit vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. Add Environment Variables (same as .env.local)
5. Click Deploy
6. Live in 2-3 minutes! 🎉

## Tech Stack

- **Frontend**: Next.js 16.2.6, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (email/password)
- **Deployment**: Vercel

## Project Pages

- **Dashboard**: Overview with stats and announcements
- **Schedule**: Upcoming duties calendar
- **Attendance**: Attendance tracking and history
- **Formation**: Sacrament materials and progress
- **Events**: Church events calendar
- **Members**: Member directory
- **Announcements**: Church announcements feed
- **Settings**: User profile and logout
- **Auth**: Login, signup, forgot password pages

## Authentication

- Sign up with email, password, full name
- Login with email/password
- Forgot password recovery
- Protected routes (redirect to login if not authenticated)
- Remember me checkbox on login
- Secure JWT tokens in cookies

## Database

7 PostgreSQL tables:
- members, duties, attendance, events, formations, member_formations, announcements

Sample data included for testing.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm start        # Start prod server
npm run lint     # Check code quality
```

## Troubleshooting

**Deployment fails?**
- Verify env variables in Vercel dashboard
- Check Node version (18+) in Vercel settings
- Ensure GitHub repo is public

**Login issues?**
- Clear browser cookies
- Restart dev server
- Check .env.local is in correct folder (d:\SLPC-MAS\app)

**Can't connect to Supabase?**
- Check URL doesn't include `/rest/v1/`
- Verify ANON_KEY is set
- Test Supabase connection in browser console

## Support

Questions? Email: admin@pavoni.local

© 2026 St. Lodovico Pavoni. All rights reserved.

**Status**: ✅ Production Ready

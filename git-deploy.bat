@echo off
REM Initialize git repository and push to GitHub

cd /d d:\SLPC-MAS

REM Check if .git exists
if not exist ".git" (
    echo ✅ Initializing Git repository...
    git init
    git remote add origin https://github.com/halaman99/slpc-member-portal.git
    echo ✅ Git initialized!
)

echo.
echo ✅ Adding all files...
git add -A

echo.
echo ✅ Creating commit...
git commit -m "Phase 3: Admin Portal Complete - Real-time dashboard, members/duties/events managers, admin requests, member directory"

echo.
echo ✅ Pushing to GitHub...
git push -u origin main

echo.
echo ✅ DONE! Deployment pushed to GitHub
echo.
echo Next: Wait 2-5 minutes for Vercel to auto-deploy
echo Check: https://vercel.com to see deployment progress

pause

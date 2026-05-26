@echo off
REM Deploy fix to Vercel - force sync and push
cd /d "d:\SLPC-MAS\app"

echo ===== GIT STATUS =====
git status

echo.
echo ===== PULLING REMOTE CHANGES =====
git pull origin main --no-edit --allow-unrelated-histories

echo.
echo ===== ADDING ALL CHANGES =====
git add .

echo.
echo ===== COMMITTING =====
git commit -m "Fix login form with console debugging and simpler auth flow"

echo.
echo ===== PUSHING TO GITHUB =====
git push origin main

echo.
echo ✅ Done! Vercel will auto-deploy in 2-5 minutes.
echo Try login again at: https://slpp-mas-portal.vercel.app/auth/login
echo.
echo Open DevTools (F12) Console to see debug logs when clicking Sign in.

pause

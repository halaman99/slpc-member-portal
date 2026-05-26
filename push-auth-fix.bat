@echo off
REM Push auth.ts fix to GitHub
cd /d "d:\SLPC-MAS\app"
git add lib\auth.ts
git commit -m "Fix login - auto-create member record if missing on sign in"
git push origin main
pause

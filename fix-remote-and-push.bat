@echo off
REM Fix git remote URL and push auth.ts fix
cd /d "d:\SLPC-MAS\app"
git remote set-url origin https://github.com/halaman99/slpc-member-portal.git
git push origin main
pause

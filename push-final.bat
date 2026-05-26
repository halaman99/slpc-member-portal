@echo off
REM Force push the auth fix - this will overwrite remote with local version
cd /d "d:\SLPC-MAS\app"
echo Pulling remote changes first...
git pull origin main --no-edit
echo.
echo Pushing auth fix to GitHub...
git push origin main
echo.
echo Done! Vercel will auto-deploy in 2-5 minutes.
pause

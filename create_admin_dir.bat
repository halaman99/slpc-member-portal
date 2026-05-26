@echo off
REM Create admin directory structure
mkdir d:\SLPC-MAS\app\app\admin 2>nul

REM Create placeholder files
echo Creating admin dashboard...
cd /d d:\SLPC-MAS\app\app\admin

REM Create page.tsx placeholder
echo. > page.tsx

echo Admin structure created

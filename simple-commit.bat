@echo off
REM Simple working batch script - uses git commit with -F flag for multi-line messages

setlocal enabledelayedexpansion

cd /d d:\SLPC-MAS\app

echo.
echo ===================================
echo  COMMITTING LOGIN FIXES
echo ===================================
echo.

REM Stage the files
echo Staging files...
git add contexts\AuthContext.tsx
git add app\auth\login\page.tsx
git add lib\auth.ts

REM Check what's staged
echo.
echo Staged files:
git status --short
echo.

REM Create commit message in a temp file
set TMPFILE=%TEMP%\commit_msg.txt
(
    echo fix: Resolve login form submission issues with error handling and input validation
    echo.
    echo - Fix AuthContext dynamic import causing auth state tracking issues
    echo - Standardize error object structure across auth functions
    echo - Add input trimming and normalization ^(lowercase email, trimmed password^)
    echo - Add comprehensive debug logging to login form
    echo - Improve error message detection with case-insensitive matching
    echo - Add noValidate attribute to form for custom error handling
    echo - Enhanced error logging with full error details ^(message, code, status, name^)
    echo.
    echo Fixes login form not submitting and improves debugging capabilities
    echo.
    echo Co-authored-by: Copilot ^<223556219+Copilot@users.noreply.github.com^>
) > "%TMPFILE%"

REM Create commit
echo Creating commit...
git commit -F "%TMPFILE%"

if errorlevel 1 (
    echo Commit failed!
    del "%TMPFILE%"
    pause
    exit /b 1
)

REM Clean up
del "%TMPFILE%"

REM Push
echo.
echo Pushing to GitHub...
git push origin main

if errorlevel 1 (
    echo Push failed!
    pause
    exit /b 1
)

echo.
echo ===================================
echo SUCCESS! Committed and pushed
echo ===================================
echo.

git log --oneline -3
echo.
pause

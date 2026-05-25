@echo off
REM Fixed: Commit login form submission fixes
REM This version uses a temp file for the commit message to handle newlines

cd /d d:\SLPC-MAS\app

echo.
echo ===================================
echo  COMMITTING LOGIN FIXES TO GIT
echo ===================================
echo.

REM Check git is available
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    pause
    exit /b 1
)

echo [1/4] Checking current branch...
git branch --show-current

echo.
echo [2/4] Staging modified files...
git add contexts/AuthContext.tsx
git add app/auth/login/page.tsx
git add lib/auth.ts

echo.
echo [3/4] Verifying staged files...
git status --short

REM Create temp file with commit message
setlocal enabledelayedexpansion
set "tempfile=%temp%\git_commit_msg.txt"

(
echo fix: Resolve login form submission issues with error handling and input validation
echo.
echo - Fix AuthContext dynamic import causing auth state tracking issues
echo - Standardize error object structure across auth functions
echo - Add input trimming and normalization (lowercase email, trimmed password^)
echo - Add comprehensive debug logging to login form
echo - Improve error message detection with case-insensitive matching
echo - Add noValidate attribute to form for custom error handling
echo - Enhanced error logging with full error details (message, code, status, name^)
echo.
echo Fixes login form not submitting and improves debugging capabilities
echo.
echo Co-authored-by: Copilot ^<223556219+Copilot@users.noreply.github.com^>
) > "%tempfile%"

echo.
echo [4/4] Creating commit...
git commit -F "%tempfile%"

if errorlevel 1 (
    echo.
    echo WARNING: Commit may have failed. Check output above.
    del "%tempfile%"
    pause
    exit /b 1
)

REM Clean up temp file
del "%tempfile%"

echo.
echo [5/5] Pushing to remote...
git push origin main

if errorlevel 1 (
    echo.
    echo WARNING: Push may have failed. Check output above.
    pause
    exit /b 1
)

echo.
echo ===================================
echo  SUCCESS! Changes committed and pushed
echo ===================================
echo.
echo Latest commit:
git log --oneline -1
echo.
echo Commit details:
git show --stat
echo.

pause

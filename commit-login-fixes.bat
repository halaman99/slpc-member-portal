@echo off
REM Commit login form submission fixes
REM Run this script from Command Prompt or PowerShell to commit all auth changes

setlocal enabledelayedexpansion

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
    echo Please install Git or add it to your PATH
    pause
    exit /b 1
)

echo [1/5] Checking current branch...
git branch --show-current

echo.
echo [2/5] Staging modified files...
git add contexts/AuthContext.tsx
git add app/auth/login/page.tsx
git add lib/auth.ts

echo.
echo [3/5] Verifying staged files...
git status --short

echo.
echo [4/5] Creating commit...
git commit -m "fix: Resolve login form submission issues with error handling and input validation

- Fix AuthContext dynamic import causing auth state tracking issues
- Standardize error object structure across auth functions
- Add input trimming and normalization (lowercase email, trimmed password)
- Add comprehensive debug logging to login form
- Improve error message detection with case-insensitive matching
- Add noValidate attribute to form for custom error handling
- Enhanced error logging with full error details (message, code, status, name)

Fixes login form not submitting and improves debugging capabilities

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

if errorlevel 1 (
    echo WARNING: Commit may have failed. Check output above.
) else (
    echo.
    echo [5/5] Pushing to remote...
    git push origin main
    
    if errorlevel 1 (
        echo WARNING: Push may have failed. Check your connection and credentials.
    ) else (
        echo.
        echo ===================================
        echo  SUCCESS! Changes committed and pushed
        echo ===================================
        echo.
        echo Latest commit:
        git log --oneline -1
        echo.
    )
)

echo.
pause

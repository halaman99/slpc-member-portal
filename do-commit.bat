@echo off
cd /d d:\SLPC-MAS\app
git add contexts/AuthContext.tsx app/auth/login/page.tsx lib/auth.ts
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
git push origin main
echo.
echo ===== GIT LOG =====
git log --oneline -5
echo.
echo ===== GIT SHOW =====
git show --stat

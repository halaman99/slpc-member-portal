# Commit login form submission fixes

$ErrorActionPreference = "Stop"

Write-Host "`n===================================" -ForegroundColor Green
Write-Host " COMMITTING LOGIN FIXES TO GIT" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Write-Host ""

try {
    # Check git is available
    Write-Host "[1/6] Checking git..." -ForegroundColor Cyan
    git --version

    # Get current branch
    Write-Host "`n[2/6] Current branch..." -ForegroundColor Cyan
    $branch = git branch --show-current
    Write-Host "Branch: $branch" -ForegroundColor Yellow

    # Stage files
    Write-Host "`n[3/6] Staging files..." -ForegroundColor Cyan
    git add contexts/AuthContext.tsx
    git add app/auth/login/page.tsx
    git add lib/auth.ts
    Write-Host "✅ Files staged" -ForegroundColor Green

    # Check status
    Write-Host "`n[4/6] Status..." -ForegroundColor Cyan
    git status --short

    # Commit
    Write-Host "`n[5/6] Creating commit..." -ForegroundColor Cyan
    $commitMessage = @"
fix: Resolve login form submission issues with error handling and input validation

- Fix AuthContext dynamic import causing auth state tracking issues
- Standardize error object structure across auth functions
- Add input trimming and normalization (lowercase email, trimmed password)
- Add comprehensive debug logging to login form
- Improve error message detection with case-insensitive matching
- Add noValidate attribute to form for custom error handling
- Enhanced error logging with full error details (message, code, status, name)

Fixes login form not submitting and improves debugging capabilities

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
"@

    git commit -m $commitMessage
    Write-Host "✅ Commit created" -ForegroundColor Green

    # Push
    Write-Host "`n[6/6] Pushing to remote..." -ForegroundColor Cyan
    git push origin main
    Write-Host "✅ Pushed to GitHub" -ForegroundColor Green

    # Show result
    Write-Host "`n===================================" -ForegroundColor Green
    Write-Host "✅ SUCCESS! DEPLOYED TO GIT" -ForegroundColor Green
    Write-Host "===================================" -ForegroundColor Green

    Write-Host "`nLatest commits:" -ForegroundColor Cyan
    git log --oneline -5

    Write-Host "`nCommit details:" -ForegroundColor Cyan
    git show --stat

    Write-Host "`n✅ Ready for Vercel deployment!" -ForegroundColor Green
    Write-Host "Visit: https://vercel.com/dashboard" -ForegroundColor Yellow

} catch {
    Write-Host "`n❌ ERROR: $_" -ForegroundColor Red
    Write-Host "`nTroubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Are you in the correct directory: d:\SLPC-MAS\app" -ForegroundColor Yellow
    Write-Host "2. Is git installed: git --version" -ForegroundColor Yellow
    Write-Host "3. Do you have network connection?" -ForegroundColor Yellow
    Write-Host "4. Are git credentials configured?" -ForegroundColor Yellow
    exit 1
}

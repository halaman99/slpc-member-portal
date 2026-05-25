#!/usr/bin/env node

/**
 * Commit login form submission fixes
 * Run: node commit-fixes.js
 */

const { execSync } = require('child_process');
const path = require('path');

const projectDir = path.resolve(__dirname);

console.log('\n===================================');
console.log(' COMMITTING LOGIN FIXES TO GIT');
console.log('===================================\n');

try {
  // Check git is available
  console.log('[1/5] Checking git availability...');
  execSync('git --version', { cwd: projectDir, stdio: 'inherit' });
  
  // Check current branch
  console.log('\n[2/5] Checking current branch...');
  const branch = execSync('git branch --show-current', { cwd: projectDir, encoding: 'utf-8' }).trim();
  console.log(`Current branch: ${branch}`);
  
  // Stage files
  console.log('\n[3/5] Staging modified files...');
  execSync('git add contexts/AuthContext.tsx', { cwd: projectDir, stdio: 'inherit' });
  execSync('git add app/auth/login/page.tsx', { cwd: projectDir, stdio: 'inherit' });
  execSync('git add lib/auth.ts', { cwd: projectDir, stdio: 'inherit' });
  
  // Check status
  console.log('\n[4/5] Verifying staged files...');
  execSync('git status --short', { cwd: projectDir, stdio: 'inherit' });
  
  // Commit
  console.log('\n[5/5] Creating commit...');
  const commitMessage = `fix: Resolve login form submission issues with error handling and input validation

- Fix AuthContext dynamic import causing auth state tracking issues
- Standardize error object structure across auth functions
- Add input trimming and normalization (lowercase email, trimmed password)
- Add comprehensive debug logging to login form
- Improve error message detection with case-insensitive matching
- Add noValidate attribute to form for custom error handling
- Enhanced error logging with full error details (message, code, status, name)

Fixes login form not submitting and improves debugging capabilities

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`;

  execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { 
    cwd: projectDir, 
    stdio: 'inherit',
    shell: true 
  });
  
  // Push
  console.log('\n[6/6] Pushing to remote...');
  execSync('git push origin main', { cwd: projectDir, stdio: 'inherit' });
  
  // Show result
  console.log('\n===================================');
  console.log('✅ SUCCESS! Changes committed and pushed');
  console.log('===================================\n');
  
  console.log('Latest commits:');
  execSync('git log --oneline -5', { cwd: projectDir, stdio: 'inherit' });
  
  console.log('\nCommit details:');
  execSync('git show --stat', { cwd: projectDir, stdio: 'inherit' });
  
  process.exit(0);
  
} catch (error) {
  console.error('\n❌ ERROR:', error.message);
  console.error('\nPlease check:');
  console.error('1. You are in the correct directory');
  console.error('2. Git is installed and in PATH');
  console.error('3. You have network connection');
  console.error('4. Your git credentials are set');
  process.exit(1);
}

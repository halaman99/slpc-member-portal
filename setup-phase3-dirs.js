const fs = require('fs');
const path = require('path');

// Helper function to ensure directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created: ${dir}`);
  }
}

// Create all necessary directories
const dirs = [
  'app/src/app/admin',
  'app/src/app/admin/members',
  'app/src/app/admin/duties',
  'app/src/app/admin/events',
  'app/src/app/admin/requests',
  'app/src/app/members/[id]',
  'app/src/app/members/directory',
  'app/src/api/admin',
  'app/src/api/admin/members',
  'app/src/api/admin/members/[id]',
  'app/src/api/admin/duties',
  'app/src/api/admin/duties/[id]',
  'app/src/api/admin/events',
  'app/src/api/admin/events/[id]',
  'app/src/api/admin/requests',
  'app/src/api/admin/requests/[id]',
];

dirs.forEach(dir => ensureDir(path.join(__dirname, dir)));

console.log('✓ All directories created successfully');

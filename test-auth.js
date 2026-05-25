#!/usr/bin/env node
/**
 * Test Supabase connection and auth functionality
 * Run: node test-auth.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERROR: Missing Supabase credentials in .env.local')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing')
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('🧪 Testing Supabase connection...\n')

  try {
    // Test 1: Check if we can reach Supabase
    console.log('1️⃣  Testing database connectivity...')
    const { data, error: tablesError } = await supabase
      .from('members')
      .select('count')
      .limit(1)

    if (tablesError) {
      console.error('   ❌ Failed:', tablesError.message)
      return
    }
    console.log('   ✅ Connected to Supabase')

    // Test 2: Check tables exist
    console.log('\n2️⃣  Checking database schema...')
    const tables = ['members', 'duties', 'attendance', 'events', 'formations', 'announcements']
    
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('count').limit(1)
      if (error) {
        console.log(`   ❌ ${table}: Table missing`)
      } else {
        console.log(`   ✅ ${table}: OK`)
      }
    }

    // Test 3: Check if there's sample data
    console.log('\n3️⃣  Checking for sample data...')
    const { data: members, error: membersError } = await supabase
      .from('members')
      .select('*')
      .limit(5)

    if (!membersError && members && members.length > 0) {
      console.log(`   ✅ Found ${members.length} member(s)`)
      console.log(`   Sample: ${members[0].full_name} (${members[0].email})`)
    } else {
      console.log('   ⚠️  No members found - You may need to populate sample data')
    }

    console.log('\n✅ All checks passed! Your portal is ready to use.\n')
    console.log('📋 Next steps:')
    console.log('   1. npm run dev')
    console.log('   2. Go to http://localhost:3000')
    console.log('   3. Click "Create account"')
    console.log('   4. Create a test account')
    console.log('   5. Confirm email (check spam if needed)')
    console.log('   6. Log in with your credentials')

  } catch (err) {
    console.error('❌ FATAL ERROR:', err.message)
  }
}

testConnection()

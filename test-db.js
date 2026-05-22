const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lgktylgxcfpfshkixdur.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxna3R5bGd4Y2ZwZnNoa2l4ZHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MTU1MTksImV4cCI6MjA5NDk5MTUxOX0.hMtJ5rtum_ZdiWrM4EAWHPROIB1647mNZYKlGjDbD1M'
);

async function testConnection() {
  console.log('Testing Supabase connection...\n');

  // Test members table
  const { data: members, error: membersError } = await supabase
    .from('members')
    .select('*')
    .limit(1);
  
  if (membersError) {
    console.log('❌ Members table error:', membersError.message);
  } else {
    console.log('✅ Members table exists:', members.length, 'records found');
  }

  // Test events table
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .limit(1);
  
  if (eventsError) {
    console.log('❌ Events table error:', eventsError.message);
  } else {
    console.log('✅ Events table exists:', events.length, 'records found');
  }

  // Test formations table
  const { data: formations, error: formationsError } = await supabase
    .from('formations')
    .select('*')
    .limit(1);
  
  if (formationsError) {
    console.log('❌ Formations table error:', formationsError.message);
  } else {
    console.log('✅ Formations table exists:', formations.length, 'records found');
  }

  // Test announcements table
  const { data: announcements, error: announcementsError } = await supabase
    .from('announcements')
    .select('*')
    .limit(1);
  
  if (announcementsError) {
    console.log('❌ Announcements table error:', announcementsError.message);
  } else {
    console.log('✅ Announcements table exists:', announcements.length, 'records found');
  }
}

testConnection();

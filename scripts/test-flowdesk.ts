#!/usr/bin/env tsx
/**
 * FlowDesk Integration Test Script
 * 
 * Tests the complete FlowDesk integration for PsalMix waitlist:
 * 1. API connection
 * 2. Add test subscriber
 * 3. Update custom fields
 * 4. Verify data sync
 * 
 * Usage:
 *   npx tsx scripts/test-flowdesk.ts
 * 
 * Or with specific test email:
 *   TEST_EMAIL=your@email.com npx tsx scripts/test-flowdesk.ts
 */

import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const API_KEY = process.env.FLODESK_API_KEY;
const SEGMENT_ID = process.env.FLODESK_WAITLIST_SEGMENT_ID;
const TEST_EMAIL = process.env.TEST_EMAIL || `test-${Date.now()}@psalmix.com`;

const FLODESK_API_BASE = 'https://api.flodesk.com/v1';

// ANSI color codes for pretty output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
  const color = {
    success: colors.green,
    error: colors.red,
    info: colors.blue,
    warning: colors.yellow,
  }[type];

  const prefix = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  }[type];

  console.log(`${color}${prefix} ${message}${colors.reset}`);
}

function section(title: string) {
  console.log(`\n${colors.bold}${colors.blue}━━━ ${title} ━━━${colors.reset}\n`);
}

async function testApiConnection(): Promise<boolean> {
  if (!API_KEY) {
    log('FlowDesk API key not found in .env.local', 'error');
    log('Add FLODESK_API_KEY to your .env.local file', 'warning');
    return false;
  }

  try {
    const response = await fetch(`${FLODESK_API_BASE}/segments?per_page=1`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
        'User-Agent': 'PsalMix Waitlist Test Script',
      },
    });

    if (response.ok) {
      log('FlowDesk API connection successful', 'success');
      return true;
    }

    if (response.status === 401) {
      log('API key is invalid or expired', 'error');
      log('Generate a new key at: https://app.flodesk.com/account/integration/api', 'info');
    } else {
      log(`API connection failed with status: ${response.status}`, 'error');
    }

    return false;
  } catch (error) {
    log(`API connection failed: ${error}`, 'error');
    return false;
  }
}

async function addTestSubscriber(): Promise<any> {
  log(`Adding test subscriber: ${TEST_EMAIL}`, 'info');

  const subscriberData = {
    email: TEST_EMAIL,
    first_name: 'Test',
    last_name: 'User',
    custom_fields: {
      waitlist_position: '42',
      referral_code: 'TEST123',
      referred_by: '',
      signup_source: 'psalmix_waitlist_test',
      signup_date: new Date().toISOString(),
    },
    segment_ids: SEGMENT_ID ? [SEGMENT_ID] : [],
    double_optin: false,
  };

  try {
    const response = await fetch(`${FLODESK_API_BASE}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
        'User-Agent': 'PsalMix Waitlist Test Script',
      },
      body: JSON.stringify(subscriberData),
    });

    const data = await response.json();

    if (response.ok) {
      log('Test subscriber added successfully', 'success');
      log(`Subscriber ID: ${data.id}`, 'info');
      log(`Status: ${data.status}`, 'info');
      if (data.segments && data.segments.length > 0) {
        log(`Segments: ${data.segments.map((s: any) => s.name).join(', ')}`, 'info');
      }
      return data;
    }

    log(`Failed to add subscriber: ${response.status}`, 'error');
    log(JSON.stringify(data, null, 2), 'error');
    return null;
  } catch (error) {
    log(`Error adding subscriber: ${error}`, 'error');
    return null;
  }
}

async function updateReferralCount(email: string, count: number): Promise<boolean> {
  log(`Updating referral count for ${email} to ${count}`, 'info');

  try {
    const response = await fetch(`${FLODESK_API_BASE}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
        'User-Agent': 'PsalMix Waitlist Test Script',
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        custom_fields: {
          referral_count: String(count),
        },
      }),
    });

    if (response.ok) {
      log(`Referral count updated successfully`, 'success');
      return true;
    }

    log(`Failed to update referral count: ${response.status}`, 'error');
    return false;
  } catch (error) {
    log(`Error updating referral count: ${error}`, 'error');
    return false;
  }
}

async function getSubscriber(email: string): Promise<any> {
  log(`Fetching subscriber: ${email}`, 'info');

  try {
    const response = await fetch(
      `${FLODESK_API_BASE}/subscribers/${encodeURIComponent(email)}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
          'User-Agent': 'PsalMix Waitlist Test Script',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      log('Subscriber found', 'success');
      return data;
    }

    if (response.status === 404) {
      log('Subscriber not found in FlowDesk', 'warning');
    } else {
      log(`Failed to fetch subscriber: ${response.status}`, 'error');
    }

    return null;
  } catch (error) {
    log(`Error fetching subscriber: ${error}`, 'error');
    return null;
  }
}

async function verifyCustomFields(email: string): Promise<boolean> {
  const subscriber = await getSubscriber(email);

  if (!subscriber) {
    log('Cannot verify custom fields - subscriber not found', 'error');
    return false;
  }

  const customFields = subscriber.custom_fields || {};
  
  log('Custom fields:', 'info');
  console.log(JSON.stringify(customFields, null, 2));

  const requiredFields = [
    'waitlist_position',
    'referral_code',
    'signup_source',
    'signup_date',
  ];

  let allPresent = true;
  for (const field of requiredFields) {
    if (customFields[field]) {
      log(`✓ ${field}: ${customFields[field]}`, 'success');
    } else {
      log(`✗ ${field}: missing`, 'error');
      allPresent = false;
    }
  }

  return allPresent;
}

async function testMilestoneEmailTrigger(): Promise<void> {
  log('Testing milestone email trigger (referral count = 1)', 'info');
  
  const success = await updateReferralCount(TEST_EMAIL, 1);
  
  if (success) {
    log('Milestone trigger sent - check FlowDesk for email automation', 'success');
    log('Expected: "First Referral" email should be queued', 'info');
  } else {
    log('Failed to trigger milestone email', 'error');
  }
}

async function cleanupTestData(): Promise<void> {
  log(`Note: To remove test subscriber ${TEST_EMAIL}, do so manually in FlowDesk dashboard`, 'info');
  log('FlowDesk API does not support deleting subscribers programmatically', 'warning');
}

// Main test runner
async function runTests() {
  console.log(`${colors.bold}${colors.blue}
╔═══════════════════════════════════════════════╗
║   FlowDesk Integration Test Suite           ║
║   PsalMix Waitlist                          ║
╚═══════════════════════════════════════════════╝
${colors.reset}`);

  // Test 1: API Connection
  section('Test 1: API Connection');
  const connectionOk = await testApiConnection();
  if (!connectionOk) {
    log('Aborting tests - fix API connection first', 'error');
    process.exit(1);
  }

  // Test 2: Add Subscriber
  section('Test 2: Add Test Subscriber');
  const subscriber = await addTestSubscriber();
  if (!subscriber) {
    log('Aborting tests - failed to add subscriber', 'error');
    process.exit(1);
  }

  // Wait a moment for FlowDesk to process
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 3: Verify Subscriber Exists
  section('Test 3: Verify Subscriber Data');
  const exists = await getSubscriber(TEST_EMAIL);
  if (!exists) {
    log('Subscriber verification failed', 'error');
  }

  // Test 4: Verify Custom Fields
  section('Test 4: Verify Custom Fields');
  await verifyCustomFields(TEST_EMAIL);

  // Test 5: Update Referral Count
  section('Test 5: Update Referral Count (Milestone Trigger)');
  await testMilestoneEmailTrigger();

  // Final verification
  await new Promise(resolve => setTimeout(resolve, 2000));
  section('Final Verification');
  await verifyCustomFields(TEST_EMAIL);

  // Cleanup instructions
  section('Cleanup');
  await cleanupTestData();

  // Summary
  console.log(`\n${colors.bold}${colors.green}
╔═══════════════════════════════════════════════╗
║   ✅ All Tests Completed                     ║
╚═══════════════════════════════════════════════╝
${colors.reset}`);

  log('Next Steps:', 'info');
  log('1. Check FlowDesk dashboard for test subscriber', 'info');
  log('2. Verify welcome email was sent (if automation is active)', 'info');
  log('3. Verify custom fields are populated correctly', 'info');
  log('4. Test milestone email trigger in FlowDesk workflow settings', 'info');
  log('5. Remove test subscriber from FlowDesk dashboard when done', 'info');
}

// Run the tests
runTests().catch((error) => {
  log(`Fatal error: ${error}`, 'error');
  process.exit(1);
});

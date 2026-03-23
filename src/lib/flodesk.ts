// FlowDesk API Client for PsalMix Waitlist
// API Documentation: https://developers.flodesk.com/
// Created: February 8, 2026

const FLODESK_API_BASE = 'https://api.flodesk.com/v1';
const API_KEY = process.env.FLODESK_API_KEY;
const SEGMENT_ID = process.env.FLODESK_WAITLIST_SEGMENT_ID;

// Note: API_KEY availability is checked at call-time inside each function, not here.
// Module-level warnings fire during Vercel builds and pollute CI logs.

interface FlodeskSubscriber {
  email: string;
  first_name?: string;
  last_name?: string;
  custom_fields?: Record<string, string>;
  segment_ids?: string[];
  double_optin?: boolean;
}

interface FlodeskResponse {
  id: string;
  status: 'active' | 'unsubscribed' | 'unconfirmed' | 'bounced' | 'complained' | 'cleaned';
  email: string;
  first_name?: string;
  last_name?: string;
  segments?: Array<{ id: string; name: string }>;
  custom_fields?: Record<string, string>;
  created_at: string;
}

/**
 * Add or update subscriber in FlowDesk
 * This is called on every waitlist signup to sync the subscriber to FlowDesk
 * 
 * @param email - Subscriber email address
 * @param options - Additional subscriber data (firstName, referral info, position)
 * @returns FlowDesk subscriber object or null if FlowDesk is not configured
 */
export async function addSubscriberToFlowDesk(
  email: string,
  options: {
    firstName?: string;
    referralCode?: string;
    position?: number;
    referredBy?: string;
  } = {}
): Promise<FlodeskResponse | null> {
  if (!API_KEY) {
    console.warn('FlowDesk API key not configured - skipping email sync');
    return null;
  }

  try {
    const subscriberData: FlodeskSubscriber = {
      email: email.toLowerCase().trim(),
      first_name: options.firstName || '',
      custom_fields: {
        waitlist_position: String(options.position || ''),
        referral_code: options.referralCode || '',
        referred_by: options.referredBy || '',
        signup_source: 'psalmix_waitlist',
        signup_date: new Date().toISOString(),
      },
      segment_ids: SEGMENT_ID ? [SEGMENT_ID] : [],
      double_optin: false, // Single opt-in for waitlist
    };

    const response = await fetch(`${FLODESK_API_BASE}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
        'User-Agent': 'PsalMix-Waitlist/1.0',
      },
      body: JSON.stringify(subscriberData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('FlowDesk API error:', error);
      
      // Don't fail signup if FlowDesk is down - log and continue
      // This ensures the waitlist still works even if email service fails
      if (response.status >= 500) {
        console.warn('FlowDesk server error - subscriber added to Supabase only');
        return null;
      }
      
      throw new Error(`FlowDesk API error: ${response.status}`);
    }

    const data: FlodeskResponse = await response.json();
    console.log('✅ Subscriber added to FlowDesk:', data.email);
    return data;

  } catch (error) {
    console.error('Failed to sync with FlowDesk:', error);
    // Don't throw - allow signup to proceed even if FlowDesk fails
    return null;
  }
}

/**
 * Update subscriber's referral count in FlowDesk
 * This is called when someone they referred signs up
 * Updating the referral_count custom field triggers milestone emails in FlowDesk
 * 
 * @param email - Referrer's email address
 * @param referralCount - New referral count (1, 3, 10, 25, etc.)
 * @returns true if successful, false if failed
 */
export async function updateReferralCount(
  email: string,
  referralCount: number
): Promise<boolean> {
  if (!API_KEY) return false;

  try {
    const response = await fetch(`${FLODESK_API_BASE}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
        'User-Agent': 'PsalMix Waitlist (psalmix.com)',
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        custom_fields: {
          referral_count: String(referralCount),
        },
      }),
    });

    if (response.ok) {
      console.log(`✅ Updated referral count for ${email}: ${referralCount}`);
      return true;
    }

    console.error('Failed to update referral count in FlowDesk:', response.status);
    return false;
  } catch (error) {
    console.error('Failed to update referral count in FlowDesk:', error);
    return false;
  }
}

/**
 * Get subscriber info from FlowDesk (for debugging/verification)
 * 
 * @param email - Subscriber email address
 * @returns FlowDesk subscriber object or null if not found
 */
export async function getSubscriber(email: string): Promise<FlodeskResponse | null> {
  if (!API_KEY) return null;

  try {
    const response = await fetch(
      `${FLODESK_API_BASE}/subscribers/${encodeURIComponent(email)}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
          'User-Agent': 'PsalMix Waitlist (psalmix.com)',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`Subscriber not found in FlowDesk: ${email}`);
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch subscriber from FlowDesk:', error);
    return null;
  }
}

/**
 * Test FlowDesk API connection
 * Call this to verify your API key works
 * 
 * @returns true if API key is valid and connection works
 */
export async function testFlodeskConnection(): Promise<boolean> {
  if (!API_KEY) {
    console.error('❌ FlowDesk API key not configured');
    return false;
  }

  try {
    // Try to list segments (simple API call to test auth)
    const response = await fetch(`${FLODESK_API_BASE}/segments?per_page=1`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
        'User-Agent': 'PsalMix Waitlist (psalmix.com)',
      },
    });

    if (response.ok) {
      console.log('✅ FlowDesk API connection successful');
      return true;
    }

    console.error('❌ FlowDesk API authentication failed:', response.status);
    return false;
  } catch (error) {
    console.error('❌ FlowDesk API connection failed:', error);
    return false;
  }
}

# FlowDesk Integration Guide for PsalMix Waitlist
**Created:** February 8, 2026  
**Launch Target:** Week of February 10, 2026  
**Status:** URGENT - 2 days to launch

---

## 🎯 Overview

This guide provides complete instructions for integrating FlowDesk email marketing with the PsalMix waitlist application, including:

1. **FlowDesk API Integration** - Connect waitlist signups to FlowDesk
2. **Custom Domain Setup** - Configure waitlist.psalmix.com or early.psalmix.com
3. **Email Automation** - Welcome sequences, milestone emails, and pre-launch
4. **Testing Checklist** - End-to-end verification

---

## 📋 Prerequisites

- [ ] FlowDesk account created (sign up at https://flodesk.com if needed)
- [ ] FlowDesk API key generated (see Section 1 below)
- [ ] Domain registrar access for DNS configuration
- [ ] Vercel deployment active for PsalMix waitlist

---

## 1️⃣ FlowDesk API Setup

### Step 1: Get Your FlowDesk API Key

**⚠️ CRITICAL:** FlowDesk API is NOT available on trial or free accounts. You must have a paid FlowDesk account.

1. Log in to FlowDesk: https://app.flodesk.com/
2. Navigate to **Account Settings** → **Integrations** → **API Keys**
3. Click **Generate New API Key**
4. Copy the API key (format: `fd_api_XXXXXXXXXXXXXXXX`)
5. Store it securely in `.env.local`

**If you don't see "API Keys" option:**
- You're on a trial/free account
- Upgrade to a paid plan first ($38/month minimum)
- Alternative: Use Zapier/Pabbly integration instead (see Alternative Setup below)

### Step 2: Store API Key Securely

Add to `/Users/mmcassistant/clawd/projects/psalmix-waitlist/.env.local`:

```bash
# FlowDesk API Credentials
FLODESK_API_KEY=fd_api_YOUR_KEY_HERE

# Optional: Segment ID for waitlist subscribers
FLODESK_WAITLIST_SEGMENT_ID=
```

Add to `~/.clawdbot/.env` (global credentials):

```bash
FLODESK_API_KEY=fd_api_YOUR_KEY_HERE
```

### Step 3: Create FlowDesk Segment for Waitlist

1. In FlowDesk dashboard, go to **Audience** → **Segments**
2. Click **Create Segment**
3. Name: "PsalMix Waitlist"
4. Color: Purple (to match brand)
5. Copy the segment ID from the URL (format: `seg_XXXXXXXX`)
6. Add to `.env.local` as `FLODESK_WAITLIST_SEGMENT_ID`

---

## 2️⃣ Code Integration

### Create FlowDesk API Client

**File:** `/src/lib/flodesk.ts`

```typescript
// FlowDesk API Client for PsalMix Waitlist
// API Documentation: https://developers.flodesk.com/

const FLODESK_API_BASE = 'https://api.flodesk.com/v1';
const API_KEY = process.env.FLODESK_API_KEY;
const SEGMENT_ID = process.env.FLODESK_WAITLIST_SEGMENT_ID;

if (!API_KEY) {
  console.warn('⚠️ FLODESK_API_KEY not configured - email integration disabled');
}

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
        'User-Agent': 'PsalMix Waitlist (psalmix.com)',
      },
      body: JSON.stringify(subscriberData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('FlowDesk API error:', error);
      
      // Don't fail signup if FlowDesk is down - log and continue
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
 * Called when someone they referred signs up
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

    return response.ok;
  } catch (error) {
    console.error('Failed to update referral count in FlowDesk:', error);
    return false;
  }
}

/**
 * Get subscriber info from FlowDesk (for debugging)
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

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch subscriber from FlowDesk:', error);
    return null;
  }
}
```

### Update Signup API Route

**File:** `/src/app/api/signup/route.ts`

Add FlowDesk integration to the existing signup route:

```typescript
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { addSubscriberToFlowDesk, updateReferralCount } from "@/lib/flodesk";

// ... existing generateReferralCode function ...

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email as string | undefined)?.toLowerCase().trim();
    const firstName = (body.firstName as string | undefined)?.trim();
    const referralCode = (body.referralCode as string | undefined)?.trim();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Mock mode for preview
    if (process.env.NEXT_PUBLIC_MOCK_MODE === "true") {
      const mockCode = generateReferralCode();
      const mockPosition = Math.floor(Math.random() * 500) + 2848;
      return NextResponse.json({
        position: mockPosition,
        referralCode: mockCode,
      });
    }

    // Check if already exists
    const { data: existing } = await supabase
      .from("waitlist_users")
      .select("id,email,position,referral_code")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        already: true,
        position: existing.position,
        referralCode: existing.referral_code,
      });
    }

    // Calculate position
    const { count } = await supabase
      .from("waitlist_users")
      .select("id", { count: "exact", head: true });

    const position = (count ?? 0) + 1;

    // Generate unique referral code
    let newReferralCode = generateReferralCode();
    let attempts = 0;
    while (attempts < 5) {
      const { data: existingCode } = await supabase
        .from("waitlist_users")
        .select("id")
        .eq("referral_code", newReferralCode)
        .maybeSingle();
      if (!existingCode) break;
      newReferralCode = generateReferralCode();
      attempts += 1;
    }

    // Find referrer if referral code provided
    let referredById: string | null = null;
    let referrerEmail: string | null = null;
    if (referralCode) {
      const { data: referrer } = await supabase
        .from("waitlist_users")
        .select("id,email")
        .eq("referral_code", referralCode)
        .maybeSingle();
      
      if (referrer) {
        referredById = referrer.id;
        referrerEmail = referrer.email;
      }
    }

    // Insert into Supabase
    const { data: createdUser, error } = await supabase
      .from("waitlist_users")
      .insert({
        email,
        referral_code: newReferralCode,
        referred_by: referredById,
        position,
      })
      .select("id,position,referral_code")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ✨ NEW: Sync to FlowDesk
    await addSubscriberToFlowDesk(email, {
      firstName,
      referralCode: newReferralCode,
      position: createdUser.position,
      referredBy: referralCode || undefined,
    });

    // Handle referral tracking
    if (referredById && referrerEmail) {
      await supabase.from("referrals").insert({
        referrer_id: referredById,
        referee_id: createdUser.id,
      });

      const { data: referrerCounts } = await supabase
        .from("waitlist_users")
        .select("referral_count")
        .eq("id", referredById)
        .maybeSingle();

      const nextCount = (referrerCounts?.referral_count ?? 0) + 1;
      
      await supabase
        .from("waitlist_users")
        .update({ referral_count: nextCount })
        .eq("id", referredById);

      // ✨ NEW: Update referrer's count in FlowDesk (triggers milestone emails)
      await updateReferralCount(referrerEmail, nextCount);
    }

    return NextResponse.json({
      position: createdUser.position,
      referralCode: createdUser.referral_code,
    });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
```

### Add First Name Field to Signup Form (Optional but Recommended)

**File:** `/src/app/page.tsx`

Update the `SignupForm` component to capture first name:

```typescript
function SignupForm({ variant = "hero", referralCode }: { variant?: "hero" | "footer"; referralCode?: string; }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState(""); // NEW
  // ... rest of state ...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setResult(null);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          firstName, // NEW - send to API
          referralCode 
        }),
      });
      // ... rest of handler ...
    }
  };

  // ... in the form JSX, add firstName input before email:
  
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="p-2 bg-surface rounded-2xl shadow-xl border border-white/10 flex flex-col gap-2">
        {/* NEW: First Name Input */}
        <div className="flex-1 flex items-center px-4">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder:text-slate-400"
            placeholder="First name (optional)"
          />
        </div>
        
        {/* Existing Email Input */}
        <div className="flex-1 flex items-center px-4">
          <Icons.mail className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder:text-slate-400"
            placeholder="Enter your email"
          />
        </div>
        
        <button type="submit" /* ... */>
          {status === "loading" ? "Joining..." : "Join the Waitlist"}
        </button>
      </div>
    </form>
  );
}
```

---

## 3️⃣ Email Automation in FlowDesk

### Set Up Welcome Email Sequence

1. In FlowDesk dashboard, go to **Emails** → **Create Email**
2. Choose **Workflow** → **Welcome Series**
3. Configure triggers:

**Email 1: Welcome (Immediate)**
- **Trigger:** Subscriber added to "PsalMix Waitlist" segment
- **Delay:** 0 minutes
- **Subject:** 🎵 You're In! Welcome to PsalMix {{first_name}}
- **Content:** Use template from `EMAIL-SEQUENCES-FLOWDESK.md`

**Email 2: The Story (Day 2)**
- **Trigger:** 2 days after Email 1
- **Subject:** 📖 Why We Built PsalMix (And Why You'll Love It)

**Email 3: Referral Reminder (Day 4)**
- **Trigger:** 2 days after Email 2
- **Subject:** 🎁 Unlock Rewards by Inviting Friends

### Set Up Milestone Emails

Create **separate workflows** for each milestone (triggered by custom field updates):

**Milestone: 1 Referral**
- **Trigger:** Custom field `referral_count` equals `1`
- **Subject:** 🎉 You Got Your First Referral!

**Milestone: 3 Referrals (Beta Access)**
- **Trigger:** Custom field `referral_count` equals `3`
- **Subject:** ⚡ Beta Access Unlocked! You're In Early

**Milestone: 10 Referrals (Founding Family)**
- **Trigger:** Custom field `referral_count` equals `10`
- **Subject:** 👑 Founding Family Status Earned!

**Milestone: 25 Referrals (Golden Ticket)**
- **Trigger:** Custom field `referral_count` equals `25`
- **Subject:** 💎 GOLDEN TICKET: You're a PsalMix Legend!

### Custom Field Placeholders

Use these in your FlowDesk email templates:

- `{{first_name}}` - Subscriber's first name
- `{{custom_fields.waitlist_position}}` - Position on waitlist
- `{{custom_fields.referral_code}}` - Their unique referral code
- `{{custom_fields.referral_count}}` - Number of successful referrals

**Referral Link Format:**
```
https://psalmix.com/r/{{custom_fields.referral_code}}
```

---

## 4️⃣ Custom Domain Setup

### Option 1: Subdomain (Recommended)

**Choose one:**
- `waitlist.psalmix.com` (descriptive)
- `early.psalmix.com` (implies exclusivity)
- `join.psalmix.com` (action-oriented)

**DNS Configuration:**

1. Log in to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
2. Navigate to DNS management for `psalmix.com`
3. Add a CNAME record:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | waitlist | cname.vercel-dns.com | 3600 |

**In Vercel:**

1. Go to project settings: https://vercel.com/mmcmedias-projects/psalmix-waitlist/settings/domains
2. Click **Add Domain**
3. Enter: `waitlist.psalmix.com`
4. Vercel will verify DNS and provision SSL automatically (5-10 minutes)

### Option 2: Root Domain (psalmix.com)

If you want the waitlist on the main domain:

**DNS Configuration:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 3600 |

**In Vercel:**
- Add `psalmix.com` as the domain
- Vercel will handle SSL/HTTPS automatically

### Verify SSL Certificate

Once DNS propagates:
1. Visit `https://waitlist.psalmix.com` (or your chosen domain)
2. Check for 🔒 in browser address bar
3. Click the padlock → **Connection is secure**

If you see SSL errors:
- Wait 10-30 minutes for certificate provisioning
- Check DNS propagation: https://dnschecker.org
- Contact Vercel support if issues persist beyond 24 hours

---

## 5️⃣ Testing Checklist

### Pre-Launch Testing

**FlowDesk Integration:**
- [ ] Test email signup with your own email
- [ ] Verify subscriber appears in FlowDesk dashboard
- [ ] Check custom fields populated correctly (`waitlist_position`, `referral_code`)
- [ ] Confirm subscriber added to "PsalMix Waitlist" segment
- [ ] Test with referral code - verify referrer's count updates
- [ ] Test welcome email received within 1 minute
- [ ] Verify email contains correct waitlist position and referral link
- [ ] Click referral link - confirm pre-fills referral code

**Custom Domain:**
- [ ] DNS CNAME record created and pointing to Vercel
- [ ] Domain verified in Vercel dashboard (green checkmark)
- [ ] HTTPS working (padlock icon in browser)
- [ ] www.waitlist.psalmix.com redirects to waitlist.psalmix.com (optional)
- [ ] Test signup on custom domain
- [ ] Verify mobile responsiveness on custom domain

**End-to-End Flow:**
1. [ ] User A signs up on `waitlist.psalmix.com`
2. [ ] User A receives welcome email from FlowDesk
3. [ ] User A shares referral link with User B
4. [ ] User B clicks link → sees "referred by friend" message
5. [ ] User B signs up
6. [ ] User A's referral count increments in Supabase
7. [ ] User A's referral count updates in FlowDesk
8. [ ] If User A hit milestone (1, 3, 10, 25), milestone email sent
9. [ ] User B receives their own welcome email
10. [ ] Both users can access their dashboard at `/dashboard/[code]`

**Edge Cases:**
- [ ] Test duplicate email signup (should return existing position)
- [ ] Test invalid referral code (should still work, just no referrer credit)
- [ ] Test with empty first name (should still work)
- [ ] Test FlowDesk API failure (signup should still succeed)
- [ ] Test rate limiting (100 requests/minute FlowDesk limit)

---

## 6️⃣ Launch Day Checklist

**24 Hours Before:**
- [ ] Confirm FlowDesk account has sufficient credits/not suspended
- [ ] Test email deliverability (check spam folders)
- [ ] Verify all email templates have correct branding
- [ ] Confirm DNS fully propagated (https://dnschecker.org)
- [ ] Test signup flow on mobile devices (iOS Safari, Chrome)
- [ ] Monitor error logs for any FlowDesk API issues

**At Launch:**
- [ ] Post announcement with `waitlist.psalmix.com` link
- [ ] Monitor `/api/signup` endpoint for errors
- [ ] Check FlowDesk subscriber count increasing
- [ ] Verify welcome emails sending immediately
- [ ] Watch for rate limit warnings (FlowDesk 100/min limit)
- [ ] Have Supabase dashboard open to monitor signups
- [ ] Set up Slack/email alerts for API errors

**Post-Launch (First Hour):**
- [ ] Verify first 10 signups received welcome emails
- [ ] Check spam reports (should be zero with proper DMARC/SPF)
- [ ] Monitor referral tracking working
- [ ] Verify milestone emails triggering correctly
- [ ] Check custom domain loading fast (<2 seconds)

---

## 7️⃣ Troubleshooting

### FlowDesk API Errors

**Error: 401 Unauthorized**
- API key incorrect or expired
- Check `.env.local` has correct `FLODESK_API_KEY`
- Regenerate key in FlowDesk dashboard

**Error: 429 Rate Limit Exceeded**
- You hit 100 requests/minute limit
- Implement queue system or slow down signups
- Consider caching subscriber checks

**Error: 500 Internal Server Error**
- FlowDesk service down (rare)
- Check https://status.flodesk.com
- Signups will still work (FlowDesk sync is non-blocking)

**Subscriber Not Appearing in FlowDesk**
- Check API key is for correct account
- Verify segment ID is correct
- Check FlowDesk logs for failed webhook
- Try manually adding one subscriber via FlowDesk UI

### DNS/Domain Issues

**"DNS not configured correctly"**
- Wait 10-30 minutes for propagation
- Check CNAME value is exactly `cname.vercel-dns.com`
- No trailing dot in DNS record
- Clear browser cache and retry

**SSL Certificate Not Provisioning**
- Wait up to 24 hours (usually 5-10 minutes)
- Check DNS at https://dnschecker.org
- Ensure domain not already used in another Vercel project
- Contact Vercel support if > 24 hours

**404 on Custom Domain**
- Vercel project not deployed
- Domain not added in Vercel settings
- Clear CDN cache in Vercel dashboard

### Email Deliverability

**Emails Going to Spam**
- Check SPF/DKIM/DMARC records for your domain
- Use FlowDesk's verified sending domain
- Ask subscribers to whitelist emails
- Avoid spammy words in subject lines

**Emails Not Sending**
- Check FlowDesk account status (suspended?)
- Verify workflow is "Active" not "Draft"
- Check subscriber status is "Active" not "Unconfirmed"
- Test with different email provider (Gmail, Outlook, Yahoo)

---

## 8️⃣ Alternative Setup (No FlowDesk API Access)

If you're on FlowDesk trial/free (no API access), use Zapier or Pabbly Connect:

### Zapier Integration

1. Create Zapier account: https://zapier.com
2. Create new Zap:
   - **Trigger:** Webhook (catch hook)
   - **Action:** FlowDesk → Add/Update Subscriber
3. In your `/api/signup` route, add webhook call:

```typescript
// Send to Zapier webhook
await fetch('https://hooks.zapier.com/hooks/catch/YOUR_HOOK_ID/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email,
    firstName,
    referralCode: newReferralCode,
    position: createdUser.position,
  }),
});
```

4. Map webhook fields to FlowDesk subscriber fields
5. Test Zap with sample data

**Cost:** $19.99/mo Zapier Starter plan

### Pabbly Connect (Cheaper Alternative)

Same process as Zapier but cheaper ($19/mo flat rate):
- https://www.pabbly.com/connect/integrations/flodesk/

---

## 9️⃣ Monitoring & Analytics

### Key Metrics to Track

**Daily:**
- Total signups
- Referral conversion rate
- Email open rate (FlowDesk analytics)
- Milestone email triggers
- API error rate

**Weekly:**
- Top referrers (leaderboard)
- Viral coefficient (referrals per user)
- Email click-through rate
- Custom domain traffic

**Setup Google Analytics:**

Add to `layout.tsx`:

```typescript
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-YOUR_ID"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-YOUR_ID');
  `}
</Script>
```

---

## 🎯 Success Criteria

**Launch Complete When:**
- ✅ 100+ signups in first 24 hours
- ✅ All signups synced to FlowDesk
- ✅ Welcome emails delivering <1 minute
- ✅ Referral tracking working (10+ referral-based signups)
- ✅ Custom domain live with SSL
- ✅ Zero critical errors in logs
- ✅ At least one milestone email triggered (3+ referrals)

---

## 📚 Resources

- **FlowDesk API Docs:** https://developers.flodesk.com/
- **FlowDesk Help Center:** https://help.flodesk.com/
- **Vercel DNS Setup:** https://vercel.com/docs/concepts/projects/domains
- **Email Templates:** `/projects/psalmix-waitlist/EMAIL-SEQUENCES-FLOWDESK.md`
- **DNS Checker:** https://dnschecker.org

---

## 🆘 Emergency Contacts

**If something breaks at launch:**

1. **FlowDesk Issues:**
   - Check https://status.flodesk.com
   - Email: support@flodesk.com
   - Live chat in FlowDesk dashboard

2. **Vercel Issues:**
   - Check https://vercel.com/status
   - Support: https://vercel.com/help

3. **DNS Issues:**
   - Contact domain registrar support
   - Check registrar status page

**Fallback Plan:**
If FlowDesk completely fails at launch, signups still work (stored in Supabase). You can backfill FlowDesk later or manually export and import.

---

**Status:** READY FOR IMPLEMENTATION  
**Estimated Time:** 2-3 hours to complete all steps  
**Next Step:** Get FlowDesk API key and begin Section 1

---

*Last Updated: February 8, 2026*

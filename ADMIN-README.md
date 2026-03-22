# PsalMix Waitlist - Admin Dashboard & Email System

## Overview
Complete admin dashboard and email template system for managing the PsalMix waitlist.

## Files Created

### 1. Admin Dashboard
**Location:** `/src/app/admin/page.tsx`

**Features:**
- ✅ Password protection (ENV var: `NEXT_PUBLIC_ADMIN_PASSWORD` or default: `admin123`)
- ✅ Total signups counter
- ✅ Signups today / this week / this month
- ✅ Top 10 referrers leaderboard
- ✅ Signups over time chart (last 30 days)
- ✅ Export to CSV button
- ✅ Recent signups table (paginated)
- ✅ Dark mode friendly design
- ✅ Responsive layout

**Access:** `http://localhost:3000/admin`

### 2. Email Templates
**Location:** `/src/emails/`

All templates are responsive HTML with inline CSS and variable substitution support.

#### welcome.html
- **Subject:** "You're in! Here's how to skip the line ⏩"
- **Sent:** Immediately on signup
- **Variables:** `{{name}}`, `{{position}}`, `{{referral_link}}`
- **Content:** Position reveal, referral link, rewards preview

#### progress.html
- **Subject:** "{{name}}, you moved up! 📈"
- **Sent:** After first referral (or milestone)
- **Variables:** `{{name}}`, `{{position}}`, `{{referral_count}}`, `{{next_reward}}`, `{{next_reward_icon}}`, `{{referrals_needed}}`, `{{progress_percentage}}`, `{{referral_link}}`
- **Content:** New position, referrals count, next reward, progress bar

#### reward-unlocked.html
- **Subject:** "🎁 You unlocked: {{reward}}!"
- **Sent:** When referral tier reached
- **Variables:** `{{name}}`, `{{reward}}`, `{{badge}}`, `{{badge_name}}`, `{{referral_link}}`
- **Content:** Celebration, what they earned, encouragement to keep sharing

#### launch.html
- **Subject:** "🎉 {{name}}, PsalMix is LIVE!"
- **Sent:** At app launch
- **Variables:** `{{name}}`, `{{rewards_summary}}`, `{{app_store_link}}`, `{{play_store_link}}`
- **Content:** Download links, rewards applied, thank you message

### 3. Email Sending Library
**Location:** `/src/lib/email.ts`

**Features:**
- ✅ Template rendering with variable substitution
- ✅ Helper functions for each email type
- ✅ Console logging (for development)
- ✅ Ready for Resend integration

**Functions:**
```typescript
// Generic send function
sendEmail(to, template, variables)

// Specialized helpers
sendWelcomeEmail(email, name, position, referralLink)
sendProgressEmail(email, name, position, referralCount, nextReward, ...)
sendRewardUnlockedEmail(email, name, reward, badge, badgeName, referralLink)
sendLaunchEmail(email, name, rewardsSummary, appStoreLink, playStoreLink)

// Utility
generateRewardsSummaryHTML(rewards[])
```

**Current Status:** Logs to console. To enable real sending:
1. Install Resend: `npm install resend`
2. Add `RESEND_API_KEY` to `.env`
3. Uncomment Resend code in `sendEmail()` function

### 4. Admin API Routes

#### GET /api/admin/stats
Returns dashboard statistics:
- Total signups
- Signups today / week / month
- Top 10 referrers with counts
- Chart data (last 30 days)

**Response:**
```json
{
  "stats": {
    "totalSignups": 100,
    "signupsToday": 5,
    "signupsThisWeek": 32,
    "signupsThisMonth": 78
  },
  "topReferrers": [...],
  "chartData": [...]
}
```

#### GET /api/admin/users?page=1&limit=20
Returns paginated user list with referrer details.

**Response:**
```json
{
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### GET /api/admin/export
Exports all waitlist data as CSV file.

**Returns:** CSV file download with headers:
- Position, Email, Name, Referral Code, Referred By, Referral Count, Created At, Updated At

## Setup Instructions

### 1. Environment Variables
Add to `.env.local`:
```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Admin password (optional, defaults to 'admin123')
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password

# Email sending (for future)
RESEND_API_KEY=your_resend_key
```

### 2. Database Schema
The API routes expect a `waitlist` table with these columns:
- `id` (uuid, primary key)
- `email` (text)
- `name` (text)
- `position` (integer)
- `referral_code` (text, unique)
- `referred_by` (text)
- `referral_count` (integer, default 0)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 3. Running the Admin Dashboard
```bash
npm run dev
# Visit http://localhost:3000/admin
# Login with password from ENV or 'admin123'
```

### 4. Testing Email Templates
```typescript
import { sendWelcomeEmail } from '@/lib/email';

// Test in an API route or server action
await sendWelcomeEmail(
  'user@example.com',
  'John Doe',
  42,
  'https://psalmix.app/join?ref=abc123'
);
// Check console for output
```

## Integration with Main System

### When a user signs up:
```typescript
import { sendWelcomeEmail } from '@/lib/email';

// After creating user in DB
await sendWelcomeEmail(
  user.email,
  user.name,
  user.position,
  `${process.env.NEXT_PUBLIC_APP_URL}/join?ref=${user.referral_code}`
);
```

### When a user refers someone:
```typescript
import { sendProgressEmail } from '@/lib/email';

// After incrementing referral_count
if (user.referral_count === 1 || user.referral_count % 5 === 0) {
  await sendProgressEmail(
    user.email,
    user.name,
    user.position,
    user.referral_count,
    getNextReward(user.referral_count),
    getNextRewardIcon(user.referral_count),
    getReferralsNeeded(user.referral_count),
    getProgressPercentage(user.referral_count),
    referralLink
  );
}
```

### When a reward is unlocked:
```typescript
import { sendRewardUnlockedEmail } from '@/lib/email';

// When user hits 3, 5, 10, or 25 referrals
await sendRewardUnlockedEmail(
  user.email,
  user.name,
  'Exclusive Wallpapers',
  '🥉',
  'Bronze',
  referralLink
);
```

### At launch:
```typescript
import { sendLaunchEmail, generateRewardsSummaryHTML } from '@/lib/email';

// For all waitlist users
const rewards = getUserRewards(user);
const rewardsSummary = generateRewardsSummaryHTML(rewards);

await sendLaunchEmail(
  user.email,
  user.name,
  rewardsSummary,
  'https://apps.apple.com/...',
  'https://play.google.com/...'
);
```

## Security Notes

- Admin password is client-side only (simple protection for demo)
- For production, implement proper authentication (NextAuth, Supabase Auth, etc.)
- API routes should verify admin authentication
- Use `SUPABASE_SERVICE_KEY` for admin operations (bypasses RLS)

## Design Philosophy

- **Functional over fancy** - Clean, professional, gets the job done
- **Dark mode friendly** - Purple/gray gradient theme
- **Mobile responsive** - Works on all screen sizes
- **Email safe** - Inline CSS, tested HTML structure
- **Extensible** - Easy to add more stats, email types, etc.

## Next Steps

1. **Enable Real Email Sending:**
   - Sign up for Resend
   - Add API key to ENV
   - Uncomment Resend code in `email.ts`

2. **Add Admin Authentication:**
   - Implement proper auth middleware
   - Protect API routes
   - Add user roles/permissions

3. **Enhanced Analytics:**
   - Referral source tracking
   - Conversion funnel
   - Geographic distribution

4. **Email Improvements:**
   - A/B testing
   - Email preview before sending
   - Scheduled sends
   - Unsubscribe handling

## Support

For questions or issues, refer to the main PsalMix Waitlist README or contact the development team.

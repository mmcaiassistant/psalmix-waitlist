# Viral Loops Integration Guide

## Overview

McKinzie has a **lifetime Viral Loops account** that could be used to:
1. **Enhance** the existing custom waitlist (add their analytics/tracking)
2. **Replace** the custom referral system entirely
3. **Run in parallel** for A/B testing

## Current Status: Custom Build vs Viral Loops

| Feature | Custom Build (Current) | Viral Loops |
|---------|----------------------|-------------|
| Referral tracking | ✅ Built | ✅ Built-in |
| Position queue | ✅ Built | ✅ Built-in |
| Tier rewards | ✅ Built (3/10/25/50) | ✅ Built-in |
| User dashboard | ✅ Built | ✅ Built-in |
| Email integration | ❌ Needs setup | ✅ Built-in |
| Analytics | ❌ Basic | ✅ Advanced |
| Widget embedding | N/A | ✅ Easy |
| Full control | ✅ Yes | ❌ Limited |
| Brand matching | ✅ Perfect | ⚠️ Good |
| Cost | Free (Supabase) | Free (lifetime) |

## Recommendation

**Keep the custom build as primary.** It matches the PsalMix brand perfectly and gives full control.

**Use Viral Loops for:**
- Email automation (connect via webhook)
- Analytics dashboard
- Backup tracking

---

## Integration Options

### Option A: Webhook Sync (Recommended)

Sync new signups from our custom form → Viral Loops for analytics.

```javascript
// After successful signup in our API
await fetch('https://app.viral-loops.com/api/v3/participant', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apiToken': process.env.VIRAL_LOOPS_API_TOKEN
  },
  body: JSON.stringify({
    campaignId: 'YOUR_CAMPAIGN_ID',
    email: userEmail,
    referralCode: existingReferralCode, // optional
  })
});
```

### Option B: Replace Custom Form with VL Widget

Add Viral Loops form widget instead of custom signup.

```jsx
// components/ViralLoopsFormWidget.tsx
"use client";
import { useEffect } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'form-widget': any;
    }
  }
}

export default function ViralLoopsFormWidget({ ucid }: { ucid: string }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.viral-loops.com/widgetsV2/core/loader.js";
    document.head.appendChild(script);
  }, []);

  return <form-widget ucid={ucid} mode="form"></form-widget>;
}
```

### Option C: Parallel Tracking

Keep custom build + add VL pixel for analytics only.

---

## Setup Steps (If Using Viral Loops)

1. **Log into Viral Loops** (lifetime account)
2. **Create new campaign** → "Waitlist" template
3. **Configure tiers** to match existing (3/10/25/50)
4. **Get API token** and campaign UCID
5. **Add env vars:**
   ```
   VIRAL_LOOPS_API_TOKEN=xxx
   VIRAL_LOOPS_CAMPAIGN_ID=xxx
   ```
6. **Choose integration option** (A, B, or C above)

---

## Action Items

- [ ] McKinzie: Log into Viral Loops, share campaign UCID
- [ ] Decide: Sync only (A), replace (B), or parallel (C)?
- [ ] If syncing: Add webhook to signup API

---

## Resources

- Viral Loops React/Next.js docs: https://developers.viral-loops.com/docs/react
- API docs: https://developers.viral-loops.com/reference/introduction
- Dashboard: https://app.viral-loops.com

# FlowDesk + PsalMix Waitlist: 30-Minute Quick Start

**⏰ Time to Launch:** 30 minutes if you move fast  
**📅 Launch Target:** Feb 10, 2026 (2 days!)

---

## Step 1: Get FlowDesk API Key (5 min)

**⚠️ CRITICAL:** You need a **PAID** FlowDesk account ($38/month)

1. Log in: https://app.flodesk.com/
2. Go to: **Account Settings** → **Integrations** → **API Keys**
3. Click **Generate New API Key**
4. Copy the key (starts with `fd_api_`)

**No "API Keys" option?** → You're on trial/free. Upgrade first OR use Zapier (see guide).

---

## Step 2: Configure .env.local (2 min)

**File:** `/projects/psalmix-waitlist/.env.local`

Add these lines:
```bash
FLODESK_API_KEY=fd_api_YOUR_KEY_HERE
FLODESK_WAITLIST_SEGMENT_ID=seg_YOUR_SEGMENT_ID
```

**Get Segment ID:**
1. FlowDesk → **Audience** → **Segments** → **Create Segment**
2. Name: "PsalMix Waitlist"
3. Color: Purple
4. Copy ID from URL

---

## Step 3: Test Integration (3 min)

```bash
cd /Users/mmcassistant/clawd/projects/psalmix-waitlist
npx tsx scripts/test-flowdesk.ts
```

**Expected:** All ✅ checkmarks. If ❌ appears, check guide Section 7.

---

## Step 4: Activate FlowDesk Route (1 min)

```bash
cd /Users/mmcassistant/clawd/projects/psalmix-waitlist/src/app/api/signup
mv route.ts route-backup.ts
mv route-with-flowdesk.ts route.ts
```

---

## Step 5: Import Email Templates (15 min)

**File:** `EMAIL-SEQUENCES-FLOWDESK.md`

**In FlowDesk Dashboard:**

1. **Create Welcome Workflow:**
   - Trigger: Subscriber added to "PsalMix Waitlist" segment
   - Email 1: Immediate (copy HTML from EMAIL-SEQUENCES-FLOWDESK.md → Email 1)
   - Email 2: 2 days later (copy Email 2 HTML)
   - Email 3: 2 days later (copy Email 3 HTML)

2. **Create Milestone Workflows (4 separate workflows):**
   - **1 Referral:** Trigger when `custom_fields.referral_count = 1`
   - **3 Referrals:** Trigger when `custom_fields.referral_count = 3`
   - **10 Referrals:** Trigger when `custom_fields.referral_count = 10`
   - **25 Referrals:** Trigger when `custom_fields.referral_count = 25`

3. **Activate all workflows** (toggle to "Active")

**Placeholders to use:**
- `{{first_name}}` - Their name
- `{{custom_fields.waitlist_position}}` - Position number
- `{{custom_fields.referral_code}}` - Their unique code
- Referral link: `https://psalmix.com/r/{{custom_fields.referral_code}}`

---

## Step 6: Configure Custom Domain (5 min)

**DNS Record (at your domain registrar):**
| Type | Name | Value |
|------|------|-------|
| CNAME | waitlist | cname.vercel-dns.com |

**In Vercel:**
1. Go to: https://vercel.com/mmcmedias-projects/psalmix-waitlist/settings/domains
2. Add: `waitlist.psalmix.com`
3. Wait 5-10 min for SSL

**Test:** Visit https://waitlist.psalmix.com (should see 🔒)

---

## Step 7: Deploy & Test (5 min)

```bash
cd /Users/mmcassistant/clawd/projects/psalmix-waitlist
git add .
git commit -m "Add FlowDesk integration"
git push
```

**Test Flow:**
1. Go to `waitlist.psalmix.com`
2. Sign up with your email
3. Check FlowDesk dashboard → subscriber should appear
4. Check email → welcome email should arrive in <1 min
5. Click referral link
6. Have friend sign up
7. Check your `referral_count` updated
8. If count = 1, 3, 10, or 25 → milestone email sends

**All ✅?** → LAUNCH! 🚀

---

## 🆘 Quick Troubleshooting

| Problem | Fix |
|---------|-----|
| **Test script fails with 401** | API key wrong or FlowDesk account not paid |
| **Subscriber not in FlowDesk** | Check API key in .env.local, verify segment ID |
| **No email received** | Check workflow is "Active", test with different email |
| **DNS not working** | Wait 10-30 min, verify CNAME = `cname.vercel-dns.com` |
| **SSL error** | Wait up to 24 hours, check DNS at dnschecker.org |

**Still stuck?** → Read full guide: `FLOWDESK-INTEGRATION-GUIDE.md`

---

## 📋 Files You Need

1. **FLOWDESK-INTEGRATION-GUIDE.md** - Complete setup (read this if stuck)
2. **EMAIL-SEQUENCES-FLOWDESK.md** - Copy/paste email templates
3. **FLOWDESK-COMPLETION-REPORT.md** - What was built + testing checklist
4. **QUICK-START.md** - This file (30-min speed run)

**Test script:** `scripts/test-flowdesk.ts`  
**FlowDesk client:** `src/lib/flodesk.ts`  
**Updated route:** `src/app/api/signup/route-with-flowdesk.ts`

---

## 🎯 Success = All These ✅

- [ ] FlowDesk API key configured
- [ ] Test script passes
- [ ] Email templates imported
- [ ] Workflows activated
- [ ] Custom domain working with SSL
- [ ] End-to-end test successful
- [ ] Deployed to production

**When all ✅ → LAUNCH!** 🚀

---

**Launch Target:** Feb 10, 2026  
**Time Required:** 30 minutes (if fast) to 3 hours (if methodical)  
**Confidence:** 95% ready

**GO! 💪**

# PsalMix Waitlist Pre-Launch Checklist
## Everything Needed Before Going Live

---

## ✅ STRATEGY (DONE)
- [x] Competitive analysis complete
- [x] Pricing strategy finalized ($9.99 / $4.99 Founding)
- [x] Referral tier structure defined
- [x] Marketing plan written
- [x] Dashboard page created

## 📝 CONTENT (DONE)
- [x] Landing page copy written
- [x] Email sequences written (welcome, milestones, launch)
- [x] Ad copy concepts (8 ads)
- [x] Press kit ready
- [x] Origin story draft (needs McKinzie personalization)
- [x] Influencer outreach templates

## 🎯 McKINZIE ACTION ITEMS

### Decisions Needed
- [ ] **Confirm price:** $9.99 standard, $4.99 Founding Family (50% off)
- [ ] **Confirm tiers:** 3/10/25/50 referral structure
- [ ] **Confirm Founding Family cap:** 500 families

### Content to Personalize
- [ ] Add "The Incident" to origin story (specific breaking point moment)
- [ ] Record founder video (optional but powerful)
- [ ] Provide photo for press kit
- [ ] Review/approve testimonials when available

### Accounts to Set Up
- [ ] Create waitlist email (waitlist@psalmix.com or use main)
- [ ] Set up email service (ConvertKit, Klaviyo, or Mailchimp)
- [ ] Create UTM tracking links
- [ ] Set up analytics (GA4 for waitlist site)

## 🛠️ TECHNICAL BUILD

### Waitlist Site
- [ ] Finalize Next.js waitlist project
- [ ] Create Supabase tables:
  - [ ] `waitlist_users` (email, position, referral_code, created_at)
  - [ ] `referrals` (referrer_id, referee_id, created_at)
  - [ ] `rewards` (user_id, tier, unlocked_at)
- [ ] Build signup API endpoint
- [ ] Build referral tracking logic
- [ ] Build position calculation
- [ ] Implement tier/reward logic
- [ ] Connect email service for automated sequences
- [ ] Add fraud prevention (rate limiting, email verification)
- [ ] Mobile responsive testing
- [ ] Deploy to Vercel
- [ ] Connect domain (waitlist.psalmix.com)

### Landing Page UI
- [ ] Implement hero section with signup form
- [ ] Implement problem/solution sections
- [ ] Implement Founding Family section with progress bar
- [ ] Implement referral tiers visual
- [ ] Implement FAQ accordion
- [ ] Add social share buttons
- [ ] Add countdown timer (optional)
- [ ] Test on mobile, tablet, desktop

### Post-Signup Dashboard
- [ ] Show user's position
- [ ] Show referral link
- [ ] Show referral count
- [ ] Show current tier and progress to next
- [ ] Show rewards unlocked
- [ ] Social share buttons

### Admin Dashboard
- [ ] View all signups
- [ ] Export to CSV
- [ ] View referral leaderboard
- [ ] Manual reward override (if needed)
- [ ] Send bulk emails

## 📧 EMAIL SETUP

### Email Service Configuration
- [ ] Create email list for waitlist
- [ ] Set up welcome automation (immediate)
- [ ] Set up Day 2 story email
- [ ] Set up Day 4 reminder email
- [ ] Set up milestone trigger emails (1st referral, 3, 10, 25, 50)
- [ ] Create email templates with branding
- [ ] Test all automations

### Email Testing
- [ ] Test welcome email flow
- [ ] Test referral tracking triggers emails
- [ ] Test unsubscribe works
- [ ] Check spam score
- [ ] Test on Gmail, Outlook, Apple Mail

## 🎨 DESIGN ASSETS

### Graphics Needed
- [ ] Social share image (1200x630 for Facebook/LinkedIn)
- [ ] Instagram square (1080x1080)
- [ ] Instagram story (1080x1920)
- [ ] Comparison chart graphic (PsalMix vs Spotify)
- [ ] Referral tier infographic
- [ ] Founding Family badge mockup
- [ ] Email header image

### Brand Assets
- [ ] Logo (light and dark versions) ✅ (from main PsalMix)
- [ ] Color palette documented ✅
- [ ] Font files/links ✅

## 🚀 LAUNCH SEQUENCE

### Week Before Launch
- [ ] Soft launch to 50-100 close contacts
- [ ] Monitor for bugs/issues
- [ ] Adjust copy based on feedback
- [ ] Prep influencer outreach
- [ ] Schedule social posts

### Launch Day
- [ ] Send "we're live" email to beta list
- [ ] Post on McKinzie's social accounts
- [ ] Send first batch of influencer DMs
- [ ] Monitor signups in real-time
- [ ] Respond to any issues immediately

### Week 1 Post-Launch
- [ ] Daily monitoring of signups + referral rate
- [ ] Send follow-up to non-openers
- [ ] Engage with social mentions
- [ ] Reach out to early super-referrers
- [ ] First progress update email

## 📊 METRICS TO TRACK

### Daily
- [ ] Total signups
- [ ] New signups today
- [ ] Referral rate (% who share)
- [ ] Conversion rate (visitors → signups)

### Weekly
- [ ] Viral coefficient
- [ ] Tier distribution (% at each tier)
- [ ] Email open/click rates
- [ ] Top referrers leaderboard
- [ ] Cost per signup (if running ads)

### Targets
- [ ] Week 1: 500 signups
- [ ] Week 4: 2,500 signups
- [ ] Week 8: 7,500 signups
- [ ] Week 12: 10,000+ signups
- [ ] Referral rate: 40%+
- [ ] Viral coefficient: 1.3+

## 🔒 LEGAL

- [ ] Privacy policy for waitlist
- [ ] Terms of service
- [ ] Email compliance (CAN-SPAM, unsubscribe)
- [ ] Sweepstakes/contest rules (if applicable)

---

## PRIORITY ORDER

### Must Have (Before Any Launch)
1. Waitlist site deployed and working
2. Signup form captures emails
3. Referral links work
4. Welcome email sends automatically
5. Position tracking works

### Should Have (Before Public Push)
1. All tier rewards logic
2. Post-signup dashboard
3. Social share buttons
4. Mobile responsive
5. Admin view of signups

### Nice to Have (Can Add Later)
1. Golden Ticket feature
2. Admin dashboard
3. Countdown timer
4. Animated tier unlocks
5. Leaderboard

---

*Use this as your go/no-go checklist before launch.*

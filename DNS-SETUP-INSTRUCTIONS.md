# DNS Setup for waitlist.psalmix.com

## Quick Setup (5 minutes)

### Step 1: Add Domain in Vercel

1. Go to: https://vercel.com/mmcmedias-projects/psalmix-waitlist/settings/domains
2. Click "Add Domain"
3. Enter: `waitlist.psalmix.com`
4. Click "Add"

Vercel will show you the DNS records needed.

---

### Step 2: Add DNS Record at Your Registrar

Go to wherever you manage psalmix.com DNS (GoDaddy, Namecheap, Cloudflare, etc.)

**Add this record:**

| Type | Name | Value |
|------|------|-------|
| CNAME | waitlist | cname.vercel-dns.com |

**Or if using the root domain (psalmix.com):**

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |

---

### Step 3: Wait for Propagation

- Usually takes 1-10 minutes
- Can take up to 48 hours in rare cases
- Vercel will show a green checkmark when ready

---

### Step 4: SSL Certificate

Vercel automatically provisions an SSL certificate once DNS is verified. No action needed.

---

## Troubleshooting

**"DNS not configured correctly"**
- Double-check the CNAME value (must be exactly `cname.vercel-dns.com`)
- Make sure there's no trailing dot
- Wait a few more minutes for propagation

**"Domain already in use"**
- The domain might be connected to another Vercel project
- Remove it from the other project first

---

## Alternative: Use Subdomain of Main App

If psalmix.com is already on Vercel, you can add `waitlist.psalmix.com` directly in that project's domain settings, then set up a rewrite/redirect to the waitlist app.

---

## Need Help?

If you're not sure where your DNS is managed, check:
1. Your domain registrar account (GoDaddy, Namecheap, Google Domains, etc.)
2. Cloudflare (if you use it for DNS)
3. Your hosting provider's DNS settings

Just let me know and I can walk you through the specific steps for your provider.

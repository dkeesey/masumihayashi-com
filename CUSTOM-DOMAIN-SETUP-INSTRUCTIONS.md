# Custom Domain Setup Instructions

**Goal**: Set up `images.masumihayashi.com` as custom domain for R2 bucket

**Status**: Requires Cloudflare Dashboard access (Zone ID needed)

---

## Setup Steps

### Step 1: Get Zone ID

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select domain: **masumihayashi.com**
3. Scroll down to **API** section in right sidebar
4. Copy **Zone ID**

### Step 2: Add Custom Domain to R2 (via CLI)

```bash
# Replace YOUR_ZONE_ID with actual zone ID from dashboard
wrangler r2 bucket domain add masumi-hayashi-artworks \
  --domain images.masumihayashi.com \
  --zone-id YOUR_ZONE_ID \
  --min-tls 1.2
```

**Expected output**:
```
✨ Successfully added custom domain 'images.masumihayashi.com'
📝 Add this DNS record in Cloudflare:

Type: CNAME
Name: images
Target: masumi-hayashi-artworks.r2.dev (or bucket-specific URL)
Proxy: Enabled (orange cloud)
```

### Step 3: Add DNS Record (via Dashboard or CLI)

**Option A: Cloudflare Dashboard**

1. Go to DNS settings for masumihayashi.com
2. Add new record:
   - **Type**: CNAME
   - **Name**: images
   - **Target**: `pub-3e1db27a71654e90b601053ceddb8b8f.r2.dev`
   - **Proxy status**: Proxied (orange cloud)
   - **TTL**: Auto

**Option B: CLI (if zone ID available)**

```bash
# Get zone ID first (see Step 1)
ZONE_ID="your_zone_id_here"

# Add DNS record
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "CNAME",
    "name": "images",
    "content": "pub-3e1db27a71654e90b601053ceddb8b8f.r2.dev",
    "proxied": true
  }'
```

### Step 4: Wait for DNS Propagation (1-5 minutes)

```bash
# Check DNS propagation
dig images.masumihayashi.com

# Should show Cloudflare IPs (proxied)
```

### Step 5: Test Custom Domain

```bash
# Test image access via custom domain
curl -I https://images.masumihayashi.com/artworks/manzanar-internment-camp-monument-1440w.jpg

# Should return: HTTP/2 200 OK
```

### Step 6: Update Code to Use Custom Domain

Once custom domain is working:

```typescript
// src/components/ResponsiveImage.astro
// Before (current):
const basePath = "https://pub-3e1db27a71654e90b601053ceddb8b8f.r2.dev/artworks";

// After (custom domain):
const basePath = "https://images.masumihayashi.com/artworks";
```

### Step 7: Commit and Deploy

```bash
git add src/components/ResponsiveImage.astro
git commit -m "Switch to custom domain for R2 images (images.masumihayashi.com)"
git push origin main
```

---

## Why This Setup?

### Benefits of Custom Domain

1. **Portability**
   - Easy to switch CDN providers later
   - Just update DNS, no code changes needed

2. **Branding**
   - Professional branded domain
   - Builds trust vs random hash

3. **SEO**
   - Better domain authority
   - Consistent branding across all URLs

4. **Flexibility**
   - Can add image processing layer later
   - Custom cache policies
   - Advanced routing

### Cost

- Custom domain: **$0/month** (included in Cloudflare)
- DNS record: **$0/month** (included)
- SSL certificate: **$0/month** (auto-provisioned)

---

## Troubleshooting

### DNS Not Resolving

```bash
# Clear local DNS cache (macOS)
sudo dscacheutil -flushcache

# Check propagation
dig images.masumihayashi.com +short
```

### SSL Certificate Error

- Wait 1-5 minutes for Cloudflare to provision SSL cert
- Ensure CNAME is "Proxied" (orange cloud)
- Check SSL/TLS mode is "Full (strict)" in Cloudflare

### Images Still Return 404

- Verify R2 bucket has custom domain attached
- Check CNAME target matches R2 bucket URL
- Ensure images uploaded to `/artworks/` path in bucket

---

## Current Status

- [x] R2 bucket created: masumi-hayashi-artworks
- [x] Public dev URL enabled: pub-3e1db27a71654e90b601053ceddb8b8f.r2.dev
- [x] All 804 images uploaded successfully
- [x] Code updated to use R2 public URL
- [ ] Custom domain added to R2 bucket (requires Zone ID)
- [ ] DNS CNAME record created
- [ ] Custom domain tested and verified
- [ ] Code updated to use custom domain

---

**Next Action**: Get Zone ID from Cloudflare Dashboard and run Step 2

**Created**: 2025-10-27
**Priority**: Medium (site works with pub-*.r2.dev URL, custom domain is enhancement)

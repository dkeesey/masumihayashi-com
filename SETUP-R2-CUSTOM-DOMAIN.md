# Setting Up Custom R2 Domain

**Goal**: Replace `pub-3e1db27a71654e90b601053ceddb8b8f.r2.dev` with `images.masumihayashi.com`

---

## Why Do This?

### Problems with Default R2 URL
- ❌ Vendor lock-in (hard to switch CDNs)
- ❌ Ugly, unmemorable URLs
- ❌ No branding
- ❌ Trust issues (random hash domain)

### Benefits of Custom Domain
- ✅ **Portability**: Switch CDN providers by updating DNS only
- ✅ **Professional**: Branded domain builds trust
- ✅ **SEO**: Better domain authority
- ✅ **Flexibility**: Easy to add image processing layer later
- ✅ **Control**: Custom cache policies

---

## Setup Steps

### Step 1: Add Custom Domain to R2 Bucket

```bash
# Connect custom domain to R2 bucket
wrangler r2 bucket domain add masumi-hayashi-artworks --domain images.masumihayashi.com
```

**Expected Output**:
```
✨ Successfully added custom domain 'images.masumihayashi.com'
📝 Add this DNS record:

Type: CNAME
Name: images
Value: masumi-hayashi-artworks.r2.dev
Proxy: Yes (Cloudflare proxied)
```

### Step 2: Add DNS Record

**Where**: Cloudflare Dashboard → DNS → Records

**Add CNAME Record**:
```
Type: CNAME
Name: images
Target: pub-3e1db27a71654e90b601053ceddb8b8f.r2.dev
Proxy Status: Proxied (orange cloud)
TTL: Auto
```

**Important**:
- Enable "Proxied" (orange cloud icon)
- This enables Cloudflare's CDN and SSL

### Step 3: Wait for DNS Propagation

```bash
# Check DNS propagation (usually 1-5 minutes)
dig images.masumihayashi.com

# Should show Cloudflare IPs
```

### Step 4: Test Custom Domain

```bash
# Test image access
curl -I https://images.masumihayashi.com/artworks/manzanar-internment-camp-monument-1440w.jpg

# Should return:
# HTTP/2 200 OK
# content-type: image/jpeg
```

### Step 5: Update Code

**Update ResponsiveImage Component**:

```typescript
// Before (vendor-locked)
const basePath = "https://pub-3e1db27a71654e90b601053ceddb8b8f.r2.dev/artworks";

// After (portable)
const basePath = "https://images.masumihayashi.com/artworks";
```

**File**: `src/components/ResponsiveImage.astro:29`

### Step 6: Test Locally

```bash
npm run dev
open http://localhost:4321

# Verify all images load from new domain
```

### Step 7: Deploy

```bash
git add src/components/ResponsiveImage.astro
git commit -m "Switch to custom domain for R2 images"
git push origin main

# Auto-deploys to production
```

---

## Verification Checklist

- [ ] Custom domain added to R2 bucket
- [ ] DNS CNAME record created
- [ ] DNS propagated (test with `dig`)
- [ ] Test URL returns 200 OK
- [ ] Code updated to use custom domain
- [ ] Local dev server shows images
- [ ] Deployed to production
- [ ] Production site shows images

---

## Troubleshooting

### DNS Not Resolving

**Problem**: `dig images.masumihayashi.com` shows no results

**Solution**:
1. Check DNS record in Cloudflare dashboard
2. Wait 5-10 minutes for propagation
3. Clear local DNS cache: `sudo dscacheutil -flushcache`

### SSL Certificate Error

**Problem**: HTTPS doesn't work on custom domain

**Solution**:
1. Ensure CNAME is "Proxied" (orange cloud)
2. Wait for Cloudflare to provision SSL cert (1-5 min)
3. Check SSL/TLS mode in Cloudflare is "Full (strict)"

### Images Return 404

**Problem**: Images accessible on old domain, not new domain

**Solution**:
1. Verify R2 bucket has custom domain attached
2. Check CNAME target matches R2 bucket URL
3. Ensure images are uploaded to `/artworks/` path

### Images Load from Old Domain

**Problem**: Code still using `pub-*.r2.dev` URLs

**Solution**:
1. Update `ResponsiveImage.astro` basePath
2. Clear Astro build cache: `npm run clean`
3. Rebuild: `npm run build`
4. Redeploy

---

## Alternative Approach: Cloudflare Tunnel

If Wrangler doesn't support custom domains directly, use Cloudflare Tunnel:

### Step 1: Create Cloudflare Worker

```javascript
// Worker: images.masumihayashi.com
export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Rewrite domain
    const r2Url = url.href.replace(
      'images.masumihayashi.com',
      'pub-3e1db27a71654e90b601053ceddb8b8f.r2.dev'
    );

    // Fetch from R2
    const response = await fetch(r2Url);

    // Add custom headers
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new Response(response.body, {
      status: response.status,
      headers
    });
  }
}
```

### Step 2: Deploy Worker

```bash
wrangler deploy
```

### Step 3: Add Route

**Cloudflare Dashboard** → Workers → Routes:
```
Route: images.masumihayashi.com/*
Worker: images-proxy
```

---

## Cost

**Custom Domain**: $0/month (included in Cloudflare)
**DNS Record**: $0/month (included)
**Worker** (if needed): $0/month (100k requests/day free)

---

## Migration Timeline

1. **Setup** (5 minutes)
   - Add custom domain to R2
   - Create DNS record

2. **DNS Propagation** (1-5 minutes)
   - Wait for DNS to update

3. **Code Update** (2 minutes)
   - Update ResponsiveImage component
   - Test locally

4. **Deploy** (2 minutes)
   - Commit and push
   - Cloudflare auto-deploys

**Total**: ~15 minutes

---

## Future Benefits

Once you have `images.masumihayashi.com`, you can easily add:

1. **Image Processing**
   - Resize on-the-fly: `?w=800&h=600`
   - Format conversion: `?format=webp`
   - Quality optimization: `?q=85`

2. **Multi-CDN**
   - Load balance between R2 and Cloudinary
   - Failover to backup CDN

3. **Advanced Caching**
   - Custom cache rules per URL pattern
   - Vary by device type
   - Regional caching strategies

4. **Analytics**
   - Track image usage
   - Monitor bandwidth
   - Identify popular images

---

## Recommended Action

**Do This Now**:
1. Add custom domain to R2 bucket
2. Create DNS CNAME record
3. Update code after DNS propagates
4. Deploy

**Estimated Time**: 15 minutes
**Risk**: Low (can rollback by reverting DNS)
**Benefit**: High (future-proof architecture)

---

**Created**: 2025-10-27
**Status**: Ready to implement

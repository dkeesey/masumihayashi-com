# Cloudflare Pages Deployment Guide

## Overview

This guide walks you through deploying masumihayashi.com to Cloudflare Pages with full configuration for the complete Cloudflare stack.

**Deployment Target**: https://masumihayashi.com
**Platform**: Cloudflare Pages (Static Site Hosting)
**Build Framework**: Astro 5.14+
**Expected Build Time**: ~2-3 seconds
**Expected Site Size**: ~2-5MB

## Why Cloudflare Pages?

### Performance
- **Global CDN**: 330+ cities worldwide
- **Edge caching**: Sub-50ms response times globally
- **HTTP/3 & QUIC**: Latest protocols enabled by default
- **Smart routing**: Argo Smart Routing for fastest paths

### Cost
- **Free tier includes**:
  - Unlimited bandwidth (vs. 100GB on Netlify/Vercel)
  - Unlimited sites
  - 500 builds/month
  - 1 build at a time
- **Zero egress fees**: Unlike AWS/GCP
- **No bandwidth surprises**: Critical for image-heavy sites

### Developer Experience
- **Git integration**: Auto-deploy on push
- **Preview deployments**: Every PR gets a URL
- **Rollback**: One-click rollback to any deployment
- **Build caching**: Faster subsequent builds

### Cloudflare Ecosystem
- **MCP Support**: Official Claude MCP server for Cloudflare
- **AI Gateway**: 30-70% savings on Claude API calls
- **Workers**: Serverless functions at edge
- **D1**: SQLite database at edge (auth, user data)
- **R2**: S3-compatible storage (zero egress)
- **Access**: Enterprise-grade authentication
- **Analytics**: Privacy-first, no tracking

## Prerequisites

### Required
- Cloudflare account (free tier is fine)
- GitHub repository with this codebase
- Domain registrar access (for DNS)

### Recommended
- GitHub account with admin access to repo
- Domain already registered (masumihayashi.com)

## Step 1: Prepare Repository

### 1.1 Ensure Clean Build

```bash
# Clean previous builds
npm run clean

# Run production build
npm run build

# Verify output
ls -lh dist/
```

**Expected**: `dist/` directory with HTML, CSS, JS, images

### 1.2 Push to GitHub

```bash
# Check current remote
git remote -v

# If not set, add origin
git remote add origin https://github.com/YOUR_USERNAME/masumihayashi-com.git

# Push to main
git push -u origin main
```

## Step 2: Create Cloudflare Pages Project

### 2.1 Connect to Cloudflare

1. Go to https://dash.cloudflare.com/
2. Click "Workers & Pages" in left sidebar
3. Click "Create application"
4. Select "Pages" tab
5. Click "Connect to Git"

### 2.2 Connect GitHub Repository

1. Click "Connect GitHub"
2. Authorize Cloudflare Pages (if first time)
3. Select "masumihayashi-com" repository
4. Click "Begin setup"

### 2.3 Configure Build Settings

**Project name**: `masumihayashi-com`

**Production branch**: `main`

**Build settings**:
- **Framework preset**: Astro
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: (leave blank)

**Environment variables** (click "Add variable"):
```
PUBLIC_CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name
PUBLIC_SITE_URL = https://masumihayashi.com
```

Optional HubSpot variables (if using forms):
```
PUBLIC_HUBSPOT_PORTAL_ID = your_portal_id
HUBSPOT_ACCESS_TOKEN = your_access_token
HUBSPOT_PERSONAL_ACCESS_KEY = your_key
```

**Node version**:
- Click "Environment variables"
- Add: `NODE_VERSION = 20`

**Build timeout**: (default is fine, we build in ~2s)

### 2.4 Deploy

1. Click "Save and Deploy"
2. Watch build logs (should complete in ~20-30 seconds)
3. Get deployment URL: `masumihayashi-com.pages.dev`

## Step 3: Configure Custom Domain

### 3.1 Add Custom Domain

In Cloudflare Pages project settings:

1. Click "Custom domains" tab
2. Click "Set up a custom domain"
3. Enter: `masumihayashi.com`
4. Click "Continue"

Cloudflare will provide DNS records to add.

### 3.2 Update DNS Records

**If domain is on Cloudflare** (recommended):
1. Cloudflare automatically adds CNAME record
2. No action needed - domain active in ~1 minute

**If domain is on another registrar** (GoDaddy, Namecheap, etc.):
1. Add CNAME record:
   - **Name**: `@` (root domain)
   - **Value**: `masumihayashi-com.pages.dev`
   - **TTL**: Auto or 1 hour
2. Add CNAME for www:
   - **Name**: `www`
   - **Value**: `masumihayashi-com.pages.dev`
   - **TTL**: Auto or 1 hour
3. Wait 5-60 minutes for DNS propagation

**Recommended**: Transfer domain to Cloudflare:
- Free DNS hosting
- Automatic HTTPS
- Advanced features (Workers, Pages integration)
- At-cost domain pricing (no markup)

### 3.3 Enable www Redirect

In Cloudflare Pages:
1. Go to "Custom domains"
2. Add `www.masumihayashi.com`
3. Enable "Redirect www to root domain"

### 3.4 Verify HTTPS

Cloudflare automatically provisions SSL certificate.

Check:
- https://masumihayashi.com (should work)
- http://masumihayashi.com (should redirect to HTTPS)
- https://www.masumihayashi.com (should redirect to root)

## Step 4: Configure Deployment Settings

### 4.1 Branch Deployments

Cloudflare automatically deploys:
- **Production**: `main` branch → masumihayashi.com
- **Preview**: All other branches → `branch-name.masumihayashi-com.pages.dev`
- **Pull Requests**: Every PR → unique preview URL

No configuration needed - it just works!

### 4.2 Build Caching

Cloudflare caches `node_modules` automatically:
- First build: ~30 seconds
- Subsequent builds: ~5-10 seconds

To clear cache:
1. Go to project settings
2. Click "Clear build cache"
3. Trigger new deployment

### 4.3 Rollback Setup

Every deployment is preserved:
1. Go to "Deployments" tab
2. See all deployments with timestamps
3. Click any deployment → "Rollback to this deployment"

Zero-downtime rollback in ~10 seconds.

## Step 5: Advanced Configuration

### 5.1 Headers Configuration

Create `public/_headers` for security/performance:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

# Cache static assets
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=31536000, immutable
```

### 5.2 Redirects Configuration

Create `public/_redirects` for URL management:

```
# Redirect old URLs (if migrating from another site)
/old-path/* /new-path/:splat 301

# Trailing slash redirect
/* / 200

# Force HTTPS
http://* https://:splat 301!
```

### 5.3 Functions (Optional)

For server-side logic, create `functions/` directory:

```typescript
// functions/api/hello.ts
export async function onRequest(context) {
  return new Response('Hello from Cloudflare Pages Functions!', {
    headers: { 'Content-Type': 'text/plain' }
  });
}
```

Deployed to: `https://masumihayashi.com/api/hello`

## Step 6: Monitoring & Analytics

### 6.1 Enable Web Analytics

1. In Cloudflare dashboard → "Analytics" → "Web Analytics"
2. Click "Add a site"
3. Enter `masumihayashi.com`
4. Copy JavaScript snippet
5. Add to `src/layouts/Layout.astro` (optional - privacy-first, no cookies)

OR use Workers Analytics (automatic, no JavaScript needed):
- Included free with Pages
- Access in "Analytics" tab
- Real-time visitor data, no tracking cookies

### 6.2 Monitor Build Health

In project "Deployments" tab:
- Build status (success/failure)
- Build time trends
- Error logs
- Preview URLs

### 6.3 Set Up Alerts

In project settings → "Notifications":
- Deploy succeeded/failed
- Build time alerts
- Custom webhooks (Slack, Discord, email)

## Step 7: Cloudflare AI Gateway (Optional)

For Claude API cost savings (30-70% reduction):

### 7.1 Create AI Gateway

1. Cloudflare dashboard → "AI" → "AI Gateway"
2. Click "Create gateway"
3. Name: `masumihayashi-gateway`
4. Provider: Anthropic
5. Copy gateway URL

### 7.2 Configure in Code

Update API calls to use gateway:

```typescript
// Before
const response = await fetch('https://api.anthropic.com/v1/messages', {
  headers: { 'x-api-key': ANTHROPIC_API_KEY }
});

// After
const response = await fetch('https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/masumihayashi-gateway/anthropic/v1/messages', {
  headers: { 'x-api-key': ANTHROPIC_API_KEY }
});
```

Benefits:
- Caching: Identical requests return cached results
- Rate limiting: Protect API budget
- Analytics: Track usage/costs
- Fallback: Automatic retry on failures

## Step 8: Additional Cloudflare Services

### 8.1 Cloudflare D1 (Database)

For user auth, favorites, comments:

```bash
# Install wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create masumihayashi-db

# Create tables
wrangler d1 execute masumihayashi-db --file=schema.sql
```

### 8.2 Cloudflare R2 (Storage)

For user uploads, documents:

```bash
# Create R2 bucket
wrangler r2 bucket create masumihayashi-uploads

# Configure CORS
wrangler r2 bucket cors put masumihayashi-uploads --rules='[{"AllowedOrigins":["https://masumihayashi.com"],"AllowedMethods":["GET","PUT"],"AllowedHeaders":["*"]}]'
```

### 8.3 Cloudflare Access (Authentication)

For admin pages, protected content:

1. Dashboard → "Zero Trust" → "Access"
2. Create application for `masumihayashi.com/admin`
3. Configure identity providers (Google, GitHub, email)
4. Set access policies (email whitelist, etc.)

No code changes needed - Cloudflare handles auth at edge.

## Step 9: Optimization

### 9.1 Enable Automatic Minification

Cloudflare Pages automatically minifies:
- ✅ HTML
- ✅ CSS
- ✅ JavaScript
- ✅ Images (lossless)

No configuration needed.

### 9.2 Enable Early Hints

In Cloudflare dashboard:
1. "Speed" → "Optimization"
2. Enable "Early Hints"
3. Speeds up page loads by 30%

### 9.3 Enable Rocket Loader (Optional)

Defer JavaScript loading:
1. "Speed" → "Optimization"
2. Enable "Rocket Loader"
3. Test thoroughly - may break some JavaScript

**Recommendation**: Test with Rocket Loader OFF first, enable later if needed.

## Step 10: Testing & Verification

### 10.1 Test Deployment

```bash
# Check site is live
curl -I https://masumihayashi.com

# Expected: HTTP/2 200, Cloudflare headers
```

### 10.2 Verify Performance

Tools:
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **WebPageTest**: https://webpagetest.org/
- **GTmetrix**: https://gtmetrix.com/

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### 10.3 Verify Security

```bash
# Check security headers
curl -I https://masumihayashi.com | grep -i "x-frame\|x-content\|strict-transport"
```

Expected:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security` (after HTTPS enabled)

## Troubleshooting

### Build Fails

**Check build logs**:
1. Go to "Deployments" tab
2. Click failed deployment
3. Read error messages

**Common issues**:
- Missing environment variables
- Node version mismatch (set `NODE_VERSION=20`)
- npm install failures (check package.json)

**Fix**:
1. Fix issue locally
2. Test with `npm run build`
3. Commit and push
4. Cloudflare auto-deploys

### Domain Not Resolving

**Check DNS**:
```bash
dig masumihayashi.com
```

**Expected**: CNAME pointing to `masumihayashi-com.pages.dev`

**If wrong**:
1. Update CNAME in DNS provider
2. Wait 5-60 minutes
3. Check again with `dig`

### HTTPS Not Working

**Wait**: SSL cert provisioning takes 1-5 minutes

**If still broken**:
1. Cloudflare dashboard → "SSL/TLS"
2. Set to "Full (strict)"
3. Wait 5 minutes
4. Test again

### Images Not Loading

**Check Cloudinary**:
1. Verify `PUBLIC_CLOUDINARY_CLOUD_NAME` is set
2. Check images exist in Cloudinary
3. Test URL directly: `https://res.cloudinary.com/YOUR_CLOUD/image/upload/...`

**Check CORS** (if using client-side fetch):
1. Cloudinary dashboard → Settings → Security
2. Add `https://masumihayashi.com` to allowed domains

## Maintenance

### Regular Updates

Cloudflare automatically:
- ✅ Updates TLS certificates (every 90 days)
- ✅ Updates edge network
- ✅ Patches security vulnerabilities
- ✅ Optimizes routing

**You only need to**:
- Deploy code changes (automatic on git push)
- Monitor build status
- Update dependencies periodically

### Monitoring Checklist

**Weekly**:
- Check deployment status
- Review analytics (traffic, performance)
- Check error logs (if any)

**Monthly**:
- Update npm dependencies: `npm outdated`
- Review security headers
- Check Core Web Vitals

**Quarterly**:
- Review Cloudflare bill (should be $0 on free tier)
- Update Node version if needed
- Review and optimize images

## Cost Breakdown

### Free Tier (Current Usage)

**Cloudflare Pages**:
- Hosting: $0/month (unlimited bandwidth)
- Builds: $0/month (500 builds included)
- SSL: $0/month (automatic)

**Cloudflare Workers** (if using Functions):
- 100,000 requests/day: $0/month
- Over 100k: $0.50 per million requests

**Cloudflare D1** (if using database):
- 5 million reads/month: $0
- 100,000 writes/month: $0
- Over limits: $0.001 per 1k reads, $1 per million writes

**Cloudflare R2** (if using storage):
- 10 GB storage: $0
- Over 10 GB: $0.015/GB/month
- Zero egress fees (vs. $0.09/GB on S3)

**Total estimated cost**: **$0-5/month** depending on usage

vs. Traditional stack (Netlify + Supabase + S3):
- Netlify Pro: $19/month (for bandwidth)
- Supabase: $25/month (for database)
- AWS S3 + CloudFront: $20-50/month (for storage + CDN)
- **Total**: $60-95/month

**Savings**: $60-95/month = $720-1,140/year

## Support

### Cloudflare Resources
- **Status**: https://www.cloudflarestatus.com/
- **Community**: https://community.cloudflare.com/
- **Docs**: https://developers.cloudflare.com/pages/
- **Discord**: https://discord.gg/cloudflaredev

### Astro Resources
- **Docs**: https://docs.astro.build/
- **Discord**: https://astro.build/chat
- **Deployment guide**: https://docs.astro.build/en/guides/deploy/cloudflare/

## Next Steps

After deployment:
1. ✅ Set up monitoring and alerts
2. ✅ Configure AI Gateway for Claude API
3. ✅ Add D1 database for user features
4. ✅ Implement authentication with Access
5. ✅ Set up analytics and tracking
6. ✅ Configure custom functions for API endpoints
7. ✅ Optimize images with Cloudflare Images (optional)
8. ✅ Set up Workers for advanced features

---

**Deployment Guide Version**: 1.0
**Last Updated**: 2025-10-21
**Maintained By**: Dean Keesey for Masumi Hayashi Foundation

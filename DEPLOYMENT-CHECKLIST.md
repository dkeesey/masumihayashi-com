# Cloudflare Pages Deployment Checklist

Quick reference for deploying masumihayashi.com to Cloudflare Pages.

## Pre-Deployment

- [ ] Run local build successfully: `npm run build`
- [ ] Verify all tests pass: `npm run test`
- [ ] Check environment variables in `.env.example`
- [ ] Commit all changes to git
- [ ] Push to GitHub: `git push origin main`

## Cloudflare Pages Setup

### Create Project
- [ ] Go to https://dash.cloudflare.com/
- [ ] Navigate to Workers & Pages
- [ ] Click "Create application" → "Pages"
- [ ] Connect to GitHub repository

### Configure Build
- [ ] Framework preset: **Astro**
- [ ] Build command: `npm run build`
- [ ] Build output directory: `dist`
- [ ] Node version: Add environment variable `NODE_VERSION=20`

### Environment Variables
- [ ] `PUBLIC_CLOUDINARY_CLOUD_NAME` = your_cloud_name
- [ ] `PUBLIC_SITE_URL` = https://masumihayashi.com

Optional (if using HubSpot):
- [ ] `PUBLIC_HUBSPOT_PORTAL_ID` = your_portal_id
- [ ] `HUBSPOT_ACCESS_TOKEN` = your_access_token
- [ ] `HUBSPOT_PERSONAL_ACCESS_KEY` = your_key

### Deploy
- [ ] Click "Save and Deploy"
- [ ] Wait for build to complete (~30 seconds)
- [ ] Verify deployment URL works: `*.pages.dev`

## Custom Domain Setup

### Add Domain
- [ ] Go to "Custom domains" tab
- [ ] Click "Set up a custom domain"
- [ ] Enter: `masumihayashi.com`

### DNS Configuration

**Option A: Domain on Cloudflare** (Recommended)
- [ ] Cloudflare automatically adds CNAME record
- [ ] Domain active in ~1 minute

**Option B: Domain on Another Registrar**
- [ ] Add CNAME record for `@` → `masumihayashi-com.pages.dev`
- [ ] Add CNAME record for `www` → `masumihayashi-com.pages.dev`
- [ ] Wait 5-60 minutes for DNS propagation

### WWW Redirect
- [ ] Add `www.masumihayashi.com` as custom domain
- [ ] Enable "Redirect www to root domain"

### Verify
- [ ] https://masumihayashi.com works
- [ ] http://masumihayashi.com redirects to HTTPS
- [ ] https://www.masumihayashi.com redirects to root
- [ ] SSL certificate is valid (lock icon in browser)

## Post-Deployment

### Performance
- [ ] Test with PageSpeed Insights: https://pagespeed.web.dev/
- [ ] Target scores: Performance 90+, Accessibility 95+, SEO 100
- [ ] Verify images load from Cloudinary
- [ ] Check mobile responsiveness

### Security
- [ ] Verify security headers: `curl -I https://masumihayashi.com`
- [ ] Check for `X-Frame-Options`, `X-Content-Type-Options`
- [ ] Verify HTTPS is enforced

### Monitoring
- [ ] Set up deployment notifications (Settings → Notifications)
- [ ] Enable Web Analytics (optional)
- [ ] Check "Analytics" tab for visitor data

### Optimization (Optional)
- [ ] Enable Early Hints (Speed → Optimization)
- [ ] Review automatic minification (should be on by default)
- [ ] Test Rocket Loader (optional, may break JS)

## Advanced Setup (Optional)

### AI Gateway (30-70% API cost savings)
- [ ] Create AI Gateway: Dashboard → AI → AI Gateway
- [ ] Name: `masumihayashi-gateway`
- [ ] Provider: Anthropic
- [ ] Update API calls to use gateway URL

### D1 Database (for user features)
- [ ] Install wrangler CLI: `npm install -g wrangler`
- [ ] Login: `wrangler login`
- [ ] Create database: `wrangler d1 create masumihayashi-db`
- [ ] Run migrations: `wrangler d1 execute masumihayashi-db --file=schema.sql`

### R2 Storage (for uploads)
- [ ] Create bucket: `wrangler r2 bucket create masumihayashi-uploads`
- [ ] Configure CORS for website access

### Cloudflare Access (authentication)
- [ ] Dashboard → Zero Trust → Access
- [ ] Create application for protected pages
- [ ] Configure identity providers (Google, GitHub, email)

## Continuous Deployment

Auto-deployment is configured:
- ✅ Push to `main` → Deploys to production
- ✅ Push to other branches → Creates preview deployment
- ✅ Pull requests → Get unique preview URLs

## Rollback Procedure

If something goes wrong:
1. Go to "Deployments" tab
2. Find last working deployment
3. Click "Rollback to this deployment"
4. Confirm (takes ~10 seconds)

## Troubleshooting

**Build fails**:
- Check build logs in "Deployments" tab
- Verify environment variables are set
- Test locally: `npm run build`

**Domain not resolving**:
- Check DNS with: `dig masumihayashi.com`
- Wait 5-60 minutes for DNS propagation
- Verify CNAME points to `*.pages.dev`

**Images not loading**:
- Verify `PUBLIC_CLOUDINARY_CLOUD_NAME` is set correctly
- Check Cloudinary dashboard that images exist
- Test Cloudinary URL directly in browser

**HTTPS not working**:
- Wait 1-5 minutes for SSL cert provisioning
- Set SSL/TLS mode to "Full (strict)" in Cloudflare
- Clear browser cache and try again

## Support Resources

- **Cloudflare Status**: https://www.cloudflarestatus.com/
- **Cloudflare Docs**: https://developers.cloudflare.com/pages/
- **Astro Deployment Guide**: https://docs.astro.build/en/guides/deploy/cloudflare/
- **Community**: https://community.cloudflare.com/

## Costs

**Current usage (Free Tier)**:
- Hosting: $0/month (unlimited bandwidth)
- SSL: $0/month (automatic)
- Builds: $0/month (500/month included)

**Expected**: $0-5/month depending on advanced features usage

---

**Last Updated**: 2025-10-21
**Deployment Status**: Ready to deploy

# Deployment Guide - masumihayashi.com

Quick reference for deploying to production.

## Pre-Deployment Checklist

- [ ] Content added (pages, exhibitions, artworks)
- [ ] Cloudinary account configured
- [ ] Environment variables set
- [ ] Build tested locally (`npm run build`)
- [ ] Images loading correctly
- [ ] Navigation working
- [ ] Responsive design verified
- [ ] Accessibility checked

## Option 1: Cloudflare Pages (Recommended)

### Why Cloudflare?
- Fastest global CDN
- Unlimited bandwidth (free tier)
- Zero config for Astro
- Built-in analytics
- Automatic HTTPS

### Setup Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial production site"
   git remote add origin https://github.com/YOUR_USERNAME/masumihayashi-com.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to https://dash.cloudflare.com
   - Pages → Create a project → Connect to Git
   - Select repository: `masumihayashi-com`

3. **Configure Build**
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output**: `dist`

4. **Add Environment Variables**
   - Settings → Environment variables
   - Add: `PUBLIC_CLOUDINARY_CLOUD_NAME`
   - Add: `PUBLIC_SITE_URL`

5. **Deploy**
   - Click "Save and Deploy"
   - Wait ~2 minutes for first build

6. **Configure Domain**
   - Custom domains → Add custom domain
   - Enter: `masumihayashi.com`
   - Follow DNS instructions
   - Wait for SSL certificate (automatic)

### Cloudflare DNS Settings
```
Type: CNAME
Name: @
Target: your-project.pages.dev
Proxy: Enabled (orange cloud)

Type: CNAME  
Name: www
Target: your-project.pages.dev
Proxy: Enabled (orange cloud)
```

---

## Option 2: Netlify (Easiest)

### Why Netlify?
- Drag-and-drop deployment
- Great documentation
- Form handling built-in
- Generous free tier

### Setup Steps

1. **Quick Deploy (No Git)**
   ```bash
   npm run build
   # Drag /dist folder to netlify.com/drop
   ```

2. **Or Git Deploy**
   - Go to https://app.netlify.com
   - Sites → Add new site → Import from Git
   - Connect repository
   - Build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`

3. **Environment Variables**
   - Site settings → Build & deploy → Environment
   - Add: `PUBLIC_CLOUDINARY_CLOUD_NAME`
   - Add: `PUBLIC_SITE_URL`

4. **Custom Domain**
   - Domain settings → Add custom domain
   - Follow DNS instructions
   - SSL automatic via Let's Encrypt

### Netlify DNS Settings
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

---

## Option 3: Vercel

### Why Vercel?
- Excellent developer experience
- Fast builds
- Preview deployments
- Good analytics

### Setup Steps

1. **Connect Repository**
   - Go to https://vercel.com
   - New Project → Import Git repository
   - Select `masumihayashi-com`

2. **Configure**
   - **Framework Preset**: Astro (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Environment Variables**
   - Settings → Environment Variables
   - Add: `PUBLIC_CLOUDINARY_CLOUD_NAME`
   - Add: `PUBLIC_SITE_URL`

4. **Deploy**
   - Click Deploy
   - Wait ~1-2 minutes

5. **Custom Domain**
   - Settings → Domains
   - Add `masumihayashi.com`
   - Configure DNS as instructed
   - SSL automatic

---

## Post-Deployment

### Verify Deployment
- [ ] Visit https://masumihayashi.com
- [ ] Check all pages load
- [ ] Test image optimization
- [ ] Verify navigation works
- [ ] Test on mobile
- [ ] Check View Transitions
- [ ] Verify sitemap: `/sitemap-index.xml`

### SEO Setup
```bash
# Submit sitemap to Google
https://search.google.com/search-console

# Add sitemap URL:
https://masumihayashi.com/sitemap-index.xml
```

### Analytics (Optional)
- **Cloudflare**: Built-in Web Analytics (free)
- **Google Analytics**: Add tracking code to Layout.astro
- **Plausible**: Privacy-friendly alternative

### Performance Monitoring
- Run PageSpeed Insights: https://pagespeed.web.dev
- Target scores: 90+ on all metrics
- Monitor Core Web Vitals

---

## Continuous Deployment

### Auto-Deploy on Git Push
All three platforms support automatic deployments:

1. **Make changes locally**
   ```bash
   # Edit files
   npm run dev  # test locally
   ```

2. **Commit and push**
   ```bash
   git add .
   git commit -m "Update content"
   git push
   ```

3. **Auto-deploy**
   - Platform detects push
   - Runs build automatically
   - Deploys if successful
   - Usually takes 1-2 minutes

### Preview Deployments
- **Cloudflare**: Every push gets preview URL
- **Netlify**: Deploy Previews for PRs
- **Vercel**: Preview deployments for branches

---

## Environment Variables

### Required for All Platforms
```bash
PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
PUBLIC_SITE_URL=https://masumihayashi.com
```

### Setting in Platform

**Cloudflare Pages**:  
Settings → Environment Variables → Production

**Netlify**:  
Site Settings → Build & Deploy → Environment → Environment variables

**Vercel**:  
Settings → Environment Variables → Production

---

## Rollback Strategy

### Cloudflare Pages
- Deployments → View all
- Select previous deployment
- Click "Rollback to this deployment"

### Netlify
- Deploys → Select previous
- Click "Publish deploy"

### Vercel
- Deployments → Previous deployment
- Click Promote to Production

---

## Troubleshooting

### Build Fails
1. Check build logs in platform dashboard
2. Verify environment variables set correctly
3. Test build locally: `npm run build`
4. Check Node.js version (should be 18+)

### Images Not Loading
1. Verify `PUBLIC_CLOUDINARY_CLOUD_NAME` is set
2. Check Cloudinary console for uploaded images
3. Verify image paths in components

### Domain Not Working
1. Wait 24-48 hours for DNS propagation
2. Check DNS settings in registrar
3. Verify SSL certificate is active
4. Try clearing browser cache

### Slow Performance
1. Check Cloudinary is optimizing images
2. Verify View Transitions working
3. Check bundle size in build output
4. Run PageSpeed Insights for specifics

---

## Build Specifications

All platforms need:
- **Node.js**: 18.x or higher
- **Package Manager**: npm
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

---

## Cost Estimates

### Cloudflare Pages
- **Free tier**: Unlimited sites, 500 builds/month
- **Cost**: $0/month (likely stays free)

### Netlify
- **Free tier**: 100GB bandwidth, 300 build minutes
- **Cost**: $0/month (should stay free)
- **Overage**: $19/month if exceeded

### Vercel  
- **Free tier**: 100GB bandwidth
- **Cost**: $0/month (should stay free)
- **Overage**: $20/month if exceeded

**Recommendation**: Start with Cloudflare Pages (most generous free tier)

---

## Support

### Platform Documentation
- **Cloudflare**: https://developers.cloudflare.com/pages
- **Netlify**: https://docs.netlify.com
- **Vercel**: https://vercel.com/docs

### Community
- **Astro Discord**: https://astro.build/chat
- **Cloudflare Discord**: https://discord.cloudflare.com
- **Netlify Forum**: https://answers.netlify.com

---

**Last Updated**: October 18, 2025  
**Tested With**: Astro 5.14.6, Node.js 18+

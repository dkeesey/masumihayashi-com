# Masumi Hayashi - Official Website

Production-ready Astro site for masumihayashi.com, featuring modern web technologies and optimized performance.

## Overview

This is a clean, production-ready implementation of the Masumi Hayashi website, built with:
- **Astro 5.0+** - Modern static site generation
- **React** - For interactive components
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **MDX** - Enhanced markdown with components
- **Cloudinary** - Optimized image delivery

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
- `PUBLIC_CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name

## Project Structure

```
masumihayashi-com/
├── src/
│   ├── components/       # Astro and React components
│   │   ├── ui/          # shadcn components (17 components)
│   │   ├── CloudinaryImage.astro
│   │   └── ZoomableCloudinaryImage.astro
│   ├── content/         # Content collections (exhibitions, artworks)
│   ├── layouts/         # Page layouts with ViewTransitions
│   ├── lib/             # Utilities (cn helper)
│   ├── pages/           # Route pages
│   ├── styles/          # Custom CSS
│   └── theme/           # Theme configuration
├── public/              # Static assets
└── astro.config.mjs     # Astro configuration
```

## Key Features

### Modern UI Components
- 17 shadcn/ui components ready to use
- Consistent design system with custom themes
- Accessible and responsive

### Image Optimization
- Cloudinary integration for optimized delivery
- Automatic format conversion (WebP/AVIF)
- Responsive images with srcset
- Zoomable image viewer component

### Content Collections
- Type-safe content management
- Configured for exhibitions and artworks
- MDX support for rich content

### Performance
- Static site generation (SSG)
- View Transitions API for smooth navigation
- Optimized builds with inline scripts
- Path aliases for clean imports

## Development

### Available Commands

```bash
npm run dev          # Start dev server (localhost:4321)
npm run build        # Build for production
npm run preview      # Preview production build
npm run astro        # Run Astro CLI commands
```

### Path Aliases

Configured aliases for clean imports:
- `@components` → `src/components`
- `@content` → `src/content`
- `@layouts` → `src/layouts`
- `@lib` → `src/lib`
- `@styles` → `src/styles`
- `@theme` → `src/theme`

## Deployment

**Status**: ✅ Ready to deploy to Cloudflare Pages

### Quick Deploy

See the **[Deployment Checklist](DEPLOYMENT-CHECKLIST.md)** for step-by-step instructions.

### Full Documentation

For comprehensive setup including AI Gateway, D1 database, and advanced features, see **[Cloudflare Deployment Guide](CLOUDFLARE-DEPLOYMENT.md)**.

### Recommended: Cloudflare Pages
- **Best performance** (330+ cities worldwide CDN)
- **Unlimited bandwidth** (vs. 100GB on competitors)
- **MCP & API support** for Claude automation
- **AI Gateway**: 30-70% savings on Claude API costs
- **Complete stack**: Pages, Workers, D1, R2, Access
- **Free tier**: $0/month for typical usage

Build command: `npm run build`
Output directory: `dist`
Node version: `20`

### Configuration Files
- `public/_headers` - Security and caching headers
- `public/_redirects` - URL redirects and HTTPS enforcement
- `.env.example` - Environment variables template

### Alternative: Netlify or Vercel
Also supported, but Cloudflare offers better bandwidth limits and integrated AI tools.

## Next Steps

1. **Content Migration**
   - Move exhibitions from old site
   - Import artwork data
   - Add biography/about content

2. **Page Development**
   - Create exhibition gallery pages
   - Build artwork detail pages
   - Add navigation menu

3. **SEO Setup**
   - Configure meta tags
   - Add Open Graph images
   - Submit sitemap to search engines

4. **Production Deployment**
   - Set up domain DNS
   - Configure Cloudinary production account
   - Deploy to Cloudflare Pages

## Related Documentation

- **Prototype**: `/Users/deankeesey/Workspace/dk-sites/mh-com-astro/`
- **Foundation Site**: `/Users/deankeesey/Workspace/dk-sites/mhf-org/`

## Tech Stack

- [Astro](https://astro.build) - Static site framework
- [React](https://react.dev) - UI components
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [Cloudinary](https://cloudinary.com) - Image CDN
- [MDX](https://mdxjs.com) - Enhanced markdown

## Status

**Infrastructure**: ✅ Complete and ready  
**Components**: ✅ Modern and optimized  
**Content**: 🚧 Needs migration  
**Deployment**: 📋 Ready for setup

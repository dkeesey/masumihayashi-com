# masumihayashi.com - Production Site

## Project Overview
Clean, production-ready Astro site for masumihayashi.com featuring modern web technologies and optimized performance.

**Created**: October 18, 2025  
**Status**: Infrastructure complete, ready for content development  
**Build Status**: ✅ Builds successfully

## Quick Commands

### Development
```bash
# Start dev server (localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check

# Clean build artifacts
npm run clean
```

### Directory Navigation
```bash
# View project status
cat PROJECT-STATUS.md

# View full documentation
cat README.md

# Check environment setup
cat .env.example
```

## Tech Stack

### Core Framework
- **Astro 5.14+** - Static site generation
- **React 19** - Interactive components
- **TypeScript** - Type safety (strict mode)

### Styling & UI
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - 17 high-quality components
- **Custom themes** - Primary, family album, artwork

### Features
- **MDX** - Enhanced markdown support
- **View Transitions API** - Smooth page navigation
- **Cloudinary** - Optimized image delivery
- **Sitemap** - Auto-generated for SEO

## Project Structure

```
masumihayashi-com/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn components (17)
│   │   ├── CloudinaryImage.astro
│   │   └── ZoomableCloudinaryImage.astro
│   ├── content/
│   │   └── config.ts              # Content collections config
│   ├── layouts/
│   │   └── Layout.astro           # Main layout with ViewTransitions
│   ├── lib/
│   │   └── utils.ts               # cn() className helper
│   ├── pages/
│   │   └── index.astro            # Homepage (minimal)
│   ├── styles/
│   │   └── photoswipe-custom.css  # Custom PhotoSwipe styles
│   └── theme/
│       └── index.ts               # Theme configuration
├── dist/                          # Build output (208KB)
├── .env.example                   # Environment template
├── astro.config.mjs              # Astro configuration
├── components.json               # shadcn config
├── package.json                  # Dependencies
├── tailwind.config.mjs           # Tailwind with custom themes
├── CLAUDE.md                     # This file
├── PROJECT-STATUS.md             # Detailed status
└── README.md                     # Full documentation
```

## What's Ready

### ✅ Infrastructure (100%)
- Astro framework configured
- React integration working
- Tailwind with custom themes
- Path aliases configured
- Build system optimized
- Environment variables templated

### ✅ Components (100%)
- 17 shadcn/ui components copied
- Cloudinary image components
- Custom theme system
- Utility functions
- All dependencies installed

### ✅ Configuration (100%)
- astro.config.mjs - Production settings
- tailwind.config.mjs - Custom themes
- components.json - shadcn setup
- tsconfig.json - TypeScript strict
- .gitignore - Standard patterns

### 🚧 Content (0%)
- Pages need building
- Content collections empty
- Images not uploaded
- Navigation not created

## Path Aliases

Configured for clean imports:
```typescript
import Button from '@components/ui/button'
import { cn } from '@lib/utils'
import Layout from '@layouts/Layout.astro'
import { artworks } from '@content/artwork'
```

Available aliases:
- `@components` → `src/components`
- `@content` → `src/content`
- `@layouts` → `src/layouts`
- `@lib` → `src/lib`
- `@styles` → `src/styles`
- `@theme` → `src/theme`

## Build Output

**Current**: 208KB (minimal site with index page)  
**Expected**: ~2-5MB (with full content and images)

Build includes:
- Optimized JavaScript bundles
- Sitemap (sitemap-index.xml)
- Static HTML pages
- Minified CSS

## Environment Variables

Required for production:
```bash
PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
PUBLIC_SITE_URL=https://masumihayashi.com
```

Copy `.env.example` to `.env` and configure before deploying.

## Content Collections

Configured schemas (in `src/content/config.ts`):
- **exhibitions** - Exhibition data and markdown
- **artwork** - Artwork metadata
- **camps** - Camp/workshop information
- **family-album** - Family photo albums

Note: Directories don't exist yet (build warnings expected until created).

## shadcn/ui Components Available

17 components ready to use:
- **Primitives**: Button, Card, Input, Label
- **Navigation**: Navigation Menu, Menubar
- **Overlays**: Popover, Sheet
- **Layout**: Scroll Area
- **Custom**: Audio Player, External Link, Back to Top, Table of Contents

## Deployment Ready

Recommended platforms:
1. **Cloudflare Pages** (best performance)
2. **Netlify** (easiest)
3. **Vercel** (great DX)

Build command: `npm run build`  
Output directory: `dist`

## Relationship to Other Projects

### Prototype Reference
**Location**: `/Users/deankeesey/Workspace/dk-sites/mh-com-astro/` (796MB)  
**Purpose**: Development sandbox with full content  
**Status**: Untouched - available for reference

### What Was Copied
- ✅ All shadcn components
- ✅ Cloudinary image components
- ✅ Theme system and configs
- ✅ Layout with ViewTransitions
- ✅ Content collections config
- ✅ Custom styles

### What Was NOT Copied
- ❌ Pages (building fresh)
- ❌ Content data (needs curation)
- ❌ Images (will use CDN)
- ❌ Git history (fresh repo)
- ❌ Documentation files

## Next Steps

### Immediate (Week 1)
1. Create home page with hero
2. Build about/biography page
3. Set up navigation menu
4. Create 404 error page

### Content Setup (Week 2)
1. Define exhibitions schema
2. Create sample exhibition pages
3. Set up artwork schema
4. Import test artworks

### Launch Prep (Week 3-4)
1. Build gallery layouts
2. Implement zoom/lightbox
3. SEO optimization
4. Deploy to Cloudflare Pages

## Common Tasks

### Add New Page
```bash
# Create in src/pages/
touch src/pages/about.astro
```

### Add Exhibition
```bash
# Create content directory if needed
mkdir -p src/content/exhibitions
# Add markdown file
touch src/content/exhibitions/sfmoma-2024.md
```

### Add shadcn Component
```bash
# Example: Add dialog component
npx shadcn@latest add dialog
```

### Update Theme
```typescript
// Edit src/theme/index.ts
export const primaryTheme = {
  colors: {
    // Your custom colors
  }
}
```

## Troubleshooting

### Build Warnings About Missing Directories
**Expected behavior** - Content collection directories don't exist yet. Create them when ready:
```bash
mkdir -p src/content/{exhibitions,artwork,camps,family-album}
```

### Cloudinary Images Not Loading
1. Check `.env` has `PUBLIC_CLOUDINARY_CLOUD_NAME`
2. Verify Cloudinary account is active
3. Ensure images are uploaded to Cloudinary

### TypeScript Errors
```bash
# Run type checking
npm run check

# Install any missing types
npm install -D @types/package-name
```

## Performance Notes

### Current Build Time
~600ms for minimal site

### Optimizations Enabled
- Static site generation (SSG)
- Inline scripts
- View Transitions API
- Client prerendering
- Optimized React includes

### Image Optimization
- Cloudinary automatic format selection
- Responsive images with srcset
- Lazy loading support
- Zoomable viewer for details

## Documentation

- **PROJECT-STATUS.md** - Detailed status tracking
- **README.md** - Full setup and deployment guide
- **.env.example** - Environment variable reference

## Build Metrics

**Last successful build**: October 18, 2025  
**Build time**: 589ms  
**Output size**: 208KB  
**Pages generated**: 1  
**Assets**: 1 sitemap, 1 favicon

---

**Version**: 1.0.0  
**Last Updated**: October 18, 2025  
**Maintained By**: Dean Keesey for Masumi Hayashi Foundation

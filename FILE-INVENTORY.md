# File Inventory - masumihayashi.com Production Site

Complete list of files copied from prototype and created for production.

---

## Root Files

### Documentation
- `README.md` - Full setup and deployment guide
- `PROJECT-STATUS.md` - Detailed project status
- `CLAUDE.md` - Quick reference for Claude sessions
- `DEPLOYMENT.md` - Platform deployment guides
- `SETUP-COMPLETE.md` - Setup completion summary
- `FILE-INVENTORY.md` - This file

### Configuration
- `astro.config.mjs` - Astro configuration with production settings
- `tailwind.config.mjs` - Tailwind with custom themes
- `components.json` - shadcn/ui configuration
- `tsconfig.json` - TypeScript strict mode
- `package.json` - Dependencies and scripts
- `.env.example` - Environment variable template
- `.gitignore` - Git ignore patterns (Astro default)

---

## Source Files (`src/`)

### Components (`src/components/`)

**Cloudinary Components (3 files)**:
- `CloudinaryImage.astro` (5.3K) - Optimized image component
- `CloudinaryImageReact.tsx` (341B) - React wrapper
- `ZoomableCloudinaryImage.astro` (7.4K) - Interactive zoom viewer

**shadcn/ui Components** (`src/components/ui/` - 17 files):
1. `AudioPlayer.tsx` (8.6K)
2. `AudioPlayerSection.tsx` (2.7K)
3. `BackToTopButton.tsx` (1.5K)
4. `button.tsx` (1.7K)
5. `card.tsx` (1.8K)
6. `ExternalLink.tsx` (817B)
7. `ExternalLinkIcon.tsx` (474B)
8. `input.tsx` (824B)
9. `label.tsx` (723B)
10. `menubar.tsx` (7.4K)
11. `navigation-menu.tsx` (4.9K)
12. `NavMenu.tsx` (4.6K)
13. `popover.tsx` (1.0K)
14. `progress.tsx` (790B)
15. `scroll-area.tsx` (1.6K)
16. `sheet.tsx` (4.2K)
17. `TableOfContentsReact.tsx` (2.0K)

### Layouts (`src/layouts/`)
- `Layout.astro` - Main layout with ViewTransitions

### Content (`src/content/`)
- `config.ts` - Content collections configuration
  - Defines schemas for: exhibitions, artwork, camps, family-album

### Utilities (`src/lib/`)
- `utils.ts` - cn() helper for className merging

### Styles (`src/styles/`)
- `photoswipe-custom.css` - Custom PhotoSwipe styles
- `global.css` - Global Tailwind imports (auto-generated)

### Theme (`src/theme/`)
- `index.ts` - Theme configuration
  - Primary theme
  - Family album theme
  - Artwork gallery theme
  - Custom Tailwind plugins

### Pages (`src/pages/`)
- `index.astro` - Homepage (minimal Astro default)

---

## Files Copied from Prototype

### Direct Copies (Exact)
✅ `components.json`
✅ `tailwind.config.mjs`
✅ `src/components/ui/*` (all 17 files)
✅ `src/components/CloudinaryImage.astro`
✅ `src/components/ZoomableCloudinaryImage.astro`
✅ `src/components/CloudinaryImageReact.tsx`
✅ `src/content/config.ts`
✅ `src/layouts/Layout.astro`
✅ `src/styles/photoswipe-custom.css`
✅ `src/theme/index.ts`

### Created from Prototype Reference
✅ `src/lib/utils.ts` (recreated with same code)
✅ `astro.config.mjs` (merged settings from prototype)

---

## Files Created Fresh

### Documentation
✅ `README.md`
✅ `PROJECT-STATUS.md`
✅ `CLAUDE.md`
✅ `DEPLOYMENT.md`
✅ `SETUP-COMPLETE.md`
✅ `FILE-INVENTORY.md`

### Configuration
✅ `.env.example`
✅ `package.json` (updated from Astro default)

### Auto-Generated
✅ `src/styles/global.css` (Astro CLI)
✅ `tsconfig.json` (Astro CLI with updates)
✅ `.gitignore` (Astro CLI)
✅ `package-lock.json` (npm)

---

## Total File Count

### Source Files
- Components: 20 files (17 shadcn + 3 Cloudinary)
- Layouts: 1 file
- Content: 1 file (config)
- Utilities: 1 file
- Styles: 2 files
- Theme: 1 file
- Pages: 1 file

**Total src/**: 27 files

### Root Files
- Documentation: 6 files
- Configuration: 7 files
- Auto-generated: 3 files

**Total root**: 16 files

### Grand Total
**43 files** (excluding node_modules, .git, dist, .astro)

---

## Files NOT Copied (By Design)

### From Prototype
❌ Pages (will build fresh)
❌ Content data (needs curation)
❌ Images (will use Cloudinary CDN)
❌ Node modules (fresh install)
❌ Git history (fresh repository)
❌ Build artifacts (dist, .astro)
❌ Prototype-specific docs

### Why Not Copied
- **Pages**: Need production content, not prototype examples
- **Content**: Will curate and organize separately
- **Images**: Using Cloudinary CDN instead of local files
- **Docs**: Prototype docs not relevant to production site

---

## Dependencies Installed

### Core Dependencies (6)
- `astro@5.14.6` - Framework
- `react@19.2.0` - UI library
- `react-dom@19.2.0` - React renderer
- `@astrojs/react@4.4.0` - Astro React integration
- `@tailwindcss/vite@4.1.14` - Tailwind Vite plugin
- `tailwindcss@4.1.14` - Utility CSS framework

### Integrations (3)
- `@astrojs/mdx@4.3.7` - MDX support
- `@astrojs/sitemap@3.6.0` - Sitemap generation
- `@tailwindcss/typography@0.5.19` - Typography plugin

### Utilities (3)
- `clsx@2.1.1` - Conditional className utility
- `tailwind-merge@3.3.1` - Tailwind class merger
- `class-variance-authority@0.7.1` - Component variants

### Types (2)
- `@types/react@19.2.2` - React TypeScript types
- `@types/react-dom@19.2.2` - React DOM types

**Total**: 14 npm packages (+ dependencies = 486 packages total)

---

## Build Output (`dist/`)

Generated by `npm run build`:
- `index.html` (280B) - Homepage
- `sitemap-index.xml` (188B) - Sitemap index
- `sitemap-0.xml` (382B) - Sitemap entries
- `favicon.svg` (749B) - Favicon
- `_astro/client.Bx7k8SOM.js` (194KB, gzipped: 60KB) - Client bundle

**Total**: 208KB (5 files + _astro directory)

---

## Directory Structure

```
masumihayashi-com/
├── .astro/                    # Build cache (auto-generated)
├── .vscode/                   # VS Code settings (Astro default)
├── dist/                      # Build output (208KB)
├── node_modules/              # Dependencies (185MB)
├── public/                    # Static assets
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn components (17)
│   │   ├── CloudinaryImage.astro
│   │   ├── CloudinaryImageReact.tsx
│   │   └── ZoomableCloudinaryImage.astro
│   ├── content/
│   │   └── config.ts
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   └── index.astro
│   ├── styles/
│   │   ├── global.css
│   │   └── photoswipe-custom.css
│   └── theme/
│       └── index.ts
├── .env.example
├── .gitignore
├── astro.config.mjs
├── CLAUDE.md
├── components.json
├── DEPLOYMENT.md
├── FILE-INVENTORY.md
├── package.json
├── package-lock.json
├── PROJECT-STATUS.md
├── README.md
├── SETUP-COMPLETE.md
├── tailwind.config.mjs
└── tsconfig.json
```

---

## Size Breakdown

### Source Code
- `src/`: ~50KB (without node_modules)
- Root config: ~20KB
- Documentation: ~100KB

### Dependencies
- `node_modules/`: ~185MB
- `dist/`: 208KB (after build)

### Total Project
**185MB** (vs 836MB prototype = 78% smaller)

---

## What's Missing (Expected)

### Content Directories (Will Create Later)
- `src/content/artwork/`
- `src/content/exhibitions/`
- `src/content/camps/`
- `src/content/family-album/`

These directories intentionally don't exist yet. They'll be created when adding content.

### Environment File
- `.env` - Not committed (user must create from .env.example)

### Build Artifacts (Temporary)
- `dist/` - Generated by build, not committed
- `.astro/` - Build cache, not committed

---

## File Permissions

All files have standard permissions:
- Config files: `-rw-r--r--` (644)
- Source files: `-rw-r--r--` (644)
- Directories: `drwxr-xr-x` (755)

No executable scripts in source (all run via npm).

---

## Maintenance Notes

### Files to Update Regularly
- `README.md` - As features are added
- `PROJECT-STATUS.md` - As tasks complete
- `CLAUDE.md` - As context changes
- `package.json` - As dependencies update

### Files to Never Modify
- `components.json` - shadcn config (stable)
- `src/components/ui/*` - shadcn components (update via CLI)
- `.gitignore` - Astro standard (sufficient)

### Files Users Must Create
- `.env` - From .env.example template
- `src/content/*/` - Content directories as needed

---

**Last Updated**: October 18, 2025  
**Total Files**: 43 (excluding auto-generated)  
**Total Size**: 185MB (including node_modules)  
**Status**: ✅ Complete and verified

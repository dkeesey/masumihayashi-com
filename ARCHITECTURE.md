# Architecture & Technical Decisions

> **Purpose**: Document technical architecture, design patterns, and key technical decisions
> **Last Updated**: 2025-10-22
> **Status**: Living document - Update as architecture evolves

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        USERS                            │
│              (Browsers, Search Engines)                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    CDN / EDGE                           │
│          (Cloudflare Pages / Netlify / Vercel)          │
│                                                         │
│  - Static HTML, CSS, JS                                │
│  - Cached at edge locations                            │
│  - HTTPS, DDoS protection                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 ASTRO STATIC SITE                       │
│                 (Pre-rendered HTML)                     │
│                                                         │
│  Pages: Home, About, Exhibitions, etc.                 │
│  Components: React (client) + Astro (server)           │
│  Routing: File-based                                   │
└────┬────────────────────────────┬───────────────────────┘
     │                            │
     ▼                            ▼
┌─────────────────┐    ┌──────────────────────────────────┐
│   CLOUDINARY    │    │      CONTENT COLLECTIONS         │
│                 │    │                                  │
│  - Images       │    │  - Markdown files in git         │
│  - Transforms   │    │  - Exhibitions, artwork, etc.    │
│  - CDN          │    │  - Type-safe queries             │
└─────────────────┘    └──────────────────────────────────┘
```

### Data Flow

```
Build Time (CI/CD):
1. Git push triggers build
2. Astro reads content collections (markdown)
3. Generates static HTML pages
4. Optimizes assets (CSS, JS)
5. Deploys to CDN edge locations

Runtime (User Visit):
1. User requests page
2. CDN serves cached HTML instantly
3. Browser loads CSS, JS (if needed)
4. Client-side React hydrates interactive components
5. Images load from Cloudinary CDN
6. View Transitions API handles navigation
```

---

## Tech Stack Decisions

### Core Framework: Astro

**Decision**: Use Astro 5.14+ as the primary framework

**Rationale**:
- Static site generation (fast, secure, SEO-friendly)
- Zero JS by default (fast page loads)
- Island architecture (selective hydration)
- Built-in content collections (type-safe content)
- Excellent developer experience
- View Transitions API support

**Alternatives Considered**:
- Next.js: Too heavy for static site, unnecessary SSR complexity
- Gatsby: Less active development, more complex build
- Plain HTML/CSS: No content management, harder to maintain

**Trade-offs**:
- ✅ Pros: Fast builds, minimal JS, great DX, perfect for content sites
- ⚠️ Cons: Less ecosystem than Next.js, newer framework

**Status**: ✅ Implemented

---

### UI Framework: React

**Decision**: Use React 19 for interactive components

**Rationale**:
- Familiar to most developers
- Rich component ecosystem (shadcn/ui)
- Partial hydration via Astro islands
- Only loads JS where needed

**Alternatives Considered**:
- Vanilla JS: More work, less maintainable
- Vue: Smaller ecosystem for Astro
- Svelte: Less familiar, smaller ecosystem

**Trade-offs**:
- ✅ Pros: Rich ecosystem, familiar, well-supported
- ⚠️ Cons: Larger bundle than Svelte (but Astro minimizes this)

**Status**: ✅ Implemented

---

### Styling: Tailwind CSS 4

**Decision**: Use Tailwind CSS for styling

**Rationale**:
- Utility-first (fast development)
- Excellent purging (tiny CSS bundles)
- Design system in config (consistent theming)
- shadcn/ui built on Tailwind
- Custom themes easy to configure

**Alternatives Considered**:
- CSS Modules: More verbose, less consistent
- Styled Components: Runtime cost, larger bundles
- Vanilla CSS: Harder to maintain, no design system

**Trade-offs**:
- ✅ Pros: Fast dev, tiny bundles, design consistency
- ⚠️ Cons: Lots of classes in HTML, learning curve

**Status**: ✅ Implemented with custom themes

**Configuration**:
```javascript
// tailwind.config.mjs
themes: {
  primary: { /* main site colors */ },
  familyAlbum: { /* warm, personal colors */ },
  artwork: { /* neutral, showcase colors */ }
}
```

---

### Component Library: shadcn/ui

**Decision**: Use shadcn/ui for UI components

**Rationale**:
- Copy components into codebase (full control)
- Built on Radix UI (accessible primitives)
- Tailwind-based styling
- No runtime dependencies
- Customizable

**Alternatives Considered**:
- Material UI: Too opinionated, heavy
- Chakra UI: Runtime styling cost
- Build from scratch: Too time-consuming

**Trade-offs**:
- ✅ Pros: Full control, accessible, customizable, no deps
- ⚠️ Cons: Manual updates (not npm install)

**Status**: ✅ Implemented - 17 components copied

**Components Available**:
- Primitives: Button, Card, Input, Label
- Navigation: Navigation Menu, Menubar
- Overlays: Popover, Sheet
- Layout: Scroll Area
- Custom: Audio Player, External Link, Back to Top, TOC

---

### Image Hosting: Cloudinary

**Decision**: Use Cloudinary for all images

**Rationale**:
- Automatic format selection (WebP, AVIF)
- On-the-fly transformations
- Responsive images (srcset)
- CDN delivery (fast worldwide)
- No build-time image processing

**Alternatives Considered**:
- Astro Image: Build-time processing (slow builds)
- Next.js Image: Requires server for optimization
- Manual optimization: Too much work, not scalable

**Trade-offs**:
- ✅ Pros: Fast, automatic optimization, CDN, easy
- ⚠️ Cons: External dependency, requires account

**Status**: ✅ Implemented with custom components

**Components**:
- `CloudinaryImage.astro` - Standard responsive images
- `ZoomableCloudinaryImage.astro` - Interactive zoom

**Configuration**:
```
PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

### Content Management: Astro Content Collections

**Decision**: Use Astro's built-in content collections

**Rationale**:
- Git-based (version control, simple workflow)
- Type-safe queries
- Markdown/MDX support
- No external CMS needed
- Fast builds

**Alternatives Considered**:
- Headless CMS (Sanity, Contentful): Overkill, external dep
- Tina CMS: Good but adds complexity
- Decap CMS: Good but requires backend

**Trade-offs**:
- ✅ Pros: Simple, type-safe, no deps, git-based
- ⚠️ Cons: Non-technical users need git knowledge

**Status**: ✅ Configured, collections defined

**Collections**:
```typescript
// src/content/config.ts
- exhibitions
- artwork
- camps
- family-album
```

---

### Navigation: View Transitions API

**Decision**: Use View Transitions API for page navigation

**Rationale**:
- Smooth, app-like transitions
- Native browser API (no library)
- Progressive enhancement
- Maintains SSG benefits

**Alternatives Considered**:
- SPA: Loses SSG benefits, SEO harder
- No transitions: Works but less polished
- Custom animations: More complex, heavier

**Trade-offs**:
- ✅ Pros: Smooth UX, native, progressive enhancement
- ⚠️ Cons: Not supported in all browsers (graceful fallback)

**Status**: ✅ Implemented in Layout.astro

---

## Architecture Patterns

### File Structure

```
src/
├── components/
│   ├── ui/              # shadcn components
│   └── *.astro          # Custom Astro components
├── content/
│   ├── config.ts        # Content collection schemas
│   ├── exhibitions/     # Exhibition markdown files
│   ├── artwork/         # Artwork markdown files
│   ├── camps/           # Camp markdown files
│   └── family-album/    # Family album markdown files
├── layouts/
│   └── Layout.astro     # Main layout wrapper
├── lib/
│   └── utils.ts         # Utility functions (cn, etc.)
├── pages/
│   ├── index.astro      # Homepage (routes to /)
│   ├── about.astro      # About page (routes to /about)
│   └── [...slug].astro  # Dynamic routes (if needed)
├── styles/
│   └── *.css            # Global and component styles
└── theme/
    └── index.ts         # Theme configuration
```

### Component Patterns

**Astro Components** (Server-side, no JS):
```astro
---
// Component logic (server-side)
interface Props {
  title: string;
}
const { title } = Astro.props;
---

<div>
  <h1>{title}</h1>
</div>
```

**React Islands** (Client-side, selective hydration):
```astro
---
import InteractiveComponent from '@components/InteractiveComponent';
---

<InteractiveComponent client:load />
<!-- Options: client:load, client:idle, client:visible -->
```

**Pattern**: Use Astro components by default, React only for interactivity

---

### Content Collection Pattern

**Define Schema**:
```typescript
// src/content/config.ts
const exhibitions = defineCollection({
  schema: z.object({
    title: z.string(),
    year: z.number(),
    location: z.string(),
    // ... more fields
  })
});
```

**Create Content**:
```markdown
---
# src/content/exhibitions/moma-2024.md
title: "Masumi Hayashi: City Perspectives"
year: 2024
location: "Museum of Modern Art, New York"
---

Exhibition description in markdown...
```

**Query in Pages**:
```typescript
import { getCollection } from 'astro:content';

const exhibitions = await getCollection('exhibitions');
// Type-safe! TypeScript knows the schema
```

---

### Image Optimization Pattern

**Standard Image**:
```astro
<CloudinaryImage
  cloudinaryId="folder/image-name"
  alt="Descriptive alt text"
  width={800}
  height={600}
/>
```

**Zoomable Image**:
```astro
<ZoomableCloudinaryImage
  cloudinaryId="folder/artwork-name"
  alt="Artwork title, year"
  client:load
/>
```

**Pattern**: Always use Cloudinary components, never <img> tags

---

### Styling Pattern

**Use Tailwind utilities**:
```astro
<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold text-primary-900">Title</h1>
</div>
```

**Use cn() for conditional classes**:
```astro
---
import { cn } from '@lib/utils';
const isActive = true;
---

<button class={cn(
  "px-4 py-2 rounded",
  isActive && "bg-primary-600 text-white"
)}>
  Click
</button>
```

**Custom themes**:
```astro
<div data-theme="family-album">
  <!-- Uses family album color palette -->
</div>
```

---

## Build & Deployment

### Build Process

```bash
npm run build
```

**What happens**:
1. TypeScript type checking
2. Content collections validated
3. Pages pre-rendered to HTML
4. Assets optimized and bundled
5. Sitemap generated
6. Output to `dist/` directory

**Build Time**: ~600ms (minimal site) → ~2-5s (full site expected)

**Output Size**: 208KB (minimal) → ~2-5MB (full site expected)

---

### Deployment Strategy

**Recommended Platform**: Cloudflare Pages

**Why Cloudflare Pages**:
- Best global CDN
- Unlimited bandwidth
- Automatic HTTPS
- Preview deployments
- Git integration
- Edge locations worldwide

**Alternatives**:
- Netlify: Great DX, similar features
- Vercel: Good but more focused on Next.js

**Deployment Flow**:
```
1. Push to GitHub
2. Cloudflare detects push
3. Runs: npm run build
4. Deploys dist/ to edge
5. Site live in ~30 seconds
```

**Environment Variables**:
```
PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
PUBLIC_SITE_URL=https://masumihayashi.com
```

---

### Git Workflow

**Branches**:
```
main              # Production (auto-deploys)
claude/*          # Feature branches (Claude Code sessions)
staging           # Staging environment (optional)
```

**Commit Strategy**:
- Descriptive commit messages
- Co-authored by Claude when applicable
- Squash before merging to main (optional)

**PR Process**:
- Create PR from claude/* branch
- Preview deployment generated
- Review and test
- Merge to main
- Auto-deploy to production

---

## Performance Optimizations

### Critical Rendering Path

1. **HTML**: Pre-rendered, served instantly from CDN
2. **CSS**: Tailwind purged, minimal size, inlined critical CSS
3. **JS**: Only loaded where needed (islands), deferred
4. **Images**: Lazy loaded below fold, Cloudinary optimized

### Lighthouse Targets

- **Performance**: > 90
- **Accessibility**: > 95 (aiming for 100)
- **Best Practices**: > 90
- **SEO**: > 90

### Optimization Checklist

- [x] Static site generation (fast TTFB)
- [x] Minimal JavaScript (islands architecture)
- [x] Cloudinary image optimization
- [ ] Critical CSS inlining (if needed)
- [ ] Font optimization (if custom fonts used)
- [ ] Preload key resources
- [ ] Resource hints (dns-prefetch, preconnect)
- [ ] Service worker (optional, for offline support)

---

## Security Considerations

### Security Checklist

- [x] No sensitive data in client code
- [x] Environment variables for API keys
- [ ] Content Security Policy headers
- [ ] HTTPS only (enforced by hosting)
- [ ] No user input (static site, no XSS risk)
- [ ] Regular dependency updates
- [ ] Cloudinary signed URLs (if needed for private images)

### No Backend = Minimal Attack Surface

Static sites have inherent security advantages:
- No server to hack
- No database to SQL inject
- No user sessions to hijack
- No file uploads to exploit

---

## Accessibility Architecture

### WCAG AA Compliance

**Targets**:
- [x] Semantic HTML throughout
- [x] ARIA labels where needed
- [x] Keyboard navigation
- [x] Focus indicators
- [ ] Color contrast verified
- [ ] Alt text for all images
- [ ] Screen reader tested

**Testing Strategy**:
- Lighthouse accessibility audit
- axe DevTools
- Manual keyboard navigation
- Screen reader testing (NVDA, JAWS)

---

## Monitoring & Analytics

### Performance Monitoring

**Tools** (to be decided):
- Google Analytics (basic)
- Vercel Analytics (if using Vercel)
- Cloudflare Web Analytics (privacy-friendly)

**Metrics to Track**:
- Page views
- Time on page
- Bounce rate
- Popular content
- Search queries (if search implemented)

### Error Monitoring

**Tools** (to be decided):
- Sentry (if needed)
- Cloudflare logs
- Build failure notifications

---

## Decision Records (ADR Format)

### ADR-001: Static Site Generation over SSR

**Date**: 2025-10-22

**Status**: Accepted

**Context**:
Need to choose between SSG (Static Site Generation) and SSR (Server-Side Rendering) for the site architecture.

**Decision**:
Use SSG (Astro in SSG mode) for the entire site.

**Rationale**:
- Content doesn't change frequently (exhibitions, artwork are historical)
- No user-specific content (no personalization needed)
- SEO is critical (pre-rendered HTML is best)
- Performance is critical (static = fastest)
- Lower hosting costs (no server needed)
- Better security (no server to attack)

**Consequences**:
- ✅ Excellent performance and SEO
- ✅ Simple deployment and hosting
- ✅ Low cost and maintenance
- ⚠️ Content updates require rebuild (acceptable for this use case)
- ⚠️ No real-time features (not needed)

---

### ADR-002: [Next Decision]

**Date**: [Date]

**Status**: [Proposed / Accepted / Deprecated / Superseded]

**Context**:
[What's the situation and problem?]

**Decision**:
[What did we decide?]

**Rationale**:
[Why did we decide this?]

**Consequences**:
[What are the trade-offs?]

---

## Technology Radar

### Adopt (Use These)
- ✅ Astro 5
- ✅ React 19
- ✅ Tailwind CSS 4
- ✅ shadcn/ui
- ✅ Cloudinary
- ✅ TypeScript
- ✅ View Transitions API

### Trial (Experiment With)
- 🔬 PhotoSwipe (for image lightbox)
- 🔬 Tina CMS (if need visual editing)
- 🔬 Astro DB (if need dynamic data later)

### Assess (Watch Closely)
- 👁️ Astro Content Layer (upcoming feature)
- 👁️ Astro Actions (for forms if needed)
- 👁️ React Server Components (future Astro support?)

### Hold (Avoid For Now)
- ⏸️ SPA frameworks for this project
- ⏸️ Complex state management (Redux, etc.)
- ⏸️ GraphQL (overkill for static content)

---

## Questions & Decisions Needed

- [ ] **Image Lightbox Library**: PhotoSwipe vs alternatives?
  - Decision needed by: [Date]
  - Impacts: Artwork detail pages

- [ ] **Analytics**: Which service to use?
  - Decision needed by: [Date]
  - Impacts: Privacy policy, tracking

- [ ] **Forms**: How to handle contact form?
  - Options: Formspree, Netlify Forms, custom API
  - Decision needed by: [Date]

---

## References & Resources

**Documentation**:
- Astro: https://docs.astro.build
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com
- Cloudinary: https://cloudinary.com/documentation

**Similar Projects**:
- [Example artist portfolio site]
- [Example museum archive site]

---

## Change Log

### 2025-10-22
- Initial architecture documented
- Tech stack finalized
- ADR-001 created for SSG decision

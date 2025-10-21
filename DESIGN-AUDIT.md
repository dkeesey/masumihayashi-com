# Design Audit: Prototype Analysis & Migration Plan

**Date**: 2025-10-20
**Source**: `/Users/deankeesey/Workspace/dk-sites/mh-com-astro/` (796MB prototype)
**Target**: `/Users/deankeesey/Workspace/dk-sites/masumihayashi-com/` (production site)

---

## Executive Summary

The prototype contains a **comprehensive, production-ready design system** with:
- ✅ Complete navigation (desktop + mobile)
- ✅ Multi-theme system (3 themes: primary, family album, artwork)
- ✅ 80+ components (layouts, UI, content)
- ✅ 27 pages with real content
- ✅ Full Footer with social, newsletter, attribution
- ✅ PhotoSwipe gallery integration
- ✅ Accessibility built-in

**Verdict**: Design is **extensive and production-ready**. Provides clear migration path.

---

## Design System Components

### 1. **Theme Architecture** ⭐ COMPREHENSIVE

**File**: `src/theme/index.ts`

**Three Complete Themes**:

#### Primary Theme (Global: Header, Footer)
- **Colors**: Black background (#000), white text, gold accent (#ffd700)
- **Interactive**: Blue link system (#60a5fa → #93c5fd)
- **Backgrounds**: 3-tier hierarchy (primary/secondary/tertiary)

#### Family Album Theme
- **Purpose**: Personal/family content sections
- **Style**: Dark background, warm photography aesthetic
- **Fonts**: Montserrat, Roboto Condensed, Courier Prime (typewriter)

#### Artwork Gallery Theme
- **Purpose**: Museum-quality artwork presentation
- **Style**: White background (#ffffff), clean museum look
- **Colors**: Near-black text, deep red accent (#c41e3a), teal links
- **Fonts**: Playfair Display (headings), Source Sans Pro (body)

**Museum-Specific Colors**:
```typescript
'museum': {
  'white': '#FFFFFF',
  'white-70': 'rgba(255, 255, 255, 0.7)',
  'black': '#000000',
  'black-70': 'rgba(0, 0, 0, 0.7)',
}
```

**Vintage/Historical**:
```typescript
'vintage': {
  'paper': '#F5F4E9',  // Aged paper
  'ink': '#2F2F2F',     // Faded ink
}
```

---

### 2. **Navigation System** ⭐ COMPLETE

**Components**:
- `Header.astro` - Site header with shadow
- `Navigation.astro` - Wrapper for NavMenu
- `NavMenu.tsx` - Full React nav with desktop/mobile

**Navigation Structure**:
1. Internment Camps Gallery
2. Family Album
3. Historical Documents
4. Artist Statement
5. About
6. **Donate** (CTA button styled)

**Features**:
- ✅ Desktop horizontal menu (lg+ screens)
- ✅ Mobile hamburger + Sheet drawer
- ✅ Active page highlighting (italic style)
- ✅ External link component with icons
- ✅ Responsive breakpoints

**Mobile Nav**:
- Sheet component (slide-in from right)
- 300px mobile, 400px small screens
- Auto-close on link click
- Accessible (ARIA labels, keyboard nav)

---

### 3. **Footer** ⭐ COMPREHENSIVE

**File**: `Footer.astro` (189 lines)

**Sections**:
1. **Main Navigation** (3-column grid on desktop)
   - Japanese American Internment links
   - Family Album Project
   - Family Album Photographers (8 photographers)
   - Support Our Work

2. **Branding Column**:
   - Site title
   - Related sites (Masumi Museum, Foundation)
   - Newsletter signup form (Netlify Forms)
   - Social media (Facebook, Instagram, YouTube)

3. **Attribution Section**:
   - Civil Liberties Public Education Fund (Densho logo)
   - Japanese American National Museum logo
   - Full accessibility with alt text

4. **Copyright**:
   - Estate info: 1998-{current year}
   - Site modernization credit

**Design**:
- Dark background (3-tier: tertiary → secondary → primary)
- Grid system responsive (1 col mobile → 12 col desktop)
- External link component integration
- Icon SVGs inline (accessible)

---

### 4. **Layout System** ⭐ FLEXIBLE

**14 Layout Options**:

| Layout | Purpose | Theme |
|--------|---------|-------|
| `Layout.astro` | Base layout | Primary |
| `HeroLayout.astro` | Hero image pages | Primary |
| `GalleryScrollLayout.astro` | Horizontal scroll galleries | Artwork |
| `LongFormLayout.astro` | Long-form content | Primary |
| `FamilyAlbumLayout.astro` | Photo albums | Family Album |
| `PhotographerLayout.astro` | Photographer profiles | Family Album |
| `PhotographerProfile.astro` | Individual photographer | Family Album |
| `ArtworkWithCampDataLayout.astro` | Artwork + historical data | Artwork |
| `OverviewHeroLayout.astro` | Overview pages with hero | Primary |
| `DonationLayout.astro` | Donation pages | Primary |
| `ScrollSnapLayout.astro` | Scroll-snap galleries | Artwork |
| `BaseLayout.astro` | Minimal base | None |
| `MainHead.astro` | SEO meta tags | Shared |
| `TestLayout.astro` | Development testing | Test |

**Common Features**:
- ViewTransitions API integration
- MainHead SEO component
- Header + Footer in most layouts
- PersistentDonateButton (floating CTA)
- FontLoader component
- PhotoSwipe CSS integration

---

### 5. **Component Library** ⭐ EXTENSIVE

**80+ Components** organized by function:

#### **Navigation & UI** (17 components)
- Button, Card, Input, Label
- Navigation Menu, Menubar, Popover, Sheet
- Progress, Scroll Area
- Audio Player, External Link, Back to Top, Table of Contents

#### **Content Components** (20+)
- CloudinaryImage, ZoomableCloudinaryImage
- ImageGallery, PhotoGallery
- HistoricalDocument, DocumentSelector
- PullQuote, ContentSection, NarrativeText
- Typography, Social, Breadcrumb

#### **Family Album Specific** (15+)
- FamilyAlbumIntro, FamilyAlbumSection
- PhotographerCard, PhotographerBanner
- PhotographerNavigation, PhotographersGrid
- PhotographerProfile, PhotographerPageLayout
- AlbumTitle

#### **Internment Camps** (10+)
- Japanese-American-Internment-Camps
- InternmentCampLinks
- ArtworkListByCamp
- CampGalleriesNav (Grid, Horizontal, Minimal)
- HistoricalContext, HistoricalContextMap

#### **Special Features**
- MapComponent (interactive maps)
- DonorBox (donation widget)
- ExhibitionImage, ExhibitionInfo
- HoverImage, FloatingImage, TextWrapImage
- MonumentImage (multiple versions)

---

### 6. **Content Structure** ⭐ REAL CONTENT

**27 Pages** with actual content:
- Homepage with hero
- About, Artist Statement
- Internment camps gallery + individual artworks
- Family Album project pages
- Photographer profiles (8 photographers)
- Historical documents
- Interviews (audio)
- Donate, Acknowledgements
- SFMOMA 2025 exhibition

**Content Collections** (MDX):
- `artwork/internment-camps/` - 20+ artwork MDX files
- Real metadata: titles, dates, locations, media, dimensions
- Full frontmatter with exhibition history

---

### 7. **Scripts & Functionality**

**3 Scripts**:
1. `photoswipe-init.ts` - Gallery lightbox initialization
2. `gtm.js` - Google Tag Manager (analytics)
3. `initMap.ts` - Interactive map initialization

**Dependencies** (Key):
- `@astrojs/react` - React integration
- `@radix-ui/*` - 10+ accessible UI primitives
- `@tailwindcss/typography` - Prose styling
- `photoswipe` - Image lightbox
- `nanostores` - State management

---

## What's Complete vs. What's Missing

### ✅ **Complete & Ready** (Can copy directly)

1. **Theme System** - 3 themes, comprehensive color palettes
2. **Navigation** - Desktop + mobile with all features
3. **Footer** - Full footer with all sections
4. **Layout System** - 14 layouts for all page types
5. **Component Library** - 80+ production components
6. **Content Structure** - Real content, not lorem ipsum
7. **Accessibility** - ARIA labels, keyboard nav, screen reader support
8. **Responsive Design** - Mobile-first with proper breakpoints
9. **Image System** - Cloudinary integration with zoom
10. **PhotoSwipe** - Gallery lightbox ready
11. **Forms** - Newsletter, donation forms
12. **Social Integration** - Links, share buttons
13. **SEO** - Meta tags, sitemap, structured data
14. **Analytics** - GTM integration

### ⚠️ **Gaps Identified**

#### 1. **Missing Content** (Expected for new site)
- Pages for other artwork series (Sacred Architectures, Post-Industrial, War Sites)
- Additional photographer profiles
- Blog/news section
- Press/media kit
- Collections/museum holdings

#### 2. **Technical Gaps**
- No search functionality
- No filtering/sorting for galleries
- No admin/CMS integration
- No commenting system
- No user accounts/authentication

#### 3. **Modern Enhancements** (Optional)
- No AI chat/docent feature
- No audio tours (has audio interviews)
- No 3D/AR views
- No print-on-demand integration
- No virtual exhibition tours

#### 4. **Analytics & Marketing**
- No A/B testing
- No email marketing integration (has newsletter form)
- No abandoned donation recovery
- No visitor analytics dashboard

---

## Migration Recommendations

### Phase 1: **Core Design Copy** (Today - 2 hours)

**Copy These Files** (in this order):

1. **Theme System**:
   ```bash
   cp -r mh-com-astro/src/theme/ masumihayashi-com/src/theme/
   cp mh-com-astro/tailwind.config.mjs masumihayashi-com/tailwind.config.mjs
   ```

2. **Navigation**:
   ```bash
   cp mh-com-astro/src/components/Header.astro masumihayashi-com/src/components/
   cp mh-com-astro/src/components/Navigation.astro masumihayashi-com/src/components/
   cp mh-com-astro/src/components/ui/NavMenu.tsx masumihayashi-com/src/components/ui/
   cp mh-com-astro/src/components/HamburgerMenuIcon.tsx masumihayashi-com/src/components/
   ```

3. **Footer**:
   ```bash
   cp mh-com-astro/src/components/Footer.astro masumihayashi-com/src/components/
   cp mh-com-astro/src/components/ui/ExternalLink.tsx masumihayashi-com/src/components/ui/
   ```

4. **Layout System**:
   ```bash
   cp mh-com-astro/src/layouts/Layout.astro masumihayashi-com/src/layouts/
   cp mh-com-astro/src/layouts/MainHead.astro masumihayashi-com/src/layouts/
   cp mh-com-astro/src/layouts/HeroLayout.astro masumihayashi-com/src/layouts/
   cp mh-com-astro/src/components/FontLoader.astro masumihayashi-com/src/components/
   cp mh-com-astro/src/components/PersistentDonateButton.astro masumihayashi-com/src/components/
   ```

5. **Homepage Content**:
   ```bash
   cp mh-com-astro/src/pages/index.astro masumihayashi-com/src/pages/
   ```

6. **Scripts & Styles**:
   ```bash
   cp mh-com-astro/src/scripts/photoswipe-init.ts masumihayashi-com/src/scripts/
   cp mh-com-astro/src/styles/photoswipe-custom.css masumihayashi-com/src/styles/
   ```

7. **Update Dependencies**:
   ```bash
   npm install @radix-ui/react-navigation-menu @radix-ui/react-dialog photoswipe
   ```

**Expected Result**: Site with working navigation, footer, homepage, proper theme

### Phase 2: **Content Pages** (This Week - 4 hours)

Copy essential pages:
- About (`about.astro`)
- Donate (`donate.astro`)
- Internment Camps Gallery (`artwork/japanese-american-internment-camps/index.astro`)
- Family Album Project (`family-album-project.astro`)

Copy required components for these pages (as needed)

### Phase 3: **Gallery System** (Next Week - 6 hours)

- Copy gallery layouts (GalleryScrollLayout, ScrollSnapLayout)
- Copy artwork components (CloudinaryImage, ZoomableCloudinaryImage, ImageGallery)
- Copy PhotoSwipe integration
- Copy content collection schemas
- Import sample artworks (5-10 pieces)

### Phase 4: **Polish & Enhancement** (Following Week - 4 hours)

- Add missing shadcn components
- Implement search (optional)
- Add filtering for galleries (optional)
- Performance optimization
- Visual regression tests
- Quality gate workflow

---

## Gap-Filling Strategies

### For Missing Content

**Strategy**: Incremental content migration
- **Week 1**: Homepage, About, Donate, primary internment camps gallery
- **Week 2**: Family Album project overview + 2-3 photographer profiles
- **Week 3**: Additional artwork series (Sacred Architectures)
- **Week 4**: Historical documents, interviews, remaining content

**Source**:
- Prototype has real content for internment camps
- `/Users/deankeesey/Workspace/dk-sites/docs/masumi/canonical-content/` has metadata for 245+ artworks
- Legacy archive has images

### For Technical Gaps

**Search**:
- **Option A**: Pagefind (Astro-native, static, free)
- **Option B**: Algolia (cloud, fast, $$$)
- **Option C**: Defer to Phase 5 (not critical for launch)

**CMS Integration**:
- **Recommendation**: Start with Git-based workflow (MDX files)
- **Future**: Consider Sanity or Contentful if non-technical editors needed
- **Timeline**: Post-launch enhancement

**Analytics**:
- **Current**: GTM integration exists in prototype
- **Action**: Configure GTM container ID in env vars
- **Timeline**: Can enable immediately

### For Modern Enhancements

**Priority Assessment**:

| Feature | Priority | Effort | Impact | Timeline |
|---------|----------|--------|--------|----------|
| Search | Medium | Low | Medium | Week 3-4 |
| Filtering | Medium | Medium | High | Week 3-4 |
| Audio tours | Low | High | Medium | Phase 5 |
| AI docent | Low | High | Low | Phase 5 |
| Print-on-demand | Medium | High | High | Phase 5 |
| Virtual tours | Low | Very High | Medium | Phase 5 |

**Recommendation**: Focus on **search** and **filtering** as post-launch enhancements. Defer AI/audio/3D features to future phases.

---

## Design Quality Assessment

### Is the design extensive enough?

**YES** - The prototype provides:
- ✅ Complete design system (themes, colors, typography)
- ✅ All essential page types (home, about, gallery, detail, profile)
- ✅ Navigation and footer fully designed
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accessibility built-in (ARIA, keyboard nav)
- ✅ Real content (not placeholders)
- ✅ Professional museum aesthetic
- ✅ Multi-theme system for different content types

### Does it give you a guide to move forward?

**YES** - Clear migration path:
1. Copy core design (Phase 1)
2. Add content pages (Phase 2)
3. Implement galleries (Phase 3)
4. Polish and enhance (Phase 4)

**Design Gaps are Expected**:
- Missing content = normal for new site (incremental addition)
- Technical gaps = post-launch enhancements (not blocking)
- Modern enhancements = future roadmap (strategic decisions)

---

## Immediate Next Steps

1. ✅ **Copy core design** (Theme, Nav, Footer, Layout)
2. ✅ **Update homepage** with real content
3. ✅ **Visual verification** with Playwright (QUALITY GATE)
4. ✅ **Add 3-5 essential pages** (About, Donate, Gallery overview)
5. ⏭️ **Deploy to staging** (Cloudflare Pages preview)
6. ⏭️ **User testing** (get feedback on design)
7. ⏭️ **Iterate** based on feedback

---

## Recommendations Summary

### Design Migration
**Recommendation**: ✅ **Copy the prototype design**
**Rationale**: Production-ready, comprehensive, museum-appropriate

### Timeline
- **Today**: Copy core design (2 hours)
- **This Week**: Add content pages (4 hours)
- **Next Week**: Gallery system (6 hours)
- **Week 4**: Polish and launch (4 hours)

### Gap Filling
- **Content gaps**: Incremental migration (expected)
- **Technical gaps**: Post-launch enhancements (not blocking)
- **Modern features**: Future roadmap (strategic)

### Quality Gates
- ✅ Visual verification with Playwright (before claiming success)
- ✅ Accessibility testing (built into design)
- ✅ Performance testing (lighthouse scores)
- ✅ Cross-browser testing (modern browsers)

---

**Verdict**: The prototype design is **extensive, production-ready, and provides a clear guide forward**. Proceed with migration.

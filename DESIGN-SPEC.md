# Design Specification - masumihayashi.com

> **Purpose**: Capture design decisions, visual direction, and UX patterns discussed across Claude sessions
> **Last Updated**: 2025-10-22
> **Status**: Template - Fill in as decisions are made

---

## Visual Identity

### Color Palette
```
Primary Theme:
- Main:    #[HEX] - Used for:
- Accent:  #[HEX] - Used for:
- Surface: #[HEX] - Used for:

Family Album Theme:
- Main:    #[HEX]
- Accent:  #[HEX]

Artwork Theme:
- Main:    #[HEX]
- Accent:  #[HEX]
```

### Typography
```
Headings: [Font family, weights]
Body:     [Font family, weights]
Special:  [Font family, use cases]

Sizes:
- h1: [size/line-height]
- h2: [size/line-height]
- body: [size/line-height]
```

### Spacing & Layout
```
Grid System: [e.g., 12-column, max-width: 1200px]
Breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

Content Width: [max-width for text content]
Image Aspect Ratios: [e.g., 16:9 for heroes, 4:3 for thumbnails]
```

---

## Component Patterns

### Navigation
```
Style: [Fixed/sticky/static]
Layout: [Horizontal/vertical/hamburger on mobile]
Items: Home | Exhibitions | Artwork | About | Contact
Active State: [How to show current page]
Mobile Behavior: [Describe mobile nav pattern]
```

### Hero Sections
```
Layout: [Full-bleed/contained/split]
Image Treatment: [Overlay opacity, filters]
Text Position: [Left/center/right, vertical alignment]
CTA Buttons: [Primary/secondary styles]
```

### Gallery Grids
```
Desktop: [3 columns? 4 columns?]
Tablet:  [2 columns?]
Mobile:  [1 column?]

Gap:     [spacing between items]
Hover:   [scale? overlay? shadow?]
Click:   [Open lightbox? Navigate to detail?]
```

### Image Viewers
```
Type: [Lightbox, modal, inline zoom]
Controls: [Next/prev arrows, thumbnails, close button]
Captions: [Show metadata? Description? Technical specs?]
Keyboard: [Arrow keys for navigation? ESC to close?]
```

### Cards (Exhibitions, Artwork)
```
Structure:
  - Image (aspect ratio: [ratio])
  - Title (typography: [style])
  - Metadata (year, location, medium)
  - Description (truncate at: [chars/lines])

States:
  - Default: [shadow, border, background]
  - Hover: [transform, shadow change]
  - Active: [focus ring for accessibility]
```

---

## Page-Specific Designs

### Homepage
```
Sections:
1. Hero: [Description of hero design]
2. Featured: [How many items? Layout?]
3. Bio Summary: [Length, style, image?]
4. Recent Exhibitions: [Number shown, link to archive]

CTA Strategy: [Where do you want users to go?]
```

### Exhibition Archive
```
Sort Options: [Year, alphabetical, chronological]
Default Sort: [Most recent first?]
Filter Options: [By year? By location? By type?]
View Modes: [Grid, list, timeline?]
Pagination: [Infinite scroll or pages?]
```

### Exhibition Detail Page
```
Layout:
- Hero: [Large image, title, year]
- Description: [Full essay, formatted how?]
- Gallery: [Grid of artworks, how many visible?]
- Metadata: [Location, dates, curators, etc.]
- Navigation: [Previous/next exhibition links?]
```

### Artwork Detail Page
```
Layout:
- Main Image: [Zoomable? Size?]
- Info Panel: [Title, year, medium, dimensions]
- Technical: [PAN panorama specs if applicable]
- Context: [Which exhibition? Related works?]
- Navigation: [Back to gallery, next artwork]
```

### About/Biography
```
Structure:
- Photo: [Portrait, where positioned?]
- Bio: [Length, sections, timeline?]
- CV: [Full CV? Highlights only?]
- Press: [Press mentions, downloads?]
```

---

## Interaction Patterns

### Animations & Transitions
```
Page Transitions: [View Transitions API settings]
Hover States: [Duration, easing, properties]
Loading States: [Skeleton screens? Spinners? Progressive?]
Scroll Effects: [Parallax? Fade-in? None?]
```

### Accessibility Requirements
```
Contrast: [WCAG AA or AAA?]
Focus Indicators: [Visible on all interactive elements]
Alt Text: [Detailed for artwork, descriptive strategy]
Keyboard Navigation: [All features accessible via keyboard]
Screen Reader: [ARIA labels, semantic HTML]
```

### Image Loading Strategy
```
Cloudinary Settings:
- Format: [Auto or specific?]
- Quality: [Auto or specific value?]
- Responsive: [Srcset breakpoints]

Loading:
- Above Fold: [Eager loading]
- Below Fold: [Lazy loading]
- Placeholders: [Blur-up? LQIP? Solid color?]
```

---

## Mobile-First Considerations

### Touch Targets
```
Minimum Size: [44x44px per Apple, 48x48px per Material]
Spacing: [Adequate spacing between clickable elements]
Gestures: [Swipe? Pinch-to-zoom? Pull-to-refresh?]
```

### Mobile-Specific Features
```
Navigation: [How does desktop nav adapt?]
Galleries: [Swipeable? Stacked?]
Forms: [Native inputs? Validation?]
Performance: [Image sizes? Bundle size targets?]
```

---

## Design References & Inspiration

### Similar Sites
```
1. [URL] - Inspiration for: [what aspect]
2. [URL] - Reference for: [what feature]
3. [URL] - Pattern library: [what patterns]
```

### Design Files
```
Figma: [URL if exists]
Mockups: [Location of mockup files]
Style Guide: [URL or file path]
```

---

## Decisions from Claude Mobile

> **How to use**: After a design discussion in Claude Mobile, copy key decisions here

### Session: [Date]
**Topic**: [e.g., "Homepage Hero Design"]

**Decisions**:
- [Decision 1]
- [Decision 2]
- [Decision 3]

**Rationale**: [Why these choices?]

**Implementation Notes**: [Technical considerations]

---

### Session: [Date]
**Topic**: [e.g., "Gallery Interaction Pattern"]

**Decisions**:
- [Decision 1]
- [Decision 2]

**Rationale**: [Why these choices?]

---

## Open Questions

- [ ] Question 1: [What needs to be decided?]
- [ ] Question 2: [What needs design input?]
- [ ] Question 3: [What needs user testing?]

---

## Change Log

### [Date]
- Changed [what] from [old] to [new] because [reason]

### [Date]
- Added [what] based on [feedback/testing/requirement]

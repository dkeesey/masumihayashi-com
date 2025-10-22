# Content Plan - masumihayashi.com

> **Purpose**: Document content structure, collections, and editorial decisions
> **Last Updated**: 2025-10-22
> **Status**: Template - Fill in as content is planned

---

## Content Collections Overview

### Exhibitions
**Location**: `src/content/exhibitions/`
**Status**: [Not started / In progress / Complete]
**Total Items**: [Current count / Target count]

```
Schema:
- title: string
- year: number
- startDate: date
- endDate: date
- location: string
- venue: string
- city: string
- description: markdown
- featuredImage: string (Cloudinary ID)
- artworks: array of artwork IDs
- curators: array of strings
- catalogUrl: string (optional)
```

**Priority Exhibitions** (Add first):
1. [Exhibition name, year] - [Why important]
2. [Exhibition name, year] - [Why important]
3. [Exhibition name, year] - [Why important]

**Content Needs**:
- [ ] Exhibition descriptions (who's writing?)
- [ ] High-res images uploaded to Cloudinary
- [ ] Curator names and affiliations
- [ ] Catalog PDFs or links
- [ ] Press coverage links

---

### Artwork
**Location**: `src/content/artwork/`
**Status**: [Not started / In progress / Complete]
**Total Items**: [Current count / Target count]

```
Schema:
- title: string
- year: number
- medium: string
- dimensions: string
- cloudinaryId: string
- isPanoramic: boolean
- description: markdown (optional)
- exhibitions: array of exhibition IDs
- collections: string (where it lives now)
- forSale: boolean
- technicalNotes: markdown (for PAN panoramas)
```

**Organization Strategy**:
- Sort by: [Year / Series / Medium]
- Group by: [Exhibition / Theme / Period]
- Featured works: [Criteria for featuring]

**Content Needs**:
- [ ] Complete artwork inventory spreadsheet
- [ ] Professional photographs for all pieces
- [ ] Dimensions and medium verified
- [ ] Current location/collection info
- [ ] Which exhibitions each appeared in

---

### Camps (Workshops)
**Location**: `src/content/camps/`
**Status**: [Not started / In progress / Complete]
**Total Items**: [Current count / Target count]

```
Schema:
- title: string
- year: number
- location: string
- dates: string
- description: markdown
- participants: number (optional)
- photos: array of Cloudinary IDs
- activities: array of strings
```

**Priority**:
- [Camp 1] - [Year, location]
- [Camp 2] - [Year, location]

**Content Needs**:
- [ ] Camp photos organized and uploaded
- [ ] Descriptions of each camp's focus
- [ ] Participant testimonials (if available)

---

### Family Album
**Location**: `src/content/family-album/`
**Status**: [Not started / In progress / Complete]
**Total Items**: [Current count / Target count]

```
Schema:
- title: string (album name)
- description: markdown
- year: number (or range)
- coverImage: string (Cloudinary ID)
- photos: array of {
    cloudinaryId: string,
    caption: string,
    date: date (optional)
  }
```

**Albums Planned**:
1. [Album name] - [Description, photo count]
2. [Album name] - [Description, photo count]

**Content Needs**:
- [ ] Photos scanned and uploaded
- [ ] Captions written for each photo
- [ ] Dates verified where possible
- [ ] Family members identified

---

## Static Pages

### Homepage (/)
**Status**: [Draft / In Progress / Published]

**Sections**:
1. **Hero**
   - Headline: [Text or TBD]
   - Subhead: [Text or TBD]
   - Image: [Cloudinary ID or TBD]
   - CTA: [Button text and link]

2. **Introduction**
   - Content: [1-2 paragraphs about Masumi]
   - Length: ~150-200 words
   - Writer: [Who's writing this?]

3. **Featured Exhibitions**
   - Number to show: [3? 4?]
   - Criteria: [Most recent? Most significant?]
   - Layout: [Grid, carousel, list]

4. **Call to Action**
   - Message: [What do you want visitors to do?]
   - Button: [Text and destination]

**Content Needs**:
- [ ] Hero image selected
- [ ] Introduction text written and approved
- [ ] Featured exhibitions chosen

---

### About/Biography (/about)
**Status**: [Draft / In Progress / Published]

**Structure**:
1. **Hero Section**
   - Portrait photo: [Cloudinary ID or TBD]
   - Years: 1945-2006
   - Title: Artist, Educator, Innovator

2. **Biography Essay**
   - Length: [500 words? 1000 words?]
   - Tone: [Academic, accessible, personal]
   - Source: [Existing bio or new writing]
   - Sections:
     - Early Life
     - Education
     - Artistic Development
     - Teaching Career
     - Recognition and Legacy

3. **Quick Facts**
   - Born: [Date, place]
   - Education: [Degrees]
   - Teaching: [Where]
   - Notable: [Awards, recognition]

4. **Timeline** (optional)
   - Interactive or static?
   - Key events to include: [List]

**Content Needs**:
- [ ] Biography text written
- [ ] Photos selected (portrait + archive)
- [ ] CV/resume for reference
- [ ] Awards and honors list
- [ ] Teaching history documented

---

### Exhibitions (/exhibitions)
**Status**: [Draft / In Progress / Published]

**Page Structure**:
1. **Hero/Header**
   - Title: "Exhibitions"
   - Description: [One sentence about scope]

2. **Archive List**
   - View: [Grid or list]
   - Sort: [Reverse chronological by default]
   - Filters: [Year ranges, location, solo vs group]

3. **Featured Section** (optional)
   - Highlight: [Most important exhibitions]
   - Position: [Top of page or sidebar]

**Content Needs**:
- [ ] Complete list of exhibitions compiled
- [ ] Images for each exhibition
- [ ] Descriptions written

---

### Contact (/contact)
**Status**: [Draft / In Progress / Published]

**Information to Include**:
- Foundation email: [email address]
- Social media: [links if any]
- Mailing address: [if public]
- Rights and reproductions: [contact info]

**Form** (if needed):
- Fields: Name, Email, Message, Inquiry Type
- Submit to: [Email or service]
- Confirmation: [Message after submission]

---

## Editorial Guidelines

### Voice & Tone
```
Overall Tone: [e.g., Respectful, scholarly yet accessible, celebratory]

Do:
- [Guideline 1]
- [Guideline 2]

Don't:
- [Anti-pattern 1]
- [Anti-pattern 2]
```

### Writing Style
```
Perspective: [Third person, first person for foundation statements]
Tense: [Past for biography, present for artwork descriptions]
Length: [Target word counts for different content types]

Artwork Descriptions:
- Include: [Technical details, context, significance]
- Avoid: [Overly technical jargon, assumptions of knowledge]

Exhibition Descriptions:
- Include: [Theme, key works, reception, historical context]
- Format: [Length, structure]
```

### Image Requirements
```
Technical Specs:
- Format: [JPG, PNG for transparency]
- Size: [Upload at max resolution, Cloudinary will optimize]
- Color Profile: [sRGB]
- File Naming: [Convention: artwork-title-year.jpg]

Metadata:
- Alt Text: [Descriptive for accessibility]
- Caption: [Include: Title, Year, Medium, Dimensions]
- Credit: [Photo credit if not foundation]
```

---

## Content Sources

### Primary Sources
```
Archives:
- Location: [Where are original materials?]
- Contact: [Who has access?]
- Digitization status: [What's scanned? What needs scanning?]

Family:
- Photos: [Who has them?]
- Stories: [Interviews recorded?]
- Permissions: [Releases signed?]
```

### Secondary Sources
```
Publications:
- Exhibition catalogs: [Which ones exist? Digital copies?]
- Articles and reviews: [Compiled list? Clippings?]
- Academic papers: [About Masumi's work]

Online:
- Museum collections: [Which museums hold works?]
- Archives: [Online databases, photo archives]
```

---

## Content Migration from Prototype

**Prototype Location**: `/Users/deankeesey/Workspace/dk-sites/mh-com-astro/`

### What to Migrate
- [ ] **Existing page content** → Review and copy to production
- [ ] **Image assets** → Upload to Cloudinary, note IDs
- [ ] **Collection data** → Extract from prototype, validate, import
- [ ] **Metadata** → Ensure complete and accurate

### What to Rewrite
- [ ] **Homepage copy** - [Why: outdated/needs revision]
- [ ] **About page** - [Why: tone adjustment needed]
- [ ] **Exhibition descriptions** - [Which ones need work]

### What to Skip
- [ ] **Draft content** - [Not ready for production]
- [ ] **Test data** - [Obviously test data]
- [ ] **Outdated info** - [Specific items that are obsolete]

---

## Content Workflow

### Adding New Exhibition
1. Create file: `src/content/exhibitions/venue-name-year.md`
2. Fill frontmatter with schema fields
3. Write description (markdown body)
4. Upload images to Cloudinary → note IDs
5. Add to featuredImage and artworks array
6. Preview in dev environment
7. Commit and push

### Adding New Artwork
1. Create file: `src/content/artwork/artwork-title-year.md`
2. Fill frontmatter with schema fields
3. Upload high-res image to Cloudinary → note ID
4. Add optional description if needed
5. Link to exhibitions that featured it
6. Preview in dev environment
7. Commit and push

---

## Launch Checklist

### Must-Have Content (MVP)
- [ ] Homepage with hero and intro
- [ ] About page with biography
- [ ] At least 5 major exhibitions with details
- [ ] At least 20 artworks with images
- [ ] Contact information
- [ ] 404 error page

### Nice-to-Have Content (Phase 2)
- [ ] Complete exhibition archive (all exhibitions)
- [ ] Full artwork catalog
- [ ] Family album section
- [ ] Camps/workshops section
- [ ] Timeline visualization
- [ ] Press and media section

### Content Quality Gates
- [ ] All images have alt text
- [ ] All dates verified
- [ ] All names spelled correctly
- [ ] All links tested
- [ ] Copy proofread by [who?]
- [ ] Family approval on personal content

---

## Maintenance Plan

### Regular Updates
```
Monthly:
- [ ] Check for broken links
- [ ] Review analytics (what content is popular?)
- [ ] Add new press mentions

Quarterly:
- [ ] Add new exhibitions if any
- [ ] Update biography if achievements
- [ ] Review and refresh homepage content

Annually:
- [ ] Full content audit
- [ ] Update copyright year
- [ ] Refresh outdated content
```

### Content Owners
```
Biography: [Who maintains?]
Exhibitions: [Who adds new entries?]
Artwork: [Who verifies accuracy?]
Family Album: [Who has permission?]
Technical: [Who handles site updates?]
```

---

## Notes from Claude Mobile Sessions

### Session: [Date]
**Topic**: [e.g., "Exhibition Archive Structure"]

**Decisions**:
- [Content decision 1]
- [Content decision 2]

**Action Items**:
- [ ] [Task based on discussion]
- [ ] [Task based on discussion]

---

### Session: [Date]
**Topic**: [e.g., "Biography Page Layout"]

**Decisions**:
- [Content decision 1]

---

## Open Content Questions

- [ ] Question: [What needs to be decided?]
- [ ] Question: [What needs content input?]
- [ ] Question: [What needs family approval?]

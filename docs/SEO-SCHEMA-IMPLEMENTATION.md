# SEO Schema Implementation

## Overview

This document describes the schema.org structured data implementation for masumihayashi.com. These JSON-LD schemas help AI assistants (ChatGPT, Claude, Perplexity, Gemini) accurately cite and attribute content.

**Implementation Date**: October 21, 2025
**Reference Guide**: `/Users/deankeesey/.claude/docs/ai-seo-schema-guide.md`

## Quality Gate Status

✅ **PASSED** - All schemas validated with zero errors

### Validation Results

- **Person Schema**: ✅ Valid - 3 sameAs links (Wikipedia, JANM, Densho)
- **Organization Schema**: ✅ Valid - 3 social media links
- **WebSite Schema**: ✅ Valid
- **BreadcrumbList Schema**: ✅ Valid
- **JSON-LD Format**: ✅ No syntax errors

## Implementation Summary

### Files Created

1. **`src/lib/schema.ts`** - Schema generation library
   - `generatePersonSchema()` - Masumi Hayashi person data
   - `generateOrganizationSchema()` - Foundation organization data
   - `generateWebSiteSchema()` - Website metadata
   - `generateInternmentEventSchema()` - Historical event context
   - `generateArtworkSchema(artwork)` - Individual artwork metadata
   - `generateImageObjectSchema(artwork)` - Image provenance and copyright
   - `generateBreadcrumbSchema(items)` - Navigation breadcrumbs

2. **`src/components/SchemaScript.astro`** - Reusable schema rendering component
   - Accepts single schema or array of schemas
   - Renders as `<script type="application/ld+json">`

### Files Modified

1. **`src/pages/index.astro`** - Homepage
   - Added Person, Organization, and WebSite schemas

2. **`src/pages/about.astro`** - About page
   - Added Person, Organization, and Breadcrumb schemas

3. **`src/components/Footer.astro`** - Global footer
   - Added Organization schema (appears on all pages)

4. **`src/layouts/Layout.astro`** - Base layout
   - Added head slot support for schema injection

5. **`src/layouts/HeroLayout.astro`** - Hero layout
   - Added head slot passthrough

6. **`src/layouts/MainHead.astro`** - Head component
   - Changed slot from named to default for proper rendering

## Schema by Page Type

### Homepage (`/`)

**4 schemas present**:
1. **Person** - Masumi Hayashi biographical data
   - Birth/death dates: 1945-05-04 to 2006-11-06
   - Nationality: American
   - Job title: Artist
   - SameAs links: Wikipedia, JANM, Densho

2. **Organization** - Masumi Hayashi Foundation
   - Founded: 2007
   - Founder: Dean Akira Keesey
   - Social media: Facebook, Instagram, YouTube

3. **WebSite** - Site metadata
   - Publisher: Links to Organization via @id
   - Language: en-US

4. **Organization** (duplicate from footer)
   - Same as schema #2

### About Page (`/about`)

**4 schemas present**:
1. **Person** - Masumi Hayashi
2. **Organization** - Foundation
3. **BreadcrumbList** - Navigation trail
   - Home → About
4. **Organization** (duplicate from footer)

### All Other Pages

**1 schema present**:
- **Organization** (from footer) - Available site-wide

## Schema Properties

### Person Schema (Masumi Hayashi)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://masumihayashi.com/#masumi",
  "name": "Masumi Hayashi",
  "alternateName": "Masumi Mitsui Hayashi",
  "birthDate": "1945-05-04",
  "deathDate": "2006-11-06",
  "birthPlace": {
    "@type": "Place",
    "name": "Los Angeles, California"
  },
  "nationality": "American",
  "jobTitle": "Artist",
  "description": "Japanese-American artist and photographer known for panoramic photo-collages documenting Japanese American internment camps",
  "knowsAbout": [
    "Photography",
    "Japanese American Internment",
    "Panoramic Photo-collage",
    "Documentary Photography"
  ],
  "award": [
    "National Endowment for the Arts Fellowship",
    "Ohio Arts Council Individual Artist Fellowship"
  ],
  "sameAs": [
    "https://en.wikipedia.org/wiki/Masumi_Hayashi",
    "https://www.janm.org/collections/artist/masumi-hayashi",
    "https://encyclopedia.densho.org/Masumi_Hayashi/"
  ]
}
```

### Organization Schema (Foundation)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://masumihayashifoundation.org/#organization",
  "name": "Masumi Hayashi Foundation",
  "foundingDate": "2007",
  "founder": {
    "@type": "Person",
    "name": "Dean Akira Keesey"
  },
  "description": "Foundation dedicated to preserving and promoting the artistic legacy of Masumi Hayashi",
  "sameAs": [
    "https://www.facebook.com/MasumiHayashiFoundation",
    "https://www.instagram.com/masumi_hayashi_foundation/",
    "https://www.youtube.com/@MasumiLegacyProject"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "General Inquiries",
    "url": "https://masumihayashifoundation.org/contact"
  }
}
```

## Future Implementation

### Priority Pages (When Built)

1. **Artwork Pages** (`/artwork/[slug]`)
   - Add VisualArtwork schema
   - Add ImageObject schema for provenance
   - Link to Person via @id
   - Link to Internment Event if applicable

2. **Historical Documents Page** (`/historical-documents`)
   - Add Article schema
   - Add Event schema (Japanese American Internment)
   - Add GovernmentDocument in citations

3. **Camps/Gallery Pages**
   - Add BreadcrumbList for navigation
   - Add VisualArtwork for each displayed work

### Implementation Template for Artwork Pages

```astro
---
import SchemaScript from '@components/SchemaScript.astro';
import {
  generatePersonSchema,
  generateArtworkSchema,
  generateImageObjectSchema
} from '@lib/schema';

const artwork = {
  cloudinaryId: "internment-camps/manzanar_xxxxx",
  title: "Manzanar Relocation Center",
  year: "1995",
  media: "Panoramic photo-collage",
  city: "Inyo County",
  state: "California",
  country: "USA",
  description: "Panoramic photo-collage of Manzanar internment camp",
  campName: "Manzanar" // Triggers internment context
};

const schemas = [
  generatePersonSchema(),
  generateArtworkSchema(artwork),
  generateImageObjectSchema(artwork)
];
---

<Layout title={artwork.title}>
  <SchemaScript schema={schemas} slot="head" />
  <!-- Page content -->
</Layout>
```

## Maintenance

### When to Update Schemas

- **New artworks added**: Update or create VisualArtwork schemas
- **Exhibitions announced**: Add Event schemas
- **Publications cite Masumi**: Add citations to Person schema
- **Foundation contact changes**: Update Organization schema
- **Social media changes**: Update sameAs arrays

### Validation Schedule

1. **Monthly**: Run schema.org validator on key pages
2. **Quarterly**: Test AI citations with ChatGPT/Claude/Perplexity
3. **After major updates**: Check Google Rich Results Test

### Testing Procedures

#### 1. Schema.org Validator

```bash
# Extract schemas from live page
curl https://masumihayashi.com/ | grep -o '<script type="application/ld+json">[^<]*</script>'

# Visit: https://validator.schema.org/
# Paste JSON-LD
# Verify zero errors
```

#### 2. Google Rich Results Test

```bash
# Visit: https://search.google.com/test/rich-results
# Enter page URL
# Verify no errors
```

#### 3. AI Assistant Testing

**ChatGPT Test**:
```
Prompt: "Tell me about Masumi Hayashi, the artist who documented Japanese American internment camps"

Expected: Accurate bio, correct dates, proper attribution to masumihayashi.com
```

**Claude Test**:
```
Prompt: "What artworks did Masumi Hayashi create about Manzanar?"

Expected: Specific artwork references with proper citations
```

**Perplexity Test**:
```
Prompt: "Masumi Hayashi panoramic photography"

Expected: masumihayashi.com cited as authoritative source
```

## Technical Notes

### Schema Injection Architecture

1. **Page-level schemas**: Added to page frontmatter, injected via `slot="head"`
2. **Global schemas**: Organization schema in Footer, renders on every page
3. **Layout chain**: Page → HeroLayout → Layout → MainHead (default slot)

### Duplicate Schemas

The Organization schema appears twice on homepage and about page:
- Once in page head (from page-level schema array)
- Once in footer (global schema)

This is acceptable but not ideal. Consider removing from page-level arrays if duplication becomes an issue.

### TypeScript Types

Using `schema-dts` package for type safety:
```bash
npm install --save-dev schema-dts
```

Import types:
```typescript
import type { Thing, WithContext } from 'schema-dts';
```

## Dependencies

- **schema-dts** (dev): TypeScript definitions for schema.org types
- No runtime dependencies

## Browser Support

JSON-LD structured data is:
- Invisible to users (doesn't affect rendering)
- Consumed by search engines and AI assistants
- Works in all browsers (script tag with type="application/ld+json")

## Resources

- **Schema.org Reference**: https://schema.org/
- **Google Structured Data Guide**: https://developers.google.com/search/docs/appearance/structured-data
- **JSON-LD Playground**: https://json-ld.org/playground/
- **AI SEO Guide**: `/Users/deankeesey/.claude/docs/ai-seo-schema-guide.md`

## Version History

- **v1.0.0** (2025-10-21): Initial implementation
  - Person, Organization, WebSite, BreadcrumbList schemas
  - Homepage and About page complete
  - Schema library and reusable components created
  - All schemas validated successfully

---

**Last Updated**: 2025-10-21
**Implemented By**: Claude Code (SEO Specialist)
**Reviewed By**: Awaiting review

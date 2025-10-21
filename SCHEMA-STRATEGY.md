# Schema.org Strategy for AI SEO

**Purpose**: Comprehensive structured data markup for AI discovery and traditional search engines
**Priority**: High - AI models use schema to understand content relationships
**Status**: Organization schema ✅ implemented, Artwork/Series schemas pending

---

## Why Schema Matters for AI

Modern AI models (Google Gemini, ChatGPT, Perplexity) use schema.org markup to:
- Understand entity relationships (artist → artwork → series)
- Build knowledge graphs
- Provide direct answers in AI chat interfaces
- Cite sources with rich context

**Example**: "Show me Masumi Hayashi's internment camp photographs"
- With schema: AI returns specific artworks, dates, dimensions, descriptions
- Without schema: AI returns generic text snippets

---

## Implemented Schemas

### 1. Organization Schema ✅
**Location**: `src/components/Footer.astro` → `src/lib/schema.ts`

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Masumi Hayashi Foundation",
  "description": "Preserving the photographic legacy of Masumi Hayashi",
  "url": "https://masumihayashi.com",
  "sameAs": [
    "https://www.facebook.com/MasumiHayashiFoundation",
    "https://www.instagram.com/masumi_hayashi_foundation/",
    "https://www.youtube.com/@MasumiLegacyProject"
  ]
}
```

**Impact**: AI models know this is the canonical source for Masumi Hayashi content

---

## Pending Implementation

### 2. Artist Person Schema (High Priority)
**Location**: Homepage + About page

```typescript
// src/lib/schema.ts
export function generateArtistSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Masumi Hayashi",
    "birthDate": "1945-03-04",
    "deathDate": "2006-03-14",
    "nationality": "American",
    "jobTitle": "Artist, Photographer",
    "description": "Japanese American artist known for panoramic photo collages documenting sites of incarceration, environmental damage, and cultural heritage",
    "knowsAbout": [
      "Photography",
      "Photo Collage",
      "Panoramic Photography",
      "Japanese American History",
      "Environmental Photography"
    ],
    "alumniOf": [
      {
        "@type": "CollegeOrUniversity",
        "name": "Florida State University"
      }
    ],
    "award": [
      "John Simon Guggenheim Fellowship",
      "National Endowment for the Arts Fellowship"
    ],
    "creator": {
      "@type": "CreativeWork",
      "name": "American Concentration Camps series",
      "dateCreated": "1990-2006"
    }
  }
}
```

**Where to add**:
- `/` (homepage)
- `/about/`
- `/artist-statement/`

---

### 3. CreativeWorkSeries Schema (High Priority)
**Location**: Each series landing page (`/artwork/japanese-american-internment-camps/`, etc.)

```typescript
// src/lib/schema.ts
export function generateSeriesSchema(series: {
  name: string
  description: string
  url: string
  artworkCount: number
  dateCreated: string
  genre: string[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWorkSeries",
    "name": series.name,
    "description": series.description,
    "url": series.url,
    "creator": {
      "@type": "Person",
      "name": "Masumi Hayashi"
    },
    "dateCreated": series.dateCreated,
    "genre": series.genre,
    "numberOfItems": series.artworkCount
  }
}
```

**Example usage** (Internment Camps series):
```typescript
generateSeriesSchema({
  name: "American Concentration Camps",
  description: "Panoramic photo collages documenting Japanese American incarceration sites during World War II",
  url: "https://masumihayashi.com/artwork/japanese-american-internment-camps/",
  artworkCount: 37,
  dateCreated: "1990-2006",
  genre: ["Photography", "Photo Collage", "Documentary Photography", "Historical Documentation"]
})
```

---

### 4. VisualArtwork Schema (Critical for AI)
**Location**: Individual artwork pages

```typescript
// src/lib/schema.ts
export function generateArtworkSchema(artwork: {
  name: string
  description: string
  image: string
  dateCreated: string
  width: string
  height: string
  medium: string
  series: string
  location?: string
  subject: string[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    "name": artwork.name,
    "description": artwork.description,
    "image": artwork.image,
    "creator": {
      "@type": "Person",
      "name": "Masumi Hayashi"
    },
    "dateCreated": artwork.dateCreated,
    "artMedium": artwork.medium,
    "artform": "Photography",
    "artworkSurface": "Chromogenic color print",
    "width": artwork.width,
    "height": artwork.height,
    "isPartOf": {
      "@type": "CreativeWorkSeries",
      "name": artwork.series
    },
    "contentLocation": artwork.location ? {
      "@type": "Place",
      "name": artwork.location
    } : undefined,
    "keywords": artwork.subject
  }
}
```

**Example** (Manzanar Gates):
```typescript
generateArtworkSchema({
  name: "Manzanar Monument: South View",
  description: "Panoramic view of the memorial monument at Manzanar Japanese American internment camp in California's Owens Valley",
  image: "https://res.cloudinary.com/.../manzanar-gates.jpg",
  dateCreated: "1995",
  width: "72 inches",
  height: "36 inches",
  medium: "Chromogenic color print, photo collage",
  series: "American Concentration Camps",
  location: "Manzanar, California",
  subject: ["Japanese American Internment", "World War II", "Manzanar", "Civil Rights"]
})
```

---

### 5. Exhibition Event Schema
**Location**: Exhibition pages

```typescript
export function generateExhibitionSchema(exhibition: {
  name: string
  description: string
  startDate: string
  endDate?: string
  location: {
    name: string
    address: string
  }
  url: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ExhibitionEvent",
    "name": exhibition.name,
    "description": exhibition.description,
    "startDate": exhibition.startDate,
    "endDate": exhibition.endDate,
    "location": {
      "@type": "Museum",
      "name": exhibition.location.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": exhibition.location.address
      }
    },
    "about": {
      "@type": "Person",
      "name": "Masumi Hayashi"
    },
    "url": exhibition.url
  }
}
```

---

## Implementation Checklist

### Phase 1: Core Entities (Week 1)
- [x] Organization schema (Footer)
- [ ] Person schema (Homepage, About)
- [ ] Add schema to all 8 series landing pages

### Phase 2: Artwork Details (Week 2-3)
- [ ] VisualArtwork schema for all 138 artworks
- [ ] Automated schema generation in content collections
- [ ] Add schema component to artwork layout

### Phase 3: Events & Media (Week 4)
- [ ] ExhibitionEvent schema for current/past shows
- [ ] VideoObject schema for interviews
- [ ] Article schema for essays/resources

---

## File Structure

```
src/lib/schema.ts                   # Central schema generation functions
src/components/SchemaScript.astro   # Generic schema renderer ✅
src/layouts/
  ├── ArtworkLayout.astro          # Auto-adds artwork schema
  ├── SeriesLayout.astro           # Auto-adds series schema
  └── ExhibitionLayout.astro       # Auto-adds exhibition schema
```

---

## Testing Schema

### Google Rich Results Test
```bash
# Test individual pages
https://search.google.com/test/rich-results
```

### Schema Validator
```bash
# Validate JSON-LD
https://validator.schema.org/
```

### AI Model Testing
Test queries in:
- ChatGPT: "What artworks did Masumi Hayashi create about internment camps?"
- Perplexity: "Show me Masumi Hayashi's photography series"
- Google Gemini: "Describe Masumi Hayashi's Manzanar Monument photograph"

**Expected**: AI should cite masumihayashi.com with specific details from schema

---

## SEO Impact Metrics

**Before schema** (traditional SEO):
- Google shows generic site description
- AI models return vague summaries
- No structured data in knowledge panels

**After schema** (AI-optimized):
- Rich snippets in Google search
- AI models cite specific artworks with details
- Potential Google Knowledge Graph inclusion
- Direct answers in AI chat interfaces

---

**Next Steps**: Create schema generation functions in `src/lib/schema.ts` and integrate into layouts

**Last Updated**: 2025-10-21
**Status**: Documentation complete, implementation pending

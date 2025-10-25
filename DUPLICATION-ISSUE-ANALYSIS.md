# Artwork Page Duplication Issue

## Problem

The site is generating **860 detail pages** instead of the expected **137 unique artworks**.

## Root Cause

Most `[slug].astro` files have `getStaticPaths()` functions that return ALL artworks instead of filtering by series.

### Example of BROKEN Code (prisons, commissions, city-works, etc.)

```typescript
export async function getStaticPaths() {
  const artworkEntries = await getCollection("artwork");
  return artworkEntries.map((entry: CollectionEntry<"artwork">) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}
```

This generates pages for ALL 137 artworks at:
- `/artwork/prisons/gila-river-internment-camp-foundations/` ❌
- `/artwork/prisons/angkor-wat-no-1-angkor-siem-reap-cambodia/` ❌
- `/artwork/prisons/...` (all 137 artworks!)

### Example of CORRECT Code (sacred-architectures)

```typescript
export async function getStaticPaths() {
  const artworkEntries = await getCollection("artwork");
  const sacredArchitecturesArtworks = artworkEntries.filter(
    (entry: CollectionEntry<"artwork">) =>
      entry.data.series === "Sacred Architectures"
  );

  return sacredArchitecturesArtworks.map((entry: CollectionEntry<"artwork">) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}
```

This generates pages for ONLY Sacred Architectures artworks (32 pages).

## Files That Need Fixing

1. ❌ `src/pages/artwork/city-works/[slug].astro`
2. ❌ `src/pages/artwork/commissions/[slug].astro`
3. ❌ `src/pages/artwork/epa-superfund/[slug].astro`
4. ❌ `src/pages/artwork/prisons/[slug].astro`
5. ❌ `src/pages/artwork/post-industrial/[slug].astro`
6. ❌ `src/pages/artwork/war-military/[slug].astro`
7. ✅ `src/pages/artwork/sacred-architectures/[slug].astro` (already correct)
8. ✅ `src/pages/artwork/japanese-american-internment-camps/[slug].astro` (already correct)

## Series Name Mismatches

Additional issue: Series names in MDX frontmatter don't match what the [slug].astro files are filtering for.

### MDX Files Have:
- `Prisons & Institutions` (9 artworks)
- `Post-Industrial Landscapes` (13 artworks)
- `Public Commissions` (16 artworks)

### But [slug].astro Files Filter For:
- `Prisons & Penitentiaries` ❌ (should be "Prisons & Institutions")
- `Post-Industrial Sites` ❌ (should be "Post-Industrial Landscapes")
- `Public Commissions` ✅ (correct)

## Expected Page Counts (After Fix)

| Series | Artworks | Gallery | Detail Pages | Total |
|--------|----------|---------|--------------|-------|
| Sacred Architectures | 32 | 1 | 32 | 33 |
| Post-Industrial | 13 | 1 | 13 | 14 |
| Prisons | 9 | 1 | 9 | 10 |
| War & Military | 6 | 1 | 6 | 7 |
| EPA Superfund | 11 | 1 | 11 | 12 |
| City Works | 13 | 1 | 13 | 14 |
| Commissions | 16 | 1 | 16 | 17 |
| Internment Camps | 37 | 1 | 37 | 38 |
| **TOTAL** | **137** | **8** | **137** | **145** |

Plus ~7 other pages (homepage, about, etc.) = **~152 total pages**

## Fix Strategy

1. Add series filter to all broken `getStaticPaths()` functions
2. Verify series names match between MDX and filters
3. Rebuild and verify page count drops from 860 → 145
4. Run tests to confirm galleries work correctly

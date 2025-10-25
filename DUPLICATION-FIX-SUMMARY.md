# Duplication Issue - Fixed!

## Problem Summary

The site was generating **860 total pages** instead of the expected **~150 pages** due to duplicate artwork detail pages across all series.

## Root Cause

All 8 `[slug].astro` files had `getStaticPaths()` functions that returned **ALL 137 artworks** instead of filtering by their respective series.

This meant:
- `/artwork/prisons/angkor-wat-no-1-angkor-siem-reap-cambodia/` ❌ (Sacred Architecture artwork in Prisons!)
- `/artwork/city-works/alcatraz-penitentiary-cellblock-san-francisco-california/` ❌ (Prison artwork in City Works!)
- Every series × Every artwork = 137 artworks × 8 series = 1,096 potential pages

## Files Fixed

### 1. `/src/pages/artwork/prisons/[slug].astro`
- **Issue**: No filter in `getStaticPaths()`, wrong series name
- **Fix**: Added filter for `"Prisons & Institutions"` (was checking for non-existent "Prisons & Penitentiaries")

### 2. `/src/pages/artwork/post-industrial/[slug].astro`
- **Issue**: No filter in `getStaticPaths()`
- **Fix**: Added filter for `"Post-Industrial Landscapes"`

### 3. `/src/pages/artwork/epa-superfund/[slug].astro`
- **Issue**: No filter in `getStaticPaths()`
- **Fix**: Added filter for `"EPA Superfund Sites"`

### 4. `/src/pages/artwork/city-works/[slug].astro`
- **Issue**: No filter in `getStaticPaths()`
- **Fix**: Added filter for `"City Works"`

### 5. `/src/pages/artwork/commissions/[slug].astro`
- **Issue**: No filter in `getStaticPaths()`
- **Fix**: Added filter for `"Public Commissions"`

### 6. `/src/pages/artwork/japanese-american-internment-camps/[slug].astro`
- **Issue**: No filter in `getStaticPaths()`
- **Fix**: Added filter for both `"Japanese-American Internment Camps"` AND `"Japanese-Canadian Internment Camps"`

### Already Correct ✓
- `/src/pages/artwork/sacred-architectures/[slug].astro` - Had filter from the start
- `/src/pages/artwork/war-military/[slug].astro` - Had filter from the start

## Results

### Before Fix
```
Total pages: 369
Artwork detail pages: 860
internment-camps: 137 pages ❌ (ALL artworks!)
prisons: 137 pages ❌
city-works: 137 pages ❌
...every series had ALL artworks
```

### After Fix
```
Total pages: 169 ✅
Artwork detail pages: 137 ✅

city-works: 13 ✅
commissions: 16 ✅
epa-superfund: 11 ✅
internment-camps: 37 ✅
post-industrial: 13 ✅
prisons: 9 ✅
sacred-architectures: 32 ✅
war-military: 6 ✅

Total artworks: 137 ✅
```

## Page Count Breakdown

| Type | Count |
|------|-------|
| Artwork detail pages | 137 |
| Artwork gallery pages | 8 |
| Other pages (home, about, etc.) | 24 |
| **Total** | **169** |

## Key Learnings

1. **Always filter in getStaticPaths()** - Each dynamic route must filter the collection to only return items it should handle
2. **Series names must match exactly** - MDX frontmatter values must match filter strings exactly
3. **Multiple series support** - Internment camps needed to handle both Japanese-American and Japanese-Canadian series
4. **Test early** - User caught this by asking for page list - automated tests should verify page counts

## Code Pattern (Correct)

```typescript
export async function getStaticPaths() {
  const artworkEntries = await getCollection("artwork");
  const filteredArtworks = artworkEntries.filter(
    (entry: CollectionEntry<"artwork">) =>
      entry.data.series === "Series Name Here"
  );

  return filteredArtworks.map((entry: CollectionEntry<"artwork">) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}
```

## Next Steps

- ✅ Fix all `getStaticPaths()` filters
- ✅ Rebuild site
- ✅ Verify page counts
- 🔄 Run tests to ensure galleries work
- 🔄 Deploy to production

---

**Fixed**: October 23, 2025
**Pages reduced**: 860 → 169 (691 duplicate pages eliminated!)

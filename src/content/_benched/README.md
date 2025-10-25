# Benched Artworks

**Purpose**: Storage for artwork MDX files that are temporarily excluded from the site but preserved for future restoration.

**Status**: These files are NOT built into the site (underscore prefix excludes them from Astro collections).

---

## Why Bench Instead of Delete?

1. **Preserves metadata** - Title, dimensions, series info
2. **Maintains git history** - Can track changes over time
3. **Quick restoration** - Just move file back when quality image becomes available
4. **Documentation** - Keeps record of what artwork exists

---

## Directory Structure

```
src/content/_benched/
├── README.md (this file)
├── sacred-architectures/
├── post-industrial/
├── city-works/
├── prisons/
├── war-military/
├── epa-superfund/
├── commissions/
└── internment-camps/
```

Mirror the same directory structure as `src/content/artwork/` for easy organization.

---

## How to Bench an Artwork

1. **Move the MDX file**:
   ```bash
   mv src/content/artwork/[series]/[artwork].mdx src/content/_benched/[series]/
   ```

2. **Document in EXCLUDED-ARTWORKS.md**:
   - Add entry with reason for exclusion
   - Note the file path in `_benched/`
   - Date the exclusion

3. **Rebuild site**:
   ```bash
   npm run build
   ```

4. **Verify with Playwright**:
   ```bash
   node scripts/verify-gallery-images.js
   ```

---

## How to Restore from Bench

1. **Ensure quality image exists**:
   - Check `/Volumes/PRO-G40/MH-imageprocessing/all-images-source/`
   - Verify resolution meets minimum 2400px standard
   - Run Python processing if needed

2. **Move file back**:
   ```bash
   mv src/content/_benched/[series]/[artwork].mdx src/content/artwork/[series]/
   ```

3. **Update mappings if needed**:
   - Add to `scripts/smart-copy-images.js` manualMappings if naming differs
   - Run `node scripts/smart-copy-images.js`

4. **Rebuild and verify**:
   ```bash
   npm run build
   node scripts/verify-gallery-images.js
   ```

5. **Update documentation**:
   - Remove from EXCLUDED-ARTWORKS.md
   - Update FINAL-IMAGE-STATUS.md statistics

---

## Current Benched Artworks

See `EXCLUDED-ARTWORKS.md` for the current list and reasons.

---

## Notes

- Files in `_benched/` are **ignored by Astro** (underscore prefix)
- They **won't appear in builds** or collections
- They **are tracked in git** for history
- They **don't affect page count** or gallery stats

---

**Created**: October 24, 2025
**Maintained by**: Dean Keesey for Masumi Hayashi Foundation

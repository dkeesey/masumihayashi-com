# Next Actions - Content Migration Ready

**Status**: ✅ Ready to proceed with content migration
**Blocker**: Cloudinary ID mapping strategy

---

## Cloudinary ID Pattern Discovered

**Existing Pattern** (from internment-camps):
```
cloudinaryId: /internment-camps/artwork-slug_cloudinary-hash
```

**Examples**:
- `/internment-camps/angler-pow-camp-guard-tower_ogicae`
- `/internment-camps/gila-river-internment-camp-monument_kppybi`
- `/internment-camps/heart-mountain-internment-camp-blue-room_mtzpdt`

**Pattern**: `/series-folder/artwork-slug_6-char-hash`

**Note**: Found 1 inconsistency (missing leading `/` on one file) - needs cleanup

---

## Critical Question: Where Do Cloudinary Hashes Come From?

The canonical content at `/Users/deankeesey/Workspace/dk-sites/docs/masumi/canonical-content/artworks/` has **empty** `referenceImageUrl` fields.

**Options for migration**:

### Option A: Cloudinary Already Has Images
- Check Cloudinary folders for existing images in other series
- Extract actual Cloudinary public IDs
- Map to canonical content by slug matching
- **Pro**: Uses real, existing images
- **Con**: Requires Cloudinary API access/audit

### Option B: Generate Placeholder IDs
- Create IDs using slug pattern: `/series/slug_PLACEHOLDER`
- Migrate content with placeholders
- Update with real Cloudinary IDs later
- **Pro**: Can proceed immediately
- **Con**: Pages won't render images until IDs updated

### Option C: Check Production WordPress Site
- WordPress site may have Cloudinary IDs in image metadata
- Could scrape/export from production
- **Pro**: Gets real data from live site
- **Con**: Requires WordPress access/scraping

**Recommendation**: Option A (check Cloudinary) - Most accurate, prevents duplicate work

---

## Proposed Migration Script

**Tool**: Python (similar to extract-tier1-artworks.py)

**Input**: `/Users/deankeesey/Workspace/dk-sites/docs/masumi/canonical-content/artworks/[series]/`

**Output**: `/Users/deankeesey/Workspace/dk-sites/masumihayashi-com/src/content/artwork/[series]/`

**Transformation Logic**:

```python
def transform_canonical_to_mdx(canonical_file, cloudinary_mapping):
    """
    Convert canonical markdown to Astro MDX format
    """
    # Parse YAML frontmatter
    frontmatter = parse_yaml(canonical_file)

    # Transform fields
    mdx_frontmatter = {
        "content-type": "artwork",
        "series": map_series_name(frontmatter["series"]),
        "slug": frontmatter["slug"],
        "name": frontmatter["title"].replace("©", "").strip(),
        "title": frontmatter["title"],
        "altTag": f"Picture of {frontmatter['title']} by Dr. Masumi Hayashi",
        "media": frontmatter["medium"],
        "year": str(frontmatter["date"]),
        "city": frontmatter["city"],
        "state": frontmatter["state"],
        "country": frontmatter["country"],
        "size": format_dimensions(frontmatter["dimensions"]),
        "inventory": "1 framed" if frontmatter.get("inInventory") else "",
        "cloudinaryId": cloudinary_mapping.get(frontmatter["slug"], "PLACEHOLDER")
    }

    # Write MDX file
    write_mdx(output_path, mdx_frontmatter, body_content="")
```

**Series Name Mapping**:
```python
SERIES_MAPPING = {
    "Sacred Architectures": "Sacred Architectures",
    "Post-Industrial Landscapes": "Post-Industrial Landscapes",
    "Abandoned Prisons": "Prisons & Institutions",
    "War and Military Sites": "War & Military Sites",
    "EPA Superfund Sites": "EPA Superfund Sites",
    "City Works": "City Works",
    "Commissions": "Public Commissions"
}
```

---

## Immediate Next Steps

### 1. Cloudinary Audit (30 min)
**Task**: Check if images exist in Cloudinary for other series

**Method**:
```bash
# If Cloudinary CLI available
cloudinary list --prefix sacred-architectures/ > cloudinary-sacred-arch.txt
cloudinary list --prefix post-industrial/ > cloudinary-post-industrial.txt
# ... etc for each series
```

**Alternative**: Use Cloudinary web UI to browse folders

**Goal**: Determine if we have real Cloudinary IDs or need placeholders

---

### 2. Create Migration Script (2-3 hours)
**File**: `scripts/migrate-canonical-to-mdx.py`

**Features**:
- Read canonical markdown files
- Transform frontmatter fields
- Map Cloudinary IDs (from audit results or placeholders)
- Write MDX files to correct series folders
- Validate against content schema
- Generate migration report

---

### 3. Test Migration (1 hour)
**Process**:
1. Run script on 1 series (e.g., sacred-architectures)
2. Build Astro site: `npm run build`
3. Check for errors
4. Preview one artwork page
5. Verify image renders (if Cloudinary ID valid)
6. Fix any issues

---

### 4. Create Gallery Pages (1 hour)
**Task**: Create series index pages for remaining 7 series

**Template**: Copy `src/pages/artwork/japanese-american-internment-camps/index.astro`

**Changes per series**:
- Series filter: `entry.data.series === "Sacred Architectures"`
- SEO title/description
- Page title/intro text
- CreativeWorkSeries schema data

**Files to create**:
```
src/pages/artwork/
├── sacred-architectures/index.astro
├── post-industrial/index.astro
├── prisons/index.astro
├── war-military/index.astro
├── epa-superfund/index.astro
├── city-works/index.astro
└── commissions/index.astro
```

---

### 5. Full Migration (1 hour)
**Process**:
1. Run migration script for all 7 series
2. Build and test
3. Verify all gallery pages work
4. Test navigation flow (mega menu → series → artwork → related works)
5. Deploy to staging

---

## Estimated Timeline

**Total**: 6-8 hours

| Task | Time | Dependency |
|------|------|-----------|
| Cloudinary audit | 0.5h | None |
| Migration script | 2-3h | Cloudinary audit results |
| Test migration (1 series) | 1h | Migration script |
| Create gallery pages | 1h | None (can parallelize) |
| Full migration | 1h | Validated migration script |
| Testing & fixes | 1-2h | Full migration |

---

## Questions Before Proceeding

1. **Do you have Cloudinary CLI or API access?**
   - If yes: Can audit folders and get real IDs
   - If no: Can use web UI or proceed with placeholders

2. **Should we preserve rich content from canonical files?**
   - Current approach: Minimal content in MDX
   - Canonical has extensive historical context
   - Options: (a) Keep all, (b) Extract to separate files, (c) Discard

3. **Priority order for series migration?**
   - Suggested: Sacred Architectures first (largest, good test)
   - Or: User preference?

---

## Success Criteria

✅ All 8 series have working gallery pages
✅ All ~350 artworks migrated with valid frontmatter
✅ Images render (if Cloudinary IDs valid)
✅ Navigation flows correctly
✅ RelatedArtworks shows on individual pages
✅ Schema.org markup on all pages
✅ Breadcrumbs on all pages
✅ Site builds without errors

---

**Ready to proceed**: Yes, pending Cloudinary audit or decision on placeholder approach

**Recommended first action**: Cloudinary folder audit → migration script → test migration

---

**Created**: 2025-10-21
**Status**: Awaiting user decision on Cloudinary ID strategy

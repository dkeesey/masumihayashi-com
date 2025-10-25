# Image Processing System - Complete Notes

## What Was Already Done (Internment Camps - 37 Images)

### Status: ✅ COMPLETE
The internment camps series (37 artworks) already have Cloudinary IDs and are working:
```yaml
cloudinaryId: /internment-camps/gila-river-internment-camp-foundations_aietu0
```

These images are live on Cloudinary and display correctly on the site.

---

## What Still Needs To Be Done (7 Series - 100 Images)

### Status: ⚠️ NOT STARTED
The following series have `_PLACEHOLDER` IDs and need image processing:

| Series | Count | Status |
|--------|-------|--------|
| Sacred Architectures | 32 | Needs processing |
| Post-Industrial Landscapes | 13 | Needs processing |
| Prisons & Institutions | 9 | Needs processing |
| War & Military Sites | 6 | Needs processing |
| EPA Superfund Sites | 11 | Needs processing |
| City Works | 13 | Needs processing |
| Public Commissions | 16 | Needs processing |
| **TOTAL** | **100** | **All need processing** |

---

## The Cloudinary Processing System

### Found Documentation
Located in `/Users/deankeesey/Workspace/dk-sites/masumimuseum-modern/`:
1. **cloudinary-artwork-processing.md** - Complete processing pipeline
2. **batch-image-processing.md** - Batch processing workflow

### How It Works

#### Step 1: Upload Original Images to Cloudinary
```bash
cloudinary upload source-image.jpg --public_id "sacred-architectures/angkor-wat-no-1"
```

#### Step 2: Apply Cloudinary Transformations
The system adds professional museum-style metadata overlays:

```javascript
const transformation = [
  // Add black border frame
  { crop: 'pad', background: 'black', width: 1200, height: 900 },

  // Scale artwork to fit
  { crop: 'scale', width: 1100 },

  // Add text overlays (bottom to top):
  // 1. Artist attribution: "Masumi Hayashi (1945-2006)"
  // 2. Artwork title: "Title: Angkor Wat, no. 1"
  // 3. Technical details: "Year: 2000 | Medium: Panoramic Photo Collage"
  // 4. Dimensions: "23 x 52 inches"
]
```

#### Step 3: Generate Multiple Sizes
For responsive display:
- **Thumbnail**: 400×300px
- **Medium**: 800×600px
- **Large**: 1200×900px
- **XL**: 1600×1200px

#### Step 4: Get Cloudinary Public ID
After processing, Cloudinary assigns a public ID like:
```
sacred-architectures/angkor-wat-no-1_aietu0
```

This becomes the cloudinaryId in the MDX file.

---

## Two Processing Approaches

### Approach A: Cloudinary Hosting (Current System)
**How it works:**
1. Upload images to Cloudinary
2. Cloudinary stores and serves the processed images
3. Site references Cloudinary URLs
4. **Cost**: Pay Cloudinary for hosting + bandwidth

**Pros:**
- Already implemented for internment camps
- No local storage needed
- Automatic CDN delivery
- Dynamic transformations available

**Cons:**
- Ongoing Cloudinary costs
- Vendor lock-in

### Approach B: One-Time Processing (Alternative)
**How it works:**
1. Use Cloudinary for processing only
2. Download final processed images
3. Host images statically (Cloudflare, Netlify, etc.)
4. Delete from Cloudinary (optional)
5. **Cost**: One-time processing, then free hosting

**Pros:**
- No ongoing Cloudinary costs
- Full control over images
- Images can be version controlled
- Fast static delivery

**Cons:**
- Need to store ~400MB of processed images
- Re-processing requires re-upload

---

## Required Components for Processing

### 1. Source Images (❓ UNKNOWN LOCATION)
**Need to locate:**
- Original high-resolution artwork photos
- Minimum 800×600px (preferably higher)
- Format: JPG, PNG, or TIFF

**Possible locations to check:**
- Production WordPress site uploads
- External hard drive/backup
- Google Drive / Dropbox
- Legacy site image directories

### 2. Metadata (✅ ALREADY HAVE)
All MDX files have complete metadata:
```yaml
name: Angkor Wat, no. 1, Angkor, Siem Reap, Cambodia
year: 2000
media: Panoramic Photo Collage
size: 23 x 52
city: Angkor
state: Siem Reap
country: Cambodia
```

### 3. Processing Scripts (✅ DOCUMENTED)
The batch processing system is fully documented in:
- `masumimuseum-modern/cloudinary-artwork-processing.md`
- `masumimuseum-modern/batch-image-processing.md`

Scripts need to be created based on documentation.

### 4. Cloudinary Account (✅ PRESUMABLY EXISTS)
Since 37 internment camps images are already on Cloudinary, the account exists.

**Need to verify:**
- Cloudinary cloud name
- API credentials
- Storage limits
- Bandwidth usage

---

## Step-by-Step Processing Workflow

### Prerequisites Checklist
- [ ] Locate source images for 100 artworks
- [ ] Verify Cloudinary credentials
- [ ] Create batch processing script
- [ ] Test with 1-2 images first

### Phase 1: Test Processing (1-2 Images)
1. Pick 1-2 artworks from Sacred Architectures
2. Find their source images
3. Upload to Cloudinary manually
4. Apply transformations via Cloudinary UI
5. Note the Cloudinary public ID
6. Update MDX file with real ID
7. Verify image displays on site
8. **STOP and review before proceeding**

### Phase 2: Sacred Architectures (32 Images)
If test successful:
1. Run batch upload script
2. Apply standard transformations
3. Collect all Cloudinary IDs
4. Update all 32 MDX files
5. Rebuild site
6. Visual verification with Playwright
7. Commit changes

### Phase 3: Remaining Series (68 Images)
Repeat for each series:
- Post-Industrial (13)
- City Works (13)
- Public Commissions (16)
- EPA Superfund (11)
- Prisons (9)
- War & Military (6)

### Phase 4: Final Verification
- Run full test suite
- Visual QA on all galleries
- Performance testing
- Deploy to production

---

## Automation Scripts Needed

### 1. Cloudinary Batch Upload Script
```bash
#!/bin/bash
# upload-series.sh <series-name> <source-directory>

SERIES=$1
SOURCE_DIR=$2

for image in "$SOURCE_DIR"/*.jpg; do
  filename=$(basename "$image" .jpg)
  cloudinary_id=$(cloudinary upload "$image" \
    --public_id "$SERIES/$filename" \
    --folder "$SERIES")
  echo "$filename -> $cloudinary_id"
done
```

### 2. MDX Update Script
```javascript
// update-cloudinary-ids.js
// Read all MDX files with _PLACEHOLDER
// Update with real Cloudinary IDs from upload log
```

### 3. Verification Script
```javascript
// verify-images.js
// Check all cloudinaryIds resolve to valid images
// Report any broken links
```

---

## Questions to Answer Before Processing

### Critical Questions
1. **Where are the source images?**
   - Production site uploads?
   - External storage?
   - Need to inventory what exists

2. **Which approach to use?**
   - Approach A (Cloudinary hosting) - like internment camps
   - Approach B (one-time processing)
   - Hybrid?

3. **Cloudinary account limits?**
   - Storage quota
   - Bandwidth limits
   - Cost implications for 100 more images

4. **Quality standards?**
   - Minimum resolution requirements
   - What if some images are low quality?
   - "Better no image than bad image" policy still applies?

### Nice-to-Have Info
- How were internment camps images processed?
- Was it manual or scripted?
- Any lessons learned from that process?

---

## Current Site Status

### Working Now ✅
- Site structure (169 pages)
- Gallery navigation
- Detail page routing
- Internment camps images (37)

### Broken Now ❌
- Sacred Architectures images (32)
- Post-Industrial images (13)
- Prisons images (9)
- War & Military images (6)
- EPA Superfund images (11)
- City Works images (13)
- Public Commissions images (16)

### Total Impact
- **Functionality**: 100% working (navigation, routing, metadata)
- **Visual**: 27% complete (37/137 images display)
- **Blocking deployment**: Yes (can't deploy with broken images)

---

## Next Steps

### Immediate (Today)
1. **Find source images** - Critical blocker
2. **Verify Cloudinary access** - Need credentials
3. **Decide on approach** - A or B?

### Short-term (This Week)
1. Create batch processing scripts
2. Test with 2-3 images
3. Process Sacred Architectures (smallest batch to start)

### Medium-term (Next Week)
1. Process remaining 6 series
2. Full site verification
3. Deploy to production

---

## Reference Documentation

### Local Files
- `/Users/deankeesey/Workspace/dk-sites/masumimuseum-modern/cloudinary-artwork-processing.md`
- `/Users/deankeesey/Workspace/dk-sites/masumimuseum-modern/batch-image-processing.md`

### Example Cloudinary IDs
```
Working: /internment-camps/gila-river-internment-camp-foundations_aietu0
Broken:  /sacred-architectures/angkor-wat-no-1-angkor-siem-reap-cambodia_PLACEHOLDER
```

### MDX File Locations
```
/Users/deankeesey/Workspace/dk-sites/masumihayashi-com/src/content/artwork/
├── sacred-architectures/ (32 files with _PLACEHOLDER)
├── post-industrial/ (13 files with _PLACEHOLDER)
├── prisons/ (9 files with _PLACEHOLDER)
├── war-military/ (6 files with _PLACEHOLDER)
├── epa-superfund/ (11 files with _PLACEHOLDER)
├── city-works/ (13 files with _PLACEHOLDER)
├── commissions/ (16 files with _PLACEHOLDER)
└── internment-camps/ (37 files with real IDs) ✅
```

---

**Last Updated**: October 23, 2025
**Status**: Image processing pipeline documented, awaiting source images

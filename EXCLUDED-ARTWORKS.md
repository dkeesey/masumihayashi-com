# Excluded Artworks - Curatorial Quality Standards

**Purpose**: Track artworks excluded from the site due to missing or insufficient quality source images.

**Last Updated**: October 24, 2025

---

## Current Exclusions

### 1. Asarco Smelter, Tacoma, Washington
- **Series**: EPA Superfund Sites
- **Reason**: No source image found
- **Status**: Benched (preserved for future restoration)
- **Benched Location**: `src/content/_benched/epa-superfund/asarco-smelter-tacoma-washington.mdx`
- **Original Location**: `src/content/artwork/epa-superfund/asarco-smelter-tacoma-washington.mdx`
- **Notes**: Searched all source directories (JPG, PNG, TIFF) - no image exists
- **Date Excluded**: October 24, 2025
- **Priority**: Medium - Affects EPA Superfund gallery (currently 10/11)

### 2. Briar Hill Plant no. 3, Youngstown, Ohio
- **Series**: Post-Industrial
- **Reason**: Image quality too low (blurry/soft focus)
- **Status**: Benched (preserved for future restoration)
- **Benched Location**: `src/content/_benched/post-industrial/briar-hill-plant-no-3-youngstown-ohio.mdx`
- **Original Location**: `src/content/artwork/post-industrial/briar-hill-plant-no-3-youngstown-ohio.mdx`
- **Notes**: Curatorial quality control - image does not meet minimum sharpness standards
- **Date Excluded**: October 24, 2025
- **Priority**: Low - Post-Industrial gallery will remain at 12/13 (92%)
- **Restoration Path**: Search for higher quality scan or original negative


---

## Quality Review Queue

*(Artworks to review for quality once site is live)*

### Candidates for Quality Review
- TBD after visual review of all galleries

---

## Naming Convention Notes

**Internment Camps Naming**:
- **Short form** (preferred): `[camp-name]-internment-camp-[feature]`
- **Long form** (deprecated): `[camp-name]-relocation-camp-[feature]-[location]`

When duplicates exist with both naming patterns, keep the short form for consistency.

---

## Restoration Opportunities

*(Artworks that could be restored if better quality sources become available)*

### 1. Asarco Smelter
- **Priority**: Medium
- **Action Needed**: Search for original film negative or high-res scan
- **Impact**: EPA Superfund gallery currently 10/11 artworks

---

## Process for Adding to This List

When excluding an artwork:

1. **Document the decision**:
   - Artwork name and series
   - Reason for exclusion
   - Date excluded
   - Who made the decision

2. **Keep the source materials**:
   - Don't delete MDX files from git history
   - Note the file path for future reference
   - Keep any low-quality source images tagged as "low-quality"

3. **Update the count**:
   - Update FINAL-IMAGE-STATUS.md with new totals
   - Run Playwright verification
   - Update gallery README if applicable

4. **Review periodically**:
   - Quarterly review of excluded artworks
   - Check for new high-quality scans
   - Reassess quality standards as technology improves

---

## Statistics

**Total Artworks in Site**: 133
**Total Excluded**: 2
- Missing source: 1
- Quality control: 1

**Success Rate**: 100% of artworks meeting quality standards are displayed

## Duplicate Cleanup Notes

**Date**: October 24, 2025
**Action**: Removed 2 duplicate MDX files (long-form naming variants)
- `gila-river-relocation-camp-dog-grave-gila-river-arizona.mdx` → Kept: `gila-river-internment-camp-dog-grave.mdx`
- `gila-river-relocation-camp-monument-gila-river-arizona.mdx` → Kept: `gila-river-internment-camp-monument.mdx`

These were duplicates with different naming conventions. The artwork is included under the short-form name.

---

## Future Considerations

### Digital Archive Scanning Project
If the Masumi Hayashi Foundation undertakes a comprehensive archive digitization:
- Prioritize the Asarco Smelter original
- Scan at minimum 600 DPI for archival quality
- Create TIFF masters for long-term preservation
- Generate web-ready derivatives

### Quality Threshold Guidelines
For future additions, require:
- **Minimum resolution**: 2400px on longest edge
- **File formats**: TIFF (archival), JPG (processed), PNG (acceptable)
- **Color space**: sRGB for web, Adobe RGB for print
- **Bit depth**: 8-bit minimum for web derivatives

---

**Maintained by**: Dean Keesey for Masumi Hayashi Foundation
**Review Frequency**: Quarterly
**Next Review**: January 2026

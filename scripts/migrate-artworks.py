#!/usr/bin/env python3
"""
Migrate canonical markdown artworks to Astro MDX format
Selects tier-1 artworks up to target counts per series
"""

import os
import re
from pathlib import Path

# Source and target directories
CANONICAL_BASE = "/Users/deankeesey/Workspace/dk-sites/docs/masumi/canonical-content/artworks"
TARGET_BASE = "/Users/deankeesey/Workspace/dk-sites/masumihayashi-com/src/content/artwork"

# Series mapping: canonical-dir -> (target-dir, target-count)
SERIES_MAP = {
    "ja-internment-camps": ("internment-camps", 37),  # Need 9 more (have 28)
    "sacred-architectures": ("sacred-architectures", 33),
    "post-industrial-landscapes": ("post-industrial", 13),
    "abandoned-prisons": ("prisons", 9),
    "war-and-military-sites": ("war-military", 6),
    "epa-superfund-sites": ("epa-superfund", 11),
    "city-works": ("city-works", 13),
    "commissions": ("commissions", 16),
}

# Series display names
SERIES_NAMES = {
    "internment-camps": "Japanese-American Internment Camps",
    "sacred-architectures": "Sacred Architectures",
    "post-industrial": "Post-Industrial Landscapes",
    "prisons": "Prisons & Institutions",
    "war-military": "War & Military Sites",
    "epa-superfund": "EPA Superfund Sites",
    "city-works": "City Works",
    "commissions": "Public Commissions",
}

def parse_frontmatter(content):
    """Extract YAML frontmatter from markdown"""
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)', content, re.DOTALL)
    if not match:
        return {}, content

    fm_text = match.group(1)
    body = match.group(2)

    # Parse simple YAML manually
    fm = {}
    for line in fm_text.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")

            # Handle boolean and numeric values
            if value.lower() == 'true':
                value = True
            elif value.lower() == 'false':
                value = False
            elif value.isdigit():
                value = int(value)

            fm[key] = value

    return fm, body

def format_dimensions(dim_str):
    """Convert '53x24' to '53" x 24"'"""
    if not dim_str:
        return ""
    match = re.match(r'(\d+)x(\d+)', str(dim_str))
    if match:
        return f'{match.group(1)}" x {match.group(2)}"'
    return str(dim_str)

def generate_cloudinary_id(series_folder, slug):
    """Generate Cloudinary ID from series and slug"""
    # For now, use placeholder pattern - will need actual IDs
    return f"/{series_folder}/{slug}_PLACEHOLDER"

def transform_to_mdx(canonical_fm, canonical_body, target_series):
    """Transform canonical frontmatter to Astro MDX format"""

    # Build MDX frontmatter (ensure no None/null values)
    mdx_fm = {
        "content-type": "artwork",
        "series": SERIES_NAMES.get(target_series, target_series),
        "slug": canonical_fm.get("slug") or "",
        "name": (canonical_fm.get("title") or "").replace("©", "").strip(),
        "title": (canonical_fm.get("title") or "").replace("©", "").strip(),
        "altTag": f"Picture of {(canonical_fm.get('title') or '').replace('©', '').strip()} by Dr. Masumi Hayashi",
        "media": canonical_fm.get("medium") or "Panoramic photo collage",
        "year": str(canonical_fm.get("date") or ""),
        "city": canonical_fm.get("city") or "",
        "state": canonical_fm.get("state") or "",
        "country": canonical_fm.get("country") or "",
        "size": format_dimensions(canonical_fm.get("dimensions")) or "",
        "inventory": "1 framed" if canonical_fm.get("inInventory") else "",
        "cloudinaryId": generate_cloudinary_id(target_series, canonical_fm.get("slug") or "")
    }

    # Build MDX content with properly quoted values
    def quote_value(v):
        """Ensure value is properly quoted for YAML"""
        if v == "":
            return '""'
        # If value contains quotes, escape them and wrap in quotes
        if '"' in str(v):
            escaped = str(v).replace('"', '\\"')
            return f'"{escaped}"'
        # If value contains colons, wrap in quotes
        if ':' in str(v):
            return f'"{v}"'
        return v

    mdx_content = f"""---
content-type: artwork
series: {quote_value(mdx_fm['series'])}
slug: {quote_value(mdx_fm['slug'])}
name: {quote_value(mdx_fm['name'])}
title: {quote_value(mdx_fm['title'])}
altTag: {quote_value(mdx_fm['altTag'])}
media: {quote_value(mdx_fm['media'])}
year: {quote_value(mdx_fm['year'])}
city: {quote_value(mdx_fm['city'])}
state: {quote_value(mdx_fm['state'])}
country: {quote_value(mdx_fm['country'])}
size: {quote_value(mdx_fm['size'])}
inventory: {quote_value(mdx_fm['inventory'])}
cloudinaryId: {quote_value(mdx_fm['cloudinaryId'])}
---

"""

    return mdx_content

def get_existing_slugs(target_dir):
    """Get list of existing artwork slugs in target directory"""
    target_path = Path(TARGET_BASE) / target_dir
    if not target_path.exists():
        return set()

    existing = set()
    for mdx_file in target_path.glob("*.mdx"):
        existing.add(mdx_file.stem)
    return existing

def migrate_series(canonical_dir, target_dir, target_count):
    """Migrate artworks from canonical to target directory"""
    canonical_path = Path(CANONICAL_BASE) / canonical_dir
    target_path = Path(TARGET_BASE) / target_dir

    # Create target directory if needed
    target_path.mkdir(parents=True, exist_ok=True)

    # Get existing artworks
    existing_slugs = get_existing_slugs(target_dir)
    existing_count = len(existing_slugs)

    print(f"\n{canonical_dir} -> {target_dir}")
    print(f"  Existing: {existing_count}, Target: {target_count}")

    if existing_count >= target_count:
        print(f"  ✓ Already complete")
        return 0

    needed = target_count - existing_count
    print(f"  Need: {needed} more artworks")

    # Get tier-1 markdown files (skip SHORT versions)
    md_files = sorted(canonical_path.glob("*.md"))
    tier1_files = []

    for md_file in md_files:
        # Skip SHORT versions - they're size variants
        if "-SHORT" in md_file.stem:
            continue

        content = md_file.read_text()
        fm, body = parse_frontmatter(content)

        # Check if tier 1 and not already migrated
        if fm.get("tier") == 1 and fm.get("slug") not in existing_slugs:
            tier1_files.append((md_file, fm, body))

    print(f"  Available tier-1: {len(tier1_files)}")

    # Migrate up to needed count
    migrated = 0
    for md_file, fm, body in tier1_files[:needed]:
        slug = fm.get("slug")
        if not slug:
            continue

        # Transform to MDX
        mdx_content = transform_to_mdx(fm, body, target_dir)

        # Write MDX file
        output_file = target_path / f"{slug}.mdx"
        output_file.write_text(mdx_content)
        migrated += 1
        print(f"    ✓ {slug}")

    print(f"  Migrated: {migrated} artworks")
    return migrated

def main():
    """Migrate all series"""
    print("=" * 60)
    print("ARTWORK MIGRATION: Canonical -> Astro MDX")
    print("=" * 60)

    total_migrated = 0

    for canonical_dir, (target_dir, target_count) in SERIES_MAP.items():
        migrated = migrate_series(canonical_dir, target_dir, target_count)
        total_migrated += migrated

    print("\n" + "=" * 60)
    print(f"TOTAL MIGRATED: {total_migrated} artworks")
    print("=" * 60)

if __name__ == "__main__":
    main()

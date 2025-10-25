#!/usr/bin/env python3
"""
Fix imageSlug values in MDX files to match actual responsive image filenames.
This script finds the correct responsive image filename for each MDX file and updates the imageSlug.
"""

import re
from pathlib import Path
from difflib import get_close_matches

def get_responsive_images():
    """Get all responsive image base names (without breakpoint suffix)."""
    responsive_dir = Path('public/images/responsive')
    images = set()

    for img in responsive_dir.glob('*-640w.jpg'):
        # Remove the breakpoint suffix to get base name
        base_name = img.stem.replace('-640w', '')
        images.add(base_name)

    return sorted(images)

def extract_image_slug(mdx_file):
    """Extract current imageSlug value from MDX frontmatter."""
    content = mdx_file.read_text()
    match = re.search(r'^imageSlug:\s*(.+)$', content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return None

def find_matching_image(slug, available_images):
    """Find best matching responsive image filename for a slug."""
    # Manual mappings for edge cases where fuzzy matching fails
    manual_mappings = {
        'big-sur-2': 'big-sur-beach-no-2-big-sur-california',
        'angkor-wat-1': 'angkor-wat-no-1-angkor-siem-reap-cambodia',
        'angkor-thom-bayon-temple': 'bayon-angkor-thom-angkor-siem-reap-cambodia',
        'love-canal-1': 'love-canal-no-1-niagra-falls-new-york',
        'love-canal-2': 'love-canal-no-2-niagra-falls-new-york',
        'century-freeway-1': 'century-freeway-no-1-los-angeles-california',
        'century-freeway-2': 'century-freeway-no-2-los-angeles-california',
        'century-freeway-3': 'century-freeway-no-3-los-angeles-california',
        'century-freeway-4': 'century-freeway-no-4-los-angeles-california',
        'century-freeway-6': 'century-freeway-no-6-los-angeles-california',
        'century-freeway-7': 'century-freeway-no-7-los-angeles-california',
        'laskin-poplar-oil': 'laskinpoplar-oil-company-jefferson-township-ohio',
        'alcatraz-shower-room': 'alcatraz-penitentiary-shower-room-san-francisco-california',
        'city-of-the-dead-2': 'city-of-the-dead-no-2-okunoin-koya-wakayama-japan',
        'ellora-caves-32-indra-sabha': 'ellora-caves-cave-32-ellora-maharashtra-india',
        'angkor-wat-preah-khan': 'preah-khan-temple-angkor-siem-reap-cambodia',
        'river-ganges-1': 'river-ganges-varanasi-uttar-pradesh-india',
        'saint-in-marketplace': 'the-saint-in-the-market-place-meenakshi-temple-madurai-tamil-nadu-india',
    }

    # Check manual mappings first
    if slug in manual_mappings:
        return manual_mappings[slug]

    # Direct match
    if slug in available_images:
        return slug

    # Fuzzy match - find closest match
    matches = get_close_matches(slug, available_images, n=1, cutoff=0.6)
    if matches:
        return matches[0]

    # Try partial match - if slug is contained in any image name
    for img in available_images:
        if slug.lower() in img.lower():
            return img

    return None

def update_image_slug(mdx_file, new_slug):
    """Update imageSlug value in MDX frontmatter."""
    content = mdx_file.read_text()

    # Replace the imageSlug line
    new_content = re.sub(
        r'^imageSlug:\s*.+$',
        f'imageSlug: {new_slug}',
        content,
        count=1,
        flags=re.MULTILINE
    )

    mdx_file.write_text(new_content)
    return True

def main():
    print("Loading responsive images...")
    responsive_images = get_responsive_images()
    print(f"Found {len(responsive_images)} responsive image sets\n")

    content_dir = Path('src/content/artwork')
    fixed_count = 0
    no_match_count = 0
    already_correct = 0

    print("Checking MDX files...\n")

    for mdx_file in sorted(content_dir.rglob('*.mdx')):
        current_slug = extract_image_slug(mdx_file)

        if not current_slug:
            print(f"⚠️  {mdx_file.relative_to(content_dir)} - No imageSlug found")
            continue

        # Check if current slug matches an existing image
        if current_slug in responsive_images:
            already_correct += 1
            continue

        # Find matching image
        matched_image = find_matching_image(current_slug, responsive_images)

        if matched_image:
            update_image_slug(mdx_file, matched_image)
            print(f"✓ {mdx_file.relative_to(content_dir)}")
            print(f"  {current_slug} → {matched_image}")
            fixed_count += 1
        else:
            print(f"✗ {mdx_file.relative_to(content_dir)}")
            print(f"  No match found for: {current_slug}")
            no_match_count += 1

    print(f"\n{'='*60}")
    print(f"Results:")
    print(f"  ✓ Fixed: {fixed_count}")
    print(f"  ✓ Already correct: {already_correct}")
    print(f"  ✗ No match found: {no_match_count}")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()

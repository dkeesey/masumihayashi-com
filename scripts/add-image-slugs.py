#!/usr/bin/env python3
"""
Add imageSlug field to MDX files that have slug but no imageSlug.
This fixes the issue where Astro's built-in slug overrides frontmatter slug.
"""

import re
from pathlib import Path

def add_image_slug(mdx_file):
    """Add imageSlug field to MDX file if it has slug but no imageSlug."""
    content = mdx_file.read_text()

    # Check if already has imageSlug
    if re.search(r'^imageSlug:', content, re.MULTILINE):
        return False

    # Find slug value
    slug_match = re.search(r'^slug:\s*(.+)$', content, re.MULTILINE)
    if not slug_match:
        return False

    slug_value = slug_match.group(1).strip()

    # Add imageSlug right after slug line
    new_content = re.sub(
        r'(^slug:.+)$',
        f'\\1\nimageSlug: {slug_value}',
        content,
        count=1,
        flags=re.MULTILINE
    )

    mdx_file.write_text(new_content)
    return True

def main():
    content_dir = Path('src/content/artwork')
    modified_count = 0

    for mdx_file in content_dir.rglob('*.mdx'):
        if add_image_slug(mdx_file):
            print(f"✓ {mdx_file.relative_to(content_dir)}")
            modified_count += 1

    print(f"\nModified {modified_count} files")

if __name__ == '__main__':
    main()

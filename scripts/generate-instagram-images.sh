#!/bin/bash

###############################################################################
# Instagram Image Generator for Masumi Hayashi Foundation
#
# Generates Instagram-optimized images with letterboxing and baked-in credits
#
# Output formats:
#   - Feed: 1080x566px landscape with black letterbox borders
#   - Story: 1080x1920px portrait with text overlay
#
# Credits embedded:
#   - Artwork title
#   - Artist: Masumi Hayashi
#   - Year
#   - © Masumi Hayashi Foundation
#   - masumihayashi.com
###############################################################################

set -e  # Exit on error

# Directories
SOURCE_DIR="$(dirname "$0")/../public/images/responsive"  # Use already-processed responsive images
DEST_DIR="$(dirname "$0")/../public/images/instagram"
METADATA_DIR="$(dirname "$0")/../src/content/artwork"

# Create destination directory
mkdir -p "$DEST_DIR"

# Instagram feed dimensions (1.91:1 landscape - max allowed)
FEED_WIDTH=1080
FEED_HEIGHT=566
ARTWORK_HEIGHT=486  # 566 - 40px top - 40px bottom

# Text styling
FONT="Inter-Regular"  # Modern museum typography
TITLE_FONTSIZE=16
CREDIT_FONTSIZE=14
TEXT_COLOR="white"
BG_COLOR="black"

# Counter
PROCESSED=0
SKIPPED=0

###############################################################################
# Function: Extract metadata from MDX frontmatter
###############################################################################
get_metadata() {
    local slug="$1"
    local mdx_file=""

    # Search for MDX file in all series subdirectories
    mdx_file=$(find "$METADATA_DIR" -name "${slug}.mdx" 2>/dev/null | head -1)

    if [ -z "$mdx_file" ]; then
        echo "---|||Unknown Title|||1900" # Return defaults if not found
        return
    fi

    # Extract frontmatter fields
    local title=$(grep "^name:" "$mdx_file" | head -1 | sed 's/^name: *//' | tr -d '"')
    local year=$(grep "^year:" "$mdx_file" | head -1 | sed 's/^year: *//' | tr -d '"')
    local city=$(grep "^city:" "$mdx_file" | head -1 | sed 's/^city: *//' | tr -d '"')
    local state=$(grep "^state:" "$mdx_file" | head -1 | sed 's/^state: *//' | tr -d '"')

    # Combine city and state for location
    local location=""
    if [ -n "$city" ] && [ -n "$state" ]; then
        location="${city}, ${state}"
    elif [ -n "$city" ]; then
        location="${city}"
    elif [ -n "$state" ]; then
        location="${state}"
    fi

    # Default values if empty
    title=${title:-"Untitled"}
    year=${year:-""}

    echo "${title}|||${location}|||${year}"
}

###############################################################################
# Function: Generate Instagram Feed image (1080x566 letterbox)
###############################################################################
generate_feed_image() {
    local source_file="$1"
    local slug="$2"
    local output_file="$3"

    # Get metadata
    local metadata=$(get_metadata "$slug")
    IFS='|||' read -r title location year <<< "$metadata"

    # Construct title line
    local title_text="${title}"
    if [ -n "$location" ]; then
        title_text="${title}, ${location}"
    fi

    # Construct artist line
    local artist_text="Masumi Hayashi"
    if [ -n "$year" ]; then
        artist_text="${artist_text}, ${year}"
    fi

    # Copyright line
    local copyright_text="© Masumi Hayashi Foundation"
    local website_text="masumihayashi.com"

    echo "  Processing: $slug"
    echo "    Title: $title_text"
    echo "    Artist: $artist_text"

    # Step 1: Resize artwork to fit in 1080x486 area (preserving aspect ratio)
    convert "$source_file" \
        -resize "1080x${ARTWORK_HEIGHT}>" \
        -background "$BG_COLOR" \
        -gravity center \
        -extent "1080x${ARTWORK_HEIGHT}" \
        /tmp/instagram_artwork.jpg

    # Step 2: Create top border with title
    convert -size 1080x40 xc:"$BG_COLOR" \
        -gravity west \
        -font "$FONT" \
        -pointsize "$TITLE_FONTSIZE" \
        -fill "$TEXT_COLOR" \
        -annotate +20+0 "${title_text}" \
        /tmp/instagram_top.jpg

    # Step 3: Create bottom border with copyright
    convert -size 1080x40 xc:"$BG_COLOR" \
        -gravity west \
        -font "$FONT" \
        -pointsize "$CREDIT_FONTSIZE" \
        -fill "$TEXT_COLOR" \
        -annotate +20+0 "${copyright_text}  •  ${website_text}" \
        /tmp/instagram_bottom.jpg

    # Step 4: Stack all three layers
    convert /tmp/instagram_top.jpg \
        /tmp/instagram_artwork.jpg \
        /tmp/instagram_bottom.jpg \
        -append \
        "$output_file"

    # Cleanup temp files
    rm /tmp/instagram_top.jpg /tmp/instagram_artwork.jpg /tmp/instagram_bottom.jpg

    ((PROCESSED++))
}

###############################################################################
# Main processing loop
###############################################################################

echo "=========================================="
echo "Instagram Image Generator"
echo "=========================================="
echo ""
echo "Source: $SOURCE_DIR"
echo "Destination: $DEST_DIR"
echo ""

# Find all unique artwork slugs (from 1440w variants)
for source_file in "$SOURCE_DIR"/*-1440w.jpg; do
    [ -e "$source_file" ] || continue

    # Extract slug (remove -1440w.jpg)
    filename=$(basename "$source_file")
    slug="${filename%-1440w.jpg}"

    # Output file
    output_file="$DEST_DIR/${slug}-instagram-feed.jpg"

    # Skip if already exists (unless force flag set)
    if [ -f "$output_file" ] && [ -z "$FORCE" ]; then
        ((SKIPPED++))
        continue
    fi

    # Generate Instagram feed image
    generate_feed_image "$source_file" "$slug" "$output_file"
done

echo ""
echo "=========================================="
echo "Complete!"
echo "=========================================="
echo "Processed: $PROCESSED images"
echo "Skipped (already exist): $SKIPPED images"
echo ""
echo "Output location: $DEST_DIR"
echo ""
echo "To regenerate all images: FORCE=1 $0"
echo ""

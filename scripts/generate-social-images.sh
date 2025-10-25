#!/bin/bash

###############################################################################
# Social Media Image Generator for Masumi Hayashi Foundation
#
# Generates social media-optimized images with letterboxing and baked-in credits
#
# IMPORTANT: ALL formats use letterboxing to show the complete panoramic
# composition. We NEVER crop Masumi's carefully constructed images.
#
# Output formats:
#   - Instagram Feed Landscape: 1080x566px (1.91:1)
#   - Instagram Square: 1080x1080px (1:1)
#   - Instagram Portrait: 1080x1350px (4:5)
#   - Instagram Story: 1080x1920px (9:16) - full image letterboxed
#   - Twitter/Facebook: 1200x675px (16:9)
#   - Pinterest: 1000x1500px (2:3)
#
# Usage:
#   ./generate-social-images.sh              # Generate all missing images
#   FORCE=1 ./generate-social-images.sh      # Regenerate all images
#   FORMAT=square ./generate-social-images.sh # Generate only square format
###############################################################################

set -e  # Exit on error

# Directories
SOURCE_DIR="$(dirname "$0")/../public/images/responsive"
DEST_DIR="$(dirname "$0")/../public/images/social"
METADATA_DIR="$(dirname "$0")/../src/content/artwork"

# Create destination directories
mkdir -p "$DEST_DIR/instagram-feed"
mkdir -p "$DEST_DIR/instagram-square"
mkdir -p "$DEST_DIR/instagram-portrait"
mkdir -p "$DEST_DIR/instagram-story"
mkdir -p "$DEST_DIR/twitter"
mkdir -p "$DEST_DIR/pinterest"

# Also maintain legacy instagram directory
mkdir -p "$(dirname "$0")/../public/images/instagram"

# Text styling
FONT="Inter-Regular"
TITLE_FONTSIZE=16
CREDIT_FONTSIZE=14
TEXT_COLOR="white"
BG_COLOR="black"

# Counters
PROCESSED_FEED=0
PROCESSED_SQUARE=0
PROCESSED_PORTRAIT=0
PROCESSED_STORY=0
PROCESSED_TWITTER=0
PROCESSED_PINTEREST=0
SKIPPED_FEED=0
SKIPPED_SQUARE=0
SKIPPED_PORTRAIT=0
SKIPPED_STORY=0
SKIPPED_TWITTER=0
SKIPPED_PINTEREST=0

###############################################################################
# Function: Extract metadata from MDX frontmatter
###############################################################################
get_metadata() {
    local slug="$1"
    local mdx_file=""

    # Search for MDX file in all series subdirectories
    mdx_file=$(find "$METADATA_DIR" -name "${slug}.mdx" 2>/dev/null | head -1)

    if [ -z "$mdx_file" ]; then
        echo "---|||Unknown Title|||1900|||" # Return defaults if not found
        return
    fi

    # Extract frontmatter fields
    local title=$(grep "^name:" "$mdx_file" | head -1 | sed 's/^name: *//' | tr -d '"')
    local year=$(grep "^year:" "$mdx_file" | head -1 | sed 's/^year: *//' | tr -d '"')
    local city=$(grep "^city:" "$mdx_file" | head -1 | sed 's/^city: *//' | tr -d '"')
    local state=$(grep "^state:" "$mdx_file" | head -1 | sed 's/^state: *//' | tr -d '"')
    local media=$(grep "^media:" "$mdx_file" | head -1 | sed 's/^media: *//' | tr -d '"')

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
    media=${media:-"Panoramic photo collage"}

    echo "${title}|||${location}|||${year}|||${media}"
}

###############################################################################
# Function: Get image dimensions
###############################################################################
get_image_dimensions() {
    local image="$1"
    magick identify -format "%w %h" "$image"
}

###############################################################################
# Function: Determine if image is portrait or landscape
###############################################################################
is_portrait() {
    local image="$1"
    read -r width height <<< $(get_image_dimensions "$image")
    [ "$height" -gt "$width" ]
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
    IFS='|||' read -r title location year media <<< "$metadata"

    # Construct title line
    local title_text="${title}"
    if [ -n "$location" ]; then
        title_text="${title}, ${location}"
    fi

    # Copyright line
    local copyright_text="© Masumi Hayashi Foundation  •  masumihayashi.com"

    # Dimensions
    local FEED_WIDTH=1080
    local FEED_HEIGHT=566
    local ARTWORK_HEIGHT=486  # 566 - 40px top - 40px bottom

    # Step 1: Resize artwork to fit in 1080x486 area
    magick "$source_file" \
        -resize "${FEED_WIDTH}x${ARTWORK_HEIGHT}>" \
        -background "$BG_COLOR" \
        -gravity center \
        -extent "${FEED_WIDTH}x${ARTWORK_HEIGHT}" \
        /tmp/instagram_artwork.jpg

    # Step 2: Create top border with title
    magick -size ${FEED_WIDTH}x40 xc:"$BG_COLOR" \
        -gravity west \
        -font "$FONT" \
        -pointsize "$TITLE_FONTSIZE" \
        -fill "$TEXT_COLOR" \
        -annotate +20+0 "${title_text}" \
        /tmp/instagram_top.jpg

    # Step 3: Create bottom border with copyright
    magick -size ${FEED_WIDTH}x40 xc:"$BG_COLOR" \
        -gravity west \
        -font "$FONT" \
        -pointsize "$CREDIT_FONTSIZE" \
        -fill "$TEXT_COLOR" \
        -annotate +20+0 "${copyright_text}" \
        /tmp/instagram_bottom.jpg

    # Step 4: Stack all three layers
    magick /tmp/instagram_top.jpg \
        /tmp/instagram_artwork.jpg \
        /tmp/instagram_bottom.jpg \
        -append \
        "$output_file"

    # Cleanup
    rm /tmp/instagram_top.jpg /tmp/instagram_artwork.jpg /tmp/instagram_bottom.jpg

    ((PROCESSED_FEED++))
}

###############################################################################
# Function: Generate Instagram Square image (1080x1080 letterbox)
###############################################################################
generate_square_image() {
    local source_file="$1"
    local slug="$2"
    local output_file="$3"

    # Get metadata
    local metadata=$(get_metadata "$slug")
    IFS='|||' read -r title location year media <<< "$metadata"

    # Dimensions
    local SIZE=1080
    local TOP_BAR=50
    local BOTTOM_BAR=70
    local ARTWORK_HEIGHT=$((SIZE - TOP_BAR - BOTTOM_BAR))  # 960px for artwork

    # Construct text lines
    local title_text="${title}"
    if [ -n "$year" ]; then
        title_text="${title_text} (${year})"
    fi

    local bottom_line1="Dr. Masumi Hayashi"
    if [ -n "$location" ]; then
        bottom_line1="${bottom_line1}  •  ${location}"
    fi

    local bottom_line2="© Masumi Hayashi Foundation  •  masumihayashi.com"

    # Step 1: Resize artwork to fit in 1080x960 area
    magick "$source_file" \
        -resize "${SIZE}x${ARTWORK_HEIGHT}>" \
        -background "$BG_COLOR" \
        -gravity center \
        -extent "${SIZE}x${ARTWORK_HEIGHT}" \
        /tmp/square_artwork.jpg

    # Step 2: Create top bar with title and artist
    magick -size ${SIZE}x${TOP_BAR} xc:"$BG_COLOR" \
        -gravity west \
        -font "$FONT" \
        -pointsize "$TITLE_FONTSIZE" \
        -fill "$TEXT_COLOR" \
        -annotate +20+0 "${title_text}" \
        /tmp/square_top.jpg

    # Step 3: Create bottom bar with location and copyright (2 lines)
    magick -size ${SIZE}x${BOTTOM_BAR} xc:"$BG_COLOR" \
        -gravity northwest \
        -font "$FONT" \
        -pointsize "$CREDIT_FONTSIZE" \
        -fill "$TEXT_COLOR" \
        -annotate +20+5 "${bottom_line1}" \
        -annotate +20+30 "${bottom_line2}" \
        /tmp/square_bottom.jpg

    # Step 4: Stack all three layers
    magick /tmp/square_top.jpg \
        /tmp/square_artwork.jpg \
        /tmp/square_bottom.jpg \
        -append \
        "$output_file"

    # Cleanup
    rm /tmp/square_top.jpg /tmp/square_artwork.jpg /tmp/square_bottom.jpg

    ((PROCESSED_SQUARE++))
}

###############################################################################
# Function: Generate Instagram Portrait image (1080x1350 letterbox)
###############################################################################
generate_portrait_image() {
    local source_file="$1"
    local slug="$2"
    local output_file="$3"

    # Get metadata
    local metadata=$(get_metadata "$slug")
    IFS='|||' read -r title location year media <<< "$metadata"

    # Dimensions
    local WIDTH=1080
    local HEIGHT=1350
    local TOP_BAR=40
    local BOTTOM_BAR=60
    local ARTWORK_HEIGHT=$((HEIGHT - TOP_BAR - BOTTOM_BAR))  # 1250px

    # Construct text
    local title_text="${title}"
    if [ -n "$location" ]; then
        title_text="${title}, ${location}"
    fi

    local bottom_text="Dr. Masumi Hayashi"
    if [ -n "$year" ]; then
        bottom_text="${bottom_text}, ${year}"
    fi
    bottom_text="${bottom_text}  •  © Masumi Hayashi Foundation"

    # Step 1: Resize artwork
    magick "$source_file" \
        -resize "${WIDTH}x${ARTWORK_HEIGHT}>" \
        -background "$BG_COLOR" \
        -gravity center \
        -extent "${WIDTH}x${ARTWORK_HEIGHT}" \
        /tmp/portrait_artwork.jpg

    # Step 2: Create top bar
    magick -size ${WIDTH}x${TOP_BAR} xc:"$BG_COLOR" \
        -gravity west \
        -font "$FONT" \
        -pointsize "$TITLE_FONTSIZE" \
        -fill "$TEXT_COLOR" \
        -annotate +20+0 "${title_text}" \
        /tmp/portrait_top.jpg

    # Step 3: Create bottom bar
    magick -size ${WIDTH}x${BOTTOM_BAR} xc:"$BG_COLOR" \
        -gravity northwest \
        -font "$FONT" \
        -pointsize "$CREDIT_FONTSIZE" \
        -fill "$TEXT_COLOR" \
        -annotate +20+5 "${bottom_text}" \
        -annotate +20+30 "masumihayashi.com" \
        /tmp/portrait_bottom.jpg

    # Step 4: Stack layers
    magick /tmp/portrait_top.jpg \
        /tmp/portrait_artwork.jpg \
        /tmp/portrait_bottom.jpg \
        -append \
        "$output_file"

    # Cleanup
    rm /tmp/portrait_top.jpg /tmp/portrait_artwork.jpg /tmp/portrait_bottom.jpg

    ((PROCESSED_PORTRAIT++))
}

###############################################################################
# Function: Generate Instagram Story image (1080x1920 letterbox)
# NOTE: Full image letterboxed - NEVER crop the panoramic compositions
###############################################################################
generate_story_image() {
    local source_file="$1"
    local slug="$2"
    local output_file="$3"

    # Get metadata
    local metadata=$(get_metadata "$slug")
    IFS='|||' read -r title location year media <<< "$metadata"

    # Dimensions
    local WIDTH=1080
    local HEIGHT=1920
    local TOP_BAR=60
    local BOTTOM_BAR=80
    local ARTWORK_HEIGHT=$((HEIGHT - TOP_BAR - BOTTOM_BAR))  # 1780px

    # Construct text
    local title_text="${title}"
    if [ -n "$year" ]; then
        title_text="${title_text} (${year})"
    fi

    local artist_text="Dr. Masumi Hayashi"
    if [ -n "$location" ]; then
        artist_text="${artist_text}  •  ${location}"
    fi

    # Step 1: Resize artwork - LETTERBOX FULL IMAGE (never crop)
    magick "$source_file" \
        -resize "${WIDTH}x${ARTWORK_HEIGHT}>" \
        -background "$BG_COLOR" \
        -gravity center \
        -extent "${WIDTH}x${ARTWORK_HEIGHT}" \
        /tmp/story_artwork.jpg

    # Step 2: Create top bar
    magick -size ${WIDTH}x${TOP_BAR} xc:"$BG_COLOR" \
        -gravity center \
        -font "$FONT" \
        -pointsize 18 \
        -fill "$TEXT_COLOR" \
        -annotate +0+0 "${title_text}" \
        /tmp/story_top.jpg

    # Step 3: Create bottom bar
    magick -size ${WIDTH}x${BOTTOM_BAR} xc:"$BG_COLOR" \
        -gravity northwest \
        -font "$FONT" \
        -pointsize "$CREDIT_FONTSIZE" \
        -fill "$TEXT_COLOR" \
        -annotate +20+10 "${artist_text}" \
        -annotate +20+35 "© Masumi Hayashi Foundation" \
        -annotate +20+60 "masumihayashi.com" \
        /tmp/story_bottom.jpg

    # Step 4: Stack layers
    magick /tmp/story_top.jpg \
        /tmp/story_artwork.jpg \
        /tmp/story_bottom.jpg \
        -append \
        "$output_file"

    # Cleanup
    rm /tmp/story_top.jpg /tmp/story_artwork.jpg /tmp/story_bottom.jpg

    ((PROCESSED_STORY++))
}

###############################################################################
# Function: Generate Twitter/Facebook image (1200x675 letterbox)
###############################################################################
generate_twitter_image() {
    local source_file="$1"
    local slug="$2"
    local output_file="$3"

    # Get metadata
    local metadata=$(get_metadata "$slug")
    IFS='|||' read -r title location year media <<< "$metadata"

    # Dimensions
    local WIDTH=1200
    local HEIGHT=675
    local TOP_BAR=40
    local BOTTOM_BAR=40
    local ARTWORK_HEIGHT=$((HEIGHT - TOP_BAR - BOTTOM_BAR))  # 595px

    # Construct text
    local title_text="${title}"
    if [ -n "$location" ]; then
        title_text="${title}, ${location}"
    fi

    local copyright_text="Dr. Masumi Hayashi  •  © Masumi Hayashi Foundation  •  masumihayashi.com"

    # Step 1: Resize artwork
    magick "$source_file" \
        -resize "${WIDTH}x${ARTWORK_HEIGHT}>" \
        -background "$BG_COLOR" \
        -gravity center \
        -extent "${WIDTH}x${ARTWORK_HEIGHT}" \
        /tmp/twitter_artwork.jpg

    # Step 2: Create top bar
    magick -size ${WIDTH}x${TOP_BAR} xc:"$BG_COLOR" \
        -gravity west \
        -font "$FONT" \
        -pointsize "$TITLE_FONTSIZE" \
        -fill "$TEXT_COLOR" \
        -annotate +20+0 "${title_text}" \
        /tmp/twitter_top.jpg

    # Step 3: Create bottom bar
    magick -size ${WIDTH}x${BOTTOM_BAR} xc:"$BG_COLOR" \
        -gravity west \
        -font "$FONT" \
        -pointsize "$CREDIT_FONTSIZE" \
        -fill "$TEXT_COLOR" \
        -annotate +20+0 "${copyright_text}" \
        /tmp/twitter_bottom.jpg

    # Step 4: Stack layers
    magick /tmp/twitter_top.jpg \
        /tmp/twitter_artwork.jpg \
        /tmp/twitter_bottom.jpg \
        -append \
        "$output_file"

    # Cleanup
    rm /tmp/twitter_top.jpg /tmp/twitter_artwork.jpg /tmp/twitter_bottom.jpg

    ((PROCESSED_TWITTER++))
}

###############################################################################
# Function: Generate Pinterest image (1000x1500 letterbox)
###############################################################################
generate_pinterest_image() {
    local source_file="$1"
    local slug="$2"
    local output_file="$3"

    # Get metadata
    local metadata=$(get_metadata "$slug")
    IFS='|||' read -r title location year media <<< "$metadata"

    # Dimensions
    local WIDTH=1000
    local HEIGHT=1500
    local TOP_BAR=60
    local BOTTOM_BAR=80
    local ARTWORK_HEIGHT=$((HEIGHT - TOP_BAR - BOTTOM_BAR))  # 1360px

    # Construct text
    local title_text="${title}"
    if [ -n "$year" ]; then
        title_text="${title_text} (${year})"
    fi

    local artist_text="Dr. Masumi Hayashi"
    if [ -n "$location" ]; then
        artist_text="${artist_text}  •  ${location}"
    fi

    # Step 1: Resize artwork
    magick "$source_file" \
        -resize "${WIDTH}x${ARTWORK_HEIGHT}>" \
        -background "$BG_COLOR" \
        -gravity center \
        -extent "${WIDTH}x${ARTWORK_HEIGHT}" \
        /tmp/pinterest_artwork.jpg

    # Step 2: Create top bar
    magick -size ${WIDTH}x${TOP_BAR} xc:"$BG_COLOR" \
        -gravity center \
        -font "$FONT" \
        -pointsize 18 \
        -fill "$TEXT_COLOR" \
        -annotate +0+0 "${title_text}" \
        /tmp/pinterest_top.jpg

    # Step 3: Create bottom bar
    magick -size ${WIDTH}x${BOTTOM_BAR} xc:"$BG_COLOR" \
        -gravity northwest \
        -font "$FONT" \
        -pointsize 14 \
        -fill "$TEXT_COLOR" \
        -annotate +20+10 "${artist_text}" \
        -annotate +20+35 "© Masumi Hayashi Foundation" \
        -annotate +20+60 "masumihayashi.com" \
        /tmp/pinterest_bottom.jpg

    # Step 4: Stack layers
    magick /tmp/pinterest_top.jpg \
        /tmp/pinterest_artwork.jpg \
        /tmp/pinterest_bottom.jpg \
        -append \
        "$output_file"

    # Cleanup
    rm /tmp/pinterest_top.jpg /tmp/pinterest_artwork.jpg /tmp/pinterest_bottom.jpg

    ((PROCESSED_PINTEREST++))
}

###############################################################################
# Main processing loop
###############################################################################

echo "=========================================="
echo "Social Media Image Generator"
echo "=========================================="
echo ""
echo "Source: $SOURCE_DIR"
echo "Destination: $DEST_DIR"
echo ""

# Determine which formats to generate
FORMATS="${FORMAT:-all}"
if [ "$FORMATS" = "all" ]; then
    FORMATS="feed square portrait story twitter pinterest"
fi

echo "Generating formats: $FORMATS"
echo ""

# Find all unique artwork slugs (from 1440w variants)
for source_file in "$SOURCE_DIR"/*-1440w.jpg; do
    [ -e "$source_file" ] || continue

    # Extract slug (remove -1440w.jpg)
    filename=$(basename "$source_file")
    slug="${filename%-1440w.jpg}"

    echo "Processing: $slug"

    # Generate Instagram Feed (1080x566)
    if [[ "$FORMATS" =~ "feed" ]]; then
        output_file="$DEST_DIR/instagram-feed/${slug}-instagram-feed.jpg"
        legacy_file="$(dirname "$0")/../public/images/instagram/${slug}-instagram-feed.jpg"

        if [ ! -f "$output_file" ] || [ -n "$FORCE" ]; then
            generate_feed_image "$source_file" "$slug" "$output_file"
            # Also copy to legacy location
            cp "$output_file" "$legacy_file"
            echo "  ✓ Feed (1080x566)"
        else
            ((SKIPPED_FEED++))
        fi
    fi

    # Generate Instagram Square (1080x1080)
    if [[ "$FORMATS" =~ "square" ]]; then
        output_file="$DEST_DIR/instagram-square/${slug}-instagram-square.jpg"

        if [ ! -f "$output_file" ] || [ -n "$FORCE" ]; then
            generate_square_image "$source_file" "$slug" "$output_file"
            echo "  ✓ Square (1080x1080)"
        else
            ((SKIPPED_SQUARE++))
        fi
    fi

    # Generate Instagram Portrait (1080x1350)
    if [[ "$FORMATS" =~ "portrait" ]]; then
        output_file="$DEST_DIR/instagram-portrait/${slug}-instagram-portrait.jpg"

        if [ ! -f "$output_file" ] || [ -n "$FORCE" ]; then
            generate_portrait_image "$source_file" "$slug" "$output_file"
            echo "  ✓ Portrait (1080x1350)"
        else
            ((SKIPPED_PORTRAIT++))
        fi
    fi

    # Generate Instagram Story (1080x1920)
    if [[ "$FORMATS" =~ "story" ]]; then
        output_file="$DEST_DIR/instagram-story/${slug}-instagram-story.jpg"

        if [ ! -f "$output_file" ] || [ -n "$FORCE" ]; then
            generate_story_image "$source_file" "$slug" "$output_file"
            echo "  ✓ Story (1080x1920)"
        else
            ((SKIPPED_STORY++))
        fi
    fi

    # Generate Twitter/Facebook (1200x675)
    if [[ "$FORMATS" =~ "twitter" ]]; then
        output_file="$DEST_DIR/twitter/${slug}-twitter.jpg"

        if [ ! -f "$output_file" ] || [ -n "$FORCE" ]; then
            generate_twitter_image "$source_file" "$slug" "$output_file"
            echo "  ✓ Twitter/FB (1200x675)"
        else
            ((SKIPPED_TWITTER++))
        fi
    fi

    # Generate Pinterest (1000x1500)
    if [[ "$FORMATS" =~ "pinterest" ]]; then
        output_file="$DEST_DIR/pinterest/${slug}-pinterest.jpg"

        if [ ! -f "$output_file" ] || [ -n "$FORCE" ]; then
            generate_pinterest_image "$source_file" "$slug" "$output_file"
            echo "  ✓ Pinterest (1000x1500)"
        else
            ((SKIPPED_PINTEREST++))
        fi
    fi

    echo ""
done

echo "=========================================="
echo "Complete!"
echo "=========================================="
echo ""

if [[ "$FORMATS" =~ "feed" ]]; then
    echo "Feed: $PROCESSED_FEED processed, $SKIPPED_FEED skipped"
fi
if [[ "$FORMATS" =~ "square" ]]; then
    echo "Square: $PROCESSED_SQUARE processed, $SKIPPED_SQUARE skipped"
fi
if [[ "$FORMATS" =~ "portrait" ]]; then
    echo "Portrait: $PROCESSED_PORTRAIT processed, $SKIPPED_PORTRAIT skipped"
fi
if [[ "$FORMATS" =~ "story" ]]; then
    echo "Story: $PROCESSED_STORY processed, $SKIPPED_STORY skipped"
fi
if [[ "$FORMATS" =~ "twitter" ]]; then
    echo "Twitter: $PROCESSED_TWITTER processed, $SKIPPED_TWITTER skipped"
fi
if [[ "$FORMATS" =~ "pinterest" ]]; then
    echo "Pinterest: $PROCESSED_PINTEREST processed, $SKIPPED_PINTEREST skipped"
fi

echo ""
echo "Output location: $DEST_DIR"
echo ""
echo "To regenerate all images: FORCE=1 $0"
echo "To generate specific format: FORMAT=square $0"
echo ""

#!/bin/bash
# Retry failed R2 uploads
# These 16 files failed during the bulk upload

set -e

BUCKET="masumi-hayashi-artworks"
SOURCE_DIR="public/images/responsive"
R2_PREFIX="artworks"

echo "🔄 Retrying failed uploads..."
echo ""

# List of failed files
FAILED_FILES=(
    "alcatraz-penitentiary-shower-room-san-francisco-california-1920w.jpg"
    "angler-internment-camp-guard-tower-1920w.jpg"
    "angler-internment-camp-kitchen-1920w.jpg"
    "city-of-the-dead-no-2-okunoin-koya-wakayama-japan-2460w.jpg"
    "cleveland-stadium-cleveland-ohio-2460w.jpg"
    "cultural-gardens-3-hebrew-cleveland-ohio-2460w.jpg"
    "gila-river-internment-camp-dog-grave-1920w.jpg"
    "granada-internment-camp-foundations-1440w.jpg"
    "granada-relocation-camp-foundations-granada-colorado-1440w.jpg"
    "heart-mt-relocation-camp-interior-park-county-wyoming-1920w.jpg"
    "manzanar-internment-camp-monument-1920w.jpg"
    "muthiah-ayyanar-temple-kochadai-village-tamil-nadu-india-2460w.jpg"
    "oserf-building-patio-columbus-ohio-2460w.jpg"
    "preah-khan-temple-angkor-siem-reap-cambodia-2460w.jpg"
    "rohwer-internment-camp-cemetary-1024w.jpg"
    "rohwer-internment-camp-cemetary-1440w.jpg"
)

UPLOADED=0
FAILED=0
TOTAL=${#FAILED_FILES[@]}

for filename in "${FAILED_FILES[@]}"; do
    file="$SOURCE_DIR/$filename"

    if [ ! -f "$file" ]; then
        echo "⚠️  File not found: $filename"
        FAILED=$((FAILED + 1))
        continue
    fi

    r2_path="$R2_PREFIX/$filename"

    # Upload with wrangler (--remote flag for production)
    if wrangler r2 object put "$BUCKET/$r2_path" --file="$file" --content-type="image/jpeg" --remote; then
        UPLOADED=$((UPLOADED + 1))
        echo "✅ [$UPLOADED/$TOTAL] Uploaded: $filename"
    else
        FAILED=$((FAILED + 1))
        echo "❌ [$FAILED/$TOTAL] Failed again: $filename"
    fi

    # Small delay to avoid rate limiting
    sleep 0.5
done

echo ""
echo "✨ Retry complete!"
echo "✅ Uploaded: $UPLOADED files"
if [ $FAILED -gt 0 ]; then
    echo "❌ Failed: $FAILED files"
fi

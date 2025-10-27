#!/bin/bash
# Upload responsive images to Cloudflare R2
# Bucket: masumi-hayashi-artworks
# Path: artworks/

set -e

BUCKET="masumi-hayashi-artworks"
SOURCE_DIR="public/images/responsive"
R2_PREFIX="artworks"

echo "🚀 Starting R2 upload..."
echo "📦 Bucket: $BUCKET"
echo "📁 Source: $SOURCE_DIR"
echo "🎯 Destination prefix: $R2_PREFIX"
echo ""

# Count total files
TOTAL_FILES=$(find "$SOURCE_DIR" -type f -name "*.jpg" | wc -l | tr -d ' ')
echo "📊 Total files to upload: $TOTAL_FILES"
echo ""

# Counter
UPLOADED=0
FAILED=0

# Upload each file
for file in "$SOURCE_DIR"/*.jpg; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        r2_path="$R2_PREFIX/$filename"

        # Upload with wrangler (--remote flag for production)
        if wrangler r2 object put "$BUCKET/$r2_path" --file="$file" --content-type="image/jpeg" --remote > /dev/null 2>&1; then
            UPLOADED=$((UPLOADED + 1))
            echo "✅ [$UPLOADED/$TOTAL_FILES] Uploaded: $filename"
        else
            FAILED=$((FAILED + 1))
            echo "❌ Failed: $filename"
        fi
    fi
done

echo ""
echo "✨ Upload complete!"
echo "✅ Uploaded: $UPLOADED files"
if [ $FAILED -gt 0 ]; then
    echo "❌ Failed: $FAILED files"
fi
echo ""
echo "🔗 Public URL: https://pub-3e1db27a71654e90b601053ceddb8b8f.r2.dev/artworks/[filename]"
echo ""
echo "💡 Update ResponsiveImage.astro to use:"
echo "   const basePath = \"https://pub-3e1db27a71654e90b601053ceddb8b8f.r2.dev/artworks\";"

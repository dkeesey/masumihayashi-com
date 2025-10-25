/**
 * Instagram Image Generator for Masumi Hayashi Foundation
 *
 * Generates Instagram-optimized images with letterboxing and baked-in credits
 * Uses Inter font (matching site typography)
 *
 * Requirements: npm install sharp
 *
 * Output format: 1080x566px landscape with black letterbox borders
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories
const SOURCE_DIR = '/Volumes/PRO-G40/MH-imageprocessing/responsive-variants';
const DEST_DIR = path.join(__dirname, '../public/images/instagram');
const METADATA_DIR = path.join(__dirname, '../src/content/artwork');

// Instagram feed dimensions (1.91:1 landscape - max allowed)
const FEED_WIDTH = 1080;
const FEED_HEIGHT = 566;
const BORDER_HEIGHT = 40;
const ARTWORK_HEIGHT = FEED_HEIGHT - (BORDER_HEIGHT * 2); // 486px

// Create destination directory
if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

/**
 * Extract metadata from MDX frontmatter
 */
function getMetadata(slug) {
  // Find MDX file in series subdirectories
  const findMdx = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const result = findMdx(fullPath);
        if (result) return result;
      } else if (entry.name === `${slug}.mdx`) {
        return fullPath;
      }
    }
    return null;
  };

  const mdxPath = findMdx(METADATA_DIR);

  if (!mdxPath) {
    return { title: 'Untitled', year: '', location: '' };
  }

  const content = fs.readFileSync(mdxPath, 'utf-8');

  // Extract frontmatter
  const nameMatch = content.match(/^name:\s*["']?(.+?)["']?$/m);
  const yearMatch = content.match(/^year:\s*["']?(.+?)["']?$/m);
  const locationMatch = content.match(/^location:\s*["']?(.+?)["']?$/m);

  return {
    title: nameMatch ? nameMatch[1] : 'Untitled',
    year: yearMatch ? yearMatch[1] : '',
    location: locationMatch ? locationMatch[1] : ''
  };
}

/**
 * Create text overlay SVG (matching Inter font from site)
 */
function createTextSVG(text, fontSize, width, height, align = 'left') {
  const padding = 20;
  const textX = align === 'left' ? padding : width / 2;
  const textAnchor = align === 'left' ? 'start' : 'middle';

  return Buffer.from(`
    <svg width="${width}" height="${height}">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        text {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: ${fontSize}px;
          fill: white;
          font-weight: 400;
        }
      </style>
      <text x="${textX}" y="${height / 2}" dominant-baseline="middle" text-anchor="${textAnchor}">${text}</text>
    </svg>
  `);
}

/**
 * Generate Instagram Feed image
 */
async function generateFeedImage(sourceFile, slug) {
  const metadata = getMetadata(slug);

  // Construct text lines
  const titleText = metadata.location
    ? `${metadata.title}, ${metadata.location}`
    : metadata.title;

  const artistText = metadata.year
    ? `Masumi Hayashi, ${metadata.year}`
    : 'Masumi Hayashi';

  const copyrightText = '© Masumi Hayashi Foundation  •  masumihayashi.com';

  console.log(`  Processing: ${slug}`);
  console.log(`    Title: ${titleText}`);
  console.log(`    Artist: ${artistText}`);

  try {
    // Load source image
    const image = sharp(sourceFile);
    const imageMetadata = await image.metadata();

    // Resize artwork to fit in center area (1080 x 486)
    const resizedArtwork = await image
      .resize(FEED_WIDTH, ARTWORK_HEIGHT, {
        fit: 'inside',
        background: { r: 0, g: 0, b: 0 }
      })
      .extend({
        top: 0,
        bottom: 0,
        left: Math.floor((FEED_WIDTH - (await image.metadata()).width) / 2),
        right: Math.ceil((FEED_WIDTH - (await image.metadata()).width) / 2),
        background: { r: 0, g: 0, b: 0 }
      })
      .toBuffer();

    // Create black borders with text
    const topBorder = await sharp({
      create: {
        width: FEED_WIDTH,
        height: BORDER_HEIGHT,
        channels: 3,
        background: { r: 0, g: 0, b: 0 }
      }
    })
    .composite([{
      input: createTextSVG(titleText, 16, FEED_WIDTH, BORDER_HEIGHT, 'left'),
      top: 0,
      left: 0
    }])
    .toBuffer();

    const bottomBorder = await sharp({
      create: {
        width: FEED_WIDTH,
        height: BORDER_HEIGHT,
        channels: 3,
        background: { r: 0, g: 0, b: 0 }
      }
    })
    .composite([{
      input: createTextSVG(copyrightText, 14, FEED_WIDTH, BORDER_HEIGHT, 'left'),
      top: 0,
      left: 0
    }])
    .toBuffer();

    // Stack all three layers
    const final = await sharp({
      create: {
        width: FEED_WIDTH,
        height: FEED_HEIGHT,
        channels: 3,
        background: { r: 0, g: 0, b: 0 }
      }
    })
    .composite([
      { input: topBorder, top: 0, left: 0 },
      { input: resizedArtwork, top: BORDER_HEIGHT, left: 0 },
      { input: bottomBorder, top: BORDER_HEIGHT + ARTWORK_HEIGHT, left: 0 }
    ])
    .jpeg({ quality: 90 })
    .toFile(path.join(DEST_DIR, `${slug}-instagram-feed.jpg`));

    return true;
  } catch (error) {
    console.error(`    Error: ${error.message}`);
    return false;
  }
}

/**
 * Main processing
 */
async function main() {
  console.log('==========================================');
  console.log('Instagram Image Generator');
  console.log('==========================================');
  console.log('');
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Destination: ${DEST_DIR}`);
  console.log('');

  // Check if sharp is installed
  try {
    await import('sharp');
  } catch (error) {
    console.error('ERROR: sharp is not installed.');
    console.error('Install with: npm install sharp');
    process.exit(1);
  }

  // Find all source images (using 1440w variants)
  const sourceFiles = fs.readdirSync(SOURCE_DIR)
    .filter(f => f.endsWith('-1440w.jpg'))
    .map(f => ({
      path: path.join(SOURCE_DIR, f),
      slug: f.replace('-1440w.jpg', '')
    }));

  console.log(`Found ${sourceFiles.length} images to process\n`);

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  const forceRegenerate = process.env.FORCE === '1';

  for (const { path: sourcePath, slug } of sourceFiles) {
    const outputPath = path.join(DEST_DIR, `${slug}-instagram-feed.jpg`);

    // Skip if already exists (unless force flag)
    if (!forceRegenerate && fs.existsSync(outputPath)) {
      skipped++;
      continue;
    }

    const success = await generateFeedImage(sourcePath, slug);
    if (success) {
      processed++;
    } else {
      errors++;
    }
  }

  console.log('');
  console.log('==========================================');
  console.log('Complete!');
  console.log('==========================================');
  console.log(`Processed: ${processed} images`);
  console.log(`Skipped (already exist): ${skipped} images`);
  console.log(`Errors: ${errors} images`);
  console.log('');
  console.log(`Output location: ${DEST_DIR}`);
  console.log('');
  console.log('To regenerate all images: FORCE=1 node scripts/generate-instagram-images.js');
  console.log('');
}

main().catch(console.error);

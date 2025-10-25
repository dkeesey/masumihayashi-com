/**
 * Copy and Rename Images to Match MDX Slugs
 *
 * Copies images from source directory and renames them to match MDX slug field
 * This eliminates the need for imageSlug mapping
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source directory (original processed images - keep untouched)
const sourceDir = '/Volumes/PRO-G40/MH-imageprocessing/responsive-variants';

// Destination directory (public folder for Astro)
const destDir = path.join(__dirname, '../public/images/responsive');

// Breakpoints
const breakpoints = ['640w', '768w', '1024w', '1440w', '1920w', '2460w'];

// Load metadata to map titles → original image slugs
const metadataPath = '/Volumes/PRO-G40/MH-imageprocessing/all-images-scripts/artworks-data-title-key.json';
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

// Build reverse lookup: normalized title → original image slug
const titleToImageSlug = {};
Object.entries(metadata).forEach(([imageSlug, data]) => {
  const normalizedTitle = data.title.toLowerCase().trim();
  titleToImageSlug[normalizedTitle] = imageSlug;
});

console.log(`Loaded ${Object.keys(titleToImageSlug).length} image mappings from metadata\n`);

// Recursively find all .mdx files
function findMdxFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMdxFiles(fullPath));
    } else if (entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Find all MDX files
const artworkDir = path.join(__dirname, '../src/content/artwork');
const mdxFiles = findMdxFiles(artworkDir);

console.log(`Found ${mdxFiles.length} MDX files\n`);
console.log(`${'='.repeat(80)}\n`);

let copied = 0;
let skipped = 0;
let notFound = [];
let errors = [];

for (const filePath of mdxFiles) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(artworkDir, filePath);

  // Only process files with _PLACEHOLDER (need images)
  if (!content.includes('_PLACEHOLDER')) {
    skipped++;
    continue;
  }

  // Parse frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    skipped++;
    continue;
  }

  const frontmatter = frontmatterMatch[1];

  // Extract slug and title
  const slugMatch = frontmatter.match(/^slug:\s*(.+)$/m);
  const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);

  if (!slugMatch || !titleMatch) {
    console.log(`⚠️  Missing slug or title in ${relativePath}`);
    skipped++;
    continue;
  }

  const mdxSlug = slugMatch[1].trim();
  const title = titleMatch[1].trim();
  const normalizedTitle = title.toLowerCase().trim();

  // Find original image slug
  const originalImageSlug = titleToImageSlug[normalizedTitle];

  if (!originalImageSlug) {
    notFound.push({ file: relativePath, title, mdxSlug });
    continue;
  }

  // Copy all 6 breakpoint variants
  let filescopied = 0;
  for (const bp of breakpoints) {
    const sourceFile = path.join(sourceDir, `${originalImageSlug}-${bp}.jpg`);
    const destFile = path.join(destDir, `${mdxSlug}-${bp}.jpg`);

    if (!fs.existsSync(sourceFile)) {
      errors.push({
        file: relativePath,
        error: `Source file not found: ${originalImageSlug}-${bp}.jpg`
      });
      continue;
    }

    try {
      fs.copyFileSync(sourceFile, destFile);
      filescopied++;
    } catch (err) {
      errors.push({
        file: relativePath,
        error: `Copy failed: ${err.message}`
      });
    }
  }

  if (filescopied === 6) {
    console.log(`✅ ${relativePath}`);
    console.log(`   ${originalImageSlug} → ${mdxSlug} (${filescopied} files)`);
    copied++;
  }
}

console.log(`\n${'='.repeat(80)}`);
console.log(`Summary:`);
console.log(`  Artworks copied: ${copied} (${copied * 6} image files)`);
console.log(`  Skipped: ${skipped} files`);
console.log(`  Not found: ${notFound.length} files`);
console.log(`  Errors: ${errors.length}`);

if (notFound.length > 0) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Artworks without matching source images:`);
  notFound.forEach(({ file, title, mdxSlug }) => {
    console.log(`  - ${file}`);
    console.log(`    Title: "${title}"`);
    console.log(`    MDX slug: "${mdxSlug}"`);
  });
}

if (errors.length > 0) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Errors encountered:`);
  errors.slice(0, 10).forEach(({ file, error }) => {
    console.log(`  - ${file}: ${error}`);
  });
  if (errors.length > 10) {
    console.log(`  ... and ${errors.length - 10} more`);
  }
}

console.log(`\n${'='.repeat(80)}`);
console.log(`Source directory (untouched): ${sourceDir}`);
console.log(`Destination directory: ${destDir}`);
console.log(`\nOriginal files preserved in source directory.`);

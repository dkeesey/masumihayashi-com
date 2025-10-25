/**
 * Create Slug Mapping
 *
 * Maps MDX slugs (long SEO-friendly) to image slugs (short processing names)
 * This is needed because the image processing system uses different slugs than the MDX files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load image processing metadata
const metadataPath = '/Volumes/PRO-G40/MH-imageprocessing/all-images-scripts/artworks-data-title-key.json';
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

// Get list of actual image files
const responsiveDir = path.join(__dirname, '../public/images/responsive');
const imageFiles = fs.readdirSync(responsiveDir);

// Extract unique image slugs (remove -640w.jpg, -768w.jpg, etc. suffixes)
const imageSlugs = new Set();
imageFiles.forEach(file => {
  const match = file.match(/^(.+)-\d+w\.jpg$/);
  if (match) {
    imageSlugs.add(match[1]);
  }
});

console.log(`Found ${imageSlugs.size} unique image slugs`);

// Build mapping: title → imageSlug
const titleToSlug = {};
Object.entries(metadata).forEach(([imageSlug, data]) => {
  if (imageSlugs.has(imageSlug)) {
    // Normalize title for matching
    const normalizedTitle = data.title.toLowerCase().trim();
    titleToSlug[normalizedTitle] = imageSlug;
  }
});

console.log(`Mapped ${Object.keys(titleToSlug).length} titles to image slugs`);

// Save mapping for reference
const outputPath = path.join(__dirname, 'slug-mapping.json');
fs.writeFileSync(outputPath, JSON.stringify({ titleToSlug, imageSlugs: Array.from(imageSlugs) }, null, 2));

console.log(`Mapping saved to: ${outputPath}`);
console.log(`\nSample mappings:`);
Object.entries(titleToSlug).slice(0, 5).forEach(([title, slug]) => {
  console.log(`  "${title}" → "${slug}"`);
});

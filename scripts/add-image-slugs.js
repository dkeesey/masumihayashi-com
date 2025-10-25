/**
 * Add imageSlug field to MDX files
 *
 * Reads MDX files with _PLACEHOLDER cloudinaryId
 * Matches title to image slug using mapping
 * Adds imageSlug field to frontmatter
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load slug mapping
const mappingPath = path.join(__dirname, 'slug-mapping.json');
const { titleToSlug } = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

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

// Find all MDX files in artwork directory
const artworkDir = path.join(__dirname, '../src/content/artwork');
const mdxFiles = findMdxFiles(artworkDir);

console.log(`Found ${mdxFiles.length} MDX files\n`);

let updated = 0;
let skipped = 0;
let notFound = [];

for (const filePath of mdxFiles) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check if it has _PLACEHOLDER
  if (!content.includes('_PLACEHOLDER')) {
    skipped++;
    continue;
  }

  const relativePath = path.relative(artworkDir, filePath);

  // Parse frontmatter to get title
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    console.log(`⚠️  No frontmatter found in ${relativePath}`);
    skipped++;
    continue;
  }

  const frontmatter = frontmatterMatch[1];
  const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);

  if (!titleMatch) {
    console.log(`⚠️  No title found in ${relativePath}`);
    skipped++;
    continue;
  }

  const title = titleMatch[1].trim();
  const normalizedTitle = title.toLowerCase().trim();

  // Look up image slug
  const imageSlug = titleToSlug[normalizedTitle];

  if (!imageSlug) {
    console.log(`❌ No image found for: "${title}" (${relativePath})`);
    notFound.push({ file: relativePath, title });
    skipped++;
    continue;
  }

  // Check if imageSlug already exists
  if (frontmatter.includes('imageSlug:')) {
    skipped++;
    continue;
  }

  // Add imageSlug field after cloudinaryId line
  const updatedContent = content.replace(
    /(cloudinaryId:.*\n)/,
    `$1imageSlug: ${imageSlug}\n`
  );

  // Write updated content
  fs.writeFileSync(filePath, updatedContent);
  console.log(`✅ ${relativePath} → imageSlug: ${imageSlug}`);
  updated++;
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Summary:`);
console.log(`  Updated: ${updated} files`);
console.log(`  Skipped: ${skipped} files`);
console.log(`  Not found: ${notFound.length} files`);

if (notFound.length > 0) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Files without matching images:`);
  notFound.forEach(({ file, title }) => {
    console.log(`  - ${file}`);
    console.log(`    Title: "${title}"`);
  });
}

/**
 * Smart Copy and Rename Images
 *
 * Uses direct fuzzy matching between MDX slugs and available image files
 * Bypasses metadata lookup which has title mismatches
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = '/Volumes/PRO-G40/MH-imageprocessing/responsive-variants';
const destDir = path.join(__dirname, '../public/images/responsive');
const breakpoints = ['640w', '768w', '1024w', '1440w', '1920w', '2460w'];

// Get all available image base slugs from source
const sourceFiles = fs.readdirSync(sourceDir);
const availableImageSlugs = new Set();

sourceFiles.forEach(file => {
  const match = file.match(/^(.+)-\d+w\.jpg$/);
  if (match) {
    availableImageSlugs.add(match[1]);
  }
});

console.log(`Found ${availableImageSlugs.size} unique image slugs in source\n`);

// Manual mappings for known mismatches
const manualMappings = {
  'angel-island-immigration-mens-section-san-francisco-california': 'angel-island-immigration-station',
  'cultural-gardens-1-lithuanian-cleveland-ohio': 'cultural-gardens-1-lithuanian',
  'cultural-gardens-2-yugoslavian-cleveland-ohio': 'cultural-gardens-yugoslavian',
  'cultural-gardens-3-hebrew-cleveland-ohio': 'cultural-gardens-hebrew',
  'alcatraz-penitentiary-cellblock-san-francisco-california': 'alcatraz-cell-block',
  'alcatraz-penitentiary-hydro-therapy-room-san-francisco-california-v1': 'alcatraz-hydrotherapy-room',
  'alcatraz-penitentiary-hydro-therapy-room-san-francisco-california-v2': 'alcatraz-hydrotherapy-room',
  'ta-prohm': 'ta-prohm-1',
  'b-52s-airplane-graveyard-tucson-arizona': 'b5s-airplane-graveyard',
  'f-4s-airplane-graveyard-tucson': 'f4s-airplane-graveyard',
  'heart-mt-relocation-camp-blue-room-park-county-wyoming': 'heart-mountain-blue-room',
  'heart-mt-relocation-camp-hospital-park-county-wyoming': 'heart-mountain-hospital',
  'heart-mt-relocation-camp-interior-park-county-wyoming': 'heart-mountain-interior',
  'briar-hill-plant-no-1-youngstown-ohio': 'briar-hill-plant-1',
  'cleveland-builders-supply-cleveland-ohio': 'cleveland-builders-supply',
  'public-square-cleveland-ohio': 'public-square',
  'three-star-nursery-los-angeles-california': 'three-star-nursary',
  'union-terminal-cincinnati-ohio': 'union-terminal',
  'university-hospital-trauma-room-cleveland-ohio': 'university-hospital-trauma-room',
  'feed-materials-production-center-fernald-ohio': 'feed-materials-production-center',
  'field-brook-stream-ashtabula-county-ohio': 'fields-brook-stream',
  'mound-plant-miamisburg-ohio': 'mound-plant-usdoe',
  'airavatesvara-temple-1-darasuram-tamil-nadu-india': 'airavatesvara-temple-1',
  'dry-lake-nehru-park-udaipur-rajasthan-india': 'nehru-park-dry-lake',
  'kandariya-mahadeva-khujaraho-madhya-pradesh-india': 'kandariya-mahadeva-khujaraho',
  'maha-buddha-temple-patan-nepal': 'mahabuddha-temple-patan',
  'patan-durbar-square-patan-nepal': 'patan-durbar-square',
  'rameswaram-temple-1-rameswaram-tamil-nadu-india': 'rameswaram-1',
  'procter-gamble-blue-kettle-room-baltimore-maryland': 'proctor-and-gamble-blue-kettle-room',
  'procter-gamble-boat-view-baltimore-maryland': 'proctor-gamble-boat-view',
  'procter-gamble-tanks-baltimore-maryland': 'proctor-and-gamble-tanks',
  'cuyahoga-county-courthouse-1-cleveland-ohio': 'cuyahoga-county-courthouse-1',
  'cuyahoga-county-courthouse-2-cleveland-ohio': 'cuyaghoga-county-courthouse-2',
  'oserf-building-broad-street-view-columbus-ohio': 'oserf-building-broad-street-view',
  'la-downtown-1987-los-angeles-california': 'los-angeles-downtown',
  'la-subway-no-2-los-angeles-california': 'los-angeles-subway-2',
  'edgewater-park-2-cleveland-ohio': 'edgewater-park',

  // Internment camps - remove camp prefix
  'gila-river-internment-camp-dog-grave': 'gila-river-dog-grave',
  'gila-river-internment-camp-foundations': 'gila-river-foundations',
  'gila-river-internment-camp-monument': 'gila-river-monument',
  'gila-river-internment-camp-sewer': 'gila-river-sewer',
  'gila-river-relocation-camp-dog-grave-gila-river-arizona': 'gila-river-dog-grave',
  'gila-river-relocation-camp-foundations-gila-river-arizona': 'gila-river-foundations',
  'gila-river-relocation-camp-monument-gila-river-arizona': 'gila-river-monument',
  'gila-river-relocation-camp-sewer-gila-river-arizona': 'gila-river-sewer',
  'granada-internment-camp-foundations': 'granada-foundations',
  'granada-internment-camp-water-tank': 'granada-water-tank',
  'granada-relocation-camp-foundations-granada-colorado': 'granada-foundations',
  'granada-relocation-camp-water-tank-granada-colorado': 'granada-water-tank',
  'heart-mountain-internment-camp-blue-room': 'heart-mountain-blue-room',
  'heart-mountain-internment-camp-hospital': 'heart-mountain-hospital',
  'heart-mountain-internment-camp-interior': 'heart-mountain-interior',
  'heart-mountain-internment-camp-root-cellar': 'heart-mountain-root-cellar',
  'jerome-internment-camp-sewer': 'jerome-sewer',
  'manzanar-internment-camp-guard-gates': 'manzanar-guard-gates',
  'manzanar-internment-camp-monument': 'manzanar-monument',
  'manzanar-internment-camp-tree-view': 'manzanar-tree-view',
  'minidoka-internment-camp-root-cellar': 'minidoka-root-cellar',
  'minidoka-internment-camp-waiting-room': 'minidoka-waiting-room',
  'poston-internment-camp-sewer-3': 'poston-sewer-3',
  'rohwer-internment-camp-cemetary': 'rohwer-cemetary',
  'topaz-internment-camp-foundations': 'topaz-foundations',
  'tule-lake-internment-camp-sewer': 'tule-lake-sewer',
  'tule-lake-internment-camp-stockade': 'tule-lake-stockade',

  // POW camps
  'angler-pow-camp-guard-tower': 'angler-pow-camp-guard-tower',
  'angler-pow-camp-kitchen': 'angler-pow-camp-kitchen',
  'bay-farm-pow-camp': 'bay-farm-internment-camp',
  'lemon-creek-pow-camp': 'lemon-creek-internment-camp',
  'sandon-pow-camp-ghost-town': 'sandon-ghost-town',
  'sandon-pow-camp-stream': 'sandon-stream-war',

  // Sacred architectures - remove location suffix
  'boudhanath-stupa-prayer-wheel-kathmandu-nepal': 'boudhanath-stupa-prayer-wheel',
  'golden-temple-kathmandu-nepal': 'golden-temple-kathmandu',
  'jain-temple-jaisalmer-rajasthan-india': 'jain-temple-jaisalmer',
  'lakshmana-temple-khajuraho-madhya-pradesh-india': 'lakshmana-temple-khajuraho',
  'mantapa-with-devotees-hampi-karnataka-india': 'mantapa-with-devotees-hampi',
  'norbulinka-temple-dharamsala-himichal-pradesh-india': 'norbulinka-temple-dharamsala',
  'hemakuta-hill-hampi-ruins-hampi-karnataka-india': 'hampi-ruins-hemakuta-hill',
  'madonna-and-child-meenakshi-temple-madurai-tamil-nadu-india': 'meenakshi-madonna-and-child',
  'city-of-the-dead-no-1-okunoin-koya-wakayama-japan': 'city-of-the-dead-1',
  'ellora-caves-cave-21-ellora-maharashtra-india': 'ellora-caves-21-rameshwar',

  // Other locations
  'fort-barry-battery-mendell': 'fort-barry-battery-mendel',
  'new-lyme-site-new-lyme-ohio': 'new-lyme-site',
  // 'oserf-building-patio-columbus-ohio': Image doesn't exist on PRO-G40

  // Round 2 - City Works
  'big-sur-beach-no-2-big-sur-california': 'big-sur-2',
  'cleveland-stadium-cleveland-ohio': 'cleveland-stadium',
  'dealey-plaza-dallas-texas': 'dealey-plaza',
  'main-avenue-bridge-cleveland-ohio': 'main-avenue-bridge',
  'old-arcade-cleveland-ohio': 'old-arcade',

  // Round 2 - Public Commissions
  'elfreths-alley-philadelphia-pennsylvania': 'elfreths-alley',
  'in-perspective-cleveland-ohio': 'in-perspective',
  'in-sight-v1-cleveland-ohio': 'in-sight',
  'jacobs-field-cleveland-ohio': 'jacobs-field',
  'rta-bus-cleveland-ohio': 'rta-bus',

  // Round 2 - EPA Superfund
  'big-d-campground-kingsville-ohio': 'big-d-campground',
  'industrial-excess-landfill-uniontown-ohio': 'industrial-excess-landfill',
  'laskinpoplar-oil-company-jefferson-township-ohio': 'laskinpoplar',
  'love-canal-no-1-niagra-falls-new-york': 'love-canal-1',
  'love-canal-no-2-niagra-falls-new-york': 'love-canal-2',
  'nease-chemical-salem-ohio': 'nease-chemical',

  // Round 2 - Post-Industrial
  'briar-hill-plant-no-2-youngstown-ohio': 'briar-hill-plant-2',
  'briar-hill-plant-no-3-youngstown-ohio': 'briar-hill-plant-3',
  'campbell-works-plant-youngstown-ohio': 'campbell-works-plant',
  'center-street-plant-youngstown-ohio': 'center-street-plant',
  'century-freeway-no-1-los-angeles-california': 'century-freeway-1',
  'century-freeway-no-2-los-angeles-california': 'century-freeway-2',
  'century-freeway-no-3-los-angeles-california': 'century-freeway-3',
  'century-freeway-no-4-los-angeles-california': 'century-freeway-4',
  'century-freeway-no-6-los-angeles-california': 'century-freeway-6',
  'century-freeway-no-7-los-angeles-california': 'century-freeway-7',
  'crossroads-in-the-flats-cleveland-ohio': 'crossroads-in-the-flats',

  // Round 2 - Prisons
  'alcatraz-penitentiary-shower-room-san-francisco-california': 'alcatraz-shower-room',
  'cincinnati-workhouse-cincinnati-ohio': 'cincinatti-workhouse',
  'eastern-state-penitentiary-chapel-philadelphia-pennsylvania': 'eastern-state-penitentiary-chapel',
  'eastern-state-penitentiary-infirmary-philadelphia-pennsylvania': 'eastern-state-penitentiary-infirmary',
  'eastern-state-penitentiary-rotunda-philadelphia-pennsylvania': 'eastern-state-penintentiary-rotunda',
  'mansfield-reformatory-mansfield-ohio': 'mansfield-reformatory',

  // Round 2 - Sacred Architectures
  'angkor-wat-no-1-angkor-siem-reap-cambodia': 'angkor-wat-1',
  'banteay-srei-angkor-siem-reap-cambodia': 'bantea-srei',
  'bayon-angkor-thom-angkor-siem-reap-cambodia': 'angkor-thom-bayon-temple',
  'bodhi-tree-bodh-gaya-bihar-india': 'bodhi-tree',
  'city-of-the-dead-no-2-okunoin-koya-wakayama-japan': 'city-of-the-dead-2',
  'ellora-caves-cave-32-ellora-maharashtra-india': 'ellora-caves-32-indra-sabha',
  'hanuman-ghat-bhaktapur-nepal': 'hanuman-ghat',
  'kund-pava-square-jaisalmer-rajasthan-india': 'kund-pava-square',
  'man-god-hall-of-a-thousand-pillars-meenakshi-temple-madurai-tamil-nadu-india': 'hall-of-1000-pillars-man-and-god',
  'muthiah-ayyanar-temple-kochadai-village-tamil-nadu-india': 'muthiah-ayyanar-temple',
  'preah-khan-temple-angkor-siem-reap-cambodia': 'angkor-wat-preah-khan',
  'river-ganges-varanasi-uttar-pradesh-india': 'river-ganges-varanasi',
  'royal-bhutan-temple-bodh-gaya-bihar-india': 'royal-bhutan-temple',
  'the-saint-in-the-market-place-meenakshi-temple-madurai-tamil-nadu-india': 'saint-in-the-market-place',

  // Round 2 - War & Military
  'airplane-museum-sam-tucson': 'airplane-museum',
  'missile-garden-cape-canaveral-florida': 'missile-garden',
  'titan-ii-control-room-tucson-arizona': 'titan-ii-control-room',

  // Round 3 - POW camps with internment-camp slug
  'angler-internment-camp-guard-tower': 'angler-pow-camp-guard-tower',
  'angler-internment-camp-kitchen': 'angler-pow-camp-kitchen',
  'sandon-internment-camp-ghost-town': 'sandon-ghost-town',
  'sandon-internment-camp-stream': 'sandon-stream-war',

  // Round 4 - Recovered PNG/JPG files (Oct 24, 2025)
  'airavatesvara-temple-2-darasuram-tamil-nadu-india': 'airavatesvara-2',
  'la-subway-no-1-los-angeles-california': 'los-angeles-subway-1',
  'oserf-building-patio-columbus-ohio': 'oserf-building-patio',
  'gila-river-internment-camp-dog-grave': 'gila-river-dog-grave',
  'gila-river-internment-camp-monument': 'gila-river-monument',
  'poston-internment-camp-sewer-1': 'poston-sewer-1'
};

// Recursively find MDX files
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

const artworkDir = path.join(__dirname, '../src/content/artwork');
const mdxFiles = findMdxFiles(artworkDir);

console.log(`Found ${mdxFiles.length} MDX files\n`);
console.log(`${'='.repeat(80)}\n`);

let copied = 0;
let skipped = 0;
let notFound = [];

for (const filePath of mdxFiles) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(artworkDir, filePath);

  // Only process files with _PLACEHOLDER
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
  const slugMatch = frontmatter.match(/^slug:\s*(.+)$/m);

  if (!slugMatch) {
    skipped++;
    continue;
  }

  const mdxSlug = slugMatch[1].trim();

  // Check manual mappings first
  let sourceSlug = manualMappings[mdxSlug];

  // If not in manual mappings, try exact match
  if (!sourceSlug && availableImageSlugs.has(mdxSlug)) {
    sourceSlug = mdxSlug;
  }

  if (!sourceSlug) {
    notFound.push({ file: relativePath, mdxSlug });
    continue;
  }

  // Copy all 6 breakpoint variants
  let filescopied = 0;
  for (const bp of breakpoints) {
    const sourceFile = path.join(sourceDir, `${sourceSlug}-${bp}.jpg`);
    const destFile = path.join(destDir, `${mdxSlug}-${bp}.jpg`);

    if (!fs.existsSync(sourceFile)) {
      console.log(`⚠️  Missing: ${sourceSlug}-${bp}.jpg`);
      continue;
    }

    try {
      fs.copyFileSync(sourceFile, destFile);
      filescopied++;
    } catch (err) {
      console.log(`❌ Copy failed: ${err.message}`);
    }
  }

  if (filescopied === 6) {
    console.log(`✅ ${relativePath}`);
    if (sourceSlug !== mdxSlug) {
      console.log(`   ${sourceSlug} → ${mdxSlug}`);
    }
    copied++;
  }
}

console.log(`\n${'='.repeat(80)}`);
console.log(`Summary:`);
console.log(`  Artworks copied: ${copied} (${copied * 6} image files)`);
console.log(`  Skipped (already has images): ${skipped}`);
console.log(`  Not found: ${notFound.length}`);

if (notFound.length > 0) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Still not found (${notFound.length}):`);
  notFound.forEach(({ file, mdxSlug }) => {
    console.log(`  - ${file}`);
    console.log(`    MDX slug: "${mdxSlug}"`);
  });
}

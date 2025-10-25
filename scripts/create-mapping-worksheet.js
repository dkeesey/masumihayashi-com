/**
 * Create Mapping Worksheet
 * Generates a file showing titles that need image slug matches
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the list of all available image slugs
const responsiveDir = path.join(__dirname, '../public/images/responsive');
const imageFiles = fs.readdirSync(responsiveDir);

const imageSlugs = new Set();
imageFiles.forEach(file => {
  const match = file.match(/^(.+)-\d+w\.jpg$/);
  if (match) {
    imageSlugs.add(match[1]);
  }
});

const sortedSlugs = Array.from(imageSlugs).sort();

// Load the "not found" titles from the previous run
const notFoundTitles = [
  "Angel Island Immigration, Men's Section",
  "Cultural Gardens #1, Lithuanian, Cleveland, Ohio",
  "Cultural Gardens #2, Yugoslavian, Cleveland, Ohio",
  "Cultural Gardens #3, Hebrew, Cleveland, Ohio",
  "Edgewater Park #2, Cleveland, Ohio",
  "L.A. Downtown, 1987, Los Angeles, California",
  "L.A. Subway, No. 1, Los Angeles, California",
  "L.A. Subway, No. 2, Los Angeles, California",
  "Cuyahoga County Courthouse #1, Cleveland, Ohio",
  "Cuyahoga County Courthouse #2 (Version 1a), Cleveland, Ohio",
  "OSERF Building Broad Street View, Columbus, Ohio",
  "OSERF Building Patio, Columbus, Ohio",
  "Procter & Gamble Blue Kettle Room (1 of 3 listed), Baltimore, Maryland",
  "Procter & Gamble Boat View (1 of 3 listed), Baltimore, Maryland",
  "Procter & Gamble Tanks, Baltimore, Maryland",
  "Public Square, Cleveland, Ohio",
  "Three Star Nursery, Los Angeles, California",
  "Union Terminal, Cincinnati, Ohio",
  "(Metro) University Hospital, Trauma Room, Cleveland, Ohio",
  "Asarco Smelter, Tacoma, Washington",
  "Feed Materials Production Center (USDOE), Fernald, Ohio",
  "Field Brook Stream, Ashtabula County, Ohio",
  "Mound Plant (USDOE), Miamisburg, Ohio",
  "New Lyme Site, New Lyme, Ohio",
  "Gila River Relocation Camp, Dog Grave, Gila River, Arizona",
  "Gila River Relocation Camp, Foundations, Gila River, Arizona",
  "Gila River Relocation Camp, Monument, Gila River, Arizona",
  "Gila River Relocation Camp, Sewer, Gila River, Arizona",
  "Granada (Amache) Relocation Camp, Foundations, Granada, Colorado",
  "Granada (Amache) Relocation Camp, Water Tank, Granada, Colorado",
  "Heart Mt. Relocation Camp, Blue Room, Park County, Wyoming",
  "Heart Mt. Relocation Camp, Hospital, Park County, Wyoming",
  "Heart Mt. Relocation Camp, Interior, Park County, Wyoming",
  "Briar Hill Plant no. 1, Youngstown, Ohio  (3D)",
  "Cleveland Builder's Supply, Cleveland, Ohio",
  "Alcatraz Penitentiary, Cellblock, San Francisco, California",
  "Alcatraz Penitentiary, Hydro Therapy Room, San Francisco, California (Version 1)",
  "Alcatraz Penitentiary, Hydro Therapy Room, San Francisco, California (Version 2)",
  "Cincinnati Workhouse, Cincinnati, Ohio",
  "Airavatesvara Temple #1, Darasuram, Tamil Nadu, India",
  "Airavatesvara Temple #2, Darasuram, Tamil Nadu, India",
  "Banteay Srei, Angkor, Siem Reap, Cambodia",
  "Boudhanath Stupa, Prayer Wheel, Kathmandu, Nepal",
  "City of the Dead, No. 1, Okunoin, Koya, Wakayama, Japan",
  "Dry Lake, Nehru Park, Udaipur, Rajasthan, India",
  "Ellora Caves, Cave 21 (Rameshwar), Ellora, Maharashtra, India",
  "Golden Temple, Kathmandu, Nepal",
  "Hemakuta Hill, Hampi Ruins, Hampi, Karnataka, India",
  "Jain Temple, Jaisalmer, Rajasthan, India",
  "Kandariya Mahadeva, Khujaraho, Madhya Pradesh, India",
  "Lakshmana Temple, Khajuraho, Madhya Pradesh, India",
  "Madonna and Child, Meenakshi Temple, Madurai, Tamil Nadu, India",
  "Maha buddha Temple, Patan, Nepal",
  "Man & God, Hall of a Thousand Pillars, Meenakshi Temple, Madurai, Tamil Nadu, India",
  "Mantapa with Devotees, Hampi, Karnataka, India",
  "Norbulinka Temple, Dharamsala, Himichal Pradesh, India",
  "Patan Durbar Square, Patan, Nepal",
  "Rameswaram Temple #1, Rameswaram, Tamil Nadu, India",
  "Ta Prohm, Angkor, Siem Reap, Cambodia",
  "B-52's Airplane Graveyard, Tucson, Arizona",
  "F-4's Airplane Graveyard, Tucson, Arizona",
  "Fort Barry, Battery Mendell, San Francisco, California"
];

console.log(`\n${'='.repeat(80)}`);
console.log('MAPPING WORKSHEET - Match Titles to Image Slugs');
console.log(`${'='.repeat(80)}\n`);

console.log(`${notFoundTitles.length} titles need matching\n`);
console.log(`Available image slugs (${sortedSlugs.length} total):\n`);

// Show all available slugs grouped by prefix
const grouped = {};
sortedSlugs.forEach(slug => {
  const prefix = slug.split('-')[0];
  if (!grouped[prefix]) grouped[prefix] = [];
  grouped[prefix].push(slug);
});

Object.entries(grouped).sort().forEach(([prefix, slugs]) => {
  if (slugs.length <= 3) {
    console.log(`  ${prefix}: ${slugs.join(', ')}`);
  } else {
    console.log(`  ${prefix}: ${slugs.length} images (${slugs.slice(0,2).join(', ')}, ...)`);
  }
});

console.log(`\n${'='.repeat(80)}\n`);
console.log('TITLES TO MATCH:\n');

notFoundTitles.forEach((title, i) => {
  console.log(`${i+1}. "${title}"`);
  console.log(`   → imageSlug: ________________\n`);
});

console.log(`\n${'='.repeat(80)}`);
console.log('INSTRUCTIONS:');
console.log('1. For each title above, find the matching image slug from the available list');
console.log('2. Fill in the blank after "→ imageSlug:"');
console.log('3. If no match exists, write "NO_IMAGE"');
console.log('4. Save your answers in a text file or paste them back\n');

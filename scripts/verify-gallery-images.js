/**
 * Verify Gallery Images with Playwright
 * Checks all 8 galleries for broken images and reports missing artwork
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const galleries = [
  { name: 'Sacred Architectures', url: 'http://localhost:4321/artwork/sacred-architectures/' },
  { name: 'Internment Camps', url: 'http://localhost:4321/artwork/japanese-american-internment-camps/' },
  { name: 'Post-Industrial', url: 'http://localhost:4321/artwork/post-industrial/' },
  { name: 'City Works', url: 'http://localhost:4321/artwork/city-works/' },
  { name: 'Prisons', url: 'http://localhost:4321/artwork/prisons/' },
  { name: 'War & Military', url: 'http://localhost:4321/artwork/war-military/' },
  { name: 'EPA Superfund', url: 'http://localhost:4321/artwork/epa-superfund/' },
  { name: 'Public Commissions', url: 'http://localhost:4321/artwork/commissions/' }
];

async function verifyGallery(page, gallery) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Checking: ${gallery.name}`);
  console.log(`${'='.repeat(80)}\n`);

  await page.goto(gallery.url, { waitUntil: 'networkidle' });

  // Wait for images to attempt loading
  await page.waitForTimeout(2000);

  // Get all gallery images
  const images = await page.$$('img.gallery-image');
  console.log(`Found ${images.length} images in gallery\n`);

  const results = {
    total: images.length,
    loaded: 0,
    broken: 0,
    brokenImages: []
  };

  for (let i = 0; i < images.length; i++) {
    const img = images[i];

    // Get image properties
    const imgData = await img.evaluate(el => ({
      src: el.src,
      alt: el.alt,
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight,
      complete: el.complete
    }));

    // Check if image loaded successfully
    if (imgData.complete && imgData.naturalWidth > 0) {
      results.loaded++;
      console.log(`✅ [${i + 1}/${images.length}] Loaded: ${imgData.alt}`);
    } else {
      results.broken++;
      results.brokenImages.push({
        alt: imgData.alt,
        src: imgData.src,
        position: i + 1
      });
      console.log(`❌ [${i + 1}/${images.length}] BROKEN: ${imgData.alt}`);
      console.log(`   Source: ${imgData.src}`);
    }
  }

  console.log(`\nSummary for ${gallery.name}:`);
  console.log(`  Total: ${results.total}`);
  console.log(`  Loaded: ${results.loaded} ✅`);
  console.log(`  Broken: ${results.broken} ❌`);

  return results;
}

async function main() {
  console.log('Starting Gallery Image Verification...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const allResults = {};

  for (const gallery of galleries) {
    allResults[gallery.name] = await verifyGallery(page, gallery);
  }

  await browser.close();

  // Final summary
  console.log(`\n${'='.repeat(80)}`);
  console.log('FINAL SUMMARY');
  console.log(`${'='.repeat(80)}\n`);

  let totalImages = 0;
  let totalLoaded = 0;
  let totalBroken = 0;

  for (const [galleryName, results] of Object.entries(allResults)) {
    totalImages += results.total;
    totalLoaded += results.loaded;
    totalBroken += results.broken;

    console.log(`${galleryName}:`);
    console.log(`  ${results.loaded}/${results.total} loaded (${Math.round(results.loaded/results.total*100)}%)`);

    if (results.brokenImages.length > 0) {
      console.log(`  Broken images:`);
      results.brokenImages.forEach(img => {
        console.log(`    - ${img.alt}`);
        // Extract slug from src
        const match = img.src.match(/\/([^/]+)-\d+w\.jpg$/);
        if (match) {
          console.log(`      Looking for: ${match[1]}`);
        }
      });
    }
    console.log('');
  }

  console.log(`Overall:`);
  console.log(`  Total images: ${totalImages}`);
  console.log(`  Loaded: ${totalLoaded} (${Math.round(totalLoaded/totalImages*100)}%)`);
  console.log(`  Broken: ${totalBroken} (${Math.round(totalBroken/totalImages*100)}%)`);

  // Save detailed results
  const reportPath = '/tmp/gallery-image-verification.json';
  fs.writeFileSync(reportPath, JSON.stringify(allResults, null, 2));
  console.log(`\nDetailed results saved to: ${reportPath}`);
}

main().catch(console.error);

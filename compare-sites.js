/**
 * Visual Comparison Script
 * Captures screenshots of key pages from target site to verify styling
 */

import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function captureScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const screenshots = [];
  const baseUrl = 'http://localhost:4321';

  const pages = [
    { name: 'homepage', url: '/' },
    { name: 'about', url: '/about' },
    { name: 'donate', url: '/donate' },
    { name: 'family-album-project', url: '/family-album-project' }
  ];

  console.log('Capturing screenshots from target site...\n');

  for (const pageInfo of pages) {
    try {
      console.log(`📸 ${pageInfo.name}...`);
      await page.goto(`${baseUrl}${pageInfo.url}`, {
        waitUntil: 'networkidle',
        timeout: 10000
      });

      // Wait a bit for any animations
      await page.waitForTimeout(500);

      const screenshotPath = path.join(__dirname, `screenshot-${pageInfo.name}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });

      screenshots.push({
        page: pageInfo.name,
        path: screenshotPath,
        url: pageInfo.url
      });

      console.log(`   ✓ Saved to screenshot-${pageInfo.name}.png`);
    } catch (error) {
      console.log(`   ✗ Failed: ${error.message}`);
    }
  }

  await browser.close();

  console.log(`\n✅ Captured ${screenshots.length} screenshots`);
  console.log('\nScreenshots saved:');
  screenshots.forEach(s => {
    console.log(`  - ${s.page}: ${s.path}`);
  });
}

captureScreenshots().catch(console.error);

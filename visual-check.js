import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:4322', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const screenshot = await page.screenshot({
      path: 'homepage-visual-check.png',
      fullPage: true
    });

    console.log('Screenshot saved to homepage-visual-check.png');

    // Check if hero image is visible and loaded
    const heroImage = await page.locator('img').first();
    const isVisible = await heroImage.isVisible();
    const src = await heroImage.getAttribute('src');

    console.log('Hero image visible:', isVisible);
    console.log('Hero image src:', src);

    // Keep browser open for 5 seconds so we can see it
    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();

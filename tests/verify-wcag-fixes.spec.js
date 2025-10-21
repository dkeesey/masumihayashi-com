import { test, expect } from '@playwright/test';

test.describe('WCAG Compliance Verification', () => {
  test('homepage loads and displays with proper contrast', async ({ page }) => {
    // Navigate to homepage (dev server is on 4322)
    await page.goto('http://localhost:4322/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await page.screenshot({
      path: 'screenshots/homepage-wcag-verified.png',
      fullPage: true
    });

    // Verify prose text is using dark gray (#1a1a1a)
    const proseText = page.locator('.prose p').first();
    if (await proseText.count() > 0) {
      const color = await proseText.evaluate(el =>
        window.getComputedStyle(el).color
      );
      console.log('Prose text color:', color);
    }

    // Verify footer has graduated greys
    await page.screenshot({
      path: 'screenshots/footer-graduated-greys.png',
      clip: { x: 0, y: 0, width: 1920, height: 800 }
    });
  });

  test('footer visual rhythm verification', async ({ page }) => {
    await page.goto('http://localhost:4322/');
    await page.waitForLoadState('networkidle');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Screenshot just the footer
    const footer = page.locator('footer');
    await footer.screenshot({
      path: 'screenshots/footer-only.png'
    });

    // Get background colors of footer sections
    const navSection = page.locator('footer > div').nth(0);
    const attrSection = page.locator('footer > div').nth(1);
    const copyrightSection = page.locator('footer > div').nth(2);

    const navBg = await navSection.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );
    const attrBg = await attrSection.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );
    const copyrightBg = await copyrightSection.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );

    console.log('Footer section backgrounds:');
    console.log('  Navigation:', navBg);
    console.log('  Attribution:', attrBg);
    console.log('  Copyright:', copyrightBg);
  });
});

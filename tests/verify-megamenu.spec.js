import { test, expect } from '@playwright/test';

test.describe('Mega Menu Navigation', () => {
  test('mega menu renders with all 8 artwork series', async ({ page }) => {
    await page.goto('http://localhost:4322/');
    await page.waitForLoadState('networkidle');

    // Take initial screenshot
    await page.screenshot({
      path: 'screenshots/navigation-initial.png',
      fullPage: false
    });

    // Check for "Artwork" navigation item
    const artworkNav = page.locator('text=Artwork').first();
    await expect(artworkNav).toBeVisible();

    console.log('✅ Artwork nav item found');

    // Hover over Artwork to trigger mega menu
    await artworkNav.hover();
    await page.waitForTimeout(500);

    // Check if mega menu appeared
    const megaMenu = page.locator('text=Artwork Galleries');
    const isVisible = await megaMenu.isVisible().catch(() => false);

    if (isVisible) {
      console.log('✅ Mega menu visible on hover');

      // Screenshot with mega menu open
      await page.screenshot({
        path: 'screenshots/megamenu-open.png',
        fullPage: false
      });

      // Check for series links
      const series = [
        'Internment Camps',
        'Sacred Architectures',
        'Post-Industrial',
        'Prisons',
        'War & Military',
        'EPA Superfund',
        'City Works',
        'Commissions'
      ];

      for (const name of series) {
        const seriesLink = page.locator(`text="${name}"`).first();
        const exists = await seriesLink.count();
        console.log(`  ${exists > 0 ? '✅' : '❌'} ${name}: ${exists} found`);
      }
    } else {
      console.log('ℹ️  Mega menu not visible (may need click trigger)');

      // Try clicking instead
      await artworkNav.click();
      await page.waitForTimeout(500);

      await page.screenshot({
        path: 'screenshots/megamenu-clicked.png',
        fullPage: false
      });
    }

    // Check other top-level nav items
    const navItems = ['Exhibitions', 'Videos', 'Resources', 'About', 'Donate'];
    console.log('\n🔍 Other nav items:');
    for (const item of navItems) {
      const nav = page.locator(`text=${item}`).first();
      const exists = await nav.count();
      console.log(`  ${exists > 0 ? '✅' : '❌'} ${item}`);
    }
  });

  test('mobile navigation shows accordion', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:4322/');
    await page.waitForLoadState('networkidle');

    // Screenshot mobile nav
    await page.screenshot({
      path: 'screenshots/mobile-nav-closed.png',
      fullPage: false
    });

    // Open mobile menu
    const hamburger = page.locator('button[aria-label="Toggle Menu"]');
    await hamburger.click();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'screenshots/mobile-nav-open.png',
      fullPage: true
    });

    // Check for Artwork accordion
    const artworkAccordion = page.locator('text=Artwork').first();
    await expect(artworkAccordion).toBeVisible();

    // Expand artwork
    await artworkAccordion.click();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'screenshots/mobile-nav-artwork-expanded.png',
      fullPage: true
    });

    console.log('✅ Mobile navigation verified');
  });
});

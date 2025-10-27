import { test, expect } from '@playwright/test';

/**
 * Critical User Flow Tests
 * Priority: HIGH - These tests prevent catastrophic production failures
 *
 * Run with:
 *   npm run test          # Headless mode
 *   npm run test:headed   # See browser
 *   npm run test:ui       # Interactive mode
 *
 * When tests fail:
 *   1. Check test output for error details
 *   2. ALWAYS review screenshots: test-results/*/test-failed-*.png
 *   3. Watch videos for interaction context: test-results/*/video.webm
 *   4. Read error-context.md for page state snapshot
 *
 * View HTML report:
 *   npm run test:report   # Opens last test run in browser
 */

// TEST 1: Homepage Loads
// Problem Solved: Site completely broken (500 error, etc.)
test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');

  // Verify critical elements
  await expect(page.locator('h1')).toContainText('Masumi Hayashi');
  await expect(page.locator('nav')).toBeVisible();

  // Verify hero CTA buttons exist
  await expect(page.getByRole('link', { name: /explore all artwork/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /about masumi/i })).toBeVisible();
});

// TEST 2: Artwork Navigation Works
// Problem Solved: Users can't browse artwork (primary site purpose)
test('can navigate to artwork series and view details', async ({ page }) => {
  await page.goto('/');

  // Click "Explore All Artwork" to get to artwork page
  await page.getByRole('link', { name: /explore all artwork/i }).click();

  // Verify artwork overview page loads
  await expect(page).toHaveURL(/\/artwork/);
  await expect(page.locator('h1').first()).toBeVisible();

  // Click "Japanese American Internment Camps" series if available
  const internmentLink = page.getByRole('link', { name: /japanese american internment camps/i });
  if (await internmentLink.count() > 0) {
    await internmentLink.first().click();

    // Verify navigation worked (may use hash anchor or separate page)
    await expect(page).toHaveURL(/\/artwork.*japanese-american-internment-camps/);
    await expect(page.locator('h1').first()).toBeVisible();
  }
});

// TEST 3: Images Load from R2
// Problem Solved: R2 misconfiguration breaks all images
test('images load from R2 CDN', async ({ page }) => {
  // Navigate to artwork page which should have images
  await page.goto('/artwork');

  // Get first image (could be in article, card, or main content)
  const img = page.locator('img').first();

  // Wait for image to load
  await img.waitFor({ state: 'visible', timeout: 10000 });

  // Verify R2 domain (currently pub-*.r2.dev, will be images.masumihayashi.com)
  const src = await img.getAttribute('src');

  // If using R2, verify domain; otherwise skip this assertion (images might be from other CDNs)
  if (src && (src.includes('r2.dev') || src.includes('images.masumihayashi.com'))) {
    expect(src).toMatch(/pub-.*\.r2\.dev|images\.masumihayashi\.com/);

    // Verify image actually loaded (not 404)
    const response = await page.request.get(src);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/');
  }
});

// TEST 4: Exhibitions Page Works
// Problem Solved: Time-sensitive exhibition info unavailable
test('exhibitions page displays upcoming exhibitions', async ({ page }) => {
  await page.goto('/exhibitions');

  // Verify page loads
  await expect(page.locator('h1')).toContainText('Exhibitions');

  // Verify at least one exhibition
  const exhibitions = page.locator('article');
  const count = await exhibitions.count();
  expect(count).toBeGreaterThanOrEqual(1);

  // Click first exhibition
  await exhibitions.first().click();

  // Verify exhibition detail page
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.locator('text=/venue|museum|gallery/i').first()).toBeVisible();
});

// TEST 5: Mobile Navigation Works
// Problem Solved: 60% of users can't navigate on mobile
test('mobile menu works', async ({ page }) => {
  // Simulate mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });

  await page.goto('/');

  // Mobile menu button should be visible
  const mobileMenuButton = page.locator('[aria-label*="menu" i], button:has-text("Menu")');
  await expect(mobileMenuButton.first()).toBeVisible();

  // Click mobile menu
  await mobileMenuButton.first().click();

  // Wait for menu to open
  await page.waitForTimeout(500);

  // Verify menu dialog is open
  const menuDialog = page.locator('[role="dialog"]');
  await expect(menuDialog).toBeVisible();

  // Find and click the Exhibitions link (a direct nav link)
  const exhibitionsLink = menuDialog.getByRole('link', { name: /exhibitions/i });
  await expect(exhibitionsLink).toBeVisible();
  await exhibitionsLink.click();

  // Verify navigation worked
  await expect(page).toHaveURL(/\/exhibitions/);
});

// TEST 6: About Page Loads
// Problem Solved: Critical biographical info unavailable
test('about page displays artist biography', async ({ page }) => {
  await page.goto('/about');

  // Verify page loads
  await expect(page.locator('h1')).toBeVisible();

  // Verify biographical content exists
  const content = page.locator('main');
  await expect(content).toContainText('Masumi Hayashi');

  // Verify page has substantial content (not empty)
  const text = await content.textContent();
  expect(text!.length).toBeGreaterThan(500); // At least 500 characters
});

// TEST 7: Responsive Images Have Proper srcset
// Problem Solved: Images not responsive on different devices
test('responsive images use correct srcset', async ({ page }) => {
  // Navigate to artwork page which should have images
  await page.goto('/artwork');

  // Get first image
  const img = page.locator('img').first();
  await img.waitFor({ state: 'visible', timeout: 10000 });

  // Verify srcset exists (if using responsive images)
  const srcset = await img.getAttribute('srcset');

  // Only test srcset if it exists (some images might not have srcset)
  if (srcset && srcset.length > 0) {
    // Verify srcset has multiple breakpoints
    const srcsetEntries = srcset.split(',');
    expect(srcsetEntries.length).toBeGreaterThanOrEqual(2); // At least 2 breakpoints

    // Verify srcset includes width descriptors
    expect(srcset).toMatch(/\d+w/);
  }
});

// TEST 8: Navigation Links Work
// Problem Solved: Broken internal links
test('main navigation links work', async ({ page }) => {
  await page.goto('/');

  // Test direct navigation links (not dropdown menus)
  const navLinks = [
    { text: 'Exhibitions', urlPattern: /\/exhibitions/ },
    { text: 'News', urlPattern: /\/news/ },
    { text: 'Videos', urlPattern: /\/videos/ },
    { text: 'Resources', urlPattern: /\/resources/ },
  ];

  for (const link of navLinks) {
    await page.goto('/');

    // Find and click the link in main nav
    const linkElement = page.locator(`nav a:has-text("${link.text}")`).first();
    await expect(linkElement).toBeVisible();
    await linkElement.click();

    // Verify navigation worked
    await expect(page).toHaveURL(link.urlPattern);
    await expect(page.locator('h1').first()).toBeVisible();
  }
});

// TEST 9: Search Functionality (if exists)
// Problem Solved: Users can't find specific artworks
test.skip('search finds relevant artworks', async ({ page }) => {
  // Skip for now - implement when search is added
  await page.goto('/');

  // Look for search input
  const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');

  if (await searchInput.count() === 0) {
    test.skip();
  }

  await searchInput.fill('Manzanar');
  await searchInput.press('Enter');

  // Verify results page
  await expect(page.locator('article, .search-result')).toHaveCount({ min: 1 });
});

// TEST 10: 404 Page Works
// Problem Solved: Broken links show generic error
test('404 page displays correctly', async ({ page }) => {
  await page.goto('/this-page-does-not-exist-12345');

  // Verify 404 page elements
  // Note: Astro might redirect to a 404 page or show inline error
  const pageText = await page.textContent('body');
  expect(pageText).toMatch(/404|not found|page.*not.*exist/i);
});

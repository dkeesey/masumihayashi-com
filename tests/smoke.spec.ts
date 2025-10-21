import { test, expect } from '@playwright/test';

/**
 * Smoke Tests for masumihayashi.com
 *
 * Basic health checks to ensure the site is functioning:
 * - Pages load successfully
 * - No 404 errors
 * - No console errors
 * - Images load properly
 * - Navigation works
 */

test.describe('Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Masumi Hayashi/);
  });

  test('homepage returns 200 status', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('no console errors on homepage', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // Allow page to fully load
    await page.waitForLoadState('networkidle');

    expect(consoleErrors).toHaveLength(0);
  });

  test('no broken images on homepage', async ({ page }) => {
    await page.goto('/');

    // Get all images on the page
    const images = page.locator('img');
    const imageCount = await images.count();

    // Check each image has loaded
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');

      // Skip data URLs and SVGs
      if (src && !src.startsWith('data:') && !src.endsWith('.svg')) {
        // Check naturalWidth is greater than 0 (indicates image loaded)
        const naturalWidth = await img.evaluate((img: HTMLImageElement) => img.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
      }
    }
  });

  test('no 404 errors for common pages', async ({ page }) => {
    const pages = [
      '/',
      // Add more pages as they're created
      // '/about',
      // '/exhibitions',
      // '/artwork',
    ];

    for (const pagePath of pages) {
      const response = await page.goto(pagePath);
      expect(response?.status()).toBe(200);
    }
  });

  test('page has proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Check for essential meta tags
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveCount(1);

    const charset = page.locator('meta[charset]');
    await expect(charset).toHaveCount(1);
  });

  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('load');
    const loadTime = Date.now() - startTime;

    // Page should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('favicon exists', async ({ page }) => {
    await page.goto('/');

    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveCount(1);

    const href = await favicon.getAttribute('href');
    expect(href).toBeTruthy();
  });

  test('no JavaScript errors during navigation', async ({ page }) => {
    const jsErrors: Error[] = [];

    page.on('pageerror', (error) => {
      jsErrors.push(error);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(jsErrors).toHaveLength(0);
  });

  test('page is mobile responsive', async ({ page }) => {
    await page.goto('/');

    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667 },  // iPhone SE
      { width: 768, height: 1024 }, // iPad
      { width: 1920, height: 1080 }, // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForLoadState('load');

      // Check page is still visible and functional
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });
});

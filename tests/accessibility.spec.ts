import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility Tests
 * Priority: HIGH - Legal compliance (ADA), wider audience reach
 *
 * Real-world cost: Domino's Pizza paid $50k+ for inaccessible website
 *
 * Run with:
 *   npm run test:a11y
 */

// TEST 1: Homepage Accessibility
test('homepage has no accessibility violations', async ({ page }) => {
  await page.goto('/');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});

// TEST 2: Artwork Pages Have Proper Alt Text
test('artwork pages have proper alt text', async ({ page }) => {
  await page.goto('/');
  await page.locator('a[href^="/artwork/"]').first().click();

  const images = await page.locator('img').all();
  for (const img of images) {
    const alt = await img.getAttribute('alt');
    expect(alt).toBeTruthy();
    expect(alt!.length).toBeGreaterThan(5);
  }
});

// TEST 3: Keyboard Navigation Works
test('site is keyboard navigable', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  const focused = await page.evaluate(() => {
    return document.activeElement?.tagName;
  });

  expect(['A', 'BUTTON', 'INPUT']).toContain(focused);
});

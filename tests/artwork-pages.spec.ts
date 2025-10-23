import { test, expect } from '@playwright/test';
import AxeBuilder from 'axe-playwright';

const SERIES = [
  { name: 'Japanese-American Internment Camps', path: '/artwork/japanese-american-internment-camps/' },
  { name: 'Sacred Architectures', path: '/artwork/sacred-architectures/' },
  { name: 'Post-Industrial Sites', path: '/artwork/post-industrial/' },
  { name: 'Prisons & Penitentiaries', path: '/artwork/prisons/' },
  { name: 'War & Military Sites', path: '/artwork/war-military/' },
  { name: 'EPA Superfund Sites', path: '/artwork/epa-superfund/' },
  { name: 'City Works', path: '/artwork/city-works/' },
  { name: 'Public Commissions', path: '/artwork/commissions/' },
];

test.describe('Artwork Gallery Pages', () => {
  for (const series of SERIES) {
    test(`${series.name} - gallery loads`, async ({ page }) => {
      await page.goto(series.path);

      // Page should load successfully
      await expect(page).toHaveTitle(new RegExp(series.name.split(' ')[0], 'i'));

      // Should have at least one artwork image
      const images = page.locator('img');
      await expect(images.first()).toBeVisible();
    });

    test(`${series.name} - WCAG 2 contrast compliance`, async ({ page }) => {
      await page.goto(series.path);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});

test.describe('Artwork Detail Pages', () => {
  // Test one detail page from each series
  const SAMPLE_DETAIL_PAGES = [
    '/artwork/japanese-american-internment-camps/gila-river-internment-camp-foundations/',
    '/artwork/sacred-architectures/',  // Will test first artwork
    '/artwork/post-industrial/',
    '/artwork/prisons/',
    '/artwork/war-military/',
    '/artwork/epa-superfund/',
    '/artwork/city-works/',
    '/artwork/commissions/',
  ];

  for (const galleryPath of SAMPLE_DETAIL_PAGES) {
    test(`${galleryPath} - detail page functionality`, async ({ page }) => {
      // Navigate to gallery
      await page.goto(galleryPath);

      // Find and click first artwork link
      const firstArtworkLink = page.locator('a[href*="/artwork/"]').first();

      if (await firstArtworkLink.count() > 0) {
        await firstArtworkLink.click();

        // Detail page should load
        await expect(page).toHaveURL(/\/artwork\//);

        // Should have back to gallery link
        const backLink = page.getByText(/back to gallery/i);
        await expect(backLink).toBeVisible();

        // Should have main artwork image
        const mainImage = page.locator('img').first();
        await expect(mainImage).toBeVisible();

        // Should have related artworks section OR be a detail page
        const relatedSection = page.getByText(/more from/i);
        const hasRelated = await relatedSection.count() > 0;
        expect(hasRelated).toBeTruthy();
      }
    });

    test(`${galleryPath} - detail page WCAG compliance`, async ({ page }) => {
      // Navigate to gallery
      await page.goto(galleryPath);

      // Click first artwork
      const firstArtworkLink = page.locator('a[href*="/artwork/"]').first();
      if (await firstArtworkLink.count() > 0) {
        await firstArtworkLink.click();

        // Run accessibility scan on detail page
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });
  }
});

test.describe('Zoom Functionality', () => {
  test('PhotoSwipe zoom works on detail page', async ({ page }) => {
    // Test internment camps detail page (known to have zoom)
    await page.goto('/artwork/japanese-american-internment-camps/gila-river-internment-camp-foundations/');

    // Should have zoomable image
    const zoomTrigger = page.locator('a.zoom-trigger, [data-pswp-width]');
    await expect(zoomTrigger.first()).toBeVisible();

    // Click to open lightbox
    await zoomTrigger.first().click();

    // PhotoSwipe should open (wait for animation)
    await page.waitForTimeout(500);

    // Should have PhotoSwipe container
    const pswp = page.locator('.pswp, [class*="photoswipe"]');
    const hasPswp = await pswp.count() > 0;
    expect(hasPswp).toBeTruthy();
  });
});

test.describe('Related Artworks', () => {
  test('Related artworks display with thumbnails', async ({ page }) => {
    await page.goto('/artwork/japanese-american-internment-camps/gila-river-internment-camp-foundations/');

    // Should have "More from" section
    const relatedHeading = page.getByText(/more from/i);
    await expect(relatedHeading).toBeVisible();

    // Should have at least one related artwork thumbnail
    const relatedThumbnails = page.locator('[class*="related"] img, section img').last();
    await expect(relatedThumbnails).toBeVisible();

    // Thumbnails should load (not broken)
    const src = await relatedThumbnails.getAttribute('src');
    expect(src).toContain('cloudinary');
    expect(src).not.toContain('undefined');
  });
});

test.describe('Navigation', () => {
  test('Back to gallery link works', async ({ page }) => {
    await page.goto('/artwork/japanese-american-internment-camps/gila-river-internment-camp-foundations/');

    const backLink = page.getByText(/back to gallery/i);
    await backLink.click();

    // Should return to gallery index
    await expect(page).toHaveURL(/\/japanese-american-internment-camps\/?$/);
  });
});

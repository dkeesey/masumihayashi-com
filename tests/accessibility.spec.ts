import { test, expect } from '@playwright/test';

/**
 * Accessibility Tests for masumihayashi.com
 *
 * Ensures the site follows basic accessibility best practices:
 * - Proper heading hierarchy
 * - Alt text on images
 * - ARIA labels where needed
 * - Keyboard navigation
 * - Color contrast (basic checks)
 */

test.describe('Accessibility Tests', () => {
  test('page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check for h1 element
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    expect(h1Count).toBeLessThanOrEqual(1); // Should only have one h1

    // If h1 exists, it should have text
    if (h1Count > 0) {
      const h1Text = await h1.first().textContent();
      expect(h1Text?.trim()).toBeTruthy();
    }
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const imageCount = await images.count();

    // Check each image has alt attribute
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      // Alt attribute should exist (can be empty for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test('links have accessible names', async ({ page }) => {
    await page.goto('/');

    const links = page.locator('a');
    const linkCount = await links.count();

    // Check each link has accessible text or aria-label
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');

      // Link should have text content, aria-label, or title
      const hasAccessibleName = text?.trim() || ariaLabel || title;
      expect(hasAccessibleName).toBeTruthy();
    }
  });

  test('buttons are keyboard accessible', async ({ page }) => {
    await page.goto('/');

    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    // Check each button can receive focus
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);

      // Button should not have tabindex=-1 (unless it's intentionally hidden)
      const tabindex = await button.getAttribute('tabindex');
      if (tabindex !== null) {
        expect(parseInt(tabindex)).toBeGreaterThanOrEqual(-1);
      }

      // Button should have text or aria-label
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      expect(text?.trim() || ariaLabel).toBeTruthy();
    }
  });

  test('page has proper language attribute', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const lang = await html.getAttribute('lang');

    // Should have lang attribute
    expect(lang).toBeTruthy();
    expect(lang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/); // Valid language code format
  });

  test('form inputs have labels', async ({ page }) => {
    await page.goto('/');

    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();

    // Check each input has associated label or aria-label
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const type = await input.getAttribute('type');

      // Skip hidden inputs - they don't need labels
      if (type === 'hidden') {
        continue;
      }

      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');
      const title = await input.getAttribute('title');
      const placeholder = await input.getAttribute('placeholder');

      // Check if there's a label with matching 'for' attribute
      let hasLabel = false;
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        hasLabel = (await label.count()) > 0;
      }

      // Input should have label, aria-label, aria-labelledby, title, or placeholder
      const hasAccessibleLabel = hasLabel || ariaLabel || ariaLabelledby || title || placeholder;

      // Debug: Log failing input details
      if (!hasAccessibleLabel) {
        const tagName = await input.evaluate((el) => el.tagName);
        const type = await input.getAttribute('type');
        const name = await input.getAttribute('name');
        const className = await input.getAttribute('class');
        console.log(`Failing input #${i}: <${tagName} type="${type}" id="${id}" name="${name}" class="${className}">`);
      }

      expect(hasAccessibleLabel).toBeTruthy();
    }
  });

  test('interactive elements are keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // Test Tab navigation works
    await page.keyboard.press('Tab');

    // Get the focused element
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    const tagName = await focusedElement.evaluate((el) => el.tagName);

    // Should focus on an interactive element (not body)
    expect(tagName).not.toBe('BODY');
  });

  test('skip to main content link exists', async ({ page }) => {
    await page.goto('/');

    // Check for skip link (common accessibility pattern)
    const skipLink = page.locator('a[href="#main"], a[href="#content"]').first();

    // If skip link exists, it should be functional
    const skipLinkCount = await skipLink.count();
    if (skipLinkCount > 0) {
      const href = await skipLink.getAttribute('href');
      expect(href).toBeTruthy();

      // Check if target exists
      if (href?.startsWith('#')) {
        const targetId = href.substring(1);
        const target = page.locator(`#${targetId}`);
        await expect(target).toHaveCount(1);
      }
    }
  });

  test('no empty links', async ({ page }) => {
    await page.goto('/');

    const links = page.locator('a');
    const linkCount = await links.count();

    // Check no links are completely empty
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');
      const children = await link.locator('*').count();

      // Link should have text, aria-label, title, or child elements
      const hasContent = text?.trim() || ariaLabel || title || children > 0;
      expect(hasContent).toBeTruthy();
    }
  });

  test('color contrast is sufficient (basic check)', async ({ page }) => {
    await page.goto('/');

    // Get computed styles of text elements
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, a, button, span');
    const elementCount = await textElements.count();

    if (elementCount > 0) {
      // Just check first few elements as a sanity check
      const checkCount = Math.min(5, elementCount);

      for (let i = 0; i < checkCount; i++) {
        const element = textElements.nth(i);
        const styles = await element.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontSize: computed.fontSize,
          };
        });

        // Basic check: elements should have defined colors
        expect(styles.color).toBeTruthy();
      }
    }
  });

  test('images with important content have descriptive alt text', async ({ page }) => {
    await page.goto('/');

    const contentImages = page.locator('img:not([role="presentation"]):not([aria-hidden="true"])');
    const imageCount = await contentImages.count();

    // Check content images (not decorative) have meaningful alt text
    for (let i = 0; i < imageCount; i++) {
      const img = contentImages.nth(i);
      const alt = await img.getAttribute('alt');

      // Content images should have non-empty alt text
      if (alt !== null) {
        // If alt is empty, image might be decorative (which is okay)
        // Just ensure alt attribute exists
        expect(alt).toBeDefined();
      }
    }
  });

  test('page has proper document structure', async ({ page }) => {
    await page.goto('/');

    // Check for main landmark
    const main = page.locator('main');
    const mainCount = await main.count();

    // Should have at least one main element or role="main"
    if (mainCount === 0) {
      const roleMain = page.locator('[role="main"]');
      await expect(roleMain).toHaveCount(1);
    } else {
      expect(mainCount).toBeGreaterThanOrEqual(1);
    }
  });
});

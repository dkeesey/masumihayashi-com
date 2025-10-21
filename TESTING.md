# Playwright Testing Setup for masumihayashi.com

## Overview
Playwright testing framework installed and configured for comprehensive end-to-end testing.

## Installation Details

**Playwright Version**: 1.56.1
**Installation Date**: October 18, 2025
**Browsers Installed**:
- Chromium 141.0.7390.37 (build v1194)
- Firefox 142.0.1 (build v1495)
- Webkit 26.0 (build v2215)
- Chromium Headless Shell 141.0.7390.37

## Test Suite Summary

**Total Tests**: 22

### Smoke Tests (10 tests)
Location: `tests/smoke.spec.ts`

1. Homepage loads successfully
2. Homepage returns 200 status
3. No console errors on homepage
4. No broken images on homepage
5. No 404 errors for common pages
6. Page has proper meta tags
7. Page loads within acceptable time
8. Favicon exists
9. No JavaScript errors during navigation
10. Page is mobile responsive

### Accessibility Tests (12 tests)
Location: `tests/accessibility.spec.ts`

1. Page has proper heading hierarchy
2. Images have alt text
3. Links have accessible names
4. Buttons are keyboard accessible
5. Page has proper language attribute
6. Form inputs have labels
7. Interactive elements are keyboard navigable
8. Skip to main content link exists
9. No empty links
10. Color contrast is sufficient (basic check)
11. Images with important content have descriptive alt text
12. Page has proper document structure

## Configuration

### Playwright Config (`playwright.config.ts`)
- **Base URL**: http://localhost:4321
- **Test Directory**: `./tests`
- **Parallel Execution**: Enabled
- **Retries on CI**: 2
- **Reporter**: HTML
- **Screenshots**: On failure only
- **Video**: Retain on failure
- **Trace**: On first retry

### Browser Projects
Tests run across 5 browser configurations:
1. **Desktop Chromium** - Desktop Chrome
2. **Desktop Firefox** - Desktop Firefox
3. **Desktop WebKit** - Desktop Safari
4. **Mobile Chrome** - Pixel 5
5. **Mobile Safari** - iPhone 12

### Web Server Integration
Automatically starts dev server before tests:
- Command: `npm run dev`
- URL: http://localhost:4321
- Reuses existing server in local development
- Timeout: 120 seconds

## NPM Scripts

```bash
# Run all tests (headless)
npm test

# Run tests with browser visible
npm run test:headed

# Open Playwright UI mode
npm run test:ui

# Show last test report
npm run test:report
```

## Running Tests

### Basic Usage
```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/smoke.spec.ts

# Run tests in headed mode (see browser)
npm run test:headed

# Run in UI mode (interactive)
npm run test:ui

# Run specific test by name
npx playwright test -g "homepage loads"

# Run on specific browser
npx playwright test --project=chromium
```

### Debug Mode
```bash
# Debug specific test
npx playwright test --debug

# Debug with specific browser
npx playwright test --project=firefox --debug

# Step through test in UI mode
npm run test:ui
```

### CI/CD Usage
```bash
# Run tests in CI mode (2 retries, no parallelism)
CI=true npm test
```

## Test Coverage

### What's Tested
- ✅ Page loading and HTTP responses
- ✅ Console error detection
- ✅ Image loading validation
- ✅ Performance (page load time)
- ✅ Mobile responsiveness
- ✅ Accessibility (headings, alt text, labels)
- ✅ Keyboard navigation
- ✅ ARIA attributes
- ✅ Semantic HTML structure
- ✅ Meta tags and SEO basics

### What's NOT Tested (Yet)
- ❌ Content collections (exhibitions, artwork)
- ❌ Gallery functionality
- ❌ Image zoom/lightbox
- ❌ Navigation menus
- ❌ Form submissions
- ❌ Search functionality
- ❌ Advanced accessibility (full WCAG audit)

## Adding New Tests

### Smoke Test Example
```typescript
test('my new feature works', async ({ page }) => {
  await page.goto('/my-page');
  await expect(page.locator('h1')).toHaveText('Expected Title');
});
```

### Accessibility Test Example
```typescript
test('my feature is accessible', async ({ page }) => {
  await page.goto('/my-page');

  // Check for proper ARIA label
  const button = page.locator('button[aria-label="Submit"]');
  await expect(button).toBeVisible();
});
```

## Best Practices

### Test Organization
- Keep smoke tests simple and fast
- Group related tests in describe blocks
- Use descriptive test names
- Put page-specific tests in separate files

### Locator Strategy
```typescript
// Prefer role-based locators (accessibility-friendly)
page.getByRole('button', { name: 'Submit' })

// Use test IDs for dynamic content
page.getByTestId('artwork-gallery')

// CSS selectors as last resort
page.locator('.my-class')
```

### Assertions
```typescript
// Wait for elements
await expect(page.locator('h1')).toBeVisible();

// Check text content
await expect(page.locator('h1')).toHaveText('Welcome');

// Check attributes
await expect(page.locator('img')).toHaveAttribute('alt', 'Description');

// Check URL
await expect(page).toHaveURL(/.*exhibitions/);
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npm test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Troubleshooting

### Dev Server Won't Start
```bash
# Check if port 4321 is in use
lsof -i :4321

# Kill existing process
kill -9 <PID>
```

### Tests Timeout
- Increase timeout in playwright.config.ts
- Check if dev server is running
- Verify network connectivity

### Browser Installation Issues
```bash
# Reinstall browsers
npx playwright install --force

# Install with system dependencies
npx playwright install --with-deps
```

### Test Flakiness
- Add explicit waits: `await page.waitForLoadState('networkidle')`
- Use `await expect()` instead of direct assertions
- Increase test timeout for slow operations

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Locators Guide](https://playwright.dev/docs/locators)
- [Assertions](https://playwright.dev/docs/test-assertions)

## Next Steps

### Phase 1 - Content Tests (When content added)
- [ ] Test all main navigation links
- [ ] Validate exhibition pages load
- [ ] Check artwork gallery functionality
- [ ] Verify search results

### Phase 2 - Interactive Features
- [ ] Test image zoom/lightbox
- [ ] Validate form submissions
- [ ] Check filtering/sorting
- [ ] Test responsive navigation

### Phase 3 - Advanced Accessibility
- [ ] Full WCAG 2.1 AA compliance
- [ ] Screen reader compatibility
- [ ] Keyboard navigation paths
- [ ] Focus management

### Phase 4 - Performance
- [ ] Lighthouse scores
- [ ] Core Web Vitals
- [ ] Image optimization
- [ ] Bundle size monitoring

---

**Last Updated**: October 18, 2025
**Status**: Infrastructure complete, ready for content-specific tests

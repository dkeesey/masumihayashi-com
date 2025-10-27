# Testing Strategy: masumihayashi.com

**Current State**: Scripts configured, tests not written (⭐⭐ out of ⭐⭐⭐⭐⭐)
**Goal**: Comprehensive test coverage (⭐⭐⭐⭐⭐)

---

## Problem Statement: Why We Need Tests

### Current Risks (Without Tests)

#### 1. **Breaking Changes Go Unnoticed**
**Problem**: You change `ResponsiveImage.astro` and break 126 artwork pages
**Impact**: Users see broken images, reputation damage
**Cost**: Hours of manual testing to find the issue
**Test Solution**: E2E tests catch this in 30 seconds during CI

#### 2. **Accessibility Regressions**
**Problem**: Someone removes `alt` tags during refactoring
**Impact**: Screen reader users can't access content, lawsuit risk (ADA compliance)
**Cost**: $50k+ settlement (real case: Domino's Pizza vs. blind customer)
**Test Solution**: Automated a11y tests block deployment

#### 3. **Performance Degradation**
**Problem**: New code adds 500KB JavaScript bundle
**Impact**: Slow site → bounce rate increases → lost donations
**Cost**: 1 second delay = 7% conversion loss (Google research)
**Test Solution**: Performance budget tests fail the build

#### 4. **SEO Metadata Missing**
**Problem**: New exhibition page missing meta description
**Impact**: Google shows "..." in search results → lower CTR
**Cost**: 30% CTR reduction = lost visibility
**Test Solution**: SEO tests verify all required tags

#### 5. **Mobile Layout Breaks**
**Problem**: CSS change breaks mobile navigation
**Impact**: 60% of users are on mobile → can't navigate site
**Cost**: Frustrated users don't return
**Test Solution**: Visual regression tests catch layout changes

---

## Testing Layers

### 1. Unit Tests (Component Level)
**Problem Solved**: Component logic errors
**Tool**: Vitest
**Priority**: Medium (nice-to-have for utility functions)

### 2. Integration Tests (Page Level)
**Problem Solved**: Components don't work together
**Tool**: Playwright Component Testing
**Priority**: Medium

### 3. E2E Tests (User Journey)
**Problem Solved**: Critical user flows broken
**Tool**: Playwright
**Priority**: **HIGH** (implement first)

### 4. Visual Regression Tests
**Problem Solved**: Layout/styling breaks
**Tool**: Playwright + Percy/Chromatic
**Priority**: Medium

### 5. Accessibility Tests
**Problem Solved**: WCAG violations, ADA compliance
**Tool**: axe-playwright
**Priority**: **HIGH** (legal risk)

### 6. Performance Tests
**Problem Solved**: Site becomes slow
**Tool**: Lighthouse CI
**Priority**: **HIGH** (user experience)

---

## Priority 1: E2E Tests (Critical User Flows)

### Problem: Critical Features Break Silently

**Real Scenario**:
1. You update navigation component
2. "Artwork" dropdown stops working
3. Users can't browse the 126 artwork pages
4. You only notice 2 days later from user complaints

**Cost**: Lost visitors, damaged credibility

### Solution: E2E Test Suite

**Test File**: `tests/critical-flows.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

// TEST 1: Homepage Loads
// Problem Solved: Site completely broken (500 error, etc.)
test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');

  // Verify critical elements
  await expect(page.locator('h1')).toContainText('Masumi Hayashi');
  await expect(page.locator('nav')).toBeVisible();

  // Verify all 8 series cards load
  const seriesCards = page.locator('a[href^="/artwork/"]');
  await expect(seriesCards).toHaveCount(8);
});

// TEST 2: Artwork Navigation Works
// Problem Solved: Users can't browse artwork (primary site purpose)
test('can navigate to artwork series and view details', async ({ page }) => {
  await page.goto('/');

  // Click "Japanese American Internment Camps" series
  await page.click('text=Japanese American Internment Camps');

  // Verify series page loads
  await expect(page).toHaveURL(/\/artwork\/japanese-american-internment-camps/);
  await expect(page.locator('h1')).toBeVisible();

  // Click first artwork
  await page.locator('article').first().click();

  // Verify artwork detail page
  await expect(page.locator('img')).toBeVisible();
  await expect(page.locator('h1')).toBeVisible();
});

// TEST 3: Images Load from R2
// Problem Solved: R2 misconfiguration breaks all images
test('images load from R2 CDN', async ({ page }) => {
  await page.goto('/');

  // Get first series card image
  const img = page.locator('article img').first();

  // Wait for image to load
  await img.waitFor({ state: 'visible' });

  // Verify R2 domain
  const src = await img.getAttribute('src');
  expect(src).toContain('images.masumihayashi.com'); // Custom domain

  // Verify image actually loaded (not 404)
  const response = await page.request.get(src!);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/');
});

// TEST 4: Exhibitions Page Works
// Problem Solved: Time-sensitive exhibition info unavailable
test('exhibitions page displays upcoming exhibitions', async ({ page }) => {
  await page.goto('/exhibitions');

  // Verify page loads
  await expect(page.locator('h1')).toContainText('Exhibitions');

  // Verify at least one exhibition
  const exhibitions = page.locator('article');
  await expect(exhibitions).toHaveCount({ min: 1 });

  // Click first exhibition
  await exhibitions.first().click();

  // Verify exhibition detail page
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('text=/venue|museum|gallery/i')).toBeVisible();
});

// TEST 5: Mobile Navigation Works
// Problem Solved: 60% of users can't navigate on mobile
test('mobile menu works', async ({ page }) => {
  // Simulate mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });

  await page.goto('/');

  // Mobile menu should be hidden initially
  const mobileMenu = page.locator('[aria-label="Toggle Menu"]');
  await expect(mobileMenu).toBeVisible();

  // Click mobile menu
  await mobileMenu.click();

  // Verify menu opens
  await expect(page.locator('nav a:text("Artwork")')).toBeVisible();

  // Click menu item
  await page.click('nav a:text("Exhibitions")');

  // Verify navigation worked
  await expect(page).toHaveURL(/\/exhibitions/);
});

// TEST 6: Donate Link Works
// Problem Solved: Broken donate flow = lost donations
test('donate button navigates correctly', async ({ page }) => {
  await page.goto('/');

  // Find donate button
  const donateBtn = page.locator('a:text("Donate"), a:text("Support")');
  await expect(donateBtn.first()).toBeVisible();

  // Click donate
  await donateBtn.first().click();

  // Verify navigation to donate page
  await expect(page).toHaveURL(/\/donate/);
  await expect(page.locator('h1')).toBeVisible();
});
```

**Run Tests**:
```bash
npm run test          # Headless mode
npm run test:headed   # See browser
npm run test:ui       # Interactive mode
```

**Expected Result**:
```
Running 6 tests using 3 workers

  ✓ homepage loads successfully (1.2s)
  ✓ can navigate to artwork series and view details (2.3s)
  ✓ images load from R2 CDN (1.5s)
  ✓ exhibitions page displays upcoming exhibitions (1.8s)
  ✓ mobile menu works (1.4s)
  ✓ donate button navigates correctly (1.1s)

6 passed (9.3s)
```

**Time Investment**: 2 hours to write
**Time Saved**: Every deployment (catches issues in 10s vs hours of manual testing)

---

## Priority 2: Accessibility Tests

### Problem: ADA Compliance Violations

**Real-World Cost**: Domino's Pizza paid $50k+ settlement for inaccessible website

**Common Violations**:
1. Missing `alt` text on images
2. Low color contrast (text unreadable)
3. Missing ARIA labels
4. Keyboard navigation broken
5. Screen reader can't navigate

### Solution: Automated a11y Tests

**Test File**: `tests/accessibility.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

// TEST 1: Homepage Accessibility
// Problem Solved: WCAG violations on homepage
test('homepage has no accessibility violations', async ({ page }) => {
  await page.goto('/');

  // Inject axe-core
  await injectAxe(page);

  // Run accessibility audit
  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: {
      html: true,
    },
  });

  // Will throw error if violations found
});

// TEST 2: Artwork Pages Accessibility
// Problem Solved: Image alt text missing (screen readers fail)
test('artwork pages have proper alt text', async ({ page }) => {
  await page.goto('/artwork/japanese-american-internment-camps');

  // Check all images have alt text
  const images = await page.locator('img').all();

  for (const img of images) {
    const alt = await img.getAttribute('alt');
    expect(alt).toBeTruthy();
    expect(alt!.length).toBeGreaterThan(5); // Non-empty alt text
  }
});

// TEST 3: Keyboard Navigation
// Problem Solved: Keyboard users can't navigate
test('site is keyboard navigable', async ({ page }) => {
  await page.goto('/');

  // Tab through navigation
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  // Verify focus is visible
  const focused = await page.evaluate(() => document.activeElement?.tagName);
  expect(['A', 'BUTTON']).toContain(focused);

  // Press Enter on focused element
  await page.keyboard.press('Enter');

  // Verify navigation worked
  await expect(page).not.toHaveURL('/');
});

// TEST 4: Color Contrast
// Problem Solved: Low contrast text unreadable
test('text has sufficient color contrast', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);

  // Check specifically for color contrast
  await checkA11y(page, undefined, {
    rules: {
      'color-contrast': { enabled: true },
    },
  });
});
```

**Impact**:
- **Legal Protection**: Reduces lawsuit risk
- **Wider Audience**: 15% of population has disabilities
- **SEO Benefit**: Google favors accessible sites
- **Better UX**: Helps everyone (elderly, mobile users, etc.)

---

## Priority 3: Performance Tests

### Problem: Site Becomes Slow Over Time

**Real Impact**:
- 1 second delay = 7% conversion loss (Google)
- 3 second load = 53% of mobile users bounce (Google)
- Slow site = lower Google ranking

### Solution: Lighthouse CI

**Setup**: `lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": [
        "http://localhost:4321/",
        "http://localhost:4321/artwork/",
        "http://localhost:4321/exhibitions/"
      ]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "categories:seo": ["error", {"minScore": 1.0}],
        "first-contentful-paint": ["error", {"maxNumericValue": 2000}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**Run**:
```bash
npm run build
npm run preview &
lhci autorun
```

**Result**:
```
Performance: 95 ✓
Accessibility: 98 ✓
SEO: 100 ✓
FCP: 1.2s ✓
LCP: 2.1s ✓
CLS: 0.05 ✓
```

**If Performance Drops**:
```
Performance: 72 ✗ (below threshold of 90)
  - Unused JavaScript: 450KB (remove)
  - Unoptimized images: 2.3MB (use WebP)
  - No text compression (enable gzip)

Build FAILED - Fix performance issues before deploying
```

**Problem Solved**: Prevents performance regressions from reaching production

---

## Implementation Plan

### Phase 1: Critical Tests (Week 1)

**Day 1**: E2E Tests (4 hours)
- Write 6 critical user flow tests
- Set up GitHub Actions to run on PR
- Block merge if tests fail

**Day 2**: Accessibility Tests (3 hours)
- Write axe-playwright tests
- Audit all 172 pages
- Fix violations found

**Day 3**: Performance Tests (2 hours)
- Set up Lighthouse CI
- Define performance budgets
- Integrate with CI/CD

**Investment**: 9 hours
**ROI**: Prevents 1 major incident = saves days of debugging

### Phase 2: Visual Regression (Week 2)

**Tool**: Percy or Chromatic
**Cost**: Free tier (5k snapshots/month)

**Setup**:
```bash
npm install --save-dev @percy/cli @percy/playwright
```

**Test**:
```typescript
import { percySnapshot } from '@percy/playwright';

test('homepage visual regression', async ({ page }) => {
  await page.goto('/');
  await percySnapshot(page, 'Homepage');
});
```

**Result**: Catches unintended CSS changes

### Phase 3: Integration Tests (Week 3)

**Component Testing**:
- Test NavMenu dropdown behavior
- Test ResponsiveImage loading states
- Test form validations

---

## CI/CD Integration

**GitHub Actions**: `.github/workflows/test.yml`

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run E2E tests
        run: npm run test

      - name: Run accessibility audit
        run: npm run test:a11y

      - name: Run Lighthouse CI
        run: |
          npm run build
          npm run preview &
          npx lhci autorun

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

**Result**: Tests run automatically on every commit

---

## Cost-Benefit Analysis

### Without Tests (Current State)

**Risks**:
- Deploy breaking change → 1 hour to discover + 2 hours to fix = **3 hours lost**
- Accessibility lawsuit → **$50k+ settlement**
- Performance regression → **7% conversion loss**
- SEO penalty → **30% traffic drop**

**Time Spent**: Manual testing before each deploy = **30 min/deploy**

### With Tests (Proposed)

**Initial Investment**:
- Write tests: 20 hours
- Set up CI/CD: 2 hours
- **Total**: 22 hours (~3 days)

**Ongoing**: 0 hours (automated)

**Benefits**:
- **Catch bugs in 10s** vs hours of debugging
- **Zero manual testing** before deploys
- **Legal protection** from a11y lawsuits
- **Performance insurance** against regressions
- **Confidence** to deploy daily

**Break-even**: After 44 deploys (22 hours / 0.5 hours saved per deploy)

---

## Recommended Action Plan

### This Week

1. **E2E Tests** (4 hours)
   - Write 6 critical flow tests
   - Run manually: `npm run test:headed`

2. **Accessibility Audit** (2 hours)
   - Run axe on all pages
   - Fix top 10 violations

3. **Lighthouse Baseline** (1 hour)
   - Run Lighthouse on key pages
   - Document current scores

### Next Week

4. **CI/CD Integration** (2 hours)
   - Set up GitHub Actions
   - Auto-run tests on PR

5. **Visual Regression** (3 hours)
   - Set up Percy/Chromatic
   - Capture baseline snapshots

6. **Performance Budgets** (2 hours)
   - Configure Lighthouse CI
   - Set thresholds

---

## Success Metrics

**Before Tests**:
- Deploy confidence: 60% ("hope it works")
- Bug discovery time: 2-24 hours (user reports)
- Manual testing: 30 min/deploy
- Accessibility score: Unknown
- Performance score: Unknown

**After Tests**:
- Deploy confidence: 95% ("tests passed")
- Bug discovery time: 10 seconds (CI/CD)
- Manual testing: 0 min (automated)
- Accessibility score: 98/100 (monitored)
- Performance score: 95/100 (monitored)

---

## Conclusion

**Problem**: No tests = high risk of breaking production
**Solution**: 3-layer testing (E2E + a11y + performance)
**Investment**: 22 hours (~3 days)
**Payoff**: Prevents catastrophic failures, saves time on every deploy

**Recommended**: Start with E2E tests (4 hours) - highest ROI

---

**Created**: 2025-10-27
**Priority**: HIGH
**Status**: Ready to implement

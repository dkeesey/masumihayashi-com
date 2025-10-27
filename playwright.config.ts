import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for masumihayashi.com
 *
 * Runs tests against local dev server on http://localhost:4321
 * Tests across Chromium, Firefox, and WebKit browsers
 *
 * SOP: Browser Testing Strategy
 * =============================
 *
 * DEBUGGING (when tests fail):
 * - Use Chromium-only (fast, cheap, easier to debug)
 * - Run: npm run test:critical
 * - ALWAYS review screenshots/videos in test-results/ for failures
 * - Screenshots show actual visual state at failure moment
 * - Videos show full interaction leading to failure
 *
 * VERIFICATION (before deploy):
 * - Uncomment all 5 browsers (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari)
 * - Run: npm run test (full suite)
 * - Ensures cross-browser compatibility
 * - Only needed when tests are passing on Chromium
 *
 * CI/CD:
 * - Keep all 5 browsers enabled on main branch
 * - Catches browser-specific regressions
 * - Run on every PR to production
 */
export default defineConfig({
  testDir: './tests',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use */
  reporter: 'html',

  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: 'http://localhost:4321',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on first retry */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Disabled for now to make debugging easier
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // /* Test against mobile viewports */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});

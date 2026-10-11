// E2E tests (Fáze 5): the visitor's journey in a real browser, phone and desktop. Run with `npm run test:e2e`.
// Uses the locally installed Chrome (no browser download). /api/lead is intercepted in the tests,
// so no lead is stored and no e-mail is sent.
import { defineConfig, devices } from '@playwright/test';

const PORT = 4330;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'mobil', use: { ...devices['Pixel 7'], channel: 'chrome', viewport: { width: 375, height: 812 } } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1366, height: 900 } } },
  ],
  webServer: {
    command: `npx astro dev --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

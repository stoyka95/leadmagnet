// Shared set-up for the E2E tests:
// - analytics requests (PostHog, Vercel) are blocked, so tests never pollute the real data;
// - funnel events are recorded in window.__events by wrapping window.__fgCapture (set by src/lib/analytics.ts);
// - POST /api/lead is answered by the test (no lead stored, no e-mail sent) and its payloads are kept;
// - console errors are collected and must stay empty.
import { test as base, expect, type Page } from '@playwright/test';

export type FunnelEvent = [string, Record<string, unknown>];

type Fixtures = {
  leadApi: { payloads: Record<string, unknown>[]; status: number };
  consoleErrors: string[];
};

export const test = base.extend<Fixtures>({
  leadApi: async ({ page }, use) => {
    const api = { payloads: [] as Record<string, unknown>[], status: 200 };
    await page.route('**/api/lead', async (route) => {
      api.payloads.push(route.request().postDataJSON());
      await route.fulfill({ status: api.status, contentType: 'application/json', body: JSON.stringify({ ok: api.status === 200, emailSent: true }) });
    });
    await use(api);
  },
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      const t = m.text();
      // blocked analytics on purpose, Vite dev websocket noise
      if (/Failed to load resource|ERR_FAILED|posthog|vercel/i.test(t)) return;
      errors.push(t);
    });
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    await use(errors);
  },
  page: async ({ page }, use) => {
    await page.route(/posthog\.com|vercel-scripts\.com|\/_vercel\/insights/, (route) => route.abort());
    await page.addInitScript(() => {
      // kept in sessionStorage so events survive the redirect to /dekujeme (test-only, the page itself stores nothing)
      const KEY = '__e2e_events';
      const w = window as unknown as { __events: unknown[]; __fgCapture?: unknown };
      w.__events = JSON.parse(sessionStorage.getItem(KEY) ?? '[]');
      const record = (e: string, p: unknown) => { w.__events.push([e, p]); sessionStorage.setItem(KEY, JSON.stringify(w.__events)); };
      let real: ((e: string, p: unknown) => void) | undefined;
      Object.defineProperty(window, '__fgCapture', {
        configurable: true,
        get: () => (real ? (e: string, p: unknown) => { record(e, p); real!(e, p); } : undefined),
        set: (v) => { real = v; },
      });
    });
    await use(page);
  },
});

export { expect };

export const events = (page: Page) => page.evaluate(() => (window as unknown as { __events: FunnelEvent[] }).__events);
export const eventNames = async (page: Page) => (await events(page)).map(([e]) => e);

// Pages are long; smooth scrolling (html { scroll-behavior: smooth }) would make positions flaky
export const noSmoothScroll = (page: Page) => page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });

export const noHorizontalScroll = async (page: Page) => {
  const { scrollW, clientW } = await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth }));
  expect(scrollW, 'page must not scroll sideways').toBeLessThanOrEqual(clientW);
};

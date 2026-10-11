// D35 / CLAUDE.md §8: both ad versions end to end – the first screen keeps the ad's promise, the whole path
// works and the lead carries its utm_content, in both arms of the live first-screen test (D28).
import { test, expect, eventNames, noSmoothScroll, noHorizontalScroll } from './fixtures';

const AD = (v: 'a' | 'b', exp: string) =>
  `/?utm_source=meta&utm_medium=paid_social&utm_campaign=etf_nyse_leadmagnet_2026_10&utm_content=${v}&exp=${exp}`;

const PROMISE = {
  a: { h1: /Chcete VOO nebo SPY\?/, card: '.hero-card .variant-a' }, // ad A: "Chcete VOO?" – where to buy it
  b: { h1: /Stejný index, jiný poplatek/, card: '.hero-card .variant-b' }, // ad B: "Stejný index S&P 500" – the fee
};

for (const v of ['a', 'b'] as const) {
  for (const exp of ['control', 'hero_input']) {
    test(`ad ${v.toUpperCase()} × ${exp}: ad promise on the first screen → calculator → form → thank you`, async ({ page, leadApi, consoleErrors }) => {
      await page.goto(AD(v, exp));
      await noSmoothScroll(page);
      if (v === 'a') await expect(page.locator('html')).toHaveAttribute('data-ad', 'a');
      else await expect(page.locator('html')).not.toHaveAttribute('data-ad', 'a'); // B is the default hero
      await expect(page.locator('h1:visible')).toHaveText(PROMISE[v].h1);
      await expect(page.locator(PROMISE[v].card)).toBeVisible();
      // the first screen already says what the visitor gets and has a way into the calculator
      const viewport = page.viewportSize()!;
      const entry = exp === 'control' ? page.locator('.hero-cta') : page.locator('#h-monthly');
      await expect(entry).toBeVisible();
      expect((await entry.boundingBox())!.y).toBeLessThan(viewport.height);
      await noHorizontalScroll(page);

      await page.locator('#c-monthly').fill('5000');
      await page.locator('#c-monthly').press('Tab');
      await expect.poll(() => eventNames(page)).toContain('tool_used'); // sent 0.8 s after the last change
      const form = page.locator('[data-lead-form][data-location=calculator]');
      await form.locator('input[name=email]').fill(`ad-${v}@example.cz`);
      await form.getByRole('button', { name: 'Získat srovnání zdarma' }).click();
      await page.waitForURL('**/dekujeme');

      expect(leadApi.payloads).toHaveLength(1);
      expect(leadApi.payloads[0]).toMatchObject({
        form_location: 'calculator',
        marketing_consent: false,
        phone_consent: false,
        utm: { utm_source: 'meta', utm_medium: 'paid_social', utm_campaign: 'etf_nyse_leadmagnet_2026_10', utm_content: v },
      });
      await expect.poll(() => eventNames(page)).toEqual(expect.arrayContaining(['tool_used', 'form_start', 'form_submit', 'thank_you_view']));
      await expect(page.getByRole('heading', { level: 1, name: /Srovnání je na cestě/ })).toBeVisible();
      expect(consoleErrors).toEqual([]);
    });
  }
}

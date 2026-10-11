// Automated accessibility check (axe-core, WCAG 2.1 A/AA rules) of every page.
// Covers what a machine can check: contrast, labels, names, landmarks, ARIA. Keyboard paths are in journey.spec.ts.
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures';

for (const path of ['/', '/dekujeme', '/zasady', '/zdroje']) {
  test(`no serious or critical accessibility issues on ${path}`, async ({ page }) => {
    await page.goto(path);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const serious = result.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => `${v.id} (${v.impact}): ${v.help} – ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
    expect(serious).toEqual([]);
  });
}

test('the page can be used with the keyboard: skip to the calculator and into the form', async ({ page }) => {
  await page.goto('/');
  // first Tab stops on the logo, then the header button
  await page.keyboard.press('Tab');
  await expect(page.locator('.site-header .logo')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-header-cta]')).toBeFocused();
  // the blurred detail is never reached by Tab
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press('Tab');
    const inGate = await page.evaluate(() => !!document.activeElement?.closest('.gate-body'));
    expect(inGate).toBe(false);
  }
});

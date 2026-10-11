// D28: live A/B test of the first screen (H2 – calculator on the first screen).
import { test as rawTest } from '@playwright/test';
import { test, expect, events, eventNames, noSmoothScroll, noHorizontalScroll } from './fixtures';

test('control shows the button, hero_input the amount field', async ({ page }) => {
  await page.goto('/?exp=control');
  await expect(page.locator('.hero-cta')).toBeVisible();
  await expect(page.locator('[data-hero-calc]')).toBeHidden();
  await page.goto('/?exp=hero_input');
  await expect(page.locator('[data-hero-calc]')).toBeVisible();
  await expect(page.locator('.hero-cta')).toBeHidden();
  await expect(page.locator('html')).toHaveAttribute('data-exp-hero', 'hero_input');
  await noHorizontalScroll(page);
});

test('the variant is kept within the tab', async ({ page }) => {
  await page.goto('/?exp=hero_input');
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-exp-hero', 'hero_input');
  await page.goto('/dekujeme');
  expect(await page.evaluate(() => sessionStorage.getItem('fg:exp_hero_calc'))).toBe('hero_input');
});

test('hero_input hands the amount to the calculator and shows the result', async ({ page }) => {
  await page.goto('/?exp=hero_input&utm_content=b');
  await noSmoothScroll(page);
  const field = page.locator('#h-monthly');
  await field.fill('5000');
  await expect(field).toHaveValue(/5\s000/);
  await page.getByRole('button', { name: 'Spočítat', exact: true }).click();
  await expect(page.locator('#c-monthly')).toHaveValue(/5\s000/);
  await expect(page.locator('[data-paid]')).toHaveText(/1\s300\s000\sKč/); // 100 000 + 5 000 × 240
  await expect(page.locator('.area-fees')).toBeInViewport();
  expect(await events(page)).toContainEqual(['hero_calc_submit', { monthly_czk: 5000 }]);
  await expect.poll(() => eventNames(page)).toContain('tool_used');
});

test('Enter in the hero field works like the button', async ({ page }) => {
  await page.goto('/?exp=hero_input');
  await page.locator('#h-monthly').fill('2000');
  await page.locator('#h-monthly').press('Enter');
  await expect(page.locator('#c-monthly')).toHaveValue(/2\s000/);
});

// Without any preset: both variants occur (50/50 at random), the choice is made before first paint
rawTest('new visitors are split between both variants', async ({ browser }) => {
  const seen = new Set<string>();
  for (let i = 0; i < 24 && seen.size < 2; i++) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.route(/posthog\.com|vercel-scripts\.com|\/_vercel\/insights/, (r) => r.abort());
    await page.goto('/', { waitUntil: 'commit' });
    await page.waitForSelector('html[data-exp-hero]', { state: 'attached' });
    seen.add((await page.locator('html').getAttribute('data-exp-hero'))!);
    await context.close();
  }
  expect([...seen].sort()).toEqual(['control', 'hero_input']);
});

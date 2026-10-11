// D32: the thank-you page – one voluntary question and sharing.
import { test, expect, events } from './fixtures';

test.beforeEach(async ({ page }) => {
  // as after a real submission: only the first name and the reference are kept in the tab
  await page.addInitScript(() => sessionStorage.setItem('fg:lead', JSON.stringify({ firstName: 'Jana', leadRef: 'ref-123' })));
});

test('the voluntary question records one answer with the lead reference', async ({ page }) => {
  await page.goto('/dekujeme');
  await page.getByRole('button', { name: 'Začínám' }).click();
  await expect(page.getByRole('button', { name: 'Začínám' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('Děkujeme, pomůže nám to')).toBeVisible();
  for (const name of ['Ano', 'Začínám', 'Zatím ne']) await expect(page.getByRole('button', { name })).toBeDisabled();
  expect(await events(page)).toContainEqual(['lead_segment', { answer: 'starting', lead_ref: 'ref-123' }]);
  // answered once per tab
  await page.reload();
  await expect(page.getByRole('button', { name: 'Začínám' })).toHaveAttribute('aria-pressed', 'true');
  expect((await events(page)).filter(([e]) => e === 'lead_segment')).toHaveLength(1);
});

test('the share link is tagged and can be copied', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/dekujeme');
  const wa = page.locator('[data-share-whatsapp]');
  expect(decodeURIComponent((await wa.getAttribute('href'))!)).toContain('/?utm_source=share&utm_medium=referral&utm_campaign=thank_you');
  await page.getByRole('button', { name: 'Kopírovat odkaz' }).click();
  await expect(page.getByText('Odkaz je zkopírovaný.')).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/\/\?utm_source=share&utm_medium=referral&utm_campaign=thank_you$/);
  expect(await events(page)).toContainEqual(['share_click', { method: 'copy' }]);
});

test('question and sharing are left out of the printed PDF', async ({ page }) => {
  await page.goto('/dekujeme');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('[data-ask]')).toBeHidden();
  await expect(page.locator('.share')).toBeHidden();
});

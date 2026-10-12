// D38: visitors from ad A get a form without consent boxes; the two optional consents are offered on the thank-you page.
import { test, expect, events } from './fixtures';

const AD_A = '/?utm_source=meta&utm_medium=paid_social&utm_campaign=etf_nyse_leadmagnet_2026_10&utm_content=a';

test('ad A: no consent boxes in the forms, a note instead; the lead says the consents come later', async ({ page, leadApi }) => {
  await page.goto(AD_A);
  const form = page.locator('[data-lead-form][data-location=calculator]');
  await expect(form.locator('input[type=checkbox]').first()).toBeHidden();
  await expect(form.locator('.consent-after')).toBeVisible();
  await expect(form.locator('.consent-after')).toContainText('se vás zeptáme až po odeslání');
  await expect(form.locator('[id$=phone-why]')).toContainText('když nám to po odeslání dovolíte');
  await form.locator('input[name=email]').fill('jana@example.cz');
  await form.locator('input[name=phone]').fill('+420 777 123 456');
  await form.getByRole('button', { name: 'Získat srovnání zdarma' }).click();
  await page.waitForURL('**/dekujeme');
  expect(leadApi.payloads[0]).toMatchObject({ consent_flow: 'after', marketing_consent: false, phone_consent: false, consent_version: 'v3a-2026-10-12' });
  // the thank-you page offers both consents, the call because a number was given
  await expect(page.locator('[data-consent]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ano, můžete mi zavolat' })).toBeVisible();
});

test('ad B: the form keeps the two unticked boxes and the thank-you page offers nothing extra', async ({ page }) => {
  await page.goto(AD_A.replace('utm_content=a', 'utm_content=b'));
  const form = page.locator('[data-lead-form][data-location=calculator]');
  await expect(form.locator('input[name=marketing_consent]')).toBeVisible();
  await expect(form.locator('.consent-after')).toBeHidden();
  await page.addInitScript(() => sessionStorage.setItem('fg:lead', JSON.stringify({ firstName: 'Jana', leadRef: '0b6e4c1e-7a59-4a8e-9f3b-2c1d5e6f7a8b', consentFlow: 'form' })));
  await page.goto('/dekujeme');
  await expect(page.locator('[data-consent]')).toBeHidden();
});

test('thank-you page: one click stores the e-mail consent; no call button without a phone number', async ({ page }) => {
  const ref = '0b6e4c1e-7a59-4a8e-9f3b-2c1d5e6f7a8b';
  const sent: unknown[] = [];
  await page.route('**/api/consent', async (route) => {
    sent.push(route.request().postDataJSON());
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await page.addInitScript((r) => sessionStorage.setItem('fg:lead', JSON.stringify({ firstName: 'Jana', leadRef: r, consentFlow: 'after', hasPhone: false })), ref);
  await page.goto('/dekujeme');
  await expect(page.getByRole('button', { name: 'Ano, můžete mi zavolat' })).toBeHidden();
  const email = page.getByRole('button', { name: 'Ano, posílejte mi další tipy e-mailem' });
  await email.click();
  await expect(email).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-consent-status]')).toHaveText(/budeme posílat e-mailem/);
  expect(sent).toEqual([{ lead_ref: ref, kind: 'email' }]);
  expect(await events(page)).toContainEqual(['consent_given', { kind: 'email', lead_ref: ref }]);
});

test('thank-you page: a failed save says so and lets the visitor try again', async ({ page }) => {
  await page.route('**/api/consent', (route) => route.fulfill({ status: 502, body: '{}' }));
  await page.addInitScript(() => sessionStorage.setItem('fg:lead', JSON.stringify({ leadRef: '0b6e4c1e-7a59-4a8e-9f3b-2c1d5e6f7a8b', consentFlow: 'after', hasPhone: true })));
  await page.goto('/dekujeme');
  const email = page.getByRole('button', { name: 'Ano, posílejte mi další tipy e-mailem' });
  await email.click();
  await expect(page.locator('[data-consent-status]')).toHaveText(/nepodařilo uložit/);
  await expect(email).toBeEnabled();
});

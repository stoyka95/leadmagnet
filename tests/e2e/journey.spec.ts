// The visitor's journey from the ad to the thank-you page (CLAUDE.md §8), on a phone and on desktop.
import { test, expect, eventNames, events, noSmoothScroll, noHorizontalScroll } from './fixtures';

const AD_B = '/?utm_source=meta&utm_medium=paid_social&utm_campaign=etf_nyse_leadmagnet_2026_10&utm_content=b';
const AD_A = AD_B.replace('utm_content=b', 'utm_content=a');

test.describe('first screen (D17)', () => {
  test('ad B shows the numbers headline, ad A the VOO headline', async ({ page, consoleErrors }) => {
    await page.goto(AD_B);
    await expect(page.locator('h1:visible')).toHaveText(/Stejný index, jiný poplatek/);
    await page.goto(AD_A);
    await expect(page.locator('h1:visible')).toHaveText(/Chcete VOO nebo SPY/);
    await expect(page).toHaveTitle(/Fingramo/);
    expect(consoleErrors).toEqual([]);
  });

  test('the hero card follows the ad (D29): A = original → European pairs, B = SPY vs VOO', async ({ page }) => {
    await page.goto(AD_A);
    const cardA = page.locator('.hero-card .variant-a');
    await expect(cardA).toBeVisible();
    await expect(page.locator('.hero-card .variant-b')).toBeHidden();
    await expect(cardA.locator('.pairs li')).toHaveCount(3);
    await expect(cardA.locator('.pair-eu strong')).toHaveText(['VUAA', 'SPYL', 'VWCE']);
    await page.goto(AD_B);
    await expect(page.locator('.hero-card .variant-b')).toBeVisible();
    await expect(page.locator('.hero-card .variant-a')).toBeHidden();
  });

  test('without UTM the default variant B is shown', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1:visible')).toHaveText(/Stejný index/);
  });

  test('the fee ratio badge is computed from data, not typed in', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/Poplatek VOO ~3× nižší/)).toBeVisible();
  });

  test('no page scrolls sideways', async ({ page }) => {
    for (const path of ['/', '/dekujeme', '/zasady', '/zdroje']) {
      await page.goto(path);
      await noHorizontalScroll(page);
    }
  });
});

test.describe('sticky top bar (D27)', () => {
  test('stays visible while scrolling; leads to the calculator first (D30)', async ({ page }) => {
    await page.goto(AD_B);
    await noSmoothScroll(page);
    const header = page.locator('[data-site-header]');
    const cta = page.locator('[data-header-cta]');
    await page.mouse.wheel(0, 3000);
    await expect(header).toHaveClass(/scrolled/);
    expect((await header.boundingBox())!.y).toBe(0);
    await expect(cta).toHaveText(/Spočítat poplatky/);
    await cta.click();
    await expect(page.locator('#kalkulacka')).toBeInViewport();
    expect(await events(page)).toContainEqual(['cta_click', { cta: 'header_calc' }]);
  });

  test('after the calculator is used it leads to the nearest form ahead (QA 12. 10.)', async ({ page }) => {
    await page.goto(AD_B);
    await noSmoothScroll(page);
    await page.locator('#c-once').fill('80000');
    const cta = page.locator('[data-header-cta]');
    await expect(cta).toHaveText(/Získat srovnání/);
    // at the calculator: the form under the result, not the one at the end of the page
    await cta.click();
    await expect(page.locator('#lf-calculator-email')).toBeFocused();
    await expect(page.locator('#lf-calculator-email')).toBeInViewport();
    // past that form: the last one
    await page.locator('#dobre-vedet').scrollIntoViewIfNeeded();
    await cta.click();
    await expect(page.locator('#lf-footer-email')).toBeFocused();
    await expect(page.locator('#lf-footer-email')).toBeInViewport();
    expect(await events(page)).toContainEqual(['cta_click', { cta: 'header' }]);
    // remembered within the tab
    await page.reload();
    await expect(cta).toHaveText(/Získat srovnání/);
  });

  test('the hero field (variant hero_input) also switches the bar to the form', async ({ page }) => {
    await page.goto('/?exp=hero_input');
    await page.locator('#h-monthly').fill('3000');
    await page.locator('#h-monthly').press('Enter');
    await expect(page.locator('[data-header-cta]')).toHaveText(/Získat srovnání/);
  });

  test('the old mobile bottom bar is gone', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-sticky]')).toHaveCount(0);
  });
});

test.describe('calculator (D16, D20)', () => {
  test('recalculates from the visitor’s amounts and reports tool_used', async ({ page }) => {
    await page.goto(AD_B);
    const once = page.locator('#c-once');
    await once.fill('250000');
    await expect(once).toHaveValue(/250\s000/); // formatted while typing
    await page.locator('#c-monthly').fill('5000');
    await expect(page.locator('[data-paid]')).toHaveText(/1\s450\s000\sKč/); // 250 000 + 5 000 × 240
    await expect(page.locator('[data-min]')).toHaveText(/5\s103\sKč/);
    await expect(page.locator('[data-max]')).toHaveText(/15\s997\sKč/);
    await expect.poll(() => eventNames(page)).toContain('tool_used');
  });

  test('ignores letters in the amount fields', async ({ page }) => {
    await page.goto('/');
    const once = page.locator('#c-once');
    await once.fill('12abc3');
    await expect(once).toHaveValue('123');
  });

  test('the horizon slider changes the years and the history range', async ({ page }) => {
    await page.goto('/');
    await page.locator('#c-years').fill('10');
    await expect(page.locator('[data-years-txt]')).toHaveText('10 let');
    await expect(page.locator('[data-hist-years]')).toHaveText('10');
  });

  test('remembers the amounts within the tab', async ({ page }) => {
    await page.goto('/');
    await page.locator('#c-once').fill('50000');
    await page.reload();
    await expect(page.locator('#c-once')).toHaveValue(/50\s000/);
  });
});

test.describe('gate (D25)', () => {
  test('the headline result is open, the detail blurred and unreachable', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-diff]')).toHaveText(/Rozdíl v poplatcích/);
    await expect(page.locator('.gate.is-locked')).toHaveCount(3);
    for (const body of await page.locator('.gate .gate-body').all()) await expect(body).toHaveAttribute('inert', '');
    // risk wording stays readable outside the gate
    await expect(page.getByText('Nejde o předpověď.').first()).toBeVisible();
  });

  test('an unlock button leads to the e-mail field', async ({ page }) => {
    await page.goto('/');
    await noSmoothScroll(page);
    await page.locator('[data-cta=gate_fees]').click();
    await expect(page.locator('#lf-calculator-email')).toBeFocused();
    await expect(page.locator('#lf-calculator-email')).toBeInViewport();
  });
});

test.describe('lead form (D5, D13, D25)', () => {
  test('only the e-mail is required; errors are announced and clear when fixed', async ({ page, leadApi }) => {
    await page.goto('/');
    const form = page.locator('[data-lead-form][data-location=calculator]');
    await form.getByRole('button', { name: 'Získat srovnání zdarma' }).click();
    const email = form.locator('input[name=email]');
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(form.locator('[data-err-for=email]')).toBeVisible();
    await expect(email).toBeFocused();
    expect(leadApi.payloads).toHaveLength(0);
    expect(await events(page)).toContainEqual(['form_error', expect.objectContaining({ reason: 'validation', fields: 'email' })]);

    await email.fill('jana@example.cz');
    await expect(form.locator('[data-err-for=email]')).toBeHidden();
    await form.locator('input[name=phone]').fill('12ab');
    await form.getByRole('button', { name: 'Získat srovnání zdarma' }).click();
    await expect(form.locator('[data-err-for=phone]')).toBeVisible();
    expect(leadApi.payloads).toHaveLength(0);
  });

  test('both consents are separate, never pre-ticked, and the honeypot is hidden', async ({ page }) => {
    await page.goto('/');
    for (const form of await page.locator('[data-lead-form]').all()) {
      await expect(form.locator('input[name=marketing_consent]')).toHaveCount(1);
      await expect(form.locator('input[name=phone_consent]')).toHaveCount(1);
    }
    for (const box of await page.locator('input[name=marketing_consent], input[name=phone_consent]').all()) await expect(box).not.toBeChecked();
    await expect(page.getByText('Firma', { exact: true })).toHaveCount(0);
    // D35: the phone field says why we ask, and is linked to that text for screen readers
    const phone = page.locator('#lf-calculator-phone');
    await expect(phone).toHaveAttribute('aria-describedby', /lf-calculator-phone-why/);
    await expect(page.locator('#lf-calculator-phone-why')).toContainText('zavoláme jen, když níže zaškrtnete souhlas');
    for (const hp of await page.locator('input[name=website]').all()) {
      await expect(hp).toHaveAttribute('tabindex', '-1');
      expect(await hp.isVisible() && (await hp.boundingBox())!.x >= 0).toBe(false);
    }
  });

  test('sends the e-mail, amounts and UTM, then shows the full comparison', async ({ page, leadApi, consoleErrors }) => {
    await page.goto(AD_B);
    await page.locator('#c-once').fill('200000');
    const form = page.locator('[data-lead-form][data-location=calculator]');
    await form.locator('input[name=email]').fill('jana@example.cz');
    await form.locator('input[name=full_name]').fill('Jana Nováková');
    await form.getByRole('button', { name: 'Získat srovnání zdarma' }).click();
    await page.waitForURL('**/dekujeme');

    expect(leadApi.payloads).toHaveLength(1);
    expect(leadApi.payloads[0]).toMatchObject({
      email: 'jana@example.cz',
      full_name: 'Jana Nováková',
      phone: null,
      marketing_consent: false,
      phone_consent: false,
      consent_version: 'v3-2026-10-11',
      form_location: 'calculator',
      website: '',
      calc: { onceCzk: 200000, monthlyCzk: 3000, years: 20 },
      utm: { utm_source: 'meta', utm_medium: 'paid_social', utm_content: 'b' },
    });

    // the lead and its form_submit event share one random reference (analytics_id = lead_ref)
    const ref = leadApi.payloads[0].analytics_id as string;
    expect(ref).toMatch(/^[0-9a-f-]{36}$/);
    expect(await events(page)).toContainEqual(['form_submit', expect.objectContaining({ lead_ref: ref })]);

    // the tab keeps only the first name, the reference and two flags for the consent offer (D38) – never the e-mail or a number
    const kept = JSON.parse((await page.evaluate(() => sessionStorage.getItem('fg:lead')))!);
    expect(kept).toEqual({ firstName: 'Jana', leadRef: ref, consentFlow: 'form', hasPhone: false });

    await expect(page.locator('[data-hello]')).toHaveText(/Děkujeme, Jana/);
    await expect(page.locator('[data-report] tr')).toHaveCount(12);
    await expect(page.locator('[data-bars] li')).toHaveCount(5);
    await expect(page.locator('[data-hist] div')).toHaveCount(3);
    await expect(page.locator('[data-amount]')).toHaveText(/200\s000\sKč/);
    await expect.poll(() => eventNames(page)).toContain('thank_you_view');

    // back on the landing page the detail is unlocked (same tab)
    await page.goto('/');
    await expect(page.locator('.gate.is-locked')).toHaveCount(0);
    expect(consoleErrors).toEqual([]);
  });

  test('a server error keeps the visitor on the page with a clear message', async ({ page, leadApi }) => {
    leadApi.status = 500;
    await page.goto('/');
    const form = page.locator('[data-lead-form][data-location=footer]');
    await form.locator('input[name=email]').fill('jana@example.cz');
    const button = form.getByRole('button', { name: 'Získat srovnání zdarma' });
    await button.click();
    await expect(form.locator('[data-status]')).toHaveText(/nepovedlo/);
    await expect(button).toBeEnabled();
    expect(page.url()).not.toContain('/dekujeme');
    expect(await events(page)).toContainEqual(['form_error', expect.objectContaining({ reason: 'server' })]);
  });

  test('the 4th request for one address within a day explains the comparison is already sent', async ({ page, leadApi }) => {
    leadApi.status = 429;
    await page.goto('/');
    const form = page.locator('[data-lead-form][data-location=footer]');
    await form.locator('input[name=email]').fill('jana@example.cz');
    await form.getByRole('button', { name: 'Získat srovnání zdarma' }).click();
    await expect(form.locator('[data-status]')).toHaveText(/už poslali/);
    expect(page.url()).not.toContain('/dekujeme');
    expect(await events(page)).toContainEqual(['form_error', expect.objectContaining({ reason: 'rate_limited' })]);
  });

  test('a double click sends the form only once', async ({ page, leadApi }) => {
    await page.goto('/');
    const form = page.locator('[data-lead-form][data-location=footer]');
    await form.locator('input[name=email]').fill('jana@example.cz');
    await form.getByRole('button', { name: 'Získat srovnání zdarma' }).dblclick();
    await page.waitForURL('**/dekujeme');
    expect(leadApi.payloads).toHaveLength(1);
  });
});

test.describe('compare section', () => {
  test('the switcher shows one group at a time (regression of the hidden bug)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Celý svět' }).click();
    await expect(page.locator('[data-panel=world]')).toBeVisible();
    await expect(page.locator('[data-panel=sp500]')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Celý svět' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('the base page has 2 lead forms; the compare button leads to the calculator form (D35)', async ({ page }) => {
    await page.goto('/');
    await noSmoothScroll(page);
    await expect(page.locator('html')).toHaveAttribute('data-forms', '2');
    await expect(page.locator('.forms3-only')).toBeHidden();
    const visibleForms = page.locator('[data-lead-form]:visible');
    await expect(visibleForms).toHaveCount(2);
    await page.getByRole('link', { name: 'Poslat srovnání e-mailem' }).click();
    await expect(page.locator('#lf-calculator-email')).toBeFocused();
    expect(await events(page)).toContainEqual(['cta_click', expect.objectContaining({ cta: 'compare_send' })]);
  });

  test('variant ?forms=3: the compare form opens and gets the cursor, and stays on in this tab', async ({ page }) => {
    await page.goto('/?forms=3');
    await noSmoothScroll(page);
    await expect(page.locator('html')).toHaveAttribute('data-forms', '3');
    await expect(page.locator('.forms2-only')).toBeHidden();
    await page.locator('[data-open-compare-form]').click();
    await expect(page.locator('#compare-form')).toBeVisible();
    await expect(page.locator('#compare-form input[name=email]')).toBeFocused();
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-forms', '3');
    await expect(page.locator('[data-open-compare-form]')).toBeVisible(); // the third form is there again, collapsed behind its button
  });
});

test.describe('content (D31)', () => {
  test('sections in the agreed order, KID and taxes merged into one', async ({ page }) => {
    await page.goto('/');
    const ids = await page.locator('main > section').evaluateAll((els) => els.map((e) => e.id));
    expect(ids).toEqual(['kalkulacka', 'srovnani', 'dobre-vedet', 'co-posleme', 'zaver']);
  });

  test('who is behind it: no broker, nobody pays, link to the sources', async ({ page }) => {
    await page.goto('/');
    const who = page.locator('#kdo-za-tim-stoji');
    await expect(who).toContainText('není broker ani investiční poradce');
    await expect(who).toContainText('nikdo neplatí');
    await expect(who).toContainText('zdroje dat (staženo');
    await expect(who.locator('a[href="/zdroje"]')).toBeVisible();
  });

  test('US dividends moved to the FAQ with their source', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Jak se daní dividendy z amerických ETF?').click();
    await expect(page.getByText(/nejvýše 15 %, pokud má broker váš formulář W-8BEN/)).toBeVisible();
    await expect(page.locator('#zaver a[href="/zdroje#dane"]')).toBeVisible();
  });

  test('“Co vám pošleme” promises exactly what the e-mail contains', async ({ page }) => {
    await page.goto('/');
    const list = page.locator('#co-posleme .list');
    await expect(list).toContainText('4 scénáře vývoje investice');
    await expect(list).toContainText('PDF v příloze');
  });
});

test.describe('measurement (D11, D24)', () => {
  test('scroll_50 and the hero cta_click are recorded once', async ({ page }) => {
    await page.goto(AD_B);
    await noSmoothScroll(page);
    await page.locator('.hero-cta').click();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.6));
    await expect.poll(() => eventNames(page)).toContain('scroll_50');
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const names = await eventNames(page);
    expect(names.filter((n) => n === 'scroll_50')).toHaveLength(1);
    expect(await events(page)).toContainEqual(['cta_click', { cta: 'hero' }]);
  });

  test('local development never sends events to the production PostHog project', async ({ page, baseURL }) => {
    test.skip(!baseURL?.includes('localhost'), 'only meaningful against the dev server');
    const calls: string[] = [];
    page.on('request', (r) => { if (/posthog\.com/.test(r.url())) calls.push(r.url()); });
    await page.goto('/');
    await page.locator('#c-once').fill('150000');
    await page.waitForTimeout(1500);
    expect(calls).toEqual([]);
    await expect.poll(() => eventNames(page)).toContain('tool_used'); // the funnel events still work locally
  });

  test('nothing is stored in cookies (cookieless, D24)', async ({ page, context }) => {
    await page.goto(AD_B);
    await page.locator('#c-once').fill('150000');
    expect(await context.cookies()).toEqual([]);
  });
});

test.describe('other pages', () => {
  test('privacy, sources and footer links work', async ({ page, request }) => {
    await page.goto('/');
    for (const href of ['/zasady', '/zdroje']) {
      await expect(page.locator(`footer a[href="${href}"]`)).toBeVisible();
      expect((await request.get(href)).status()).toBe(200);
    }
    await page.goto('/zdroje');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Zdroje dat');
    expect(await page.locator('main a[href^="https://"]').count()).toBeGreaterThan(12);
  });

  test('favicon and logo files are served', async ({ request }) => {
    for (const f of ['/favicon.svg', '/favicon.ico', '/apple-touch-icon.png', '/email-logo.png', '/fonts/NotoSans-Regular-latin.ttf']) {
      expect((await request.get(f)).status(), f).toBe(200);
    }
  });
});

test.describe('phone length (D35)', () => {
  test('at 390 px the page stays under 9 700 px, the calculator form starts in the first 2 400 px and nothing overflows', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobil', 'phone layout only');
    await page.setViewportSize({ width: 390, height: 844 });
    for (const exp of ['control', 'hero_input']) {
      await page.goto(`/?exp=${exp}`);
      await noHorizontalScroll(page);
      const { height, formTop } = await page.evaluate(() => ({
        height: document.documentElement.scrollHeight,
        formTop: document.querySelector('#lf-calculator-h')!.getBoundingClientRect().top + scrollY,
      }));
      expect(height).toBeLessThan(9700); // 9 569 px after QA 12. 10. (consents above the button)
      expect(formTop).toBeLessThan(2400);
    }
  });
});

test.describe('share preview (D36)', () => {
  test('Open Graph image is declared with its size and served as a 1200 × 630 PNG', async ({ page, request }) => {
    await page.goto('/');
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(og).toBe('https://fingramo.vercel.app/og.png');
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    const res = await request.get('/og.png');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('image/png');
    const buf = await res.body();
    expect(buf.readUInt32BE(16)).toBe(1200); // PNG header: width
    expect(buf.readUInt32BE(20)).toBe(630); // height
    expect(buf.length).toBeLessThan(300_000); // WhatsApp shows previews up to ~300 kB
  });
});

test.describe('QA 12. 10. fixes', () => {
  test('“Chci srovnání” goes straight into the e-mail of the last form', async ({ page }) => {
    await page.goto('/');
    await noSmoothScroll(page);
    await page.getByRole('link', { name: 'Chci srovnání' }).click();
    await expect(page.locator('#lf-footer-email')).toBeFocused();
    await expect(page.locator('#lf-footer-email')).toBeInViewport();
  });

  test('with no amount the calculator asks for one instead of “od 0 Kč (SPY, IVV, …)”', async ({ page }) => {
    await page.goto('/');
    await page.locator('#c-once').fill('');
    await page.locator('#c-monthly').fill('');
    await expect(page.locator('[data-summary-empty]')).toBeVisible();
    await expect(page.locator('[data-summary]')).toBeHidden();
    await expect(page.locator('[data-diff]')).toBeHidden();
    await page.locator('#c-monthly').fill('1000');
    await expect(page.locator('[data-summary-empty]')).toBeHidden();
    await expect(page.locator('[data-summary]')).toBeVisible();
  });

  test('amounts are capped like the API (100 mil. once, 10 mil. a month), so the e-mail has the page’s numbers', async ({ page }) => {
    await page.goto('/');
    await page.locator('#c-once').fill('999999999');
    await expect(page.locator('#c-once')).toHaveValue(/^100\s000\s000$/);
    await page.locator('#c-monthly').fill('99999999');
    await expect(page.locator('#c-monthly')).toHaveValue(/^10\s000\s000$/);
  });

  test('both consents come before the submit button', async ({ page }) => {
    await page.goto('/');
    for (const form of await page.locator('[data-lead-form]').all()) {
      const order = await form.evaluate((f) => {
        const button = f.querySelector('button[type=submit]')!;
        return [...f.querySelectorAll('input[type=checkbox]')].map((c) => Boolean(c.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING));
      });
      expect(order).toEqual([true, true]);
    }
  });

  test('the FAQ and the privacy notice no longer promise an unsubscribe link that does not exist', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#zaver')).not.toContainText('jedním klikem');
    await page.goto('/zasady');
    await expect(page.locator('main')).not.toContainText('odkazem v každé zprávě');
  });

  test('an unknown address shows our own 404 page with a way back', async ({ page }) => {
    const res = await page.goto('/tahle-stranka-neni');
    expect(res!.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tahle stránka neexistuje');
    await expect(page.getByRole('link', { name: 'Spočítat moje poplatky' })).toHaveAttribute('href', '/#kalkulacka');
  });
});

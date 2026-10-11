// PostHog EU, cookieless (D11, D24): nothing is stored in cookies or browser storage; the server links
// the visitor's events within a day by a daily-rotated hash, so the funnel works across / and /dekujeme.
// Loaded as a separate async chunk so it never delays the first paint for visitors from ads.
import { readUtm } from './track';

const KEY = import.meta.env.PUBLIC_POSTHOG_KEY as string | undefined;
const HOST = (import.meta.env.PUBLIC_POSTHOG_HOST as string | undefined) ?? 'https://eu.i.posthog.com';

type Props = Record<string, string | number | boolean | null | undefined>;

const init = async (): Promise<void> => {
  // Local development and test runs must not reach the production project: events only go to the console
  if (!KEY || import.meta.env.DEV) {
    window.__fgCapture = (event: string, props: Props) => console.debug('[analytics]', event, props);
    for (const [event, props] of window.__fgQueue ?? []) window.__fgCapture(event, props);
    window.__fgQueue = [];
    return;
  }
  const { default: posthog } = await import('posthog-js');

  posthog.init(KEY, {
    api_host: HOST,
    defaults: '2026-05-30',
    cookieless_mode: 'always', // requires "Cookieless server hash mode" in the project (set to stateful)
    autocapture: false, // only the explicit funnel events below – clean data, less script work on phones
    capture_pageview: true, // $pageview carries utm_* from the URL automatically
    capture_pageleave: true,
    person_profiles: 'identified_only',
    // D33: no session recordings (they record behaviour without consent); aggregated click heatmaps stay on
    disable_session_recording: true,
    capture_heatmaps: true,
  });

  // Ad variant on every event of this page, so each funnel step can be split by ad A / B
  const utm = readUtm();
  // D28: the first-screen test variant, also on /dekujeme (read from this tab's memory there)
  let exp = document.documentElement.dataset.expHero;
  if (!exp) {
    try { exp = sessionStorage.getItem('fg:exp_hero_calc') ?? undefined; } catch { /* storage blocked */ }
  }
  posthog.register({ ad_variant: utm.utm_content ?? 'none', exp_hero_calc: exp ?? 'none', ...utm });

  window.__fgCapture = (event: string, props: Props) => {
    // sendBeacon survives the redirect to /dekujeme right after form_submit
    posthog.capture(event, props, { transport: 'sendBeacon' });
  };
  for (const [event, props] of window.__fgQueue ?? []) window.__fgCapture(event, props);
  window.__fgQueue = [];
};

// cta_click for any element with data-track="cta_click" data-cta="<where>"
const wireCtaClicks = (): void => {
  document.addEventListener('click', (e) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]');
    if (!el?.dataset.track) return;
    window.__fgCapture
      ? window.__fgCapture(el.dataset.track, { cta: el.dataset.cta ?? null })
      : (window.__fgQueue ??= []).push([el.dataset.track, { cta: el.dataset.cta ?? null }]);
  });
};

// scroll_50: once per page, when half of the page has been seen
const wireScroll50 = (): void => {
  let sent = false;
  const check = () => {
    if (sent) return;
    const seen = window.scrollY + window.innerHeight;
    if (seen >= document.documentElement.scrollHeight * 0.5) {
      sent = true;
      window.removeEventListener('scroll', check);
      window.__fgCapture ? window.__fgCapture('scroll_50', {}) : (window.__fgQueue ??= []).push(['scroll_50', {}]);
    }
  };
  window.addEventListener('scroll', check, { passive: true });
};

wireCtaClicks();
wireScroll50();
void init();

// Funnel events (CLAUDE.md §8). Components call track(); Fáze 4 wires the queue to PostHog.
// Events: page_view, scroll_50, cta_click, tool_used, form_start, form_submit, form_error, thank_you_view.

type Props = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    __fgQueue?: Array<[string, Props]>;
    __fgCapture?: (event: string, props: Props) => void;
  }
}

export const track = (event: string, props: Props = {}): void => {
  if (typeof window === 'undefined') return;
  if (window.__fgCapture) {
    window.__fgCapture(event, props);
    return;
  }
  (window.__fgQueue ??= []).push([event, props]);
};

// UTM parameters are kept for the session so a lead can be attributed to ad A or B.
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;
export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export const rememberUtm = (): void => {
  try {
    const params = new URLSearchParams(location.search);
    const utm: Utm = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) utm[key] = value.slice(0, 100);
    }
    if (Object.keys(utm).length) sessionStorage.setItem('fg:utm', JSON.stringify(utm));
  } catch {
    /* storage unavailable – attribution falls back to PostHog's own UTM capture */
  }
};

export const readUtm = (): Utm => {
  try {
    return JSON.parse(sessionStorage.getItem('fg:utm') ?? '{}') as Utm;
  } catch {
    return {};
  }
};

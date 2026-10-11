// Funnel events (CLAUDE.md §8). Components call track(); src/lib/analytics.ts forwards them to PostHog.
// Events: $pageview (automatic, with UTM), scroll_50, cta_click, tool_used, form_start, form_submit, form_error, thank_you_view.

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
  // PostHog loads asynchronously; events before that are queued and flushed on init
  (window.__fgQueue ??= []).push([event, props]);
};

// UTM parameters come straight from the current URL (in-page anchors keep the query string).
// Nothing is stored in the browser – the lead row gets them from the page the form was sent from.
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;
export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export const readUtm = (): Utm => {
  const utm: Utm = {};
  try {
    const params = new URLSearchParams(location.search);
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) utm[key] = value.slice(0, 100);
    }
  } catch {
    /* no URL access – no attribution */
  }
  return utm;
};

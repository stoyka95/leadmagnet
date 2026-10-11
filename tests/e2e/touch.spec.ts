// D35: every control on a phone has a touch target of at least 44 × 44 px (inputs, checkboxes, source links).
import { test, expect } from './fixtures';

const PAGES = ['/?exp=control', '/?exp=hero_input', '/?forms=3', '/zdroje', '/zasady', '/dekujeme'];

test.describe('touch targets ≥ 44 px on a phone (D35)', () => {
  for (const path of PAGES) {
    test(`${path}`, async ({ page }, info) => {
      test.skip(info.project.name !== 'mobil', 'phone layout only');
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(path);
      for (const d of await page.locator('details').all()) await d.evaluate((el) => ((el as HTMLDetailsElement).open = true));
      await page.addStyleTag({ content: 'html, body { scroll-behavior: auto !important; } astro-dev-toolbar { display: none !important; }' });
      const small = await page.evaluate(async () => {
        const bad: string[] = [];
        const name = (el: Element) => `${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 40) || el.getAttribute('name') || el.getAttribute('type')}"`;
        const visible = (el: HTMLElement) => {
          const b = el.getBoundingClientRect();
          return b.width > 0 && b.height > 0 && getComputedStyle(el).visibility !== 'hidden' && !el.closest('[aria-hidden=true], [inert]');
        };
        // controls: their own box (a checkbox counts with its label row)
        for (const el of document.querySelectorAll<HTMLElement>('button, input:not([type=hidden]), select, textarea, summary, a.btn, a.logo')) {
          if (!visible(el)) continue;
          const box = (el.matches('input[type=checkbox], input[type=radio]') ? el.closest('label') ?? el : el).getBoundingClientRect();
          if (box.height < 44 || box.width < 44) bad.push(`${name(el)} ${Math.round(box.width)}×${Math.round(box.height)}`);
        }
        // links in running text: a tap 21 px from the centre in each direction still hits the link
        for (const a of document.querySelectorAll<HTMLAnchorElement>('a:not(.btn):not(.logo)')) {
          if (!visible(a) || a.closest('details:not([open])')) continue; // a closed FAQ answer: tested once opened
          a.scrollIntoView({ block: 'center', behavior: 'instant' });
          // a link wrapped over two lines: above its first line, below its last line
          const rects = a.getClientRects();
          const f = rects[0], l = rects[rects.length - 1];
          const fx = f.left + f.width / 2, fy = f.top + f.height / 2, lx = l.left + l.width / 2, ly = l.top + l.height / 2;
          const reach = Math.max(0, 22 - f.width / 2);
          const cx = fx, cy = fy;
          for (const [x, y] of [[fx, fy - 21], [lx, ly + 21], [fx - reach, fy], [fx + reach, fy]]) {
            const hit = document.elementFromPoint(Math.min(Math.max(x, 1), innerWidth - 1), y);
            if (!hit || !(hit === a || a.contains(hit))) { bad.push(`${name(a)} at ${Math.round(x - cx)},${Math.round(y - cy)} hits ${hit?.tagName.toLowerCase()}.${hit?.className}`); break; }
          }
        }
        return bad;
      });
      expect(small).toEqual([]);
    });
  }
});

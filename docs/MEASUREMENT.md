# Měření – Fingramo

Podklad pro README §8. Rozhodnutí: D11 (PostHog EU + Vercel Analytics), D24 (bez cookies), D33 (záznamy relací vypnuté v kódu, heatmapy zapnuté).

## Nástroje
| Nástroj | Co měří | Kde jsou čísla |
|---|---|---|
| **PostHog EU** (Frankfurt), projekt 301598 | celá cesta návštěvníka po jednotlivých událostech, trychtýř, rozpad A/B, souhrnné heatmapy kliknutí (záznamy relací vypnuté, D33) | Dashboard **„Fingramo – trychtýř leadů"**: https://eu.posthog.com/project/301598/dashboard/1014275 |
| **Vercel Web Analytics** | návštěvy, zdroje, země; kontrola počtu návštěv z PostHogu | Vercel → projekt `fingramo` → Analytics |
| **Supabase** `leads` | skutečně uložené kontakty včetně `utm_*` a `form_location` (kontrola, že `form_submit` = řádek v DB) | Supabase → `fingramo-leads` → Table editor |

## Bez cookies
- `posthog-js` běží s `cookieless_mode: 'always'` a projekt má zapnutý *Cookieless server hash mode* (stateful).
- Do prohlížeče se **nic neukládá** (ověřeno: `document.cookie` je prázdné, `localStorage` prázdné). PostHog spojuje události jednoho návštěvníka na serveru podle denně měněného hashe. Trychtýř proto funguje i přes přechod `/` → `/dekujeme` (ověřeno: stejné `distinct_id` u všech 8 kroků).
- IP adresy se anonymizují (`anonymize_ips: true`).
- **Omezení:** stejný člověk další den = nový návštěvník. U reklamy, kde se rozhoduje během minut, to nevadí, jen se tím nadhodnocuje počet unikátních návštěvníků v delším období.
- Jediné úložiště, které stránka používá, je `sessionStorage` `fg:calc`, tedy zadání kalkulačky pro děkovací stránku (funkční, nutné pro službu, o kterou návštěvník požádal).

## Události (trychtýř)
| # | Událost | Kdy | Vlastnosti |
|---|---|---|---|
| 1 | `$pageview` | načtení stránky (automaticky) | `utm_source/medium/campaign/content`, `ad_variant` |
| 2 | `scroll_50` | návštěvník viděl polovinu stránky (jednou) | – |
| 3 | `cta_click` | klik na tlačítko s `data-track` (hero, lepivé CTA, „Chci srovnání", otevření formuláře u srovnání, uložit PDF, tlačítka „Odemknout" na rozmazaném detailu: `gate_fees`, `gate_growth`, `gate_history`, D25) | `cta` |
| 4 | `tool_used` | změna v kalkulačce (0,8 s po posledním vstupu) nebo přepnutí skupiny ve srovnání | `tool` = `calculator` / `compare`, zadané hodnoty |
| 5 | `form_start` | první fokus do formuláře | `form_location` |
| 6 | `form_submit` | **server potvrdil uložení** (HTTP 200 z `/api/lead`) | `form_location`, `marketing_consent`, `has_name`, `has_phone`, `used_calculator` |
| — | `form_error` | chyba validace nebo serveru | `reason`, `fields` |
| 7 | `thank_you_view` | zobrazení `/dekujeme` | `used_calculator` |

- **Každá událost** nese `ad_variant` (= `utm_content`: `a` / `b` / `none`) a `utm_*`. Díky tomu jde každý krok rozdělit podle reklamy.
- `form_submit` a události těsně před přesměrováním se posílají přes `sendBeacon`, takže se neztratí při odchodu ze stránky.

## Definice konverze
**Konverze = `form_submit` potvrzený serverem ÷ unikátní návštěvníci s `$pageview`**, v rozpadu podle `ad_variant`. Kliknutí na tlačítko, které skončí chybou, se nepočítá (D: Rozhodnuto Claudem).

## Uložené pohledy v PostHogu
1. **Trychtýř: příchod → formulář (A vs. B)**: `$pageview` → `tool_used` (volitelný krok) → `form_start` → `form_submit` → `thank_you_view`, okno 1 den, rozpad `ad_variant` (first touch).
2. **Návštěvníci a leady po dnech (A vs. B)**: liniový graf.
3. **Odeslané formuláře podle místa**: `calculator` / `compare` / `footer` (odpovídá na D22).

## Ověření (11. 10. 2026)
- Lokálně i na produkci: průchod s `utm_content=a` a `b`. V PostHogu dorazilo všech 8 kroků se stejným `distinct_id`. Lead v Supabase má správné `utm_*`. E-mail má v Resendu stav `delivered`.
- **Testovací data** (`utm_source=test`, jména „Test …") se před spuštěním reklamy smažou z `leads`. V PostHogu se dashboard filtruje od data spuštění.

## Kódy
- `src/lib/analytics.ts`: inicializace PostHogu, `cta_click`, `scroll_50`, fronta událostí
- `src/lib/track.ts`: `track()` volané z komponent, `readUtm()` z URL
- UTM odkazy reklam: `ads/README.md`

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
| 3 | `cta_click` | klik na tlačítko s `data-track` (hero, horní lišta: `header_calc` ke kalkulačce / `header` k formuláři (D30), „Chci srovnání", otevření formuláře u srovnání, uložit PDF, tlačítka „Odemknout" na rozmazaném detailu: `gate_fees`, `gate_growth`, `gate_history`, D25) | `cta` |
| 4 | `tool_used` | změna v kalkulačce (0,8 s po posledním vstupu) nebo přepnutí skupiny ve srovnání | `tool` = `calculator` / `compare`, zadané hodnoty |
| 5 | `form_start` | první fokus do formuláře | `form_location` |
| 6 | `form_submit` | **server potvrdil uložení** (HTTP 200 z `/api/lead`) | `form_location`, `lead_ref` (= `analytics_id` v tabulce `leads`), `marketing_consent`, `phone_consent`, `has_name`, `has_phone`, `used_calculator` |
| — | `form_error` | chyba validace, serveru nebo limitu (`rate_limited`) | `reason`, `fields` |
| — | `lead_segment` | odpověď na dobrovolnou otázku „Už investujete?" na `/dekujeme` (D32) | `answer` = `yes` / `starting` / `not_yet`, `lead_ref` |
| — | `share_click` | sdílení odkazu z `/dekujeme` (D32); sdílený odkaz nese `utm_source=share` | `method` = `native` / `whatsapp` / `copy` |
| — | `hero_calc_submit` | varianta testu `hero_input`: odeslání částky z 1. obrazovky (D28) | `monthly_czk` |
| 7 | `thank_you_view` | zobrazení `/dekujeme` | `used_calculator` |

- **Každá událost** nese `ad_variant` (= `utm_content`: `a` / `b` / `none`), `utm_*` a **`exp_hero_calc`** (`control` / `hero_input`, živý A/B test D28). Díky tomu jde každý krok rozdělit podle reklamy i podle varianty testu.
- **Lead ↔ cesta v PostHogu:** `leads.analytics_id` = `lead_ref` v události `form_submit` (náhodné UUID pro každé odeslání).
- `form_submit` a události těsně před přesměrováním se posílají přes `sendBeacon`, takže se neztratí při odchodu ze stránky.

## Definice konverze
**Konverze = `form_submit` potvrzený serverem ÷ unikátní návštěvníci s `$pageview`**, v rozpadu podle `ad_variant`. Kliknutí na tlačítko, které skončí chybou, se nepočítá (D: Rozhodnuto Claudem).

## Uložené pohledy v PostHogu
1. **Trychtýř: příchod → formulář (A vs. B)**: `$pageview` → `tool_used` (volitelný krok) → `form_start` → `form_submit` → `thank_you_view`, okno 1 den, rozpad `ad_variant` (first touch).
2. **Návštěvníci a leady po dnech (A vs. B)**: liniový graf.
3. **Odeslané formuláře podle místa**: `calculator` / `compare` / `footer` (odpovídá na D22).

## A/B test na stránce: H2, kalkulačka na 1. obrazovce (D28)
- **Hypotéza:** když návštěvník z reklamy zadá částku hned na první obrazovce, dostane se k výsledku rychleji a víc lidí odešle formulář.
- **Varianty:** `control` (tlačítko „Spočítat moje poplatky") vs. `hero_input` (pole „Kolik chcete investovat měsíčně?" + „Spočítat"). Rozdělení 50/50 náhodně, jen v rámci záložky. Vlastnost `exp_hero_calc` je u všech událostí.
- **Primární metrika:** podíl návštěvníků, kteří odeslali formulář (`form_submit` / unikátní návštěvníci s `$pageview`).
- **Sekundární:** `tool_used` (použil kalkulačku), `form_start`.
- **Kontrolní metrika:** podíl `hero_calc_submit` ve variantě `hero_input` (používá se pole vůbec?).
- **Insight:** [A/B test H2](https://eu.posthog.com/project/301598/insights/HSttab8L) na dashboardu, trychtýř rozdělený podle `exp_hero_calc`.
- **Kolik návštěv je potřeba** (dvoustranný test, α = 0,05, síla 80 %):

| Výchozí konverze | Chceme poznat zlepšení o | Návštěv na variantu | Celkem |
|---|---|---|---|
| 4 % | 20 % (4,0 → 4,8 %) | 10 317 | ~20 600 |
| 6 % | 20 % (6,0 → 7,2 %) | 6 719 | ~13 400 |
| 6 % | 30 % (6,0 → 7,8 %) | 3 112 | ~6 200 |

  Při rozpočtu na pár tisíc návštěv test spolehlivě ukáže jen velký rozdíl (≥ 30 %). Proto ho necháme běžet do dosažení počtu a nevyhodnocujeme průběžně.
- **Současně běží test reklamy** (A/B podle `utm_content`). Rozdělení na stránce je na reklamě nezávislé, takže vzniknou 4 kombinace a oba testy jdou vyhodnotit zvlášť.

## Čistá data
- **Všechny insighty filtrují** `$host = fingramo.vercel.app` a vynechávají `utm_source` = `test` / `lighthouse`.
- **Lokální vývoj a testy do PostHogu nic neposílají:** při `astro dev` se PostHog nespustí a události jdou jen do konzole. Dřív se posílaly, viz AI-WORK-NOTES.
- E2E testy navíc požadavky na analytiku blokují.

## Ověření (11. 10. 2026)
- Lokálně i na produkci: průchod s `utm_content=a` a `b`. V PostHogu dorazilo všech 8 kroků se stejným `distinct_id`. Lead v Supabase má správné `utm_*`. E-mail má v Resendu stav `delivered`.
- **Testovací data** (`utm_source=test`, jména „Test …") se před spuštěním reklamy smažou z `leads`. V PostHogu se dashboard filtruje od data spuštění.

## Kódy
- `src/lib/analytics.ts`: inicializace PostHogu, `cta_click`, `scroll_50`, fronta událostí
- `src/lib/track.ts`: `track()` volané z komponent, `readUtm()` z URL
- UTM odkazy reklam: `ads/README.md`

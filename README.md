# Fingramo – srovnání ETF z NYSE pro české investory

> **Rozpracováno.** README se doplní ve Fázi 6 o všechny povinné sekce (CLAUDE.md §5). Zatím je tu jen měření.
> Stránka: https://fingramo.vercel.app

## Měření

Podrobnosti (všechny události a jejich vlastnosti, velikost vzorku pro A/B test, čistota dat) jsou v [docs/MEASUREMENT.md](docs/MEASUREMENT.md).

### Dashboard
Vše je na jednom dashboardu v PostHogu (EU): **[Fingramo – trychtýř leadů](https://eu.posthog.com/project/301598/dashboard/1014275)**.

| Insight | Co ukazuje |
|---|---|
| [Cena za lead podle reklamy (A vs. B)](https://eu.posthog.com/project/301598/insights/AxnLTldl) | návštěvníci, leady, konverze a **cena za lead** pro reklamu A a B |
| [Trychtýř: příchod → formulář (A vs. B)](https://eu.posthog.com/project/301598/insights/HsVwLr3I) | `$pageview` → `tool_used` → `form_start` → `form_submit` → `thank_you_view`, **rozdělený podle varianty reklamy** (`ad_variant` = `utm_content`) |
| [Návštěvníci a leady po dnech (A vs. B)](https://eu.posthog.com/project/301598/insights/pcM5bDLp) | vývoj v čase podle reklamy |
| [Odeslané formuláře podle místa](https://eu.posthog.com/project/301598/insights/XwkFhyu5) | který formulář na stránce funguje (u kalkulačky / na konci / u srovnání ve variantě se 3 formuláři) |
| [A/B test H2](https://eu.posthog.com/project/301598/insights/HSttab8L) | trychtýř rozdělený podle varianty živého testu první obrazovky (`exp_hero_calc`) |

**Cena za lead** = útrata za reklamu ÷ počet leadů z té reklamy. PostHog útratu nezná, ta je v reklamním účtu (Meta Ads Manager). Proto je v dotazu insightu u varianty A i B útrata zatím prázdná (`NULL`) a cena se nepočítá. Až kampaň poběží, doplní se útrata v Kč z reklamního účtu a cena za lead se dopočítá sama. Nic se neodhaduje.

Všechny insighty počítají jen produkční doménu `fingramo.vercel.app` a vynechávají testovací provoz (`utm_source` = `test` / `lighthouse`). Lokální vývoj do PostHogu nic neposílá.

### Co je zapnuté
- **UTM měření:** reklamy nesou `utm_source`, `utm_medium`, `utm_campaign` a `utm_content` (`a` / `b` = verze reklamy). Každá událost má vlastnost `ad_variant`, takže jde každý krok rozdělit podle reklamy. UTM se ukládají i ke kontaktu v databázi (Supabase, tabulka `leads`), takže jde lead spárovat s reklamou i bez PostHogu.
- **Heatmapy kliknutí:** zapnuté (`capture_heatmaps` v kódu, zapnuté i v nastavení projektu). Ukazují souhrnně, kam lidé klikají, ne jednotlivé návštěvníky.
- **Bez cookies:** PostHog běží v režimu bez cookies (`cookieless_mode: 'always'`), návštěvníky spojuje na serveru podle denně měněného hashe.

### Co je záměrně vypnuté
- **Záznamy relací (session recordings) jsou záměrně vypnuté.** Zaznamenávají chování konkrétního člověka na stránce, a to by bez souhlasu (cookie lišty) nebylo v pořádku. Vypnuté jsou přímo v kódu (`disable_session_recording: true`), takže se nenahrávají, ani když je funkce v nastavení PostHog projektu povolená. Pro ostré nasazení: zapnout je jen po souhlasu návštěvníka.
- **Autocapture** (automatické zachytávání všech kliknutí) je v kódu vypnutý. Posílají se jen pojmenované události trychtýře, takže data jsou čistší a na mobilu běží méně JavaScriptu.

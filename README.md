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
- **Bez cookies:** PostHog běží v režimu bez cookies (`cookieless_mode: 'always'`), návštěvníky spojuje na serveru podle denně měněného hashe. IP adresy se neukládají (nastavení projektu, ověřeno v datech: žádná událost nemá IP ani polohu).

### Co je záměrně vypnuté
- **Záznamy relací (session recordings) jsou záměrně vypnuté.** Zaznamenávají chování konkrétního člověka na stránce, a to by bez souhlasu (cookie lišty) nebylo v pořádku. Vypnuté jsou přímo v kódu (`disable_session_recording: true`), takže se nenahrávají, ani když je funkce v nastavení PostHog projektu povolená. Pro ostré nasazení: zapnout je jen po souhlasu návštěvníka.
- **Autocapture** (automatické zachytávání všech kliknutí) je v kódu vypnutý. Posílají se jen pojmenované události trychtýře, takže data jsou čistší a na mobilu běží méně JavaScriptu.

## Tři hypotézy pro A/B test

Seřazené podle očekávaného dopadu na počet kontaktů (D28). Odhad dopadu je **úvaha, ne naměřené číslo**: stránka zatím nemá provoz z reklamy, takže skutečnou velikost efektu ukáže až test. Co test dokáže spolehlivě rozlišit, je spočítané níže.

### H1 – Jak moc schovat výsledek za e-mail (brána) · očekávaný dopad: největší
- **Hypotéza:** částečná brána (hlavní výsledek vidět, detail rozmazaný) přinese víc kontaktů než výsledek bez rozmazání, a přitom nesníží důvěru ani používání kalkulačky.
- **Co se změní:** kontrola = dnešní stav (D25): vidět je vložená částka, poplatky nejlevnějšího a nejdražšího fondu a rozdíl SPY vs. VOO v Kč. Rozmazané jsou řádky všech 12 fondů, scénáře z KID a historie S&P 500. Varianta = nic rozmazané, formulář jen nabízí poslání do e-mailu a PDF.
- **Metrika úspěchu:** podíl návštěvníků, kteří odeslali formulář (`form_submit` ÷ unikátní návštěvníci). **Hlídací metriky:** `tool_used` (nepřestali lidé počítat?), `scroll_50`, kliknutí na tlačítka „Odemknout…" (`cta_click` s `gate_*`) a podíl kontaktů se souhlasem s dalšími e-maily. Když varianta s bránou přinese víc kontaktů, ale méně souhlasů, jsou kontakty méně kvalitní.
- **Proč největší dopad:** brána mění motivaci dát e-mail přesně ve chvíli, kdy návštěvník vidí výsledek, tedy u hlavního formuláře. Zároveň je to nejrizikovější změna: příliš velká brána jde proti zadání („hodnota má být zřejmá ještě před formulářem").
- **Stav:** popsáno, v kódu není. Přepínač by se přidal stejně jako u H2.

### H2 – Kalkulačka už na první obrazovce · očekávaný dopad: střední · **běží živě**
- **Hypotéza:** když návštěvník z reklamy zadá částku hned na první obrazovce, dostane se k výsledku rychleji a víc lidí odešle formulář.
- **Co se změní:** kontrola `control` = tlačítko „Spočítat moje poplatky". Varianta `hero_input` = pole „Kolik chcete investovat měsíčně?" a tlačítko „Spočítat", hodnota se přenese do kalkulačky. Rozdělení 50/50 náhodně, v rámci záložky (D28).
- **Metrika úspěchu:** `form_submit` ÷ unikátní návštěvníci podle `exp_hero_calc`. **Vedlejší:** `tool_used`, `form_start`. **Kontrolní:** jak často se pole v hero vůbec použije (`hero_calc_submit`).
- **Proč střední dopad:** zkracuje cestu k výsledku o jeden krok, ale motivace dát e-mail se nemění.
- **Kde je vidět:** [A/B test H2](https://eu.posthog.com/project/301598/insights/HSttab8L).

### H3 – Méně polí ve formuláři · očekávaný dopad: nejmenší
- **Hypotéza:** formulář jen s e-mailem (bez nepovinného jména a telefonu) odešle víc lidí, protože vypadá kratší, a přijdeme jen o málo údajů navíc.
- **Co se změní:** kontrola = e-mail (povinný) + jméno a telefon (nepovinné), dva samostatné souhlasy (D25, D35). Varianta = jen e-mail a souhlas s tipy e-mailem.
- **Metrika úspěchu:** `form_start` → `form_submit` (kolik rozepsaných formulářů se dokončí). **Hlídací:** kolik kontaktů má dnes jméno a telefon (`has_name`, `has_phone`). Když je skoro nikdo nevyplňuje, varianta nic neztrácí.
- **Proč nejmenší dopad:** nepovinná pole se dají přeskočit a povinné je už teď jen jedno, takže formulář je už teď krátký.
- **Stav:** popsáno, v kódu není.

### Kolik návštěv test potřebuje
Pro každou hypotézu stejně (dvoustranný test, α = 0,05, síla 80 %, výpočet v [docs/MEASUREMENT.md](docs/MEASUREMENT.md)): při výchozí konverzi 6 % je k odhalení zlepšení o 30 % potřeba asi **3 100 návštěv na variantu**, pro zlepšení o 20 % asi 6 700. Proto běží vždy jen jeden test naráz a vyhodnocuje se až po dosažení počtu, ne průběžně.

### Další kandidát: 2, nebo 3 formuláře
Základní verze má 2 formuláře (u kalkulačky a na konci). Varianta se třetím formulářem u srovnání fondů je připravená a zapne se odkazem `?forms=3`; vlastnost `forms_variant` je u všech událostí (D35). Hypotéza: třetí formulář zachytí lidi, kteří přišli kvůli srovnání a kalkulačku přeskočili, ale stránku prodlouží a může působit vtíravě. Metrika: `form_submit` celkem a podle `form_location`. Na řadu přijde po H2, aby se testy nemíchaly.

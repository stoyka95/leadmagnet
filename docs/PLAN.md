# Plán – Zadání B: konverzní landing page (ETF z NYSE pro české drobné investory)

**Termín:** pátek 16. 10. 2026 · **Cíl:** hotovo ve čtvrtek 15. 10. večer, v pátek jen kontrola a odeslání.
**Stav plánu:** SCHVÁLENO Mikym 11. 10. 2026 (bez změn).

Legenda: `[ ]` zbývá · `[x]` hotovo · `[~]` rozpracováno

---

## Fáze 0 – Příprava (ne 11. 10.)
- [x] Kontrola prostředí: Git 2.54, `git config` (stoyka95 / mykolastoyka@gmail.com), GitHub CLI přihlášený (účet `stoyka95`), Node 24 + npm 12
- [x] Vercel: připojený přes konektor (tým „stoyka95's projects"), Vercel CLI není nainstalovaný (není nutný – nasazení přes GitHub)
- [x] Supabase: přihlášené 2 účty (projekty fakturr, foodphore, wallana) – pro tento úkol zatím žádný projekt
- [x] PostHog: projekt 301598 (EU), rozhodnutí D11
- [x] Schválení tohoto plánu (11. 10.)
- [x] Rozhodnutí ze sekce 7 CLAUDE.md (po skupinách) → `docs/DECISIONS.md` (zbývá doplnit název domény, D15)
- [x] Založení veřejného repozitáře `stoyka95/leadmagnet`, struktura, `.gitignore`, `.env.example`
- [x] První commity: `CLAUDE.md`, `docs/PLAN.md`, `docs/DECISIONS.md`, `docs/AI-WORK-NOTES.md` → push

## Fáze 1 – Data a ověření faktů (ne 11. – po 12. 10.)
- [x] Výběr ETF podle schváleného kritéria
- [x] Stažení TER, velikosti fondu, burzy, data vzniku z factsheetů správců (+ URL, datum) → `data/etf.json`, `data/SOURCES.md`
- [x] Kurz USD/CZK z ČNB (+ datum)
- [~] Ověření dostupnosti US ETF pro české retailové investory (PRIIPs/KID) u konkrétních brokerů – se zdrojem; případně UCITS ekvivalenty
- [x] Ověření daňových informací – zatím bez oficiálního zdroje → neuvádět
- [x] Commit `data: ...` + push
- [x] TER UCITS proti KID správců (hlavně XD9U, VWCE) – 11. 10., vše sedí (SOURCES.md, „Druhá kontrola TER")
- [x] Stránka IBKR v prohlížeči – znovu 11. 10. odpoledne, obě tvrzení na webu sedí (KID u US ETF obvykle chybí, IBKR je retailu z EHP blokuje)

## Fáze 2 – Obsah: cílovka, texty, reklamy (po 12. 10.)
- [x] Persona a slib reklamy → struktura první obrazovky
- [x] Texty sekcí (česky, podle zvoleného tónu), CTA, mikrotexty formuláře
- [x] Dvě verze reklamy (`ads/`) – texty; vizuály ve Fázi 3 s UTM odkazy (`utm_content=a|b`)
- [~] Právní texty: upozornění na riziko, souhlas GDPR, zásady zpracování, údaj o správci
- [x] Commity `docs:`/`feat:` + push

## Fáze 3 – Stavba stránky (ne 11. – st 14. 10.)
- [x] Kostra Astro 7 + Vercel adaptér, nasazení na https://fingramo.vercel.app (ověřeno 200)
- [x] Vercel projekt `fingramo` (funkce ve fra1), veřejné env proměnné; tajné klíče doplní Miky
- [x] Supabase tabulka `leads` (RLS bez politik, zápis jen serverem)
- [x] `src/styles/tokens.css` + `BaseLayout` + `GlassCard` (vizuální základ D8)
- [x] Hero s nadpisem podle `utm_content` (D17)
- [x] `src/lib/fees.ts` + Kalkulačka (D16)
- [x] `LeadForm` (UI, validace, stavy) – použit 3×
- [x] Srovnání 6 ETF (EtfCompare)
- [x] Sekce: proč VOO nenajdete, co pošleme, daně, FAQ, patička, lepivé CTA
- [x] API `/api/lead` + `/dekujeme` – ostrý test na produkci 11. 10.: řádek v Supabase ✓, e-mail přes Resend `delivered` ✓ (testovací záznam `utm_source=test`, smazat před odevzdáním)
- [x] `/zasady`, `/zdroje`
- [x] Vizuály reklam A/B (PNG 4:5 a 9:16) ze stejných tokenů

**Kontrolní seznam každé sekce** (z D7, D8, D16, D17, CONTENT.md):
1. Barvy, mezery, poloměry a stíny jen přes `tokens.css`, žádné literály v komponentách.
2. Sklo (blur) jen na hero kartě, kartách ETF a formuláři. Tabulka a dlouhý text na téměř nepropustném podkladu. Náhradní styl přes `@supports not (backdrop-filter)`.
3. Čísla `font-variant-numeric: tabular-nums`, formát `cs-CZ` (mezera jako oddělovač tisíců, desetinná čárka).
4. Každé číslo o fondu se bere z `data/etf.json` (nic opsaného ručně), u sekce je zdroj a datum.
5. Vykání, texty přesně podle CONTENT.md. Odchylky se zapíšou.
6. Mobil první (375 px): tlačítka ≥ 48 px vysoká, bez vodorovného scrollu, text ≥ 16 px ve formulářových polích (iOS nezoomuje).
7. Viditelný focus u všech ovládacích prvků, popisky (label) u všech polí.
8. Žádné sliby výnosů. Upozornění „nejde o investiční doporučení" u kalkulačky.

**Kontrola:** po každé sekci build, prohlédnutí v prohlížeči na 375 px a na desktopu, kontrola podle seznamu výše. Na konci fáze nezávislá kontrola celé stránky (Fáze 5).

## Fáze 4 – Měření (ne 11. 10.) ✅
- [x] Události `$pageview` (s UTM) → `scroll_50` → `cta_click` → `tool_used` → `form_start` → `form_submit` → `thank_you_view` (+ `form_error`)
- [x] PostHog EU bez cookies (D24), Vercel Web Analytics
- [x] Trychtýř a dashboard v PostHogu, rozpad podle `ad_variant` a `form_location`
- [x] Ověřeno end-to-end na produkci (8 kroků, jeden návštěvník, lead s UTM, e-mail delivered) – `docs/MEASUREMENT.md`
- [ ] Před spuštěním smazat testovací leady (`utm_source=test`)

## Fáze 5 – Testy a ladění (11. 10., dříve než plán) – detail v `docs/TESTING.md`
- [x] Emulace 375 px a desktop (E2E), Lighthouse mobil 100/100/100/100, přístupnost (axe-core WCAG 2.1 AA + klávesnice)
- [ ] Reálný telefon (iPhone Safari, Android Chrome) – Miky ručně
- [x] Formulář: validace, chyby, dvojklik, ochrana proti spamu (honeypot + limit 3 žádosti na adresu za 24 h)
- [x] Každé číslo proti `data/SOURCES.md` – automatický test (poplatky, URL, historie přepočtená ze surových dat)
- [x] 74 unit + 58 E2E testů, lokálně i proti produkci
- [ ] Kontrola, že stránka nepůsobí jako „základní výstup od Claude" – Miky
- [x] Opravy jako samostatné `fix:` commity (4 nálezy testů a revize)

## Fáze 5b – Doladění před README (D28–D34)
Každý krok: změna, testy (unit/E2E) upravené nebo nové, kontrola na mobilu i desktopu, commit, a po bloku push.

1. [x] **Soukromí (D33):** v PostHogu vypnout záznamy relací, heatmapy nechat; upravit `/zasady`.
2. [x] **Karta v hero podle reklamy (D29):** A = páry originál → evropská verze (z `etf.json`), B = SPY vs. VOO.
3. [x] **Živý A/B test H2 (D28):** přiřazení 50/50 v `<head>` (sessionStorage), `exp_hero_calc` = `control | hero_input` u všech událostí; varianta B = pole „Kolik chcete investovat měsíčně" a tlačítko „Spočítat" v hero → kalkulačka; událost `hero_calc_submit`; přepnutí přes URL (`?exp=control|hero_input`) pro kontrolu a testy.
4. [x] **PostHog:** insight trychtýře rozdělený podle `exp_hero_calc` na dashboardu; definice úspěchu (primárně `form_submit` / návštěvník, sekundárně `tool_used`) a minimální počet návštěv do `docs/MEASUREMENT.md`.
5. [x] **Tlačítko v liště (D30):** dokud není `tool_used` → „Spočítat poplatky" ke kalkulačce; potom „Získat srovnání" k formuláři.
6. [x] **Zhuštění (D31):** zkrátit sekci KID a Daně, detaily do FAQ; blok „Kdo za tím stojí" (2–3 věty, odkazy na zdroje).
7. [x] **Děkovací stránka (D32):** otázka „Už investujete?" (Ano / Začínám / Zatím ne, událost `lead_segment`, nic osobního) a sdílení (Web Share API na mobilu, jinak WhatsApp a kopírovat odkaz; odkaz s `utm_source=share`).
8. [x] **Hypotézy H1 a H3** – v README spolu s H2 a kandidátem 2 vs. 3 formuláře.
9. [ ] **Testy:** celá sada lokálně i proti produkci, Lighthouse znovu.
10. [x] **S Mikym (D36):** vlastní linkové ikony (`Icon.astro`), ilustrace na děkovací stránce, OG obrázek 1200×630.

## Fáze 5c – Mikyho kontrola stránky (11. 10.) ✅ – D35
- [x] TER všech 12 fondů znovu u správců a v KID (vše sedí)
- [x] Dva samostatné souhlasy (e-mail / telefon), past na roboty bez popisku „Firma"
- [x] Základ 2 formuláře, varianta `?forms=3`
- [x] Mobil 10 442 → 9 538 px, formulář výš, nic nepřetéká na 390 px
- [x] Dotykové plochy ≥ 44 px (+ test)
- [x] Vysvětlení u telefonu, otázka na částku ne
- [x] README – sekce Měření, insight „Cena za lead podle reklamy"
- [x] Test obou reklam (`utm_content=a` / `b`) → DECISIONS
- [x] `anonymize_ips` – zapnuté v nastavení projektu, ověřeno v datech (žádná IP ani poloha)
- [ ] Záznamy relací vypnout i v nastavení PostHog projektu – Miky

## Fáze 6 – README a odevzdání (čt 15. 10. večer)
- [x] README se všemi 13 sekcemi (sekce 5 CLAUDE.md), včetně očekávané konverze a 3 A/B hypotéz (11. 10., dříve než plán) + sekce Soukromí a právní stránka
- [x] Doplnit `docs/AI-WORK-NOTES.md` (pokyny, kontrola výstupu, chyby AI)
- [ ] `/export` všech session → `ai-log/` → commit + push – **Miky** (příkaz `/export` v Claude Code)
- [~] Závěrečný kontrolní seznam (sekce 2 CLAUDE.md) – 11. 10.:
  - [x] veřejný repozitář `stoyka95/leadmagnet` (PUBLIC), 116+ commitů
  - [x] URL https://fingramo.vercel.app funguje na mobilu (E2E 375/390 px, Lighthouse mobil 100)
  - [x] obě verze reklamy v `ads/` (4:5 a 9:16) a jejich texty
  - [x] README se všemi sekcemi, odkazy v README ověřené
  - [x] žádné klíče v repozitáři (jen `.env.example`)
  - [ ] `ai-log/` s exporty – Miky
  - [ ] smazat 5 testovacích kontaktů v Supabase (`utm_source=test`) – na Mikyho „ano"
  - [ ] ruční kontrola na skutečném telefonu – Miky
  - [ ] záznamy relací vypnout i v nastavení PostHogu – Miky
- [ ] Pá 16. 10.: Miky odešle odpověď Matejovi Lörincovi s odkazy

---

## Rizika
| Riziko | Dopad | Co s tím |
|---|---|---|
| US ETF (NYSE) nejsou pro retail v EU kvůli PRIIPs/KID dostupné | stránka by mohla slibovat něco, co návštěvník nekoupí | ověřit u brokerů, říct to otevřeně, nabídnout UCITS ekvivalenty |
| Data bez ověřitelného zdroje | porušení pravidla „nic nevymýšlet" | číslo nepoužít, zeptat se Mikyho |
| Regulace reklamy na investice | stránka by nešla spustit | žádné sliby výnosů, upozornění na riziko |
| Málo času | nedokončené části | priorita: hero + 1 nástroj + formulář + měření + README; zbytek do „Co chybí" |

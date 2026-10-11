# Plán – Zadání B: konverzní landing page (ETF z NYSE pro české drobné investory)

**Termín:** pátek 16. 10. 2026 · **Cíl:** hotovo ve čtvrtek 15. 10. večer, v pátek jen kontrola a odeslání.
**Stav plánu:** SCHVÁLENO Mikym 11. 10. 2026 (bez změn).

Legenda: `[ ]` zbývá · `[x]` hotovo · `[~]` rozpracováno

---

## Fáze 0 – Příprava (ne 11. 10.)
- [x] Kontrola prostředí: Git 2.54, `git config` (stoyka95 / mykolastoyka@gmail.com), GitHub CLI přihlášený (účet `stoyka95`), Node 24 + npm 12
- [x] Vercel: připojený přes konektor (tým „stoyka95's projects"), Vercel CLI není nainstalovaný (není nutný – nasazení přes GitHub)
- [x] Supabase: přihlášené 2 účty (projekty fakturr, foodphore, wallana) – pro tento úkol zatím žádný projekt
- [ ] PostHog: konektor existuje, účet/projekt pro tento úkol ověřit – závisí na rozhodnutí č. 11
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
- [ ] Zbývá: TER UCITS proti KID správců (hlavně XD9U, VWCE), stránka IBKR ručně v prohlížeči

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
- [~] API `/api/lead` + `/dekujeme` – kód hotový a otestovaný bez klíčů; ostrý test po doplnění klíčů Mikym
- [x] `/zasady`, `/zdroje`
- [ ] Vizuály reklam A/B (PNG 4:5 a 9:16) ze stejných tokenů

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

## Fáze 4 – Měření (st 14. 10.)
- [ ] Události: `page_view` (s UTM) → `scroll_50` → `cta_click` → `tool_used` → `form_start` → `form_submit` → `thank_you_view`
- [ ] Trychtýř v analytice, ověření, že události reálně dorazí (test z mobilu)
- [ ] Commit + push

## Fáze 5 – Testy a ladění (čt 15. 10.)
- [ ] Mobil (reálný telefon + emulace 375 px), rychlost (Lighthouse), přístupnost
- [ ] Formulář: validace, chyby, duplicity, ochrana proti spamu
- [ ] Kontrola každého čísla na stránce proti `data/SOURCES.md`
- [ ] Kontrola, že stránka nepůsobí jako „základní výstup od Claude"
- [ ] Opravy jako samostatné `fix:` commity

## Fáze 6 – README a odevzdání (čt 15. 10. večer)
- [ ] README se všemi 13 sekcemi (sekce 5 CLAUDE.md), včetně očekávané konverze a 3 A/B hypotéz
- [ ] Doplnit `docs/AI-WORK-NOTES.md` (pokyny, kontrola výstupu, chyby AI)
- [ ] `/export` všech session → `ai-log/` → commit + push
- [ ] Závěrečný kontrolní seznam (sekce 2 CLAUDE.md)
- [ ] Pá 16. 10.: Miky odešle odpověď Matejovi Lörincovi s odkazy

---

## Rizika
| Riziko | Dopad | Co s tím |
|---|---|---|
| US ETF (NYSE) nejsou pro retail v EU kvůli PRIIPs/KID dostupné | stránka by mohla slibovat něco, co návštěvník nekoupí | ověřit u brokerů, říct to otevřeně, nabídnout UCITS ekvivalenty |
| Data bez ověřitelného zdroje | porušení pravidla „nic nevymýšlet" | číslo nepoužít, zeptat se Mikyho |
| Regulace reklamy na investice | stránka by nešla spustit | žádné sliby výnosů, upozornění na riziko |
| Málo času | nedokončené části | priorita: hero + 1 nástroj + formulář + měření + README; zbytek do „Co chybí" |

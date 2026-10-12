# Testy (Fáze 5)

Stav k 12. 10. 2026 (po kontrole produkce a D38): **83 unit testů a 133 E2E testů prochází** lokálně (7 testů běží jen na mobilu, proto se v projektu desktop přeskočí). Proti produkci 107 prošlo a 9 se přeskočilo (navíc 2 testy jen pro lokální server). Po Fázi 5c to bylo 107 E2E. Předtím (po Fázi 5b) 74 unit a 90 E2E. Lighthouse na mobilu (produkce): **100 / 100 / 100 / 100** v obou variantách A/B testu.

## Jak spustit

```bash
npm test                                              # unit testy (Vitest), < 1 s
npm run test:e2e                                      # E2E v Chrome, mobil 375 px + desktop 1366 px
E2E_BASE_URL=https://fingramo.vercel.app npm run test:e2e   # totéž proti produkci
npm run test:all                                      # astro check + unit + E2E
```

E2E testy používají Chrome nainstalovaný v počítači. Odeslání formuláře (`/api/lead`) testy odchytí, takže se nic neuloží ani neodešle. Požadavky na PostHog a Vercel Analytics jsou zablokované, aby testy nekazily data. Události trychtýře se přitom zaznamenávají v prohlížeči a testy je kontrolují.

## Co se testuje

### Unit (`tests/unit/`)
| Soubor | Co ověřuje |
|---|---|
| `calc.test.ts` | výpočet poplatků (uzavřený vzorec, 0 %, nulové částky, monotónnost), regrese čísel SPY/VOO ze stránky, růst a scénáře KID, rozsah historie 5–30 let |
| `data.test.ts` | každý fond má zdroj (URL), poplatek a evropský protějšek; **poplatky a URL v `etf.json` = tabulky v `SOURCES.md`**; **historie S&P 500 přepočtená ze surových dat Damodarana** (nejhorší, medián a nejlepší období pro 5–30 let) |
| `email-report.test.ts` | report má 6 fondů, e-mail obsahuje vše slíbené (logo, 12 fondů, 4 scénáře, historii, riziko, zásady), escapuje jméno (žádné vložení HTML), PDF zmiňuje jen s přílohou, textová verze bez HTML |
| `api-lead.test.ts` | validace (400/413/422), honeypot, jen e-mail povinný, normalizace, `return=minimal`, chybný telefon nebo jednopísmenné jméno se zahodí, souhlas jen jako skutečné `true`, rozsahy částek, limit 429, chyba databáze 502, chybějící konfigurace 503, e-mail s PDF přílohou, e-mail i bez PDF, chyba e-mailu nezruší lead |
| `pdf.test.ts` | PDF má 2 strany A4, < 100 kB, písma z vlastního webu, extrémní částky |

### E2E (`tests/e2e/`, mobil i desktop)
- první obrazovka podle reklamy A/B a bez UTM, odznak spočítaný z dat
- žádná stránka nescrolluje do šířky (`/`, `/dekujeme`, `/zasady`, `/zdroje`)
- **obě reklamy × obě varianty 1. obrazovky** celou cestou až na děkovací stránku, lead nese správné `utm_content` (`ad-variants.spec.ts`, D35)
- **dotykové plochy ≥ 44 px** na 6 stránkách: vstupy, zaškrtávací pole s popiskem, tlačítka a každý odkaz (klepnutí 21 px od středu musí trefit odkaz) (`touch.spec.ts`, D35)
- **mobil 390 px:** stránka pod 9 600 px, formulář u kalkulačky v prvních 2 400 px, nic nepřetéká (D35)
- **2 formuláře v základu, 3 ve variantě `?forms=3`**, tlačítko u srovnání vede k formuláři u kalkulačky (D35)
- dva samostatné nezaškrtnuté souhlasy, past na roboty bez popisku „Firma", vysvětlení u telefonu (D35)
- lepivá lišta: zůstává nahoře, tlačítko vede do e-mailu posledního formuláře
- kalkulačka: přepočet, formát čísel, písmena v částce, horizont, paměť v rámci záložky, událost `tool_used`
- brána: hlavní výsledek vidět, 3 rozmazané bloky `inert`, tlačítko „Odemknout" vede do e-mailu
- formulář: chyby se ohlásí a zmizí po opravě, souhlas nezaškrtnutý, honeypot skrytý, odeslání s UTM a částkami, děkovací stránka (12 řádků, 5 sloupců grafu, historie), odemčení po návratu, chyba serveru, limit 429, dvojklik odešle jen jednou
- srovnání: přepínač skupin (regrese chyby s `hidden`), otevření formuláře
- měření: `scroll_50` jednou, `cta_click` z hero a lišty, **žádné cookies**
- odkazy v patičce, `/zdroje` s odkazy na zdroje, favicon, logo a písma
- přístupnost: axe-core (WCAG 2.1 A/AA) na všech stránkách bez závažných nálezů, ovládání klávesnicí, rozmazaný obsah nejde vybrat tabulátorem

## Co testy našly a co se opravilo
| Nález | Jak se našel | Oprava |
|---|---|---|
| `/zdroje` na mobilu široká 618 px místo 375 px | E2E „no page scrolls sideways" | `fix:` 8b3405b |
| Šedý text 4,15:1 na světle modrém pozadí (pod WCAG AA) | axe-core | `fix:` 3df5a4f, `--c-ink-faint` #5f6880 (≥ 4,8:1) |
| `aria-label` na prostém `span` u loga | axe-core | `fix:` 76d1313, role=img |
| Formulář šel zneužít k opakovanému posílání e-mailů na cizí adresu | revize kódu API | `fix:` a9f7752, limit 3 žádosti na adresu za 24 h v databázi (HTTP 429), ověřeno na produkci |
| Chybějící bezpečnostní hlavičky | revize | `chore:` `vercel.json` |

## Přibylo ve Fázi 5b
- `experiment.spec.ts`: živý A/B test (obě varianty, paměť v záložce, předání částky do kalkulačky, Enter, náhodné rozdělení v čistém prohlížeči, bez vodorovného scrollu)
- karta v hero podle reklamy A/B; tlačítko v liště (ke kalkulačce → po výpočtu k formuláři); pořadí sekcí; blok „Kdo za srovnáním stojí"; FAQ s dividendami; „Co vám pošleme" odpovídá e-mailu
- `thank-you.spec.ts`: dobrovolná otázka (jedna odpověď s `lead_ref`), sdílení (označený odkaz, kopírování), obojí mimo tisk
- vazba lead ↔ analytika (`analytics_id` = `lead_ref` v `form_submit`), v záložce se nedrží e-mail, z lokálního serveru nic neodchází do PostHogu

## Lighthouse (mobil, produkce, 11. 10. 2026)
**Po Fázi 5c a grafice (D35, D36), Lighthouse 12:** `control` 100 / 100 / 100 / 100 (LCP 1,5 s, TBT 30 ms, CLS 0), `hero_input` 100 / 100 / 100 / 100 (LCP 1,5 s, TBT 20 ms, CLS 0).

Předchozí měření (po Fázi 5b):
Výkon 100 · Přístupnost 100 · Best practices 100 · SEO 100. FCP 1,0 s, LCP 1,0 s, TBT 40 ms, CLS 0. Rezerva: ~60 kB nevyužitého JavaScriptu (PostHog), načítá se asynchronně a vykreslení nezdržuje.

## Co automatické testy nepokryjí
- **Skutečný telefon** (Safari na iPhonu, Chrome na Androidu): projde Miky ručně.
- **Vzhled e-mailu v Gmailu a Outlooku:** testy kontrolují obsah, vykreslení jsme ověřili v prohlížeči a na produkci (Resend: delivered, PDF v příloze).
- **Čtečka obrazovky:** axe-core pokrývá jen strojově ověřitelná pravidla.

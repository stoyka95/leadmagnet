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
- [ ] Založení veřejného repozitáře `stoyka95/leadmagnet`, struktura, `.gitignore`, `.env.example`
- [ ] První commity: `CLAUDE.md`, `docs/PLAN.md`, `docs/DECISIONS.md`, `docs/AI-WORK-NOTES.md` → push

## Fáze 1 – Data a ověření faktů (ne 11. – po 12. 10.)
- [ ] Výběr ETF podle schváleného kritéria
- [ ] Stažení TER, velikosti fondu, burzy, data vzniku z factsheetů správců (+ URL, datum) → `data/etf.json`, `data/SOURCES.md`
- [ ] Kurz USD/CZK z ČNB (+ datum)
- [ ] Ověření dostupnosti US ETF pro české retailové investory (PRIIPs/KID) u konkrétních brokerů – se zdrojem; případně UCITS ekvivalenty
- [ ] Ověření daňových informací jen tam, kde je oficiální zdroj; jinak neuvádět
- [ ] Commit `data: ...` + push

## Fáze 2 – Obsah: cílovka, texty, reklamy (po 12. 10.)
- [ ] Persona a slib reklamy → struktura první obrazovky
- [ ] Texty sekcí (česky, podle zvoleného tónu), CTA, mikrotexty formuláře
- [ ] Dvě verze reklamy (`ads/`) s UTM odkazy (`utm_content=a|b`)
- [ ] Právní texty: upozornění na riziko, souhlas GDPR, zásady zpracování, údaj o správci
- [ ] Commity `docs:`/`feat:` + push

## Fáze 3 – Stavba stránky (út 13. – st 14. 10.)
- [ ] Kostra projektu podle zvolené technologie, nasazení prázdné stránky na Vercel hned na začátku (ověříme pipeline)
- [ ] Vizuální základ (barvy, typografie) podle schváleného stylu – mobil first
- [ ] Sekce po jedné (každá = commit): hero → interaktivní prvek → … (pořadí podle rozhodnutí)
- [ ] Interaktivní prvek(y) napojené na reálná data z `data/etf.json`
- [ ] Formulář (minimum polí) + uložení kontaktu + děkovací stav / e-mail
- [ ] Commit po každé sekci, push na konci dne

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

# Obsah stránky – Fingramo (návrh, Fáze 2)

**Stav:** SCHVÁLENO Mikym 11. 10. 2026 (D18). Kalkulačka podle D16, hero podle D17.
Tón: česky, vykání, věcně (D7). Čísla pouze z `data/SOURCES.md`. Žádné sliby výnosů.
Značka: **Fingramo** (fiktivní, ukázkový projekt, D14).

---

## 1. Komu stránka mluví (persona z D1)

**Petra / Tomáš, 25–40 let**, peníze na spořicím účtu, na Instagramu nebo YouTube viděl(a), že „všichni kupují VOO" nebo „SPY". Chce začít, ale:
- neví, jestli je mezi SPY, IVV a VOO nějaký rozdíl (stejný index, jiný poplatek),
- u svého brokera VOO nenašel(a), nebo mu (jí) nákup systém odmítl (chybějící KID),
- netuší, kolik ho/ji poplatky stojí **v korunách**.

Na stránku přichází z reklamy na mobilu a má **pár sekund**. Musí hned vidět: *tohle je odpověď na to, co mě v reklamě zaujalo, a dostanu to zdarma.*

**Slib stránky (jedna věta):** *Zjistěte, které populární ETF z NYSE si z Česka koupíte, a kolik vás budou stát poplatky v korunách.*

---

## 2. Pořadí sekcí a proč

| # | Sekce | Úkol | Proč na tomto místě |
|---|---|---|---|
| 1 | **Hero** | Navázat na reklamu, říct, co návštěvník dostane, jedno tlačítko | Návštěvník z reklamy rozhoduje za pár sekund. První obrazovka musí opakovat slib reklamy (message match) a nabídnout jediný krok. |
| 2 | **Kalkulačka poplatků** (hlavní nástroj) | Zadat částku → okamžitě vidět rozdíl v Kč → formulář pod výsledkem | Hodnota musí přijít **před** žádostí o kontakt (zadání). Kalkulačka dává osobní výsledek za ~10 s a vytváří důvod chtít „celé srovnání". Formulář je hned pod výsledkem = moment největšího zájmu (D3). |
| 3 | **Srovnání 6 ETF** (interaktivní) | Přepínání „Co chci" (S&P 500 / celé USA / svět / dividendy), US fond vs. evropská verze | Pro analytičtější návštěvníky a pro ty, kteří přišli z reklamy A („kde je VOO"). Druhý nástroj z D4, CTA vede ke stejnému formuláři. |
| 4 | **Proč VOO u brokera možná nenajdete** | 3 krátké body o KID/PRIIPs + zdroje (ČNB, IBKR, Fio) | Odstraní hlavní nejasnost cílovky a buduje důvěru (ověřená fakta se zdrojem). Až po nástrojích – kdo chce jen čísla, nemusí číst teorii. |
| 5 | **Co vám pošleme** | Náhled obsahu e-mailu (3 body + obrázek náhledu) | Opakuje hodnotu pro ty, kdo formulář u kalkulačky přeskočili. |
| 6 | **Daně v kostce** | 3 ověřená fakta (časový test, 100 000 Kč, 15 % z dividend USA) + odkazy | Bonusová hodnota, častá otázka začátečníků; posiluje důvěryhodnost. |
| 7 | **Časté otázky + závěrečný formulář** | 4 otázky, druhý (poslední) formulář | Záchyt pro ty, kdo dojeli na konec. |
| 8 | **Patička** | Upozornění na riziko, zdroje a datum dat, zásady ochrany údajů, poznámka „ukázkový projekt" | Povinné náležitosti, pro hodnotitele i pro důvěru. |

**Lepivé CTA na mobilu:** po odscrollování hero se dole objeví tenký pruh „Spočítat moje poplatky" (skryje se, když je kalkulačka nebo formulář na obrazovce).

---

## 3. Texty po sekcích

### 3.1 Hero

**Varianta pro reklamu A** (`utm_content=a`, úhel „VOO nenajdete"):
- Nadpis: **Chcete VOO nebo SPY? Ukážeme vám, co si z Česka opravdu koupíte.**
- Podnadpis: Srovnání 6 nejpopulárnějších ETF z newyorské burzy a jejich evropských verzí. Poplatky v korunách pro vaši částku – zdarma.

**Varianta pro reklamu B** (`utm_content=b`, úhel „čísla"):
- Nadpis: **Stejný index, jiný poplatek. Kolik vás ETF stojí v korunách?**
- Podnadpis: Zadejte částku a za 10 vteřin uvidíte, kolik zaplatíte na poplatcích ETF z NYSE. Celé srovnání 6 fondů a jejich evropských verzí vám pošleme zdarma. *(upraveno kvůli D25: všech 6 fondů v Kč je až za e-mailem)*

**Výchozí** (bez UTM / přímý příchod) = varianta B.

- Tlačítko: **Spočítat moje poplatky**
- Pod tlačítkem (důvěra, malým písmem): *Data přímo od správců fondů (Vanguard, iShares, State Street, Schwab), aktualizováno 11. 10. 2026. Bez registrace.*
- Vizuál: skleněná karta s 6 tickery (SPY · IVV · VOO · VTI · VT · SCHD) a jedním skutečným údajem: „SPY 0,0945 % vs. VOO 0,03 % ročně" (zdroj: správci, SOURCES §1).

### 3.2 Kalkulačka poplatků

- Nadpis: **Kolik vás budou stát poplatky?**
- Pole: *Jednorázově* (Kč) · *Měsíčně* (Kč) · *Na kolik let* (posuvník 5–30)
- Výchozí hodnoty: 100 000 Kč · 3 000 Kč · 20 let *(rozhodne Claude, lze změnit)*
- Výsledek (okamžitě, bez tlačítka):
  - „Nejlevnější z vybraných: **IVV / VOO (0,03 %)** → zaplatíte zhruba **X Kč**"
  - „Nejdražší: **SPY (0,0945 %)** → zhruba **Y Kč**"
  - „Rozdíl: **Z Kč** za stejný index"
  - Malý sloupcový graf 6 fondů.
  - Poznámka: *Počítáno jen z ročního poplatku fondu (TER). Nezahrnuje poplatky brokera, převod měny ani daně. Nejde o investiční doporučení.*
- **Formulář pod výsledkem:**
  - Nadpis: **Pošleme vám celé srovnání pro vaši částku**
  - Podtext: Všech 6 fondů, jejich evropské verze, poplatky v Kč na 10 a 20 let a odkazy na zdroje. Do e-mailu, zdarma.
  - Pole: E-mail · Jméno *(nepovinné)* · Telefon *(nepovinné)* (D25)
  - Tlačítko: **Získat srovnání zdarma** *(změna D23, původně „Poslat mi srovnání“)*
  - Pod tlačítkem: 🔒 *Zdarma · Bez spamu · Hned v e-mailu* (ikona SVG)
  - Pod tlačítkem: *Odesláním žádáte o zaslání srovnání. Údaje zpracujeme podle [Zásad ochrany osobních údajů].*
  - Políčko (nezaškrtnuté): ☐ *Chci dostávat další tipy k investování do ETF e-mailem a souhlasím, že mě můžete kontaktovat telefonicky (pokud jsem ho vyplnil/a).*

> Výpočet (D16): hlavní výsledek bez růstu („minimálně zaplatíte"). Rozbalovací „A co kdyby investice rostla?" s posuvníkem výnosu 0–10 %, výchozí 0 %, popisek „váš předpoklad, ne náš slib".

### 3.3 Srovnání 6 ETF

- Nadpis: **Americký originál, nebo evropská verze?**
- Přepínač „Co chcete": **S&P 500** (SPY, IVV, VOO) · **Celé USA** (VTI) · **Celý svět** (VT) · **Dividendy** (SCHD)
- Karta fondu: ticker, název, poplatek, velikost, burza; vedle evropská verze (ticker, ISIN, poplatek, „stejný index" / „podobný, jiný index").
- U evropských verzí SPYL a SPYD štítek *„registrováno pro ČR"* (zdroj: State Street).
- CTA pod srovnáním: **Poslat srovnání e-mailem** → skok na formulář (nebo modální formulář).
- Pod tabulkou: zdroje a datum.

### 3.4 Proč VOO u brokera možná nenajdete

Nadpis: **Proč VOO u svého brokera možná nenajdete**
1. **Chybí „KID".** Evropská pravidla (PRIIPs) vyžadují pro drobné investory dokument klíčových informací. Američtí správci ho obvykle nevydávají. *(IBKR, ČNB)*
2. **Záleží na brokerovi.** Někteří brokeři americká ETF drobným investorům z EU blokují (např. Interactive Brokers), jiní je zpřístupňují (např. Fio). *(IBKR, Fio)*
3. **Evropská verze často sleduje stejný index.** U S&P 500 existují evropské fondy od stejných správců s podobně nízkým poplatkem. *(správci)*

### 3.5 Co vám pošleme
- ✓ Všech 6 fondů a jejich evropské verze vedle sebe
- ✓ Poplatky v korunách pro vaši částku na 10 a 20 let
- ✓ Na co se zeptat brokera a odkazy na oficiální zdroje
- Náhled e-mailu (obrázek).
- Tlačítko: **Chci srovnání** → formulář.

### 3.6 Daně v kostce (obecná informace, ne daňové poradenství)
- **Po 3 letech bez daně z prodeje** – příjem z prodeje cenného papíru drženého déle než 3 roky je osvobozen. *(§ 4 odst. 1 písm. u) ZDP)*
- **Do 100 000 Kč ročně** – příjmy z prodeje cenných papírů jsou osvobozeny, pokud za rok nepřesáhnou 100 000 Kč. *(§ 4 odst. 1 písm. t) ZDP)*
- **Dividendy z USA** – v USA se srazí nejvýše 15 % (smlouva ČR–USA), pokud broker má váš formulář W-8BEN. V Česku se dividendy uvádějí v přiznání a americkou daň lze započíst. *(smlouva čl. 10, IRS, Finanční správa)*

### 3.7 Časté otázky
1. **Je mezi SPY, IVV a VOO rozdíl?** Sledují stejný index S&P 500, liší se hlavně správcem a poplatkem (0,0945 % vs. 0,03 %).
2. **Co je UCITS?** Evropská pravidla pro fondy. UCITS ETF mají dokument KID, proto je drobní investoři v EU běžně koupí.
3. **Je to investiční doporučení?** Ne. Srovnáváme veřejné údaje správců. Rozhodnutí je na vás.
4. **Co s mými údaji?** Použijeme je k zaslání srovnání. Další e-maily jen pokud zaškrtnete souhlas. Odhlásit se můžete jedním klikem.

Závěrečný formulář: stejný jako u kalkulačky; pokud návštěvník kalkulačku nepoužil, srovnání použije výchozí hodnoty a v e-mailu je odkaz zpět na kalkulačku.

### 3.8 Patička
- **Upozornění na riziko:** Investování do ETF je spojeno s rizikem. Hodnota investice může klesat i stoupat a není zaručena návratnost vložených prostředků. Minulá výkonnost není zárukou budoucích výnosů. Obsah stránky je informativní a nepředstavuje investiční doporučení ani daňové poradenství.
- **Data:** zdroje a data stažení → `/zdroje` (stránka z `data/SOURCES.md`).
- **Ukázkový projekt:** Fingramo je fiktivní značka vytvořená jako ukázka pro výběrové řízení. Kontakt k osobním údajům: Mykola Stoyka, mykola@stoyka.eu.
- Odkazy: Zásady ochrany osobních údajů · Zdroje dat.

---

## 4. Po odeslání formuláře

1. **Děkovací stránka** (`/dekujeme`), okamžitě: „Hotovo, srovnání je na cestě do e-mailu. Tady ho máte hned:" + **plné srovnání pro zadanou částku** + tlačítko **Uložit jako PDF** (tisk prohlížeče).
2. **E-mail** (Resend, `srovnani@mail.stoyka.eu`): stejný obsah, odkazy na zdroje, odkaz zpět do kalkulačky.
3. Na děkovací stránce: „Co dál?" – 3 kroky (vybrat brokera → ověřit, že nabízí zvolený fond → zkontrolovat KID).

---

## 5. Rozhodnutí, která Claude udělal sám (k připomínkám)
- Výchozí hodnoty kalkulačky (100 000 Kč / 3 000 Kč / 20 let) – typická částka pro začínajícího investora, snadno přepsatelná.
- Výchozí hero bez UTM = varianta B (obecnější, funguje i bez kontextu reklamy).
- Lepivé CTA na mobilu.
- **Úprava při stavbě (11. 10.):** z poznámky u kalkulačky vypuštěn „kurz ČNB" – poplatek je procento z hodnoty investice, kurz výsledek neovlivňuje (AI-WORK-NOTES).
- **Úpravy D23 (11. 10.):** text nabídky „do e-mailu a hned i k uložení jako PDF“, štítky „Nejnižší poplatek“ (věcné, ne „doporučeno“), „Poplatek VOO ~3× nižší“ (počítáno z dat), řádek zdrojů v hero.

# Zdroje dat

Pravidlo: každé číslo na stránce musí mít zdroj (URL) a datum stažení. Strojově čitelná data jsou v [`etf.json`](etf.json).
**Datum stažení všech údajů níže: 11. 10. 2026** (pokud není uvedeno jinak). Datum, ke kterému údaj platí („as of"), přebíráme od zdroje.

---

## 1. ETF obchodovaná na NYSE (weby správců)

| Ticker | Poplatek (TER) | Velikost (ETF třída) | Platí k | Burza | Index | Zdroj |
|---|---|---|---|---|---|---|
| SPY | 0,0945 % *(gross)* | 817,2 mld. USD | 8. 10. 2026 | NYSE Arca | S&P 500 | [ssga.com](https://www.ssga.com/us/en/intermediary/etfs/state-street-spdr-sp-500-etf-trust-spy) |
| IVV | 0,03 % | 896,4 mld. USD | 9. 10. 2026 | NYSE Arca | S&P 500 | [ishares.com](https://www.ishares.com/us/products/239726/ishares-core-sp-500-etf) |
| VOO | 0,03 % *(k 28. 4. 2026)* | 1,0 bil. USD *(fond celkem 1,7 bil.)* | 30. 9. 2026 | NYSE Arca | S&P 500 | [vanguard.com](https://investor.vanguard.com/investment-products/etfs/profile/voo) |
| VTI | 0,03 % *(k 28. 4. 2026)* | 690,1 mld. USD *(fond celkem 2,3 bil.)* | 31. 8. 2026 | NYSE Arca ([nyse.com](https://www.nyse.com/quote/ARCX:VTI)) | Morningstar US Total Market | [vanguard.com](https://investor.vanguard.com/investment-products/etfs/profile/vti) |
| VT | 0,06 % *(k 27. 2. 2026)* | 81,8 mld. USD *(fond celkem 101,2 mld.)* | 30. 9. 2026 | NYSE Arca | FTSE Global All Cap | [vanguard.com](https://investor.vanguard.com/investment-products/etfs/profile/vt) |
| SCHD | 0,060 % | 110,3 mld. USD | 9. 10. 2026 | NYSE Arca | Dow Jones U.S. Dividend 100 | [schwabassetmanagement.com](https://www.schwabassetmanagement.com/products/schd) |

Poznámky:
- Weby Vanguard a Schwab se načítají přes JavaScript. Data byla přečtena z vykreslené stránky v prohlížeči. U VOO, VTI a VT byl poplatek a datum vzniku navíc ověřen z JSON API stránky (`/vmf/api/{TICKER}/profile`).
- U Vanguardu se rozlišuje **ETF třída** (ta se obchoduje na burze) a **celý fond** (včetně podílových tříd). Ve srovnání používáme ETF třídu.
- SPY: správce uvádí jen gross expense ratio, bez slev z poplatků.

## 2. Evropské (UCITS) protějšky – weby správců

Ověřeno 11. 10. 2026 ve vestavěném prohlížeči přímo na webech správců. justETF slouží jen jako křížová kontrola: TER sedí u všech šesti fondů.

| Pro | UCITS ETF | ISIN | TER | Velikost | Platí k | Shoda | Zdroj |
|---|---|---|---|---|---|---|---|
| SPY | SPDR S&P 500 UCITS (Acc), SPYL | IE000XZSV718 | 0,03 % | 19,76 mld. USD *(třída)* | 9. 10. 2026 | stejný index | [ssga.com](https://www.ssga.com/ie/en_gb/institutional/etfs/state-street-spdr-sp-500-ucits-etf-acc-spyl-gy) |
| IVV | iShares Core S&P 500 UCITS (Acc), CSPX | IE00B5BMR087 | 0,07 % | 161,5 mld. USD *(fond)* | 9. 10. 2026 | stejný index | [ishares.com](https://www.ishares.com/uk/individual/en/products/253743/ishares-sp-500-b-ucits-etf-acc-fund) |
| VOO | Vanguard S&P 500 UCITS (Acc), VUAA | IE00BFMXXD54 | 0,07 % | 36,34 mld. USD *(třída)* | neuvedeno | stejný index | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9694/sp-500-ucits-etf-usd-accumulating) |
| VTI | Xtrackers MSCI USA UCITS 1C, XD9U | IE00BJ0KDR00 | 0,03 % | 11,51 mld. GBP *(fond)* | 8. 10. 2026 | **jiný index** (MSCI USA) | [etf.dws.com](https://etf.dws.com/en-gb/IE00BJ0KDR00-msci-usa-ucits-etf-1c/) |
| VT | Vanguard FTSE All-World UCITS (Acc), VWCE | IE00BK5BQT80 | 0,14 % | 60,19 mld. USD *(třída)* | neuvedeno | **jiný index** (FTSE All-World) | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9679/ftse-all-world-ucits-etf-usd-accumulating) |
| SCHD | SPDR S&P U.S. Dividend Aristocrats UCITS (Dist), SPYD | IE00B6YX5D40 | 0,35 % | 3,68 mld. USD *(třída)* | 9. 10. 2026 | **jiný index** (S&P High Yield Dividend Aristocrats) | [ssga.com](https://www.ssga.com/ie/en_gb/institutional/etfs/state-street-spdr-sp-us-dividend-aristocrats-ucits-etf-dist-spyd-gy) |

Poznámky:
- Velikosti nejsou přímo srovnatelné, protože správci je uvádějí různě (třída / celý fond, USD / GBP). Na stránce se velikost UCITS fondů srovnávat nebude, hlavní je poplatek.
- **Registrace v ČR:** State Street u SPYL a SPYD výslovně uvádí „Countries of Registration: … Czech Republic …". U ostatních jsme registraci na stránce nenašli, a proto ji netvrdíme.
- Rozdíl oproti justETF: datum vzniku CSPX je podle iShares 18. 5. 2010 (justETF uvádí 19. 5.). Platí údaj správce.
- Pro VTI a SCHD neexistuje UCITS fond se stejným indexem (nenašli jsme ho). Jde o **nejbližší alternativu** a na stránce bude takto označená.

### Druhá kontrola TER (11. 10. 2026, odpoledne)

Na Mikyho žádost jsme TER všech 12 fondů ověřili znovu přímo u správců a u UCITS fondů navíc v dokumentu KID (PRIIPs) nebo v nákladových údajích MiFID. **Všech 12 hodnot sedí, data ani přepočty v kalkulačce se nemění.**

| Fond | Web správce | KID / náklady dle MiFID | Výsledek |
|---|---|---|---|
| SPY | Gross Expense Ratio 0,0945 % | (US fond, KID nevydává) | sedí |
| IVV | Expense Ratio 0,03 % | (US fond, KID nevydává) | sedí |
| VOO | Expense ratio 0,03 % k 28. 4. 2026 | (US fond, KID nevydává) | sedí |
| VTI | Expense ratio 0,03 % k 28. 4. 2026 | (US fond, KID nevydává) | sedí |
| VT | Expense ratio 0,06 % k 27. 2. 2026 | (US fond, KID nevydává) | sedí |
| SCHD | Total Expense Ratio 0,060 % | (US fond, KID nevydává) | sedí |
| SPYL | TER 0,03 % | KID: správa a provoz 0,03 % ročně | sedí |
| CSPX | Total Expense Ratio 0,07 % | KIID: Ongoing Charges 0,07 % | sedí |
| VUAA | OCF/TER 0,07 % | KID (17. 2. 2026): ongoing charges 0,07 % | sedí |
| **XD9U** | All-in fee (TER) 0,03 % = správa 0,01 % + fixní 0,02 % | MiFID na webu DWS: ongoing costs 0,030 % ročně, navíc transakční náklady 0,012 % | sedí |
| **VWCE** | OCF/TER 0,14 % | KID (28. 7. 2026): ongoing charges 0,14 % | sedí |
| SPYD | TER 0,35 % | KID: správa a provoz 0,35 % ročně, transakční náklady 0,03 % | sedí |

- KID: [VWCE](https://fund-docs.vanguard.com/ie00bk5bqt80-en.pdf), [VUAA](https://fund-docs.vanguard.com/ie00bfmxxd54-en.pdf), [CSPX](https://www.ishares.com/gls-download/literature/kiid/ucits_kiid-ishares-core-sp-500-ucits-etf-usd-acc-gb-ie00b5bmr087-en.pdf), [SPYL](https://www.ssga.com/library-content/kids?isin=IE000XZSV718&documentType=kid&country=ie&language=en_gb&ticker=spyl-gy), [SPYD](https://www.ssga.com/library-content/kids?isin=IE00B6YX5D40&documentType=kid&country=ie&language=en_gb&ticker=spyd-gy).
- Transakční náklady (XD9U 0,012 %, SPYD 0,03 %) nejsou součástí TER. Kalkulačka počítá jen s TER (rozhodnutí z Fáze 5b: „jen TER"), FAQ na stránce uvádí, že počítáme jen roční poplatek fondu (TER).
- Web SPY se přesunul na adresu `.../state-street-spdr-sp-500-etf-trust-spy`. Odkaz jsme aktualizovali, stará adresa přesměrovává.

## 3. Kurz USD/CZK a EUR/CZK – ČNB

- **1 USD = 21,745 Kč, 1 EUR = 24,365 Kč**, kurz ČNB ze dne **9. 10. 2026** (č. 195), staženo 11. 10. 2026 (neděle, poslední vyhlášený kurz).
- Zdroj: [cnb.cz – denní kurz (txt)](https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt)

## 4. Dostupnost amerických ETF pro české drobné investory

| Tvrzení | Zdroj | Stav |
|---|---|---|
| Nabízet produkt spadající pod PRIIPs bez KID je porušením nařízení. Distributor, který jen provádí pokyny klienta (bez nabídky a poradenství), ale povinnost dle čl. 13(1) nemá. | [ČNB – Otázky a odpovědi k PRIIPs (RS2018-12)](https://www.cnb.cz/cs/dohled-financni-trh/legislativni-zakladna/stanoviska-k-regulaci-financniho-trhu/RS2018-12) | ✅ ověřeno na stránce |
| Fio banka: „U nás můžete obchodovat i s americkými ETF." Zároveň uvádí, že ETF nenabízí, pouze umožňuje přístup na trhy. | [fio.cz/akcie-investice/etf](https://www.fio.cz/akcie-investice/etf) | ✅ ověřeno na stránce |
| Interactive Brokers: „U.S. clients are not impacted by PRIIPs, so the issuers of U.S. listed ETFs usually do not create KIDs. This means that EEA and UK retail clients do not have access to such products." IBKR uvádí, že blokace platí i pro execution-only. Alternativy: evropské ekvivalenty, CFD, status profesionálního klienta. | [IBKR FAQ – PRIIPs regulation](https://www.interactivebrokers.com/lib/cstools/faq/content/1136192471) *(přesměrováno z ibkr.info/node/2993)* | ✅ ověřeno v prohlížeči 11. 10. 2026 |
| XTB, Trading 212, Revolut | – | ❌ oficiální zdroj nenalezen, **na stránce nezmiňovat** |

**Závěr pro texty:** netvrdit „v Česku americké ETF nekoupíte". Pravdivě: *u řady brokerů je retailový klient z EU kvůli chybějícímu KID nekoupí (např. Interactive Brokers), u některých ano (např. Fio). Evropské UCITS verze mají KID a jsou běžně dostupné.*

## 5. Daně (český daňový rezident, fyzická osoba)

> Na stránce jen jako obecná informace s odkazem na zdroj a upozorněním, že nejde o daňové poradenství.

| Tvrzení | Přesné znění / údaj | Zdroj | Stav |
|---|---|---|---|
| **Časový test 3 roky:** příjem z prodeje cenného papíru je osvobozen, pokud mezi nabytím a prodejem uplynou víc než 3 roky | § 4 odst. 1 písm. u): „…přesáhne-li doba mezi nabytím a úplatným převodem tohoto cenného papíru… dobu 3 let" | [Zákon 586/1992 Sb., § 4 – zakonyprolidi.cz](https://www.zakonyprolidi.cz/cs/1992-586), znění 1. 8. 2026 – 31. 12. 2026 | ✅ |
| **Limit 100 000 Kč:** příjmy z prodeje cenných papírů jsou osvobozeny, pokud jejich úhrn za rok nepřesáhne 100 000 Kč | § 4 odst. 1 písm. t): „…pokud jejich úhrn u poplatníka nepřesáhne ve zdaňovacím období částku 100000 Kč" | tamtéž | ✅ |
| Strop 40 mil. Kč | V aktuálním znění § 4 odst. 3 se vztahuje **jen na kryptoaktiva** (písm. zk), ne na cenné papíry | tamtéž | ✅ → u ETF **neuvádět** |
| **Dividendy z USA:** srážková daň v USA max. **15 %** hrubé dividendy. Platí i pro dividendy od *Regulated Investment Company*, tedy americké fondy včetně ETF. | Smlouva ČR–USA, čl. 10 odst. 2 písm. b) a odst. 3 | [Sdělení 32/1994 Sb. – zakonyprolidi.cz](https://www.zakonyprolidi.cz/cs/1994-32) | ✅ |
| Formulář **W-8BEN** předává zahraniční osoba plátci (brokerovi), „whether or not you are claiming a reduced rate of, or exemption from, withholding" | – | [IRS – About Form W-8BEN](https://www.irs.gov/forms-pubs/about-form-w-8-ben) | ✅ |
| Daňový rezident ČR zdaňuje i příjmy ze zahraničí. Zahraniční daň lze započíst metodou zápočtu (§ 38f) přes **Přílohu č. 3** přiznání, a to jen do výše podle smlouvy o zamezení dvojího zdanění. | – | [Finanční správa – Obecné informace DPFO](https://financnisprava.gov.cz/cs/dane/dane/dan-z-prijmu/fyzicke-osoby/obecne-informace), [Příloha č. 3 (PDF)](https://financnisprava.gov.cz/assets/cs/prilohy/fs-financni-sprava-cr/priloha-3-k_priznani-z-prijmu-FO.pdf) | ✅ *(pokyny k Příloze 3 jsou ze starších let, princip zápočtu dle § 38f trvá)* |

**Co na stránce NEBUDE** (bez dostatečného zdroje): daňové srovnání akumulačních UCITS proti distribučním US ETF (zdanění uvnitř fondu), výpočty daně v kalkulačce, sazba daně z dividend v ČR.

## 6. Scénáře výnosu z KID (graf na 5 let, D21)

- **Fond:** SPDR S&P 500 UCITS ETF (Acc), SPYL, ISIN IE000XZSV718. **KID ze dne 19. 2. 2026**, staženo 11. 10. 2026: [ssga.com – KID (PDF)](https://www.ssga.com/library-content/kids?isin=IE000XZSV718&documentType=kid&country=ie&language=en_gb&ticker=spyl-gy)
- Doporučená doba držení **5 let**, příklad investice 10 000 USD. Průměrný roční výnos po nákladech při ukončení po 5 letech:
  - stresový **−21,8 %**
  - nepříznivý **3,7 %** (období 9/2024–10/2025)
  - umírněný **14,8 %** (2/2017–2/2022)
  - příznivý **18,5 %** (10/2016–10/2021)
- KID uvádí, že jde o ilustrace podle nejhoršího, průměrného a nejlepšího výsledku produktu za posledních 10 let a že trhy se mohou vyvíjet úplně jinak.
- PDF je šifrované, text byl vytažen knihovnou `pypdf`. Hodnoty jsou v [`kid_scenarios.json`](kid_scenarios.json).
- **Omezení:** KID ilustruje jednorázovou investici. Na stránce aplikujeme průměrné roční výnosy i na měsíční vklady, a proto je u grafu popisek „ilustrace podle scénářů KID, ne předpověď".

## 7. Historické výnosy S&P 500 (delší horizont, D21)

- **Zdroj:** Aswath Damodaran, NYU Stern: [Historical Returns on Stocks, Bonds and Bills](https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html), sloupec *S&P 500 (includes dividends)*. Stránka uvádí „Updated: January 5, 2026", data za roky 1928–2025. Staženo 11. 10. 2026.
- Roční výnosy jsou v [`sp500_annual_returns.csv`](sp500_annual_returns.csv). Tabulka byla vyparsována přímo z HTML a 5 hodnot (1931, 1954, 2008, 2022, 2025) bylo křížově ověřeno nezávislým přepisem.
- **Výpočet** ([`sp500_rolling.json`](sp500_rolling.json)): pro každé N = 5–30 let všechna klouzavá N-letá období, z nich průměrný roční (geometrický) výnos: nejhorší, medián a nejlepší, s obdobím.
- **Vlastnosti:** nominální výnos v **USD**, včetně dividend, **bez daní, poplatků a vlivu kurzu CZK**. Jde o historii, ne předpověď.

## 8. Název značky „Fingramo"

- [ARES](https://ares.gov.cz/) (11. 10. 2026): „Fingramo" bez výsledku. Existuje podobná **FINGRAM CS s.r.o.** (IČO 05876761, Náchod, jiný obor).
- Web: přesná shoda nenalezena. Podobná španělská Fingrama S.L. (nemovitosti).
- Závěr: kolize nehrozí. Fingramo zůstává jako fiktivní značka ukázky.

## 9. Srovnávací konverze landing pages (pro odhad v README)

Staženo 11. 10. 2026, přečteno přímo na stránkách Unbounce ve vestavěném prohlížeči. Jde o mediány landing pages postavených v Unbounce, ne o průzkum celého trhu.

| Údaj | Hodnota | Zdroj |
|---|---|---|
| Medián konverze, podkategorie **investování** | 3,9 % (nejlepší stránky až 20,6 %) | [Unbounce – Finance & Insurance benchmarks](https://unbounce.com/conversion-benchmark-report/finance-insurance-conversion-rate/) |
| Medián konverze, finanční služby celkem | 8,3 % | tamtéž |
| Medián konverze, pojištění | 18,2 % | tamtéž |
| Finanční služby z placených sociálních sítí | 9,3 % (Facebook 10,1 %, Instagram 15,5 %) | tamtéž |
| Období dat a rozsah | 23. 7. 2023 – 23. 7. 2024; 41 tisíc landing pages, 464 mil. unikátních návštěvníků, 57 mil. konverzí | [Unbounce – Methodology (2024 Conversion Benchmark Report)](https://unbounce.com/conversion-benchmark-report/methodology/) |

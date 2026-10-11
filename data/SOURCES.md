# Zdroje dat

Pravidlo: každé číslo na stránce musí mít zdroj (URL) a datum stažení. Strojově čitelná data jsou v [`etf.json`](etf.json).
**Datum stažení všech údajů níže: 11. 10. 2026** (pokud není uvedeno jinak). Datum, ke kterému údaj platí („as of"), přebíráme od zdroje.

---

## 1. ETF obchodovaná na NYSE (weby správců)

| Ticker | Poplatek (TER) | Velikost (ETF třída) | Platí k | Burza | Index | Zdroj |
|---|---|---|---|---|---|---|
| SPY | 0,0945 % *(gross)* | 817,2 mld. USD | 8. 10. 2026 | NYSE Arca | S&P 500 | [ssga.com](https://www.ssga.com/us/en/intermediary/etfs/spdr-sp-500-etf-trust-spy) |
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

## 6. Název značky „Fingramo"

- [ARES](https://ares.gov.cz/) (11. 10. 2026): „Fingramo" bez výsledku. Existuje podobná **FINGRAM CS s.r.o.** (IČO 05876761, Náchod, jiný obor).
- Web: přesná shoda nenalezena. Podobná španělská Fingrama S.L. (nemovitosti).
- Závěr: kolize nehrozí. Fingramo zůstává jako fiktivní značka ukázky.

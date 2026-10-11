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

## 2. Evropské (UCITS) protějšky – justETF

| Pro | UCITS ETF | ISIN | TER | Velikost | Shoda | Zdroj |
|---|---|---|---|---|---|---|
| SPY | SPDR S&P 500 UCITS (Acc), SPYL | IE000XZSV718 | 0,03 % | 17 596 mil. EUR | stejný index | [justETF](https://www.justetf.com/en/etf-profile.html?isin=IE000XZSV718) |
| IVV | iShares Core S&P 500 UCITS (Acc), CSPX/SXR8 | IE00B5BMR087 | 0,07 % | 141 385 mil. EUR | stejný index | [justETF](https://www.justetf.com/en/etf-profile.html?isin=IE00B5BMR087) |
| VOO | Vanguard S&P 500 UCITS (Acc), VUAA | IE00BFMXXD54 | 0,07 % | 33 371 mil. EUR | stejný index | [justETF](https://www.justetf.com/en/etf-profile.html?isin=IE00BFMXXD54) |
| VTI | Xtrackers MSCI USA UCITS 1C, XD9U | IE00BJ0KDR00 | 0,03 % | 12 329 mil. EUR | **jiný index** (MSCI USA) | [justETF](https://www.justetf.com/en/etf-profile.html?isin=IE00BJ0KDR00) |
| VT | Vanguard FTSE All-World UCITS (Acc), VWCE | IE00BK5BQT80 | 0,14 % | 55 102 mil. EUR | **jiný index** (FTSE All-World) | [justETF](https://www.justetf.com/en/etf-profile.html?isin=IE00BK5BQT80) |
| SCHD | SPDR S&P U.S. Dividend Aristocrats UCITS (Dist), SPYD | IE00B6YX5D40 | 0,35 % | 3 261 mil. EUR | **jiný index** (S&P High Yield Dividend Aristocrats) | [justETF](https://www.justetf.com/en/etf-profile.html?isin=IE00B6YX5D40) |

Poznámky:
- **justETF je agregátor, ne správce.** Velikost fondu tam nemá datum (bereme datum stažení). **K ověření:** TER proti KID na webu správce, zejména u XD9U (0,03 %) a VWCE (0,14 %).
- Pro VTI a SCHD jsme nenašli UCITS fond se stejným indexem. Volba XD9U a SPYD je **nejbližší alternativa** a na stránce bude takto označená.

## 3. Kurz USD/CZK a EUR/CZK – ČNB

- **1 USD = 21,745 Kč, 1 EUR = 24,365 Kč**, kurz ČNB ze dne **9. 10. 2026** (č. 195), staženo 11. 10. 2026 (neděle, poslední vyhlášený kurz).
- Zdroj: [cnb.cz – denní kurz (txt)](https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt)

## 4. Dostupnost amerických ETF pro české drobné investory

| Tvrzení | Zdroj | Stav |
|---|---|---|
| Nabízet produkt spadající pod PRIIPs bez KID je porušením nařízení. Distributor, který jen provádí pokyny klienta (bez nabídky a poradenství), ale povinnost dle čl. 13(1) nemá. | [ČNB – Otázky a odpovědi k PRIIPs (RS2018-12)](https://www.cnb.cz/cs/dohled-financni-trh/legislativni-zakladna/stanoviska-k-regulaci-financniho-trhu/RS2018-12) | ✅ ověřeno na stránce |
| Fio banka: „U nás můžete obchodovat i s americkými ETF." Zároveň uvádí, že ETF nenabízí, pouze umožňuje přístup na trhy. | [fio.cz/akcie-investice/etf](https://www.fio.cz/akcie-investice/etf) | ✅ ověřeno na stránce |
| Interactive Brokers: emitenti amerických ETF obvykle KID nevydávají, proto je retailoví klienti z EHP a UK nemohou koupit. Alternativy: evropské ekvivalenty, CFD, status profesionálního klienta. | [IBKR Knowledge Base – PRIIPs (node 2993)](https://www.ibkr.info/node/2993) | ⚠️ Stránka vrací automatickému přístupu chybu 403. Obsah zatím známe jen z výsledků vyhledávání, **ověřit ručně v prohlížeči**. |
| XTB, Trading 212, Revolut | – | ❌ oficiální zdroj nenalezen, **na stránce nezmiňovat** |

**Závěr pro texty:** netvrdit „v Česku americké ETF nekoupíte". Pravdivě: *u řady brokerů je retailový klient z EU kvůli chybějícímu KID nekoupí (např. Interactive Brokers), u některých ano (např. Fio). Evropské UCITS verze mají KID a jsou běžně dostupné.*

## 5. Daně

Zatím nic. Informace o dani z dividend a časovém testu se na stránce neobjeví, dokud nebude zdroj (Finanční správa nebo zákon).

## 6. Název značky „Fingramo"

- [ARES](https://ares.gov.cz/) (11. 10. 2026): „Fingramo" bez výsledku. Existuje podobná **FINGRAM CS s.r.o.** (IČO 05876761, Náchod, jiný obor).
- Web: přesná shoda nenalezena. Podobná španělská Fingrama S.L. (nemovitosti).
- Závěr: kolize nehrozí. Fingramo zůstává jako fiktivní značka ukázky.

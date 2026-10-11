# Reklamy – Meta (Instagram / Facebook), mobil

**Stav:** texty SCHVÁLENY Mikym 11. 10. 2026 (D18). Vizuály hotové (11. 10.): `ad-a-4x5.png`, `ad-a-9x16.png`, `ad-b-4x5.png`, `ad-b-9x16.png`. Zdroj: `ads/src/ad.html` – stejné tokeny jako stránka, čísla načtená z `data/etf.json` (žádné ručně opsané). Render: Playwright, 1080×1350 a 1080×1920.
Kanál a úhly: D6. Tón: vykání (D7). Žádné sliby výnosů, každé číslo ze `data/SOURCES.md`.

Obě verze nabízejí **totéž** (zdarma srovnání ETF + poplatky v Kč). Liší se jen **úhel** – A/B test úhlu.

---

## Verze A – „Kde je VOO?" (bolest)

| Prvek | Text |
|---|---|
| **Vizuál (4:5, 1080×1350)** | Velký nápis: **„Chcete VOO? Váš broker ho možná nenabízí."** · karta: VOO, SPY, VT → jejich evropské verze s poplatky · dole „Srovnání 6 ETF zdarma" · upozornění na riziko. *(Přeškrtnutí tickerů z návrhu vypuštěno – naznačovalo by, že fond koupit nejde vůbec, což neplatí, viz Fio.)* |
| **Primární text** | Viděli jste na sociálních sítích VOO nebo SPY, ale u svého brokera je nenajdete? Důvod je jednoduchý: americké fondy obvykle nemají dokument KID, který evropská pravidla pro drobné investory vyžadují. Ukážeme vám, které evropské verze sledují stejný index – a kolik vás budou stát poplatky v korunách. Zdarma. |
| **Titulek** | Hledáte VOO? Tady je evropská verze. |
| **Popis** | Srovnání 6 ETF z NYSE · data od správců |
| **Tlačítko** | Zjistit více |
| **Navazuje na hero** | „Chcete VOO nebo SPY? Ukážeme vám, co si z Česka opravdu koupíte." |

## Verze B – „Stejný index, jiný poplatek" (čísla)

| Prvek | Text |
|---|---|
| **Vizuál (4:5, 1080×1350)** | Dva sloupce vedle sebe: **SPY 0,0945 %** · **VOO 0,03 %** · nadpis „Stejný index S&P 500. Jiný poplatek." · dole: „Kolik to je v Kč u vaší částky? · fingramo" |
| **Primární text** | SPY i VOO sledují stejný index S&P 500. Roční poplatek SPY je ale 0,0945 %, u VOO 0,03 % (údaje správců k 10/2026). Kolik to dělá v korunách u vaší částky? Spočítejte si to za 10 vteřin – u 6 populárních ETF z newyorské burzy i jejich evropských verzí. |
| **Titulek** | Kolik vás stojí poplatky ETF? V korunách. |
| **Popis** | Kalkulačka zdarma · bez registrace |
| **Tlačítko** | Zjistit více |
| **Navazuje na hero** | „Stejný index, jiný poplatek. Kolik vás ETF stojí v korunách?" |

Formát 9:16 (Stories/Reels): stejný text, vertikální kompozice, bezpečná zóna 250 px nahoře a dole.

---

## Odkazy s UTM

```
A: https://fingramo.vercel.app/?utm_source=meta&utm_medium=paid_social&utm_campaign=etf_nyse_leadmagnet_2026_10&utm_content=a
B: https://fingramo.vercel.app/?utm_source=meta&utm_medium=paid_social&utm_campaign=etf_nyse_leadmagnet_2026_10&utm_content=b
```

- `utm_content` přepíná nadpis hero (message match) a v PostHogu odděluje trychtýř A vs. B.
- Doporučené nastavení kampaně (pro README): cíl *Leads* / *Conversions* s událostí `form_submit`, stejný rozpočet na A i B, publikum ČR 25–40, zájmy: investování, ETF, osobní finance; umístění jen mobilní feed + Stories.

## Regulatorní kontrola textů
- Žádné tvrzení o výnosech ani „zaručeně", „bez rizika".
- Čísla (TER) se zdrojem a datem na stránce.
- „Váš broker ho **možná** nenabízí" – ne „nekoupíte" (Fio americká ETF zpřístupňuje, SOURCES §4).
- Na stránce je upozornění na riziko a „nejde o investiční doporučení".

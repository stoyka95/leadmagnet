# Fingramo – srovnání ETF z NYSE pro české investory

Praktická úloha pro Clientelo (Junior AI Developer), **zadání B: konverzní landing page**. Autor: Mykola Stoyka. Stránku jsem postavil s AI (Claude Code), viz [sekce 11](#11-jak-jsem-pracoval-s-ai).

## 1. Co to je
Landing page pro českého drobného investora z reklamy na mobilu. Spočítá mu poplatky populárních ETF z newyorské burzy v korunách, ukáže jejich evropské verze a alternativy, které si z Česka koupí, a výměnou za e-mail mu pošle celé osobní srovnání.

> **Fingramo je fiktivní značka** vytvořená pro výběrové řízení (D14). Data o fondech, formulář, e-mail i měření jsou ale skutečné a fungují.

## 2. Odkazy
| | |
|---|---|
| **Stránka** | https://fingramo.vercel.app |
| **Reklamy** (vizuály a texty) | [ads/README.md](ads/README.md) · A: [4:5](ads/ad-a-4x5.png), [9:16](ads/ad-a-9x16.png) · B: [4:5](ads/ad-b-4x5.png), [9:16](ads/ad-b-9x16.png) |
| **Odkazy z reklam** | A: `https://fingramo.vercel.app/?utm_source=meta&utm_medium=paid_social&utm_campaign=etf_nyse_leadmagnet_2026_10&utm_content=a` · B: totéž s `utm_content=b` |
| **E-mail, který návštěvník dostane** | [mobil](docs/email-ukazka-mobil.png) · [desktop](docs/email-ukazka-desktop.png) · [PDF příloha](docs/email-ukazka-priloha.pdf) |
| **Dashboard měření** (PostHog, vyžaduje přístup) | https://eu.posthog.com/project/301598/dashboard/1014275 |
| **Repozitář** | https://github.com/stoyka95/leadmagnet |

#### Všechny varianty stránky (odkazy ověřené 12. 10. 2026)
Stránka má 3 nezávislé přepínače: **reklama** (`utm_content`), **živý A/B test první obrazovky** (`exp`, jinak náhodně 50/50) a **počet formulářů** (`forms`). Odkazy s `exp` a `forms` jsou pro kontrolu: vynutí variantu, která by jinak padla náhodou. Prohlížeč si `exp` a `forms` pamatuje do zavření záložky. Pro jinou variantu otevřete novou záložku, nebo variantu zadejte v odkazu (`?exp=control`, `?forms=2`).

| Varianta | Odkaz |
|---|---|
| Reklama A – „Chcete VOO?" (formulář bez zaškrtávacích polí, souhlas až po odeslání, D38) | https://fingramo.vercel.app/?utm_source=meta&utm_medium=paid_social&utm_campaign=etf_nyse_leadmagnet_2026_10&utm_content=a |
| Reklama B – „Stejný index, jiný poplatek" | https://fingramo.vercel.app/?utm_source=meta&utm_medium=paid_social&utm_campaign=etf_nyse_leadmagnet_2026_10&utm_content=b |
| Bez UTM (přímá návštěva = verze B) | https://fingramo.vercel.app/ |
| Reklama A + první obrazovka s tlačítkem (`control`) | https://fingramo.vercel.app/?utm_content=a&exp=control |
| Reklama A + částka hned na první obrazovce (`hero_input`) | https://fingramo.vercel.app/?utm_content=a&exp=hero_input |
| Reklama B + `control` | https://fingramo.vercel.app/?utm_content=b&exp=control |
| Reklama B + `hero_input` | https://fingramo.vercel.app/?utm_content=b&exp=hero_input |
| Varianta se 3 formuláři (třetí u srovnání fondů, otevře se tlačítkem) | https://fingramo.vercel.app/?forms=3 |
| Zpět na základ se 2 formuláři | https://fingramo.vercel.app/?forms=2 |
| Děkovací stránka (při přímém otevření s výchozími částkami) | https://fingramo.vercel.app/dekujeme |
| Zásady ochrany osobních údajů · Zdroje dat · stránka 404 | https://fingramo.vercel.app/zasady · https://fingramo.vercel.app/zdroje · https://fingramo.vercel.app/neexistuje |
| Náhledový obrázek pro sdílení (OG) | https://fingramo.vercel.app/og.png |

**Reklamy a e-mail v repozitáři:** reklama A [4:5](https://github.com/stoyka95/leadmagnet/blob/main/ads/ad-a-4x5.png) · [9:16](https://github.com/stoyka95/leadmagnet/blob/main/ads/ad-a-9x16.png), reklama B [4:5](https://github.com/stoyka95/leadmagnet/blob/main/ads/ad-b-4x5.png) · [9:16](https://github.com/stoyka95/leadmagnet/blob/main/ads/ad-b-9x16.png), [texty reklam](https://github.com/stoyka95/leadmagnet/blob/main/ads/README.md). E-mail (jedna šablona pro všechny varianty, liší se jen pozdravem se jménem a PDF přílohou): [mobil](https://github.com/stoyka95/leadmagnet/blob/main/docs/email-ukazka-mobil.png) · [desktop](https://github.com/stoyka95/leadmagnet/blob/main/docs/email-ukazka-desktop.png) · [HTML](https://github.com/stoyka95/leadmagnet/blob/main/docs/email-ukazka.html) · [PDF příloha](https://github.com/stoyka95/leadmagnet/blob/main/docs/email-ukazka-priloha.pdf).

## 3. Cílová skupina a nabídka za kontakt

**Pro koho (D1):** člověk ve věku 25–40 let s úsporami na spořicím účtu. Na Instagramu nebo YouTube viděl, že „všichni kupují VOO" nebo „SPY", a chce začít. Neví ale:
- jestli je mezi SPY, IVV a VOO rozdíl (stejný index, jiný poplatek),
- kolik ho poplatky stojí v korunách,
- proč americký fond u svého brokera možná nenajde. Chybí dokument KID, který EU vyžaduje pro drobné investory. U některých brokerů (např. Fio) ho ale koupí.

Přichází z reklamy na mobilu a má pár sekund.

**Co dostane za e-mail (D2, D27):** osobní srovnání pro svou částku. Obsahuje:
- 6 amerických ETF a jejich evropské verze a alternativy vedle sebe,
- poplatky v Kč na 10 a 20 let,
- 4 scénáře vývoje z dokumentu KID a historii S&P 500 pro zvolený počet let,
- otázky pro brokera a odkazy na zdroje.

Srovnání přijde e-mailem s **PDF v příloze** a hned se ukáže i na děkovací stránce.

**Hodnota je vidět před formulářem:** kalkulačka bez registrace hned ukáže, kolik zaplatí u nejlevnějšího a nejdražšího fondu a jaký je rozdíl v Kč. Detail (všech 12 fondů, scénáře, historie) je rozmazaný a odemkne se e-mailem (částečná brána, D25). Hlavní výsledek se záměrně neskrývá, protože zadání chce, aby hodnota byla zřejmá ještě před formulářem.

**Kdy o kontakt žádáme a proč (D3, D22, D35):**
1. **Hned pod výsledkem kalkulačky.** Je to moment největšího zájmu: návštěvník právě viděl svoje číslo a chce zbytek.
2. **Na konci stránky** jako záchyt pro ty, kdo kalkulačku přeskočili.
3. **Tlačítko v horní liště** vede nejdřív ke kalkulačce („Spočítat poplatky") a po prvním výpočtu k formuláři („Získat srovnání", D30).

**Formulář:** povinný je jen e-mail. Jméno a telefon jsou nepovinné a u telefonu je vysvětleno, proč se ptáme. Souhlas s dalšími tipy e-mailem a souhlas s telefonátem jsou dvě samostatná, nezaškrtnutá pole. **Výjimka pro reklamu A (D38):** formulář nemá žádná zaškrtávací pole a oba souhlasy se nabídnou až po odeslání na děkovací stránce, jedním tlačítkem každý. Souhlas se tak nikdy neváže na žádost o srovnání.

## 4. Dvě verze reklamy a návaznost na první obrazovku
Obě verze jsou pro Instagram a Facebook na mobilu (4:5 a 9:16). Nabízejí totéž a liší se úhlem (D6). Podrobné texty jsou v [ads/README.md](ads/README.md).

| | **A – „bolest"** | **B – „čísla"** |
|---|---|---|
| Vizuál | „Chcete VOO? Váš broker ho možná nenabízí." + páry VOO → VUAA, SPY → SPYL, VT → VWCE | „Stejný index S&P 500. Jiný poplatek." + SPY 0,0945 % vs. VOO 0,03 % |
| Nadpis stránky (podle `utm_content`) | „Chcete VOO nebo SPY? Ukážeme vám, co si z Česka opravdu koupíte." | „Stejný index, jiný poplatek. Kolik vás ETF stojí v korunách?" |
| Karta na 1. obrazovce | stejné páry jako v reklamě (D29) | stejné srovnání SPY vs. VOO |

První obrazovka opakuje slib a čísla své reklamy, takže návštěvník hned pozná, že je na správném místě. Varianta se vybere podle `utm_content` ještě před vykreslením, takže stránka neproblikne. Bez UTM se ukáže verze B. Obě verze jsou otestované na produkci celou cestou až k odeslání formuláře (D35, test `tests/e2e/ad-variants.spec.ts`).

**Pozor při vyhodnocení:** návštěvníci z reklamy A mají navíc formulář bez zaškrtávacích polí (souhlas až po odeslání, D38). Rozdíl v konverzi mezi A a B proto může způsobit reklama i formulář a od sebe je oddělit nepůjde. Vědomé rozhodnutí: kratší formulář dostane jasně ohraničená skupina.

Čísla v reklamách se načítají z `data/etf.json`, nejsou opsaná ručně. Reklamy obsahují upozornění na riziko a žádné sliby výnosů.

## 5. Pořadí sekcí a proč
| # | Sekce | Proč právě tady |
|---|---|---|
| 1 | **Hero** podle reklamy, tlačítko „Spočítat moje poplatky" | Návštěvník z reklamy rozhoduje za pár sekund. První obrazovka opakuje slib reklamy a nabízí jediný krok. |
| 2 | **Kalkulačka poplatků** + formulář pod výsledkem | Hodnota musí přijít před žádostí o kontakt. Osobní výsledek za ~10 s je důvod chtít celé srovnání a formulář je hned u něj. |
| 3 | **Srovnání 6 ETF** (americký originál vs. evropská verze nebo alternativa, přepínač S&P 500 / celé USA / svět / dividendy) | Druhý nástroj pro analytičtější návštěvníky a pro ty z reklamy A („kde je VOO"). Tlačítko vede k formuláři u kalkulačky. |
| 4 | **Dobré vědět**: proč VOO u brokera možná nenajdete (KID, PRIIPs) a kdy se z prodeje neplatí daň | Odpovídá na otázku, která vznikne hned po srovnání. Krátce a se zdroji. |
| 5 | **Co vám pošleme** (5 bodů + náhled e-mailu) | Zopakuje hodnotu před posledním formulářem pro ty, kdo první formulář přeskočili. |
| 6 | **Časté otázky + Kdo za srovnáním stojí + závěrečný formulář** | Odstraní poslední pochybnosti (nejsme broker ani poradce, nikdo za srovnání neplatí, odkud jsou data) těsně před formulářem. |
| 7 | **Patička**: riziko, zdroje, zásady, „ukázkový projekt" | Povinné náležitosti. |

Stránka je na mobilu záměrně kompaktní:
- dvě témata jsou v jedné sekci (D31),
- originál a evropská verze jsou vedle sebe,
- zamčený seznam je jen ukázka (D35).

Na šířce 390 px má stránka 9 623 px (varianta `control`, u `hero_input` 9 654 px) a formulář u kalkulačky začíná na 2 233 px. Změřeno na produkci 12. 10.

## 6. Interaktivní prvky a co přijde po odeslání
- **Kalkulačka poplatků** (hlavní prvek, D16):
  - Zadává se jednorázová částka, měsíční částka a počet let. Výsledek se přepočítá okamžitě, bez tlačítka.
  - Počítá jen roční poplatek fondu (TER), bez slibů výnosu. Volitelně jde zadat vlastní předpoklad výnosu („váš předpoklad, ne náš slib").
  - Vede k formuláři hned pod výsledkem a k tlačítkům „Odemknout…" u rozmazaného detailu.
- **Srovnání fondů** (D4): přepínač podle toho, co chce návštěvník mít v portfoliu. Ke každému americkému fondu ukáže evropský fond s ISIN. Když sleduje stejný index, je označený „Evropská verze“, jinak „Evropská alternativa“ s popisem rozdílu (D39). Vede k formuláři.
- **Živý A/B test první obrazovky (H2):** polovina návštěvníků má místo tlačítka rovnou pole „Kolik chcete investovat měsíčně?" (D28).

**Po odeslání formuláře:**
1. **Děkovací stránka** hned ukáže celé srovnání pro zadanou částku, tlačítko „Uložit jako PDF" a 3 kroky „Co dál?" (vybrat brokera, ověřit fond podle ISIN, přečíst KID).
2. **E-mail** se stejným obsahem a **PDF v příloze** (Resend, odesílatel `srovnani@mail.stoyka.eu`).
3. Na děkovací stránce je **jedna dobrovolná otázka** „Už investujete?" pro segmentaci a možnost **sdílet** odkaz přes WhatsApp nebo zkopírováním (D32).
4. **Ochrana formuláře:** nejvýš 3 odeslání na jeden e-mail za 24 hodin, aby se formulář nedal zneužít k posílání e-mailů cizím lidem. Navíc skrytá past na roboty.

## 7. Data a zdroje
Všechna čísla jsou v [data/SOURCES.md](data/SOURCES.md) se zdrojem (URL) a datem stažení a strojově v [data/etf.json](data/etf.json). Na stránce je u čísel zdroj a datum a plný přehled je na [/zdroje](https://fingramo.vercel.app/zdroje).

- **Poplatky, velikost a index fondů:** přímo z webů správců (State Street, iShares, Vanguard, Schwab, DWS), **staženo 11. 10. 2026**. Poplatky evropských fondů jsou navíc ověřené v dokumentech KID a všechny sedí (SOURCES.md, „Druhá kontrola TER").
- **Kurz ČNB** z 9. 10. 2026 pro přepočet velikosti fondů. Poplatek je procento, takže ho kurz neovlivní.
- **Dostupnost amerických ETF:** IBKR, Fio, ČNB.
- **Daně:** zákon o daních z příjmů (§ 4), smlouva ČR–USA, IRS, Finanční správa. Jde o obecnou informaci, ne daňové poradenství.
- **Scénáře:** dokument KID fondu SPYL. **Historie S&P 500:** A. Damodaran, NYU Stern. Testy rozsahy přepočítávají ze surových dat.
- **Testy hlídají, že poplatky a URL v `etf.json` odpovídají tabulkám v SOURCES.md.**

Data jsou statická (stav k 11. 10. 2026). Pro ostrý provoz by se musela pravidelně obnovovat, viz sekce 13.

## 8. Měření

Podrobnosti (všechny události a jejich vlastnosti, velikost vzorku pro A/B test, čistota dat) jsou v [docs/MEASUREMENT.md](docs/MEASUREMENT.md).

#### Dashboard
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

#### Co je zapnuté
- **UTM měření:** reklamy nesou `utm_source`, `utm_medium`, `utm_campaign` a `utm_content` (`a` / `b` = verze reklamy). Každá událost má vlastnost `ad_variant`, takže jde každý krok rozdělit podle reklamy. UTM se ukládají i ke kontaktu v databázi (Supabase, tabulka `leads`), takže jde lead spárovat s reklamou i bez PostHogu.
- **Heatmapy kliknutí:** zapnuté (`capture_heatmaps` v kódu, zapnuté i v nastavení projektu). Ukazují souhrnně, kam lidé klikají, ne jednotlivé návštěvníky.
- **Bez cookies:** PostHog běží v režimu bez cookies (`cookieless_mode: 'always'`), návštěvníky spojuje na serveru podle denně měněného hashe. IP adresy se neukládají (nastavení projektu, ověřeno v datech: žádná událost nemá IP ani polohu).

#### Co je záměrně vypnuté
- **Záznamy relací (session recordings) jsou záměrně vypnuté.** Zaznamenávají chování konkrétního člověka na stránce, a to by bez souhlasu (cookie lišty) nebylo v pořádku. Vypnuté jsou přímo v kódu (`disable_session_recording: true`), takže se nenahrávají, ani když je funkce v nastavení PostHog projektu povolená. Pro ostré nasazení: zapnout je jen po souhlasu návštěvníka.
- **Autocapture** (automatické zachytávání všech kliknutí) je v kódu vypnutý. Posílají se jen pojmenované události trychtýře, takže data jsou čistší a na mobilu běží méně JavaScriptu. Nastavení projektu v PostHogu k tomu přidává dvě souhrnná měření: **kliknutí bez reakce** (dead clicks, ukazují místa, která vypadají klikatelně a nejsou) a **rychlost stránky** (web vitals). Ani jedno nepracuje s osobními údaji.

#### Trychtýř (události)
`$pageview` (s UTM) → `scroll_50` → `cta_click` → `tool_used` (kalkulačka / srovnání) → `form_start` → `form_submit` (jen když server kontakt opravdu uložil) → `thank_you_view`. Navíc se měří `form_error`, `hero_calc_submit`, `lead_segment`, `consent_given` (souhlas na děkovací stránce u reklamy A, D38) a `share_click`. Každý kontakt v databázi má náhodné `lead_ref`, stejné jako u jeho `form_submit`, takže jde dohledat jeho cestu.

**Konverze** = `form_submit` potvrzený serverem ÷ unikátní návštěvníci, v rozpadu podle varianty reklamy.

## 9. Očekávaná konverze
**Odhad: 4–6 % návštěvníků z reklamy odešle formulář (střed 5 %).** Nejistota je velká, realisticky 2–8 %. Stránka zatím nemá provoz z reklamy, takže jde o odhad, ne o měření.

**Z čeho vycházím:** srovnávací report Unbounce 2024 (data 7/2023–7/2024, 41 tisíc landing pages, zdroj v [SOURCES.md §9](data/SOURCES.md)):
- medián landing pages v kategorii **investování je 3,9 %**, nejlepší stránky mají až 20,6 %,
- finanční služby celkem mají 8,3 % a z placených sociálních sítí 9,3 %. Tato čísla ale zvedá pojištění (18,2 %), takže pro investice jsou příliš optimistická.

**Proč odhaduji víc než medián investování:**
- nabídka je zdarma a bez závazku a povinné pole je jen e-mail,
- návštěvník vidí svůj osobní výsledek dřív, než ho o něco žádáme, a detail se odemkne e-mailem,
- první obrazovka navazuje na reklamu a stránka je rychlá (Lighthouse na mobilu: výkon 97–100, ostatní kategorie 100).

**Proč ne víc:**
- jde o studený provoz ze sociálních sítí, téma investic vyžaduje důvěru a značka je neznámá,
- formulář není na první obrazovce (na mobilu začíná asi 2,7 výšky obrazovky pod začátkem stránky),
- počítám přísně: jen kontakty, které server opravdu uložil, a protože měřím bez cookies, počítá se stejný návštěvník každý den znovu.

**Co to znamená:** na 1 000 návštěv zhruba 40–60 kontaktů. Cenu za kontakt ukáže dashboard, až se do něj doplní útrata za reklamu. Kdyby byla konverze po prvních ~1 000 návštěvách pod 2 %, začal bych hypotézou H1 (brána) a kontrolou, kde návštěvníci z trychtýře odpadají.

## 10. Tři hypotézy pro A/B test

Seřazené podle očekávaného dopadu na počet kontaktů (D28). Odhad dopadu je **úvaha, ne naměřené číslo**: stránka zatím nemá provoz z reklamy, takže skutečnou velikost efektu ukáže až test. Co test dokáže spolehlivě rozlišit, je spočítané níže.

#### H1 – Jak moc schovat výsledek za e-mail (brána) · očekávaný dopad: největší
- **Hypotéza:** částečná brána (hlavní výsledek vidět, detail rozmazaný) přinese víc kontaktů než výsledek bez rozmazání, a přitom nesníží důvěru ani používání kalkulačky.
- **Co se změní:** kontrola = dnešní stav (D25): vidět je vložená částka, poplatky nejlevnějšího a nejdražšího fondu a rozdíl SPY vs. VOO v Kč. Rozmazané jsou řádky všech 12 fondů, scénáře z KID a historie S&P 500. Varianta = nic rozmazané, formulář jen nabízí poslání do e-mailu a PDF.
- **Metrika úspěchu:** podíl návštěvníků, kteří odeslali formulář (`form_submit` ÷ unikátní návštěvníci). **Hlídací metriky:** `tool_used` (nepřestali lidé počítat?), `scroll_50`, kliknutí na tlačítka „Odemknout…" (`cta_click` s `gate_*`) a podíl kontaktů se souhlasem s dalšími e-maily. Když varianta s bránou přinese víc kontaktů, ale méně souhlasů, jsou kontakty méně kvalitní.
- **Proč největší dopad:** brána mění motivaci dát e-mail přesně ve chvíli, kdy návštěvník vidí výsledek, tedy u hlavního formuláře. Zároveň je to nejrizikovější změna: příliš velká brána jde proti zadání („hodnota má být zřejmá ještě před formulářem").
- **Stav:** popsáno, v kódu není. Přepínač by se přidal stejně jako u H2.

#### H2 – Kalkulačka už na první obrazovce · očekávaný dopad: střední · **běží živě**
- **Hypotéza:** když návštěvník z reklamy zadá částku hned na první obrazovce, dostane se k výsledku rychleji a víc lidí odešle formulář.
- **Co se změní:** kontrola `control` = tlačítko „Spočítat moje poplatky". Varianta `hero_input` = pole „Kolik chcete investovat měsíčně?" a tlačítko „Spočítat", hodnota se přenese do kalkulačky. Rozdělení 50/50 náhodně, v rámci záložky (D28).
- **Metrika úspěchu:** `form_submit` ÷ unikátní návštěvníci podle `exp_hero_calc`. **Vedlejší:** `tool_used`, `form_start`. **Kontrolní:** jak často se pole v hero vůbec použije (`hero_calc_submit`).
- **Proč střední dopad:** zkracuje cestu k výsledku o jeden krok, ale motivace dát e-mail se nemění.
- **Kde je vidět:** [A/B test H2](https://eu.posthog.com/project/301598/insights/HSttab8L).

#### H3 – Méně polí ve formuláři · očekávaný dopad: nejmenší
- **Hypotéza:** formulář jen s e-mailem (bez nepovinného jména a telefonu) odešle víc lidí, protože vypadá kratší, a přijdeme jen o málo údajů navíc.
- **Co se změní:** kontrola = e-mail (povinný) + jméno a telefon (nepovinné), dva samostatné souhlasy (D25, D35). Varianta = jen e-mail a souhlas s tipy e-mailem.
- **Metrika úspěchu:** `form_start` → `form_submit` (kolik rozepsaných formulářů se dokončí). **Hlídací:** kolik kontaktů má dnes jméno a telefon (`has_name`, `has_phone`). Když je skoro nikdo nevyplňuje, varianta nic neztrácí.
- **Proč nejmenší dopad:** nepovinná pole se dají přeskočit a povinné je už teď jen jedno, takže formulář je už teď krátký.
- **Stav:** popsáno, v kódu není.

#### Kolik návštěv test potřebuje
Pro každou hypotézu stejně (dvoustranný test, α = 0,05, síla 80 %, výpočet v [docs/MEASUREMENT.md](docs/MEASUREMENT.md)): při výchozí konverzi 6 % je k odhalení zlepšení o 30 % potřeba asi **3 100 návštěv na variantu**, pro zlepšení o 20 % asi 6 700. Proto běží vždy jen jeden test naráz a vyhodnocuje se až po dosažení počtu, ne průběžně.

#### Další kandidát: 2, nebo 3 formuláře
Základní verze má 2 formuláře (u kalkulačky a na konci). Varianta se třetím formulářem u srovnání fondů je připravená a zapne se odkazem `?forms=3`; vlastnost `forms_variant` je u všech událostí (D35). Hypotéza: třetí formulář zachytí lidi, kteří přišli kvůli srovnání a kalkulačku přeskočili, ale stránku prodlouží a může působit vtíravě. Metrika: `form_submit` celkem a podle `form_location`. Na řadu přijde po H2, aby se testy nemíchaly.

## 11. Jak jsem pracoval s AI
**Otevřeně: nejsem klasický programátor.** Stavím pomocí AI nástrojů (Claude Code, Lovable, Supabase). Tuto stránku od plánu po testy napsal Claude Code podle mých pokynů. Moje práce byla zadávat, rozhodovat, kontrolovat a vracet chyby k opravě. Celý průběh je v [docs/AI-WORK-NOTES.md](docs/AI-WORK-NOTES.md) a v exportech konverzací ve složce [ai-log/](ai-log/).

#### Jaké pokyny AI dostala
- Předem jsem připravil [CLAUDE.md](CLAUDE.md), který Claude Code načte na začátku každé session. Obsahuje zadání, pravidla práce a seznam rozhodnutí, na která se mě má AI ptát.
- Hlavní pravidla:
  - nejdřív plán, pak kód,
  - u každého klíčového rozhodnutí 2–4 varianty s doporučením a čekat na moji odpověď,
  - nikdy nevymýšlet data, každé číslo se zdrojem,
  - commitovat po malých krocích a nepřepisovat historii,
  - chyby AI opravovat samostatným `fix:` commitem a zapisovat je.
- Pak jsem zadával po fázích (data → obsah → stavba → měření → testy → README) a průběžně posílal připomínky ze screenshotů a z prohlížení stránky.

#### Jak jsem výstup kontroloval
- **Rozhodnutí dělám já.** V [docs/DECISIONS.md](docs/DECISIONS.md) je 39 zapsaných rozhodnutí. U řady z nich jsem zvolil jinou variantu, než AI doporučila: například dva interaktivní prvky, jméno a telefon ve formuláři, vykání, vizuální styl a fiktivní značku.
- **Data proti zdroji, ne proti paměti AI.** Každé číslo je z webu správce nebo z dokumentu KID a poplatky jsou ověřené dvakrát. Když web blokoval stahování, AI ho otevřela v prohlížeči.
- **Testy:**
  - 86 unit testů hlídá výpočty, shodu dat se zdroji, API, e-mail a PDF.
  - 133 E2E testů běží v prohlížeči na mobilu i desktopu, lokálně i proti produkci. Pokrývají celou cestu z obou reklam, přístupnost (axe), dotykové plochy 44 px, souhlasy a měření.
  - Lighthouse na mobilu (produkce, 12. 10., 8 měření): výkon 97–100, nejčastěji 100 (LCP 1,5 s). Přístupnost, best practices a SEO vždy 100.
  - Detail je v [docs/TESTING.md](docs/TESTING.md).
- **Kontrola na produkci, ne jen lokálně:** testovací kontakt na produkci, kontrola řádku v databázi, doručení e-mailu s PDF v Resendu a událostí v PostHogu.
- **Výstup jiné AI** (Antigravity od Googlu) jsem nepřevzal naslepo. Claude ho ověřil proti datům a pravidlům a zachytil v něm faktické chyby. Například jako nejlevnější evropskou verzi uvedl fond, který nejlevnější není, a navrhl formulaci, která by byla investičním doporučením.

#### Kde se AI spletla a co se opravilo
Výběr, všechno je v AI-WORK-NOTES:
- Tvrdila, že americká ETF si „u většiny brokerů v EU nekoupíte". Ověření ukázalo, že Fio je nabízí. Texty jsou teď přesné podle zdrojů.
- Z paměti uváděla zastaralé údaje, například index VTI nebo daňový limit. Na stránku jde jen to, co je v SOURCES.md.
- **UTM se do kontaktů vůbec neukládaly a vazba kontakt ↔ analytika nefungovala.** Bez toho by nešlo vyhodnotit reklamy. Obojí AI našla při kontrole a opravila.
- API fungovalo lokálně, ale na Vercelu padalo. Od té doby se každá serverová změna testuje na produkci.
- Lokální vývoj posílal události do produkční analytiky a e-mail návštěvníka se zbytečně držel v prohlížeči. Obojí je opravené.
- Brána slibovala „Odemknout 4 scénáře", ale scénáře v e-mailu nebyly. Doplnily se, aby slib platil.
- Výšku stránky jednou zapsala odhadem místo měření a při úklidu ukončila víc procesů v počítači, než měla. Obojí přiznala a zapsala.

**Co z toho plyne:** AI je rychlá, ale umí sebevědomě tvrdit nepravdu. Proto mi funguje:
- pevný rámec (CLAUDE.md),
- ptát se na každé důležité rozhodnutí,
- kontrolovat proti zdrojům a testům,
- nechat AI chyby zapisovat, ne schovávat.

## 12. Rozhodnutí a jejich důvody
Všech 39 rozhodnutí s variantami, mou volbou a důvody je v [docs/DECISIONS.md](docs/DECISIONS.md). Plán a stav fází jsou v [docs/PLAN.md](docs/PLAN.md), texty stránky v [docs/CONTENT.md](docs/CONTENT.md).

Kde zadání nebylo jednoznačné, rozhodl jsem takto:
- **„ETF z NYSE" vs. co si Čech opravdu koupí:** stránka srovnává americké fondy z NYSE Arca, ale poctivě říká, že je drobný investor z EU u řady brokerů nekoupí, a ke každému ukazuje evropskou verzi (D1, D12).
- **„Mohli bychom zítra spustit reklamu":** stránka technicky běží naostro (data, formulář, e-mail, měření). Značka je ale fiktivní, protože jde o ukázku. Co je potřeba před ostrou kampaní vyměnit, je v sekci 13 a v části o soukromí (D14).
- **Měření bez cookie lišty:** měřím bez cookies a bez záznamů relací, takže stránka souhlas s cookies nepotřebuje (D24, D33).

## Soukromí a právní stránka
**Co měříme a proč:** cestu návštěvníka po pojmenovaných událostech (sekce 8), abychom věděli, která reklama a který krok funguje. Měření běží bez cookies a bez ukládání IP adres. Souhrnné heatmapy kliknutí jsou zapnuté: ukazují celkový obraz, ne jednotlivce.

**Co jsme vědomě nezapnuli:** záznamy relací. Nahrávají chování konkrétního člověka a bez jeho souhlasu by to nebylo v pořádku. Jsou vypnuté v kódu.

**Formulář a texty:**
- Povinný je jen e-mail. Zaslání srovnání je na žádost návštěvníka, ne na souhlas.
- Další e-maily a telefonát mají dva samostatné, nezaškrtnuté souhlasy. U reklamy A se nabídnou až po odeslání na děkovací stránce (D38). Souhlas daný samotným tlačítkem „Získat srovnání" jsme vědomě nepoužili, protože by podle GDPR nebyl svobodný.
- Odkaz na [zásady ochrany osobních údajů](https://fingramo.vercel.app/zasady).
- Upozornění na riziko a „nejde o investiční doporučení" je u kalkulačky i v patičce.
- Žádné sliby výnosů. Scénáře jsou z dokumentu KID a označené „Nejde o předpověď".

**Pro ostré nasazení je potřeba doplnit:**
- cookie lištu se souhlasem a možností odmítnout, pokud se zapne cokoli nad rámec dnešního měření,
- záznamy relací jen po souhlasu,
- zásady ochrany osobních údajů s identifikací skutečného provozovatele (IČO, adresa) místo fiktivní značky,
- smlouvy o zpracování osobních údajů s dodavateli (PostHog, Supabase, Vercel, Resend),
- dobu uchování kontaktů a postup mazání na požádání,
- double opt-in pro další e-maily (potvrzení odkazem),
- ověření právních textů a reklamy u odborníka, protože reklama na investice je regulovaná.

## 13. Co chybí a další kroky
- **Hypotézy H1 a H3 a varianta se 3 formuláři** neběží jako živé testy. Živě běží jen H2, aby se testy nemíchaly. Varianta se 3 formuláři je v kódu připravená (`?forms=3`).
- **Navazující e-maily** (série po stažení srovnání) jsou jen popsané, nepostavené.
- **Data se neobnovují automaticky.** Poplatky a velikosti fondů jsou ke dni 11. 10. 2026. Pro ostrý provoz by bylo potřeba je pravidelně stahovat a kontrolovat.
- **Rozmazání je jen vizuální:** čísla jsou ve zdrojovém kódu stránky. U lead magnetu s veřejnými daty to stačí, nejde o tajné informace.
- **Dostupnost u brokerů** je ověřená jen pro IBKR a Fio. U dalších (XTB, Trading 212, Revolut) jsem nenašel oficiální zdroj, proto o nich stránka nic netvrdí.
- **Cena za kontakt** se dopočítá až po spuštění kampaně, kdy se do dashboardu doplní útrata.
- **Ruční kontrola na skutečném iPhonu a Androidu** a test se čtečkou obrazovky. Automaticky to pokrývá jen axe.
- **Právní a provozní náležitosti pro ostrý provoz** jsou v předchozí části.
- **Děkovací stránka jde otevřít i přímo** (`/dekujeme`) bez odeslání formuláře. Přesměrování by mohlo poslat pryč skutečného návštěvníka, kterému prohlížeč blokuje paměť záložky. Data jsou veřejná a stránka se neindexuje.

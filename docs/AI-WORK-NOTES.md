# Záznam práce s AI

Průběžný deník: jaké pokyny AI (Claude Code) dostala, co vytvořila, jak se výstup kontroloval a kde se AI spletla.
Surové exporty konverzací jsou v [`ai-log/`](../ai-log/).

---

## Session 1 – 11. 10. 2026: příprava a rozhodnutí

### Pokyny
- `CLAUDE.md` (zadání, pravidla práce, seznam rozhodnutí, na která se má AI ptát) napsal Miky předem a Claude ho načte na začátku každé session.
- Úvodní pokyn: *„Nic zatím nestav. Zkontroluj prostředí, navrhni plán, ptej se mě po skupinách na rozhodnutí s variantami a doporučením, po schválení založ repozitář a pushni."*

### Co AI udělala
- Zkontrolovala prostředí: Git, GitHub CLI, Node, Vercel (konektor) a Supabase (dva účty, žádný projekt pro úkol). Vercel ani Supabase CLI nejsou nainstalované, nasazení poběží přes GitHub.
- Navrhla `docs/PLAN.md` s fázemi, termíny a riziky. Miky ho schválil bez změn.
- Položila 15 rozhodnutí ve 4 skupinách, každé se 3–4 variantami a doporučením → `docs/DECISIONS.md`.

### Jak se výstup kontroloval
- Miky každé rozhodnutí vybral sám. U 6 z 15 zvolil jinou variantu než AI nebo vlastní: dva interaktivní prvky, formulář se jménem a telefonem, vykání, styl „Liquid Glass", PostHog + Vercel Analytics a fiktivní značka. Odchylky jsou v DECISIONS.md označené.
- U vlastních variant AI vždy připsala riziko (například víc polí ve formuláři znamená nižší konverzi a blur zpomaluje telefony) a navrhla, jak ho změřit nebo zmírnit.

### Kde se AI spletla / co se opravilo
- **Špatně pochopený rozsah:** AI brala „mohli bychom zítra spustit reklamu" doslova jako ostrou kampaň. Odmítla fiktivní značku jako správce údajů a trvala na plné právní úplnosti. Miky upřesnil, že jde o ukázku pro výběrové řízení a pro ostré spuštění by se dosadily reálné údaje firmy. Nové řešení: fiktivní značka Fingramo, žádné vymyšlené IČO a seznam věcí k výměně v README.
- **Neověřená tvrzení v otázkách:** AI v nabídnutých variantách uvedla několik faktů „podle mých informací" (například limity placených plánů Formspree a Vercel Analytics). Jsou označená k ověření a na stránku ani do README se bez zdroje nedostanou.

---

## Session 1, pokračování – 11. 10. 2026: data (Fáze 1)

### Pokyn
- „Ano, začni s daty.“ (podle schváleného plánu: factsheety správců, UCITS ekvivalenty, kurz ČNB, dostupnost u brokerů, kontrola názvu značky)

### Co AI udělala a jak ověřovala
- Data o amerických ETF stáhla **přímo z webů správců** (State Street, iShares, Vanguard, Schwab). Weby Vanguardu a Schwabu automatické stažení blokují nebo se načítají přes JavaScript, proto je AI otevřela ve vestavěném prohlížeči a přečetla vykreslenou stránku. U Vanguardu navíc porovnala hodnoty s jeho JSON API.
- UCITS protějšky převzala z justETF (agregátor). Jako slabší zdroj jsou označené k ověření proti KID.
- Kurz ČNB stáhla z oficiálního textového souboru ČNB.
- Dostupnost u brokerů dohledala na stránkách ČNB, Fio a IBKR. Kde oficiální zdroj chybí (XTB, Trading 212, Revolut), na stránce se nic tvrdit nebude.
- Název „Fingramo" ověřila přes API ARES a vyhledávání na webu.

### Kde se AI spletla (zjištěno při ověřování dat)
1. **„Americké ETF si u většiny brokerů v EU nekoupíte"**: AI to tvrdila v otázce D1 i v plánu jako fakt. Ověřením se ukázalo, že **Fio banka obchodování amerických ETF výslovně umožňuje**. ČNB navíc uvádí, že povinnost poskytnout KID se nevztahuje na distributora, který jen provádí pokyny klienta. Opraveno v DECISIONS (D1) samostatným commitem. Texty stránky budou formulované přesně podle zdrojů.
2. **Index VTI**: AI z paměti předpokládala CRSP US Total Market. Podle Vanguardu fond nyní sleduje **Morningstar US Total Market Index** a jmenuje se *Vanguard Morningstar Total Stock Market ETF*. Bez ověření by na stránce byl zastaralý údaj.
3. **Poplatek VWCE**: AI z paměti očekávala vyšší TER. justETF uvádí 0,14 %, což se ještě ověří proti KID.

**Poučení:** u údajů z paměti AI je potřeba čekat, že můžou být zastaralé. Na stránku jde jen to, co je v `data/SOURCES.md`.

### Oprava postupu na pokyn Mikyho
- AI nechala dvě kontroly „na později", protože ji web zablokoval (IBKR vracel chybu 403) a daně nechtěla bez zdroje uvádět. **Miky upřesnil:** *„když ti něco blokuje, použij prohlížeč"* a *„daně najdi a přidej".*
- Výsledek: stránka IBKR ověřena ve vestavěném prohlížeči. Všech 6 UCITS fondů ověřeno přímo u správců (dřív jen agregátor justETF). Daně dohledány ze zákona (§ 4 ZDP, aktuální znění), ze smlouvy ČR–USA, z IRS a z Finanční správy.
- **Co ověření odhalilo:**
  - justETF měl u CSPX o den jiné datum vzniku. Platí údaj iShares.
  - AI z paměti počítala se stropem 40 mil. Kč pro osvobození cenných papírů, ale v aktuálním znění zákona se týká jen kryptoaktiv. Na stránce se proto neuvede.
  - U SPYL a SPYD State Street uvádí registraci v ČR, což je silnější argument pro „co si Čech reálně koupí".

---

## Session 1, pokračování – 11. 10. 2026: Fáze 2 a 3 (obsah, stavba)

### Pokyny
- „Pokračuj Fází 2“ → AI navrhla obsah a reklamy, Miky schválil (D16–D18).
- „Založ Vercel projekt ty, napiš mi návod, pokračuj Fází 3.“

### Co AI udělala
- Vercel projekt přes konektor (funkce ve Frankfurtu), veřejné proměnné. Tajné klíče jsou jen jako návod pro Mikyho, AI je nevidí.
- Supabase tabulka `leads` přes migraci (uložena i v `supabase/migrations/`), kontrola Supabase advisorem.
- Stránka v Astro po sekcích, každá sekce = jeden commit.

### Jak se výstup kontroloval
- **Výpočet poplatků** ověřen ruční kontrolou (1 % ze 100 000 Kč za rok = 995 Kč) a odhadem průměrného zůstatku.
- **Mobil 375 px:** skript v prohlížeči hledá prvky přesahující šířku obrazovky (žádné nenašel). Screenshoty z náhledu byly občas oříznuté, ale šlo o chybu nástroje, ne stránky (ověřeno měřením).
- **API** otestováno bez klíčů: validace, honeypot, chybějící konfigurace, špatný JSON.
- **Kontrolní seznam fáze 3** (PLAN.md) se procházel po každé sekci.

### Kde se AI spletla (a opravila)
1. **Čísla opsaná ručně:** v náhledu e-mailu (sekce „Co vám pošleme") AI nejdřív napsala poplatky přímo do textu. To porušuje pravidlo „každé číslo z `etf.json`". Opraveno před commitem, náhled se teď generuje z dat.
2. **Barvy mimo tokeny:** patička měla barvy napsané přímo v kódu. Přesunuty do `tokens.css`.
3. **Porovnání velikosti požadavku jako textu** v API (`'9' > '20000'` je v JavaScriptu pravda). Chyba nalezena při čtení vlastního kódu, opravena dřív, než se dostala do commitu.
4. **Sloupec „Platí k" na stránce zdrojů** míchal datum velikosti fondu s datem poplatku, což by bylo zavádějící. Opraveno samostatně.
5. **Kurz ČNB v kalkulačce:** CONTENT.md sliboval „počítáno s kurzem ČNB". Poplatek je ale procento z hodnoty investice, takže kurz výsledek neovlivní. Text na stránce byl upraven (kurz se neuvádí), aby netvrdil něco, co výpočet nedělá.
6. **API fungovalo lokálně, ale na Vercelu padalo** (`FUNCTION_INVOCATION_FAILED`). AI test na produkci udělala hned po nasazení, chybu dohledala v runtime logu Vercelu (`Cannot find native binding` u `rolldown`) a opravila ji samostatným `fix:` commitem (přibalení Linux bindingu přes `includeFiles` adaptéru). Po opravě ověřeno na produkci: validace 422, honeypot 200.
   **Poučení:** „funguje lokálně" nestačí. Každá serverová změna se testuje na nasazené adrese.
7. **Vizuály reklam** potřebovaly 4 iterace renderu: ořízlé upozornění dole, zalomené „%", rozdělené „S&P 500" a přetékající čísla. Každá iterace byla zkontrolována pohledem na výsledný PNG. Jednou si AI myslela, že oprava nefunguje, ale šlo jen o starou verzi obrázku v mezipaměti nástroje. Ověřeno měřením přímo na stránce.

---

## Session 1, pokračování – 11. 10. 2026: úpravy po Mikyho kontrole

### Pokyny (Miky ze screenshotů)
1. Mezi některými sekcemi chybí mezera.
2. U kalkulačky je hodně prázdného místa – navrhnout úpravu.
3. Chybí „kolik investuji a kolik můžu vydělat", nejlépe graf se 3 úrovněmi.
4. Zelená je příliš jednoduchá a chybí modrá (modrá = důvěra, zelená = peníze).

### Co se zjistilo a udělalo
- **Bod 1 byla chyba AI, ne jen chybějící mezera:** přepínač srovnání vůbec neskrýval ostatní skupiny (`display: grid` přebíjel atribut `hidden`), takže byly vidět všechny páry naráz. AI to při své kontrole nezachytila, protože v náhledu měřila jen přetékání do šířky, ne viditelnost skupin. Opraveno globálním pravidlem `[hidden]`. Od té doby se v kontrole měří i počet viditelných skupin.
- **Body 2 a 4:** AI připravila vizuální ukázku (3 palety, rozložení teď vs. návrh), Miky vybral (D19, D20).
- **Bod 3:** AI doporučila scénáře z KID. Při stahování KID ale zjistila, že platí jen pro 5 let a že by jejich protažení na 20 let dávalo čísla v milionech Kč. Řekla to Mikymu dřív, než cokoli postavila. Miky pak zadal vlastní řešení: 5 let podle KID a pro delší horizont historický rozsah S&P 500 (D21).
- **Ověření dat:** KID je šifrované PDF, text byl vytažen knihovnou `pypdf`. Historická data poskytl nástroj WebFetch, ale ten prochází zjednodušujícím modelem, takže AI tabulku vyparsovala znovu přímo z HTML a 5 hodnot porovnala. Výpočet ověřen proti KID: 10 000 při 14,8 % ročně za 5 let = 19 953 vs. KID 19 910 USD (rozdíl jen zaokrouhlením).
- **Iterace vzhledu:** na desktopu po první úpravě stále zůstávala mezera (řádek mřížky měl výšku grafu) a na mobilu byly osy grafu nečitelné a „%" se zalamovalo. Vše nalezeno screenshoty v Playwright na 1440 a 375 px a opraveno před pushem.

### Kontrola doporučení od jiného AI (Antigravity, Google)
- Miky vložil 12 designových doporučení z Antigravity. Claude je **nepřevzal naslepo**: každé ověřil proti datům v `etf.json`, rozhodnutím a regulačním pravidlům a dal k němu verdikt (D23).
- **Chyby, které tím Claude zachytil v cizím výstupu:**
  - „VUAA jako nejlevnější evropská volba" – fakticky špatně (0,07 % vs. SPYL 0,03 %)
  - „doporučená volba pro ČR" – investiční doporučení, v rozporu s FAQ stránky
  - „PDF tahák pro nákup u XTB, Portu, Fio" – slib obsahu, který neexistuje, s neověřenými brokery
  - gradient Tailwind emerald-500 s bílým textem – kontrast ~2,5:1
- **Ověření po úpravách:** `npm run check` 0 chyb; `data-track` atributy beze změny (diff před/po); mobil 375 px bez přetékání, pole 52 px, formulář u kalkulačky o ~720 px výš.
- **Poučení pro README:** výstup AI (vlastní i cizí) se kontroluje stejně, tedy proti datům a pravidlům, ne proti tomu, jak přesvědčivě zní.

---

## Session 1, pokračování – 11. 10. 2026: Fáze 4 (měření)

### Co AI udělala a jak ověřovala
- Měření bez cookies ověřila v oficiální dokumentaci PostHogu (přes konektor), ne z paměti. Nastavení projektu změnila až po Mikyho souhlasu.
- Měřila po krocích: lokálně (žádné cookies ani localStorage, události v PostHogu), pak na produkci celý průchod jako návštěvník z reklamy B. Kontrola proběhla na třech místech: události v PostHogu (SQL), řádek v Supabase a stav e-mailu v Resendu.

### Kde se AI spletla
1. **UTM se nikdy neukládaly do leadů.** Funkce `rememberUtm()` z Fáze 3 se nikde nevolala, takže kontakty by neměly informaci, ze které reklamy přišly, a A/B test reklam by v databázi nešel vyhodnotit. Nalezeno při psaní měření (čtení vlastního kódu). Opraveno čtením UTM přímo z URL, bez ukládání v prohlížeči. Ověřeno řádkem v Supabase (`test / qa / e2e_funnel / b`).
2. **Falešný poplach:** po prvním testu chyběly v PostHogu `cta_click` a `thank_you_view`. AI nejdřív hledala chybu v kódu, ale události jen dorazily se zpožděním zpracování. Poučení: před laděním počkat a dotaz zopakovat.

---

## Session 1, pokračování – 11. 10. 2026: rozmazaný detail za e-mail (D25)

### Pokyn
Miky: rozmazat část obsahu, aby návštěvník musel zadat e-mail, a jméno i telefon udělat volitelné.

### Co AI udělala a jak ověřovala
- Před stavbou upozornila na rozpor se zadáním (*„hodnota má být zřejmá před formulářem"*) a nabídla varianty. Miky zvolil částečnou bránu: hlavní výsledek je vidět, detail rozmazaný.
- Rozmazaný obsah má atribut `inert`, takže ho nečte čtečka obrazovky a nejde na něj tabulátorem. Upozornění na riziko a zdroje zůstávají čitelné.
- Migrace v Supabase (jméno volitelné), ověřená dotazem na omezení tabulky. Nová verze souhlasu `v2-2026-10-11`, zásady upravené.
- Důsledek, který Miky nezmínil: podnadpis hero B sliboval „uvidíte poplatky u 6 ETF", což by po rozmazání neplatilo. AI ho upravila, aby slib reklamy zůstal pravdivý.
- Ověřeno: `astro check` 0 chyb; mobil 375 px i desktop 1366 px (screenshoty); tlačítko „Odemknout" přesune e-mail doprostřed obrazovky a dá do něj kurzor (Playwright, všechna 3 tlačítka); po odeslání (záznam `fg:lead`) je vše odemčené a nic nezůstane `inert`.

### Kde se AI spletla
1. **Posun na formulář po kliknutí.** První verze posouvala na celý formulář (`block: center`), který je na mobilu vyšší než obrazovka, takže pole e-mail skončilo mimo ni. Opraveno posunem přímo na pole e-mail.
2. **Chybná diagnóza při testu.** AI pak naměřila, že posun pořád nesedí, a hledala chybu v kódu. Ve skutečnosti headless prohlížeč spouští plynulý posun asi o 1,4 s později a měření proběhlo dřív. Prokázáno záznamem polohy po 150 ms. Poučení: u animací měřit průběh, ne jeden okamžik.

---

## Session 1, pokračování – 11. 10. 2026: logo a e-mail (D26)

### Pokyn
Miky poslal předlohu loga a požádal o SVG verzi v barvách webu, nasazení všude včetně e-mailu a o lepší vzhled e-mailu.

### Co AI udělala a jak ověřovala
- Značku kreslila ručně v SVG a porovnávala s předlohou na náhledech (Playwright): malá, velká, na světlém i tmavém pozadí, jako favicon. První verze byla moc malá a tenká, druhá příliš nízká, třetí odpovídá předloze.
- E-mail vykreslila přes dočasnou lokální stránku (necommitovanou) a zkontrolovala ho na mobilu (375 px) i na desktopu, včetně textové verze.
- Reklamy znovu vyrenderovala ze stejné šablony; čísla v nich se nezměnila.

### Kde se AI spletla
1. **E-mail měl od změny palety (D19) staré zelené barvy.** Při změně palety AI aktualizovala web, ale e-mail ne (barvy jsou v e-mailu zapsané přímo, ne přes tokeny). Nalezeno až teď. Opraveno, v kódu je poznámka, že barvy kopírují `tokens.css`.
2. **Zavádějící zelená v e-mailu.** V prvním návrhu AI obarvila částky evropských verzí zeleně, jako by byly výhodnější. U SPYD je ale evropská verze výrazně dražší. Nalezeno při kontrole náhledu, opraveno před commitem: částky jsou neutrální a text vysvětluje, že poplatek může být nižší i vyšší.
3. **Zalomená procenta na mobilu** („(0,03" / „%)") v e-mailu. Opraveno zákazem zalomení.

---

## Session 1, pokračování – 11. 10. 2026: lepivá lišta, graf a PDF v e-mailu (D27)

### Pokyn
Miky: horní řádek jako menu (logo vidět při scrollování, vpravo tlačítko k formuláři dole). V e-mailu nevidí graf ani PDF, e-mail lépe přizpůsobit mobilu.

### Co AI udělala a jak ověřovala
- Před stavbou se zeptala na dvě rozhodnutí (PDF jako příloha vs. odkaz; co se spodním lepivým tlačítkem). Miky zvolil přílohu a odebrání spodního tlačítka.
- Scénáře a historii počítá jedna funkce `buildGrowth()` ze stejných dat jako kalkulačka. Stránka, e-mail i PDF tak ukazují stejná čísla.
- Ověřeno: lišta na mobilu i desktopu, tlačítko vede do pole e-mail (Playwright). E-mail vykreslený na 390 px a 760 px. PDF zkontrolované stránku po stránce (text i vykreslení). Na produkci: testovací lead → Resend „delivered" s přílohou PDF; příloha stažená a zkontrolovaná (horizont 15 let se propsal do historie).

### Kde se AI spletla
1. **Brána slibovala scénáře, které nikdo nedostal.** V D25 AI rozmazala graf s tlačítkem „Odemknout 4 scénáře", ale po odeslání formuláře scénáře nebyly v e-mailu ani na děkovací stránce. Našel to Miky („v emailu nevidím graf"). Opraveno samostatným `fix:` commitem.
2. **Formulář sliboval PDF v e-mailu**, které neexistovalo (PDF šlo uložit jen na děkovací stránce). Teď je PDF v příloze a text odpovídá.
3. **PDF bez písmen.** První verze PDF měla správný text, ale většina písmen se nevykreslila (chyba ořezávání písma v pdf-lib). Nalezeno kontrolou vykreslené stránky, ne jen textu. Opraveno předem zúženým písmem (fontTools).
4. **Čísla stránek** se kreslila obě na poslední stránku a **sloupec „Vloženo"** měl stejnou barvu jako stresový scénář. Opraveno před commitem.
5. **Typ přílohy** byl `application/octet-stream`, takže některé schránky by PDF nenabídly k náhledu. Nalezeno kontrolou v Resendu, opraveno na `application/pdf`.
6. **První návrh `panel()` v PDF vykresloval text dvakrát** (pod obdélník a nad něj), takže kopírování nebo čtečka by text zdvojily. Přepsáno na měření výšky předem.

---

## Session 1, pokračování – 11. 10. 2026: Fáze 5, testy

### Pokyn
Miky: hloubkové testy v kódu i v prohlížeči, případně unit a E2E testy.

### Co AI udělala a jak ověřovala
- Vitest (74 unit testů) a Playwright Test s lokálním Chrome (58 E2E testů na mobilu i desktopu), axe-core pro přístupnost, Lighthouse proti produkci. Přehled je v `docs/TESTING.md`.
- E2E testy nikdy neposílají skutečný lead (API je odchycené) a blokují analytiku, aby nekazily data v PostHogu. Události trychtýře přitom kontrolují v prohlížeči.
- Data se testují proti zdrojům: poplatky a URL v `etf.json` musí odpovídat tabulkám v `SOURCES.md` a historie S&P 500 se přepočítá ze surových ročních výnosů.
- Bezpečnostní limit ověřen nejdřív v databázi v transakci s rollbackem (nezůstal žádný řádek), potom na produkci (HTTP 429).
- Stejná E2E sada prošla i proti produkci.

### Kde se AI spletla (nalezeno testy a revizí, opraveno samostatnými `fix:` commity)
1. **Stránka /zdroje na mobilu přetékala do šířky** (618 px). Široká tabulka roztáhla sloupec stránky. Při vizuální kontrole AI zdroje na mobilu neprošla.
2. **Šedý text měl kontrast 4,15:1** na světle modrém pozadí (pod WCAG AA). Barvu AI vybrala při změně palety a kontrast ověřila jen na bílé.
3. **`aria-label` na prostém `span`** v logu (nepovolená ARIA).
4. **Formulář šel zneužít k obtěžování cizích adres** opakovaným odesíláním. AI na to při stavbě API nemyslela. Opraveno limitem 3 žádostí na adresu za 24 h v databázi.
5. **Planý poplach v testu:** chybějící datum poplatku u IVV a SCHD nebyla chyba. Weby iShares a Schwab datum neuvádějí a stránka to přiznává („stav ke dni stažení"). Test AI upravila a důvod zapsala do kódu.

---

## Session 1, pokračování – 11. 10. 2026: Fáze 5b, kroky 1–3 (D28, D29, D33)

### Pokyn
Miky: projít projekt a položit co nejvíc otázek s výběrem. Pak plán, pak kroky 1–3 postupně a s testem.

### Co AI udělala a jak ověřovala
- Nejdřív vysvětlila, jak A/B test funguje doopravdy: testoval se jen úhel reklamy, na stránce se měnil jen nadpis. Pak položila 15 otázek ve 4 skupinách (D28–D34).
- **Krok 1:** záznamy relací vypnuté v kódu. Ověřeno ze síťových požadavků a z konfigurace projektu. Ta ukázala, že nahrávání bylo v projektu zapnuté, i když se v testech nespustilo.
- **Krok 2:** karta podle reklamy A s páry z dat. Screenshoty na mobilu a desktopu, E2E test obou variant.
- **Krok 3:** živý A/B test s přiřazením v `<head>`. Šest E2E testů včetně toho, že se v čistém prohlížeči objeví obě varianty. Stejná sada prošla i proti produkci.

### Kde se AI spletla
1. **Vazba lead ↔ analytika nikdy nefungovala** (nalezeno při kroku 1, samostatný `fix:`). Formulář četl `window.posthog`, který neexistoval, a v režimu bez cookies klient PostHog id stejně nezná. 5 z 5 leadů v databázi nemělo `analytics_id`. Teď ho nahrazuje náhodné `lead_ref`.
2. **Důkaz, který nic nedokazoval.** AI chtěla vypnutí záznamů prokázat porovnáním síťových požadavků před a po. Nahrávací skript se ale nenačetl ani předtím, takže porovnání nic neukázalo. AI to přiznala a ověřila stav z konfigurace projektu.
3. **Varianta B v hero byla na mobilu širší než obrazovka** (415 px). E2E test na to přišel, protože tlačítko „Spočítat" nešlo stisknout. Opraveno před commitem. Test vodorovného scrollu teď běží i pro tuto variantu.
4. **Zásady tvrdily „bez ukládání do prohlížeče"**, ale kalkulačka si už dřív pamatovala čísla v záložce a teď i variantu testu. Text je opravený a přesně popisuje paměť v záložce.

---

## Session 1, pokračování – 11. 10. 2026: Fáze 5b, kroky 4–7 (D28, D30–D32)

### Co AI udělala a jak ověřovala
- **Krok 4:** na produkci vytvořila testovací návštěvu (`utm_source=test`) a dotazem v PostHogu ověřila, že `exp_hero_calc` dorazí u všech událostí. Pak přes API v Mikyho přihlášeném Chrome (s jeho souhlasem) vytvořila insight trychtýře podle varianty a k němu výpočet potřebného počtu návštěv.
- **Krok 5:** tlačítko v liště podle stavu, 3 E2E testy.
- **Krok 6:** zhuštění. Výška stránky změřená před a po: mobil 10 783 → 10 683 px, desktop 6 795 → 6 463 px.
- **Krok 7:** otázka a sdílení na děkovací stránce, 3 E2E testy.
- Po každém kroku celá E2E sada. Nakonec proti produkci (88 prošlo, 2 jen pro lokální server přeskočeny) a Lighthouse pro obě varianty testu.

### Kde se AI spletla nebo co našla
1. **Lokální vývoj posílal události do produkčního PostHogu** (samostatný `fix:`). Screenshoty a ruční testy AI z localhostu se míchaly s daty z reklamy. Nalezeno při ověřování A/B testu. Opraveno: na localhostu se PostHog nespustí a všechny insighty navíc filtrují produkční doménu a vynechávají testovací provoz.
2. **E-mail návštěvníka se zbytečně držel v paměti záložky** (samostatný `fix:`). Děkovací stránka ho nikdy nepotřebovala. Nalezeno při psaní kroku 7.
3. **První pokus o zhuštění stránku prodloužil** (+296 px). Nový blok měl plné odsazení sekce. AI to zjistila měřením a strukturu změnila: dvě sekce sloučila do jedné a blok důvěry vložila do FAQ.
4. **Chybějící mezera „zdroje dat(staženo"** kvůli zalomení řádku v šabloně. Viděno na screenshotu, opraveno, test hlídá přesný text.
5. **Falešný poplach v Lighthouse:** varianta s polem jednou vyšla 98 (LCP 2,4 s). Opakované běhy daly obě varianty 100, takže šlo o rozptyl měření, ne o zpomalení.

---

## Session 1, pokračování – 11. 10. 2026: Fáze 5c, Mikyho kontrola stránky (D35)

### Pokyn
Miky si stránku prošel v prohlížeči a poslal 8 bodů: ověřit TER (hlavně XD9U a VWCE), vyhodit pole Firma a rozdělit souhlasy, max. 2 formuláře, zkrátit mobil, dotykové plochy 44 px, zvážit otázku na částku a vysvětlit telefon, doplnit README o dashboard a otestovat obě reklamy. Chtěl krátký plán, otázky jen kde si AI není jistá, a malé commity.

### Co AI udělala a jak ověřovala
- **Body nejdřív ověřila v kódu, ne naslepo.** Dva body neodpovídaly stavu stránky: pole „Firma" je neviditelná past na roboty (návštěvník ho nevidí) a částku formulář už posílá z kalkulačky. Místo slepého provedení se zeptala (4 otázky, D35).
- **TER:** všech 12 fondů znovu na webech správců ve vestavěném prohlížeči, u UCITS navíc KID (PDF přečtené přes extrakci textu, u State Street šifrované PDF dešifrované prázdným heslem). Vše sedí, žádná změna dat.
- **Souhlasy:** nejdřív migrace databáze (sloupec `phone_consent`), až potom kód, aby produkce ani na chvíli neposílala neznámý sloupec.
- **Mobil:** změřila výšky všech sekcí na 390 px, pak cíleně zkrátila dvě největší (srovnání vedle sebe, zamčený seznam jako ukázka). 10 442 → 9 538 px (po zkrácení 9 376 px, pak +162 px za dotykové plochy 44 px a vysvětlení u telefonu). Kontrola snímkem celé stránky a testem hlídajícím výšku a přetečení.
- **44 px:** nejdřív audit všech ovládacích prvků (26 pod limitem), pak oprava a trvalý test, který „klepne" 21 px od středu každého odkazu.
- **Obě reklamy:** nový test 2 × 2 × mobil/desktop, proti produkci, a snímky první obrazovky vedle obrázku reklamy.

### Kde se AI spletla nebo co našla
1. **První verze zápisu v SOURCES tvrdila, že „transakční náklady vysvětluje FAQ".** FAQ ale mluví jen o TER. Opraveno před commitem na přesné znění.
2. **Neviditelná dotyková plocha u odkazů zalomených na dva řádky** nefungovala (Chrome ji počítá jinak u rozděleného odkazu). Tři pokusy s větší plochou nepomohly, řešením bylo nedělit odkaz mezi řádky na mobilu (`inline-block`). Ověřeno testem i snímkem, řádkování textu zůstalo.
3. **Mezery mezi zdroji na /zdroje se neprojevily**, protože pozdější pravidlo ve stejném souboru přebilo nové. Zjištěno z vypočteného stylu, opraveno úpravou původního pravidla.
4. **Chyby v nových testech, ne na stránce:** test nepočkal 0,8 s na `tool_used` a na produkci na `thank_you_view`, test vyžadoval atribut `data-ad` i u výchozí varianty B. Opraveno v testech, stránka se neměnila.
5. **Nesrovnalost v dokumentaci:** MEASUREMENT.md uvádí `anonymize_ips: true`, ale v kódu to není. Do README AI tuto větu nedala, dokud se neověří. Otevřené.
6. **Záznamy relací jsou v nastavení PostHog projektu pořád povolené** (kód je blokuje). README to říká otevřeně. Vypnutí v nastavení je na Mikym.
7. **Výška stránky v DECISIONS byla napsaná před změřením** (9 404 px). Kontrolní měření na produkci dalo 9 538 px, protože dotykové plochy 44 px a vysvětlení u telefonu stránku zase prodloužily. Opraveno samostatným `fix:` commitem, čísla teď pochází z měření.

---

## Session 1, pokračování – 11. 10. 2026: grafika a náhledový obrázek (D36)

### Pokyn
„Krok 10" – SVG ikony a ilustrace, potom OG obrázek. AI se zeptala na 4 věci (rozsah, styl, obsah OG, nová komponenta) a Miky zvolil doporučené varianty.

### Co AI udělala a jak ověřovala
- 11 vlastních linkových ikon v jedné komponentě `Icon.astro` (inline SVG, žádná knihovna). Nejdřív zkušební list ve zvětšení i ve skutečné velikosti, teprve pak nasazení na stránku.
- Ikony v „Co vám pošleme", „Dobré vědět", u dat v hero, u formuláře a v krocích na děkovací stránce. Výška mobilní stránky změřená před a po: beze změny (9 538 px).
- Ilustrace na děkovací stránce, kontrola snímkem na mobilu i počítači, netiskne se do PDF.
- OG obrázek stejným postupem jako reklamy (HTML + čísla z `etf.json` → PNG). Test hlídá meta značky, velikost 1200 × 630 a datovou velikost pod 300 kB. Na produkci ověřeno: `og.png` vrací 200 a `image/png`.
- Celá sada: 109 E2E lokálně, 107 proti produkci. Lighthouse mobil 100/100/100/100 v obou variantách testu.

### Kde se AI spletla
1. **Dvě ikony na zkušebním listu kolidovaly** (zelená mince přes sloupec mincí, šipka přes obálku). Viděno na zvětšeném náhledu a opraveno před nasazením.
2. **Čísla na OG obrázku přetékala z karty** (0,03 % uříznuté). Viděno na prvním renderu. Opraveno menším písmem a širší kartou, render má teď kontrolu, že nic nepřesahuje kartu.
3. **Příliš široký úklid:** lokální server pro render AI zastavila příkazem `taskkill /IM python.exe`, který ukončí všechny procesy Pythonu v počítači, nejen ten jeden. Pokud Mikymu běžel jiný Python program, mohl být ukončen. Správně mělo jít o zastavení jen konkrétního procesu (podle portu nebo PID). AI to Mikymu hned řekla.

---

## Session 1, pokračování – 11. 10. 2026: hypotézy a dvě ověření

- **Hypotézy H1–H3 do README:** odhad dopadu AI napsala slovně s důvodem, bez vymyšlených procent (stránka zatím nemá provoz z reklamy). Citlivost testu převzala z už spočítané tabulky velikosti vzorku.
- **Anonymizace IP:** v AI-WORK-NOTES bylo otevřené, jestli tvrzení v MEASUREMENT.md platí, když v kódu chybí. Ověřeno jen čtením: nastavení je na úrovni projektu a v datech nemá žádná ze 163 událostí IP ani polohu. Tvrzení tedy platilo, jen bylo nepřesně popsané, kde se nastavuje.
- **IBKR:** položka v PLAN zůstala neodškrtnutá, přestože SOURCES.md měl ověření z prohlížeče už z rána. AI stránku otevřela znovu a obě tvrzení na webu sedí.

---

## Session 1, pokračování – 11. 10. 2026: Fáze 6 (README)

### Co AI udělala a jak ověřovala
- README se všemi 13 sekcemi ze sekce 5 CLAUDE.md a sekcí „Soukromí a právní stránka" (D33). Text je poskládaný z rozhodnutí, CONTENT.md, MEASUREMENT.md a těchto poznámek, ne napsaný nanovo z paměti.
- **Očekávaná konverze:** AI nejdřív hledala srovnávací data. Souhrnu z vyhledávání nevěřila a čísla přečetla přímo na stránkách Unbounce (report 2024, období dat z metodiky). Benchmark je zapsaný v SOURCES.md §9. Odhad 4–6 % je v README výslovně označený jako odhad, s důvody nahoru i dolů a s nejistotou.
- Tvrzení v README porovnala s kódem (například text „Váš předpoklad, ne náš slib" a „Nejde o předpověď" na stránce). Všechny relativní odkazy v README vedou na existující soubory.
- Závěrečná kontrola: repozitář je veřejný, v kódu nejsou klíče, v databázi je 5 testovacích kontaktů (`utm_source=test`, čtení bez mazání).

### Kde se AI spletla
1. **První pokus o zápis README selhal**, protože shell nezvládl dlouhý text v jednom příkazu. Nic se nezapsalo (ověřeno `git diff`) a README vzniklo po částech.
2. **CONTENT.md byl zastaralý** (jeden společný souhlas, tři body v „Proč VOO…"), přitom README na něj odkazuje jako na texty stránky. Doplněna poznámka, že sekce 3 je historický návrh a platí stránka a DECISIONS.
3. Text o ukázce scénářů v README nejdřív citoval „není to předpověď", na stránce ale stojí „Nejde o předpověď". Opraveno před commitem.

---

## Session 1, pokračování – 11. 10. 2026: graf scénářů po odeslání

### Pokyn
Miky (screenshot zamčeného grafu): „tento graf se pak někde ukáže? v e-mailu/PDF? případně uprav."

### Co AI zjistila a udělala
- Zjištění z kódu: scénáře po odeslání v e-mailu, PDF i na děkovací stránce **byly**, ale jen jako pruhy s konečnou částkou. Čárový graf rok po roku viděl návštěvník jen na hlavní stránce po návratu.
- Kreslení grafu se přesunulo do jedné sdílené funkce (`src/lib/growth-chart.ts`). Kalkulačka i děkovací stránka teď kreslí totéž. PDF má stejný graf nakreslený přes pdf-lib.
- E-mail zůstal u pruhů a v DECISIONS je proč.
- Ověřeno: PDF prohlédnuté stránku po stránce, děkovací stránka na mobilu, nový E2E test kontroluje, že graf má 5 čar a jeho částky se shodují s legendou. Celkem 111 E2E testů.

### Kde se AI spletla
1. **Graf přidal PDF třetí stranu** (jen poslední krok a patička). Nejdřív zkusila graf a pruhy zmenšit, nestačilo to. Pak nahradila pruhy kompaktní legendou s barevnou čarou, protože pruhy ukazovaly totéž co graf. PDF má znovu 2 strany.
2. **Zacyklený Python:** AI omylem spustila prázdný interaktivní Python, který se zasekl a zapisoval chyby do logu. Zastavila jen tu jednu úlohu podle jejího ID (poučení z minula, ne všechny procesy).
3. **Nalezená nesrovnalost:** barva stresového scénáře v e-mailu a PDF zůstala na staré hodnotě z doby před opravou kontrastu. Opraveno samostatným `fix:` commitem.
4. Nový test nejdřív selhal na pevné mezeře v českém formátu čísel (`280 000 Kč`). Šlo o chybu testu, ne stránky.

---

## Session 2 – 12. 10. 2026: ruční kontrola produkce

### Pokyn
Miky: „Otevři stránku v prohlížeči, projdi všechny kroky, podívej se, zda vše funguje správně a je logicky umístěno (např. zadání částky v hero, ale pak automaticky jednorázově 100 000 Kč). Zkontroluj přes Browser i Console. Napiš log a pak se zeptej, co a jak opravit."

### Co AI udělala a jak ověřovala
- Prošla produkci ve vestavěném prohlížeči na mobilu a desktopu, obě reklamy a obě varianty první obrazovky. Kroky klikala a stav četla z DOM: hodnoty polí, pozice posunu, fokus, texty výsledku. Zkoušela okrajové hodnoty (prázdno, 0, písmena, 999 999 999), validaci formuláře s neplatnými údaji, všechna tlačítka „Odemknout", přepínač srovnání a FAQ.
- Formulář na produkci **neodeslala**: vytvořil by kontakt a poslal e-mail. Děkovací stránku otevřela s daty, jaká by uložil formulář.
- Konzoli a síť kontrolovala na všech stránkách. Když nástroj pro síť neukázal požadavky na PostHog, ověřila je přes `performance` API prohlížeče, a nehlásila tak chybu, která neexistuje.
- 16 nálezů zapsala do [QA-2026-10-12.md](QA-2026-10-12.md) se závažností a návrhem, na 4 hlavní se zeptala (D37), pak opravovala po malých commitech s testem ke každé opravě.

### Kde se AI spletla
1. **Kolize atributu:** pro strop částek přidala polím atribut `data-max`, ale stejný selektor `[data-max]` už používala věta s výsledkem („do 13 188 Kč"). Skript by zapisoval částku do pole místo do věty. Zachytil to existující E2E test (strict mode, 3 prvky). Opraveno přejmenováním na `data-cap` před commitem.
2. **První verze opravy hero** posouvala na pole kalkulačky i na desktopu, kde je výsledek ve vedlejším sloupci pod grafem a mimo obrazovku. Zachytil to desktopový test. Řešení: na desktopu posun na výsledek a věta s výsledkem nově uvádí, z čeho se počítá.
3. Dva body z vlastního seznamu (kurzor v kalkulačce, přímý přístup na `/dekujeme`) se ukázaly jako záměr nebo jako oprava s horším rizikem. AI je nechala a v logu napsala proč.
4. Skript na úpravu dokumentů spadl uprostřed, protože hledal v README řádek, který tam nebyl. Log a DECISIONS už byly zapsané, zbytek AI doplnila ručně a zkontrolovala `git status`.

---

## Session 2, pokračování – 12. 10. 2026: formulář bez zaškrtávacích polí (D38)

### Pokyn
Miky: „Potřebuji, aby jedna z variant A nebo B místo zaškrtnutí polí měla jen text nad tlačítkem, že stisknutím tlačítka souhlasíte s 1 a 2."

### Co AI udělala
- **Nejdřív upozornila na právní problém**, ne až po stavbě: souhlas vázaný na tlačítko žádosti o srovnání není svobodný (GDPR čl. 7 odst. 4), zadání hodnotí právní náležitosti a stejnou variantu jsme zamítli v D13. Nabídla legální cestu ke stejnému cíli (formulář bez polí, souhlas po odeslání) a variantu „přesně podle zadání" ponechala na výběr i s rizikem. Rozhodl Miky.
- U volby „navázat na reklamu" upozornila, že se tím spojí dva testy a rozdíl mezi reklamami nepůjde přičíst jen reklamě. Zapsáno v README.
- Souhlas daný po odeslání se musí uložit ke kontaktu, ale databáze byla jen na vkládání. Přibyl úzký endpoint `/api/consent`: jen náhodné `lead_ref` z vlastní záložky, jen kontakt z této varianty, jen do 24 h, telefon jen s číslem.
- Ověřeno: 8 nových unit testů (validace, filtry dotazu, 404, 502), 4 E2E testy (formulář A bez polí, formulář B beze změny, uložení souhlasu, chyba při uložení), snímky formuláře a děkovací stránky na mobilu.

### Kde se AI spletla
1. Nový E2E test hledal ve větě špatný úsek textu (chyba testu, stránka byla v pořádku).
2. První verze ukládala `consent_flow` do vlastnosti všech událostí podle `utm_content`. Na děkovací stránce už `utm_content` v adrese není, takže by tam hodnota byla špatně. AI to zachytila před spuštěním a `consent_flow` posílá jen u `form_submit` a `consent_given`.

---

## Session 2, pokračování – 12. 10. 2026: kontrola návrhu textů od ChatGPT (D39)

- Miky poslal návrh úprav textů od ChatGPT. Claude ho nepřevzal naslepo: každý bod porovnal s aktuálním kódem a se zdroji v SOURCES.md a rozdělil ho na „opravit" (4), „už hotové" (3), „nedoporučuji" (5) a „volitelný styl" (4). O výběru rozhodl Miky.
- **Kde měl cizí výstup pravdu a AI chybu přehlédla:** FAQ „jen pokud zaškrtnete souhlas" po D38 neplatilo pro reklamu A. Opraveno samostatným `fix:` commitem.
- **Kde cizí výstup pracoval se starým stavem:** vysvětlení u telefonu pro reklamu A, Xtrackers v řádku důvěry a vysvětlení TER už byly hotové.
- **Kde by cizí výstup stránku zhoršil:** vágnější daňová věta místo doložené sazby 15 % (smlouva ČR–USA, IRS).
- Ověřeno: nový unit test hlídá „verze" vs. „alternativa" v reportu i v e-mailu, E2E 133 prošlo, snímky karty a nadpisu na mobilu.
- **Chyba AI v téže kontrole:** při zdůvodnění AI napsala, že „VT a SCHD nejsou mezi 6 největšími ETF na NYSE". Bylo to z paměti a bez zdroje, tedy přesně druh tvrzení, který pravidla zakazují. V DECISIONS opraveno na pravdivé „pořadí podle popularity nemáme doložené" a Mikymu oznámeno.

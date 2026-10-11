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

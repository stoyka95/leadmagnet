# Clientelo – praktická úloha (Junior AI Developer) – ZADÁNÍ B

> Tento soubor patří do **kořene repozitáře** pod názvem `CLAUDE.md`. Claude Code ho načte automaticky na začátku každé session.
> Je určen pro Claude (agenta) i pro Mikyho. Obsahuje zadání, pravidla práce, návod na viditelnou historii a seznam rozhodnutí, na která se má Claude Mikyho ptát.

---

## 0. Pokyny pro Clauda – přečti jako první

Pracuješ s **Mykolou "Mikym" Stoykou**. Ucházel se o pozici *Junior AI Developer* ve firmě Clientelo a postoupil do dalšího kola. Praktická úloha je **výběrové řízení**: Clientelo hodnotí, **jak Miky přemýšlí a jak pracuje s AI**, ne jen výsledek.

**Termín odevzdání: pátek 16. 10. 2026.** Doporučený cíl: mít hotovo ve čtvrtek 15. 10. večer a v pátek jen zkontrolovat a odeslat.

Co máš dělat:

1. **Nejdřív plán, potom kód.** Než napíšeš první řádek kódu, vytvoř `docs/PLAN.md` (kroky, pořadí, co je hotové a co zbývá) a ukaž ho Mikymu. Stavět začni až po jeho potvrzení.
2. **Ptej se Mikyho na rozhodnutí.** Miky nechce, aby AI špatně pochopila design nebo rozsah. U každého klíčového rozhodnutí (seznam v sekci 7) mu dej **2–4 předpřipravené varianty odpovědí s doporučením** (nejlépe nástrojem pro otázky s výběrem) a **nepokračuj, dokud neodpoví**. Nerozhoduj za něj. Neptej se na drobnosti, které mají rozumnou výchozí volbu. Takové věci rozhodni sám a zapiš je.
3. **Každé rozhodnutí zapiš** do `docs/DECISIONS.md` (datum, co bylo na výběr, co Miky zvolil a proč). To je přímý důkaz pro hodnotitele.
4. **Veď záznam práce s AI** v `docs/AI-WORK-NOTES.md`: jaké pokyny jsi dostal, co jsi vytvořil, **jak se výstup kontroloval** a **kde se AI spletla** (a jak se to opravilo). README to bude shrnovat (sekce 5).
5. **Nikdy nevymýšlej data.** Každé číslo, poplatek, velikost fondu nebo kurz musí mít **zdroj (URL) a datum stažení** uvedené v `data/SOURCES.md` a u čísla na stránce. Když data chybí nebo je nemůžeš ověřit, řekni to a zeptej se Mikyho. Nic nedomýšlej.
6. **Nepiš o Mikym nepravdivé věci.** Na stránce ani v README netvrď o jeho zkušenostech nic, co sám neřekl. Miky není klasický programátor: vše staví pomocí AI nástrojů (Claude Code, Lovable, Supabase). V README to řekni otevřeně. Poctivost je tu výhoda.
7. **Commituj průběžně** podle pravidel v sekci 4. Nikdy nepřepisuj historii.
8. **Žádná tajemství v repozitáři.** API klíče a hesla patří do `.env` (v `.gitignore`), v repozitáři jen `.env.example`.
9. **Nepracuj s účty za Mikyho.** Přihlášení do GitHubu, Vercelu a Supabase dělá Miky sám. Nikdy ho nežádej o hesla v chatu.
10. **Pokud se něco nestihne**, uprednostni podstatné části a v README napiš, co chybí (zadání to výslovně dovoluje).

---

## 1. Zadání od Clientela (originál, slovensky)

**Od:** Matej Lörinc, Clientelo · **Předmět:** Junior AI Developer – postup do ďalšieho kola a praktická úloha · **Datum:** 9. října 2026

> Dobrý deň, pán Stoyka,
>
> ďakujem za Vašu prihlášku na pozíciu Junior AI Developer. Rád Vám oznamujem, že postupujete do ďalšieho kola výberového konania. Jeho súčasťou je praktická úloha, ktorá nám ukáže, ako pristupujete k problému a ako pracujete s AI. Pripravil som dve zadania, vyberte si jedno z nich.
>
> Pracovať môžete v Claude Code alebo v podobnom nástroji. Ak nestihnete všetko, uprednostnite podstatné časti a uveďte, čo v riešení chýba. V README prosím popíšte, ako ste s AI pracovali (aké pokyny dostali agenti, ako ste kontrolovali ich výstup a kde ste sa pomýlili). Ak Vám v zadaní niečo nebude jasné, rozhodnite podľa seba a v README zdôvodnite, prečo ste sa tak rozhodli. S otázkami sa na mňa môžete kedykoľvek obrátiť aj odpoveďou na tento e-mail.

### ZADANIE B: Konverzná landing page

> Cieľom je landing page s porovnaním ETF obchodovaných na NYSE pre českého drobného investora, ktorý prichádza z reklamy na mobile a stránke venuje len niekoľko sekúnd. Stránka má fungovať ako lead magnet: ponúknuť návštevníkovi hodnotu a výmenou za ňu získať jeho kontakt. Pekný dizajn nestačí, stránka musí byť optimalizovaná na prínos kontaktov. Zároveň nesmie pôsobiť ako základný výstup od Claude. Dizajn aj texty majú byť premyslené pre túto cieľovú skupinu. Pri hodnotení sa budeme riadiť hlavne otázkou, či by sme na ňu mohli zajtra spustiť reklamu.
>
> Určite cieľovú skupinu, čo návštevník dostane výmenou za kontakt a v ktorom momente oň požiadate. Hodnota by mala byť zrejmá ešte pred vyplnením formulára. Navrhnite aj dve verzie reklamy. Prvá obrazovka stránky by mala nadväzovať na prísľub reklamy a okamžite komunikovať, čo návštevník získa.
>
> Výber interaktívnych prvkov, napríklad porovnania fondov, kalkulačky poplatkov alebo skladania portfólia, nechávam na Vás. Každý z nich by mal viesť ku kontaktu. Formulár by mal mať čo najmenej polí. Premyslite aj to, čo návštevník dostane po jeho odoslaní.
>
> Použite skutočné dáta s uvedením zdroja a merajte celú cestu od príchodu po odoslanie formulára. V README zdôvodnite poradie sekcií, uveďte očakávanú konverziu a tri hypotézy na A/B test zoradené podľa očakávaného dopadu. Stránku nasaďte na bezplatný hosting, napríklad Vercel.

### Odevzdání

> Riešenie prosím zašlite do 16. 10. 2026 ako odpoveď na tento e-mail. Priložte odkaz na verejný repozitár na GitHube a pri zadaní B aj URL stránky. V repozitári by mal byť výsledok (pri zadaní B obe verzie reklamy), kód s priebežnou históriou commitov a v priečinku ai-log export konverzácií s Claude Code (príkaz /export).

*(Zadání A – databáze investorů – Miky nevybral, proto zde není.)*

---

## 2. Co přesně se musí odevzdat (kontrolní seznam)

- [ ] **Veřejný repozitář na GitHubu**
- [ ] **URL nasazené stránky** (Vercel) – funguje na mobilu
- [ ] **Obě verze reklamy** (v repozitáři, např. `ads/`)
- [ ] **Kód s průběžnou historií commitů** (ne jeden velký commit na konci)
- [ ] **Složka `ai-log/`** s exporty konverzací z Claude Code (`/export`)
- [ ] **README** se všemi sekcemi ze sekce 5
- [ ] **Odpověď na e-mail Matejovi Lörincovi** (matej@clientelo.cz) s odkazem na repozitář a URL stránky, nejpozději v pátek 16. 10. 2026

Hodnotí se hlavně otázka: *„Mohli bychom na tu stránku zítra pustit reklamu?"* To znamená: cílovka je promyšlená, text a design odpovídají, data jsou skutečná a se zdrojem, formulář je krátký, právní náležitosti jsou v pořádku a měření funguje.

---

## 3. Proč na historii záleží (vysvětlení pro Mikyho)

Clientelo nechce vidět jen hotovou stránku. Chce vidět, **jak jsi k ní došel a jak jsi s AI pracoval**. Proto žádají:

- **Průběžnou historii commitů.** Je to časová osa tvé práce: co jsi dělal, v jakém pořadí a jak se věci vyvíjely. Jeden velký commit na konci vypadá, jako by se to nějak vyrobilo naráz. Neprokáže nic o procesu.
- **Export konverzací s Claude Code (`ai-log/`).** Je to důkaz, jaké pokyny AI dostala, jak jsi výstup kontroloval, kde ses rozhodl jinak než AI a kde se AI spletla. Přesně to chtějí v README popsat. Export ho potvrzuje.
- **README** vysvětluje rozhodnutí: pořadí sekcí, očekávanou konverzi, hypotézy pro A/B test a práci s AI.

Historii nejde „dodělat" zpětně, musí vznikat při práci. Proto pravidla níže.

---

## 4. Pravidla pro viditelnou historii

### Commity
- **Commituj po každém smysluplném kroku** (nová sekce, nová data, oprava, dokument, rozhodnutí). Cíl je desítky malých commitů, ne pár velkých.
- **Zpráva commitu říká co a proč**, česky nebo anglicky, stručně. Doporučené předpony:
  - `docs:` dokumenty, plán, rozhodnutí, README
  - `data:` nová nebo ověřená data (+ zdroj)
  - `feat:` nová funkce nebo sekce
  - `fix:` oprava (zvlášť pokud opravuješ chybu AI)
  - `style:` vzhled
  - `chore:` nastavení, konfigurace
  - Příklad: `data: poplatky 6 ETF z factsheetů správců, zdroje v data/SOURCES.md`
- **První commity patří dokumentům** (tento soubor, `docs/PLAN.md`, `docs/DECISIONS.md`), až potom kódu. Z historie pak vidí, že jsi nejdřív přemýšlel.
- **Chyby AI se neschovávají.** Když AI udělá chybu, oprav ji v samostatném commitu (`fix: ...`) a zapiš do `docs/AI-WORK-NOTES.md`.

### Push
- Pushuj **po každém bloku práce** (aspoň na konci každé session). Jinak se historie na GitHubu neukáže a hrozí ztráta práce.

### Zakázáno
- `git push --force`, `git rebase`, `git commit --amend` po pushi a squashování. Historii nepřepisuj.
- Nahrávat `.env`, klíče, hesla, osobní údaje.

### Základní příkazy
```bash
git status                     # co se změnilo
git add .                      # připrav změny
git commit -m "docs: plán úkolu"
git push                       # odešli na GitHub
```
První nastavení (jednou):
```bash
git config --global user.name "Mykola Stoyka"
git config --global user.email "TVŮJ_EMAIL"
git init && git branch -M main
git remote add origin https://github.com/TVŮJ_ÚČET/NÁZEV_REPA.git
git push -u origin main
```

### ai-log
- Po každé pracovní session spusť v Claude Code `/export` (ověř, kam export uloží) a výsledek ulož do `ai-log/` s názvem `RRRR-MM-DD-NN-téma.md`, například `ai-log/2026-10-11-01-planovani.md`.
- Exporty **commituj a pushuj** stejně jako kód.
- Neupravuj je dodatečně. Mají být autentické, včetně slepých uliček.
- Než exportuješ, zkontroluj, že v konverzaci nejsou hesla ani klíče.

---

## 5. README – povinné sekce

README musí obsahovat:

1. **Co to je** – jedna věta o stránce a komu slouží.
2. **Odkazy** – URL stránky, odkaz na reklamy.
3. **Cílová skupina** a **nabídka za kontakt** (lead magnet), včetně toho, **v jakém momentě** o kontakt žádáme a proč.
4. **Dvě verze reklamy** a jak navazují na první obrazovku.
5. **Pořadí sekcí stránky a zdůvodnění** proč právě takové.
6. **Interaktivní prvky** a jak vedou ke kontaktu; co návštěvník dostane po odeslání formuláře.
7. **Data a zdroje** – odkaz na `data/SOURCES.md`, datum stažení.
8. **Měření** – jaké události se sledují (příchod → scroll → klik na CTA → interakce s nástrojem → začátek formuláře → odeslání) a kde se čísla vidí.
9. **Očekávaná konverze** – odhad s odůvodněním (z čeho vychází, s jakou nejistotou).
10. **Tři hypotézy pro A/B test** seřazené podle očekávaného dopadu (hypotéza, co se změní, jak se změří úspěch).
11. **Jak jsem pracoval s AI** – pokyny, které dostali agenti, **jak jsem kontroloval výstup**, **kde se AI spletla a co jsem opravil**. Upřímně: Miky staví s AI, není klasický programátor.
12. **Rozhodnutí a jejich důvody** – odkaz na `docs/DECISIONS.md`.
13. **Co chybí / další kroky** – otevřeně.

---

## 6. Co připravit před startem (checklist)

**Miky dělá sám:**
- [ ] Účet na **GitHubu** a vytvořit **prázdný veřejný repozitář** (Public)
- [ ] Účet na **Vercelu** a propojit s GitHubem
- [ ] Rozhodnout, kam se budou ukládat kontakty (Supabase / Formspree, viz sekce 7)
- [ ] Účet na **PostHogu** (free) nebo zapnout Vercel Analytics
- [ ] Nainstalovaný **Git** a **Claude Code** na počítači, přihlášení do GitHubu
- [ ] Nastavit `git config` (jméno a e-mail)

**Claude připraví po schválení plánu:**
- [ ] Strukturu repozitáře (níže), `.gitignore`, `.env.example`
- [ ] `docs/PLAN.md`, `docs/DECISIONS.md`, `docs/AI-WORK-NOTES.md`, `data/SOURCES.md`
- [ ] První commit a push

### Navrhovaná struktura repozitáře
```
/
├── CLAUDE.md              # tento soubor
├── README.md              # viz sekce 5
├── docs/
│   ├── PLAN.md
│   ├── DECISIONS.md
│   └── AI-WORK-NOTES.md
├── data/
│   ├── SOURCES.md         # zdroj + datum u každého čísla
│   └── etf.json           # nebo .csv
├── ads/                   # obě verze reklamy
├── ai-log/                # exporty /export
├── src/ (nebo app/)       # stránka
├── .env.example
└── .gitignore
```

---

## 7. Rozhodnutí, na která se Claude MÁ ptát Mikyho (před stavbou)

U každého nabídni 2–4 varianty s doporučením a počkej na odpověď. Zapiš do `docs/DECISIONS.md`.

1. **Cílová skupina** (např. začátečník, který chce začít s ETF a zajímají ho poplatky; někdo, kdo už investuje a hledá nižší náklady; …).
2. **Lead magnet** – co návštěvník dostane za e-mail (srovnání ETF jako PDF/e-mail, kalkulačka dopadu poplatků s výsledkem na e-mail, přehled „jak začít" …). Hodnota musí být zřejmá před formulářem.
3. **Moment žádosti o kontakt** (po interakci s nástrojem, po ukázce výsledku, na první obrazovce …).
4. **Interaktivní prvek** (porovnání fondů, kalkulačka poplatků, skládání portfolia) a zda jeden, nebo víc.
5. **Pole formuláře** (doporučení: jen e-mail).
6. **Dvě verze reklamy** – v čem se liší (úhel, nadpis, nabídka) a kde poběží (např. Facebook/Instagram, Google).
7. **Jazyk a tón** (česky, tykání/vykání, míra odbornosti).
8. **Vizuální styl** – tak, aby stránka **nepůsobila jako základní výstup od Claude** (žádné generické gradienty a šablonové karty). Zeptat se na referenční stránky, barvy, tón.
9. **Technologie** (např. Next.js nebo čisté HTML+JS; doporučit to, co je nejrychlejší na mobilu).
10. **Ukládání kontaktů** (Supabase / Formspree / jiné) a co se děje po odeslání (děkovací stránka, e-mail).
11. **Měření** (PostHog / Vercel Analytics) a definice konverze.
12. **Které ETF** zařadit (kolik, podle jakého kritéria) a jak řešit dostupnost pro české drobné investory (viz upozornění níže).
13. **Právní a bezpečnostní texty** (rizika, souhlas se zpracováním osobních údajů).

---

## 8. Data a upozornění

### Odkud brát data o ETF (vždy se zdrojem a datem)
- **Weby správců fondů** (Vanguard, iShares, SPDR, Invesco): factsheety – poplatek (TER), velikost fondu, složení. Nejdůvěryhodnější zdroj.
- **Prospekt fondu** (SEC, formulář N-1A, tabulka poplatků) pro přesné poplatky.
- **Ceny a historie:** knihovna `yfinance` (neoficiální, pro ukázku stačí), Stooq (CSV), nebo API s bezplatným klíčem (Alpha Vantage, Twelve Data, Financial Modeling Prep). Pozor na licenční podmínky a limity.
- **Kurz USD/CZK:** denní kurzy ČNB.
- U každého čísla ulož: hodnota, zdroj (URL), datum stažení.

### Na co si dát pozor (ověřit, ne tvrdit z hlavy)
- ETF obchodované na NYSE jsou **americké**. Pro evropské drobné investory jsou u řady brokerů nedostupné kvůli regulaci (PRIIPs/KID). Poctivá stránka to buď řekne, nebo ukáže evropské ekvivalenty (UCITS). **Ověřit** u konkrétních brokerů, než se to napíše.
- **Daně pro české investory** (časový test, srážková daň z dividend z USA) – jen s ověřeným zdrojem. Jinak neuvádět.
- **Žádné sliby výnosů.** Povinné upozornění na riziko. Reklama na investice je v ČR regulovaná, nepoužívat vyvolávající nebo zavádějící tvrzení.
- **GDPR:** u formuláře souhlas se zpracováním osobních údajů, odkaz na zásady, údaj o správci. Žádné předzaškrtnuté souhlasy.
- Žádné vymyšlené reference, počty uživatelů ani „zákazníci".

### Měření celé cesty (minimálně tyto události)
`page_view` (s UTM parametry reklamy) → `scroll_50` → `cta_click` → `tool_used` (interaktivní prvek) → `form_start` → `form_submit` → `thank_you_view`.
Reklamy označ UTM parametry (`utm_source`, `utm_campaign`, `utm_content` = verze A/B), aby šlo porovnat obě verze.

---

## 9. Pracovní postup (shrnutí)

1. Přečti tento soubor. Zeptej se Mikyho, zda je vše v pořádku a zda je připravený GitHub a Vercel (sekce 6).
2. Navrhni **`docs/PLAN.md`** a nech ho schválit.
3. Projdi **rozhodnutí ze sekce 7** po skupinách, vždy s variantami. Zapiš `DECISIONS.md`.
4. První commity: dokumenty. Push.
5. Data + `SOURCES.md`. Commit. Push.
6. Stavba po malých krocích, commit po každém. Push na konci každé session.
7. Měření, reklamy, nasazení na Vercel.
8. Testy (mobil, rychlost, formulář, měření), právní texty.
9. README (sekce 5) + doplnění `AI-WORK-NOTES.md`.
10. Poslední kontrola podle sekce 2, `/export`, push.
11. Miky odešle odpověď Matejovi Lörincovi s odkazy.

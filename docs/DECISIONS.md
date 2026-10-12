# Rozhodnutí

Každé rozhodnutí: datum, co bylo na výběr, co Miky zvolil a proč. Varianty předložil Claude (vždy s doporučením), volbu dělal Miky.
Drobnosti s rozumnou výchozí volbou rozhoduje Claude sám – jsou na konci v sekci „Rozhodnuto Claudem".

---

## Skupina 1 – Cílovka a nabídka (11. 10. 2026)

### D1 – Cílová skupina
- **Varianty:** (a) viděl VOO/SPY na sociálních sítích a neví, jak začít *(doporučeno)* · (b) úplný začátečník · (c) už investuje a hledá nižší náklady
- **Zvoleno:** (a). Je to člověk ve věku 25–40 let, který má úspory na spořicím účtu a chce začít s ETF. O amerických ETF (VOO, SPY, QQQ) ví ze sociálních sítí. Neví, který fond vybrat, kolik stojí poplatky ani že americké ETF u řady brokerů v EU kvůli chybějícímu KID nekoupí (u některých, např. Fio, ano – viz `data/SOURCES.md` §4). *(Opraveno 11. 10. po ověření dat. Původně tu stálo „u většiny brokerů nekoupí“, což bylo neověřené tvrzení AI.)*
- **Proč:** Jde o ostrý a skutečný problém, který se dá použít v reklamě. Stránka díky tomu zůstane u zadání (ETF z NYSE) a zároveň může poctivě říct, co si český drobný investor reálně koupí (UCITS ekvivalenty). *Tvrzení o dostupnosti se před publikací ověří u konkrétních brokerů.*

### D2 – Lead magnet (co návštěvník dostane za e-mail)
- **Varianty:** (a) osobní srovnání e-mailem *(doporučeno)* · (b) výsledek kalkulačky jen po zadání e-mailu · (c) PDF průvodce „Jak začít"
- **Zvoleno:** (a). Na stránce návštěvník zdarma uvidí základní výsledek. E-mailem dostane plné srovnání: vybraná americká ETF, jejich UCITS ekvivalenty, poplatky v Kč pro jeho částku za 10 a 20 let a zdroje.
- **Proč:** Zadání chce, aby byla hodnota zřejmá ještě před formulářem. Varianta (b) skrývá výsledek, a to působí manipulativně. Varianta (c) je obecná a nenavazuje na interakci.

### D3 – Moment žádosti o kontakt
- **Varianty:** (a) po ukázce výsledku *(doporučeno)* · (b) už na první obrazovce · (c) až na konci stránky
- **Zvoleno:** (a). Formulář je hned pod výsledkem kalkulačky a druhý je na konci stránky jako záchyt.
- **Proč:** Žádost přichází ve chvíli největšího zájmu a navazuje na to, co návštěvník právě viděl. U studeného provozu z reklamy je žádost před ukázkou hodnoty obvykle slabší.

### D4 – Interaktivní prvky
- **Varianty:** (a) jeden prvek, kalkulačka poplatků, srovnání jen jako statická tabulka *(doporučeno)* · (b) dva prvky: interaktivní srovnání a kalkulačka · (c) skládání portfolia
- **Zvoleno:** (b) **dva prvky: interaktivní srovnání fondů + kalkulačka poplatků.** *Miky zvolil jinou variantu, než Claude doporučil.*
- **Proč (Miky):** dva prvky dávají návštěvníkovi víc hodnoty. Riziko, na které Claude upozornil: na mobilu se pozornost rozdělí a stavba trvá déle.
- **Důsledek pro návrh:** oba prvky musí vést ke stejnému formuláři a nesmí si konkurovat. Kalkulačka bude hlavní cesta s formulářem pod výsledkem. Srovnání bude podpůrné a jeho CTA povede ke kalkulačce, případně přímo k formuláři. Interakce s oběma prvky se měří zvlášť (`tool_used` s parametrem `tool=compare|calculator`), takže z dat bude vidět, který prvek konvertuje lépe. To je zároveň kandidát na A/B test.

---

## Skupina 2 – Formulář, reklamy, tón, vizuál (11. 10. 2026)

### D5 – Pole formuláře
- **Varianty:** (a) jen e-mail + souhlas *(doporučeno)* · (b) e-mail + křestní jméno · (c) e-mail + telefon
- **Zvoleno (vlastní varianta Mikyho):** **celé jméno, e-mail a telefon (volitelný)**. Souhlas není samostatné zaškrtávátko, je vyjádřen přímo tlačítkem pro odeslání a textem u něj.
- **Proč (Miky):** jméno a telefon dávají kontaktu větší obchodní hodnotu. Volitelný telefon nikoho nenutí.
- **Riziko, na které Claude upozornil:** každé pole navíc obvykle sníží počet odeslání, zejména na mobilu u studeného provozu z reklamy. *Kandidát na A/B test: formulář jen s e-mailem proti plnému formuláři.*
- **Otevřený bod:** jak právně správně spojit souhlas s tlačítkem. Řeší se v D13.

### D6 – Reklamy
- **Varianty:** (a) Meta (IG/FB), dva úhly *(doporučeno)* · (b) Meta + Google Search · (c) Meta, stejný úhel, jiná forma
- **Zvoleno:** (a). Obě verze jsou pro Instagram/Facebook na mobilu (4:5 a 9:16). Nabídka je stejná, liší se úhel:
  - **A, „bolest":** chceš koupit VOO, ale broker ho nenabízí, tady je proč a co místo něj.
  - **B, „čísla":** kolik tě za 20 let stojí poplatky ETF, spočítej si to v Kč.
  - *(Konkrétní texty se přizpůsobí vykání, viz D7.)*
- **Proč:** jeden kanál a jedna nabídka znamenají čistý A/B test úhlu. Výsledky se dají srovnat přes `utm_content=a|b`.

### D7 – Jazyk a tón
- **Varianty:** (a) tykání, věcně *(doporučeno)* · (b) vykání, věcně · (c) tykání, odlehčeně
- **Zvoleno:** (b) **česky, vykání, věcně.** *Jiná volba než doporučení.*
- **Proč (Miky):** u investic jde o důvěru a vykání působí seriózněji.
- **Důsledek:** reklamy i stránka budou vykat. Odborné pojmy (TER, UCITS, KID) se vysvětlí jednou krátkou větou.

### D8 – Vizuální styl
- **Varianty:** (a) finanční tisk / editorial *(doporučeno)* · (b) tmavý terminál / trading · (c) světlý fintech
- **Zvoleno (vlastní zadání Mikyho):** **moderní styl Apple / „Liquid Glass"**
  - matné sklo (`backdrop-filter: blur`) na kartách v hero sekci, na kartách ETF a ve formuláři
  - jemný světlý přechod na pozadí s rozmazaným tmavě zeleným akcentem
  - hlavní akcentová barva tmavě zelená, odkazy tmavě modré
  - moderní bezpatkové písmo, čísla v tabulkovém písmu (`tabular-nums`)
  - tabulka s daty a zdroji na téměř nepropustném světlém podkladu kvůli čitelnosti
  - žádné stock fotky
  - mobil první, velké tlačítko, vysoký kontrast
  - náhradní styl bez blur pro starší prohlížeče (`@supports`)
- **Proč (Miky):** moderní a prémiový dojem, který působí jako produkt, a ne jako šablona.
- **Na co si dát pozor (Claude):** blur je na slabších telefonech náročný na výkon. Použijeme ho jen na pár ploch, ne na celou stránku, a ověří se v Lighthouse. Kontrast textu na skle se musí změřit (WCAG AA).

---

## Skupina 3 – Technologie, kontakty, měření, ETF (11. 10. 2026)

### D9 – Technologie
- **Varianty:** (a) Astro + trochu JS *(doporučeno)* · (b) Vite + React · (c) Next.js · (d) čisté HTML + JS
- **Zvoleno:** (a) **Astro**. Statické HTML, JavaScript jen pro dva interaktivní prvky a formulář, odeslání přes serverovou funkci na Vercelu.
- **Proč:** u provozu z reklamy na mobilu rozhoduje rychlost první obrazovky. Klíče zůstanou na serveru.

### D10 – Ukládání kontaktů a co přijde po odeslání
- **Varianty:** (a) Supabase + děkovací stránka + e-mail *(doporučeno)* · (b) Supabase + jen děkovací stránka · (c) Formspree
- **Zvoleno:** (a). Kontakt se přes serverovou funkci uloží do tabulky v Supabase. Děkovací stránka okamžitě ukáže plné osobní srovnání. Stejný obsah přijde e-mailem přes Resend.
- **Proč:** hodnotu návštěvník dostane hned, nečeká na e-mail. E-mail slouží jako trvalá kopie a první krok vztahu.
- **Otevřený bod:** Resend bez ověřené domény posílá jen na adresu vlastníka účtu. Doména se řeší v D14.

### D11 – Měření
- **Varianty:** (a) PostHog EU *(doporučeno)* · (b) Vercel Analytics · (c) GA4
- **Zvoleno (kombinace podle Mikyho):** **PostHog EU + Vercel Analytics.**
  - **PostHog EU** (hlavní nástroj): všechny události cesty `page_view` (s UTM) → `scroll_50` → `cta_click` → `tool_used` (`tool=compare|calculator`) → `form_start` → `form_submit` → `thank_you_view`, trychtýř a rozpad podle `utm_content` (reklama A/B).
  - **Vercel Analytics** (kontrola): návštěvy, zdroje a rychlost stránky (Web Vitals). Slouží ke křížové kontrole počtu návštěv z PostHogu.
- **Proč (Miky):** dvě nezávislá měření a navíc data o rychlosti stránky.
- *Poznámka Claude: vlastní události ve Vercel Analytics jsou podle mých informací jen v placeném plánu. Celý trychtýř proto poběží v PostHogu a Vercel použijeme na návštěvy a výkon. Ověří se při nastavení.*

### D12 – Výběr ETF
- **Varianty:** (a) 6 populárních z NYSE + UCITS protějšky *(doporučeno)* · (b) jen trojice S&P 500 · (c) 10–12 ETF napříč kategoriemi
- **Zvoleno:** (a) **SPY, IVV, VOO** (S&P 500), **VTI** (celý trh USA), **VT** (celý svět), **SCHD** (dividendový). Ke každému evropský UCITS ekvivalent.
- **Kritérium:** velikost fondu a popularita u drobných investorů, obchodování na NYSE (NYSE Arca). QQQ je vynechán, protože je kótován na Nasdaqu.
- **Ke kontrole:** burzu, TER a velikost každého fondu ověřit z webu správce. Dostupnost amerických ETF pro české drobné investory ověřit u konkrétních brokerů se zdrojem.

---

## Skupina 4 – Právní texty, značka, doména (11. 10. 2026)

### D13 – Souhlas a formulář
- **Varianty:** (a) tlačítko + volitelné nezaškrtnuté políčko pro marketing *(doporučeno)* · (b) jen tlačítko, bez marketingu · (c) vše jedním tlačítkem (nedoporučeno, protože souhlas svázaný se službou není svobodný)
- **Zvoleno:** (a).
  - Tlačítko „Poslat mi srovnání". Pod ním text: „Odesláním žádáte o zaslání srovnání. Údaje zpracujeme podle Zásad ochrany osobních údajů." Zaslání srovnání je postavené na žádosti, ne na souhlasu.
  - Jedno **nezaškrtnuté** volitelné políčko pro další e-maily a telefonát (telefon jen pokud ho návštěvník vyplnil).
- **Proč:** splňuje Mikyho požadavek, aby hlavní rozhodnutí bylo jen tlačítko, a zároveň odděluje marketingový souhlas, jak vyžaduje GDPR a zákon 480/2004 Sb. Data navíc ukážou, kolik lidí chce další komunikaci.

### D14 – Značka a správce údajů
- **Varianty:** (a) Miky jménem bez označení „demo" · (b) Miky jménem a viditelná poznámka „ukázka" · (c) nechat na Matejovi
- **Zvoleno (Miky):** stránka ponese **fiktivní značku „Fingramo"**.
- **Upřesnění Mikyho:** úloha je **ukázka pro výběrové řízení, ne ostrá kampaň**. Pro skutečné spuštění by se použily reálné údaje firmy (IČO, logo, správce).
- **Jak to provedeme:** Fingramo je název značky ukázky. Neuvádíme vymyšlené IČO ani právní formu („a.s."). V zásadách ochrany údajů je věta, že jde o ukázkový projekt, a jako kontakt pro dotazy k údajům je uveden Miky. Formulář totiž sbírá skutečné údaje hodnotitelů. README obsahuje seznam věcí, které se před ostrou kampaní vymění.
- *Claude původně tlačil na „ostrou" právní úplnost. Miky upřesnil, že jde o ukázku. Zapsáno v AI-WORK-NOTES.*

### D15 – Doména a hosting
- **Varianty:** (a) bez domény, e-mail jako další krok *(doporučeno)* · (b) Miky má doménu · (c) koupit doménu
- **Zvoleno:** (b). Doména **`stoyka.eu`**. Miky ji sám ověří v Resendu (DNS záznamy). Stránka poběží na **Vercelu** pod adresou typu `fingramo.vercel.app`.
- **Doporučení Claude:** odesílat ze subdomény (např. `mail.stoyka.eu`), aby se nic nerozbilo na hlavní doméně. Odesílatel např. `Fingramo <srovnani@mail.stoyka.eu>`.

### D10 – doplnění (11. 10. 2026)
- Supabase projekt **`fingramo-leads`** (ref `hfsfbpgoevutdfgjfqbs`, region eu-central-1 / Frankfurt) založil Claude na Mikyho pokyn přes Supabase konektor. Je v organizaci vedle projektu fakturr, free plán, cena 0 USD.
- **Omezení (Miky): egress na free plánu jen 5 GB** a sdílí se s projektem fakturr. Proto:
  - stránka **nečte** z databáze nic, data o ETF jsou statický soubor v buildu
  - serverová funkce jen **vkládá** řádek a nevrací ho zpět (`Prefer: return=minimal`)
  - žádné obrázky ani soubory v Supabase Storage
  - z prohlížeče se do Supabase nevolá vůbec, jen ze serverové funkce na Vercelu

## Skupina 5 – Obsah (Fáze 2, 11. 10. 2026)

### D16 – Výpočet v kalkulačce
- **Varianty:** (a) bez růstu + volitelný scénář s výnosem, který si nastaví návštěvník *(doporučeno)* · (b) ilustrativní výnos (např. 5 %) jako výchozí · (c) jen bez růstu
- **Zvoleno:** (a). Hlavní výsledek je „minimálně zaplatíte X Kč", počítaný z vložených peněz bez růstu. Pod ním je rozbalovací „A co kdyby investice rostla?" s posuvníkem výnosu, výchozí hodnota 0 % a popisek „váš předpoklad, ne náš slib".
- **Proč:** u reklamy na investice nesmí stránka naznačovat výnosy. Předpoklad 5 % nemá zdroj. Rozdíl mezi fondy je dobře vidět i bez růstu.

### D17 – Nadpis hero podle reklamy
- **Varianty:** (a) měnit podle `utm_content` *(doporučeno)* · (b) jeden nadpis pro obě
- **Zvoleno:** (a). `utm_content=a` zobrazí nadpis o VOO, `b` nebo žádný UTM zobrazí nadpis o poplatcích v Kč. Nadpis se vybírá před vykreslením, takže nebliká.
- **Proč:** zadání chce, aby první obrazovka navazovala na slib reklamy. Test A/B pak měří celou cestu reklama → stránka.

### D18 – Pořadí sekcí a texty
- **Zvoleno:** návrh v `docs/CONTENT.md` a `ads/README.md` **schválen bez změn**. Pořadí: hero → kalkulačka s formulářem → srovnání 6 ETF → proč VOO nenajdete → co pošleme → daně → FAQ + formulář → patička. Zdůvodnění je v CONTENT.md §2.

---

## Skupina 6 – Úpravy po Mikyho kontrole stránky (11. 10. 2026)

### D19 – Barevná paleta
- **Podnět (Miky):** zelená je příliš jednoduchá a chybí modrá (modrá = důvěra, zelená = peníze).
- **Varianty (s vizuální ukázkou):** (a) smaragd + námořní modř *(doporučeno)* · (b) modrá vede, zelená jen pro částky · (c) teal + indigo
- **Zvoleno:** (a). Námořní modrá na nadpisy, odkazy a prvky důvěry (zdroje, „data od správců"). Svěží smaragdová na tlačítka a částky.

### D20 – Rozložení kalkulačky na desktopu
- **Podnět (Miky):** vlevo pod vstupy je hodně prázdného místa.
- **Zvoleno (návrh Claude):** vlevo vstupy a pod nimi formulář, který se při scrollu drží na místě. Vpravo graf a poplatky. Na mobilu zůstává pořadí vstupy → výsledek → formulář.

### D21 – Kolik můžu vydělat (mění D16)
- **Podnět (Miky):** chybí, kolik investuji a kolik můžu vydělat. Chtěl graf se 3 úrovněmi vývoje.
- **Varianty zdroje výnosů:** (a) scénáře z KID fondu *(doporučeno)* · (b) pevná 2/5/8 % (bez zdroje) · (c) historický výnos S&P 500
- **Zjištění při ověřování:** scénáře v KID SPYL platí pro **5 let** (umírněný 14,8 % ročně). Protáhnout je na 20 let by vedlo k číslům v milionech Kč, která KID netvrdí a která by působila jako slib.
- **Zvoleno (vlastní zadání Mikyho):**
  - **graf na 5 let se 4 scénáři z KID** (stresový, nepříznivý, umírněný, příznivý) pro zadanou částku,
  - pro horizont **10–20 let se scénáře KID neprodlužují**; místo toho (a) dopad poplatků v Kč na zvolený horizont a (b) **historický rozsah ročních výnosů S&P 500** za stejně dlouhá období (nejhorší / medián / nejlepší) z veřejných dat, s popiskem „historie, ne předpověď", poznámkou o měně (USD) a bez daní a poplatků,
  - všechna data v `data/`, zdroje v SOURCES.md §6–7.
- **Vztah k D16:** výsledek poplatků zůstává bez růstu („minimálně"). Výnosy jsou samostatný blok se zdrojem.

### D22 – Počet formulářů
- **Podnět (Miky):** nevadí, že jsou na stránce 3 formuláře?
- **Varianty:** (a) nechat 3 a změřit *(doporučeno)* · (b) 2 formuláře (kalkulačka + závěr) · (c) jeden formulář u kalkulačky
- **Zvoleno:** (a). Formulář u kalkulačky a u FAQ je vidět vždy. Formulář u srovnání se rozbalí až po kliknutí, takže návštěvník vidí najednou 2.
- **Proč:** zadání chce, aby každý interaktivní prvek vedl ke kontaktu. Závěrečný formulář zachytí lidi, kteří nástroje přeskočili. Riziko „vtíravosti" se změří: `form_submit` má parametr `form_location`. **Hypotéza pro A/B test** (README): jeden formulář vs. více.

### D23 – Designová doporučení z Antigravity (Google)
- **Podnět (Miky):** projít doporučení jiného AI nástroje (Antigravity) a navrhnout opravy.
- **Postup:** Claude prošel všech 12 bodů proti zadání, datům a rozhodnutím a ke každému dal verdikt. Miky zvolil **upravenou verzi**.
- **Převzato:** silnější CTA se stínem, vyšší krytí karet, štítek u fondu s nejnižším poplatkem, štítek rozdílu poplatku SPY vs. VOO, řádek správců v hero, na mobilu poplatky a formulář hned pod vstupy, mikro-garance pod tlačítkem, pole 52 px, `npm run check`.
- **Upraveno nebo odmítnuto a proč:**
  - gradient `#10b981 → #059669` se září: výchozí Tailwind barvy, šablonovitý vzhled, kontrast bílého textu ~2,5:1 → **plná smaragdová `#0a7a55` (~5,4:1)**
  - krytí 92 %: zničilo by sklo z D8 → **78 %**
  - „nejvýhodnější“ / „doporučená volba SPYL/VUAA pro ČR“: **VUAA není nejlevnější** (0,07 % vs. SPYL 0,03 %) a „doporučená“ by bylo investiční doporučení → **věcný štítek „Nejnižší poplatek“** podle dat, plus „Registrováno pro ČR“ tam, kde je zdroj
  - „PDF tahák pro nákup u brokerů (XTB, Portu, Fio)“: takový obsah neexistuje a nabídky brokerů nejsou ověřené → **„do e-mailu a hned i k uložení jako PDF“** (pravda)
  - tlačítko „Získat srovnání a PDF report zdarma“ → kratší **„Získat srovnání zdarma“**
  - graf do rozbalovacího bloku: graf si Miky výslovně přál (D21) → **viditelný, na mobilu za formulářem**
  - „🔒 100% zdarma“ → ikona SVG, bez „100%“

### D24 – Měření bez cookies a záznamy relací
- **Varianty (cookies):** (a) PostHog „cookieless server hash mode" (stavový) *(doporučeno)* · (b) běžné cookies + cookie lišta
- **Zvoleno:** (a). Nic se neukládá v prohlížeči, cookie lišta není potřeba a trychtýř přes `/dekujeme` funguje. Nastavení projektu změnil Claude na Mikyho souhlas.
- **Varianty (záznamy relací a heatmapy):** (a) vypnout *(doporučeno: citlivý formulář, výkon na mobilu)* · (b) nechat zapnuté
- **Zvoleno:** (b) **nechat zapnuté** (Miky). Zásady ochrany údajů to uvádějí. Obsah polí formuláře se nepřenáší (výchozí maskování vstupů v PostHogu).

### D25 – Rozmazaný detail za e-mail a volitelné jméno (mění D3 a D5, 11. 10. 2026)
- **Podnět (Miky):** „neuděláme něco skryté/rozmyté, aby člověk byl nucený zadat e-mail… jméno a příjmení tím pádem taky volitelné, ne vše toto mají rádi vyplňovat."
- **Upozornění Clauda:** zadání chce, aby *„hodnota byla zrejmá ešte pred vyplnením formulára"*. Rozmazat celý výsledek by šlo proti zadání a lidé z reklamy by odešli bez výsledku.
- **Varianty (brána):** (a) částečná brána: hlavní výsledek vidět, detail rozmazaný *(doporučeno)* · (b) rozmazat jen sekci Srovnání 6 ETF · (c) rozmazat celý výsledek · (d) nic nerozmazávat
- **Zvoleno:** (a). Vidět zůstane, kolik vložíte, poplatky u nejlevnějšího a nejdražšího fondu a rozdíl SPY vs. VOO v Kč. Rozmazané jsou: řádky všech 12 fondů v Kč, graf scénářů z KID a historický rozsah. Upozornění na riziko a zdroje zůstávají vždy čitelné. Po odeslání formuláře je detail na `/dekujeme`, v e-mailu i odemčený na stránce.
- **Varianty (pole):** (a) e-mail + volitelné jméno, telefon pryč *(doporučeno)* · (b) e-mail + volitelné jméno i telefon · (c) jen e-mail
- **Zvoleno:** (b). Povinný je jen e-mail. Jméno slouží k oslovení v e-mailu, telefon zůstává pro případný hovor (jen se souhlasem).
- **Dopad (D25):** sloupec `full_name` je volitelný (nová migrace), verze souhlasu `v2-2026-10-11`, zásady upravené. Pozor: rozmazání je jen vizuální, čísla jsou v kódu stránky. Pro lead magnet stačí, nejde o tajná data.


### D26 – Logo a vzhled e-mailu (11. 10. 2026)
- **Zadání (Miky):** logo v SVG podle jeho předlohy („F" s horní příčkou jako stoupající šipka), barvy a design podle webu, logo všude, kde je potřeba, i v e-mailu. E-mail designově zdokonalit podle webu: odstupy, přehlednost, čitelnost.
- **Provedení (rozhodl Claude podle zadání):** tvar podle předlohy, barvy z palety A (D19): nožka a název navy `#0f1d45`, šipka emerald `#12a16b`. Název malými písmeny „fingramo" jako na předloze. Varianty: světlá, tmavá (bílá nožka na navy, patička) a ikona/favicon (navy dlaždice).
- **Kde je logo:** hero, `/dekujeme`, `/zasady`, `/zdroje` (odkaz na úvod), patička, favicon, obě reklamy (4 obrázky znovu vyrenderované), e-mail.
- **E-mail jako PNG:** Gmail a Outlook SVG nezobrazí, proto `public/email-logo.png` (3× rozlišení, průhledné pozadí).
- **E-mail:** barvy palety A místo staré zelené, logo, souhrn zadání, rozdíl SPY vs. VOO spočítaný ze stejných dat jako tabulka, přehledná tabulka po fondech, kroky „Co dál", tlačítko, upozornění na riziko. Částky evropských verzí jsou neutrální, ne zelené: zelená na webu znamená „výhodné" a evropská verze bývá i dražší (např. SPYD).

### D27 – Lepivá horní lišta, graf a PDF v e-mailu (11. 10. 2026)
- **Podnět (Miky):** horní řádek jako menu, logo viditelné při scrollování a vpravo tlačítko k formuláři dole. V e-mailu chybí graf a PDF; e-mail lépe přizpůsobit mobilu.
- **Zjištění Clauda:** brána (D25) slibuje „Odemknout 4 scénáře", ale scénáře nebyly v e-mailu ani na děkovací stránce. PDF šlo uložit jen na děkovací stránce, formulář přitom slibuje „Do e-mailu a hned i k uložení jako PDF".
- **Varianty (PDF):** (a) PDF jako příloha e-mailu *(doporučeno)* · (b) odkaz na stránku, kde si ho uloží · (c) bez PDF, upravit text
- **Zvoleno:** (a).
- **Varianty (lepivé tlačítko dole na mobilu):** (a) odebrat, zůstane jen horní lišta *(doporučeno)* · (b) nechat obojí · (c) na mobilu nahoře jen logo
- **Zvoleno:** (a). Mění rozhodnutí „Lepivé CTA na mobilu" z drobností.
- **Graf (rozhodl Claude):** v e-mailu z HTML tabulek (sloupce), ne obrázek: zobrazí ho každý klient a data neodcházejí žádné další službě.

## Skupina 7 – Doladění před README (11. 10. 2026)

Kontext: Miky se zeptal, jak funguje A/B test. Claude vysvětlil, že dnes se testuje jen úhel reklamy: `utm_content` přepíná nadpis a podnadpis, zbytek stránky je stejný a provoz se na stránce náhodně nedělí. Pak položil 15 otázek ve 4 skupinách.

### D28 – A/B test na stránce
- **Varianty (rozsah):** (a) 1 test reálně připravit, 2 popsat *(doporučeno)* · (b) všechny 3 připravit · (c) jen popsat v README
- **Zvoleno:** (a).
- **Tři hypotézy (Miky vybral), pořadí podle dopadu (doporučení přijato):** 1. míra brány (rozmazání) · 2. kalkulačka na 1. obrazovce · 3. pole formuláře.
- **Živý test:** H2, kalkulačka na 1. obrazovce. Varianta B = v hero pole „Kolik chcete investovat měsíčně" a tlačítko „Spočítat". Hodnota se přenese do kalkulačky a stránka sjede k výsledku.
- **Přiřazení:** náhodně 50/50 před vykreslením (bez problikávání), zapamatované jen v rámci záložky (sessionStorage). Nic trvalého se neukládá, režim bez cookies (D24) platí dál.
- **Proč vlastní rozdělení a ne PostHog Experiments:** v režimu bez cookies se varianta z PostHogu načítá se zpožděním (podle dokumentace), stránka by mohla problikávat. Vyzkoušené to nemáme.
- **Test reklamy (A/B podle `utm_content`) běží dál nezávisle,** takže vzniknou 4 kombinace.

### D29 – Karta na 1. obrazovce podle reklamy
- **Varianty:** (a) i karta v hero podle reklamy *(doporučeno)* · (b) karta i pořadí sekcí · (c) jen nadpis
- **Zvoleno:** (a). Reklama A („váš broker ho možná nenabízí") dostane kartu s páry originál → evropská verze, reklama B dnešní SPY vs. VOO.

### D30 – Tlačítko v horní liště
- **Varianty:** (a) k poslednímu formuláři · (b) ke kalkulačce, dokud ji návštěvník nepoužil, potom k formuláři *(doporučeno)* · (c) k nejbližšímu formuláři
- **Zvoleno:** (b). Mění D27.

### D31 – Délka stránky a „Kdo za tím stojí"
- **Varianty (délka):** (a) nechat sekce, zhustit KID a daně (část do FAQ) *(doporučeno)* · (b) výrazně zkrátit · (c) nechat
- **Zvoleno:** (a).
- **„Kdo za tím stojí":** krátký blok 2–3 věty: odkud jsou data (zdroje s odkazy), že nejde o brokera ani investičního poradce a že za srovnání nikdo neplatí. Žádné vymyšlené reference, počty uživatelů ani jméno autora (Miky).

### D32 – Děkovací stránka
- **Varianty:** (a) 1 dobrovolná otázka *(doporučeno)* · (b) nic · (c) sdílení s kamarádem
- **Zvoleno:** (a) i (c): otázka „Už investujete?" jedním klikem a tlačítko sdílení.

### D33 – Soukromí
- **Záznamy relací (mění D24):** vypnout, souhrnné heatmapy kliknutí nechat.
- **README dostane sekci „Soukromí a právní stránka":** co měříme a proč, co jsme vědomě nezapnuli (záznamy relací) a proč. K tomu seznam pro ostré nasazení: cookie lišta se souhlasem a možností odmítnout, záznamy relací jen po souhlasu, zásady s identifikací provozovatele, smlouvy o zpracování s dodavateli (PostHog, Supabase, hosting), doba uchování leadů a mazání na požádání, double opt-in, ověření právního textu u odborníka.
- **Marketingový souhlas:** jednoduchý (nezaškrtnuté políčko), double opt-in jen popsat (doporučení přijato).

### D34 – Co zatím neměníme
- Doména zůstává `fingramo.vercel.app`.
- Kalkulačka počítá jen TER.
- Navazující e-maily jen popsat v README.
- Žádné vyskakovací okno.
- **OG obrázek (náhled odkazu) později,** spolu s grafikou (Miky).
- **Grafika:** jednoduché vlastní SVG ikony a ilustrace v barvách webu, bez fotek. Až po funkčních změnách.

### D35 – Úpravy po Mikyho kontrole stránky (11. 10. 2026, Fáze 5c)
Miky si stránku prošel v prohlížeči a poslal 8 bodů. Claude je nejdřív ověřil v kódu a u nejasných se zeptal.
- **TER všech 12 fondů:** ověřeno podruhé u správců a v KID, vše sedí (data/SOURCES.md, „Druhá kontrola TER"). Data se nemění.
- **Pole „Firma":** návštěvník ho nevidí, je to skrytá past na roboty. Varianty: (a) nechat past a přejmenovat *(doporučeno)* · (b) úplně odstranit. **Zvoleno (a):** pole se teď jmenuje `website` s popiskem „Toto pole nechte prázdné".
- **Souhlasy:** e-mailové tipy a telefonický kontakt jsou dvě samostatná, nezaškrtnutá pole (verze souhlasu v3). V databázi přibyl sloupec `phone_consent`, který se uloží jen spolu s telefonem.
- **Počet formulářů:** základní verze má 2 (u kalkulačky a na konci). Varianty: odebrat (a) ten pod srovnáním *(doporučeno)* · (b) ten na konci. **Zvoleno (a).**
- **Varianta se 3 formuláři:** (a) přepínač `?forms=3` a hypotéza do README *(doporučeno)* · (b) druhý živý test 50/50. **Zvoleno (a):** ostře dál běží jediný test (H2, D28).
- **Otázka na částku ve formuláři:** (a) nepřidávat, jen vysvětlit, proč chceme telefon *(doporučeno)* · (b) nepovinný výběr rozmezí. **Zvoleno (a):** částku už posílá kalkulačka, další pole by konverzi spíš snížilo.
- **Mobil:** srovnání má originál a evropskou verzi vedle sebe, zamčený seznam 12 fondů je na mobilu jen ukázka. Stránka na 390 px: 10 442 → 9 538 px (změřeno na produkci, varianta control; hero_input 9 569 px), formulář u kalkulačky 2 539 → 2 262 px. Dotykové plochy mají min. 44 px.
- **Dashboard:** nový insight „Cena za lead podle reklamy (A vs. B)" (Miky souhlasil s vytvořením). Útrata je prázdná, dokud kampaň neběží.

#### Test obou verzí reklamy (11. 10. 2026)
Ověřeno na produkci https://fingramo.vercel.app a lokálně, nový test `tests/e2e/ad-variants.spec.ts`. Kombinace: 2 reklamy × 2 varianty první obrazovky × mobil a desktop = 8 průchodů.

| | `utm_content=a` | `utm_content=b` |
|---|---|---|
| Slib reklamy | „Chcete VOO? Váš broker ho možná nenabízí." | „Stejný index S&P 500. Jiný poplatek." |
| Nadpis na stránce | „Chcete VOO nebo SPY? Ukážeme vám, co si z Česka opravdu koupíte." ✅ | „Stejný index, jiný poplatek. Kolik vás ETF stojí v korunách?" ✅ |
| Karta na 1. obrazovce | páry VOO → VUAA, SPY → SPYL, VT → VWCE (stejné jako v reklamě) ✅ | SPY 0,0945 % vs. VOO 0,03 % (stejné jako v reklamě) ✅ |
| Vstup do kalkulačky na 1. obrazovce | tlačítko i pole (`hero_input`) viditelné bez scrollu ✅ | ✅ |
| Kalkulačka → formulář → děkovací stránka | prošlo, `tool_used` → `form_start` → `form_submit` → `thank_you_view` ✅ | ✅ |
| Lead nese UTM | `utm_content = a` a celá kampaň ✅ | `utm_content = b` ✅ |
| Vodorovný scroll / chyby v konzoli | žádné ✅ | žádné ✅ |

**Výsledek:** obě verze reklamy fungují, první obrazovka navazuje na slib své reklamy a lead jde přiřadit k reklamě (UTM v databázi i `ad_variant` v PostHogu). Celá E2E sada proti produkci: 105 prošlo, 9 přeskočeno (testy jen pro lokální server nebo jen pro mobil). Jak si reklamy vedou u lidí, ukáže až běžící kampaň na dashboardu (trychtýř a cena za lead podle varianty).

### D36 – Grafika a náhledový obrázek (11. 10. 2026, Fáze 5b krok 10)
- **Rozsah:** (a) ikony + 1 ilustrace na děkovací stránce *(doporučeno)* · (b) jen ikony · (c) ikony + ilustrace v hero. **Zvoleno (a).** Hlavní stránka se skoro neprodlouží (mobil jsme právě zkrátili).
- **Styl ikon:** (a) linkové, tmavě modrá kontura + jeden zelený detail jako šipka v logu *(doporučeno)* · (b) plné v kolečku. **Zvoleno (a).**
- **OG obrázek (1200 × 630):** (a) logo + nadpis „Stejný index, jiný poplatek." + karta SPY vs. VOO se skutečnými čísly *(doporučeno)* · (b) páry US → evropská verze · (c) jen logo a slogan. **Zvoleno (a).** Navazuje na reklamu B a výchozí variantu stránky.
- **Komponenta:** (a) jedna sdílená `src/components/Icon.astro` s inline SVG, bez knihovny *(doporučeno)* · (b) SVG přímo v sekcích. **Zvoleno (a).**

### D37 – Opravy po ruční kontrole produkce (12. 10. 2026)
Claude prošel produkci jako návštěvník (log: [QA-2026-10-12.md](QA-2026-10-12.md), 16 nálezů) a na 4 hlavní se zeptal.
- **Částka z hero:** (a) jednorázově 0 a ukázat pole kalkulačky *(doporučeno)* · (b) nechat 100 000 a upozornit · (c) v hero obě pole. **Zvoleno (a).**
- **Kam vedou „Získat srovnání" a „Chci srovnání":** (a) k nejbližšímu formuláři *(doporučeno)* · (b) vždy k formuláři u kalkulačky. **Zvoleno (a).**
- **Souhlasy:** (a) nad tlačítko *(doporučeno)* · (b) nechat pod tlačítkem. **Zvoleno (a).**
- **Odhlášení z e-mailů:** (a) opravit texty na pravdu *(doporučeno)* · (b) postavit odhlašovací odkaz. **Zvoleno (a).**
- Drobnosti (strop částek, výzva při nule, 404, štítky fondů, Xtrackers, nadpis FAQ, README) Claude opravil podle návrhů v logu. Dva body nechal záměrně (přímý přístup na `/dekujeme`, kurzor v kalkulačce), důvody jsou v logu.

### D38 – Formulář bez zaškrtávacích polí pro reklamu A (12. 10. 2026)
- **Podnět (Miky):** v jedné variantě místo zaškrtávacích polí jen text nad tlačítkem, že stisknutím souhlasíte s oběma souhlasy.
- **Upozornění Clauda:** souhlas daný tlačítkem, kterým se zároveň žádá o srovnání, není podle GDPR (čl. 7 odst. 4) svobodný a nestačí ani pro obchodní sdělení (zákon 480/2004 Sb.). Totéž jsme zamítli v D13 (varianta c).
- **Varianty:** (a) formulář bez polí, souhlas až na děkovací stránce *(doporučeno)* · (b) jedno pole místo dvou · (c) přesně podle podnětu (riziko). **Zvoleno (a).**
- **Kde:** (a) přepínač `?consent=` a hypotéza *(doporučeno)* · (b) navázat na reklamu A nebo B · (c) druhý živý test 50/50. **Zvoleno (b), reklama A** (doporučeno z dvojice A/B: varianta se týká jen jasně ohraničené skupiny, přímé a sdílené návštěvy mají dál dvě pole).
- **Důsledek, na který Claude upozornil a Miky ho přijal:** rozdíl mezi reklamou A a B v konverzi teď může způsobit reklama i formulář, nepůjde je od sebe oddělit. V README je to uvedené u testu reklam.
- **Provedení:** formulář z reklamy A nemá zaškrtávací pole, místo nich věta „zeptáme se vás až po odeslání". Na děkovací stránce dvě tlačítka „Ano, posílejte mi další tipy e-mailem" a „Ano, můžete mi zavolat" (to druhé jen s vyplněným telefonem). Souhlas uloží `/api/consent` ke kontaktu podle náhodného `lead_ref`, jen do 24 h a jen u kontaktu z této varianty. V databázi jsou nové sloupce `consent_source` (form / thank_you) a `consent_updated_at`, verze textu `v3a-2026-10-12`. Zásady jsou upravené.

### D39 – Kontrola textového návrhu od ChatGPT (12. 10. 2026)
Miky dal Claudovi zkontrolovat návrh úprav textů od ChatGPT. Claude každý bod porovnal s aktuální stránkou a se zdroji. Část návrhu pracovala se starým stavem (vysvětlení u telefonu, Xtrackers, vysvětlení TER už byly hotové).
- **Věcné opravy (Miky vybral všechny 4 doporučené):**
  - FAQ o souhlasu platí pro obě varianty formuláře;
  - bez superlativu „6 nejpopulárnějších" (pořadí podle popularity nemáme doložené žádným zdrojem; fondy jsme vybrali podle D12, ne jako prvních 6 v žebříčku);
  - věta s výsledkem říká „za celou dobu" místo „ročních poplatcích";
  - „Evropská alternativa" u fondů s jiným indexem (VTI, VT, SCHD) na stránce, v e-mailu i v PDF.
- **Styl (Miky vybral 1 ze 4):** kratší nadpis kalkulačky „Spočítejte si poplatky pro svou investici".
- **Záměrně nepřevzato:**
  - vágnější texty o dividendách a UCITS (dnešní jsou doložené zdroji),
  - delší poznámka na kartě amerického fondu (úzké karty na mobilu),
  - změny nadpisů hero a „za 10 vteřin" (oslabily by návaznost na reklamy),
  - „Odemknout" → „Získat" a věta „Stačí e-mail" (jen styl, stránka by se prodloužila).

---

## Rozhodnuto Claudem (drobnosti)
- **Graf scénářů i po odeslání (11. 10., na Mikyho dotaz „ukáže se ten graf v e-mailu/PDF?"):** čárový graf vývoje za 5 let je teď i na děkovací stránce a v PDF příloze. Stránka i děkovací stránka používají stejnou funkci, takže ukazují totéž. V e-mailu zůstávají pruhy z HTML tabulek, protože čárový graf by musel být obrázek: Gmail ani Outlook vložené SVG nezobrazí a generovat obrázek na serveru nebo přes cizí službu je zbytečná složitost (D27).
- **Definice konverze (11. 10.):** konverze = `form_submit` potvrzený serverem (kontakt skutečně uložený) ÷ unikátní návštěvníci s `utm_source` z reklamy. Proč: kliknutí na tlačítko, které skončí chybou, není kontakt.
- **Název značky:** ověřeno 11. 10. v ARES a na webu: „Fingramo“ nikdo nepoužívá, podobná FINGRAM CS s.r.o. je z jiného oboru (SOURCES.md).
- **Výchozí hodnoty kalkulačky (11. 10.):** 100 000 Kč jednorázově, 3 000 Kč měsíčně, 20 let. Odpovídají typickému začínajícímu investorovi a dají se snadno přepsat.
- **Výchozí hero bez UTM:** varianta B (obecnější).
- ~~**Lepivé CTA na mobilu** po odscrollování hero.~~ Nahrazeno lepivou horní lištou (D27).
- **Měření (11. 10.):** autocapture vypnuté, posílají se jen explicitní události trychtýře (čistší data, méně JS na mobilu). PostHog se načítá asynchronně, takže nezdržuje první vykreslení. `sendBeacon` kvůli přesměrování po odeslání.

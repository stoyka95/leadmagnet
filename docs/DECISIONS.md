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

---

## Rozhodnuto Claudem (drobnosti)
- **Definice konverze (11. 10.):** konverze = `form_submit` potvrzený serverem (kontakt skutečně uložený) ÷ unikátní návštěvníci s `utm_source` z reklamy. Proč: kliknutí na tlačítko, které skončí chybou, není kontakt.
- **Název značky:** před použitím ověřit, že „Fingramo" nepoužívá existující firma (ARES, web).
- **Výchozí hodnoty kalkulačky (11. 10.):** 100 000 Kč jednorázově, 3 000 Kč měsíčně, 20 let. Odpovídají typickému začínajícímu investorovi a dají se snadno přepsat.
- **Výchozí hero bez UTM:** varianta B (obecnější).
- **Lepivé CTA na mobilu** po odscrollování hero.
- **Měření (11. 10.):** autocapture vypnuté, posílají se jen explicitní události trychtýře (čistší data, méně JS na mobilu). PostHog se načítá asynchronně, takže nezdržuje první vykreslení. `sendBeacon` kvůli přesměrování po odeslání.

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

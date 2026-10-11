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

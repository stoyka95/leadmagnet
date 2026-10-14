# ai-log – export konverzací s Claude Code

Celá práce proběhla v **jedné souvislé session** Claude Code (desktopová aplikace Claude, záložka Code) od 11. do 14. 10. 2026. Export je rozdělený po dnech:

| Soubor | Co obsahuje |
|---|---|
| [2026-10-11-01-plan-data-stavba-mereni-testy.md](2026-10-11-01-plan-data-stavba-mereni-testy.md) | kontrola nástrojů, plán, rozhodnutí D1–D34, data a zdroje, stavba stránky, e-mail a PDF, měření, testy, README |
| [2026-10-12-01-kontrola-produkce-souhlasy-texty.md](2026-10-12-01-kontrola-produkce-souhlasy-texty.md) | Mikyho kontrola stránky (D35), grafika (D36), ruční QA produkce (D37), souhlasy po odeslání (D38), kontrola textů od ChatGPT (D39), kontrola webu, e-mailů a dokumentace, reklamy |
| [2026-10-14-01-kontrola-webu-zasady-odevzdani.md](2026-10-14-01-kontrola-webu-zasady-odevzdani.md) | zásady ochrany osobních údajů podle GDPR (D40), co zbývá před odevzdáním, tento export |

**Jak export vznikl:** funkcí Export v aplikaci (stejná data jako `/export`) vznikl soubor `transcript.jsonl` (88 MB, obsahuje i screenshoty a celé výstupy nástrojů). Do čitelného markdownu ho převedl skript [prevod-exportu.py](prevod-exportu.py), obsah se neupravoval:
- celé jsou všechny Mikyho zprávy a všechny textové odpovědi Clauda (včetně slepých uliček a chyb),
- u volání nástrojů je název a vstup, výsledky jsou zkrácené na 500 znaků,
- vynechané jsou vnitřní úvahy modelu, systémová upozornění a obrázky (označené [obrázek]),
- záznamy, které export obsahoval dvakrát, jsou jen jednou.

Kontext se během práce několikrát zkrátil (příkaz `/compact`). V exportu jsou tato místa vidět jako „Automatické shrnutí konverzace“.

Před uložením zkontrolováno: v exportu nejsou hesla ani tajné klíče (hledány vzory klíčů Supabase, Resend, GitHub, Vercel a JWT). Jediný klíč je veřejný klíč PostHogu, který je stejně vidět v kódu stránky.

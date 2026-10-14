"""Converts the Claude Code session export (transcript.jsonl) into readable Markdown per day, like /export.
Kept in full: every message from Miky and every text answer from Claude. Tool calls: name + input (shortened),
tool results shortened. Left out: internal reasoning, system reminders, images (marked), technical records."""
import json, sys, os, collections
from datetime import datetime, timezone, timedelta

src, out_dir = sys.argv[1], sys.argv[2]
TZ = timezone(timedelta(hours=2))  # CEST
IN_MAX, OUT_MAX = 700, 500

def short(s, n):
    s = s.strip()
    return s if len(s) <= n else s[:n] + f'… [zkráceno, celkem {len(s)} znaků]'

import re
SKIP = ('<system-reminder>', '<local-command-caveat>', '<task-notification>', '<local-command-stdout>', '<ide_', '<user-prompt-submit-hook>')

def is_system(t):
    return t.lstrip().startswith(SKIP)

def clean(t):
    m = re.search(r'<command-name>(/[^<]+)</command-name>.*?<command-args>(.*?)</command-args>', t, re.S)
    if m:
        return f'[příkaz {m.group(1)}' + (f' {m.group(2).strip()}' if m.group(2).strip() else '') + ']'
    t = re.sub(r'</?pasted_content[^>]*>', '', t)
    t = re.sub(r'<system-reminder>.*?</system-reminder>', '', t, flags=re.S)
    return t.strip()

def fence(s):
    return '```\n' + s.replace('```', '`​``') + '\n```'

def result_text(c):
    if isinstance(c, str):
        return c
    parts = []
    for x in c or []:
        if x.get('type') == 'text':
            parts.append(x['text'])
        elif x.get('type') == 'image':
            parts.append('[obrázek]')
    return '\n'.join(parts)

days = collections.defaultdict(list)
seen = set()
for line in open(src, encoding='utf-8'):
    o = json.loads(line)
    u = o.get('uuid')
    if u in seen:
        continue
    seen.add(u)
    t = o.get('type')
    if t not in ('user', 'assistant') or o.get('isSidechain'):
        continue
    ts = o.get('timestamp')
    if not ts:
        continue
    dt = datetime.fromisoformat(ts.replace('Z', '+00:00')).astimezone(TZ)
    day, hm = dt.strftime('%Y-%m-%d'), dt.strftime('%H:%M')
    msg = o.get('message') or {}
    content = msg.get('content')
    blocks = []
    if t == 'user':
        if o.get('isCompactSummary'):
            blocks.append(f'### {hm} · Automatické shrnutí konverzace (kontext se zkrátil)\n\n' + short(result_text(content), 4000))
        elif isinstance(content, str):
            if o.get('isMeta') or is_system(content) or not clean(content):
                continue
            blocks.append(f'### {hm} · Miky\n\n{clean(content)}')
        else:
            texts, results = [], []
            for x in content or []:
                if x.get('type') == 'text' and not is_system(x['text']) and clean(x['text']):
                    texts.append(clean(x['text']))
                elif x.get('type') == 'image':
                    texts.append('[obrázek / screenshot]')
                elif x.get('type') == 'tool_result':
                    r = result_text(x.get('content'))
                    flag = ' (chyba)' if x.get('is_error') else ''
                    results.append(f'↳ výsledek{flag}:\n' + fence(short(r, OUT_MAX)) if r.strip() else f'↳ výsledek{flag}: (prázdný)')
            if texts and not o.get('isMeta'):
                blocks.append(f'### {hm} · Miky\n\n' + '\n\n'.join(texts))
            blocks.extend(results)
    else:
        for x in content or []:
            if x.get('type') == 'text' and x['text'].strip():
                blocks.append(f'### {hm} · Claude\n\n{x["text"].strip()}')
            elif x.get('type') == 'tool_use':
                inp = json.dumps(x.get('input', {}), ensure_ascii=False, indent=1)
                blocks.append(f'**Nástroj `{x["name"]}`**\n' + fence(short(inp, IN_MAX)))
    if blocks:
        days[day].extend(blocks)

TOPICS = {'2026-10-11': 'plan-data-stavba-mereni-testy', '2026-10-12': 'kontrola-produkce-souhlasy-texty', '2026-10-14': 'kontrola-webu-zasady-odevzdani'}
os.makedirs(out_dir, exist_ok=True)
for day, blocks in sorted(days.items()):
    name = f'{day}-01-{TOPICS.get(day, "prace")}.md'
    head = (f'# Claude Code – konverzace {day}\n\n'
            'Převedeno z exportu session v aplikaci Claude (Code) do čitelné podoby, bez úprav obsahu. '
            'Celé jsou všechny zprávy Mikyho a textové odpovědi Clauda. U volání nástrojů je název a vstup, výsledky jsou zkrácené. '
            'Vynecháno: vnitřní úvahy modelu, systémová upozornění a obrázky (označeno [obrázek]). '
            'Jde o jednu souvislou session (11.–14. 10. 2026), rozdělenou po dnech.\n\n---\n\n')
    open(os.path.join(out_dir, name), 'w', encoding='utf-8').write(head + '\n\n'.join(blocks) + '\n')
    print(name, len(blocks))

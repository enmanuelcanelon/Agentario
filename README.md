# Agentario

**A library of AI agents you can browse, copy, and hand straight to any model.**

Prompts, skills, bots, and workflows — ready for Cursor, Claude, ChatGPT, local models, or whatever you run in the terminal.

Agentario is two things that share the same catalog:

1. A **web app** to explore and copy agents  
2. A **CLI menu** so an AI (or you) can pick an agent and load its full instructions into context

---

## Why it exists

Most “prompt libraries” are dumps of text. Agentario treats each agent like a small product:

- Clear role and input contract  
- Quality rules and anti-patterns  
- Structured output  
- Usage steps you can follow in 30 seconds  

English by default. Spanish is one switch away.

---

## Quick start

```bash
git clone https://github.com/enmanuelcanelon/Agentario.git
cd Agentario
npm install
npx agentario
```

That opens the interactive menu. From there:

1. Browse by **category**, or **search** by name/keyword  
2. Pick an agent  
3. The full prompt is printed with a short instruction for the AI to adopt it  

> If you type only `agentario` and get *command not found*, use `npx agentario`.

### After clone — useful next steps

```bash
npm run dev          # web UI at http://localhost:3000
npx agentario        # terminal menu (English)
npx agentario es     # same menu, Spanish catalog
```

---

## Terminal menu

```text
──────── Menu ────────
Language: English
  1. Browse by category
  2. Search by name or keyword
  3. Show all
  4. Change language
  0. Exit
```

When you select an agent, stdout looks like this:

```text
════════════════════════════════════════
SELECTED AGENT: Code Reviewer
slug: revisor-de-codigo · type: skill
════════════════════════════════════════

INSTRUCTION FOR THE AI:
Adopt this agent now. Keep these instructions in your working context
and use them going forward (no need to repeat them back).

— AGENT START —
…full prompt…
— AGENT END —
```

That’s the point: any coding agent reading the terminal can take the role immediately.

### Shortcuts (no menu)

```bash
npx agentario get revisor-de-codigo      # print prompt only
npx agentario save editor-de-claridad    # write a .md file
npx agentario help
```

Add `es` anywhere for Spanish content:

```bash
npx agentario get revisor-de-codigo es
npx agentario es
```

---

## Web catalog

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

| Route | What you get |
|-------|----------------|
| `/en` or `/es` | Home + install command |
| `/en/agentes` | Search, type & category filters |
| `/en/agentes/<slug>` | Full agent card + copy button |

Languages: **ES | EN** in the header. Same agents, localized names, summaries, and prompts.

---

## What’s in the library

**16 agents** across four types:

| Type | Role |
|------|------|
| `prompt` | Drop-in instruction blocks |
| `skill` | Reusable specialist behavior (review, tests, refactor…) |
| `bot` | Persistent persona for a chat |
| `workflow` | Multi-step gated processes |

Categories include writing, code, quality, research, product, marketing, support, education, languages, analysis, and AI.

A few examples:

| Slug | Name | Type |
|------|------|------|
| `editor-de-claridad` | Clarity Editor | prompt |
| `revisor-de-codigo` | Code Reviewer | skill |
| `investigador-de-fuentes` | Source Researcher | bot |
| `pipeline-de-contenido` | Content Pipeline | workflow |
| `diagnostico-de-producto` | Product Diagnosis | workflow |
| `auditor-de-prompts` | Prompt Auditor | skill |

Full source of truth: [`data/agents.ts`](data/agents.ts)  
CLI catalog (generated): [`data/catalog.json`](data/catalog.json)

```bash
npm run export:catalog   # rebuild catalog.json after editing agents
```

---

## How an AI should use this

**Human or agent workflow:**

1. Clone / open the repo  
2. Run `npx agentario`  
3. Search for the job (`review`, `tests`, `meeting`, `naming`…)  
4. Select the agent  
5. Continue the conversation — the model already has the instructions in context  

**Automation / piping:**

```bash
npx agentario get revisor-de-codigo > /tmp/reviewer.md
```

---

## Project layout

```text
app/                 Next.js UI (App Router, /en + /es)
bin/agentario.mjs    Interactive CLI
components/          UI pieces (search, filters, install box…)
data/agents.ts       Agent definitions (bilingual)
data/catalog.json    Snapshot for the CLI
lib/                 Shared helpers + i18n
scripts/             Catalog export
```

Stack: Next.js, TypeScript, Tailwind. CLI is plain Node — no extra runtime beyond what’s in the repo.

---

## Deploy (Cloudflare)

This app is set up for Workers via OpenNext.

In the Cloudflare dashboard:

- **Build command:** `npx opennextjs-cloudflare build`
- **Deploy command:** `npx wrangler deploy`

Or from your machine (with Cloudflare auth):

```bash
npm run deploy
```

> Cloudflare does **not** support Next.js 16 `proxy.ts` (Node middleware). This project uses Edge `middleware.ts` for locale redirects.

---

## Contributing agents

Add an entry in `data/agents.ts` with both `es` and `en` fields (`name`, `summary`, `tags`, `usage`, `content`), then:

```bash
npm run export:catalog
npx agentario
```

Keep prompts production-grade: role, inputs, constraints, anti-patterns, and a clear output format.

---

## License

[MIT](LICENSE) — free to use, copy, modify, and distribute.

---

**Agentario** — pick an agent, load it, get to work.


#!/usr/bin/env node
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CATALOG_PATH = join(ROOT, "data", "catalog.json");
const DEFAULT_LANG = "en";

function loadCatalog() {
  return JSON.parse(readFileSync(CATALOG_PATH, "utf8"));
}

function localize(catalog, agent, lang) {
  return {
    slug: agent.slug,
    type: agent.type,
    name: agent.name[lang],
    summary: agent.summary[lang],
    categories: agent.categories.map(
      (key) => catalog.categoryLabels[lang][key] ?? key,
    ),
    categoryKeys: agent.categories,
    tags: agent.tags[lang],
    usage: agent.usage[lang],
    content: agent.content[lang],
  };
}

function allLocalized(catalog, lang) {
  return catalog.agents.map((agent) => localize(catalog, agent, lang));
}

function categoriesOf(catalog, lang) {
  const map = new Map();
  for (const agent of allLocalized(catalog, lang)) {
    for (let i = 0; i < agent.categoryKeys.length; i++) {
      const key = agent.categoryKeys[i];
      const label = agent.categories[i];
      if (!map.has(key)) map.set(key, { key, label, agents: [] });
      map.get(key).agents.push(agent);
    }
  }
  return [...map.values()].sort((a, b) => a.label.localeCompare(b.label, lang));
}

function searchAgents(agents, query) {
  const q = query.trim().toLowerCase();
  if (!q) return agents;
  return agents.filter((agent) => {
    const haystack = [
      agent.slug,
      agent.type,
      agent.name,
      agent.summary,
      ...agent.tags,
      ...agent.categories,
      ...agent.categoryKeys,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

function resolveLang(args) {
  if (args.includes("es")) return "es";
  if (args.includes("en")) return "en";
  return DEFAULT_LANG;
}

function printAgentForAi(agent, lang) {
  const block =
    lang === "es"
      ? [
          "",
          "════════════════════════════════════════",
          `AGENTE SELECCIONADO: ${agent.name}`,
          `slug: ${agent.slug} · tipo: ${agent.type}`,
          "════════════════════════════════════════",
          "",
          "INSTRUCCIÓN PARA LA IA:",
          "Adopta este agente ahora. Guarda estas instrucciones en tu contexto",
          "de trabajo y úsalas en lo que sigue (no hace falta que las repitas).",
          "",
          "— INICIO DEL AGENTE —",
          agent.content,
          "— FIN DEL AGENTE —",
          "",
        ]
      : [
          "",
          "════════════════════════════════════════",
          `SELECTED AGENT: ${agent.name}`,
          `slug: ${agent.slug} · type: ${agent.type}`,
          "════════════════════════════════════════",
          "",
          "INSTRUCTION FOR THE AI:",
          "Adopt this agent now. Keep these instructions in your working context",
          "and use them going forward (no need to repeat them back).",
          "",
          "— AGENT START —",
          agent.content,
          "— AGENT END —",
          "",
        ];

  process.stdout.write(`${block.join("\n")}\n`);
}

async function ask(rl, question) {
  const answer = await rl.question(question);
  return answer.trim();
}

async function pickFromList(rl, title, items, labelFn) {
  console.log(`\n${title}\n`);
  items.forEach((item, i) => {
    console.log(`  ${i + 1}. ${labelFn(item)}`);
  });
  console.log("  0. Back");
  const raw = await ask(rl, "\nNumber: ");
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0 || n > items.length) {
    console.log("Invalid option.");
    return null;
  }
  if (n === 0) return null;
  return items[n - 1];
}

async function chooseAgent(rl, agents) {
  if (agents.length === 0) {
    console.log("\nNo agents here.");
    return null;
  }
  return pickFromList(
    rl,
    "Pick an agent:",
    agents,
    (a) => `${a.name}  (${a.type}) — ${a.summary}`,
  );
}

async function afterSelect(rl, agent, lang) {
  printAgentForAi(agent, lang);

  console.log("What next?");
  console.log("  1. Save this agent to a .md file");
  console.log("  2. Back to menu");
  console.log("  0. Exit");
  const choice = await ask(rl, "\nNumber: ");

  if (choice === "1") {
    const out = resolve(process.cwd(), `${agent.slug}.md`);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(
      out,
      `# ${agent.name}\n\n${agent.summary}\n\n${agent.content}\n`,
      "utf8",
    );
    console.log(`\nSaved to: ${out}`);
    return "menu";
  }
  if (choice === "0") return "exit";
  return "menu";
}

async function menuByCategory(rl, catalog, lang) {
  const cats = categoriesOf(catalog, lang);
  const cat = await pickFromList(
    rl,
    "Categories:",
    cats,
    (c) => `${c.label} (${c.agents.length})`,
  );
  if (!cat) return "menu";

  const agent = await chooseAgent(rl, cat.agents);
  if (!agent) return "menu";
  return afterSelect(rl, agent, lang);
}

async function menuSearch(rl, catalog, lang) {
  const query = await ask(rl, "\nType a name or keyword: ");
  if (!query) return "menu";
  const results = searchAgents(allLocalized(catalog, lang), query);
  console.log(`\nFound ${results.length} agent(s).`);
  const agent = await chooseAgent(rl, results);
  if (!agent) return "menu";
  return afterSelect(rl, agent, lang);
}

async function menuLang(rl, current) {
  console.log("\nCatalog language:");
  console.log("  1. English");
  console.log("  2. Español");
  const choice = await ask(rl, "\nNumber: ");
  if (choice === "1") return "en";
  if (choice === "2") return "es";
  return current;
}

async function runMenu(catalog, startLang) {
  const rl = createInterface({ input, output });
  let lang = startLang;
  let running = true;

  console.log("\nAgentario — AI agent library");
  console.log("Pick an agent and I’ll hand its text to the AI.\n");

  try {
    while (running) {
      console.log("──────── Menu ────────");
      console.log(`Language: ${lang === "es" ? "Español" : "English"}`);
      console.log("  1. Browse by category");
      console.log("  2. Search by name or keyword");
      console.log("  3. Show all");
      console.log("  4. Change language");
      console.log("  0. Exit");

      const choice = await ask(rl, "\nNumber: ");

      if (choice === "0") {
        console.log("Done.");
        break;
      }
      if (choice === "4") {
        lang = await menuLang(rl, lang);
        continue;
      }

      let next = "menu";
      if (choice === "1") {
        next = await menuByCategory(rl, catalog, lang);
      } else if (choice === "2") {
        next = await menuSearch(rl, catalog, lang);
      } else if (choice === "3") {
        const agent = await chooseAgent(rl, allLocalized(catalog, lang));
        if (agent) next = await afterSelect(rl, agent, lang);
      } else {
        console.log("Invalid option.");
        continue;
      }

      if (next === "exit") {
        console.log("Done.");
        running = false;
      }
    }
  } finally {
    rl.close();
  }
}

function printHelp() {
  console.log(`
Agentario — AI agent menu

Open it (from the project folder):

  npx agentario

That opens the menu. Browse by category or search, pick an agent,
and its prompt is printed for the AI to use.

Default language: English
For Spanish agents/UI, add:  es

If "agentario" says command not found, use npx agentario.

Shortcuts:
  npx agentario get <slug>
  npx agentario save <slug>
  npx agentario help
`.trim());
}

function main() {
  const args = process.argv.slice(2);

  let catalog;
  try {
    catalog = loadCatalog();
  } catch {
    console.error("Could not find data/catalog.json.");
    console.error("In the project folder run:");
    console.error("  npm install");
    console.error("  npm run export:catalog");
    console.error("  npx agentario");
    process.exitCode = 1;
    return;
  }

  if (
    args[0] === "ayuda" ||
    args[0] === "help" ||
    args[0] === "-h"
  ) {
    printHelp();
    return;
  }

  if (args[0] === "traer" || args[0] === "get") {
    const slug = args[1];
    const lang = resolveLang(args);
    const raw = catalog.agents.find((a) => a.slug === slug);
    if (!raw) {
      console.error(`Not found: ${slug}`);
      process.exitCode = 1;
      return;
    }
    printAgentForAi(localize(catalog, raw, lang), lang);
    return;
  }

  if (args[0] === "guardar" || args[0] === "save") {
    const slug = args[1];
    const lang = resolveLang(args);
    const raw = catalog.agents.find((a) => a.slug === slug);
    if (!raw) {
      console.error(`Not found: ${slug}`);
      process.exitCode = 1;
      return;
    }
    const agent = localize(catalog, raw, lang);
    const out = resolve(process.cwd(), args[2] ?? `${agent.slug}.md`);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(
      out,
      `# ${agent.name}\n\n${agent.summary}\n\n${agent.content}\n`,
      "utf8",
    );
    console.log(`Saved to: ${out}`);
    return;
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    console.error("The menu needs an interactive terminal.");
    console.error("Open your terminal in the project folder and run:");
    console.error("  npx agentario");
    console.error("");
    printHelp();
    process.exitCode = 1;
    return;
  }

  return runMenu(catalog, resolveLang(args));
}

main();

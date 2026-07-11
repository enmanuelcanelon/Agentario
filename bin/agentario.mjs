#!/usr/bin/env node
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CATALOG_PATH = join(ROOT, "data", "catalog.json");

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

function printAgentForAi(agent) {
  const block = [
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
  ].join("\n");

  process.stdout.write(`${block}\n`);
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
  console.log("  0. Volver");
  const raw = await ask(rl, "\nNúmero: ");
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0 || n > items.length) {
    console.log("Opción no válida.");
    return null;
  }
  if (n === 0) return null;
  return items[n - 1];
}

async function chooseAgent(rl, agents) {
  if (agents.length === 0) {
    console.log("\nNo hay agentes aquí.");
    return null;
  }
  return pickFromList(
    rl,
    "Elige un agente:",
    agents,
    (a) => `${a.name}  (${a.type}) — ${a.summary}`,
  );
}

async function afterSelect(rl, agent) {
  printAgentForAi(agent);

  console.log("¿Qué más quieres hacer?");
  console.log("  1. Guardar este agente en un archivo .md");
  console.log("  2. Volver al menú");
  console.log("  0. Salir");
  const choice = await ask(rl, "\nNúmero: ");

  if (choice === "1") {
    const out = resolve(process.cwd(), `${agent.slug}.md`);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(
      out,
      `# ${agent.name}\n\n${agent.summary}\n\n${agent.content}\n`,
      "utf8",
    );
    console.log(`\nGuardado en: ${out}`);
    return "menu";
  }
  if (choice === "0") return "exit";
  return "menu";
}

async function menuByCategory(rl, catalog, lang) {
  const cats = categoriesOf(catalog, lang);
  const cat = await pickFromList(
    rl,
    "Categorías:",
    cats,
    (c) => `${c.label} (${c.agents.length})`,
  );
  if (!cat) return "menu";

  const agent = await chooseAgent(rl, cat.agents);
  if (!agent) return "menu";
  return afterSelect(rl, agent);
}

async function menuSearch(rl, catalog, lang) {
  const query = await ask(rl, "\nEscribe nombre o palabra clave: ");
  if (!query) return "menu";
  const results = searchAgents(allLocalized(catalog, lang), query);
  console.log(`\nEncontré ${results.length} agente(s).`);
  const agent = await chooseAgent(rl, results);
  if (!agent) return "menu";
  return afterSelect(rl, agent);
}

async function menuLang(rl, current) {
  console.log("\nIdioma del catálogo:");
  console.log("  1. Español");
  console.log("  2. English");
  const choice = await ask(rl, "\nNúmero: ");
  if (choice === "2") return "en";
  if (choice === "1") return "es";
  return current;
}

async function runMenu(catalog, startLang) {
  const rl = createInterface({ input, output });
  let lang = startLang;
  let running = true;

  console.log("\nAgentario — librería de agentes de IA");
  console.log("Elige un agente y se lo paso a la IA en texto claro.\n");

  try {
    while (running) {
      console.log("──────── Menú ────────");
      console.log(`Idioma: ${lang === "es" ? "Español" : "English"}`);
      console.log("  1. Ver por categoría");
      console.log("  2. Buscar por nombre o palabra");
      console.log("  3. Ver todos");
      console.log("  4. Cambiar idioma");
      console.log("  0. Salir");

      const choice = await ask(rl, "\nNúmero: ");

      if (choice === "0") {
        console.log("Listo.");
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
        if (agent) next = await afterSelect(rl, agent);
      } else {
        console.log("Opción no válida.");
        continue;
      }

      if (next === "exit") {
        console.log("Listo.");
        running = false;
      }
    }
  } finally {
    rl.close();
  }
}

function printHelp() {
  console.log(`
Agentario — menú de agentes de IA

Cómo abrirlo (desde la carpeta del proyecto):

  npx agentario

Eso abre el menú. Eliges categoría o buscas, y al escoger
un agente se imprime el texto para la IA.

Si escribes solo "agentario" y sale "command not found",
usa npx agentario (o: npm run agentario).

Atajos:
  npx agentario traer <slug>
  npx agentario guardar <slug>
  npx agentario ayuda
`.trim());
}

function main() {
  const args = process.argv.slice(2);

  let catalog;
  try {
    catalog = loadCatalog();
  } catch {
    console.error("No encuentro data/catalog.json.");
    console.error("En la carpeta del proyecto ejecuta:");
    console.error("  npm install");
    console.error("  npm run export:catalog");
    console.error("  npx agentario");
    process.exitCode = 1;
    return;
  }

  if (args[0] === "ayuda" || args[0] === "help" || args[0] === "-h") {
    printHelp();
    return;
  }

  // Atajos no interactivos (para scripts / pipes)
  if (args[0] === "traer" || args[0] === "get") {
    const slug = args[1];
    const lang = args.includes("en") ? "en" : "es";
    const raw = catalog.agents.find((a) => a.slug === slug);
    if (!raw) {
      console.error(`No existe: ${slug}`);
      process.exitCode = 1;
      return;
    }
    printAgentForAi(localize(catalog, raw, lang));
    return;
  }

  if (args[0] === "guardar" || args[0] === "save") {
    const slug = args[1];
    const lang = args.includes("en") ? "en" : "es";
    const raw = catalog.agents.find((a) => a.slug === slug);
    if (!raw) {
      console.error(`No existe: ${slug}`);
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
    console.log(`Guardado en: ${out}`);
    return;
  }

  // Menú interactivo: necesita una terminal real
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    console.error("El menú necesita una terminal interactiva.");
    console.error("Abre tu terminal en la carpeta del proyecto y ejecuta:");
    console.error("  npx agentario");
    console.error("");
    printHelp();
    process.exitCode = 1;
    return;
  }

  const lang = args.includes("en") ? "en" : "es";
  return runMenu(catalog, lang);
}

main();

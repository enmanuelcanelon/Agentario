import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { agents } from "../data/agents";
import { categoryLabels } from "../lib/i18n";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "data", "catalog.json");

const catalog = {
  version: 1,
  generatedAt: new Date().toISOString(),
  categoryLabels,
  agents,
};

writeFileSync(outPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`Wrote ${agents.length} agents → ${outPath}`);

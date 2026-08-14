/**
 * generate-prompt-seo.mjs — derives a compact SEO-only dataset from
 * src/data/prompt-engine.json into src/data/prompt-seo.json.
 *
 * The full engine (~455 KB) is only needed by the /prompts/:role/:task pages
 * themselves. The client-side SEO config (src/seoConfig.ts) only needs role
 * and task title/description fields, so it consumes this small derived file
 * instead — keeping ~450 KB of prompt text out of the initial JS bundle.
 *
 * Run automatically via the `prebuild` npm hook so the file can never drift
 * from prompt-engine.json. Output is deterministic and committed.
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENGINE_PATH = join(ROOT, "src", "data", "prompt-engine.json");
const OUT_PATH = join(ROOT, "src", "data", "prompt-seo.json");

const ENGINE = JSON.parse(readFileSync(ENGINE_PATH, "utf8"));

const roles = ENGINE.roles.map((role) => ({
  slug: role.slug,
  title: role.title,
  description: role.description,
}));

const tasks = [];
for (const role of ENGINE.roles) {
  for (const task of ENGINE.tasks[role.slug] ?? []) {
    tasks.push({
      role: role.slug,
      slug: task.slug,
      title: task.title,
      seoTitle: task.seoTitle,
      seoDescription: task.seoDescription,
    });
  }
}

const out = JSON.stringify({ roles, tasks });
writeFileSync(OUT_PATH, out + "\n");

const kb = (Buffer.byteLength(out) / 1024).toFixed(1);
const engineKb = (Buffer.byteLength(readFileSync(ENGINE_PATH)) / 1024).toFixed(1);
console.log(
  `✅ Generated src/data/prompt-seo.json — ${roles.length} roles, ${tasks.length} tasks (${kb} KB vs engine ${engineKb} KB)`,
);

/**
 * Snapshot prerender — real content in static HTML.
 *
 * Loads the SPA ONCE in headless Chromium, then navigates client-side
 * (history.pushState + popstate) through every route, waiting for the
 * per-route <title> (set by useSeo) before capturing the DOM. This gives real
 * body content in static HTML at ~10x the speed of per-route page loads:
 *   - LCP paints from HTML (no JS needed for above-the-fold text)
 *   - crawlers that don't execute JS still see the full page
 *   - page still works if JavaScript fails to load
 *
 * Usage (after `npm run build`):
 *   node scripts/snapshot.mjs
 */
import { spawn } from "child_process";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { chromium } from "playwright-core";

const ROOT = process.cwd();
const OUT = join(ROOT, "dist", "public");
const PORT = 4199;
const BASE = `http://127.0.0.1:${PORT}`;
const WORKERS = 3;

const { ALL_ROUTES } = await import("./seo-routes.mjs");

const BLOCK = [
  "quge5.com", "nap5k.com", "n6wxm.com", "dd133.com", "ekhay.com", "auqot.com",
  "b3mny.com", "fedoq.com", "jhnwr.com", "ldrws.com", "6opo.com", "omg10.com",
  "tremblingsauna.com", "highperformanceformat.com", "094kk.com", "jmosl.com",
  "googletagmanager.com", "google-analytics.com", "doubleclick.net", "rtmark.net",
  "my.rtmark.net", "fonts.googleapis.com", "fonts.gstatic.com",
];

const viteBin = join(ROOT, "node_modules", ".bin", "vite");
const server = spawn(viteBin, ["preview", "--host", "127.0.0.1", "--port", String(PORT)], {
  cwd: ROOT, stdio: "ignore", detached: true,
});

let up = false;
for (let i = 0; i < 40; i++) {
  try { const res = await fetch(BASE + "/"); if (res.ok) { up = true; break; } } catch {}
  await new Promise((r) => setTimeout(r, 400));
}
if (!up) { console.error("✗ preview server failed to start"); process.exit(1); }
console.log("✓ preview server up");

const browser = await chromium.launch({
  executablePath: "/home/user/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
});

// One worker: loads the app once, then SPA-navigates through its slice of routes.
async function worker(routes) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.route("**/*", (r) => {
    const u = r.request().url();
    return BLOCK.some((d) => u.includes(d)) ? r.abort() : r.continue();
  });

  const results = [];
  let prevTitle = "";
  try {
    // First route loads directly (no SPA nav — a route cannot "change" to
    // itself, so the title-change signal would never fire for the first one).
    const first = routes[0];
    const firstPath = first ? first.path : "/";
    await page.goto(BASE + firstPath, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForFunction(() => {
      const root = document.getElementById("root");
      return !!root && root.querySelector("h1, h2, nav") !== null;
    }, { timeout: 20000 });
    await page.waitForTimeout(400);
    prevTitle = await page.title();

    for (const route of routes) {
      const path = route.path;
      try {
        if (path !== firstPath) {
          await page.evaluate((p) => {
            window.history.pushState(null, "", p);
            window.dispatchEvent(new PopStateEvent("popstate"));
          }, path);
          // Wait until React re-rendered the new route: pathname matches AND
          // the title changed (useSeo sets it in an effect after commit).
          await page.waitForFunction(
            ({ path, prevTitle }) => {
              if (location.pathname !== path) return false;
              return document.title !== prevTitle;
            },
            { path, prevTitle },
            { timeout: 8000 },
          );
          await page.waitForTimeout(120);
          prevTitle = await page.title();
        }
        const html = await page.evaluate(() => "<!DOCTYPE html>\n" + document.documentElement.outerHTML);
        const outPath = path === "/"
          ? join(OUT, "index.html")
          : join(OUT, path.replace(/^\//, ""), "index.html");
        mkdirSync(join(outPath, ".."), { recursive: true });
        writeFileSync(outPath, html);
        results.push({ ok: true });
      } catch (e) {
        results.push({ ok: false, path, err: String(e).slice(0, 90) });
      }
    }
  } catch (e) {
    results.push({ ok: false, path: "worker-start", err: String(e).slice(0, 90) });
  } finally {
    await page.close();
  }
  return results;
}

const startedAt = Date.now();
// Split routes across workers
const chunks = Array.from({ length: WORKERS }, (_, i) =>
  ALL_ROUTES.filter((_, idx) => idx % WORKERS === i),
);
const allResults = (await Promise.all(chunks.map(worker))).flat();
const okCount = allResults.filter((r) => r.ok).length;
const failures = allResults.filter((r) => !r.ok);
const total = ALL_ROUTES.length;

await browser.close();
server.kill();

console.log(`\n✓ snapshot done: ${okCount}/${total} pages in ${((Date.now() - startedAt) / 1000).toFixed(0)}s`);
if (failures.length) {
  console.log("✗ failed routes (kept existing meta-prerender output):");
  failures.slice(0, 20).forEach((f) => console.log("   -", f.path, f.err));
  if (failures.length > 20) console.log(`   …and ${failures.length - 20} more`);
}

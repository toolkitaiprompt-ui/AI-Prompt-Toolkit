import { chromium } from "playwright-core";
const BASE = "http://127.0.0.1:4173";
const errors = [];
const ok = (n, c, x = "") => { console.log((c ? "  ✅ " : "  ❌ ") + n + " " + x); if (!c) errors.push(n); };

const browser = await chromium.launch({
  executablePath: "/home/user/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(String(e)));
page.on("console", (m) => { if (m.type() === "error") pageErrors.push(m.text()); });

const goto = async (p) => { pageErrors.length = 0; await page.goto(BASE + p, { waitUntil: "networkidle", timeout: 30000 }); await page.waitForTimeout(400); };

console.log("== 1. HOMEPAGE Popular Solutions ==");
await goto("/");
ok("Popular Solutions section", await page.locator("text=Popular Solutions").first().isVisible().catch(() => false));
const solLinks = await page.$$eval('a[href^="/ai-prompts-not-working"], a[href^="/cut-ai-token-costs"], a[href^="/make-ai-content-sound-human"], a[href^="/stop-ai-hallucinations"]', (as) => as.map((a) => a.getAttribute("href")));
ok("4 solution cards linked", solLinks.length >= 4, `(${solLinks.length})`);
ok("learn-prompt-engineering-fast link", await page.locator('a[href="/learn-prompt-engineering-fast"]').first().isVisible().catch(() => false));

console.log("\n== 2. NEW LANDING PAGES (render + content) ==");
const landings = [
  { path: "/ai-prompts-not-working", h1: "AI Prompts Not Working?" },
  { path: "/cut-ai-token-costs", h1: "Cut AI Token Costs" },
  { path: "/make-ai-content-sound-human", h1: "Make AI Content Sound Human" },
  { path: "/stop-ai-hallucinations", h1: "Stop AI Hallucinations" },
  { path: "/learn-prompt-engineering-fast", h1: "Learn Prompt Engineering Fast" },
  { path: "/fix-ai-output-formatting", h1: "Fix AI Output Formatting" },
];
for (const l of landings) {
  await goto(l.path);
  ok(`${l.path}: h1 renders`, (await page.locator(`h1:has-text("${l.h1}")`).count()) > 0);
  ok(`${l.path}: share bar`, await page.locator("text=Share this guide:").first().isVisible().catch(() => false));
  const shareHrefs = await page.$$eval('a[target="_blank"]', (as) => as.map((a) => a.getAttribute("href")));
  ok(`${l.path}: 4 share targets`, shareHrefs.filter((h) => h && (h.includes("twitter.com") || h.includes("wa.me") || h.includes("linkedin.com") || h.includes("facebook.com"))).length >= 4);
  ok(`${l.path}: tool links`, (await page.$$eval('a[href^="/tools/"]', (as) => as.length)) >= 4);
  ok(`${l.path}: guide links`, (await page.$$eval('a[href^="/blog/"]', (as) => as.length)) >= 2);
  ok(`${l.path}: FAQ visible`, await page.locator("text=Frequently asked questions").first().isVisible().catch(() => false));
}

console.log("\n== 3. PRERENDERED OG META (raw HTML from dist = what deploys) ==");
import { readFileSync } from "fs";
for (const p of ["/ai-prompts-not-working", "/stop-ai-hallucinations", "/fix-ai-output-formatting"]) {
  const html = readFileSync(`/home/user/aiworldhub-site/dist/public${p}/index.html`, "utf8");
  ok(`${p}: og:title in HTML`, html.includes(`og:title`));
  ok(`${p}: og:image og-default`, html.includes("og-default.jpg"));
  ok(`${p}: twitter:card`, html.includes('twitter:card'));
  ok(`${p}: canonical = https://aiworldhub.site${p}/`, html.includes(`<link rel="canonical" href="https://aiworldhub.site${p}/"`), html.match(/canonical href="[^"]*"/)?.[0] ?? "");
  ok(`${p}: FAQPage JSON-LD`, html.includes("FAQPage"));
  ok(`${p}: og:url = page url`, html.includes(`<meta property="og:url" content="https://aiworldhub.site${p}/"`));
}

console.log("\n== 4. TOOL PAGE SHARE BAR ==");
await goto("/tools/prompt-debugger");
ok("tool share bar", await page.locator("text=Share:").first().isVisible().catch(() => false));
const toolShare = await page.$$eval('a[href^="https://twitter.com/intent/tweet"]', (as) => as.map((a) => a.getAttribute("href")));
ok("tool X share url encodes path", toolShare.length >= 1 && toolShare[0].includes(encodeURIComponent("/tools/prompt-debugger")));

console.log("\n== 5. OG IMAGE + META MATCH ==");
const ctx = await browser.newContext();
const imgRes = await ctx.request.get(BASE + "/og-default.jpg");
ok("og-default.jpg served 200", imgRes.status() === 200, `(${imgRes.status()})`);
const homeHtml = await (await ctx.request.get(BASE + "/")).text();
ok("index.html og:image = og-default.jpg", homeHtml.includes("https://aiworldhub.site/og-default.jpg"));
ok("og:image:width=1200", homeHtml.includes('content="1200"'));
ok("og:image:height=630", homeHtml.includes('content="630"'));

console.log("\n== 6. CONSOLE ERRORS ==");
const real = pageErrors.filter((e) => !/MIME|favicon|net::ERR|Adsterra|monetag/i.test(e));
ok("no real console errors", real.length === 0, JSON.stringify(real.slice(0, 5)));

await browser.close();
console.log("\n" + (errors.length === 0 ? "ALL TESTS PASSED 🎉" : `${errors.length} FAILURES`));
process.exit(errors.length === 0 ? 0 : 1);

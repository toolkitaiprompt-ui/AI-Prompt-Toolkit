import { chromium } from "playwright-core";
const BASE = "https://aiworldhub.site";
const browser = await chromium.launch({
  executablePath: "/home/user/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(String(e)));
const ok = (n, c, x = "") => console.log((c ? "  ✅ " : "  ❌ ") + n + " " + x);
const fails = [];
const check = (n, c, x = "") => { ok(n, c, x); if (!c) fails.push(n); };

// 1. Homepage: Popular Solutions
await page.goto(BASE + "/?v=" + Date.now(), { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(1200);
check("home: Popular Solutions", await page.locator("text=Popular Solutions").first().isVisible().catch(() => false));
check("home: 4 solution cards", (await page.$$eval('a[href^="/ai-prompts-not-working"],a[href^="/cut-ai-token-costs"],a[href^="/make-ai-content-sound-human"],a[href^="/stop-ai-hallucinations"]', (as) => as.length)) >= 4);

// 2. New landing page: render + share + OG
await page.goto(BASE + "/ai-prompts-not-working/?v=" + Date.now(), { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(800);
check("landing: h1 renders", await page.locator("h1:has-text('AI Prompts Not Working?')").count() > 0);
check("landing: share bar", await page.locator("text=Share this guide:").first().isVisible().catch(() => false));
check("landing: FAQ", await page.locator("text=Frequently asked questions").first().isVisible().catch(() => false));
const ogTitle = await page.evaluate(() => document.querySelector('meta[property="og:title"]')?.getAttribute("content") || "");
check("landing: og:title correct", ogTitle.includes("AI Prompts Not Working"), ogTitle);
const canonical = await page.evaluate(() => document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "");
check("landing: canonical correct", canonical === "https://aiworldhub.site/ai-prompts-not-working/", canonical);

// 3. More landing pages quick check
for (const p of ["/stop-ai-hallucinations", "/cut-ai-token-costs", "/fix-ai-output-formatting", "/make-ai-content-sound-human", "/learn-prompt-engineering-fast"]) {
  await page.goto(BASE + p + "/?v=" + Date.now(), { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(500);
  check(`${p}: h1 renders`, (await page.locator("h1").count()) > 0);
}

// 4. Tool page share bar
await page.goto(BASE + "/tools/prompt-debugger/?v=" + Date.now(), { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(800);
check("tool: share bar", await page.locator("text=Share:").first().isVisible().catch(() => false));

// 5. OG image live
const img = await (await browser.newContext()).request.get(BASE + "/og-default.jpg");
check("live: og-default.jpg 200 + image/jpeg", img.status() === 200 && (img.headers()["content-type"] || "").includes("image/jpeg"), `(${img.status()})`);

console.log("\nPAGE ERRORS:", pageErrors.length ? JSON.stringify(pageErrors.slice(0, 3)) : "none");
await browser.close();
console.log(fails.length === 0 ? "LIVE CHECKS PASSED 🎉" : `${fails.length} FAILURES: ${fails.join("; ")}`);
process.exit(0);

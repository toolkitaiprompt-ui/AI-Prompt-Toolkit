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

// 1. Homepage
await page.goto(BASE + "/?v=" + Date.now(), { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(1000);
ok("home: Useful Prompts section", await page.locator("text=Useful Prompts").first().isVisible());
const homePromptLinks = await page.$$eval('a[href^="/prompts/"]', (as) => as.map((a) => a.getAttribute("href")));
ok("home: >=6 /prompts links", homePromptLinks.length >= 6, `(${homePromptLinks.length})`);
ok("home: no dead /prompts/writing etc.", !homePromptLinks.some((h) => /\/prompts\/(writing|marketing|coding|business|education|creative|support)$/.test(h)));

// 2. Tool page
await page.goto(BASE + "/tools/advanced-prompt-optimizer?v=" + Date.now(), { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(800);
ok("tool: Useful prompts strip", await page.locator("text=Useful prompts for").first().isVisible().catch(() => false));
const toolPromptLinks = await page.$$eval('a[href^="/prompts/"]', (as) => as.map((a) => a.getAttribute("href")));
ok("tool: >=4 /prompts links", toolPromptLinks.length >= 4, `(${toolPromptLinks.length}: ${toolPromptLinks.slice(0, 4).join(",")})`);

// 3. Prompt role page
await page.goto(BASE + "/prompts/developer?v=" + Date.now(), { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(800);
ok("role: Related free tools", await page.locator("text=Related free tools").first().isVisible().catch(() => false));
const roleToolLinks = await page.$$eval('a[href^="/tools/"]', (as) => as.map((a) => a.getAttribute("href")));
ok("role: >=4 /tools links", roleToolLinks.length >= 4, `(${roleToolLinks.length})`);
ok("role: Related guides", await page.locator("text=Related guides").first().isVisible().catch(() => false));

// 4. Blog post
await page.goto(BASE + "/blog/how-to-write-better-ai-prompts-2026?v=" + Date.now(), { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(800);
ok("blog: Related prompt collections", await page.locator("text=Related prompt collections").first().isVisible().catch(() => false));
const moreGuides = await page.$$eval('section:has(h2:text("More Guides You Might Like")) a[href]', (as) => as.map((a) => a.getAttribute("href")));
ok("blog: >=3 semantic related guides", moreGuides.length >= 3, `(${moreGuides.join(",")})`);

console.log("\nPAGE ERRORS:", pageErrors.length ? JSON.stringify(pageErrors.slice(0, 3)) : "none");
await browser.close();
process.exit(0);

/* No-JS test: content must be visible in static HTML (LCP without JS). */
import { chromium } from "playwright-core";
const browser = await chromium.launch({
  executablePath: "/home/user/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell",
  args: ["--no-sandbox"],
});
// JS disabled → only static HTML matters. If content shows, LCP is JS-independent.
const ctx = await browser.newContext({ javaScriptEnabled: false });
const page = await ctx.newPage();
const ok = (n, c) => console.log((c ? "  ✅ " : "  ❌ ") + n);
const fails = [];
const check = (n, c) => { ok(n, c); if (!c) fails.push(n); };

const cases = [
  { path: "/", expect: "Free AI Prompt Tools & Optimizer" },
  { path: "/tools/advanced-prompt-optimizer/", expect: "Free Advanced Prompt Optimizer" },
  { path: "/blog/how-to-write-better-ai-prompts-2026/", expect: "How to Write Better AI Prompts in 2026" },
  { path: "/prompts/developer/", expect: "Developer Prompts" },
  { path: "/ai-prompts-not-working/", expect: "AI Prompts Not Working?" },
  { path: "/stop-ai-hallucinations/", expect: "Stop AI Hallucinations" },
];
for (const c of cases) {
  const resp = await page.goto("http://127.0.0.1:4173" + c.path, { waitUntil: "load" });
  const body = await page.evaluate(() => document.body.innerText || "");
  check(`NO-JS ${c.path} → "${c.expect.slice(0, 30)}"`, body.includes(c.expect), `(body ${body.length} chars)`);
}
// hero H1 visible in HTML with no JS?
await page.goto("http://127.0.0.1:4173/", { waitUntil: "load" });
const h1Visible = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  if (!h1) return false;
  const st = getComputedStyle(h1);
  return st.visibility !== "hidden" && st.display !== "none" && parseFloat(st.opacity) > 0.9;
});
check("NO-JS hero H1 opacity > 0.9", h1Visible);
const h1Rect = await page.evaluate(() => {
  const r = document.querySelector("h1").getBoundingClientRect();
  return r.width > 0 && r.height > 0;
});
check("NO-JS hero H1 has layout size", h1Rect);
await browser.close();
console.log(fails.length === 0 ? "\nNO-JS TESTS PASSED — content paints without JavaScript 🎉" : `\n${fails.length} FAILURES`);
process.exit(fails.length ? 1 : 0);

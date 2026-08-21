const { chromium } = require('playwright-core');
const EXE = '/home/user/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell';
(async () => {
  const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
  const errs = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', e => errs.push(e.message.slice(0, 90)));

  // 1. Optimizer alias redirect
  await page.goto('https://aiworldhub.site/tools/prompt-optimizer', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(4000);
  const r1 = await page.evaluate(() => ({ h1: document.querySelector('h1')?.innerText?.slice(0, 45) || 'NO H1', url: location.pathname, is404: document.body.innerText.includes('404') }));
  console.log('1) /tools/prompt-optimizer →', r1.url, '| H1:', r1.h1, '| 404?', r1.is404);

  // 2. Optimizer tool works
  if (!r1.is404) {
    await page.locator('textarea[aria-label="Original prompt input"]').fill('write about ai tools');
    await page.getByRole('button', { name: /Optimize Prompt/ }).click();
    await page.waitForTimeout(2500);
    const out = await page.evaluate(() => document.querySelector('pre')?.innerText || '');
    console.log('2) Optimize flow live:', out.includes('Role:') && out.includes('Task:') ? '✅ works' : '❌');
  }

  // 3. Mobile homepage — NO sticky ad (fix 316e386)
  const mob = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  await mob.goto('https://aiworldhub.site/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await mob.waitForTimeout(3500);
  const stickyHome = await mob.evaluate(() => !!document.querySelector('.fixed.bottom-0'));
  console.log('3) Mobile homepage sticky ad:', stickyHome ? 'present (OLD) ❌' : 'GONE ✅ (new fix live)');

  // 4. Mobile blog — sticky ad present (by design)
  await mob.goto('https://aiworldhub.site/blog', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await mob.waitForTimeout(3000);
  const stickyBlog = await mob.evaluate(() => !!document.querySelector('.fixed.bottom-0'));
  console.log('4) Mobile blog sticky ad:', stickyBlog ? 'present ✅ (by design)' : 'missing');

  // 5. Mobile optimizer — no sticky ad, tool above fold
  await mob.goto('https://aiworldhub.site/tools/advanced-prompt-optimizer', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await mob.waitForTimeout(3500);
  const m = await mob.evaluate(() => {
    const ta = document.querySelector('textarea[aria-label="Original prompt input"]');
    return { sticky: !!document.querySelector('.fixed.bottom-0'), taTop: ta ? Math.round(ta.getBoundingClientRect().top + scrollY) : -1 };
  });
  console.log('5) Mobile optimizer: sticky=', m.sticky ? 'present ❌' : 'GONE ✅', '| textarea@' + m.taTop + 'px (fold 812)');

  // 6. Blog post with CTA
  await page.goto('https://aiworldhub.site/blog/common-prompt-mistakes-and-how-to-fix-them', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(3500);
  const cta = await page.evaluate(() => document.body.innerText.includes('Try the free Prompt Optimizer'));
  console.log('6) Blog post CTA:', cta ? '✅ present' : '❌ missing');

  console.log('\nPAGEERRORS:', errs.length ? [...new Set(errs)] : 'NONE');
  await browser.close();
})();

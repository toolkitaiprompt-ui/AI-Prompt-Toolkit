# Implementation Tasks: ad-network-seo-optimization

## Configuration

**T1: Verify AD_CONFIG custom zone preserves existing Monetag direct-link zone**
- File: `src/components/AdBanner.tsx:34`
- Task: Verify `custom: { enabled: true, zoneId: "https://omg10.com/4/11565897" }` remains enabled
- Purpose: Preserve existing fallback ad rendering (AT-3: sponsored box with "Advertisement" label and "View Offer" CTA)
- Verification: `npm run build` must complete; custom sponsored box renders on all pages

**T2: Document Adsterra network enables only with valid zone ID from dashboard**
- File: `src/components/AdBanner.tsx:31`
- Task: Adsterra `adsterra: { enabled: false, zoneId: "" }` — do NOT enable per constraint "Do NOT enable an ad network unless the repository already contains a real zone ID"
- Rationale: Repository contains no Adsterra zone ID; zone ID must be obtained from Adsterra publisher dashboard before enabling
- Action: Leave `enabled: false` until zone ID is obtained; do not invent Adsterra zone ID

**T3: Document Monetag banner network enables only with valid zone ID from dashboard**
- File: `src/components/AdBanner.tsx:32`
- Task: Monetag-banner `"monetag-banner": { enabled: false, zoneId: "" }` — do NOT enable per constraint "Do NOT enable an ad network unless the repository already contains a real zone ID"
- Rationale: Repository contains no monetag-banner zone ID; existing zone IDs (11565893 = multitag, 11565895 = vignette, 11565897 = direct-link) are for different ad formats, not banner zones
- Action: Leave `enabled: false` until proper banner zone ID is obtained from Monetag dashboard; do not invent Monetag zone ID

**T4: Preserve existing Monetag scripts in index.html**
- File: `index.html:67-70`
- Task: Keep existing Monetag multitag (`data-zone="11565893"`) and vignette (zone `11565895`) scripts intact
- Purpose: AT-7 — ensure no JavaScript errors from zone ID conflicts between existing scripts and Ad component
- Verification: Both existing scripts and Ad component ads load independently without errors

---

## SEO Data Enhancements

**T5: Enhance homepage SEO keywords and verify title/description length**
- File: `src/seoConfig.ts:53-59`
- Task: Ensure homepage `/` has title 50-60 characters and description 140-160 characters with natural keywords
- Current: title ~55 chars ✅, description ~149 chars ✅, keywords ~15 terms
- Action: No changes needed if length constraints satisfied; verify keyword density < 5%

**T6: Enhance /tools directory SEO with high-traffic keywords**
- File: `src/seoConfig.ts:71-77`
- Task: Add "AI Prompt Tools" and "Free AI Prompt Tools" as modifiers to keywords
- Current keywords: "Best AI Tools, Free AI Tools, AI Tools Directory, Prompt Engineering Tools, Free AI Prompt Tools, AI Prompt Builder, ChatGPT Prompt Tools, Prompt Optimization Tools"
- Action: Ensure keyword density stays below 5%; terms are relevant to tools directory page purpose

**T7: Enhance /prompts library SEO with role-specific keywords**
- File: `src/seoConfig.ts:80-86`
- Task: Ensure keywords include "Best AI Prompts" and "Prompt Collection" as core terms alongside "AI Prompts, ChatGPT Prompts"
- Current: "AI Prompts, ChatGPT Prompts, Prompt Library, Prompt Templates, Best AI Prompts, Prompt Engineering, Role-Based Prompts, AI Prompt Collection, AI Prompting, Prompt Database"
- Action: Verify title (82 chars — may need trimming to ≤60) and description (158 chars — within 140-160 range) lengths; adjust if needed

**T8: Enhance high-traffic blog posts SEO with commercial-intent keywords**
- File: `src/seoConfig.ts:276-311`
- Task: Optimize top high-traffic blog posts with keyword mix of head terms and long-tail variations:

  a) `/blog/best-ai-tools-2026-complete-directory` (line 277):
     - Current title: "Best AI Tools 2026 — Complete Directory of 50+ Tools | AI World Hub" (~68 chars — exceeds 60 char limit)
     - Current description: "Discover the 50 best AI tools in 2026 for writing, image generation, coding, video, and productivity. Ranked by popularity with free plans and direct links." (~149 chars ✅)
     - Current keywords: "Best AI Tools, Free AI Tools, AI Tools Directory 2026, AI Prompting Tools"
     - Action: Trim title to ≤60 chars (e.g., "Best AI Tools 2026 — Complete Directory | AI World Hub"); add "AI Tools Directory 2026" keyword variant; ensure CTA in description

  b) `/blog/how-to-use-chatgpt-complete-guide` (line 289):
     - Current title: "How to Use ChatGPT — Complete Beginner Guide 2026 | AI World Hub" (~67 chars — exceeds 60 char limit)
     - Current description: "Learn how to use ChatGPT from scratch — creating an account, writing effective prompts, using advanced features, and avoiding common mistakes. Step-by-step guide for beginners." (~157 chars ✅)
     - Current keywords: "How to Use ChatGPT, ChatGPT Guide, Free AI Tools, Prompt Engineering, AI Prompting"
     - Action: Trim title to ≤60 chars (e.g., "How to Use ChatGPT — Beginner Guide 2026 | AI World Hub"); keep description as-is; keywords already good

  c) `/blog/free-ai-tools-50-best-tested` (line 295):
     - Current title: "50 Best Free AI Tools 2026 — Tested & Ranked | AI World Hub" (~63 chars — exceeds 60 char limit)
     - Current description: "50 genuinely free AI tools tested and ranked for 2026 — writing, images, video, coding, audio, and productivity. No hidden fees, no credit card required." (~156 chars ✅)
     - Current keywords: "Free AI Tools, Best AI Tools, AI Tools 2026, AI Prompting Tools"
     - Action: Trim title to ≤60 chars (e.g., "50 Best Free AI Tools 2026 — Tested & Ranked | AI World Hub"); may need slight adjustment; keywords already good

  d) `/blog/prompt-engineering-complete-guide` (line 301):
     - Current title: "Prompt Engineering Guide — Beginner to Expert 2026 | AI World Hub" (~62 chars — slightly exceeds 60 char limit)
     - Current description: "Master prompt engineering in 2026. Learn proven techniques, frameworks, and best practices for writing AI prompts that get professional results with ChatGPT, Claude, and Gemini." (~156 chars ✅)
     - Current keywords: "Prompt Engineering, AI Prompts, ChatGPT Prompts, Free AI Tools, AI Prompting, Prompt Optimization"
     - Action: Trim title to ≤60 chars (e.g., "Prompt Engineering Guide — Beginner to Expert | AI World Hub"); keep description; keywords already good

  e) `/blog/ai-tools-directory-categorized-list` (line 307):
     - Current title: "AI Tools Directory — 50+ Tools by Category | AI World Hub" (~58 chars ✅)
     - Current description: "Browse 50+ AI tools organized by category — text generation, image creation, video editing, coding, audio, and productivity. Find the perfect AI tool for any task." (~149 chars ✅)
     - Current keywords: "AI Tools Directory, Best AI Tools, Free AI Tools, AI Prompting Tools"
     - Action: No title/description length changes needed; keywords already good

**T9: Ensure programmatic prompt pages have unique SEO per role/task combination**
- File: `src/seoConfig.ts:327-353`
- Task: Verify PROMPT_TASKS generation produces unique titles and descriptions for /prompts/:role/:task pages
- Current pattern: `title: task.seoTitle`, `description: task.seoDescription`, `keywords: \`${task.title}, ${roleTitle}, AI Prompts, ChatGPT Prompts, Prompt Templates, Prompt Engineering\`
- Action: Ensure task.seoTitle and task.seoDescription from PROMPT_SEO.json are unique per role/task; verify no two programmatic pages share same title/description; confirm keywords include role-specific and task-specific terms

**T10: Verify blog post SEO posts in NEW_SEO_POSTS have proper seoTitle/metaDescription**
- File: `src/data/newBlogPosts.ts`
- Task: Ensure all NEW_SEO_POSTS entries have seoTitle (50-60 chars) and metaDescription (140-160 chars) fields
- Verification: Each post's seoTitle should match the title used in SEO_MAP, metaDescription should match the description used by BlogPostPage via useSeo()
- Action: No changes needed if fields already present; NEW_SEO_POSTS already has proper fields per earlier review

---

## Testing

**T11: Run Vitest + React Testing Library tests for AdBanner and SEO components**
- Command: `npm test` or `npx vitest run`
- File: Verify existing test files in repo continue to pass
- Task: Run test suite; ensure no regressions from configuration changes
- Verification: All existing tests pass; no new errors introduced

**T12: Verify AdBanner component renders correctly with current AD_CONFIG**
- Task: Render AdBanner with custom network only (Adsterra and Monetag banner disabled per constraints)
- Verify: Custom sponsored box with "Advertisement" label and "View Offer" CTA link appears; no empty ad slots; no console errors from script injection
- Scope: All 19 tool pages and major routes

**T13: Verify no JavaScript errors from ad script injection with existing Monetag scripts**
- Task: Load pages with both existing Monetag scripts (index.html zones 11565893, 11565895) and AdBanner component
- Verify: No console errors from zone ID conflicts; both existing Monetag scripts and AdBanner ads load independently; no script injection doubling or interference
- Scope: Homepage and tool pages

**T14: Verify SEO title/description uniqueness across all routes**
- Task: Check that no two routes in SEO_MAP share the same `<title>` or `<meta name="description">`
- Command: Can run build and inspect rendered titles, or write a quick Node script to check SEO_MAP for duplicate titles/descriptions
- Verification: No duplicate titles or descriptions across the 2200+ routes

---

## Build Verification

**T15: Run `npm run build` — complete build gate**
- Command: `npm run build`
- Process: `vite build` → `node prerender.mjs` → sitemap generation → sitemap validation
- Task: Ensure build completes successfully with all changes
- Gate: sitemap validator must pass; no warnings in console output

**T16: Verify sitemap.xml contains all routes with SEO data**
- File: `dist/public/sitemap.xml`
- Task: Validate that every route with SEO data has a corresponding `<url>` entry
- Check: All `<loc>` values use `https://aiworldhub.site` host
- Check: All `<lastmod>`, `<changefreq>`, `<priority>` values present and valid
- Verification: Sitemap validation passes; no missing or extra URLs

**T17: Verify prerender generates correct per-route HTML with SEO data**
- Task: Run `node prerender.mjs` and verify per-route `index.html` files in `dist/public` contain correct `<title>` and `<meta name="description">` for each route
- Scope: Check a sample of routes: homepage, tool pages, blog posts, programmatic prompt pages
- Verification: Each per-route HTML has unique, appropriate title and description

**T18: Verify Adsterra/Monetag script injection patterns in built output**
- Task: After `npm run build`, inspect ad slots in built pages
- For pages where custom network renders: Verify "Advertisement" label and "View Offer" CTA appear
- Verify: No Adsterra `atOptions`/`invoke.js` scripts inject (since adsterra.enabled=false); no Monetag `//monetag.com/${zone}.min.js` scripts inject (since monetag-banner.enabled=false)
- Verify: Existing Monetag multitag/vignette scripts in index.html remain functional

---

## Live Verification

**T19: Verify AT-3 — Fallback ad rendering when no specialized zones configured**
- Task: With Adsterra and Monetag banner disabled (current config), visit any page
- Verify: Professional-looking sponsored box appears with "Advertisement" label
- Verify: "View Offer" CTA links to `https://omg10.com/4/11565897` and opens in new tab
- Verify: Link has `rel="sponsored noopener noreferrer"` attribute
- Verification: Custom fallback ad renders correctly; no empty ad slots

**T20: Verify AT-4 — Ad re-loading after route navigation**
- Task: Navigate from one tool page to another via React Router links, then return
- Verify: Ads re-appear in ad slot after navigation
- Verify: No duplicate script injection errors in console after multiple navigations
- Verify: Previous ad content clears before new ad injects
- Verification: useEffect `injected.current` flag resets on route change; ads persist correctly across page transitions

**T21: Verify AT-5 — Mobile ad rendering (viewport ≤ 640px)**
- Task: View pages at mobile viewport (F12 → Toggle Toolbar → Devices toolbar, set to 320px or 640px)
- Verify: Ad container fills available width proportionally (max-width: 100%)
- Verify: "Advertisement" label remains visible and readable on small screens
- Verify: No horizontal overflow or layout breakage on page
- Verify: 300x250 banner creatives may stack vertically on very small screens — acceptable

**T22: Verify AT-6 — Desktop ad rendering (viewport ≥ 1024px)**
- Task: View pages at desktop viewport (default browser width ≥ 1024px)
- Verify: Ad renders at full available width
- Verify: Proper spacing maintained around ad slot (margin/padding from other content)
- Verify: No layout shift caused by ad injection or resizing (CLS contribution ≤ 0.1)
- Verify: Ad creative displays correctly at larger widths without distortion

**T23: Verify AT-7 — No ad conflict with existing Monetag scripts**
- Task: Load pages with existing Monetag multitag (zone 11565893) and vignette (zone 11565895) scripts in index.html
- Verify: No JavaScript errors from zone ID conflicts
- Verify: Both existing Monetag scripts and Ad component ads load independently
- Verify: No script injection doubles or interferes with either ad system
- Verification: Console is clean; ads and Monetag scripts coexist

**T24: Verify AT-8 — SEO title and description uniqueness**
- Task: Visit each major route and check `<title>` and `<meta name="description">`
- Verify: Each route has unique `<title>` tag (50-60 characters)
- Verify: Each route has unique `<meta name="description">` (140-160 characters)
- Verify: No two different pages share the same title or description
- Verification: All titles and descriptions are unique across the site

**T25: Verify AT-11 — Blog post SEO optimization**
- Task: Visit high-traffic blog post pages
- Verify: Title includes target keyword phrase for that post
- Verify: Description includes compelling call-to-action
- Verify: Keywords include mix of head terms and long-tail variations
- Verification: Blog posts have optimized SEO for better search visibility

**T26: Verify AT-12 — Programmatic prompt page SEO**
- Task: Visit a programmatic prompt page (e.g., /prompts/:role/:task)
- Verify: SEO data generated from the role and task definitions
- Verify: Title and description unique to that specific role/task combination
- Verify: Keywords include role-specific and task-specific terms
- Verification: Programmatic pages have unique SEO per role/task
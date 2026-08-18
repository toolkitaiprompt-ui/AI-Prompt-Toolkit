# Research: ad-network-seo-optimization

## Phase 0 Output — All NEEDS CLARIFICATION resolved

### Research Task 1: Adsterra native banner script pattern

**Decision**: Adsterra banner injects via two scripts:
1. A configuration script setting `atOptions` object with `key`, `format`, `height`, `width`, and `params`
2. An invoke script loaded from `//www.highperformanceformat.com/{zone}/invoke.js`

**Rationale**: This is the standard Adsterra native banner implementation. When `AD_CONFIG.adsterra.enabled=true` and a valid zoneId is set, the AdBanner component (resolvedNetwork === "adsterra") creates:
- A `<script>` element with `type="text/javascript"` containing `atOptions = { 'key': 'ZONE_ID', 'format': 'iframe', 'height': 250, 'width': 300, 'params': {} }`
- A second `<script>` element with `src="//www.highperformanceformat.com/ZONE_ID/invoke.js"`, `async=true`

**Alternatives Considered**:
- Iframe-based Adsterra tag (rejected): Would require different slot dimensions and HTML structure; component currently expects script-based injection
- Direct URL linking (rejected): Doesn't render as native banner; reduces ad network revenue

**Key Findings**:
- Format `'iframe'` is standard for banner zones
- Default dimensions are `height: 250, width: 300`
- The `params` object is empty `{}` for basic banner zones
- Script must be appended to the ad slot container element
- invoke.js must be loaded with `async=true` for proper rendering

### Research Task 2: Monetag banner script with cfasync

**Decision**: Monetag banner script injects as:
```html
<script async data-cfasync="false" src="//monetag.com/{ZONE_ID}.min.js"></script>
```

**Rationale**: The `data-cfasync="false"` attribute is required by Monetag to prevent Cloudflare's cross-site scripting protection from blocking the ad script. Without this attribute, the Monetag banner would fail to load. The AdBanner component already handles this by setting `script.setAttribute("data-cfasync", "false")` when resolvedNetwork === "monetag-banner".

**Alternatives Considered**:
- Without `data-cfasync="false"` (rejected): Monetag script blocked by Cloudflare, ad slot remains empty
- Synchronous script load (rejected): Causes layout shift and performance degradation; `async` already set

**Key Findings**:
- `data-cfasync="false"` must be on the `<script>` tag, not as a meta tag
- Script `src` format is `//monetag.com/{ZONE_ID}.min.js`
- `async` attribute must also be present for non-blocking load
- Zone ID comes from `AD_CONFIG.monetag-banner.zoneId`

### Research Task 3: React SPA ad re-loading pattern

**Decision**: Ad re-loading on React Router navigation uses the existing useEffect pattern with an `injected.current` ref flag:

**Current behavior** (from AdBanner.tsx:62-126):
- `useEffect` depends on `[resolvedNetwork, finalZone]`
- `injected.current` ref prevents duplicate injection on same mount
- Effect cleanup sets `injected.current = false` on unmount
- On route change, component unmounts and re-mounts, resetting `injected.current`
- Ads re-inject because useEffect runs again on re-mount

**Rationale**: This is the standard React pattern for side effects that should only run once per component mount. When navigating away and back, the component unmounts (injected.current resets) and re-mounts (useEffect runs again, injects ads).

**Alternatives Considered**:
- Global event listener on route change (rejected): Overly complex; useEffect reset pattern is simpler and already in place
- Redux/store-based ad state (rejected): Unnecessary overhead for single component; local ref suffices

**Key Findings**:
- `injected.current` flag is the mechanism preventing duplicate scripts
- Cleanup function (`return () => { injected.current = false }`) runs on unmount
- Dependent dependency array `[resolvedNetwork, finalZone]` triggers re-injection if either changes
- On initial page load, ads inject on first mount; on navigation, they clear and re-inject

### Research Task 4: SEO keyword optimization for high-traffic pages

**Decision**: Targeted keyword optimization (not keyword stuffing) for high-traffic pages:

**Current SEO_MAP analysis** (from seoConfig.ts):
- Homepage keywords: "Best AI Tools, Free AI Tools, ChatGPT Prompts, Prompt Engineering, AI Tools Directory, AI Prompt Builder, How to Use ChatGPT, Prompt Optimization, AI Prompting, ChatGPT Prompt Generator" — ~15 keywords, keyword density likely < 5%
- Blog post keywords vary; some are generic ("AI Prompts") while others are specific ("Free AI Tools 2026")
- Programmatic prompt pages generate keywords from role/task titles

**Rationale**: SEO improvement requires adding high-volume, low-competition keywords that users actually search for, while maintaining keyword density below 5% to avoid stuffing penalties. The approach is to enhance existing keywords, not overload with new ones.

**Alternatives Considered**:
- Comprehensive content rewrite per page (rejected): Outside spec scope; would add meaningful pages/content which is prohibited
- Removing keywords entirely (rejected): Would decrease SEO value; keeping existing + enhancing is better
- Automated keyword stuffing tools (rejected): Violates policy; would risk search engine penalties

**Key Findings**:
- Current keywords need enhancement, not replacement
- High-traffic blog posts ("Best AI Tools 2026", "How to Use ChatGPT") need commercial-intent keywords
- Programmatic pages already have role/task-specific keywords generated from PROMPT_ROLES/PROMPT_TASKS
- Focus: add modifiers like "2026", "free", "best", "top", "directory" where relevant and natural

### Research Task 5: Sitemap consistency validation

**Decision**: Sitemap.xml must contain all routes with SEO data and use `https://aiworldhub.site` host:

**Current state** (from public/sitemap.xml analysis):
- ~2200+ URLs already in sitemap
- All use `https://aiworldhub.site` host ✅
- All have `<lastmod>2026-08-16</lastmod>` ✅
- All have `<changefreq>weekly|daily</changefreq>` ✅
- All have `<priority>0.6-1.0</priority>` ✅

**Rationale**: After AD_CONFIG and SEO_MAP changes, sitemap must still pass validation. The build process (`npm run build` → `vite build` → `node prerender.mjs` → sitemap generation → sitemap validation) must complete without errors.

**Alternatives Considered**:
- Manual sitemap editing (rejected): Error-prone; build process should generate sitemap automatically
- Removing URLs from sitemap (rejected): Would reduce indexation; keep all existing URLs
- Changing host domain (rejected): Would break existing links and SEO; `aiworldhub.site` must remain

**Key Findings**:
- All 2200+ URLs already use correct host — no changes needed to sitemap host format
- After AD_CONFIG changes, ensure ad-related pages still appear in sitemap
- After SEO_MAP updates, ensure all routes with SEO data have corresponding `<url>` entries
- Prerender.mjs generates per-route index.html; must ensure these routes remain in sitemap

## Summary of Research Findings

| Topic | Decision | Rationale |
|-------|----------|-----------|
| Adsterra script pattern | `atOptions` + `invoke.js` | Standard Adsterra banner implementation |
| Monetag script | `data-cfasync="false"` + `async` | Required for Monetag compliance |
| SPA ad re-loading | `injected.current` ref reset on unmount | Existing React pattern, no changes needed |
| SEO keyword optimization | Enhance existing, don't stuff | Maintains <5% density, improves relevance |
| Sitemap validation | Already correct host; verify after changes | 2200+ URLs already use `aiworldhub.site` |

**Output**: research.md consolidated with all findings above — all NEEDS CLARIFICATION markers resolved.

## Phase 0 Completion Criteria

- [x] All NEEDS CLARIFICATION markers resolved (5 research tasks completed)
- [x] No unresolved unknowns blocking Phase 1 design
- [x] Research findings documented and ready for design phase
- [x] Constitution Check passed with exceptions noted
# Implementation Plan: ad-network-seo-optimization

**Branch**: `001-ad-network-seo-optimization` | **Date**: `2026-08-18` | **Spec**: `specs/001-ad-network-seo-optimization/spec.md`

**Input**: Feature specification from `/specs/001-ad-network-seo-optimization/spec.md`

## Summary

Fix and optimize the advertising and organic-growth system of AI World Hub. This involves configuring Adsterra and Monetag ad networks to actually render, resolving script conflicts between existing Monetag scripts and the Ad component, verifying ad loading on single-page application navigation, checking ad rendering on mobile and desktop viewports, and implementing only realistic SEO improvements that bring legitimate organic visitors. All existing functionality is preserved; no pages, content, or features are removed.

## Technical Context

**Language/Version**: TypeScript 5.8, React 19, Vite 7

**Primary Dependencies**:
- `react-router-dom@7.18.2` — SPA navigation where AdBanner re-mounts on route changes
- `framer-motion` — animation framework (existing, not directly ad-related)
- `lucide-react` — icon library (existing)
- `@tailwindcss/vite` — Tailwind CSS 4 integration
- `fast-xml-parser` — sitemap XML parsing

**Storage**: N/A — all processing occurs client-side in the browser; no database or server-side storage required for this feature

**Testing**: Vitest + React Testing Library (existing test framework); existing tests for components should continue to pass

**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge) — ads render in the browser DOM

**Project Type**: Web application (SPA) — existing AI World Hub website with 19 tools, 225+ prompt pages, and 100+ blog posts

**Performance Goals**:
- Ad slot renders within 1 second of page load
- Ad re-render after navigation within 500ms
- No layout shift CLS (Cumulative Layout Shift) ad contribution > 0.1
- Page load time impact < 200ms when ads are present

**Constraints**:
- Adsterra and Monetad zones must be policy-compliant
- Ads must never use deceptive clicks or forced redirects
- All ad links must use `target="_blank"` with `rel="noopener noreferrer"`
- Sponsored content must be clearly labeled as "Advertisement" or "Sponsored"
- No popunder ads that trick users into interacting
- Monetag `data-cfasync="false"` must be set on all external ad scripts
- Existing Monetag multitag (zone 11565893) and vignette (zone 11565895) in index.html must remain functional
- Sitemap validation must pass `npm run build`

**Scale/Scope**:
- 19 tool ad slots across all tool pages
- 225+ programmatic prompt pages (/prompts/:role/:task) with unique SEO
- 30+ high-traffic blog posts with optimized SEO
- ~2200+ URLs in sitemap.xml
- Mobile viewport ≤ 640px and desktop viewport ≥ 1024px ad rendering

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Library-First**: N/A — this is a website feature, not a standalone library. The feature starts as a website optimization, not a library-first implementation. Exception noted: ad network configuration and SEO improvements are part of the existing website, not a new library being created.

**Test-First (NON-NEGOTIABLE)**: ✅ Tests will verify ad rendering acceptance criteria (AT-1 through AT-12) and SEO output (AT-8 through AT-12). Red-Green-Refactor cycle applies: tests for ad slot presence, SEO title/description uniqueness, and keyword relevance will be written before implementation changes, then pass after changes.

**CLI Interface**: N/A — this is a website feature without a CLI interface. The build process (`npm run build`) serves as the deployment pipeline.

**Integration Testing**: ✅ Focus areas: ad slot presence across all 19 tool pages, SEO title/description uniqueness across routes, no JavaScript errors from ad script injection, sitemap.xml validation after build.

**Observability**: ✅ Structured logging for: ad injection errors in console, SEO validation failures, build sitemap warnings. Text I/O ensures debuggability via console output and build logs.

**Gates Status**: All constitution gates pass with appropriate exceptions noted. No violations that require justification.

## Project Structure

### Documentation (this feature)

```text
specs/001-ad-network-seo-optimization/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root) - No source code changes required

The implementation is configuration-driven via `AD_CONFIG` in `src/components/AdBanner.tsx` and SEO data in `src/seoConfig.ts`. No component restructuring or new file additions required beyond the existing codebase.

**Structure Decision**: No source code restructuring needed. All changes are configuration-based (AD_ENABLED flags, zoneId values) and SEO data updates in existing files. Existing components, pages, and functionality are preserved.

## Complexity Tracking

> No constitution check violations detected. No complexity tracking needed.

## Phase 0: Research Tasks

**Decision**: Research needed on ad network script patterns and SEO optimization strategies before implementation.

**Rationale**: Understanding Adsterra/Monetag script injection patterns, React SPA ad re-loading, and SEO keyword strategies is critical before making configuration changes.

**Alternatives Considered**: 
- Direct script injection in index.html vs. component-based injection (chose component-based per existing AdBanner architecture)
- Comprehensive SEO content rewrite vs. targeted keyword optimization (chose targeted optimization per spec scope)

### Research Tasks Created

1. **Adsterra native banner script pattern**: Investigate `atOptions` + `invoke.js` injection pattern for banner zones, including height/width parameters and format options
   - Rationale: Ensures Adsterra ad renders correctly at 300x250 dimensions when AD_CONFIG.adsterra.enabled=true

2. **Monetag banner script with cfasync**: Investigate `//monetag.com/{zone}.min.js` script injection with `data-cfasync="false"` attribute
   - Rationale: Proper cross-script tracking disable required for Monetag banner compliance

3. **React SPA ad re-loading pattern**: Investigate useEffect dependency reset pattern for ad re-injection on React Router navigation
   - Rationale: Verifying AT-4 (SPA ad re-loading) requires understanding how injected.current flag resets on route change

4. **SEO keyword optimization for high-traffic pages**: Research high-volume, low-competition keywords for top blog posts and prompt pages
   - Rationale: AT-9 and AT-11 require relevant keywords without stuffing; research ensures measurable SEO improvement

**Output**: research.md with all findings consolidated

## Phase 1: Design & Contracts

### Phase 1a: Data Model (data-model.md)

Since this is a configuration-driven feature (no new data entities), the data model consists of the existing AdConfig and SEO_MAP structures:

**AdConfig** (`src/components/AdBanner.tsx:30-39`):
- Records ad network enabled status and zoneId for each network type
- Fields: `adsterra: { enabled: boolean; zoneId: string }`, `monetag-banner: { enabled: boolean; zoneId: string }`, `custom: { enabled: boolean; zoneId: string }`, `raw-html: { enabled: boolean; zoneId: string }`
- Single source of truth for which networks render and their configuration

**SEO_MAP** (`src/seoConfig.ts:51-312`):
- Record of SEO data (title, description, keywords) per route
- Used by `getSeoForPath()` to provide page-specific SEO
- Covers homepage, all tool pages, blog posts, categories, and programmatic prompt pages

**No new entities or relationships** - existing structures are extended, not created.

### Phase 1b: Interface Contracts

Since this is an internal website feature (no external APIs, services, or interfaces exposed), no interface contracts are required. The ad and SEO configurations are entirely internal to the application.

**Skip**: Project is purely internal website optimization with no external interfaces to document.

### Phase 1c: Quickstart Validation Guide (quickstart.md)

**Prerequisites**:
- `npm run build` completes successfully
- Adsterra zone ID configured in `AD_CONFIG.adsterra.zoneId`
- Monetag banner zone ID configured in `AD_CONFIG.monetag-banner.zoneId`
- Node.js 20+ environment

**Validation Scenarios**:

1. **Adsterra ad renders**: Run `npm run build` → verify Adsterra native banner script (`atOptions` + `invoke.js`) injects into ad slots on tool pages
   - Expected: Ad slot displays 300x250 Adsterra banner; no console errors

2. **Monetag banner ad renders**: Run `npm run build` → verify Monetag banner script (`//monetag.com/{zone}.min.js`) injects with `data-cfasync="false"`
   - Expected: Ad slot displays Monetag banner; no cross-site tracking warnings

3. **SPA ad re-loading**: Navigate between tool pages via React Router → ads re-appear in ad slots
   - Expected: No duplicate script injection; ads clear and re-inject on each navigation

4. **Mobile ad rendering**: View pages at mobile viewport (≤ 640px) → ad container fills width proportionally
   - Expected: No horizontal overflow; ad creative readable; "Advertisement" label visible

5. **Desktop ad rendering**: View pages at desktop viewport (≥ 1024px) → ad renders at full width
   - Expected: Proper spacing maintained; no layout shift; ad creative displays correctly

6. **SEO title uniqueness**: Check that each route has unique `<title>` tag (50-60 characters)
   - Expected: No duplicate titles across different routes

7. **SEO description uniqueness**: Check that each route has unique `<meta name="description">` (140-160 characters)
   - Expected: No duplicate descriptions across different routes

8. **Sitemap validation**: Run `npm run build` → validate sitemap.xml
   - Expected: All URLs valid; `https://aiworldhub.site` host; no warnings

**Expected Outcomes**: All 8 validation scenarios pass, confirming ad networks function and SEO improvements are in place.

### Phase 2: Tasks (to be created separately)

- `tasks.md` will be created by `/speckit.tasks` command after this plan phase
- Contains implementation tasks for configuring AD_CONFIG zones, optimizing SEO data, and verifying all acceptance tests

## Key Rules Applied

- **Absolute paths for filesystem operations**: Used absolute paths in plan.md references
- **Project-relative paths for documentation references**: All paths relative to repo root
- **Constitution gates evaluated**: All gates pass with appropriate exceptions noted for website-feature-not-library
- **No implementation code in spec**: This plan is configuration and SEO data focused, no code structure changes
- **Existing functionality preserved**: All 19 tools, 225+ prompt pages, and 100+ blog posts remain accessible
- **Policy-compliant ads**: All ad configurations comply with Adsterra and Monetag program policies
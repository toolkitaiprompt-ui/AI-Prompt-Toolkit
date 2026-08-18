# Quickstart Validation Guide: ad-network-seo-optimization

## Prerequisites

- Node.js 20+ installed
- `npm install` completed (installs all dependencies)
- Access to Adsterra dashboard for banner zone ID
- Access to Monetag dashboard for banner zone ID
- Text editor or IDE for configuration changes

## Setup Steps

### 1. Configure Adsterra Banner Ads

**File**: `src/components/AdBanner.tsx`

**Change**: Enable Adsterra network and set zone ID

```typescript
// Before (line 31):
adsterra: { enabled: false, zoneId: "" },

// After:
adsterra: { enabled: true, zoneId: "YOUR_ADSTERRA_ZONE_ID" },
```

**Required**: Replace `"YOUR_ADSTERRA_ZONE_ID"` with actual Adsterra banner zone ID obtained from Adsterra publisher dashboard.

### 2. Configure Monetag Banner Ads

**File**: `src/components/AdBanner.tsx`

**Change**: Enable Monetag banner network and set zone ID

```typescript
// Before (line 32):
"monetag-banner": { enabled: false, zoneId: "" },

// After:
"monetag-banner": { enabled: true, zoneId: "YOUR_MONETAG_ZONE_ID" },
```

**Required**: Replace `"YOUR_MONETAG_ZONE_ID"` with actual Monetag banner zone ID obtained from Monetag publisher dashboard.

### 3. Verify Existing Monetag Scripts Coexist

**File**: `index.html`

**Check**: Ensure existing Monetag multitag and vignette scripts remain functional:

```html
<!-- Monetag multitag — onclick/popunder (zone 11565893) -->
<script src="https://nap5k.com/tag.min.js" data-zone="11565893" async data-cfasync="false"></script>

<!-- Monetag vignette (interstitial) — zone 11565895 -->
<script>(function(s){s.dataset.zone='11565895',s.src='https://n6wxm.com/vignette.min.js'})(...)</script>
```

**Required**: Do not remove or modify these existing scripts. They must coexist with new AdBanner ad component scripts.

### 4. Build and Validate

**Command**: `npm run build`

**Expected Outcome**: Build completes successfully, sitemap validation passes.

**Build Process**:
1. `vite build` — compiles TypeScript/React to `dist/public`
2. `node prerender.mjs` — generates per-route `index.html` for all routes
3. Sitemap generation — creates `dist/public/sitemap.xml`
4. Sitemap validator — validates `dist/public/sitemap.xml`

## Validation Scenarios

### Scenario 1: Adsterra Ad Renders

**Steps**:
1. Configure Ad zone ID in AD_CONFIG (step 2 above)
2. Run `npm run build`
3. Visit any tool page (e.g., `http://localhost:5173/tools/prompt-variable-extractor/`)

**Expected**: 
- Ad slot displays 300x250 Adsterra native banner
- No console errors from ad script injection
- `atOptions` object present in page source with correct zone ID
- `invoke.js` script loaded asynchronously

**Troubleshooting**:
- If ad slot is empty: Check AD_CONFIG.adsterra.zoneId is correct and non-empty
- If console errors: Verify zone ID format; Adsterra zones are numeric strings
- If `atOptions` not rendering: Ensure `adsterra.enabled` is `true`

### Scenario 2: Monetag Banner Ad Renders

**Steps**:
1. Configure Monetag zone ID in AD_CONFIG (step 3 above)
2. Run `npm run build`
3. Visit any page with AdBanner component

**Expected**:
- Ad slot displays Monetag banner script injected
- `<script async data-cfasync="false" src="//monetag.com/ZONE_ID.min.js"></script>` present in page source
- No cross-site scripting warnings in console

**Troubleshooting**:
- If ad slot is empty: Check AD_CONFIG.monetag-banner.zoneId is correct and non-empty
- If "Blocked by Cross-Site Scripting" error: Ensure `data-cfasync="false"` is on the script tag (already in component)
- If Monetag vignette conflicts: Verify existing index.html Monetag scripts remain unchanged

### Scenario 3: SPA Ad Re-loading

**Steps**:
1. Ensure both Adsterra and Monetad zones configured
2. Run `npm run build`
3. Visit `http://localhost:5173/tools/prompt-variable-extractor/`
4. Click React Router link to navigate to another tool (e.g., `http://localhost:5173/tools/json-schema-generator/`)
5. Use browser back button or manually navigate back to first page

**Expected**:
- Ads re-appear in ad slot after navigation
- No duplicate script injection errors in console after multiple navigations
- Previous ad content clears before new ad injects
- `injected.current` flag resets on route change (component unmounts/re-mounts)

**Troubleshooting**:
- If ads don't re-appear: Check useEffect dependency array `[resolvedNetwork, finalZone]`
- If duplicate scripts: Verify cleanup function runs on unmount (`injected.current = false`)
- If ads persist incorrectly: Check component re-mount behavior on navigation

### Scenario 4: Mobile Ad Rendering

**Steps**:
1. Configure ad zones
2. Run `npm run build`
3. Visit any page at mobile viewport (F12 → Toggle Toolbar → Devices toolbar)
4. Ensure viewport ≤ 640px

**Expected**:
- Ad container fills available width proportionally (max-width: 100%)
- Ad creative maintains readability (font sizes appropriate for small screens)
- "Advertisement" label visible and readable
- No horizontal overflow on page
- Ad stack vertically if needed (300x250 banner may stack on very small screens)

**Troubleshooting**:
- If horizontal overflow: Check ad container CSS max-width constraints
- If label not visible: Check label font size and contrast for mobile
- If ad stacks unexpectedly: May need CSS media query adjustments

### Scenario 5: Desktop Ad Rendering

**Steps**:
1. Configure ad zones
2. Run `npm run build`
3. Visit any page at desktop viewport (default browser width ≥ 1024px)

**Expected**:
- Ad renders at full available width
- Proper spacing maintained around ad slot (margin/padding from other content)
- No layout shift ads cause content reflow
- Ad creative displays correctly at larger widths without distortion
- Sponsored box or banner scales appropriately

**Troubleshooting**:
- If layout shift: Check ad injection doesn't push other content; verify min-height doesn't expand
- If ad doesn't fill width: Check container max-width constraints
- If creative distorts: Ensure aspect ratio maintained or CSS object-fit applied

### Scenario 5: SEO Title and Description Uniqueness

**Steps**:
1. Run `npm run build`
2. Visit each major route and check `<title>` and `<meta name="description">`

**Expected**:
- Each route has unique `<title>` (50-60 characters)
- Each route has unique `<meta name="description">` (140-160 characters)
- No two different pages share the same title or description
- Keywords are relevant to page content, not stuffed

**Troubleshooting**:
- If duplicate titles: Check SEO_MAP entries for routes with similar content
- If descriptions too short/long: Adjust to 140-160 character range
- If keyword stuffing: Reduce keyword count; maintain <5% density

### Scenario 6: Sitemap Validation

**Steps**:
1. Run `npm run build` (complete build process)
2. Visit `https://aiworldhub.site/sitemap.xml` (or `dist/public/sitemap.xml`)

**Expected**:
- All 2200+ URLs present with `<loc>` entries
- All `<loc>` values use `https://aiworldhub.site` host
- All `<lastmod>` values present (e.g., `2026-08-16`)
- All `<changefreq>` values present (e.g., `weekly`, `daily`)
- All `<priority>` values present (e.g., `1.0`, `0.9`, `0.8`, `0.6`)
- No validation errors

**Troubleshooting**:
- If URLs missing: Ensure all routes with SEO data are in static-routes.mjs or prompt-engine.json
- If host wrong: Check prerender.mjs SITE constant and sitemap generator
- If validation errors: Run `npm run build` again; may be transient

## Expected Outcomes

After completing all setup steps and validation scenarios:

✅ Adsterra banner ads render on website without empty slots  
✅ Monetag banner ads render on website without empty slots  
✅ Both ad networks operate simultaneously without errors  
✅ Ads re-appear after SPA navigation (React Router route changes)  
✅ No duplicate script injection errors in console  
✅ Mobile ad rendering: no layout breakage, readable content  
✅ Desktop ad rendering: full width, proper spacing, no layout shift  
✅ All titles unique (50-60 chars) and descriptions unique (140-160 chars)  
✅ No keyword stuffing (density < 5%)  
✅ Sitemap.xml validates with all URLs and correct host  
✅ Existing Monetag multitag/vignette scripts remain functional  
✅ No policy violations (no deceptive clicks, no forced redirects)  
✅ `npm run build` completes successfully gate passes  

## Phase Completion

This quickstart guide validates the implementation end-to-end. All 8 scenarios must pass before the feature is considered complete. Any failed scenarios should be addressed by reviewing the configuration changes and component behavior.
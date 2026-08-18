# Data Model: ad-network-seo-optimization

## Overview

Since this implementation plan covers configuration-driven changes to existing Adsterra/Monetag ad network settings and SEO data optimization (no new data entities, databases, or storage structures), the data model consists of the existing structures in the AI World Hub codebase that are being extended or modified.

## Existing Entities

### 1. AdConfig

**Location**: `src/components/AdBanner.tsx:30-39`

**Description**: Single source of truth for ad network configuration. Contains enabled status and zone ID for each network type.

**Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `adsterra.enabled` | boolean | Whether Adsterra network is enabled (`true`/`false`) |
| `adsterra.zoneId` | string | Adsterra banner zone ID (e.g., `"1234567"`) |
| `monetag-banner.enabled` | boolean | Whether Monetag banner network is enabled |
| `monetag-banner.zoneId` | string | Monetag banner zone ID (e.g., `"11565893"`) |
| `custom.enabled` | boolean | Whether custom direct-link zone is enabled (always `true`) |
| `custom.zoneId` | string | Custom zone URL (e.g., `"https://omg10.com/4/11565897"`) |
| `raw-html.enabled` | boolean | Whether raw HTML banner mode is enabled |
| `raw-html.zoneId` | string | Raw HTML banner code (injected via slot) |

**Behavior**:
- When `network` prop provided to `<AdBanner>` → uses that network
- Otherwise falls back to first enabled network in AD_CONFIG
- `custom` network renders as sponsored box with "Advertisement" label and CTA link
- `raw-html` injects script/ins snippet into ad slot
- `adsterra` injects `atOptions` + `invoke.js` script
- `monetag-banner` injects `//monetag.com/{zone}.min.js` script

**No changes required to data structure** — only configuration values (enabled/zoneId) will be updated.

### 2. SEO_MAP

**Location**: `src/seoConfig.ts:51-312`

**Description**: Record of SEO data (title, description, keywords) per route. Used by `getSeoForPath()` to provide page-specific search engine optimization.

**Structure**: `Record<string, SeoData>` where key is pathname (e.g., `"/"`, `"/tools"`, `"/blog/how-to-use-chatgpt-complete-guide"`)

**SeoData type** (`src/seoConfig.ts:12-16`):
```typescript
interface SeoData {
  title: string;       // <title> tag content (50-60 characters)
  description: string; // <meta name="description"> content (140-160 characters)
  keywords: string;    // comma-separated keywords
}
```

**Coverage**:
- Homepage: `"/"` — 1 SEO entry
- Tools directory: `"/tools"` — 1 SEO entry
- 19 tool pages: `/tools/prompt-variable-extractor`, ..., `/tools/regex-generator`
- Playground: `"/playground"` — 1 SEO entry
- Prompts library: `"/prompts"` — 1 SEO entry (225+ programmatic pages)
- Changelog: `"/changelog"` — 1 SEO entry
- Blog: `"/blog"` — 1 SEO entry + 30+ blog post specific entries
- About: `"/about"` — 1 SEO entry
- Contact: `"/contact"` — 1 SEO entry
- Privacy: `"/privacy-policy"` — 1 SEO entry
- Terms: `"/terms-of-service"` — 1 SEO entry
- Categories: `"/categories"` — 1 SEO entry
- Image generator: `"/image-generator"` — 1 SEO entry

**No changes required to data structure** — only title/description/keywords values will be enhanced for high-traffic pages.

### 3. AdBanner Component States

**Location**: `src/components/AdBanner.tsx:41-182`

**Description**: Universal banner ad component supporting multiple ad network types. Renders differently based on resolved network type.

**Network Resolution Logic** (`AdBanner.tsx:53-58`):
```typescript
const resolvedNetwork: Network = (() => {
    if (zoneId) return network;           // 1. explicit zoneId prop wins
    if (AD_CONFIG[network]?.enabled) return network; // 2. fall back to first enabled
    const enabled = (Object.keys(AD_CONFIG) as Network[]).find((k) => AD_CONFIG[k].enabled);
    return enabled ?? network;           // 3. no enabled network → render nothing
})();
```

**Render Modes**:
| Network | Renders | Script Injection | Key Attributes |
|---------|---------|-----------------|----------------|
| `custom` | Sponsored box with "Advertisement" label + "View Offer" CTA link | None (direct link) | `target="_blank"`, `rel="sponsored noopener noreferrer"` |
| `raw-html` | Div with banner code innerHTML + re-created `<script>` nodes | Script/ins snippet | `data-cfasync` disabled on scripts |
| `adsterra` | Native banner script (`atOptions` + `invoke.js`) | 2 scripts: `atOptions` config + `invoke.js` | `format: 'iframe'`, `height: 250`, `width: 300` |
| `monetag-banner` | Monetag banner script | 1 script: `//monetag.com/{zone}.min.js` | `data-cfasync="false"`, `async` |
| (none) | null (no zone configured) | — | — |

**No changes required to component structure** — only AD_CONFIG values will be updated.

## Relationships

### AdConfig → AdBanner Component
- AdConfig provides the configuration that AdBanner uses to determine which network renders
- AD_CONFIG.adsterra.enabled → AdBanner renders Adsterra network
- AD_CONFIG.monetag-banner.enabled → AdBanner renders Monetag-banner network
- AD_CONFIG.custom.enabled → AdBanner renders custom sponsored box (always enabled)
- AD_CONFIG.raw-html.enabled → AdBanner renders raw HTML banner (always disabled)

### SEO_MAP → getSeoForPath()
- SEO_MAP provides the data that getSeoForPath() returns for each route
- getSeoForPath(pathname) returns SEO_MAP[pathname] for exact match
- Falls back to cleanPath match (remove trailing slash)
- Falls back to programmatic prompt pages (/prompts/:role/:task)
- Falls back to prompt role pages (/prompts/:role)
- Falls back to blog posts (/blog/)
- Falls back to DEFAULT_SEO for unknown routes

### No new relationships — all existing structures are being extended/modified, not created.

## Validation Rules

### AdConfig Validation
- `adsterra.enabled` must be `true` for Adsterra ads to render
- `adsterra.zoneId` must be non-empty string when `adsterra.enabled=true`
- `monetag-banner.enabled` must be `true` for Monetag banner ads to render
- `monetag-banner.zoneId` must be non-empty string when `monetag-banner.enabled=true`
- At least one network must be enabled (custom is always enabled as fallback)

### SEO_MAP Validation
- Each route in SEO_MAP must have `title` length between 50-60 characters
- Each route in SEO_MAP must have `description` length between 140-160 characters
- Keywords must not exceed 5% keyword density per page
- No two routes should share the same title or description
- All titles and descriptions must be unique across the site

## No New Data Structures

This implementation does not create new database tables, API endpoints, CLI interfaces, or external data models. All changes are:
- Configuration value updates in existing AD_CONFIG object
- SEO data enhancements in existing SEO_MAP object
- Verification that existing components render correctly with new configurations

## Phase 1 Completion Criteria

- [x] Data model documents existing entities (AdConfig, SEO_MAP, AdBanner)
- [x] No new entities or relationships created
- [x] Validation rules defined for configuration values
- [x] All changes are backward-compatible (existing functionality preserved)
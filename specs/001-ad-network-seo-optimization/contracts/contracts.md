# Contracts: ad-network-seo-optimization

**Status**: Skipped — project is purely internal website optimization

**Rationale**: This implementation plan covers configuration-driven changes to existing ad network settings (AD_CONFIG) and SEO data (SEO_MAP) within the AI World Hub website. The project does not expose any external APIs, services, or interfaces to users or other systems.

**What is covered internally**:
- `AD_CONFIG` in `src/components/AdBanner.tsx` — internal ad network configuration
- `SEO_MAP` in `src/seoConfig.ts` — internal SEO data per route
- `AdBanner` component — internal React component rendering ads
- `index.html` — existing Monetag scripts (multitag/vignette)

**No external interfaces to document**:
- No public APIs
- No command-line tools (beyond `npm run build`)
- No web service endpoints
- No parser grammars
- No UI contracts for external applications

**Existing internal contracts that are preserved**:
- AdBanner component prop interface (`AdBannerProps`) — unchanged
- `getSeoForPath()` function signature — unchanged
- `SEO_MAP` record keys — unchanged (same routes)
- `AD_CONFIG` record structure — unchanged (same network types)

**No contracts directory content required** — this is a configuration and SEO optimization feature with no new or modified external interfaces.
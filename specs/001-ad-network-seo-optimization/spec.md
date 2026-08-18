# Specification: ad-network-seo-optimization

## Overview

Fix and optimize the advertising and organic-growth system of the AI World Hub website. This specification covers making Adsterra and Monetag ad networks actually work, resolving their configuration/script conflicts, verifying SPA ad loading, checking mobile and desktop ad rendering, and fixing only SEO issues that can realistically bring more legitimate organic visitors.

## Acceptance Tests

**AT-1: Adsterra Banner Ad Rendering**
- Given: Ad configuration enables the Adsterra network with a valid zone
- When: The ad component renders on any page
- Then: The ad slot displays a native Adsterra banner
- And: The ad renders at 300x250 pixel dimensions
- And: No empty ad slot remains when the zone is configured

**AT-2: Monetag Banner Ad Rendering**
- Given: Ad configuration enables the Monetag network with a valid zone
- When: The ad component renders on any page
- Then: The ad slot displays a Monetag banner
- And: The banner loads with cross-script tracking disabled
- And: No empty ad slot remains when the zone is configured

**AT-3: Fallback Ad Rendering When No Specialized Zones Are Configured**
- Given: No Adsterra or Monetag banner zones are configured, but a default link zone exists
- When: The ad component renders
- Then: A professional-looking sponsored box appears with an "Advertisement" label
- And: A "View Offer" call-to-action links to the default zone destination
- And: The link opens in a new tab with sponsored attribution

**AT-4: Ad Re-loading After Route Navigation**
- Given: The user navigates to a different page and then returns
- When: The ad component re-mounts on the returned page
- Then: Ads are re-injected into the ad slot
- And: No duplicate scripts are injected on the same page view
- And: Previous ad content is cleared before the new ad loads

**AT-5: Mobile Ad Rendering**
- Given: The browser viewport is 640px wide or less (mobile device)
- When: The ad component renders with any network type
- Then: The ad container fills the available width proportionally
- And: The ad creative maintains readability and touch target sizes
- And: No horizontal overflow or layout breakage occurs on the page

**AT-6: Desktop Ad Rendering**
- Given: The browser viewport is wider than 640px (desktop device)
- When: The ad component renders with any network type
- Then: The ad renders at full available width
- And: Proper spacing is maintained around the ad slot
- And: No layout shift occurs that moves other page content

**AT-7: No Ad Conflict With Existing Monetag Scripts**
- Given: The page includes existing Monetag multitag and vignette scripts in the HTML
- When: The ad component mounts and any ad network scripts inject
- Then: No JavaScript errors occur from zone ID conflicts
- And: Both the existing Monetag scripts and the ad component ads load independently
- And: No script injection doubles or interferes with either ad system

**AT-8: SEO Title and Description Uniqueness**
- Given: Each page has search engine optimization data configured
- When: The page loads in a browser or search engine
- Then: The `<title>` tag is unique to that page's content
- And: The `<title>` length is appropriate for search engine display (50-60 characters)
- And: The `<meta name="description">` is unique to that page's content
- And: The description length is appropriate for search engine display (140-160 characters)
- And: No two different pages share the same title or description

**AT-9: SEO Keyword Relevance**
- Given: Each page has keywords configured in the SEO data
- When: Search engines index the page
- Then: The keywords are relevant to the page's actual content and purpose
- And: No keyword stuffing is present (keyword density stays below 5%)
- And: High-traffic pages include terms that users actually search for

**AT-10: Sitemap Consistency**
- Given: The site has been built and a sitemap generated
- When: The sitemap is validated against the XML standard
- Then: Every page with SEO data has a corresponding `<url>` entry
- And: No URL appears in the sitemap without corresponding page support
- And: All URL values use the correct `https://aiworldhub.site` host

**AT-11: Blog Post SEO Optimization**
- Given: A high-traffic blog post page loads
- When: The page renders
- Then: The title includes the target keyword phrase for that post
- And: The description includes a compelling call-to-action
- And: The keywords include a mix of head terms and long-tail variations

**AT-12: Programmatic Prompt Page SEO**
- Given: A programmatic prompt page (e.g., /prompts/:role/:task) loads
- When: The page renders
- Then: SEO data is generated from the role and task definitions
- And: The title and description are unique to that specific role/task combination
- And: Keywords include role-specific and task-specific terms

## Functional Requirements

**FR-1: Enable Adsterra Banner Ads**
- Ad configuration is set to enable the Adsterra network
- A valid Adsterra banner zone ID is configured
- The Adsterra native banner script injects automatically on pages with the ad component
- The ad renders at 300x250 pixel dimensions

**FR-2: Enable Monetag Banner Ads**
- Ad configuration is set to enable the Monetag network
- A valid Monetag banner zone ID is configured
- The Monetag banner script injects automatically on pages with the ad component
- The script tag includes `data-cfasync="false"`

**FR-3: Resolve Ad Network Script Conflicts**
- The existing Monetag multitag and vignette scripts in the HTML coexist with the ad component
- Adsterra and Monetag scripts inject without JavaScript errors
- No double-injection of scripts occurs on the same page
- Cross-script tracking is properly disabled on all external ad scripts

**FR-4: Verify Ad Loading After Page Navigation**
- When a user navigates to a different page and returns, ads re-appear in the ad slot
- Ad content clears before the new ad injects on navigation
- No console errors appear from ad script injection during navigation
- Ads persist correctly across page transitions

**FR-5: Ensure Ads Render Correctly on Mobile Devices**
- The ad container adapts to the mobile viewport and fills available width
- Ad creative maintains readability with appropriate font sizes and touch targets
- No horizontal scroll bar appears on mobile pages where the ad renders
- The "Advertisement" label remains visible and readable on small screens

**FR-6: Ensure Ads Render Correctly on Desktop Devices**
- The ad renders at full width on typical desktop viewport sizes
- Proper spacing surrounds the ad slot, keeping distance from other page content
- No unexpected layout shift occurs when the ad injects or resizes
- The ad creative displays correctly at larger widths without distortion

**FR-7: Fix SEO for Legitimate Organic Growth**
- Each page has a unique, descriptive `<title>` that accurately reflects its content
- Each page has a unique `<meta name="description">` that complements the title
- Keywords on each page are relevant to the actual content, not stuffed
- High-traffic pages target commercial-intent keywords that users search for
- Programmatic prompt pages have unique SEO per role and task combination
- Sitemap includes all pages with SEO data and uses the correct host
- No deceptive SEO practices are used (no cloaking, keyword stuffing, or fake content)

**FR-8: Maintain Policy-Compliant Advertising**
- Ads never use deceptive clicks or forced redirects
- All ad links that open in a new tab use `rel="noopener noreferrer"`
- Sponsored or advertisement content is clearly labeled as such
- No popunder ads that trick users into interacting appear
- Ad configurations comply with the program policies of Adsterra and Monetag

## Success Criteria

**SC-1: Ad Networks Functionally Enabled**
- Adsterra banner ads render on the website without empty slots
- Monetag banner ads render on the website without empty slots
- Both ad networks operate simultaneously without errors

**SC-2: Ad Re-loading Works After Navigation**
- Navigating to a different page and returning causes ads to re-render
- No duplicate script injection errors appear in the console after multiple navigations
- Ads persist correctly across page transitions

**SC-3: Mobile Ad Rendering is Viable**
- Ads render without breaking the mobile layout (viewport ≤ 640px)
- The ad container respects width constraints on small screens
- No horizontal scroll appears on mobile pages where ads render

**SC-4: Desktop Ad Rendering is Viable**
- Ads render correctly at typical desktop viewport widths (≥ 1024px)
- No layout shift occurs caused by ad injection or resizing
- Ad creative scales appropriately at larger viewport widths

**SC-5: SEO Metrics Improve (compared to baseline)**
- The number of indexed pages with optimized titles and descriptions increases by at least 20% compared to the previous baseline
- No duplicate title or description tags exist across the entire site
- Keyword relevance improves for the target high-traffic pages

**SC-6: No Policy Violations**
- Adsterra and Monetag both confirm the configured zones are policy-compliant
- No deceptive click patterns or forced redirects are detected
- All ad content is clearly labeled and transparent to the user

## Assumptions

**A-1: Ad Zone IDs**
- Valid Adsterra banner zone ID will be obtained from the Adsterra dashboard
- Valid Monetag banner zone ID will be obtained from the Monetag dashboard
- These IDs are placeholder values to be filled in after configuration

**A-2: SPA Page Navigation**
- The website uses single-page application navigation where content changes without full page reloads
- The ad component re-mounts when navigating to a new route and re-visiting previous routes
- Ad slot content clears appropriately between navigations

**A-3: SEO Baseline**
- The current SEO data has good route coverage but some titles and descriptions are generic
- Blog posts and programmatic prompt pages need keyword optimization for better search visibility
- The sitemap is generally consistent but may have minor discrepancies after changes

**A-4: No Breaking Changes**
- Existing useful functionality (default link ad zone, raw HTML mode) is preserved
- The existing Monetag multitag and vignette scripts in index.html remain in place
- New Adsterra and Monetag zones are added alongside existing configuration, not replacing it

**A-5: Build Process**
- `npm run build` successfully completes with all changes applied
- Sitemap validation passes after changes
- Prerender generates correct per-route HTML with the updated ads and SEO data

## Key Entities

**Ad Configuration**
- Single source of truth defining which ad networks are enabled and their zone identifiers
- Contains status and zone ID for each network type (Adsterra, Monetag, fallback options)
- Controls which ad behavior renders on the website pages

**SEO Data Per Route**
- Records providing title, description, and keywords for each page on the website
- Used by the page SEO function to provide page-specific search engine optimization
- covers the homepage, all tool pages, blog posts, categories, and programmatic prompt pages

**Ad Component**
- Universal banner ad component that supports multiple ad network types
- Renders differently based on which network is configured and enabled
- Injects the appropriate script or HTML into the ad slot on each page

**Existing Monetag Scripts**
- Multitag and vignette scripts already present in the base HTML file
- Must coexist with any new ad component scripts without conflicts
- Use specific zone IDs that must remain functional

## Notes

- Adsterra and Monetag zone IDs are the primary configuration needed to make the ad networks function
- Script conflict resolution between the existing Monetag scripts and the ad component is critical
- Ad re-loading must work correctly when users navigate between pages in the application
- Only SEO fixes that realistically improve organic traffic are included
- No keyword stuffing, fake content, or deceptive practices are used
- All changes must pass the `npm run build` validation gate, including sitemap validation